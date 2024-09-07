interface ModuleConfig {
  DailyTasks: {
    MainSiteTasks: {
      login: {
        enabled: boolean
        _lastCompleteTime: number
      }
      watch: {
        enabled: boolean
        _lastCompleteTime: number
      }
      coin: {
        enabled: boolean
        num: number
        _lastCompleteTime: number
      }
      share: {
        enabled: boolean
        _lastCompleteTime: number
      }
    }
    LiveTasks: {
      sign: {
        enabled: boolean
        _lastCompleteTime: number
      }
      medalTasks: {
        light: {
          enabled: boolean
          mode: 'like' | 'danmu'
          danmuList: string[]
          _lastCompleteTime: number
        }
        watch: {
          enabled: boolean
          time: number
          _watchingProgress: Record<string, number>
          _lastWatchTime: number
          _lastCompleteTime: number
        }
        isWhiteList: boolean
        roomidList: number[]
      }
    }
    OtherTasks: {
      groupSign: {
        enabled: boolean
        _lastCompleteTime: number
      }
      silverToCoin: {
        enabled: boolean
        _lastCompleteTime: number
      }
      coinToSilver: {
        enabled: boolean
        num: number
        _lastCompleteTime: number
      }
      getYearVipPrivilege: {
        enabled: boolean
        _nextReceiveTime: number
      }
    }
  }
  EnhanceExperience: {
    switchLiveStreamQuality: {
      enabled: boolean
      qualityDesc: string
    }
    banp2p: {
      enabled: boolean
    }
    noReport: {
      enabled: boolean
    }
    noSleep: {
      enabled: boolean
    }
    invisibility: {
      enabled: boolean
    }
  }
  RemoveElement: {
    removePKBox: {
      enabled: boolean
    }
    removeLiveWaterMark: {
      enabled: boolean
    }
    removeShopPopover: {
      enabled: boolean
    }
    removeGameParty: {
      enabled: boolean
    }
    removeGiftPopover: {
      enabled: boolean
    }
    removeMicPopover: {
      enabled: boolean
    }
    removeComboCard: {
      enabled: boolean
    }
    removeRank: {
      enabled: boolean
    }
    removeHeaderStuff: {
      enabled: boolean
    }
    removeFlipView: {
      enabled: boolean
    }
    removeRecommendRoom: {
      enabled: boolean
    }
    removeLiveMosaic: {
      enabled: boolean
    }
  }
}

type MenuIndex =
  | 'MainSiteTasks'
  | 'LiveTasks'
  | 'OtherTasks'
  | 'EnhanceExperience'
  | 'RemoveElement'
  | 'ScriptSettings'

interface UiConfig {
  isCollapse: boolean
  isShowPanel: boolean
  activeMenuIndex: MenuIndex
  panelWidthPercent: number
  medalInfoPanelSortMode: boolean
}

interface Cache {
  lastAliveHeartBeatTime: number
}

export { ModuleConfig, UiConfig, Cache, MenuIndex }
