import { fproxy, IrequestConfig, IrequestHandler } from '../../library/fetch-hook'
import BaseModule from '../BaseModule'
import { unsafeWindow } from '$'
import { getUrlFromFetchInput } from '../../library/utils'

class WearFansMedal extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.wearFansMedal

  public run(): void {
    this.logger.log('发弹幕自动佩戴粉丝勋章模块开始运行')
    if (this.config.enabled) {
      fproxy(
        {
          onRequest: (config: IrequestConfig, handler: IrequestHandler) => {
            if (getUrlFromFetchInput(config.input).includes('//api.live.bilibili.com/msg/send')) {
              // TODO
            } else {
              handler.next(config)
            }
          }
        },
        unsafeWindow
      )
    }
  }
}

export default WearFansMedal
