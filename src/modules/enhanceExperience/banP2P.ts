import { unsafeWindow } from '$'
import BaseModule from '../BaseModule'

class BanP2P extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.banp2p

  private async banP2P() {
    const RTClist: string[] = [
      'RTCPeerConnection',
      'mozRTCPeerConnection',
      'webkitRTCPeerConnection',
      'test'
    ]
    for (const i of RTClist) {
      // 判断属性是否存在并且是否可配置
      if (
        Object.prototype.hasOwnProperty.call(unsafeWindow, i) &&
        Object.getOwnPropertyDescriptor(unsafeWindow, i)?.configurable
      ) {
        // 定义属性
        Object.defineProperty(unsafeWindow, i, {
          value: function () {
            this.addEventListener = function () {}
            this.createDataChannel = function () {
              return { close: function () {} }
            }
            this.createOffer = function () {}
            this.setLocalDescription = function () {}
            this.close = function () {}
            this.setRemoteDescription = function () {}
            this.createAnswer = function () {}
          },
          enumerable: false,
          writable: false,
          configurable: false
        })
      }
    }
  }

  public async run() {
    this.logger.log('禁用P2P模块开始运行')
    if (this.config.enabled) {
      try {
        await this.banP2P()
      } catch (e) {
        this.logger.error('禁用P2P失败', e)
      }
    }
  }
}

export default BanP2P
