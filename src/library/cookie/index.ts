import _ from 'lodash'

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
function getCookies(names: string[]): Record<string, string | null> {
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
        // 从 names 中删除已获取的 cookie
        names.splice(i, 1)
        break
      }
    }
    if (names.length === 0) break
  }
  return cookies
}

/**
 * 获取名称在 names 中的 cookies，如果有 cookie 未获取到，会重复获取直到超时为止
 *
 * 该方法会修改 names
 * @param names Cookies 名称字符串
 * @param interval 获取间隔
 * @param timeout 超时时间
 */
function getCookiesAsync(
  names: string[],
  interval: number = 100,
  timeout: number = 10e3
): Promise<Record<string, string | null>> {
  return new Promise((resolve, reject) => {
    const cookies = getCookies(names)
    if (names.length > 0) {
      const cookieTimer = setInterval(() => {
        _.merge(cookies, getCookies(names))
        if (names.length === 0) {
          clearInterval(cookieTimer)
          clearTimeout(timeoutTimer)
          resolve(cookies)
        }
      }, interval)
      const timeoutTimer = setTimeout(() => {
        clearInterval(cookieTimer)
        reject('获取以下Cookies超时: ' + names.toString())
      }, timeout)
    } else {
      resolve(cookies)
    }
  })
}

export { getCookie, getCookies, getCookiesAsync }
