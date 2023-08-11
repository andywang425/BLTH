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
      appUser: Istatus
      medalTasks: {
        danmu: Istatus
        like: Istatus
        watch: Istatus
      }
    }
    OtherTasks: {
      groupSign: Istatus
      silverToCoin: Istatus
      coinToSilver: Istatus
      getYearVipPrivilege: Istatus
    }
  }
}

export { Istatus, ImoduleStatus }
