import BaseModule from '@/modules/BaseModule'
import { useBiliStore, useModuleStore } from '@/stores'
import { watch } from 'vue'
import type {
  MedalTaskSharedConfig,
  SharedMedalFilters,
  TaskJumpType,
  WaitProbeResult,
  WaitStrategy,
} from './types'
import { arrayToMap, sleep } from '@/library/utils'
import type { LiveData } from '@/library/bili-api/data'
import BAPI from '@/library/bili-api'
import { isNowAfter, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import _ from 'lodash'

class MedalModule extends BaseModule {
  /** 最大弹幕补发次数 */
  protected static readonly DANMU_RETRY_LIMIT = 3
  /** 粉丝团升级任务 jump_type 对应的中文文案 */
  private static readonly TASK_ACTION_TEXT_MAP: Record<TaskJumpType, string> = {
    like: '点赞',
    sendDanmu: '发弹幕',
    watchLive: '观看直播',
    feedLight: '投喂粉丝灯牌', // unused
    sendGift: '投喂礼物', // unused
  }
  /** 等待开播/下播时单房间探测的间隔 */
  protected static readonly WAIT_POLL_INTERVAL = 120_000
  /** 单房间探测时相邻请求间的随机延迟 */
  private static get ROOM_STATUS_PROBE_DYNAMIC_DELAY() {
    return _.random(600, 800)
  }
  /** 任务信息请求队列中相邻请求间的随机延迟 */
  private static get TASK_INFO_REQUEST_DYNAMIC_DELAY() {
    return _.random(300, 500)
  }
  /** 等待B站更新粉丝勋章数据的延迟 */
  protected static readonly WAIT_MEDAL_UPDATE_DELAY = 3000
  /** 发弹幕动态间隔时间 */
  protected static get SEND_DANMU_DYNAMIC_INTERVAL() {
    return _.random(6000, 8000)
  }
  /** 点赞动态间隔时间 */
  protected static get LIKE_DYNAMIC_INTERVAL() {
    return _.random(15000, 20000)
  }
  /** 共享的粉丝勋章过滤器 */
  protected readonly SHARED_MEDAL_FILTERS: SharedMedalFilters = {
    // 包含在白名单中或不包含在黑名单中返回true，否则返回false
    meetWhiteOrBlackList: (m) =>
      this.config.isWhiteList
        ? this.config.roomidList.includes(m.room_info.room_id)
        : !this.config.roomidList.includes(m.room_info.room_id),
    // 等级小于120返回true，否则返回false
    levelLt120: (medal) => medal.medal.level < 120,
    // 点亮返回true，否则返回false
    isLighted: (medal) => medal.medal.is_lighted === 1,
    // 直播中返回true，否则返回false
    isLiving: (medal) => medal.room_info.living_status === 1,
  }
  /** 直播间直播状态获取函数列表（获取失败时返回null） */
  private readonly ROOM_LIVE_STATUS_FETCHERS: Array<(roomid: number) => Promise<number | null>> = [
    async (roomid) => {
      try {
        const response = await BAPI.live.getInfoByRoom(roomid)
        this.logger.log(`BAPI.live.getInfoByRoom(${roomid}) response`, response)
        if (response.code === 0) {
          return response.data.room_info.live_status
        }
        this.logger.warn(`BAPI.live.getInfoByRoom(${roomid}) 失败`, response.message)
      } catch (error) {
        this.logger.warn(`BAPI.live.getInfoByRoom(${roomid}) 出错`, error)
      }

      return null
    },
    async (roomid) => {
      try {
        const response = await BAPI.live.getRoomPlayInfo(roomid)
        this.logger.log(`BAPI.live.getRoomPlayInfo(${roomid}) response`, response)
        if (response.code === 0) {
          return response.data.live_status
        }
        this.logger.warn(`BAPI.live.getRoomPlayInfo(${roomid}) 失败`, response.message)
      } catch (error) {
        this.logger.warn(`BAPI.live.getRoomPlayInfo(${roomid}) 出错`, error)
      }

      return null
    },
  ]
  /**
   * 简单限流队列
   *
   * 串行执行获取粉丝团升级任务信息请求
   */
  private static taskInfoRequestQueue: Promise<void> = Promise.resolve()
  /** 粉丝勋章数据在多久内视为新鲜（毫秒） */
  private static readonly RECENT_FETCH_THRESHOLD = 90_000
  /** 进行中的全量刷新粉丝勋章 Promise */
  private static ongoingFullRefreshPromise: Promise<boolean> | null = null
  /** 单房间直播状态探测限流队列 */
  private static roomStatusProbeQueue: Promise<void> = Promise.resolve()

  medalTasksConfig = useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks

  /** 所有粉丝勋章任务的公共配置 */
  declare protected config: MedalTaskSharedConfig

  /**
   * 对粉丝勋章列表进行排序
   *
   * 注意：该方法会修改传入的 medals 数组
   */
  protected sortMedals(medals: LiveData.FansMedalPanel.List[]): void {
    const orderMap = arrayToMap(this.config.roomidList)
    medals.sort((a, b) => orderMap.get(a.room_info.room_id)! - orderMap.get(b.room_info.room_id)!)
  }

  /**
   * 是否需要因跨天而提前停止
   */
  protected shouldStopForCrossDay(): boolean {
    return isNowAfter(23, 55) || isNowBefore(0, 5)
  }

  /**
   * 等待粉丝勋章数据获取完毕
   *
   * @returns 是否获取成功
   */
  protected waitForFansMedals(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const biliStore = useBiliStore()
      if (biliStore.fansMedalsMeta.status === 'loaded') {
        resolve(true)
      } else {
        const unwatch = watch(
          () => biliStore.fansMedalsMeta.status,
          (newValue) => {
            if (newValue === 'loaded') {
              unwatch()
              resolve(true)
            } else if (newValue === 'error') {
              unwatch()
              resolve(false)
            }
          },
        )
      }
    })
  }

  /**
   * 从粉丝团升级任务 sub_title 解析每日任务进度文案 "每日上限 X/Y"
   *
   * @param sub_title API 返回的 sub_title
   * @returns 解析成功返回 `{ current, limit }`，否则返回 `null`
   */
  protected static parseDailyLimit(sub_title?: string): { current: number; limit: number } | null {
    if (!sub_title) return null
    const match = sub_title.match(/(\d+)\s*\/\s*(\d+)/)
    if (!match) return null
    return { current: Number(match[1]), limit: Number(match[2]) }
  }

  /**
   * 按 jump_type 在粉丝团升级任务信息 task_info 中查找任务项
   */
  protected static findTaskInfo(
    task_info: LiveData.GetActivatedMedalInfo.TaskInfo[] | null,
    jump_type: TaskJumpType,
  ): LiveData.GetActivatedMedalInfo.TaskInfo | undefined {
    return task_info?.find((t) => t.jump_type === jump_type)
  }

  /**
   * 从粉丝团升级任务 title 中解析数字（如 "点赞30次" → 30，"发弹幕10次" → 10）
   *
   * @returns 解析成功返回数字，否则返回 null
   */
  protected static parseTitleCount(title?: string): number | null {
    if (!title) return null
    const match = title.match(/\d+/)
    if (!match) return null
    return Number(match[0])
  }

  /**
   * 将获取粉丝团升级任务信息请求加入全局串行队列
   */
  private static enqueueTaskInfoRequest<T>(requester: () => Promise<T>): Promise<T> {
    const task = MedalModule.taskInfoRequestQueue.catch(() => {}).then(() => requester())

    MedalModule.taskInfoRequestQueue = task
      .catch(() => {})
      .then(() => sleep(MedalModule.TASK_INFO_REQUEST_DYNAMIC_DELAY))

    return task
  }

  /**
   * 将单房间直播状态探测请求加入串行限流队列
   */
  private static enqueueRoomStatusProbe<T>(requester: () => Promise<T>): Promise<T> {
    const task = MedalModule.roomStatusProbeQueue.catch(() => {}).then(() => requester())

    MedalModule.roomStatusProbeQueue = task
      .catch(() => {})
      .then(() => sleep(MedalModule.ROOM_STATUS_PROBE_DYNAMIC_DELAY))

    return task
  }

  /**
   * 刷新粉丝勋章列表
   *
   * @returns 是否刷新成功
   */
  protected async refreshFansMedals(): Promise<boolean> {
    const moduleStore = useModuleStore()
    try {
      await moduleStore.rerunModule('Default_FansMedals', true)
      const status = useBiliStore().fansMedalsMeta.status
      return status === 'loading' ? await this.waitForFansMedals() : status === 'loaded'
    } catch (error) {
      this.logger.error('刷新粉丝勋章列表失败', error)
      return false
    }
  }

  /**
   * 以随机顺序尝试多个接口，获取单个直播间的直播状态
   *
   * @returns
   * - `1`：直播中
   * - `0`/`2`：未开播/轮播中
   * - `null`：两个接口都获取失败
   */
  protected async fetchRoomLiveStatus(roomid: number): Promise<number | null> {
    const fetchers = _.shuffle(this.ROOM_LIVE_STATUS_FETCHERS)

    for (let i = 0; i < fetchers.length; i++) {
      const liveStatus = await fetchers[i](roomid)
      if (liveStatus !== null) {
        return liveStatus
      }
      if (i < fetchers.length - 1) {
        await sleep(MedalModule.ROOM_STATUS_PROBE_DYNAMIC_DELAY)
      }
    }

    return null
  }

  /**
   * 计算等待探测策略
   *
   * @param pendingCount 当前待探测的直播间数量
   */
  protected decideWaitStrategy(pendingCount: number): WaitStrategy {
    const totalMedalCount = useBiliStore().filteredFansMedals.length
    const fullRefreshCost = Math.ceil(totalMedalCount / 10)
    return pendingCount <= fullRefreshCost ? 'single-probe' : 'refresh-fans-medals'
  }

  /**
   * 判断粉丝勋章数据是否足够新鲜
   */
  private isMedalDataFresh(): boolean {
    const meta = useBiliStore().fansMedalsMeta
    return (
      meta.status === 'loaded' &&
      tsm() - meta.lastFetchFinishedAt! < MedalModule.RECENT_FETCH_THRESHOLD
    )
  }

  /**
   * 从粉丝勋章 Map 构建探测结果
   *
   * @param roomids 待探测的直播间ID列表
   * @param targetPredicate 直播状态判断函数
   * @param medalMap 粉丝勋章 Map
   * @param probedLiveStatusMap 探测到的直播状态 Map
   * - 为 undefined 时：使用 medal.room_info.living_status
   * - 存在键 roomid 但值为 null 时：表示本轮实时探测失败，继续等待
   */
  private buildResultFromMedalMap(
    roomids: number[],
    targetPredicate: (liveStatus: number) => boolean,
    medalMap: Map<number, LiveData.FansMedalPanel.List>,
    probedLiveStatusMap?: Map<number, number | null>,
  ): WaitProbeResult {
    const readyMedals: LiveData.FansMedalPanel.List[] = []
    const pendingRoomids: number[] = []

    for (const roomid of roomids) {
      const medal = medalMap.get(roomid)

      if (!medal) {
        this.logger.warn(`直播间 ${roomid} 未在粉丝勋章列表中找到，停止等待该房间`)
        continue
      }
      if (!this.SHARED_MEDAL_FILTERS.isLighted(medal)) {
        this.logger.log(`直播间 ${roomid} 对应的粉丝勋章已熄灭，停止等待该房间`)
        continue
      }

      // 是否有探测到的直播状态 Map
      const hasProbedStatus = probedLiveStatusMap !== undefined
      // 直播状态：有直播状态 Map 就从中取，否则使用粉丝勋章 Map 中的值
      const liveStatus = hasProbedStatus
        ? probedLiveStatusMap.get(roomid)
        : medal.room_info.living_status

      if (hasProbedStatus && _.isNil(liveStatus)) {
        this.logger.warn(`直播间 ${roomid} 本轮实时探测失败，继续等待下次检查`)
        pendingRoomids.push(roomid)
      } else if (!_.isNil(liveStatus) && targetPredicate(liveStatus)) {
        readyMedals.push(medal)
      } else {
        pendingRoomids.push(roomid)
      }
    }

    return {
      readyMedals,
      pendingRoomids,
    }
  }

  /**
   * 对等待中的直播间做一轮探测
   *
   * @param roomids 待探测的直播间ID列表
   * @param targetPredicate 直播状态判断函数，返回"是否符合目标状态"
   *
   * @returns 探测结果，包含符合目标状态的粉丝勋章列表和待处理的直播间ID列表
   */
  protected async probeWaitingMedals(
    roomids: number[],
    targetPredicate: (liveStatus: number) => boolean,
  ): Promise<WaitProbeResult> {
    const biliStore = useBiliStore()

    // 如果有进行中的全量刷新，等待其完成
    if (MedalModule.ongoingFullRefreshPromise) {
      this.logger.log('等待进行中的粉丝勋章刷新完成...')
      await MedalModule.ongoingFullRefreshPromise
    }

    // 检查粉丝勋章数据是否新鲜
    if (this.isMedalDataFresh()) {
      this.logger.log('粉丝勋章数据较新，直接使用缓存数据')
      return this.buildResultFromMedalMap(roomids, targetPredicate, biliStore.filteredFansMedalsMap)
    }

    // 数据不新鲜，决定探测策略
    const strategy = this.decideWaitStrategy(roomids.length)
    this.logger.log(
      `待处理房间 ${roomids.length} 个，粉丝勋章数据不新鲜，使用${strategy === 'single-probe' ? '单房间探测' : '刷新粉丝勋章'}策略`,
    )

    if (strategy === 'refresh-fans-medals') {
      const promise = this.refreshFansMedals()
      MedalModule.ongoingFullRefreshPromise = promise
      try {
        await promise
      } finally {
        if (MedalModule.ongoingFullRefreshPromise === promise) {
          MedalModule.ongoingFullRefreshPromise = null
        }
      }

      if (biliStore.fansMedalsMeta.status === 'loaded') {
        return this.buildResultFromMedalMap(
          roomids,
          targetPredicate,
          biliStore.filteredFansMedalsMap,
        )
      }

      return { readyMedals: [], pendingRoomids: roomids }
    }

    // 单房间探测策略
    const currentMedalMap = biliStore.filteredFansMedalsMap
    const probedLiveStatusMap = new Map<number, number | null>()

    for (let i = 0; i < roomids.length; i++) {
      const roomid = roomids[i]
      const medal = currentMedalMap.get(roomid)

      if (medal) {
        probedLiveStatusMap.set(
          roomid,
          await MedalModule.enqueueRoomStatusProbe(() => this.fetchRoomLiveStatus(roomid)),
        )
      }
    }

    return this.buildResultFromMedalMap(
      roomids,
      targetPredicate,
      currentMedalMap,
      probedLiveStatusMap,
    )
  }

  /**
   * 获取指定粉丝勋章的信息
   *
   * 请求会进入全局串行队列，避免短时间内并发触发过多请求
   *
   * @param target_id 主播 uid
   * @returns 成功返回完整 Data，失败返回 null
   */
  protected fetchMedalData(target_id: number): Promise<LiveData.GetActivatedMedalInfo.Data | null> {
    return MedalModule.enqueueTaskInfoRequest(async () => {
      try {
        const response = await BAPI.live.getActivatedMedalInfo(target_id)
        this.logger.log(`BAPI.live.getActivatedMedalInfo(${target_id}) response`, response)
        if (response.code === 0) {
          return response.data
        } else {
          this.logger.error(`BAPI.live.getActivatedMedalInfo(${target_id}) 失败`, response.message)
          return null
        }
      } catch (error) {
        this.logger.error(`BAPI.live.getActivatedMedalInfo(${target_id}) 出错`, error)
        return null
      }
    })
  }

  /**
   * 记录储蓄亲密度信息日志
   */
  private logFreeIntimacyFromData(
    medal: LiveData.FansMedalPanel.List,
    data: LiveData.GetActivatedMedalInfo.Data,
  ): void {
    if (data.free_intimacy > 0) {
      const reachLimitText = data.reach_free_intimacy_limit ? '（已达到储蓄亲密度上限）' : ''
      this.logger.log(
        `粉丝勋章【${medal.medal.medal_name}】储蓄了 ${data.free_intimacy} 亲密度${reachLimitText}，投喂一个粉丝灯牌即可领取这些亲密度`,
      )
    }
  }

  /**
   * 等待B站更新任务状态后，重新获取粉丝团升级任务信息确认任务是否真的完成
   *
   * @returns 任务实际是否完成
   */
  protected async confirmTaskCompletedAfterUpdate(
    medal: LiveData.FansMedalPanel.List,
    jump_type: TaskJumpType,
  ): Promise<boolean> {
    await sleep(MedalModule.WAIT_MEDAL_UPDATE_DELAY)

    const actionText = MedalModule.TASK_ACTION_TEXT_MAP[jump_type]
    const data = await this.fetchMedalData(medal.medal.target_id)
    if (!data) {
      this.logger.error(
        `粉丝勋章【${medal.medal.medal_name}】${actionText}后，无法获取最新粉丝团升级任务信息确认任务是否完成，默认已完成`,
      )
      return true
    }

    this.logFreeIntimacyFromData(medal, data)

    const item = MedalModule.findTaskInfo(data.task_info, jump_type)
    if (!item) {
      this.logger.error(
        `粉丝勋章【${medal.medal.medal_name}】${actionText}后，最新粉丝团升级任务信息中缺少对应任务，默认已完成`,
      )
      return true
    }

    if (!item.is_done) {
      this.logger.warn(
        `粉丝勋章【${medal.medal.medal_name}】已执行 ${actionText} 任务，但B站仍认为该任务未完成（实际进度：${item.sub_title}），下次运行会继续尝试`,
      )
      return false
    }

    return true
  }

  /**
   * 若点亮熄灭勋章任务已启用且今天未完成，等待其结束后再继续
   *
   * 用于让 点赞/发弹幕/观看直播 在 点亮熄灭勋章 任务完成后再执行
   */
  protected async waitForLightTask(): Promise<void> {
    const lightConfig = this.medalTasksConfig.light
    if (!lightConfig.enabled) return
    if (isTimestampToday(lightConfig._lastCompleteTime)) return

    const moduleStore = useModuleStore()
    const lightStatus = moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.light
    if (lightStatus === 'done' || lightStatus === 'error') return

    this.logger.log('等待点亮熄灭勋章任务完成后再执行')

    return new Promise<void>((resolve) => {
      const unwatch = watch(
        () => moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.light,
        (newStatus) => {
          if (newStatus === 'done' || newStatus === 'error') {
            unwatch()
            resolve()
          }
        },
      )
    })
  }
}

export default MedalModule
