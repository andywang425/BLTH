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
 * 注：大部分B站直播间页面只有两个iframe（其中只有一个iframe的源是live.bilibili.com），共三个frame
 *
 * 特殊的直播间（背景很好看的那种，top frame被用来当背景板了）有三个iframe（其中只有两个iframe的源是live.bilibili.com），共四个frame
 */
const isTargetFrame = (): boolean => {
  console.log('d h i', document.head.innerHTML)
  console.log('w l h', window.location.href)
  console.log('iframes', document.querySelectorAll('iframe').length)
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
 * 获取顶层 frame 的 document
 */
const topFrameDocuemnt = (): Document | undefined => unsafeWindow.top?.document

export { dq, dqa, dce, pollingQuery, isTargetFrame, isSelfTopFrame, topFrameDocuemnt }
