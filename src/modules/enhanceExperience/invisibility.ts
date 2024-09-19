import type { OnFrameTypes, RunAtMoment } from '@/types'
import { type XhrRequestConfig, type XhrRequestHandler, proxy } from 'ajax-hook'
import BaseModule from '../BaseModule'
import { unsafeWindow } from '$'

class Invisibility extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'document-start'
  static runAfterDefault: boolean = false
  static onFrame: OnFrameTypes = 'all'

  config = this.moduleStore.moduleConfig.EnhanceExperience.invisibility

  public run(): void {
    this.logger.log('隐身入场模块开始运行')

    proxy(
      {
        onRequest: (config: XhrRequestConfig, handler: XhrRequestHandler) => {
          if (
            config.url.includes('//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser')
          ) {
            config.url = config.url.replace('not_mock_enter_effect=0', 'not_mock_enter_effect=1')
          }
          handler.next(config)
        }
      },
      unsafeWindow
    )
  }
}

export default Invisibility
