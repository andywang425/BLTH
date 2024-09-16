import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { MainData } from '@/library/bili-api/data'
import { delayToNextMoment, isTimestampToday } from '@/library/luxon'
import BaseModule from '../BaseModule'
import ModuleError from '@/library/error/ModuleError'

class DynamicVideos extends BaseModule {
  /**
   * 从动态中获取一页视频的信息
   *
   * 每日观看视频，每日分享视频，每日投币都会用到
   */
  private async getDynamicVideos(): Promise<MainData.DynamicAll.Item[]> {
    try {
      const response = await BAPI.main.dynamicAll('video')
      this.logger.log('BAPI.main.dynamicAll response', response)
      if (response.code === 0) {
        return response.data.items
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
    const taskValues = [mainSiteTasks.watch, mainSiteTasks.share, mainSiteTasks.coin]

    if (taskValues.some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime, 0, 4))) {
      // 开启了每日观看视频、每日分享视频或每日投币功能且今天没完成过
      biliStore.dynamicVideos = await this.getDynamicVideos()
    }

    setTimeout(
      () => this.run().catch((reason) => this.logger.error(reason)),
      delayToNextMoment(0, 4).ms
    )
  }
}

export default DynamicVideos
