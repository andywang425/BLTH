import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { MainData } from '@/library/bili-api/data'
import { delayToNextMoment, isTimestampToday } from '@/library/luxon'
import BaseModule from '../BaseModule'

class DailyRewardInfo extends BaseModule {
  /**
   * 获取今日主站每日任务的完成情况
   */
  private async getDailyRewardInfo(): Promise<MainData.Reward.Data | null> {
    const mainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks
    // 开启了任意一项主站功能且该功能今天没完成过
    if (
      Object.values(mainSiteTasks).some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime))
    ) {
      try {
        const response = await BAPI.main.reward()
        this.logger.log('BAPI.main.reward response', response)
        if (response.code === 0) {
          return Promise.resolve(response.data)
        } else {
          this.logger.error('获取主站每日任务完成情况失败', response.message)
          return Promise.reject(response.message)
        }
      } catch (error) {
        this.logger.error('获取主站每日任务完成情况出错', error)
        return Promise.reject(error)
      }
    } else {
      return Promise.resolve(null)
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    biliStore.dailyRewardInfo = await this.getDailyRewardInfo()

    setTimeout(async () => {
      biliStore.dailyRewardInfo = await this.getDailyRewardInfo()
    }, delayToNextMoment(0, 4).ms)
  }
}

export default DailyRewardInfo
