import { unsafeWindow } from '$'
import { type XhrRequestConfig, type XhrRequestHandler, proxy } from 'ajax-hook'
import { type FetchHookProxyConfig, fproxy } from '@/library/fetch-hook'
import BaseModule from '@/modules/BaseModule'
import { getUrlFromFetchInput } from '@/library/utils'
import type { OnFrameTypes, RunAtMoment } from '@/types'
import { useModuleStore } from '@/stores'

class NoReport extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'document-start'
  static onFrame: OnFrameTypes = 'all'
  static runAfterDefault: boolean = false

  config = useModuleStore().moduleConfig.EnhanceExperience.noReport

  /**
   * 判断是否是需要拦截的 URL
   * @param url 需要判断的 URL
   */
  private static isTargetURL(url: string) {
    return url.includes('//data.bilibili.com') || url.includes('//data.bilivideo.com')
  }

  /**
   * 劫持一些能减少日志上报的方法
   * @param win window
   */
  private hookProperties(win: Window) {
    Object.defineProperty(win.navigator, 'sendBeacon', {
      value: () => {},
    })

    Object.defineProperties(win, {
      reportObserver: {
        get() {
          return () => {}
        },
        set() {},
      },
      reportConfig: {
        get() {
          return () => {}
        },
        set() {},
      },
      __biliMirror__: {
        get() {
          return {}
        },
        set() {},
      },
      __biliMirrorPbInstance__: {
        get() {
          return new Proxy(
            {},
            {
              get(_target, property) {
                const __biliMirrorPbInstance__: Record<string | symbol, any> = {
                  fpPromise: Promise.resolve(),
                  initBuvidPromise: Promise.resolve(),
                  miss: false,
                  options: {},
                  scheduler: {},
                  sequencer: {},
                  techEventReporter: {},
                  version: '',
                }
                return __biliMirrorPbInstance__[property] ?? (() => {})
              },
            },
          )
        },
        set() {},
      },
      __INITIAL_MIRROR__: {
        get() {
          return () => {}
        },
        set() {},
      },
      __MIRROR_REPORT__: {
        get() {
          return new Proxy(
            {},
            {
              get() {
                return () => {}
              },
            },
          )
        },
        set() {},
      },
      __MIRROR_VERSION__: {
        get() {
          return ''
        },
        set() {},
      },
      __statisObserver: {
        // 拦截该属性后会导致一些报错，如：
        // Error: 数据上报请勿重复初始化!
        // 但能减少大量日志上报请求，总的来看还是值得的
        get() {
          return new Proxy(
            {},
            {
              get(_target, property) {
                switch (property) {
                  case '__initConfig':
                  case '__loadedFlag':
                    return {}
                  case '__bufferFuns':
                    return []
                  case '__visitId':
                    return ''
                  default:
                    return () => {}
                }
              },
            },
          )
        },
        set() {},
      },
      __statisObserverConfig: {
        get() {
          return {}
        },
        set() {},
      },
      __cm_tracker__: {
        get() {
          return undefined
        },
        set() {},
      },
      bilicm: {
        get() {
          return {}
        },
        set() {},
      },
      BiliCm: {
        get() {
          return {}
        },
        set() {},
      },
    })
  }

  /**
   * 劫持 XHR 和 fetch 请求
   */
  private ajaxHook() {
    const ajaxHookProxyConfig = {
      onRequest(config: XhrRequestConfig, handler: XhrRequestHandler) {
        if (NoReport.isTargetURL(config.url)) {
          handler.resolve({
            config: config,
            status: 200,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
            response: '{}',
          })
        } else {
          handler.next(config)
        }
      },
    }

    const fetchHookConfig: FetchHookProxyConfig = {
      onRequest(config, handler) {
        const url = getUrlFromFetchInput(config.input)
        if (NoReport.isTargetURL(url)) {
          handler.resolve(new Response('{}'))
        } else {
          handler.next(config)
        }
      },
      onResponse(response, handler) {
        handler.next(response)
      },
    }

    proxy(ajaxHookProxyConfig, unsafeWindow)
    fproxy(fetchHookConfig, unsafeWindow)
  }

  public run() {
    this.logger.log('拦截日志数据上报模块开始运行')

    try {
      this.hookProperties(unsafeWindow)
      this.ajaxHook()
    } catch (e) {
      this.logger.error('拦截日志数据上报失败', e)
    }
  }
}

export default NoReport
