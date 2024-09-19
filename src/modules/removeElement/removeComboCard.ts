import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveComboCard extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeComboCard

  public async run() {
    this.logger.log('移除直播间相同弹幕连续提示模块开始运行')

    GM_addStyle('#combo-card { display: none !important }')
  }
}

export default RemoveComboCard
