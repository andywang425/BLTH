import { useBiliStore } from '../../stores/useBiliStore'
import BAPI from '../../library/bili-api'
import { MainData } from '../../library/bili-api/data'
import DefaultBaseModule from '../DefaultBaseModule'
import { delayToNextMoment, isTimestampToday } from '../../library/luxon'

class DynamicVideos extends DefaultBaseModule {
  /**
   * 从动态中获取一页视频的信息
   *
   * 每日观看视频，每日分享视频，每日投币都会用到
   */
  private async getDynamicVideos(): Promise<MainData.DynamicAll.Item[] | null> {
    const MainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks
    // 开启了观看视频、每日分享视频或每日投币功能且今天没完成过
    if (
      Object.entries(MainSiteTasks)
        .filter(([key]) => ['watch', 'share', 'coin'].includes(key))
        .some((keyValue) => keyValue[1].enabled && !isTimestampToday(keyValue[1]._lastCompleteTime))
    ) {
      try {
        const response = await BAPI.main.dynamicAll('video')
        this.logger.log('BAPI.main.dynamicAll response', response)
        if (response.code === 0) {
          return Promise.resolve(response.data.items)
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
    biliStore.dynamicVideos = await this.getDynamicVideos()

    setTimeout(async () => {
      biliStore.dynamicVideos = await this.getDynamicVideos()
    }, delayToNextMoment(0, 4).ms)
  }
}

export default DynamicVideos
