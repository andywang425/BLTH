import { GM_xmlhttpRequest, type GmXhrRequest } from '$'
import _ from 'lodash'
import { addURLParams } from '../utils'

class Request {
  /** 请求 URL 的前缀 */
  private readonly url_prefix: string
  /**
   * 请求 Header 中 Origin 的值，为了方便同时也是 Referer 的值
   */
  private readonly origin: string

  constructor(url_prefix?: string, orgin?: string) {
    this.url_prefix = url_prefix ?? ''
    this.origin = orgin ?? 'https://bilibili.com'
  }

  /**
   * 发起一个 GET 请求
   * @param url 请求 URL 除去前缀的部分
   * @param params URL 参数
   * @param otherDetails GM_xmlhttpRequest 的 details 参数
   */
  public get(
    url: string,
    params?: Record<string, any> | string,
    otherDetails?: Record<string, any>
  ): Promise<any> {
    url = addURLParams(this.url_prefix + url, params)

    return new Promise((resolve, reject) => {
      const defaultDetails: GmXhrRequest<never, any> = {
        method: 'GET',
        url,
        responseType: 'json',
        headers: {
          Accept: 'application/json, text/plain, */*',
          Referer: this.origin,
          Origin: this.origin,
          'Sec-Fetch-Site': 'same-site'
        },
        onload: function (response) {
          resolve(response.response)
        },
        onerror: function (err) {
          reject(new Error(JSON.stringify(err)))
        }
      }

      const details = _.defaultsDeep(otherDetails, defaultDetails)
      GM_xmlhttpRequest(details)
    })
  }

  /**
   * 发起一个 POST 请求
   * @param url 请求 URL 除去前缀的部分
   * @param data POST data
   * @param otherDetails GM_xmlhttpRequest 的 details 参数（特别的，可以提供 params 属性作为 URL 参数）
   */
  public post(
    url: string,
    data?: Record<string, any> | string,
    otherDetails?: Record<string, any>
  ): Promise<any> {
    const headers: Record<string, string> = {
      Accept: 'application/json, text/plain, */*',
      Referer: this.origin,
      Origin: this.origin,
      'Sec-Fetch-Site': 'same-site',
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (data instanceof FormData) {
      // 如果要提交表单，删除 Content-Type 让浏览器自动生成
      delete headers['Content-Type']
    } else if (typeof data === 'object') {
      // data 类型为 Record，转换为 string
      data = new URLSearchParams(data).toString()
    }

    url = addURLParams(this.url_prefix + url, otherDetails?.params)
    delete otherDetails?.params

    return new Promise((resolve, reject) => {
      const defaultDetails: GmXhrRequest<never, any> = {
        method: 'POST',
        url,
        data,
        responseType: 'json',
        headers,
        onload: function (response) {
          resolve(response.response)
        },
        onerror: function (err) {
          reject(new Error(JSON.stringify(err)))
        }
      }

      const details = _.defaultsDeep(otherDetails, defaultDetails)
      GM_xmlhttpRequest(details)
    })
  }
}

export default Request
