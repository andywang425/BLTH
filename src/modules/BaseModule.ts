import { useModuleStore } from '@/stores/useModuleStore'
import Logger from '@/library/logger'
import type { ModuleStatusTypes, OnFrameTypes, RunAtMoment } from '@/types'

class BaseModule {
  /**
   * 模块名称，在被导出时定义
   *
   * 输出控制台日志时会用到
   */
  public moduleName: string
  /**
   * 当脚本在多个页面上运行的时候，该模块是否要在每个页面上运行
   *
   * 默认false，即只在Main BLTH运行的页面上运行
   *
   * 该选项为 false 时如果要确保模块不会重复运行，还需将 onFrame 设置为 target 或 top
   */
  public static runOnMultiplePages: boolean = false
  /**
   * 模块运行时机，默认 document-body
   *
   * `document-start`: 尽可能早，与脚本注入时机相同
   *
   * `document-head`: `document.head`刚刚出现后
   *
   * `document-body`: `document.body`刚刚出现后
   *
   * `document-end`: `document`的`DOMContentLoaded`事件触发后
   *
   * `window-load`: `window`的`load`事件触发后
   *
   * 默认模块的模块运行时机总是为 document-body
   */
  public static runAt: RunAtMoment = 'document-body'
  /**
   * 模块运行的 frame，默认 target
   *
   * `all`: 所有符合脚本`@match`规则的 frame
   *
   * `target`: window.BilibiliLive 存在的那个 frame
   *
   * `top`: 顶层 frame (`window.top`)
   *
   * 如果设置为 target，那么至少要等到`document-body`时刻才能运行
   *
   * 默认模块运行的 frame 总是为 target
   */
  public static onFrame: OnFrameTypes = 'target'
  /**
   * 是否要等默认模块运行完了再运行，默认 true
   *
   * 如果设置为 true，那么就不能保证该模块被及时地执行
   *
   * 因为默认模块的运行时机总是 document-body，而且默认模块的运行时间是不确定的
   */
  public static runAfterDefault: boolean = true
  /**
   * 用于在控制台中输出日志信息
   */
  protected logger: Logger
  /**
   * 储存所有模块信息的 Pinia Store
   */
  protected moduleStore = useModuleStore()
  /**
   * 推荐添加一个 config 属性来表示当前模块的配置项
   *
   * @example config: this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login
   */
  protected config?: any

  /**
   * 模块是否启用，默认通过 config.enabled 判断
   *
   * 如果没有 config.enabled 属性，则默认启用（比如默认模块）
   */
  public isEnabled(): boolean {
    return this.config?.enabled ?? true
  }
  /**
   * 如果需要在控制面板上显示模块状态，推荐添加一个 status setter 用来设置模块状态
   *
   * @example
   * set status(s: moduleStatus) {
   *    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s
   * }
   */
  protected set status(_s: ModuleStatusTypes) {
    throw new Error('Method not implemented.')
  }

  constructor(moduleName: string) {
    this.moduleName = moduleName
    this.logger = new Logger(this.moduleName)
  }

  /**
   * 运行模块
   *
   * 默认模块必须返回一个空的Promise，
   * 其它模块若需要使用 await 可以返回一个空的Promise，否则无返回值
   */
  public run(): void | Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export default BaseModule
