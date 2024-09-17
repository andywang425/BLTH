import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { ModuleStatusTypes } from '@/types'
import _ from 'lodash'

class WatchTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.watch

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.watch = s
  }

  /**
   * 获取第一个视频的 aid
   */
  private getAid(): number {
    return Number(useBiliStore().dynamicVideos![0].modules.module_dynamic.major.archive.aid)
  }

  private async watch(aid: number) {
    try {
      const response = await BAPI.main.videoHeartbeat(aid, _.random(1000000000, 2000000000))
      this.logger.log(`BAPI.main.videoHeartbeat(${aid}) response`, response)
      if (response.code === 0) {
        this.logger.log('每日观看视频任务已完成')
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
      } else {
        this.logger.error('发送观看视频心跳失败', response.message)
        this.status = 'error'
      }
    } catch (err) {
      this.logger.error('执行每日观看视频任务出错', err)
      this.status = 'error'
    }
  }

  private runCheck(): boolean {
    const biliStore = useBiliStore()

    if (!biliStore.dailyRewardInfo) {
      this.logger.error('主站每日任务完成情况不存在，不执行每日观看视频任务')
      this.status = 'error'
      return false
    }
    if (!biliStore.dynamicVideos) {
      this.logger.error('动态视频数据不存在，不执行每日观看视频任务')
      this.status = 'error'
      return false
    }

    return true
  }

  public async run() {
    this.logger.log('每日观看视频模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      if (!this.runCheck()) {
        return
      }

      const biliStore = useBiliStore()
      this.status = 'running'

      if (!biliStore.dailyRewardInfo!.watch) {
        const aid = this.getAid()
        await this.watch(aid)
      } else {
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
        this.logger.log('每日观看视频任务已完成')
      }
    } else {
      if (isNowIn(0, 0, 0, 5)) {
        this.logger.log('昨天的每日观看视频任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过每日观看视频任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离每日观看视频模块下次运行时间:', diff.str)
  }
}

export default WatchTask
