type ModuleStatusTypes =
  // 正在运行中
  | 'running'
  // 任务已完成
  | 'done'
  // 发生导致任务彻底无法完成的错误
  | 'error'
  // 模块刚刚开始运行，还没获得一个状态
  // OR 该模块正在等待即将到来的下一次运行
  | ''

interface ModulesNeedStatus<T> {
  DailyTasks: {
    MainSiteTasks: {
      login: T
      watch: T
      coin: T
      share: T
    }
    LiveTasks: {
      medalTasks: {
        light: T
        watch: T
      }
    }
    OtherTasks: {
      groupSign: T
      silverToCoin: T
      coinToSilver: T
      getYearVipPrivilege: T
    }
  }
}

type ModuleStatus = ModulesNeedStatus<ModuleStatusTypes>

type ModuleReset = ModulesNeedStatus<() => void>

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
  ModulesNeedStatus,
  ModuleStatus,
  ModuleReset,
  RunAtMoment,
  ModuleEmitterEvents,
  OnFrameTypes,
  IsOnTargetFrameTypes,
}
