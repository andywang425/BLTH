import { IbiliCookies } from '../../types'

/**
 * 获取名称为 name 的 cookie
 * @param name Cookie 名称
 */
function getCookie(name: string): string | null {
  const nameEqual = name + '='
  for (const cookie of document.cookie.split('; ')) {
    if (cookie.startsWith(nameEqual)) {
      const value = cookie.substring(nameEqual.length)
      return decodeURIComponent(value)
    }
  }
  return null
}

/**
 * 获取名称在 names 中的 cookies
 *
 * 该方法会修改 names
 * @param names Cookies 名称字符串
 */
function getCookies(names: string[]): IbiliCookies {
  const cookies: Record<string, string | null> = {}
  // 所有 cookies 赋初值 null
  for (const name of names) {
    cookies[name] = null
  }
  for (const cookie of document.cookie.split('; ')) {
    for (let i = 0; i < names.length; i++) {
      const name = names[i]
      const nameEqual = name + '='
      if (cookie.startsWith(nameEqual)) {
        const value = cookie.substring(nameEqual.length)
        cookies[name] = decodeURIComponent(value)
        names.splice(i, 1)
        break
      }
    }
    if (names.length === 0) break
  }
  return cookies as unknown as IbiliCookies
}

export { getCookie, getCookies }
