import ModuleError from '@/library/error/ModuleError'

/**
 * 严重模块错误
 */
class ModuleCriticalError extends ModuleError {
  public name: string = 'ModuleCriticalError'

  constructor(moduleName: string, message?: string) {
    super(moduleName, message)
  }
}

export default ModuleCriticalError
