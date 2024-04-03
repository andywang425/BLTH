import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemoveActitityBanner extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removeActivityBanner

  public async run() {
    this.logger.log('移除活动入口模块开始运行')
    if (this.config.enabled) {
      GM_addStyle('.activity-gather-entry .task-box:nth-child(1) { display: none !important }')
    }
  }
}

export default RemoveActitityBanner
