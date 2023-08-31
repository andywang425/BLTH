import BaseModule from '../BaseModule'

class SleepDetection extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.sleepDetection

  public async run() {
    this.logger.log('屏蔽挂机检测模块开始运行')
    if (this.config.enabled) {
      setInterval(() => {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 1 }))
      }, 3e5)
    }
  }
}

export default SleepDetection
