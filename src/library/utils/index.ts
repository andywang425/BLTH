import _ from 'lodash'
import { useModuleStore } from '@/stores/useModuleStore'
import type { ModuleEmitterEvents, RunAtMoment } from '@/types'

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
 * 基于 Promise 和 mitt 的等待函数
 * @param type mitt 的 type 参数
 * @param timeout 超时时间
 */
function wait(type: keyof ModuleEmitterEvents, timeout: number = -1): Promise<any> {
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

export { uuid, sleep, wait, packFormData, deepestIterate, getUrlFromFetchInput, waitForMoment }
