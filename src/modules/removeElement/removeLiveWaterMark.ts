import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveLiveWaterMark extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeLiveWaterMark

  public async run() {
    this.logger.log('移除直播间水印模块开始运行')

    GM_addStyle('.web-player-icon-roomStatus { display: none !important }')
  }
}

export default RemoveLiveWaterMark
