type ModuleStatusTypes = 'running' | 'done' | 'error' | ''

interface ModuleStatus {
  DailyTasks: {
    MainSiteTasks: {
      login: ModuleStatusTypes
      watch: ModuleStatusTypes
      coin: ModuleStatusTypes
      share: ModuleStatusTypes
    }
    LiveTasks: {
      sign: ModuleStatusTypes
      medalTasks: {
        light: ModuleStatusTypes
        watch: ModuleStatusTypes
      }
    }
    OtherTasks: {
      groupSign: ModuleStatusTypes
      silverToCoin: ModuleStatusTypes
      coinToSilver: ModuleStatusTypes
      getYearVipPrivilege: ModuleStatusTypes
    }
  }
}

type RunAtMoment =
  | 'document-start'
  | 'document-head'
  | 'document-body'
  | 'document-end'
  | 'window-load'

type OnFrameTypes = 'all' | 'target' | 'top'

type IsOnTargetFrameTypes = 'unknown' | 'yes'

type ModuleEmitterEvents = {
  Default_FansMedals: {
    module: string
  }
}

export {
  ModuleStatusTypes,
  ModuleStatus,
  RunAtMoment,
  ModuleEmitterEvents,
  OnFrameTypes,
  IsOnTargetFrameTypes
}
