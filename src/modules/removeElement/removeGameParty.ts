import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveGameParty extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeGameParty

  public async run() {
    this.logger.log('移除直播间幻星派对标志模块开始运行')
    if (this.config.enabled) {
      GM_addStyle('#game-id { display: none !important }')
    }
  }
}

export default RemoveGameParty
