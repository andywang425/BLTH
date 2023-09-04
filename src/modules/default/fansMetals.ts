import { useBiliStore } from '../../stores/useBiliStore'
import BAPI from '../../library/bili-api'
import { LiveData } from '../../library/bili-api/data'
import DefaultBaseModule from '../DefaultBaseModule'
import { delayToNextMoment, isTimestampToday } from '../../library/luxon'
import { sleep } from '../../library/utils'

class FansMetals extends DefaultBaseModule {
  /**
   * 获取粉丝勋章
   *
   * @param pages 获取的页数
   * @param force 是否无视配置强制获取，默认fasle
   */
  private async getFansMetals(
    pages = 10,
    force = false
  ): Promise<LiveData.FansMedalPanel.List[] | null> {
    const medalTasks = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
    // 开启了任意一项粉丝勋章相关功能且该功能今天没完成过
    if (
      force ||
      Object.entries(medalTasks)
        .filter(([key]) => ['danmu', 'like', 'watch'].includes(key))
        .some(
          (keyValue) =>
            (keyValue[1] as any).enabled &&
            !isTimestampToday((keyValue[1] as any)._lastCompleteTime)
        )
    ) {
      const fansMetalList: LiveData.FansMedalPanel.List[] = []
      let total_page = 1
      try {
        const firstPageResponse = await BAPI.live.fansMedalPanel(1)
        this.logger.log('BAPI.live.fansMedalPanel(1) response', firstPageResponse)
        if (firstPageResponse.code === 0) {
          total_page = firstPageResponse.data.page_info.total_page
          // 第一页的 list 缺少当前佩戴和最近获得的勋章，需通过 special_list 获取
          fansMetalList.push(...firstPageResponse.data.special_list, ...firstPageResponse.data.list)
        } else {
          this.logger.error('获取粉丝勋章列表第1页失败', firstPageResponse.message)
          return Promise.reject(firstPageResponse.message)
        }
        for (let page = 2; page <= Math.min(total_page, pages); page++) {
          const response = await BAPI.live.fansMedalPanel(page)
          this.logger.log(`BAPI.live.fansMedalPanel(${page}) response`, response)
          if (firstPageResponse.code === 0) {
            fansMetalList.push(...response.data.list)
          } else {
            this.logger.error(`获取粉丝勋章列表第${page}页失败`, firstPageResponse.message)
            return fansMetalList
          }
          // 防止风控，稍微加点延时
          await sleep(250)
        }
        return Promise.resolve(fansMetalList)
      } catch (error) {
        this.logger.error('获取粉丝勋章列表出错', error)
        return Promise.reject(error)
      }
    } else {
      return Promise.resolve(null)
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    biliStore.fansMedals = await this.getFansMetals()

    setTimeout(async () => {
      biliStore.fansMedals = await this.getFansMetals()
    }, delayToNextMoment(0, 4).ms)
  }
}

export default FansMetals
