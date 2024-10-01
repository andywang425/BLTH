import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import type { ModuleStatusTypes } from '@/types'

class SignTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.sign

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.LiveTasks.sign = s
  }

  private async getSignInfo() {
    try {
      const response = await BAPI.live.getSignInfo()
      this.logger.log('BAPI.live.getSignInfo response', response)
      if (response.code === 0) {
        return response.data
      } else {
        this.logger.error('获取直播签到信息失败', response.message)
        return null
      }
    } catch (error) {
      this.logger.error('获取直播签到信息出错', error)
      return null
    }
  }

  private async sign() {
    try {
      const response = await BAPI.live.doSign()
      this.logger.log(`BAPI.live.doSign response`, response)
      if (response.code === 0) {
        this.logger.log('直播签到成功，获得奖励:', response.data.text)
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
        this.logger.log('直播签到任务已完成')
      } else {
        this.logger.error('直播签到失败', response.message)
        this.status = 'error'
      }
    } catch (err) {
      this.logger.error('执行直播签到任务出错', err)
      this.status = 'error'
    }
  }

  public async run() {
    this.logger.log('直播签到模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      this.status = 'running'
      const signInfo = await this.getSignInfo()
      if (signInfo) {
        if (signInfo.status === 0) {
          await this.sign()
        } else {
          this.config._lastCompleteTime = tsm()
          this.status = 'done'
        }
      } else {
        await this.sign()
      }
    } else {
      if (!isNowIn(0, 0, 0, 5)) {
        this.logger.log('今天已经完成过直播签到任务了')
        this.status = 'done'
      } else {
        this.logger.log('昨天的直播签到任务已经完成过了，等到今天的00:05再执行')
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离直播签到模块下次运行时间:', diff.str)
  }
}

export default SignTask
