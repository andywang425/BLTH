import type { LiveData } from '@/library/bili-api/data'

type LiveStatus = 'on' | 'off'

interface PublicMedalFilters {
  whiteBlackList: (medal: LiveData.FansMedalPanel.List) => boolean
  levelLt120: (medal: LiveData.FansMedalPanel.List) => boolean
}

interface LightTaskMedalFilters {
  isLighted: (medal: LiveData.FansMedalPanel.List) => boolean
  livingStatus: (medal: LiveData.FansMedalPanel.List) => LiveStatus
}

type MedalsByLivingStatus = Record<LiveStatus, LiveData.FansMedalPanel.List[]>

export { PublicMedalFilters, LightTaskMedalFilters, MedalsByLivingStatus }
