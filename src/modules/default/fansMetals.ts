import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { LiveData } from '@/library/bili-api/data'
import { delayToNextMoment, isTimestampToday } from '@/library/luxon'
import { sleep } from '@/library/utils'
import { useModuleStore } from '@/stores/useModuleStore'
import BaseModule from '../BaseModule'
import ModuleError from '@/library/error/ModuleError'

class FansMetals extends BaseModule {
  /**
   * 获取粉丝勋章
   *
   * @param pages 获取的页数
   */
  private async getFansMetals(pages = Infinity): Promise<LiveData.FansMedalPanel.List[]> {
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
        throw new Error(`获取粉丝勋章列表第1页失败: ${firstPageResponse.message}`)
      }
      for (let page = 2; page <= Math.min(total_page, pages); page++) {
        const response = await BAPI.live.fansMedalPanel(page)
        this.logger.log(`BAPI.live.fansMedalPanel(${page}) response`, response)
        if (firstPageResponse.code === 0) {
          fansMetalList.push(...response.data.list)
        } else {
          this.logger.error(`获取粉丝勋章列表第${page}页失败`, firstPageResponse.message)
          // 中途出错，返回已获取的分析勋章列表
          return fansMetalList
        }
        // 防止风控，稍微加点延时
        await sleep(250)
      }
      return fansMetalList
    } catch (error: any) {
      throw new ModuleError(this.moduleName, `获取粉丝勋章列表出错: ${error.message}`)
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    const medalTasks = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
    const taskValues = [medalTasks.light, medalTasks.watch]

    if (taskValues.some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime))) {
      // 开启了点亮熄灭勋章或观看直播功能且今天没完成过
      biliStore.fansMedals = await this.getFansMetals()
    }

    setTimeout(
      // 如果获得了新的粉丝勋章，肯定在第一页的 special_list 中
      // 但是获取全部勋章可以避免在此期间被用户删除的勋章存留的问题，同时更新勋章状态（是否在直播，是否点亮等）
      async () => {
        biliStore.fansMedals = []
        biliStore.fansMedals = await this.getFansMetals(Infinity)
      },
      delayToNextMoment(0, 4).ms
    )

    useModuleStore().emitter.on('Default_FansMedals', async () => {
      biliStore.fansMedals = await this.getFansMetals(Infinity)
    })
  }
}

export default FansMetals
