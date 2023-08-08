import BaseModule from '../../BaseModule'
import { tsm } from '../../../library/luxon'
import BAPI from '../../../library/bili-api'
import { Istatus } from '../../../types/moduleStatus'

class GetYearVipPrivilegeTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.OtherTasks.getYearVipPrivilege

  set status(s: Istatus) {
    this.moduleStore.moduleStatus.DailyTasks.OtherTasks.getYearVipPrivilege = s
  }

  public async run() {}
}

export default GetYearVipPrivilegeTask
