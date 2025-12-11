import type { OnFrameTypes, RunAtMoment } from '@/types'
import BaseModule from '@/modules/BaseModule'

class NoSleep extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'window-load'
  static onFrame: OnFrameTypes = 'top'
  static runAfterDefault: boolean = false

  public run(): void {
    this.logger.log('屏蔽挂机检测模块开始运行')
    // 每分钟触发一次 MouseEvent
    setInterval(() => {
      document.dispatchEvent(new MouseEvent('mousemove'))
    }, 60e3)

    // 修改页面可见性相关属性
    try {
      Object.defineProperties(document, {
        visibilityState: { value: 'visible' },
        hidden: { value: false },
      })
    } catch (e) {
      this.logger.warn('修改页面可见性相关属性失败，可能已被其它脚本锁定', e)
    }
  }
}

export default NoSleep
