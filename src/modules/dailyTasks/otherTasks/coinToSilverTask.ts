import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import type { ModuleStatusTypes } from '@/types'

class CoinToSilverTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.OtherTasks.coinToSilver

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.OtherTasks.coinToSilver = s
  }

  private async exchange() {
    try {
      const response = await BAPI.live.coin2silver(this.config.num)
      this.logger.log(`BAPI.live.coin2silver{${this.config.num}} response`, response)
      if (response.code === 0) {
        this.logger.log('硬币换银瓜子已完成，获得银瓜子:', response.data.silver)
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
      } else {
        this.logger.error('硬币换银瓜子失败', response.message)
        this.status = 'error'
      }
    } catch (err) {
      this.logger.error('硬币换银瓜子出错', err)
      this.status = 'error'
    }
  }

  public async run() {
    this.logger.log('硬币换银瓜子模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      this.status = 'running'
      await this.exchange()
    } else {
      if (!isNowIn(0, 0, 0, 5)) {
        this.logger.log('今天已经完成过硬币换银瓜子任务了')
        this.status = 'done'
      } else {
        this.logger.log('昨天的硬币换银瓜子任务已经完成过了，等到今天的00:05再执行')
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('硬币换银瓜子模块下次运行时间:', diff.str)
  }
}

export default CoinToSilverTask
