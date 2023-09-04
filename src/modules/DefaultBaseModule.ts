import { onFrameTypes, runAtMoment } from '../types/module'
import BaseModule from './BaseModule'

class DefaultBaseModule extends BaseModule {
  /**
   * 默认模块的运行时机总是 document-body
   */
  static runAt: runAtMoment = 'document-body'
  /**
   * 默认模块只能在目标 frame 上运行
   */
  static onFrame: onFrameTypes = 'target'
  /**
   * 默认模块按顺序逐个运行，所以必须返回一个 Promise
   */
  run(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}

export default DefaultBaseModule
