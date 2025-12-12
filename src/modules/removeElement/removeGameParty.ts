import { GM_addStyle } from '$'
import BaseModule from '@/modules/BaseModule'
import { useModuleStore } from '@/stores'

class RemoveGameParty extends BaseModule {
  static runMultiple = true

  config = useModuleStore().moduleConfig.RemoveElement.removeGameParty

  public async run() {
    this.logger.log('移除直播间幻星派对标志模块开始运行')

    GM_addStyle('#game-id { display: none !important }')
  }
}

export default RemoveGameParty
