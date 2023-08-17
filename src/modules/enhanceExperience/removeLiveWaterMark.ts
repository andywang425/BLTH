import BaseModule from '../BaseModule'

class RemoveLiveWaterMark extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.removeLiveWaterMark

  private async removeLiveWaterMark() {
    const style = document.createElement('style')
    style.textContent = '.web-player-icon-roomStatus { display: none !important }'
    document.head.appendChild(style)
  }

  public async run() {
    this.logger.log('移除直播间水印模块开始运行')
    if (this.config.enabled) {
      try {
        await this.removeLiveWaterMark()
      } catch (e) {
        this.logger.error('移除直播间水印失败', e)
      }
    }
  }
}

export default RemoveLiveWaterMark
