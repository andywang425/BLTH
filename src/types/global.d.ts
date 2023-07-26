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
  }
}

export {}
