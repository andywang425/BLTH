import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { MainData } from '@/library/bili-api/data'
import { delayToNextMoment } from '@/library/luxon'
import BaseModule from '../BaseModule'
import ModuleCriticalError from '@/library/error/ModuleCriticalError'

class UserInfo extends BaseModule {
  /**
   * 通过 BAPI.main.nav 获取用户基本信息
   */
  private async getUserInfo(): Promise<MainData.Nav.Data> {
    try {
      const response = await BAPI.main.nav()
      this.logger.log('BAPI.main.nav response', response)
      if (response.code === 0) {
        return response.data
      } else {
        throw new Error(`响应 code 不为 0: ${response.message}`)
      }
    } catch (error: any) {
      throw new ModuleCriticalError(this.moduleName, `获取用户信息出错: ${error.message}`)
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    biliStore.userInfo = await this.getUserInfo()

    setTimeout(
      () => this.run().catch((reason) => this.logger.error(reason)),
      delayToNextMoment(0, 4).ms
    )
  }
}

export default UserInfo
