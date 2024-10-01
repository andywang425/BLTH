import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class removeGiftPopover extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeGiftPopover

  public async run() {
    this.logger.log('移除礼物赠送提示弹窗模块开始运行')

    GM_addStyle('.function-card { display: none !important }')
  }
}

export default removeGiftPopover
