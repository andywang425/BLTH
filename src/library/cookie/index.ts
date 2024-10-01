class Cookie {
  /**
   * 获取所有 cookies
   */
  public static getAll(): Record<string, string> {
    if (document.cookie === '') return {}

    const cookies = document.cookie.split('; ')
    const result: Record<string, string> = {}

    for (const cookie of cookies) {
      const [name, value] = cookie.split('=', 2)
      result[decodeURIComponent(name)] = decodeURIComponent(value)
    }

    return result
  }

  /**
   * 获取指定名称的一组 cookies
   * @param names cookie 名称数组
   * @param defaultValue 当 cookie 不存在时使用的默认值，默认 undefined
   */
  public static get(names: string[], defaultValue?: string): Record<string, string | undefined>
  /**
   * 获取指定名称的一个 cookie
   * @param name cookie 名称
   * @param defaultValue 当 cookie 不存在时使用的默认值，默认 undefined
   */
  public static get(name: string, defaultValue?: string): string | undefined
  /**
   * 获取指定名称的一个或多个 cookies
   * @param names cookie 名称或 cookie 名称数组
   * @param defaultValue 当 cookie 不存在时使用的默认值，默认 undefined
   */
  public static get(names: string[] | string, defaultValue?: string) {
    const cookies = this.getAll()

    if (Array.isArray(names)) {
      const result: Record<string, string | undefined> = {}

      for (const name of names) {
        result[name] = cookies[name] ? cookies[name] : defaultValue
      }

      return result
    } else {
      return cookies[names] ? cookies[names] : defaultValue
    }
  }

  /**
   * 获取一组 cookies，如果有 cookie 未获取到，会反复获取直到超时为止
   *
   * TODO: 等 cookieStore 普及后使用监听取代轮询
   *
   * @param names 要获取的 cookie 名称数组
   * @param interval 获取间隔，默认 300 毫秒
   * @param timeout 超时时间，若留空则永不超时
   */
  public static getAsync<T extends string>(
    names: T[],
    interval: number = 300,
    timeout?: number
  ): Promise<Record<T, string>> {
    return new Promise((resolve, reject) => {
      let remainCookieNames = [...names]
      const cookies: Record<T, string | undefined> = this.get(remainCookieNames)

      remainCookieNames = remainCookieNames.filter((r) => !cookies[r])
      if (remainCookieNames.length === 0) {
        resolve(<Record<T, string>>cookies)
        return
      }

      let timeoutTimer: number

      const timer = setInterval(() => {
        Object.assign(cookies, this.get(remainCookieNames))
        remainCookieNames = remainCookieNames.filter((r) => !cookies[r])

        if (remainCookieNames.length === 0) {
          if (timeout) clearTimeout(timeoutTimer)
          clearInterval(timer)
          resolve(<Record<T, string>>cookies)
        }
      }, interval)

      if (timeout) {
        timeoutTimer = setTimeout(() => {
          clearInterval(timer)
          reject(new Error(`获取以下 cookie 超时：${remainCookieNames}`))
        }, timeout)
      }
    })
  }
}

export default Cookie
