type CookieNames = 'bili_jct' | 'LIVE_BUVID' | 'buvid3'

type BiliCookies = Record<CookieNames, string>

type FansMedalsStatus = 'loading' | 'loaded' | 'error'

export { BiliCookies, FansMedalsStatus }
