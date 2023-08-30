import { useModuleStore } from '../stores/useModuleStore'
import Logger from '../library/logger'
import { moduleStatus, runAtMoment } from '../types/module'

class BaseModule {
  /**
   * 模块名称，在被导出时定义
   *
   * 输出控制台日志时会用到
   */
  moduleName: string
  /**
   * 当脚本在多个页面上运行的时候，该模块是否要在每个页面上运行
   *
   * 默认false，即只在Main BLTH运行的页面上运行
   */
  static runMultiple: boolean = false
  /**
   * 模块运行时机
   *
   * `document-start`: 尽可能早，与脚本注入时机相同
   *
   * `document-end`: `document`的`DOMContentLoaded`事件触发后
   *
   * `window-load`: `window`的`load`事件触发后
   */
  static runAt: runAtMoment = 'document-start'
  /**
   * 用于在控制台中输出日志信息
   */
  logger: Logger
  /**
   * 储存所有模块信息的 Pinia Store
   */
  moduleStore = useModuleStore()
  /**
   * 推荐添加一个 config 属性来表示当前模块的配置项
   *
   * @example this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login
   */
  config?: any
  /**
   * 如果需要在控制面板上显示模块状态，推荐添加一个 status setter 用来设置模块状态
   *
   * @example
   * public set status(s: moduleStatus) {
   *    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s
   * }
   */
  set status(_s: moduleStatus) {
    throw new Error('Method not implemented.')
  }

  constructor(moduleName: string) {
    this.moduleName = moduleName
    this.logger = new Logger(this.moduleName)
  }

  run(): void {
    throw new Error('Method not implemented.')
  }
}

export default BaseModule
