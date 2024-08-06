import type { RunAtMoment } from '@/types'
import BaseModule from '../BaseModule'

class NoSleep extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'window-load'
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.noSleep

  public run(): void {
    this.logger.log('屏蔽挂机检测模块开始运行')
    if (this.config.enabled) {
      setInterval(() => {
        document.dispatchEvent(new MouseEvent('mousemove'))
      }, 3e5) // 5分钟触发一次 MouseEvent
    }
  }
}

export default NoSleep
