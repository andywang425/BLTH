import type { RunAtMoment } from '@/types'
import BaseModule from '../BaseModule'

class NoSleep extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'window-load'
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.noSleep

  public run(): void {
    this.logger.log('屏蔽挂机检测模块开始运行')
    // 每5分钟触发一次 MouseEvent
    setInterval(() => {
      document.dispatchEvent(new MouseEvent('mousemove'))
    }, 3e5)
  }
}

export default NoSleep
