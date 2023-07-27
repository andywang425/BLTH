import { IuiConfig, ImoduleConfig, Icache } from '../../types'

interface IdefaultValues {
  ui: IuiConfig
  modules: ImoduleConfig
  cache: Icache
}

const defaultValues: IdefaultValues = {
  ui: {
    isCollapse: false,
    isShowPanel: true,
    activeMenuIndex: 'MainSiteTasks'
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
        danmu: {
          enabled: false,
          list: [
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
        like: {
          enabled: false,
          _lastCompleteTime: 0
        },
        watch: {
          enabled: false,
          time: 70,
          _watchedSecondsToday: 0,
          _lastWatchTime: 0,
          _lastCompleteTime: 0
        },
        appUser: {
          enabled: false,
          _lastCompleteTime: 0
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
        }
      }
    }
  },
  cache: {
    lastAliveHeartBeatTime: 0
  }
}

export default defaultValues
