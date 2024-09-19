import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveShopPopover extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeShopPopover

  public async run() {
    this.logger.log('移除直播间小橙车弹窗模块开始运行')

    GM_addStyle('.shop-popover { display: none !important }')
  }
}

export default RemoveShopPopover
