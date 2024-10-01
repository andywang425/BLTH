import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveLiveMosaic extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeLiveMosaic

  public async run() {
    this.logger.log('移除直播间马赛克模块开始运行')

    GM_addStyle('#web-player-module-area-mask-panel { opacity: 0 !important }')
  }
}

export default RemoveLiveMosaic
