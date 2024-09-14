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

  private getAid(): number {
    const biliStore = useBiliStore()
    // 返回第一个视频的 aid
    return Number(biliStore.dynamicVideos![0].modules.module_dynamic.major.archive.aid)
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

  public async run() {
    this.logger.log('每日观看视频模块开始运行')

    const biliStore = useBiliStore()
    if (!isTimestampToday(this.config._lastCompleteTime)) {
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
