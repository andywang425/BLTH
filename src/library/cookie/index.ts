import _ from 'lodash'

/**
 * 获取名称为 name 的 cookie
 * @param name 要获取的 cookie 名称
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift() as string
  return null
}

/**
 * 获取名称在 names 数组中的 cookies
 * @param names 要获取的 cookie 名称数组
 */
function getCookies<T extends string>(names: Iterable<T>): Record<T, string | null> {
  const cookies: Record<T, string | null> = {} as Record<T, string | null>
  const namesSet = new Set(names)

  // 初始化所有 cookie 为 null
  for (const name of namesSet) {
    cookies[name] = null
  }

  for (const cookie of document.cookie.split('; ')) {
    const [cookieName, ...cookieValueParts] = cookie.split('=')
    const cookieValue = cookieValueParts.join('=')

    if (namesSet.has(cookieName as T)) {
      cookies[cookieName as T] = decodeURIComponent(cookieValue)
      namesSet.delete(cookieName as T)

      // 所有 cookie 都已找到，跳出循环
      if (namesSet.size === 0) break
    }
  }

  return cookies
}

/**
 * 获取名称在 names 中的 cookies，如果有 cookie 未获取到，会反复获取直到超时为止
 *
 * @param names 要获取的 cookie 名称数组
 * @param interval 获取间隔
 * @param timeout 超时时间，若为 -1 则永不超时
 */
function getCookiesAsync<T extends string>(
  names: T[],
  interval: number = 200,
  timeout: number = 10000
): Promise<Record<T, string | null>> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const remainNamesSet = new Set(names)
    const cookies: Record<T, string | null> = {} as Record<T, string | null>

    const timer = setInterval(() => {
      Object.assign(cookies, getCookies(remainNamesSet))

      // 删去 remainNamesSet 中已获取的 cookies
      for (const name in cookies) {
        if (cookies[name] !== null) remainNamesSet.delete(name)
      }

      if (remainNamesSet.size === 0) {
        clearInterval(timer)
        resolve(cookies)
      } else if (timeout !== -1 && Date.now() - startTime > timeout) {
        clearInterval(timer)
        reject('获取以下Cookies超时: ' + [...remainNamesSet])
      }
    }, interval)
  })
}

export { getCookie, getCookies, getCookiesAsync }
