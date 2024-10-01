import { useBiliStore } from '@/stores/useBiliStore'
import { unsafeWindow } from '$'
import BaseModule from '../BaseModule'
import ModuleCriticalError from '@/library/error/ModuleCriticalError'

class BilibiliLive extends BaseModule {
  static runOnMultiplePages: boolean = true

  /**
   * 获取 window.BilibiliLive
   */
  private getBilibiliLive(): Promise<Window['BilibiliLive']> {
    this.logger.log('unsafeWindow.BilibiliLive', unsafeWindow.BilibiliLive)

    return new Promise((resolve, reject) => {
      // window.Bilibili 的定义在 document.head 里，此时一定已经是个 Object 了
      if (unsafeWindow.BilibiliLive.UID !== 0) {
        resolve(unsafeWindow.BilibiliLive)
        return
      }
      unsafeWindow.BilibiliLive = new Proxy(unsafeWindow.BilibiliLive, {
        set(target: Window['BilibiliLive'], prop: keyof Window['BilibiliLive'], value: never) {
          target[prop] = value
          // UID 是最后被赋值的属性，等 UID 被赋值后 BilibiliLive 的所有属性就都被初始化了
          if (prop === 'UID') {
            // 取消代理，还原为 Object
            unsafeWindow.BilibiliLive = target
            // 返回 BilibiliLive
            resolve(unsafeWindow.BilibiliLive)
          }
          return true
        }
      })

      setTimeout(() => reject(new Error('获取 BilibiliLive 超时')), 10e3)
    })
  }

  public async run(): Promise<void> {
    try {
      useBiliStore().BilibiliLive = await this.getBilibiliLive()
    } catch (error: any) {
      throw new ModuleCriticalError(this.moduleName, error.message)
    }
  }
}

export default BilibiliLive
