import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { MainData } from '@/library/bili-api/data'
import { delayToNextMoment, isTimestampToday } from '@/library/luxon'
import BaseModule from '../BaseModule'
import ModuleError from '@/library/error/ModuleError'

class DailyRewardInfo extends BaseModule {
  /**
   * 获取今日主站每日任务的完成情况
   */
  private async getDailyRewardInfo(): Promise<MainData.Reward.Data> {
    try {
      const response = await BAPI.main.reward()
      this.logger.log('BAPI.main.reward response', response)
      if (response.code === 0) {
        return response.data
      } else {
        throw new Error(`响应 code 不为 0: ${response.message}`)
      }
    } catch (error: any) {
      throw new ModuleError(this.moduleName, `获取主站每日任务完成情况出错: ${error.message}`)
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    const mainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks

    if (
      Object.values(mainSiteTasks).some(
        (t) => t.enabled && !isTimestampToday(t._lastCompleteTime, 0, 4)
      )
    ) {
      // 开启了任意一项主站功能且该功能今天没完成过
      biliStore.dailyRewardInfo = await this.getDailyRewardInfo()
    }

    setTimeout(
      () => this.run().catch((reason) => this.logger.error(reason)),
      delayToNextMoment(0, 4).ms
    )
  }
}

export default DailyRewardInfo
