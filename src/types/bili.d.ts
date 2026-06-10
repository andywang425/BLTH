type CookieNames = 'bili_jct' | 'LIVE_BUVID' | 'buvid3'

type BiliCookies = Record<CookieNames, string>

// 获取中：loading，获取成功：loaded，获取失败：error
type FansMedalsStatus = 'loading' | 'loaded' | 'error'

interface FansMedalsMeta {
  status?: FansMedalsStatus
  lastFetchStartedAt?: number
  lastFetchFinishedAt?: number
}

export { BiliCookies, FansMedalsStatus, FansMedalsMeta }
