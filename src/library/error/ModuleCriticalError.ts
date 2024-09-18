import ModuleError from '@/library/error/ModuleError'

/**
 * 严重模块错误
 */
class ModuleCriticalError extends ModuleError {
  public name: string = 'ModuleCriticalError'
  public moduleName: string

  constructor(moduleName: string, message?: string) {
    super(moduleName, message)

    this.moduleName = moduleName
  }
}

export default ModuleCriticalError
