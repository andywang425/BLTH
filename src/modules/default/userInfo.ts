import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { MainData } from '@/library/bili-api/data'
import { delayToNextMoment } from '@/library/luxon'
import BaseModule from '../BaseModule'

class UserInfo extends BaseModule {
  /**
   * 通过 BAPI.main.nav 获取用户基本信息
   */
  private async getUserInfo(): Promise<MainData.Nav.Data> {
    try {
      const response = await BAPI.main.nav()
      this.logger.log('BAPI.main.nav response', response)
      if (response.code === 0) {
        return Promise.resolve(response.data)
      } else {
        this.logger.error('获取用户信息失败', response.message)
        return Promise.reject(response.message)
      }
    } catch (error) {
      this.logger.error('获取用户信息出错', error)
      return Promise.reject(error)
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    biliStore.userInfo = await this.getUserInfo()

    setTimeout(async () => {
      biliStore.userInfo = await this.getUserInfo()
    }, delayToNextMoment(0, 4).ms)
  }
}

export default UserInfo
