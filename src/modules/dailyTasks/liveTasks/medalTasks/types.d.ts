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

type TaskJumpType = 'like' | 'sendDanmu' | 'watchLive' | 'feedLight' | 'sendGift'
type WaitStrategy = 'single-probe' | 'refresh-fans-medals'

interface WaitProbeSnapshot {
  createdAt: number
  roomids: number[]
  strategy: WaitStrategy
  isSuccessful: boolean
  liveStatusMap: Map<number, number | null>
  medalMap: Map<number, LiveData.FansMedalPanel.List>
}

interface WaitProbeResult {
  readyMedals: LiveData.FansMedalPanel.List[]
  pendingRoomids: number[]
}

export {
  MedalTaskSharedConfig,
  SharedMedalFilters,
  GroupedMedals,
  TaskJumpType,
  WaitStrategy,
  WaitProbeSnapshot,
  WaitProbeResult,
}
