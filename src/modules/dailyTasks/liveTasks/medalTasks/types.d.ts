import type { LiveData } from '@/library/bili-api/data'
import type { ModuleConfig } from '@/types'

type _MedalTasks = ModuleConfig['DailyTasks']['LiveTasks']['medalTasks']

type MedalTaskSharedConfig =
  | _MedalTasks['light']
  | _MedalTasks['like']
  | _MedalTasks['danmu']
  | _MedalTasks['watch']

interface SharedMedalFilters {
  meetWhiteOrBlackList: (medal: LiveData.FansMedalPanel.List) => boolean
  levelLt120: (medal: LiveData.FansMedalPanel.List) => boolean
  isLighted: (medal: LiveData.FansMedalPanel.List) => boolean
  isLiving: (medal: LiveData.FansMedalPanel.List) => boolean
}

type GroupedMedals<K extends string> = Record<K, LiveData.FansMedalPanel.List[]>

type RequestQueueKey = 'taskInfo' | 'roomStatus'
type TaskJumpType = 'like' | 'sendDanmu' | 'watchLive' | 'feedLight' | 'sendGift'

/** 最近一次观测到的直播间直播状态样本 */
interface LiveStatusSnapshot {
  /** 直播状态：1 直播中，0/2 未开播/轮播 */
  liveStatus: number
  /** 观测到该状态的时刻（毫秒时间戳） */
  observedAt: number
}

/**
 * 执行前直播状态校验结论
 *
 * - `pass`：符合目标状态
 * - `fail`：不符合目标状态
 * - `error`：探测失败
 */
type PreExecuteVerdict = 'pass' | 'fail' | 'error'

/** 单个直播间任务的执行结果 */
interface TaskExecutionResult {
  /** 是否因跨天等原因中断 */
  interrupted: boolean
  /** 是否确认任务已完成 */
  verifiedCompleted: boolean
  /** 执行前直播状态校验未通过，需要重新回到等待队列（仅 waitUntil* 开启时） */
  requeue?: boolean
}

/** 顺序执行多个直播间任务的结果 */
interface BatchExecutionResult {
  interrupted: boolean
  verifiedCompleted: boolean
  /** 执行前校验未通过、需要回到等待队列的直播间ID */
  requeueRoomids: number[]
}

/** 一轮等待轮询的执行结果 */
interface WaitRoundResult {
  interrupted: boolean
  verifiedCompleted: boolean
  /** 本轮结束后仍需继续等待的直播间ID */
  pendingRoomids: number[]
}

interface LightPathExecutionResult {
  /** 尝试点亮过的粉丝勋章列表 */
  attemptedMedals: LiveData.FansMedalPanel.List[]
  /** 因为直播状态不对被跳过的粉丝勋章列表 */
  skippedByStatusMedals: LiveData.FansMedalPanel.List[]
}

export {
  MedalTaskSharedConfig,
  SharedMedalFilters,
  GroupedMedals,
  RequestQueueKey,
  TaskJumpType,
  LiveStatusSnapshot,
  PreExecuteVerdict,
  TaskExecutionResult,
  BatchExecutionResult,
  WaitRoundResult,
  LightPathExecutionResult,
}
