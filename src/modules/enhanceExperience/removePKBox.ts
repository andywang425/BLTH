import { dq } from '../../library/dom'
import BaseModule from '../BaseModule'

class RemovePKBox extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.removePKBox

  private async removePKEnter() {
    const getPKEnter = dq('#awesome-pk-vm')
    if (getPKEnter) {
      getPKEnter.remove()
    } else {
      this.logger.warn('未找到大乱斗入口')
    }
  }

  private async removePKToast() {
    const body = document.body

    const pkOB = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        console.log('mutation', mutation)
        mutation.addedNodes.forEach((addedNode) => {
          if (
            addedNode instanceof HTMLElement &&
            addedNode.classList.contains('link-toast') &&
            addedNode.innerHTML.includes('主播即将结束PK')
          ) {
            addedNode.remove()
          }
        })
      }
    })
    pkOB.observe(body, { childList: true })
  }

  private async removePKBox() {
    this.removePKEnter()
    this.removePKToast()
  }

  public async run() {
    this.logger.log('移除大乱斗元素模块开始运行')
    if (this.config.enabled) {
      try {
        await this.removePKBox()
      } catch (e) {
        this.logger.error('移除大乱斗元素失败', e)
      }
    }
  }
}

export default RemovePKBox
