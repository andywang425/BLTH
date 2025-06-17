import type { LiveData } from '@/library/bili-api/data'

type LiveStatus = 'on' | 'off'

interface PublicMedalFilters {
  whiteBlackList: (medal: LiveData.FansMedalPanel.List) => boolean
}

interface LightTaskMedalFilters {
  levelGt20: (medal: LiveData.FansMedalPanel.List) => boolean
  isLighted: (medal: LiveData.FansMedalPanel.List) => boolean
  livingStatus: (medal: LiveData.FansMedalPanel.List) => LiveStatus
}

interface WatchTaskMedalFilters {
  levelLt20: (medal: LiveData.FansMedalPanel.List) => boolean
}

type MedalsByLivingStatus = Record<LiveStatus, LiveData.FansMedalPanel.List[]>

export { PublicMedalFilters, LightTaskMedalFilters, WatchTaskMedalFilters, MedalsByLivingStatus }
