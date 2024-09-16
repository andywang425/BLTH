import ModuleError from '@/library/error/ModuleError'

class ModuleCriticalError extends ModuleError {
  public name: string = 'ModuleCriticalError'
  public moduleName: string

  constructor(moduleName: string, message?: string) {
    super(moduleName, message)

    this.moduleName = moduleName
  }
}

export default ModuleCriticalError
