import BaseModule from './BaseModule'

class DefaultBaseModule extends BaseModule {
  /**
   * 优先级，数字越小优先级越高
   */
  static sequence?: number
  /**
   * 默认模块按顺序逐个运行，所以必须返回一个 Promise
   */
  run(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}

export default DefaultBaseModule
