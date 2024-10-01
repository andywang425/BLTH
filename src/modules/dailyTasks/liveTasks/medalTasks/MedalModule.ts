import BaseModule from '@/modules/BaseModule'
import { storeToRefs } from 'pinia'
import { useBiliStore } from '@/stores/useBiliStore'
import { watch } from 'vue'

class MedalModule extends BaseModule {
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
