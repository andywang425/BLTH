import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import type { ModuleStatusTypes } from '@/types'

class SilverToCoinTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.OtherTasks.silverToCoin

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.OtherTasks.silverToCoin = s
  }

  private async exchange(): Promise<void> {
    try {
      const response = await BAPI.live.silver2coin()
      this.logger.log(`BAPI.live.silver2coin response`, response)
      if (response.code === 0) {
        this.logger.log(`银瓜子换硬币已完成，获得硬币:`, response.data.coin)
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
      } else if (response.code === 403) {
        // 今天已经手动兑换过了，也算完成
        this.logger.log('每天最多只能用银瓜子兑换1个硬币')
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
      } else {
        this.logger.error('银瓜子换硬币失败', response.message)
        this.status = 'error'
      }
    } catch (err) {
      this.logger.error('银瓜子换硬币出错', err)
      this.status = 'error'
    }
  }

  public run(): void {
    this.logger.log('银瓜子换硬币模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      this.status = 'running'
      this.exchange()
    } else {
      if (isNowIn(0, 0, 0, 5)) {
        this.logger.log('昨天的银瓜子换硬币任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过银瓜子换硬币任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('银瓜子换硬币模块下次运行时间:', diff.str)
  }
}

export default SilverToCoinTask
