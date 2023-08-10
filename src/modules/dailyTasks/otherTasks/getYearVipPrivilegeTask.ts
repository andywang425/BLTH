import BaseModule from '../../BaseModule'
import { tsm } from '../../../library/luxon'
import BAPI from '../../../library/bili-api'
import { Istatus } from '../../../types/moduleStatus'
import { useBiliStore } from '../../../stores/useBiliStore'

class GetYearVipPrivilegeTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.OtherTasks.getYearVipPrivilege

  set status(s: Istatus) {
    this.moduleStore.moduleStatus.DailyTasks.OtherTasks.getYearVipPrivilege = s
  }

  private async myPrivilege() {
    try {
      const response = await BAPI.main.vip.myPrivilege()
      this.logger.log(`BAPI.main.vip.myPrivilege response`, response)
      if (response.code === 0) {
        return
      } else {
        this.logger.error(`获取年度大会员权益信息失败`, response.message)
        this.status = 'error'
      }
    } catch (error) {
      this.logger.error(`获取年度大会员权益信息出错`, error)
      this.status = 'error'
    }
  }

  private isYearVip() {
    const biliStore = useBiliStore()
    const userInfo = biliStore.userInfo
    if (userInfo && userInfo.vip.status === 1 && userInfo.vip.type === 2) {
      return true
    } else {
      return false
    }
  }

  public async run() {
    if (this.isYearVip()) {
      // todo
    }
  }
}

export default GetYearVipPrivilegeTask
