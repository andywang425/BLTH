import { GM_addStyle } from '$'
import BaseModule from '@/modules/BaseModule'
import { useModuleStore } from '@/stores'

class RemoveRank extends BaseModule {
  static runOnMultiplePages = true

  config = useModuleStore().moduleConfig.RemoveElement.removeRank

  public async run() {
    this.logger.log('移除排行榜模块开始运行')

    GM_addStyle('.popular-and-hot-rank { display: none !important }')
  }
}

export default RemoveRank
