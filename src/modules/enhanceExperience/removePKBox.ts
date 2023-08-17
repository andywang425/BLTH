import { dq } from '../../library/dom'
import BaseModule from '../BaseModule'

class RemovePKBox extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.removePKBox

  private removePKNode() {
    const blackElementList = ['#pk-vm', 'awesome-pk-vm']
    for (const selector of blackElementList) {
      const ele = dq(selector)
      if (ele) {
        ele.remove()
      } else {
        this.logger.warn('未找到大乱斗相关节点', selector)
      }
    }
  }

  private removePKToast() {
    const blackWordList = ['主播即将结束PK', '连线断开中']

    const pkOB = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        console.log('mutation', mutation)
        mutation.addedNodes.forEach((addedNode) => {
          if (
            addedNode instanceof HTMLElement &&
            addedNode.classList.contains('link-toast') &&
            blackWordList.some((word) => addedNode.textContent?.includes(word))
          ) {
            addedNode.style.display = 'none'
          }
        })
      }
    })

    pkOB.observe(document.body, { childList: true })
  }

  public async run() {
    this.logger.log('移除大乱斗元素模块开始运行')
    if (this.config.enabled) {
      this.removePKNode()
      this.removePKToast()
    }
  }
}

export default RemovePKBox
