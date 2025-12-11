import { GM_addStyle } from '$'
import BaseModule from '@/modules/BaseModule'
import { useModuleStore } from '@/stores'

class RemoveRecommendRoom extends BaseModule {
  static runOnMultiplePages = true

  config = useModuleStore().moduleConfig.RemoveElement.removeRecommendRoom

  public async run() {
    this.logger.log('移除礼物栏下方推荐直播间模块开始运行')

    GM_addStyle('.room-info-ctnr { display: none !important }')
  }
}

export default RemoveRecommendRoom
