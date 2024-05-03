import { unsafeWindow } from '$'
import { OnFrameTypes, RunAtMoment } from '../../types/module'
import BaseModule from '../BaseModule'

class BanP2P extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'document-start'
  static onFrame: OnFrameTypes = 'all'
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.banp2p

  private banP2P(): void {
    const RTClist: string[] = [
      'RTCPeerConnection',
      'mozRTCPeerConnection',
      'webkitRTCPeerConnection'
    ]
    for (const i of RTClist) {
      // 判断属性是否存在并且是否可配置
      if (Object.prototype.hasOwnProperty.call(unsafeWindow, i)) {
        // 定义属性
        Object.defineProperty(unsafeWindow, i, {
          value: class {
            constructor() {}
            addEventListener() {}
            removeEventListener() {}
            createDataChannel() {
              return { close: function () {} }
            }
            createOffer() {
              return Promise.resolve()
            }
            setLocalDescription() {
              return Promise.resolve()
            }
            close() {}
            setRemoteDescription() {
              return Promise.resolve()
            }
            createAnswer() {}
          },
          enumerable: false,
          writable: false,
          configurable: false
        })
      }
    }
  }

  public run(): void {
    this.logger.log('禁用P2P模块开始运行')
    if (this.config.enabled) {
      try {
        this.banP2P()
      } catch (e) {
        this.logger.error('禁用P2P失败', e)
      }
    }
  }
}

export default BanP2P
