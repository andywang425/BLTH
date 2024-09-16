class ModuleError extends Error {
  public name: string = 'ModuleError'
  public moduleName: string

  constructor(moduleName: string, message?: string) {
    super(message)

    this.moduleName = moduleName
  }
}

export default ModuleError
