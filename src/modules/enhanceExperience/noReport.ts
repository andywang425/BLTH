import { unsafeWindow } from '$'
import { proxy } from 'ajax-hook'
import { fproxy } from '../../library/fetch-hook'
import BaseModule from '../BaseModule'
import { getUrlFromFetchInput } from '../../library/utils'

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
    proxy(
      {
        onRequest: (config, handler) => {
          if (NoReport.isTargetURL(config.url)) {
            console.log('ajax', config)
            handler.resolve({
              config: config,
              status: 200,
              headers: {
                'Content-Type': 'text/plain; charset=utf-8'
              },
              response: 'ok'
            })
          } else {
            console.log('no handle ajax', config)
            handler.next(config)
          }
        }
      },
      unsafeWindow
    )

    fproxy({
      onRequest(config, handler) {
        const url = getUrlFromFetchInput(config.input)
        if (NoReport.isTargetURL(url)) {
          console.log('fetch', config, handler)
          handler.resolve(new Response('ok'))
        } else {
          console.log('no handle fetch', config, handler)
          handler.next()
        }
      }
    })
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
