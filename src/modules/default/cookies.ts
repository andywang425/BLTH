import { useBiliStore } from '../../stores/useBiliStore'
import { getCookiesAsync } from '../../library/cookie'
import { IbiliCookies } from '../../types/cookies'
import BaseModule from '../BaseModule'

class Cookies extends BaseModule {
  /**
   * 获取 Cookies
   *
   * bili_jct: 常作为参数 csrf 在请求中出现
   *
   * LIVE_BUVID: 如果用户以前从来没看过直播，此时可能为 null
   */
  private getCookies(): Promise<IbiliCookies> {
    return getCookiesAsync<IbiliCookies>(['bili_jct', 'LIVE_BUVID'])
  }

  public async run(): Promise<void> {
    useBiliStore().cookies = await this.getCookies()
  }
}

export default Cookies
