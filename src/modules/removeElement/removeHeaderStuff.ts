import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveHeaderStuff extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeHeaderStuff

  public async run() {
    this.logger.log('移除直播画面上方杂项模块开始运行')

    GM_addStyle('.header-info-ctnr .rows-ctnr .lower-row .right-ctnr { display: none !important }')
  }
}

export default RemoveHeaderStuff
