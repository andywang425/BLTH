import BaseModule from '@/modules/BaseModule'
import { useBiliStore, useModuleStore } from '@/stores'
import { watch } from 'vue'
import type {
  LiveStatusSnapshot,
  MedalTaskSharedConfig,
  PreExecuteVerdict,
  RequestQueueKey,
  SharedMedalFilters,
  TaskJumpType,
  AfterExecutionAction,
  BatchExecutionResult,
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
  /**
   * 通过获取指定页的粉丝勋章，探测目标直播间的直播状态
   *
   * @param page 粉丝勋章页码
   * @param roomid 目标直播间ID
   * @returns 直播状态和是否可以继续获取下一页的粉丝勋章
   */
  private async fetchMedalPageForLiveStatus(
    page: number,
    roomid: number,
  ): Promise<{ status: number | null; canTryNextPage: boolean }> {
    try {
      const response = await BAPI.live.fansMedalPanel(page)
      this.logger.log(`BAPI.live.fansMedalPanel(${page}) response`, response)
      let status = null

      if (response.code === 0) {
        const medals = [...response.data.special_list, ...response.data.list]
        const observedAt = tsm()

        for (const medal of medals) {
          const medalRoomid = medal.room_info.room_id
          const medalLiveStatus = medal.room_info.living_status

          MedalModule.liveStatusSnapshots.set(medalRoomid, {
            liveStatus: medalLiveStatus,
            observedAt,
          })

          if (medalRoomid === roomid) {
            status = medalLiveStatus
          }
        }

        const currentPage = response.data.page_info.current_page
        const totalPage = response.data.page_info.total_page
        const hasUnlightedMedal = medals.some((m) => !m.medal.is_lighted)

        return {
          status,
          // 目前B站的粉丝勋章排序规则为：点亮的勋章排在前面，未点亮的排在后面，然后分别再按等级由高到低排序
          // 如果当前页上有未点亮的粉丝勋章，后面的页就都是未点亮的勋章
          // 而点赞、发弹幕任务都是给点亮的勋章做的
          // 因此如果当前页上有未点亮的粉丝勋章，就没必要再看后面的页了
          canTryNextPage: currentPage < totalPage && !hasUnlightedMedal,
        }
      }
      this.logger.warn(`BAPI.live.fansMedalPanel(${page}) 失败`, response.message)
    } catch (error) {
      this.logger.warn(`BAPI.live.fansMedalPanel(${page}) 出错`, error)
    }
    return { status: null, canTryNextPage: false }
  }
  /**
   * 直播间直播状态获取函数列表（获取失败时返回null）
   *
   * - 特别说明：第一个 fetcher 通过粉丝勋章API获取直播状态，一次获取一页（10个）房间的直播状态并全部写入状态快照（但是仅返回目标房间的直播状态）
   */
  private readonly ROOM_LIVE_STATUS_FETCHERS: Array<(roomid: number) => Promise<number | null>> = [
    async (roomid) => {
      // 计算 roomid 对应的粉丝勋章在第几页
      const roomids = useBiliStore().filteredFansMedalsMap.keys()
      let index = -1
      for (const r of roomids) {
        index++
        if (r === roomid) {
          break
        }
      }

      // 获取粉丝勋章 API 每页返回 10 个勋章，页码从 1 开始
      const page = Math.floor(index / 10) + 1

      const { status, canTryNextPage } = await this.fetchMedalPageForLiveStatus(page, roomid)

      if (status !== null) {
        return status
      }

      if (canTryNextPage) {
        await sleep(_.random(300, 500))
        const { status } = await this.fetchMedalPageForLiveStatus(page + 1, roomid)

        return status
      }

      return null
    },
    async (roomid) => {
      try {
        const response = await BAPI.live.getInfoByRoom(roomid)
        this.logger.log(`BAPI.live.getInfoByRoom(${roomid}) response`, response)
        if (response.code === 0) {
          const liveStatus = response.data.room_info.live_status
          MedalModule.liveStatusSnapshots.set(roomid, { liveStatus, observedAt: tsm() })
          return liveStatus
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
          const liveStatus = response.data.live_status
          MedalModule.liveStatusSnapshots.set(roomid, { liveStatus, observedAt: tsm() })
          return liveStatus
        }
        this.logger.warn(`BAPI.live.getRoomPlayInfo(${roomid}) 失败`, response.message)
      } catch (error) {
        this.logger.warn(`BAPI.live.getRoomPlayInfo(${roomid}) 出错`, error)
      }

      return null
    },
  ]
  /**
   * 串行执行请求的限流队列
   */
  private static readonly requestQueues: Record<RequestQueueKey, Promise<void>> = {
    taskInfo: Promise.resolve(),
    roomStatus: Promise.resolve(),
  }
  /**
   * 直播状态快照在多久内视为新鲜、可直接复用（毫秒）
   *
   * - 本阈值控制「执行前校验」是否需要做一次直播状态探测
   */
  private static readonly LIVE_STATUS_SNAPSHOT_FRESHNESS_THRESHOLD = 30_000
  /**
   * 直播状态快照（key：直播间号）
   */
  private static readonly liveStatusSnapshots = new Map<number, LiveStatusSnapshot>()
  /**
   * 用粉丝勋章列表初始化直播状态快照
   */
  protected static initSnapshotsWithFansMedalsData(): void {
    const biliStore = useBiliStore()
    // 把开始获取粉丝勋章列表的时间作为直播状态快照的观测时间
    const observedAt = biliStore.fansMedalsMeta.lastFetchStartedAt!

    for (const medal of biliStore.filteredFansMedals) {
      const snapshot = MedalModule.liveStatusSnapshots.get(medal.room_info.room_id)

      if (!snapshot || snapshot.observedAt < observedAt) {
        MedalModule.liveStatusSnapshots.set(medal.room_info.room_id, {
          liveStatus: medal.room_info.living_status,
          observedAt,
        })
      }
    }
  }
  /**
   * 将异步请求加入串行队列，相邻请求之间加入随机延迟
   */
  private static enqueueRequest<T>(
    queueKey: RequestQueueKey,
    getDelay: () => Promise<void>,
    requester: () => Promise<T>,
  ): Promise<T> {
    const task = MedalModule.requestQueues[queueKey].catch(() => {}).then(() => requester())
    MedalModule.requestQueues[queueKey] = task.catch(() => {}).then(() => getDelay())
    return task
  }

  /**
   * 将获取粉丝团升级任务信息请求加入全局串行队列
   */
  private static enqueueTaskInfoRequest<T>(requester: () => Promise<T>): Promise<T> {
    return MedalModule.enqueueRequest(
      'taskInfo',
      () => sleep(MedalModule.TASK_INFO_REQUEST_DYNAMIC_DELAY),
      requester,
    )
  }

  /**
   * 将单房间直播状态探测请求加入串行限流队列
   */
  private static enqueueRoomStatusProbe<T>(requester: () => Promise<T>): Promise<T> {
    return MedalModule.enqueueRequest(
      'roomStatus',
      () => sleep(MedalModule.ROOM_STATUS_PROBE_DYNAMIC_DELAY),
      requester,
    )
  }

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
  protected static shouldStopForCrossDay(): boolean {
    return isNowAfter(23, 55) || isNowBefore(0, 5)
  }

  /**
   * 等待粉丝勋章数据获取完毕
   *
   * @returns 是否获取成功
   */
  protected static waitForFansMedals(): Promise<boolean> {
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
   * 点赞
   *
   * @param medal 粉丝勋章
   * @param click_time 点赞次数
   *
   * @returns 是否点赞成功
   */
  protected async like(medal: LiveData.FansMedalPanel.List, click_time: number): Promise<boolean> {
    const room_id = medal.room_info.room_id
    const target_id = medal.medal.target_id
    const nick_name = medal.anchor_info.nick_name
    const medal_name = medal.medal.medal_name
    const logMessage = `粉丝勋章【${medal_name}】 给主播【${nick_name}】（UID：${target_id}）的直播间（${room_id}）点赞 ${click_time} 次`

    try {
      const response = await BAPI.live.likeReport(room_id, target_id, click_time)
      this.logger.log(`BAPI.live.likeReport(${room_id}, ${target_id}, ${click_time})`, response)
      if (response.code === 0) {
        this.logger.log(`点赞 ${logMessage} 成功`)
        return true
      } else {
        this.logger.error(`点赞 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`点赞 ${logMessage} 出错`, error)
    }

    return false
  }

  /**
   * 发弹幕
   *
   * @param medal 粉丝勋章
   * @param danmu 弹幕内容
   *
   * @returns 是否发送成功
   */
  protected async sendDanmu(medal: LiveData.FansMedalPanel.List, danmu: string): Promise<boolean> {
    const room_id = medal.room_info.room_id
    const target_id = medal.medal.target_id
    const nick_name = medal.anchor_info.nick_name
    const medal_name = medal.medal.medal_name
    const logMessage = `粉丝勋章【${medal_name}】 在主播【${nick_name}】（UID：${target_id}）的直播间（${room_id}）发送弹幕 ${danmu}`

    try {
      const response = await BAPI.live.sendMsg(danmu, room_id)
      this.logger.log(`BAPI.live.sendMsg(${danmu}, ${room_id})`, response)
      if (response.code === 0) {
        if (response.msg === '') {
          this.logger.log(`发弹幕 ${logMessage} 成功`)
          return true
        } else if (response.msg === 'k') {
          this.logger.warn(`发弹幕 ${logMessage} 异常，弹幕可能包含屏蔽词`)
        } else if (response.msg === 'f') {
          this.logger.warn(`发弹幕 ${logMessage} 异常，弹幕被过滤`)
        } else {
          this.logger.warn(`发弹幕 ${logMessage} 异常，未知错误：${response.msg}`)
        }
      } else {
        this.logger.error(`发弹幕 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`发弹幕 ${logMessage} 出错`, error)
    }

    return false
  }

  /**
   * 从粉丝团升级任务 sub_title 解析每日任务进度文案 "每日上限 X/Y"
   *
   * @param sub_title API 返回的 sub_title
   * @returns 解析成功返回当前任务进度和任务上限，否则返回 `null`
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
    task_info: LiveData.GetActivatedMedalInfo.TaskInfo[],
    jump_type: TaskJumpType,
  ): LiveData.GetActivatedMedalInfo.TaskInfo | undefined {
    return task_info?.find((t) => t.jump_type === jump_type)
  }

  /**
   * 从粉丝团升级任务 title 中解析数字（如 "点赞30次" → 30，"发弹幕10次" → 10）
   *
   * @returns 解析成功返回数字，否则返回 null
   */
  protected static parseTitleCount(title: string): number | null {
    if (!title) return null
    const match = title.match(/\d+/)
    if (!match) return null
    return Number(match[0])
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
      return status === 'loading' ? await MedalModule.waitForFansMedals() : status === 'loaded'
    } catch (error) {
      this.logger.error('刷新粉丝勋章列表失败', error)
      return false
    }
  }

  /**
   * 获取单个直播间的直播状态
   *
   * - 默认以随机顺序尝试多个接口
   *
   * @param roomid 直播间号
   * @param preferMedalAPI 是否优先使用粉丝勋章API（其余接口仍随机），默认 false
   *
   * @returns
   * - `1`：直播中
   * - `0`/`2`：未开播/轮播中
   * - `null`：所有接口都获取失败
   */
  private async fetchRoomLiveStatus(
    roomid: number,
    preferMedalAPI = false,
  ): Promise<number | null> {
    const fetchers = preferMedalAPI
      ? [this.ROOM_LIVE_STATUS_FETCHERS[0], ..._.shuffle(this.ROOM_LIVE_STATUS_FETCHERS.slice(1))]
      : _.shuffle(this.ROOM_LIVE_STATUS_FETCHERS)

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
   * 解析直播间当前的直播状态（执行前校验使用）
   *
   * - 快照仍新鲜：直接复用
   * - 快照过期或不存在：探测并更新快照
   *
   * @param roomid 直播间号
   * @param preferMedalAPI 是否优先使用粉丝勋章API获取直播状态，默认 false
   *
   * @returns 直播状态；探测失败时返回 null
   */
  private async resolveLiveStatus(roomid: number, preferMedalAPI = false): Promise<number | null> {
    const snapshot = MedalModule.liveStatusSnapshots.get(roomid)
    if (
      snapshot &&
      tsm() - snapshot.observedAt < MedalModule.LIVE_STATUS_SNAPSHOT_FRESHNESS_THRESHOLD
    ) {
      return snapshot.liveStatus
    }

    return await MedalModule.enqueueRoomStatusProbe(() =>
      this.fetchRoomLiveStatus(roomid, preferMedalAPI),
    )
  }

  /**
   * 执行前直播状态校验
   *
   * @param roomid 直播间号
   * @param targetPredicate 目标状态判断函数
   * @param preferMedalAPI 是否优先使用粉丝勋章API获取直播状态，默认 false
   *
   * @returns 校验结论
   */
  protected async preExecuteVerify(
    roomid: number,
    targetPredicate: (liveStatus: number) => boolean,
    preferMedalAPI = false,
  ): Promise<PreExecuteVerdict> {
    const liveStatus = await this.resolveLiveStatus(roomid, preferMedalAPI)

    if (liveStatus === null) {
      // 探测失败
      return 'error'
    }

    return targetPredicate(liveStatus) ? 'pass' : 'fail'
  }

  /**
   * 遍历一轮等待中的直播间，命中目标状态后都立即执行该房间任务
   *
   * @param roomids 待探测的直播间ID列表
   * @param targetPredicate 目标状态判断函数
   * @param runOne 执行单个直播间任务的回调（跳过执行前直播状态校验）
   */
  protected async runWaitingRound(
    roomids: number[],
    targetPredicate: (liveStatus: number) => boolean,
    runOne: (
      medal: LiveData.FansMedalPanel.List,
    ) => Promise<Exclude<AfterExecutionAction, 'requeue'>>,
  ): Promise<BatchExecutionResult> {
    const biliStore = useBiliStore()

    this.logger.log(`开始探测等待中的直播间，待探测直播间数量：${roomids.length}`, { roomids })

    const medalMap = biliStore.filteredFansMedalsMap
    const requeueRoomids: number[] = []
    let markUncompleted = false

    for (let i = 0; i < roomids.length; i++) {
      if (MedalModule.shouldStopForCrossDay()) {
        this.logger.log('即将或刚刚发生跨天，不再等待剩余直播间，提早结束本轮任务')
        return { stop: true, markUncompleted: true }
      }

      const roomid = roomids[i]
      const medal = medalMap.get(roomid)

      if (!medal) {
        this.logger.error(`直播间 ${roomid} 未在粉丝勋章列表中找到，停止等待该房间`)
        continue
      }

      const target_id = medal.medal.target_id
      const nick_name = medal.anchor_info.nick_name
      const medal_name = medal.medal.medal_name

      // 遍历等待中的房间时优先用粉丝勋章API，一次获取一页（10个）房间的直播状态
      // 因为在这种情况下房间直播状态不符合预期的可能性大，经常会连续判断多个房间的直播状态，能复用之前的探测结果
      // 而在给第一批房间执行任务时，直播状态大概率正确，
      // 执行完一个房间的任务后，先前获取的直播状态数据多半（具体概率和目标轮次相关）已经不新鲜了，又要重新探测直播状态，
      // 所以没必要优先使用粉丝勋章API获取多个房间的直播状态
      const verdict = await this.preExecuteVerify(roomid, targetPredicate, true)

      if (verdict !== 'pass') {
        if (verdict === 'error') {
          this.logger.error(
            `粉丝勋章【${medal_name}】 无法获取主播【${nick_name}】（UID：${target_id}，直播间：${roomid}）的直播状态，回到等待队列；可能遭遇风控，休眠 5 分钟再继续`,
          )
          await sleep(300e3)
        }

        requeueRoomids.push(roomid)
        continue
      }

      this.logger.log(
        `粉丝勋章【${medal_name}】 主播【${nick_name}】（UID：${target_id}）的直播间 ${roomid} 已达到目标状态，立即执行`,
      )
      const action = await runOne(medal)

      if (action === 'stop' || action === 'stopAndMarkUncompleted') {
        return { stop: true, markUncompleted: action === 'stopAndMarkUncompleted' }
      } else if (action === 'markUncompleted') {
        markUncompleted = true
      }
    }

    return { markUncompleted, requeueRoomids }
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
   * @param medal 粉丝勋章
   * @param jump_type 任务类型
   * @param requiredRounds 要求完成的目标轮次（仅"完成目标轮次"模式下需要传入）
   * @returns 任务实际是否完成
   */
  protected async confirmTaskCompletedAfterUpdate(
    medal: LiveData.FansMedalPanel.List,
    jump_type: TaskJumpType,
    requiredRounds?: number,
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

    if (item.is_done) return true

    // "完成目标轮次"模式下，即使B站标为未完成，只要达到目标轮次也视为完成
    if (requiredRounds !== undefined) {
      const parsed = MedalModule.parseDailyLimit(item.sub_title)
      if (parsed && parsed.current >= requiredRounds) {
        this.logger.log(
          `粉丝勋章【${medal.medal.medal_name}】已达到目标轮次 ${requiredRounds}（实际进度：${item.sub_title}），视为完成`,
        )
        return true
      }
    }

    this.logger.warn(
      `粉丝勋章【${medal.medal.medal_name}】已执行 ${actionText} 任务，但B站仍认为该任务未完成（实际进度：${item.sub_title}），下次运行会继续尝试`,
    )
    return false
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
