import BaseModule from '../../BaseModule'
import { ts } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import type { ModuleStatusTypes } from '@/types'
import { useBiliStore } from '@/stores/useBiliStore'
import type { MainData } from '@/library/bili-api/data'
import { DateTime } from 'luxon'
import { sleep } from '@/library/utils'
import { watch } from 'vue'

class GetYearVipPrivilegeTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.OtherTasks.getYearVipPrivilege

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.OtherTasks.getYearVipPrivilege = s
  }

  private type2Name: Record<string, string> = {
    1: '年度专享B币赠送',
    2: '年度专享会员购优惠券',
    3: '年度专享漫画礼包 - 漫画福利券',
    4: '大会员专享会员购包邮券',
    5: '年度专享漫画礼包 - 漫画商城优惠券',
    6: '大会员专享会员体验卡',
    7: '大会员专享课堂优惠券',
    15: '年度专享会员购星光宝盒88折券',
    16: '大会员专享会员购10魔晶',
    17: '年度专享游戏优惠券'
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
        this.logger.log(
          `领取年度大会员权益（type = ${type}, ${this.type2Name[type] ?? '未知'}）成功`
        )
      } else {
        this.logger.error(
          `领取年度大会员权益（type = ${type}, ${this.type2Name[type] ?? '未知'}）失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(
        `领取年度大会员权益（type = ${type}, ${this.type2Name[type] ?? '未知'}）出错`,
        error
      )
    }
  }

  /**
   * 领取专属等级加速包（10主站经验）
   */
  private async addExperience() {
    try {
      const response = await BAPI.main.vip.addExperience()
      this.logger.log(`BAPI.main.vip.addExperience response`, response)
      if (response.code === 0) {
        this.logger.log(`领取年度大会员权益（type = 9，专属等级加速包（10主站经验））成功`)
      } else {
        this.logger.error(
          `领取年度大会员权益（type = 9，专属等级加速包（10主站经验））失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(`领取年度大会员权益（type = 9，专属等级加速包（10主站经验））出错`, error)
    }
  }

  /**
   * 判断当前账号是否是年度大会员
   */
  private isYearVip(): boolean {
    const biliStore = useBiliStore()
    const userInfo = biliStore.userInfo
    if (userInfo!.vip.status === 1 && userInfo!.vip.type === 2) {
      return true
    } else {
      this.logger.log('当前账号不是年度大会员，不领取权益')
      return false
    }
  }

  public async run() {
    this.logger.log('领取年度大会员权益模块开始运行')

    if (this.isYearVip()) {
      if (ts() >= this.config._nextReceiveTime) {
        // 当前时间已经超过了上次记录的下次领取时间，领取权益
        this.status = 'running'
        const list = await this.myPrivilege()
        if (list) {
          for (const i of list) {
            if (i.type === 8 || i.type === 14) {
              // 8: 可能是游戏礼包兑换，state总是为 1，不领取
              // 14：不清楚是什么，总是无法正确领取
              continue
            }
            if (i.state === 0) {
              if (i.type === 9) {
                // 专属等级加速包
                await this.addExperience()
              } else {
                await this.receivePrivilege(i.type)
              }
            } else if (i.state === 1) {
              this.logger.log(`该权益（type = ${i.type}）已经领取过了`)
            } else {
              // 需要完成任务才能领取
              if (i.type === 9) {
                const watchTaskConfig = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.watch
                if (watchTaskConfig.enabled) {
                  this.logger.log('等待观看视频任务完成后再领取专属等级加速包（10主站经验）...')
                  watch(
                    () => watchTaskConfig._lastCompleteTime,
                    () => sleep(3000).then(() => this.addExperience()),
                    { once: true }
                  )
                } else {
                  this.logger.warn(
                    '领取专属等级加速包（10主站经验）前需要观看任意一个视频，请打开【主站任务】中的【每日观看视频】，或是在运行脚本前手动观看'
                  )
                }
              }
            }
            await sleep(200)
          }
          this.status = 'done'
          this.config._nextReceiveTime = Math.min(...list.map((i) => i.period_end_unix))
        }
      }
      // 等待下次运行或什么都不做
      const diff = this.config._nextReceiveTime - ts() + 3e5 // 增加5分钟延时
      if (diff < 86400) {
        this.logger.log(
          '领取年度大会员权益模块下次运行时间:',
          DateTime.fromSeconds(this.config._nextReceiveTime).toJSDate()
        )
        setTimeout(() => this.run(), diff * 1000)
      } else {
        this.logger.log('距离下次领取年度大会员权益的时间超过一天，不计划下次运行')
      }
    }
  }
}

export default GetYearVipPrivilegeTask
