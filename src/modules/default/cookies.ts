import { useBiliStore } from '@/stores/useBiliStore'
import Cookie from '@/library/cookie'
import type { BiliCookies } from '@/types'
import BaseModule from '../BaseModule'
import ModuleCriticalError from '@/library/error/ModuleCriticalError'

class Cookies extends BaseModule {
  /**
   * 获取 Cookies
   *
   * bili_jct: 常作为参数 csrf 在请求中出现
   * LIVE_BUVID: 如果用户以前从来没看过直播，此时可能为 null
   * buvid3: 作为参数 buvid 在请求中出现，目前仅在主站 API 中使用
   */
  private getCookies(): Promise<BiliCookies> {
    return Cookie.getAsync(['bili_jct', 'LIVE_BUVID', 'buvid3'], 300, 10e3)
  }

  public async run(): Promise<void> {
    try {
      useBiliStore().cookies = await this.getCookies()
    } catch (error: any) {
      throw new ModuleCriticalError(this.moduleName, error.message)
    }
  }
}

export default Cookies
