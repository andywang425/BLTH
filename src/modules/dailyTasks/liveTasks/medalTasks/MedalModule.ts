import BaseModule from '@/modules/BaseModule'
import { useBiliStore, useModuleStore } from '@/stores'
import { watch } from 'vue'
import type {
  MedalTaskSharedConfig,
  SharedMedalFilters,
  TaskJumpType,
  WaitProbeResult,
  WaitProbeSnapshot,
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
  /** 等待开播/下播时单房间探测的间隔 */
  protected static readonly WAIT_POLL_INTERVAL = 120_000
  /** 共享等待探测快照的短期有效时间 */
  private static readonly WAIT_PROBE_SNAPSHOT_TTL = 90_000
  /** 单房间探测时相邻请求间的随机延迟 */
  private static get ROOM_STATUS_PROBE_DYNAMIC_DELAY() {
    return _.random(600, 1000)
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
   * 串行执行获取任务信息请求
   */
  private static taskInfoRequestQueue: Promise<void> = Promise.resolve()
  /** 当前进行中的等待探测 */
  private static sharedWaitProbePromise: Promise<WaitProbeSnapshot> | null = null
  /** 最近一次等待探测快照 */
  private static sharedWaitProbeSnapshot: WaitProbeSnapshot | null = null

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
   * 解析每日任务进度文案 "每日上限 X/Y"
   *
   * @param sub_title API 返回的 sub_title
   * @returns 解析成功返回 `{ current, limit }`，否则返回 `null`
   */
  protected static parseDailyLimit(
    sub_title: string | undefined,
  ): { current: number; limit: number } | null {
    if (!sub_title) return null
    const match = sub_title.match(/(\d+)\s*\/\s*(\d+)/)
    if (!match) return null
    return { current: Number(match[1]), limit: Number(match[2]) }
  }

  /**
   * 按 jump_type 在粉丝勋章任务信息 task_info 中查找任务项
   */
  protected static findTaskInfo(
    task_info: LiveData.GetActivatedMedalInfo.TaskInfo[] | null,
    jump_type: TaskJumpType,
  ): LiveData.GetActivatedMedalInfo.TaskInfo | undefined {
    return task_info?.find((t) => t.jump_type === jump_type)
  }

  /**
   * 从任务 title 中解析数字（如 "点赞30次" → 30，"发弹幕10次" → 10）
   *
   * @returns 解析成功返回数字，否则返回 null
   */
  protected static parseTitleCount(title: string | undefined): number | null {
    if (!title) return null
    const match = title.match(/\d+/)
    if (!match) return null
    return Number(match[0])
  }

  /**
   * 将获取任务信息请求加入全局串行队列
   */
  private static enqueueTaskInfoRequest<T>(requester: () => Promise<T>): Promise<T> {
    const task = MedalModule.taskInfoRequestQueue
      .catch(() => {})
      .then(async () => {
        await sleep(_.random(300, 500))
        return requester()
      })

    MedalModule.taskInfoRequestQueue = task.then(
      () => {},
      () => {},
    )

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
      return useBiliStore().fansMedalsMeta.status === 'loaded'
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

    for (const fetchStatus of fetchers) {
      const liveStatus = await fetchStatus(roomid)
      if (liveStatus !== null) {
        return liveStatus
      }
      await sleep(MedalModule.ROOM_STATUS_PROBE_DYNAMIC_DELAY)
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
   * 判断等待探测快照是否可完全复用
   *
   * 仅成功且未过期，且已覆盖所有待探测房间的快照允许复用
   *
   * @param snapshot 待判断的快照
   * @param roomids 当前待探测的直播间ID列表
   */
  private static canFullyReuseWaitProbeSnapshot(
    snapshot: WaitProbeSnapshot,
    roomids: number[],
  ): boolean {
    if (!snapshot.isSuccessful) {
      return false
    }

    if (!MedalModule.waitProbeSnapshotTimeCheck(snapshot)) {
      return false
    }

    const coveredRoomids = new Set(snapshot.roomids)
    return roomids.every((roomid) => coveredRoomids.has(roomid))
  }

  /**
   * 检查等待探测快照是否在有效期内
   *
   * @param snapshot 待判断的快照
   * @returns 快照在有效期内返回 true，否则返回 false
   */
  private static waitProbeSnapshotTimeCheck(snapshot: WaitProbeSnapshot): boolean {
    return tsm() - snapshot.createdAt < MedalModule.WAIT_PROBE_SNAPSHOT_TTL
  }

  /**
   * 生成一轮新的等待探测快照
   */
  private async createWaitProbeSnapshot(roomids: number[]): Promise<WaitProbeSnapshot> {
    const strategy = this.decideWaitStrategy(roomids.length)
    const medalMap = new Map<number, LiveData.FansMedalPanel.List>()
    const liveStatusMap = new Map<number, number | null>()

    if (strategy === 'refresh-fans-medals') {
      if (!(await this.refreshFansMedals())) {
        return {
          createdAt: tsm(),
          roomids,
          strategy,
          isSuccessful: false,
          liveStatusMap,
          medalMap,
        }
      }

      const latestMedalMap = useBiliStore().filteredFansMedalsMap
      const snapshotRoomids = [...latestMedalMap.keys()]
      // 将所有粉丝勋章数据放入快照，充分利用刷新粉丝勋章得到的数据
      latestMedalMap.forEach((medal, roomid) => {
        medalMap.set(roomid, medal)
        liveStatusMap.set(roomid, medal.room_info.living_status)
      })

      return {
        createdAt: tsm(),
        roomids: snapshotRoomids,
        strategy,
        isSuccessful: true,
        liveStatusMap,
        medalMap,
      }
    }

    const currentMedalMap = useBiliStore().filteredFansMedalsMap

    for (let i = 0; i < roomids.length; i++) {
      const roomid = roomids[i]
      const medal = currentMedalMap.get(roomid)

      if (medal) {
        medalMap.set(roomid, medal)
        liveStatusMap.set(roomid, await this.fetchRoomLiveStatus(roomid))
      }

      if (i < roomids.length - 1) {
        await sleep(MedalModule.ROOM_STATUS_PROBE_DYNAMIC_DELAY)
      }
    }

    return {
      createdAt: tsm(),
      roomids,
      strategy,
      isSuccessful: true,
      liveStatusMap,
      medalMap,
    }
  }

  /**
   * 获取可在多个任务模块之间复用的一轮等待探测快照
   */
  private async getSharedWaitProbeSnapshot(roomids: number[]): Promise<WaitProbeSnapshot> {
    const cachedSnapshot = MedalModule.sharedWaitProbeSnapshot

    if (cachedSnapshot && MedalModule.canFullyReuseWaitProbeSnapshot(cachedSnapshot, roomids)) {
      return cachedSnapshot
    }

    if (MedalModule.sharedWaitProbePromise) {
      const inflightSnapshot = await MedalModule.sharedWaitProbePromise
      if (MedalModule.canFullyReuseWaitProbeSnapshot(inflightSnapshot, roomids)) {
        return inflightSnapshot
      }
    }

    const probePromise = this.createWaitProbeSnapshot(roomids)
    MedalModule.sharedWaitProbePromise = probePromise

    try {
      const snapshot = await probePromise
      MedalModule.sharedWaitProbeSnapshot = snapshot
      return snapshot
    } finally {
      if (MedalModule.sharedWaitProbePromise === probePromise) {
        MedalModule.sharedWaitProbePromise = null
      }
    }
  }

  /**
   * 对等待中的直播间做一轮探测
   *
   * @param roomids 待探测的直播间ID列表
   * @param targetPredicate 直播状态判断函数，返回“是否符合目标状态“
   *
   * @returns 探测结果，包含符合目标状态的粉丝勋章列表和待处理的直播间ID列表
   */
  protected async probeWaitingMedals(
    roomids: number[],
    targetPredicate: (liveStatus: number) => boolean,
  ): Promise<WaitProbeResult> {
    const snapshot = await this.getSharedWaitProbeSnapshot(roomids)
    this.logger.log(
      `待处理房间 ${roomids.length} 个，本轮使用${snapshot.strategy === 'single-probe' ? '单房间探测' : '刷新粉丝勋章'}策略`,
    )

    const readyMedals: LiveData.FansMedalPanel.List[] = []
    const pendingRoomids: number[] = []

    if (!snapshot.isSuccessful) {
      return { readyMedals, pendingRoomids: roomids }
    }

    for (const roomid of roomids) {
      const medal = snapshot.medalMap.get(roomid)

      if (!medal) {
        this.logger.warn(`直播间 ${roomid} 未在粉丝勋章列表中找到，停止等待该房间`)
        continue
      }
      if (!this.SHARED_MEDAL_FILTERS.isLighted(medal)) {
        this.logger.log(`直播间 ${roomid} 对应的粉丝勋章已熄灭，停止等待该房间`)
        continue
      }

      const liveStatus = snapshot.liveStatusMap.get(roomid)

      if (!_.isNil(liveStatus) && targetPredicate(liveStatus)) {
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
   * 完成某粉丝勋章任务后，重新调用 fetchMedalData 检查储蓄亲密度，若存在则提示用户
   */
  protected async logFreeIntimacy(medal: LiveData.FansMedalPanel.List): Promise<void> {
    const data = await this.fetchMedalData(medal.medal.target_id)

    if (data && data.free_intimacy > 0) {
      const reachLimitText = data.reach_free_intimacy_limit ? '（已达到储蓄亲密度上限）' : ''
      this.logger.log(
        `粉丝勋章【${medal.medal.medal_name}】储蓄了 ${data.free_intimacy} 亲密度${reachLimitText}，投喂一个粉丝灯牌即可领取这些亲密度`,
      )
    }
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
        async (newStatus) => {
          if (newStatus === 'done' || newStatus === 'error') {
            unwatch()

            if (lightConfig._lastEffectiveCompleteTime === lightConfig._lastCompleteTime) {
              // 如果点亮熄灭勋章模块确实进行了点亮操作
              // 重新获取粉丝勋章（主要是为了获取最新的点亮状态和直播状态）
              // FansMedals 模块内部做了防重入，因此无需担心会重复获取
              await sleep(MedalModule.WAIT_MEDAL_UPDATE_DELAY)
              moduleStore.rerunModule('Default_FansMedals', true)
            }
            resolve()
          }
        },
      )
    })
  }
}

export default MedalModule
