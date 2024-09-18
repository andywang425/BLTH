import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { LiveData } from '@/library/bili-api/data'
import { delayToNextMoment, isTimestampToday } from '@/library/luxon'
import { sleep } from '@/library/utils'
import { useModuleStore } from '@/stores/useModuleStore'
import BaseModule from '../BaseModule'
import ModuleError from '@/library/error/ModuleError'
import _ from 'lodash'

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
          this.logger.error(
            `获取粉丝勋章列表第${page}页失败，提前结束获取`,
            firstPageResponse.message
          )
          // 中途出错，返回已获取的粉丝勋章列表，不抛出错误
          return fansMetalList
        }
        // 防止风控，稍微加点延时
        await sleep(_.random(300, 500))
      }
      return fansMetalList
    } catch (error: any) {
      useBiliStore().fansMedalsStatus = 'error'
      throw new ModuleError(this.moduleName, `获取粉丝勋章列表出错: ${error.message}`)
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    const emitter = useModuleStore().emitter

    // 监听 LiveTasks.vue 发出的获取粉丝勋章事件
    emitter.off('Default_FansMedals')
    emitter.on('Default_FansMedals', async () => {
      biliStore.fansMedalsStatus = 'loading'
      biliStore.fansMedals = await this.getFansMetals(Infinity)
      biliStore.fansMedalsStatus = 'loaded'
    })

    const medalTasks = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
    const taskValues = [medalTasks.light, medalTasks.watch]

    if (taskValues.some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime, 0, 4))) {
      // 开启了点亮熄灭勋章或观看直播功能且今天没完成过
      biliStore.fansMedalsStatus = 'loading'
      biliStore.fansMedals = await this.getFansMetals()
      biliStore.fansMedalsStatus = 'loaded'
    }

    setTimeout(
      () => this.run().catch((reason) => this.logger.error(reason)),
      delayToNextMoment(0, 4).ms
    )
  }
}

export default FansMetals
