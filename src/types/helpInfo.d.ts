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
      like: IhelpInfoItem
      danmu: IhelpInfoItem
      watch: IhelpInfoItem
      appUser: IhelpInfoItem
    }
    OtherTasks: {
      groupSign: IhelpInfoItem
      silverToCoin: IhelpInfoItem
      coinToSilver: IhelpInfoItem
    }
  }
}

export { IhelpInfoItem, IhelpInfo }
