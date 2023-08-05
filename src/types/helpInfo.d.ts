import { VNode } from 'vue'

interface IhelpInfoItem {
  title: string
  message: string | VNode | (() => VNode)
}

interface IhelpInfo {
  DailyTasks: {
    MainSiteTasks: {
      login: IhelpInfoItem
      watch: IhelpInfoItem
      coin: IhelpInfoItem
      share: IhelpInfoItem
    }
    LiveTasks: {
      sign: IhelpInfoItem
      appUser: IhelpInfoItem
      medalTasks: {
        list: IhelpInfoItem
        like: IhelpInfoItem
        danmu: IhelpInfoItem
        watch: IhelpInfoItem
      }
    }
    OtherTasks: {
      groupSign: IhelpInfoItem
      silverToCoin: IhelpInfoItem
      coinToSilver: IhelpInfoItem
    }
  }
  EnhanceExperience: {
    switchLiveStreamQuality: IhelpInfoItem
    banp2p: IhelpInfoItem
  }
}

export { IhelpInfoItem, IhelpInfo }
