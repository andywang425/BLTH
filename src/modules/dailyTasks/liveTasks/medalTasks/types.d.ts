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

/** 直播间直播状态快照 */
interface LiveStatusSnapshot {
  /** 直播状态：1 直播中，0/2 未开播/轮播 */
  liveStatus: number
  /** 观测到该状态的时刻（毫秒时间戳） */
  observedAt: number
}

/**
 * 直播间任务执行前直播状态校验结论
 *
 * - `pass`：符合目标状态
 * - `fail`：不符合目标状态
 * - `error`：探测失败
 */
type PreExecuteVerdict = 'pass' | 'fail' | 'error'

/**
 * 直播间任务执行后操作
 *
 * - `stop`：终止后续直播间任务
 * - `markUncompleted`：把当前任务（点赞/发弹幕）标记为未完成
 * - `stopAndMarkUncompleted`：终止后续直播间任务并且把当前任务标记为未完成
 * - `requeue`：把直播间放到等待队列
 * - `skipSleep`：跳过执行下一个直播间任务之间的等待时间
 * - `null`：无操作
 */
type AfterExecutionAction =
  | 'stop'
  | 'markUncompleted'
  | 'stopAndMarkUncompleted'
  | 'requeue'
  | 'skipSleep'
  | null

/** 直播间任务批量执行结果 */
interface BatchExecutionResult {
  stop?: boolean
  markUncompleted?: boolean
  /** 放到等待队列的直播间id列表 */
  requeueRoomids?: number[]
}

export {
  MedalTaskSharedConfig,
  SharedMedalFilters,
  GroupedMedals,
  RequestQueueKey,
  TaskJumpType,
  LiveStatusSnapshot,
  PreExecuteVerdict,
  AfterExecutionAction,
  BatchExecutionResult,
}
