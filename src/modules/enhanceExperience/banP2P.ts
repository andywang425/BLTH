import { unsafeWindow } from '$'
import BaseModule from '../BaseModule'

class BanP2P extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.banp2p

  private async banP2P() {
    const RTClist: string[] = [
      'RTCPeerConnection',
      'RTCDataChannel',
      'mozRTCPeerConnection',
      'webkitRTCPeerConnection',
      'DataChannel'
    ]
    for (const i of RTClist) {
      // 判断属性是否存在并且是否可配置
      if (
        i in unsafeWindow &&
        unsafeWindow.hasOwnProperty.call(unsafeWindow, i) &&
        Object.getOwnPropertyDescriptor(unsafeWindow, i)?.configurable
      ) {
        delete (unsafeWindow as any)[i]
      }
    }
  }

  public async run() {
    this.logger.log('禁用P2P上传模块开始运行')
    if (this.config.enabled) {
      try {
        await this.banP2P()
      } catch (e) {
        this.logger.error('禁用P2P上传失败', e)
      }
    }
  }
}

export default BanP2P
