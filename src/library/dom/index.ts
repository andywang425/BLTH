import { unsafeWindow } from '$'

// 一些常用 DOM 方法的简写
const dq = document.querySelector.bind(document)
const dqa = document.querySelectorAll.bind(document)
const dce = document.createElement.bind(document)

/**
 * 使用轮询的方式查找目标元素
 * @param element 目标元素的父节点
 * @param selectors 选择器
 * @param intervel 轮询查找间隔
 * @param timeout 超时时间
 * @param immediate 是否立即查找一次
 */
const pollingQuery = (
  element: Document | Element,
  selectors: string,
  intervel: number,
  timeout: number,
  immediate: boolean = true
): Promise<Element> => {
  return new Promise((resolve, reject) => {
    if (immediate) {
      const ele = element.querySelector(selectors)
      if (ele) {
        resolve(ele)
        return
      }
    }
    const timerPolling = setInterval(() => {
      const ele: Element | null = element.querySelector(selectors)
      if (ele) {
        clearTimeout(timerPolling)
        resolve(ele)
      }
    }, intervel)
    const timerTimeout = setTimeout(() => {
      clearTimeout(timerPolling)
      clearTimeout(timerTimeout)
      reject()
    }, timeout)
  })
}

/**
 * 判断当前脚本是否运行在 BilibiliLive 所在的 frame（需要等到 document-body 后才能判断）
 *
 * 注：大部分B站直播间页面只有两个iframe，共三个 frame；
 * 在这种情况下，脚本只会被注入到顶层 frame
 *
 * 特殊的直播间（背景很好看的那种，顶层 frame 被用来当背景板了）有三个 iframe，共四个 frame；
 * 此时脚本会被注入到顶层 frame 和一个 iframe
 */
const isTargetFrame = (): boolean => {
  if (document.head.innerHTML.includes('BilibiliLive')) {
    return true
  } else {
    return false
  }
}

/**
 * 判断是否在顶层 frame
 */
const isSelfTopFrame = (): boolean => unsafeWindow.self === unsafeWindow.top

/**
 * 获取顶层 frame 的 documentElement
 */
const topFrameDocuemntElement = (): HTMLElement | undefined =>
  unsafeWindow.top?.document?.documentElement

export { dq, dqa, dce, pollingQuery, isTargetFrame, isSelfTopFrame, topFrameDocuemntElement }
