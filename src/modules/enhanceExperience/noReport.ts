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
      },
      unsafeWindow
    )

    fproxy({
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
