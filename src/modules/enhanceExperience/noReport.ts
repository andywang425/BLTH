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

  private async ajaxHook() {
    const ajaxHookProxyConfig = {
      onRequest: (config: XhrRequestConfig, handler: XhrRequestHandler) => {
        if (NoReport.isTargetURL(config.url)) {
          console.log('ajax-hook', config)
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
          console.log('fetch-hook', config)
          handler.resolve(new Response('ok'))
        } else {
          handler.next(config)
        }
      },
      onResponse(response, handler) {
        handler.next(response)
      }
    }

    Object.defineProperty(unsafeWindow.navigator, 'sendBeacon', {
      value: () => {
        return true
      }
    })

    Object.defineProperty(unsafeWindow, 'reportObserver', {
      get() {
        return {}
      },
      set() {}
    })

    Object.defineProperty(unsafeWindow, 'reportConfig', {
      get() {
        return {}
      },
      set() {}
    })

    proxy(ajaxHookProxyConfig, unsafeWindow)
    fproxy(fetchHookConfig, unsafeWindow)

    if (!isSelfTopFrame()) {
      Object.defineProperty(unsafeWindow.top!.navigator, 'sendBeacon', {
        value: () => {
          return true
        }
      })

      Object.defineProperty(unsafeWindow.top, 'reportObserver', {
        get() {
          return {}
        },
        set() {}
      })

      Object.defineProperty(unsafeWindow.top, 'reportConfig', {
        get() {
          return {}
        },
        set() {}
      })

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
