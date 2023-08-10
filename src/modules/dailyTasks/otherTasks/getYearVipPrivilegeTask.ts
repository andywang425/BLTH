import BaseModule from '../../BaseModule'
import { delayToNextMoment, ts } from '../../../library/luxon'
import BAPI from '../../../library/bili-api'
import { Istatus } from '../../../types/moduleStatus'
import { useBiliStore } from '../../../stores/useBiliStore'
import { MainData } from '../../../library/bili-api/data'
import { DateTime } from 'luxon'

class GetYearVipPrivilegeTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.OtherTasks.getYearVipPrivilege

  set status(s: Istatus) {
    this.moduleStore.moduleStatus.DailyTasks.OtherTasks.getYearVipPrivilege = s
  }

  /**
   * 获取会员权益
   * @returns 会员权益列表
   */
  private async myPrivilege(): Promise<MainData.Vip.MyPrivilege.List[] | undefined> {
    try {
      const response = await BAPI.main.vip.myPrivilege()
      this.logger.log(`BAPI.main.vip.myPrivilege response`, response)
      if (response.code === 0) {
        return response.data.list
      } else {
        this.logger.error(`获取年度大会员权益信息失败`, response.message)
        this.status = 'error'
      }
    } catch (error) {
      this.logger.error(`获取年度大会员权益信息出错`, error)
      this.status = 'error'
    }
  }

  /**
   * 领取权益
   * @param type 权益种类
   */
  private async receivePrivilege(type: number) {
    try {
      const response = await BAPI.main.vip.receivePrivilege(type)
      this.logger.log(`BAPI.main.vip.receivePrivilege(${type}) response`, response)
      if (response.code === 0) {
        this.logger.log(`领取年度大会员权益（type = ${type}）成功`)
      } else {
        this.logger.error(`领取年度大会员权益（type = ${type}）失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`领取年度大会员权益（type = ${type}）出错`, error)
    }
  }

  /**
   * 判断当前账号是否是年度大会员
   */
  private isYearVip(): boolean {
    const biliStore = useBiliStore()
    const userInfo = biliStore.userInfo
    if (userInfo && userInfo.vip.status === 1 && userInfo.vip.type === 2) {
      return true
    } else {
      this.logger.log('当前账号不是年度大会员，不领取权益')
      return false
    }
  }

  public async run() {
    this.logger.log('领取年度大会员权益模块开始运行')
    if (this.config.enabled) {
      if (this.isYearVip()) {
        if (ts() >= this.config._nextReceiveTime) {
          // 当前时间已经超过了上次记录的下次领取时间，领取权益
          const list = await this.myPrivilege()
          if (list) {
            for (const i of list) {
              if (i.vip_type === 2) {
                if (i.state === 0) {
                  await this.receivePrivilege(i.type)
                } else {
                  this.logger.log(`该权益（type = ${i.type}）已经领取过了`)
                }
              } else {
                this.logger.warn('发现不属于年度大会员的权益', i)
              }
            }
            this.config._nextReceiveTime = Math.max(...list.map((i) => i.period_end_unix))
          }
        } else {
          // 否则等待下次运行或什么都不做
          const diff = this.config._nextReceiveTime - ts()
          if (diff < 86400) {
            this.logger.log(
              '领取年度大会员权益模块下次运行时间:',
              DateTime.fromSeconds(this.config._nextReceiveTime).toString()
            )
            setTimeout(() => this.run(), diff)
          } else {
            this.logger.log('距离下次领取年度大会员权益的时间超过一天，不计划下次运行')
          }
        }
      }
    } else {
      const diff = delayToNextMoment(0, 0)
      setTimeout(() => this.run(), diff.ms)
      this.logger.log('领取年度大会员权益模块下次运行时间:', diff.str)
    }
  }
}

export default GetYearVipPrivilegeTask
