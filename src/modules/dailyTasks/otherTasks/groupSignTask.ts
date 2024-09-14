import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'

class GroupSignTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.OtherTasks.groupSign

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.OtherTasks.groupSign = s
  }

  /**
   * 获取应援团 id 和拥有者 uid
   * @returns 数组，每个元素都是数组：[应援团 id，拥有者 uid]
   */
  private async getGroupidOwneruidList() {
    try {
      const response = await BAPI.vc.myGroups()
      this.logger.log(`BAPI.vc.myGroups response`, response)
      if (response.code === 0) {
        return response.data.list.map((item) => [item.group_id, item.owner_uid])
      } else {
        this.logger.error(`获取应援团信息失败`, response.message)
        this.status = 'error'
      }
    } catch (error) {
      this.logger.error(`获取应援团信息出错`, error)
      this.status = 'error'
    }
  }

  private async sign(group_id: number, owner_uid: number) {
    try {
      const response = await BAPI.vc.signIn(group_id, owner_uid)
      this.logger.log(`BAPI.vc.signIn(${group_id}, ${owner_uid}) response`, response)
      if (response.code === 0) {
        this.logger.log(
          `应援团签到 应援团ID = ${group_id} 拥有者UID = ${owner_uid} 成功, 粉丝勋章亲密度+${response.data.add_num}`
        )
      } else {
        this.logger.error(
          `应援团签到 应援团ID = ${group_id} 拥有者UID = ${owner_uid} 失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(`应援团签到 应援团ID = ${group_id} 拥有者UID = ${owner_uid} 出错`, error)
    }
  }

  public async run() {
    this.logger.log('应援团签到模块开始运行')

    // 应援团签到的刷新时间是每天早上8点
    if (!isTimestampToday(this.config._lastCompleteTime, 8, 5)) {
      this.status = 'running'
      const idList = await this.getGroupidOwneruidList()
      if (idList) {
        for (const [group_id, owner_uid] of idList) {
          await this.sign(group_id, owner_uid)
          await sleep(2000)
        }
        this.config._lastCompleteTime = tsm()
        this.logger.log('应援团签到任务已完成')
        this.status = 'done'
      }
    } else {
      if (!isNowIn(0, 0, 8, 5)) {
        this.logger.log('今天已经完成过应援团签到任务了')
        this.status = 'done'
      } else {
        // 现在位于 00:00 ~ 08:05 这个时间段
        this.logger.log('昨天的应援团签到任务已经完成过了，等到今天早上八点零五分再次执行')
      }
    }

    // 下一个早上 08:05 再运行
    const diff = delayToNextMoment(8, 5)
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离应援团签到模块下次运行时间:', diff.str)
  }
}

export default GroupSignTask
