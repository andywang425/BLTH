import _ from 'lodash'
import CryptoJS from 'crypto-js'
import type { RunAtMoment } from '@/types'
import { ts } from '@/library/luxon'
import { useBiliStore } from '@/stores/useBiliStore'

/**
 * 生成一个 version 4 uuid
 * @returns uuid
 */
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const randomInt = (16 * Math.random()) | 0
    return ('x' === char ? randomInt : (3 & randomInt) | 8).toString(16)
  })
}

/**
 * 基于 Promise 的睡眠函数
 * @param miliseconds 睡眠时间
 */
function sleep(miliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, miliseconds))
}

/**
 * 从 URL 中获取文件名
 * @param url
 */
function getFilenameFromUrl(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1).split('.')[0]
}

/**
 * 为 URL 添加查询参数
 * @param url URL
 * @param params 查询参数
 */
function addURLParams(url: string, params?: Record<string, any> | string): string {
  if (!params) {
    return url
  }

  if (typeof params === 'string') {
    return url + '?' + params
  } else {
    return url + '?' + new URLSearchParams(params).toString()
  }
}

/**
 * 对请求参数进行 wbi 签名
 * @param params 请求参数
 */
function wbiSign(params: Record<string, string | number | object>): string {
  // 添加 wts 字段（当前秒级时间戳）
  params.wts = ts()
  // 按照键对参数进行排序
  const query = Object.keys(params)
    .sort()
    .map((key) => {
      // 过滤 value 中的 !'()* 字符
      const value = params[key].toString().replace(/[!'()*]/g, '')
      // 注：空格需被编码为%20而不是+，因此不能使用URLSearchParams
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
  // 计算 w_rid
  const wbiSign = CryptoJS.MD5(query + useBiliStore().wbiSalt).toString()

  return query + '&w_rid=' + wbiSign
}

/**
 * 把一个普通对象打包为 FormData
 * @param json 一个不包含嵌套对象的对象
 * @returns FormData
 */
function packFormData(json: Record<string, any>): FormData {
  const formData = new FormData()
  _.forEach(json, (value, key) => formData.append(key, value.toString()))
  return formData
}

/**
 * 遍历一个对象最深层的属性
 * @param obj 要遍历的对象
 * @param fn 回调函数，参数是最深层属性的值和当前路径
 * @param path 遍历对象的路径，默认从最外层开始遍历
 */
function deepestIterate(obj: any, fn: (value: any, path: string) => void, path?: string) {
  _.forOwn(obj, function (value, key) {
    const newPath = path ? path + '.' + key : key
    if (_.isPlainObject(value) && !_.isEmpty(value)) {
      deepestIterate(value, fn, newPath)
    } else {
      fn(value, newPath)
    }
  })
}

/**
 * 从 fetch 的 input 参数中获取 URL
 * @param input fetch 的第一个参数
 * @returns URL
 */
function getUrlFromFetchInput(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input
  } else if (input instanceof URL) {
    return input.toString()
  } else if (input instanceof Request) {
    return input.url
  } else {
    return 'Incorrect input'
  }
}

/**
 * 等待直到指定时刻
 * @param moment 运行时机
 */
function waitForMoment(moment: RunAtMoment): Promise<void> {
  switch (moment) {
    case 'document-start': {
      // 在 document-start 阶段，document-head 可能为 null
      return Promise.resolve()
    }
    case 'document-head': {
      // 在 document-head 阶段，document.head 已经出现但是部分内部节点可能还没出现
      return new Promise((resolve) => {
        if (document.head) {
          resolve()
        } else {
          const observer = new MutationObserver(() => {
            if (document.head) {
              observer.disconnect()
              resolve()
            }
          })
          observer.observe(document.documentElement, { childList: true })
        }
      })
    }
    case 'document-body': {
      // 在 document-body 阶段，document.body 已经出现但是部分内部节点可能还没出现
      return new Promise((resolve) => {
        if (document.body) {
          resolve()
        } else {
          const observer = new MutationObserver(() => {
            if (document.body) {
              observer.disconnect()
              resolve()
            }
          })
          observer.observe(document.documentElement, { childList: true })
        }
      })
    }
    case 'document-end': {
      // 在 document-end 阶段，DOM 加载完成，但部分资源可能还没获取到（比如图片）
      return new Promise((resolve) => {
        if (document.readyState !== 'loading') {
          resolve()
        } else {
          document.addEventListener('DOMContentLoaded', () => resolve())
        }
      })
    }
    case 'window-load': {
      // 在 window-load 阶段，整个网页加载完毕
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve()
        } else {
          window.addEventListener('load', () => resolve())
        }
      })
    }
    default: {
      return Promise.reject('Illegal moment')
    }
  }
}

/**
 * 将数组转换为 Map（key 为数组元素，value 为元素下标）
 * @param arr 数组
 */
function arrayToMap<T>(arr: T[]): Map<T, number> {
  return new Map(arr.map((value, index) => [value, index]))
}

export {
  uuid,
  sleep,
  getFilenameFromUrl,
  addURLParams,
  wbiSign,
  packFormData,
  deepestIterate,
  getUrlFromFetchInput,
  waitForMoment,
  arrayToMap
}
