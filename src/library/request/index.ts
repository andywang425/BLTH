import { GM_xmlhttpRequest, GmXhrRequest } from '$'
import _ from 'lodash'

class Request {
  /** 请求 URL 的前缀 */
  private url_prefix: string
  /**
   * 请求 Header 中 Origin 的值，为了方便同时也是 Referer 的值
   */
  private origin: string

  constructor(url_prefix?: string, orgin?: string) {
    this.url_prefix = url_prefix ?? ''
    this.origin = orgin ?? 'https://bilibili.com'
  }

  /**
   * 发起一个 GET 请求
   * @param url 请求 URL 除去前缀的部分
   * @param params URL 参数
   * @param otherDetails GM_xmlhttpRequest 的 details 参数
   * @returns Promise
   */
  public get(url: string, params?: Record<string, any>, otherDetails?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const defaultDetails: GmXhrRequest<never, any> = {
        method: 'GET',
        url: this.url_prefix + url + (params ? '?' + new URLSearchParams(params).toString() : ''),
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
          reject(err)
        }
      }
      const details = _.defaultsDeep(otherDetails, defaultDetails)
      GM_xmlhttpRequest(details)
    })
  }

  /**
   * 发起一个 POST 请求
   * @param url 请求 URL 除去前缀的部分
   * @param data application/x-www-form-urlencoded 其它类型的数据需要在 otherDetails 中定义
   * @param otherDetails GM_xmlhttpRequest 的 details 参数
   * @returns Promise
   */
  public post(url: string, data?: Record<string, any>, otherDetails?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const defaultDetails: GmXhrRequest<never, any> = {
        method: 'POST',
        url: this.url_prefix.concat(url),
        data: new URLSearchParams(data).toString(),
        responseType: 'json',
        headers: {
          Accept: 'application/json, text/plain, */*',
          Referer: this.origin,
          Origin: this.origin,
          'Sec-Fetch-Site': 'same-site',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (response) {
          resolve(response.response)
        },
        onerror: function (err) {
          reject(err)
        }
      }
      const details = _.defaultsDeep(otherDetails, defaultDetails)
      if (details.headers['Content-Type'] === 'multipart/form-data') {
        // 如果要提交 multipart/form-data 格式的数据，删除该属性让浏览器自动生成 header
        delete details.headers['Content-Type']
      }
      GM_xmlhttpRequest(details)
    })
  }
}

export default Request
