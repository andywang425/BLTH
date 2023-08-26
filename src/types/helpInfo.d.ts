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
      getYearVipPrivilege: IhelpInfoItem
    }
  }
  EnhanceExperience: {
    switchLiveStreamQuality: IhelpInfoItem
    banp2p: IhelpInfoItem
    noReport: IhelpInfoItem
  }
  RemoveElement: {
    removePKBox: IhelpInfoItem
    removeLiveWaterMark: IhelpInfoItem
    removeShopPopover: IhelpInfoItem
    removeGameParty: IhelpInfoItem
  }
}

export { IhelpInfoItem, IhelpInfo }
