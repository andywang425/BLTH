import { GM_addStyle } from '$'
import BaseModule from '../BaseModule'

class RemovePKBanner extends BaseModule {
  static runOnMultiplePages = true

  config = this.moduleStore.moduleConfig.RemoveElement.removePKBanner

  public async run() {
    this.logger.log('移除大乱斗入口模块开始运行')
    if (this.config.enabled) {
      GM_addStyle('.activity-gather-entry .task-box:nth-child(2) { display: none !important }')
    }
  }
}

export default RemovePKBanner
