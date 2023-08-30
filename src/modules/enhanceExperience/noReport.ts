import { unsafeWindow } from '$'
import { XhrRequestConfig, XhrRequestHandler, proxy } from 'ajax-hook'
import { Iproxy, fproxy } from '../../library/fetch-hook'
import BaseModule from '../BaseModule'
import { getUrlFromFetchInput } from '../../library/utils'
import { isSelfTopFrame } from '../../library/dom'

class NoReport extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.noReport

  private static isTargetURL(url: string) {
    if (url.includes('//data.bilibili.com') || url.includes('//data.bilivideo.com')) {
      return true
    } else {
      return false
    }
  }

  private hookProperties(win: Window) {
    Object.defineProperty(win.navigator, 'sendBeacon', {
      value: () => {
        return true
      }
    })

    Object.defineProperties(win, {
      reportObserver: {
        get() {
          return {}
        },
        set() {}
      },
      reportConfig: {
        get() {
          return {}
        },
        set() {}
      }
    })
  }

  private async ajaxHook() {
    const ajaxHookProxyConfig = {
      onRequest: (config: XhrRequestConfig, handler: XhrRequestHandler) => {
        if (NoReport.isTargetURL(config.url)) {
          handler.resolve({
            config: config,
            status: 200,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8'
            },
            response: 'ok'
          })
        } else {
          handler.next(config)
        }
      }
    }
    const fetchHookConfig: Iproxy = {
      onRequest(config, handler) {
        const url = getUrlFromFetchInput(config.input)
        if (NoReport.isTargetURL(url)) {
          handler.resolve(new Response('ok'))
        } else {
          handler.next(config)
        }
      },
      onResponse(response, handler) {
        handler.next(response)
      }
    }

    this.hookProperties(unsafeWindow)
    proxy(ajaxHookProxyConfig, unsafeWindow)
    fproxy(fetchHookConfig, unsafeWindow)

    if (!isSelfTopFrame()) {
      // 如果处于特殊直播间（有多个frame），也拦截顶层frame的日志上报
      // 但由于注入时机的关系，初期的一些日志报上拦截不到
      // 要优化这一点的话可能要调整模块运行逻辑，允许模块在初期的时候就能在多个frame上允许
      this.hookProperties(unsafeWindow.top as Window)
      proxy(ajaxHookProxyConfig, unsafeWindow.top as Window)
      fproxy(fetchHookConfig, unsafeWindow.top as Window)
    }
  }

  public async run() {
    this.logger.log('拦截日志数据上报模块开始运行')
    if (this.config.enabled) {
      try {
        await this.ajaxHook()
      } catch (e) {
        this.logger.error('拦截日志数据上报失败', e)
      }
    }
  }
}

export default NoReport
