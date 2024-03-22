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
    noSleep: IhelpInfoItem
    invisibility: IhelpInfoItem
    showContributionUserNum: IhelpInfoItem
    wearFansMedal: IhelpInfoItem
  }
  RemoveElement: {
    removePKBox: IhelpInfoItem
    removeLiveWaterMark: IhelpInfoItem
    removeShopPopover: IhelpInfoItem
    removeGiftPopover: IhelpInfoItem
    removeMicPopover: IhelpInfoItem
    removeComboCard: IhelpInfoItem
    removeRank: IhelpInfoItem
    removeGiftPlanet: IhelpInfoItem
  }
}

export { IhelpInfoItem, IhelpInfo }
