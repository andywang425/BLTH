type cookieValue = string | null

type cookieNames = 'bili_jct' | 'LIVE_BUVID' | 'buvid3'

type IbiliCookies = Record<cookieNames, cookieValue>

export { IbiliCookies }
