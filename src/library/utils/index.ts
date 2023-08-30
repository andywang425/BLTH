import _ from 'lodash'
import { useModuleStore } from '../../stores/useModuleStore'
import { moduleEmitterEvents, runAtMoment } from '../../types/module'
import { unsafeWindow } from '$'

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
function sleep(miliseconds: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, miliseconds))
}

/**
 * 基于 Promise 和 mitt 的等待函数
 * @param type mitt 的 type 参数
 * @param timeout 超时时间
 */
function wait(type: keyof moduleEmitterEvents, timeout: number = -1): Promise<any> {
  return new Promise((resolve) => {
    useModuleStore().emitter.once(type, (event) => resolve(event))
    if (timeout !== -1) setTimeout(resolve, timeout)
  })
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
 * @param moment 模块运行时机
 */
function waitForMoment(moment: runAtMoment): Promise<void> {
  switch (moment) {
    case 'document-end': {
      return new Promise((resolve) => {
        if (document.readyState !== 'loading') {
          resolve()
        } else {
          document.addEventListener('DOMContentLoaded', () => resolve())
        }
      })
    }
    case 'window-load': {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve()
        } else {
          window.addEventListener('load', () => resolve())
        }
      })
    }
    default: {
      return Promise.resolve()
    }
  }
}

export { uuid, sleep, wait, packFormData, deepestIterate, getUrlFromFetchInput, waitForMoment }
