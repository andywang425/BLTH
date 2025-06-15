import type { LiveData } from '@/library/bili-api/data'

type LiveStatus = 'on' | 'off'

interface PublicMedalFilters {
  whiteBlackList: (medal: LiveData.FansMedalPanel.List) => boolean
}

interface LightTaskMedalFilters {
  level: (medal: LiveData.FansMedalPanel.List) => boolean
  isLighted: (medal: LiveData.FansMedalPanel.List) => boolean
  livingStatus: (medal: LiveData.FansMedalPanel.List) => LiveStatus
}

interface WatchTaskMedalFilters {
  level: (medal: LiveData.FansMedalPanel.List) => boolean
}

type MedalsByLivingStatus = Record<LiveStatus, LiveData.FansMedalPanel.List[]>

export { PublicMedalFilters, LightTaskMedalFilters, WatchTaskMedalFilters, MedalsByLivingStatus }
