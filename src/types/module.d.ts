type moduleStatus = 'running' | 'done' | 'error' | ''

interface ImoduleStatus {
  DailyTasks: {
    MainSiteTasks: {
      login: moduleStatus
      watch: moduleStatus
      coin: moduleStatus
      share: moduleStatus
    }
    LiveTasks: {
      sign: moduleStatus
      appUser: moduleStatus
      medalTasks: {
        danmu: moduleStatus
        like: moduleStatus
        watch: moduleStatus
      }
    }
    OtherTasks: {
      groupSign: moduleStatus
      silverToCoin: moduleStatus
      coinToSilver: moduleStatus
      getYearVipPrivilege: moduleStatus
    }
  }
}

type runAtMoment = 'document-start' | 'document-end' | 'window-onload'

type moduleEmitterEvents = {
  Main: {
    moment: runAtMoment
  }
  BiliInfo: {
    target: string
  }
  DailyTask_LiveTask_AppUserTask: {
    module: string
  }
}

export { moduleStatus, ImoduleStatus, runAtMoment, moduleEmitterEvents }
