/**
 * 模块错误
 *
 * 如果需要把错误传递给上层去处理，可以抛出该错误
 */
class ModuleError extends Error {
  public name: string = 'ModuleError'
  public moduleName: string

  constructor(moduleName: string, message?: string) {
    super(message)

    this.moduleName = moduleName
  }
}

export default ModuleError
