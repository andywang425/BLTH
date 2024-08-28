// 一些常用 DOM 方法的简写
const dq = document.querySelector.bind(document)
const dqa = document.querySelectorAll.bind(document)
const dce = document.createElement.bind(document)

/**
 * 等待目标元素出现
 * @param parentElement 目标元素的父节点（必须已存在）
 * @param selector 选择器
 * @param timeout 超时时间
 */
function waitForElement(
  parentElement: Element,
  selector: string,
  timeout: number = 5000
): Promise<Element> {
  return new Promise((resolve, reject) => {
    const element = parentElement.querySelector(selector)

    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const element = parentElement.querySelector(selector)
      if (element) {
        clearTimeout(timeoutId)
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(parentElement, {
      childList: true,
      subtree: true
    })

    const timeoutId = setTimeout(() => {
      observer.disconnect()
      reject(new Error(`无法在${timeout}毫秒内找到${parentElement.localName}的子节点${selector}`))
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
const isTargetFrame = (): boolean => document.head.innerHTML.includes('BilibiliLive')

/**
 * 判断是否在顶层 frame
 */
const isSelfTopFrame = (): boolean => window.self === window.top

/**
 * 获取顶层 frame 的 documentElement
 */
const topFrameDocumentElement = (): HTMLElement | undefined => window.top?.document.documentElement

export { dq, dqa, dce, waitForElement, isTargetFrame, isSelfTopFrame, topFrameDocumentElement }
