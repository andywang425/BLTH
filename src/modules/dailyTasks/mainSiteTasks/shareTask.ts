import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '../../../library/luxon'
import { useBiliStore } from '../../../stores/useBiliStore'
import { MainData } from '../../../library/bili-api/data'
import BAPI from '../../../library/bili-api'
import _ from 'lodash'
import { moduleStatus } from '../../../types/module'

class ShareTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.share

  set status(s: moduleStatus) {
    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.share = s
  }

  private getAid(): string {
    const biliStore = useBiliStore()
    if (biliStore.dynamicVideos) {
      // 当 biliStore.dynamicVideos 不为 null 时，返回第一个视频的 aid
      return biliStore.dynamicVideos[0].modules.module_dynamic.major.archive.aid
    } else {
      // 否则返回 '2'
      return '2'
    }
  }

  private async share(aid: string): Promise<void> {
    try {
      const response = await BAPI.main.share(aid)
      this.logger.log(`BAPI.main.share(${aid}) response`, response)
      if (response.code === 0 || response.code === 71000) {
        // 首次分享和重复分享均可完成任务
        this.logger.log('每日分享视频任务已完成')
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
      } else {
        this.logger.error('分享视频失败', response.message)
        this.status = 'error'
      }
    } catch (err) {
      this.logger.error('执行每日分享视频任务出错', err)
      this.status = 'error'
    }
  }

  public async run(): Promise<void> {
    this.logger.log('每日分享视频模块开始运行')
    if (this.config.enabled) {
      const biliStore = useBiliStore()
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        this.status = 'running'
        if (biliStore.dailyRewardInfo && !biliStore.dailyRewardInfo.share) {
          const aid = this.getAid()
          await this.share(aid)
        } else {
          this.config._lastCompleteTime = tsm()
          this.status = 'done'
          this.logger.log('每日分享视频任务已完成')
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log('昨天的每日分享任务已经完成过了，等到今天的00:05再执行')
        } else {
          this.logger.log('今天已经完成过每日分享任务了')
          this.status = 'done'
        }
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离每日分享视频模块下次运行时间:', diff.str)
  }
}

export default ShareTask
