interface ImoduleConfig {
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
        danmu: {
          enabled: boolean
          list: string[]
          _lastCompleteTime: number
        }
        like: {
          enabled: boolean
          includeHighLevelMedals: boolean
          _lastCompleteTime: number
        }
        watch: {
          enabled: boolean
          time: number
          _watchedSecondsToday: number
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
    removeGiftPopover: {
      enabled: boolean
    }
  }
}

type menuIndex =
  | 'MainSiteTasks'
  | 'LiveTasks'
  | 'OtherTasks'
  | 'EnhanceExperience'
  | 'RemoveElement'

interface IuiConfig {
  isCollapse: boolean
  isShowPanel: boolean
  activeMenuIndex: menuIndex
}

interface Icache {
  lastAliveHeartBeatTime: number
}

export { ImoduleConfig, IuiConfig, Icache, menuIndex }
