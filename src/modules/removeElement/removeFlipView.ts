import { GM_addStyle } from '$'
import BaseModule from '@/modules/BaseModule'
import { useModuleStore } from '@/stores'

class RemoveFlipView extends BaseModule {
  static runOnMultiplePages = true

  config = useModuleStore().moduleConfig.RemoveElement.removeFlipView

  public async run() {
    this.logger.log('移除礼物栏下方广告模块开始运行')

    GM_addStyle('.flip-view { display: none !important }')
  }
}

export default RemoveFlipView
