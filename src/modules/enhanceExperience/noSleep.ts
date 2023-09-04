import { runAtMoment } from '../../types/module'
import BaseModule from '../BaseModule'

class NoSleep extends BaseModule {
  static runMultiple: boolean = true
  static runAt: runAtMoment = 'window-load'
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.sleepDetection

  public async run() {
    this.logger.log('屏蔽挂机检测模块开始运行')
    if (this.config.enabled) {
      setInterval(() => {
        document.dispatchEvent(new MouseEvent('mousemove'))
      }, 3e5)
    }
  }
}

export default NoSleep
