import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveGiftPlanet extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeGiftPlanet

  public async run() {
    this.logger.log('移除礼物星球模块开始运行')
    if (this.config.enabled) {
      GM_addStyle('.gift-planet-entry { display: none !important }')
    }
  }
}

export default RemoveGiftPlanet
