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
    panelWidthPercent: 45,
    medalInfoPanelIsSortMode: {
      light: false,
      like: false,
      danmu: false,
      watch: false,
    },
  },
  modules: {
    DailyTasks: {
      MainSiteTasks: {
        login: {
          enabled: false,
          _lastCompleteTime: 0,
        },
        watch: {
          enabled: false,
          _lastCompleteTime: 0,
        },
        coin: {
          enabled: false,
          num: 1,
          _lastCompleteTime: 0,
        },
        share: {
          enabled: false,
          _lastCompleteTime: 0,
        },
      },
      LiveTasks: {
        medalTasks: {
          light: {
            enabled: false,
            danmuList: [
              '[dog]',
              '[花]',
              '[妙]',
              '[哇]',
              '[爱]',
              '[大哭]',
              '[笑哭]',
              '[捂脸]',
              '[喝彩]',
              '[大笑]',
              '[惊喜]',
              '[OK]',
              '[汤圆]',
              '[墨镜]',
              `[牛]`,
            ],
            isWhiteList: false,
            roomidList: [],
            _lastCompleteTime: 0,
          },
          like: {
            enabled: false,
            useTargetRounds: false,
            targetRounds: 1,
            waitUntilLiving: false,
            isWhiteList: false,
            roomidList: [],
            _lastCompleteTime: 0,
          },
          danmu: {
            enabled: false,
            danmuList: [
              '(⌒▽⌒)',
              '（￣▽￣）',
              '（◕‿◕✿）',
              '(｀・ω・´)',
              '（ノ￣▽￣）',
              '(･∀･)',
              '(°∀°)ﾉ',
              '╮(￣▽￣)╭',
              '_(:3」∠)_',
              '(^・ω・^ )',
              '(●￣(ｴ)￣●)',
              '(ノ≧∇≦)ノ',
              '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄',
              '←◡←',
              `(●'◡'●)ﾉ♥`,
            ],
            useTargetRounds: false,
            targetRounds: 1,
            onlyWhenNotLiving: false,
            waitUntilNotLiving: false,
            isWhiteList: false,
            roomidList: [],
            _lastCompleteTime: 0,
          },
          watch: {
            enabled: false,
            useTargetRounds: false,
            targetRounds: 1,
            isWhiteList: false,
            roomidList: [],
            _lastCompleteTime: 0,
          },
        },
      },
      OtherTasks: {
        silverToCoin: {
          enabled: false,
          _lastCompleteTime: 0,
        },
        coinToSilver: {
          enabled: false,
          num: 1,
          _lastCompleteTime: 0,
        },
        getYearVipPrivilege: {
          enabled: false,
          _nextReceiveTime: 0,
        },
      },
    },
    EnhanceExperience: {
      switchLiveStreamQuality: {
        enabled: false,
        qualityDesc: '原画',
      },
      banp2p: {
        enabled: false,
      },
      noReport: {
        enabled: false,
      },
      noSleep: {
        enabled: false,
      },
      invisibility: {
        enabled: false,
      },
    },
    RemoveElement: {
      removePKBox: {
        enabled: false,
      },
      removeLiveWaterMark: {
        enabled: false,
      },
      removeShopPopover: {
        enabled: false,
      },
      removeGameParty: {
        enabled: false,
      },
      removeGiftPopover: {
        enabled: false,
      },
      removeMicPopover: {
        enabled: false,
      },
      removeComboCard: {
        enabled: false,
      },
      removeHeaderStuff: {
        enabled: false,
      },
      removeFlipView: {
        enabled: false,
      },
      removeLiveMosaic: {
        enabled: false,
      },
    },
  },
  cache: {
    lastAliveHeartBeatTime: 0,
    mainScriptLocation: '',
  },
}

export default defaultValues
