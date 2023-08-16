import BaseModule from '../BaseModule'

class RemovePKBox extends BaseModule {
  static runMultiple = true

  config = this.moduleStore.moduleConfig.EnhanceExperience.removePKBox

  private async removePKEnter() {
    const getPKEnter = document.getElementById('awesome-pk-vm')
    if (getPKEnter) {
      getPKEnter.remove()
    } else {
      this.logger.error('未找到大乱斗入口')
    }
  }

  private async removePKToast() {
    const body = document.body

    const pkOB = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
          const addedNode = mutation.addedNodes[0] as HTMLElement
          if (addedNode.innerText && addedNode.innerText.includes('10秒后主播即将结束PK')) {
            const getPKToast = document.querySelector('.link-toast.info.center-animation')
            if (getPKToast) {
              getPKToast.remove()
            }
          }
        }
      }
    })
    pkOB.observe(body, { childList: true, subtree: true })
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
