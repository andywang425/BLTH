import BaseModule from '@/modules/BaseModule'
import { storeToRefs } from 'pinia'
import { useBiliStore, useModuleStore } from '@/stores'
import { watch } from 'vue'
import type { PublicMedalFilters } from './types'
import { arrayToMap } from '@/library/utils'
import type { LiveData } from '@/library/bili-api/data'

class MedalModule extends BaseModule {
  medalTasksConfig = useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks

  protected PUBLIC_MEDAL_FILTERS: PublicMedalFilters = {
    // 包含在白名单中或不包含在黑名单中返回true，否则返回false
    whiteBlackList: (m) =>
      this.medalTasksConfig.isWhiteList
        ? this.medalTasksConfig.roomidList.includes(m.room_info.room_id)
        : !this.medalTasksConfig.roomidList.includes(m.room_info.room_id),
    // 等级小于120返回true，否则返回false
    levelLt120: (medal) => medal.medal.level < 120,
  }

  protected sortMedals(medals: LiveData.FansMedalPanel.List[]): LiveData.FansMedalPanel.List[] {
    const orderMap = arrayToMap(this.medalTasksConfig.roomidList)
    return medals.sort(
      (a, b) => orderMap.get(a.room_info.room_id)! - orderMap.get(b.room_info.room_id)!,
    )
  }

  /**
   * 等待粉丝勋章数据获取完毕
   *
   * @returns 是否获取成功
   */
  protected waitForFansMedals(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const { fansMedalsStatus } = storeToRefs(useBiliStore())
      if (fansMedalsStatus.value === 'loaded') {
        resolve(true)
      } else {
        const unwatch = watch(fansMedalsStatus, (newValue) => {
          if (newValue === 'loaded') {
            unwatch()
            resolve(true)
          } else if (newValue === 'error') {
            unwatch()
            resolve(false)
          }
        })
      }
    })
  }
}

export default MedalModule
