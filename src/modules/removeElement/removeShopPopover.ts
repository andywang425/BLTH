import { GM_addStyle } from '$'
import BaseModule from '@/modules/BaseModule'

class RemoveShopPopover extends BaseModule {
  static runOnMultiplePages = true

  public async run() {
    this.logger.log('移除直播间小橙车弹窗模块开始运行')

    GM_addStyle('.shop-popover { display: none !important }')
  }
}

export default RemoveShopPopover
