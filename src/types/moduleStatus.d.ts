type Istatus = 'running' | 'done' | 'error' | ''

interface ImoduleStatus {
  DailyTasks: {
    MainSiteTasks: {
      login: Istatus
      watch: Istatus
      coin: Istatus
      share: Istatus
    }
    LiveTasks: {
      sign: Istatus
      danmu: Istatus
      like: Istatus
      watch: Istatus
      appUser: Istatus
    }
    OtherTasks: {
      groupSign: Istatus
      silverToCoin: Istatus
      coinToSilver: Istatus
    }
  }
}

export { Istatus, ImoduleStatus }
