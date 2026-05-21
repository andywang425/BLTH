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

export { MedalTaskSharedConfig, SharedMedalFilters }
