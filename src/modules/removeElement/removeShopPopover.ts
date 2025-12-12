import { GM_addStyle } from '$'
import BaseModule from '@/modules/BaseModule'
import { useModuleStore } from '@/stores'

class RemoveShopPopover extends BaseModule {
  static runOnMultiplePages = true

  config = useModuleStore().moduleConfig.RemoveElement.removeShopPopover

  public async run() {
    this.logger.log('移除直播间小橙车弹窗模块开始运行')

    GM_addStyle('.shop-popover { display: none !important }')
  }
}

export default RemoveShopPopover
