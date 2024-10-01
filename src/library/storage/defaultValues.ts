import type { UiConfig, ModuleConfig, Cache } from '@/types'

interface DefaultValues {
  ui: UiConfig
  modules: ModuleConfig
  cache: Cache
}

const defaultValues: DefaultValues = {
  ui: {
    isCollapse: false,
    isShowPanel: true,
    activeMenuIndex: 'MainSiteTasks',
    panelWidthPercent: 40,
    medalInfoPanelSortMode: false
  },
  modules: {
    DailyTasks: {
      MainSiteTasks: {
        login: {
          enabled: false,
          _lastCompleteTime: 0
        },
        watch: {
          enabled: false,
          _lastCompleteTime: 0
        },
        coin: {
          enabled: false,
          num: 1,
          _lastCompleteTime: 0
        },
        share: {
          enabled: false,
          _lastCompleteTime: 0
        }
      },
      LiveTasks: {
        sign: {
          enabled: false,
          _lastCompleteTime: 0
        },
        medalTasks: {
          light: {
            enabled: false,
            mode: 'danmu',
            danmuList: [
              '(⌒▽⌒)',
              '（￣▽￣）',
              '(=・ω・=)',
              '(｀・ω・´)',
              '(〜￣△￣)〜',
              '(･∀･)',
              '(°∀°)ﾉ',
              '╮(￣▽￣)╭',
              '_(:3」∠)_',
              '(^・ω・^ )',
              '(●￣(ｴ)￣●)',
              'ε=ε=(ノ≧∇≦)ノ',
              '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄',
              '←◡←',
              `(●'◡'●)ﾉ♥`
            ],
            _lastCompleteTime: 0
          },
          watch: {
            enabled: false,
            time: 25,
            _watchingProgress: {},
            _lastWatchTime: 0,
            _lastCompleteTime: 0
          },
          isWhiteList: false,
          roomidList: []
        }
      },
      OtherTasks: {
        groupSign: {
          enabled: false,
          _lastCompleteTime: 0
        },
        silverToCoin: {
          enabled: false,
          _lastCompleteTime: 0
        },
        coinToSilver: {
          enabled: false,
          num: 1,
          _lastCompleteTime: 0
        },
        getYearVipPrivilege: {
          enabled: false,
          _nextReceiveTime: 0
        }
      }
    },
    EnhanceExperience: {
      switchLiveStreamQuality: {
        enabled: false,
        qualityDesc: '原画'
      },
      banp2p: {
        enabled: false
      },
      noReport: {
        enabled: false
      },
      noSleep: {
        enabled: false
      },
      invisibility: {
        enabled: false
      }
    },
    RemoveElement: {
      removePKBox: {
        enabled: false
      },
      removeLiveWaterMark: {
        enabled: false
      },
      removeShopPopover: {
        enabled: false
      },
      removeGameParty: {
        enabled: false
      },
      removeGiftPopover: {
        enabled: false
      },
      removeMicPopover: {
        enabled: false
      },
      removeComboCard: {
        enabled: false
      },
      removeRank: {
        enabled: false
      },
      removeHeaderStuff: {
        enabled: false
      },
      removeFlipView: {
        enabled: false
      },
      removeRecommendRoom: {
        enabled: false
      },
      removeLiveMosaic: {
        enabled: false
      }
    }
  },
  cache: {
    lastAliveHeartBeatTime: 0
  }
}

export default defaultValues
