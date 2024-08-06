import { VNode } from 'vue'

interface HelpInfoItem {
  title: string
  message: string | VNode | (() => VNode)
}

interface HelpInfo {
  DailyTasks: {
    MainSiteTasks: {
      login: HelpInfoItem
      watch: HelpInfoItem
      coin: HelpInfoItem
      share: HelpInfoItem
    }
    LiveTasks: {
      sign: HelpInfoItem
      medalTasks: {
        list: HelpInfoItem
        light: {
          main: HelpInfoItem
          like: HelpInfoItem
          danmu: HelpInfoItem
        }
        watch: HelpInfoItem
      }
    }
    OtherTasks: {
      groupSign: HelpInfoItem
      silverToCoin: HelpInfoItem
      coinToSilver: HelpInfoItem
      getYearVipPrivilege: HelpInfoItem
    }
  }
  EnhanceExperience: {
    switchLiveStreamQuality: HelpInfoItem
    banp2p: HelpInfoItem
    noReport: HelpInfoItem
    noSleep: HelpInfoItem
    invisibility: HelpInfoItem
    showContributionUserNum: HelpInfoItem
  }
  RemoveElement: {
    removePKBox: HelpInfoItem
    removeLiveWaterMark: HelpInfoItem
    removeShopPopover: HelpInfoItem
    removeGameParty: HelpInfoItem
    removeGiftPopover: HelpInfoItem
    removeMicPopover: HelpInfoItem
    removeComboCard: HelpInfoItem
    removeRank: HelpInfoItem
    removeGiftPlanet: HelpInfoItem
    removeActivityBanner: HelpInfoItem
    removePKBanner: HelpInfoItem
    removeFlipView: HelpInfoItem
    removeRecommendRoom: HelpInfoItem
    removeLiveMosaic: HelpInfoItem
  }
}

export { HelpInfoItem, HelpInfo }
