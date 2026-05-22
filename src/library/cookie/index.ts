class Cookie {
  /**
   * 获取所有 cookies
   */
  public static async getAll(): Promise<Record<string, string>> {
    const cookies = await cookieStore.getAll()
    const result: Record<string, string> = {}

    for (const cookie of cookies) {
      if (cookie.name) {
        result[cookie.name] = cookie.value ?? ''
      }
    }

    return result
  }

  /**
   * 获取指定名称的一组 cookies
   * @param names cookie 名称数组
   * @param defaultValue 当 cookie 不存在时使用的默认值，默认 undefined
   */
  public static async get(
    names: string[],
    defaultValue?: string,
  ): Promise<Record<string, string | undefined>>
  /**
   * 获取指定名称的一个 cookie
   * @param name cookie 名称
   * @param defaultValue 当 cookie 不存在时使用的默认值，默认 undefined
   */
  public static async get(name: string, defaultValue?: string): Promise<string | undefined>
  /**
   * 获取指定名称的一个或多个 cookies
   * @param names cookie 名称或 cookie 名称数组
   * @param defaultValue 当 cookie 不存在时使用的默认值，默认 undefined
   */
  public static async get(names: string[] | string, defaultValue?: string) {
    if (Array.isArray(names)) {
      const result: Record<string, string | undefined> = {}
      const cookies = await Promise.all(names.map((name) => cookieStore.get(name)))

      for (let i = 0; i < names.length; i++) {
        result[names[i]] = cookies[i]?.value ?? defaultValue
      }

      return result
    } else {
      const cookie = await cookieStore.get(names)
      return cookie?.value ?? defaultValue
    }
  }

  /**
   * 获取一组 cookies
   *
   * 如果有 cookie 未获取到，会通过监听 cookieStore 的 change 事件等待，直到全部获取或超时
   *
   * @param names 要获取的 cookie 名称数组
   * @param timeout 超时时间，若留空则永不超时
   */
  public static getAsync<T extends string>(
    names: T[],
    timeout?: number,
  ): Promise<Record<T, string>> {
    return new Promise((resolve, reject) => {
      const cookies = {} as Record<T, string>
      const nameSet = new Set<string>(names)
      let timeoutTimer: number | undefined

      const cleanup = () => {
        if (timeoutTimer !== undefined) clearTimeout(timeoutTimer)
        cookieStore.removeEventListener('change', onChange)
      }

      const checkDone = (): boolean => {
        if (names.every((n) => n in cookies)) {
          cleanup()
          resolve(cookies)
          return true
        }
        return false
      }

      const onChange = (event: CookieChangeEvent) => {
        for (const c of event.changed) {
          if (c.name && c.value && nameSet.has(c.name) && !(c.name in cookies)) {
            cookies[c.name as T] = c.value
          }
        }
        checkDone()
      }

      cookieStore.addEventListener('change', onChange)

      Promise.all(names.map((name) => cookieStore.get(name))).then((initialCookies) => {
        for (let i = 0; i < names.length; i++) {
          const c = initialCookies[i]
          if (c && c.value && !(names[i] in cookies)) {
            cookies[names[i]] = c.value
          }
        }
        if (checkDone()) return

        if (timeout) {
          timeoutTimer = setTimeout(() => {
            const remain = names.filter((n) => !(n in cookies))
            cleanup()
            reject(new Error(`获取以下 cookie 超时：${remain}`))
          }, timeout)
        }
      })
    })
  }
}

export default Cookie
