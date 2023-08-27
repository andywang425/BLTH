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
 * 判断当前脚本是否运行在 BilibiliLive 所在的 frame
 *
 * 注：大部分B站直播间页面只有一个iframe，共两个frame
 *
 * 特殊的直播间（背景很好看的那种）有两个iframe，共三个frame
 */
const isTargetFrame = (): boolean => {
  if (unsafeWindow.document.head.innerHTML.includes('BilibiliLive')) {
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
 * 获取顶层 frame
 */
const topFrameDocuemnt = (): Document | undefined => unsafeWindow.top?.document

export { dq, dqa, dce, pollingQuery, isTargetFrame, isSelfTopFrame, topFrameDocuemnt }
