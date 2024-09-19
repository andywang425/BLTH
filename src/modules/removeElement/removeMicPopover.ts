import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class removeMicPopover extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeMicPopover

  public async run() {
    this.logger.log('移除连麦状态提示模块开始运行')

    GM_addStyle('.lin-mic-cntr { display: none !important }')
  }
}

export default removeMicPopover
