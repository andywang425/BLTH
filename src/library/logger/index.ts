class Logger {
  private readonly NAME: string = 'BLTH'

  private prefix_title_str: string

  public title: string

  private get prefix(): string[] {
    return [
      `%c${this.NAME}%c[${new Date().toLocaleString()}]%c[${this.prefix_title_str}]%c:`,
      'font-weight: bold; color: white; background-color: #23ade5; padding: 1px 4px; border-radius: 4px;',
      'font-weight: bold; color: #0920e6;',
      'font-weight: bold;',
      ''
    ]
  }

  public log(...data: any) {
    console.log(...this.prefix, ...data)
  }

  public error(...data: any) {
    console.error(...this.prefix, ...data)
  }

  public warn(...data: any) {
    console.warn(...this.prefix, ...data)
  }

  constructor(title: string) {
    this.title = title
    this.prefix_title_str = title.split('_').join('][')
  }
}

export default Logger
