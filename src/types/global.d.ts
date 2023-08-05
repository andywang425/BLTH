declare global {
  interface Window {
    BilibiliLive: {
      INIT_TIME: number
      RND: number
      UID: number
      ROOMID: number
      ANCHOR_UID: number
      COLORFUL_LOGGER: boolean
      SHORT_ROOMID: number
      AREA_ID: number
      PARENT_AREA_ID: number
    }

    livePlayer: {
      getPlayerInfo: () => {
        type: number
        version: string
        playerType: string
        liveStatus: number
        playerStatus: number
        playingStatus: boolean
        playurl: string
        guid: string
        quality: string
        qualityCandidates: Array<{
          qn: string
          desc: string
        }>
        volume: {
          disabled: boolean
          value: number
        }
        danmaku: {
          display: boolean
          opacity: number
          fontScale: number
          density: number
          area: number
          showMaskOption: boolean
          enableMask: boolean
        }
      }
      switchQuality: (qn: string) => void
    }
  }
}

export {}
