import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { ModuleStatusTypes } from '@/types'

class ShareTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.share

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.share = s
  }

  private getAid(): string {
    const biliStore = useBiliStore()
    // 返回第一个视频的 aid
    return biliStore.dynamicVideos![0].modules.module_dynamic.major.archive.aid
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

  private runCheck(): boolean {
    const biliStore = useBiliStore()

    if (!biliStore.dailyRewardInfo) {
      this.logger.error('主站每日任务完成情况不存在，不执行每日分享视频任务')
      this.status = 'error'
      return false
    }

    if (!biliStore.dynamicVideos) {
      this.logger.error('动态视频数据不存在，不执行每日分享视频任务')
      this.status = 'error'
      return false
    }
    return true
  }

  public async run(): Promise<void> {
    this.logger.log('每日分享视频模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      if (!this.runCheck()) {
        return
      }

      const biliStore = useBiliStore()
      this.status = 'running'

      if (!biliStore.dailyRewardInfo!.share) {
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

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离每日分享视频模块下次运行时间:', diff.str)
  }
}

export default ShareTask
