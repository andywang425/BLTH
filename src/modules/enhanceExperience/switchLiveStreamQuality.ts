import { unsafeWindow } from '$'
import { isSelfTopFrame } from '../../library/dom'
import { runAtMoment } from '../../types/module'
import BaseModule from '../BaseModule'

class SwitchLiveStreamQuality extends BaseModule {
  static runMultiple: boolean = true
  static runAt: runAtMoment = 'window-load'

  config = this.moduleStore.moduleConfig.EnhanceExperience.switchLiveStreamQuality

  private async waitForPlayer() {
    return new Promise<Window['livePlayer']>((resolve, reject) => {
      const topWindow = unsafeWindow.top ? unsafeWindow.top : unsafeWindow
      const findPlayertimer = setInterval(() => {
        if (
          topWindow.livePlayer &&
          Object.prototype.hasOwnProperty.call(topWindow.livePlayer, 'switchQuality') &&
          Object.prototype.hasOwnProperty.call(topWindow.livePlayer, 'getPlayerInfo')
        ) {
          clearInterval(findPlayertimer)
          clearTimeout(timeoutTimer)
          resolve(topWindow.livePlayer)
        }
      }, 200)
      const timeoutTimer = setTimeout(() => {
        clearInterval(findPlayertimer)
        clearTimeout(timeoutTimer)
        reject()
      }, 10e3)
    })
  }

  private async switchQuality(livePlayer: Window['livePlayer']) {
    const playerInfo = livePlayer.getPlayerInfo()
    if (playerInfo.liveStatus === 0) {
      this.logger.log('当前直播间未开播')
    } else {
      const switchFn = () => {
        const targetQuality = playerInfo.qualityCandidates.find(
          ({ desc }) => desc === this.config.qualityDesc
        )
        if (targetQuality && playerInfo.quality !== targetQuality.qn) {
          livePlayer.switchQuality(targetQuality.qn)
          this.logger.log(`已将画质切换为${this.config.qualityDesc}`, targetQuality)
        }
      }

      // 如果位于特殊直播间，等当前 iframe 中嵌套的最后一个 iframe 加载完再去切换画质就不会出现一直转圈的现象
      // 对于普通直播间来说，绝大多数情况下直接切换画质即可，但仍有小概率出现一直转圈的现象
      const iframes = document.querySelectorAll('iframe')
      const lastIframe = iframes.item(iframes.length - 1)

      // 因为同源策略（same-origin policy）的关系，我们没法访问部分 iframe 的 document.readyState
      // 只能完全依赖于 onload
      // 因此设计了一个超时机制，超时了立刻切换画质
      const timer = setTimeout(
        () => {
          this.logger.log('等待最后一个iframe的load事件超时，立即切换画质')
          lastIframe.onload = null
          switchFn()
          // 这里针对特殊直播间和普通直播间设置了两套超时时间，特殊直播间超时时间更长
        },
        !isSelfTopFrame() ? 3000 : 1500
      )

      lastIframe.onload = () => {
        clearTimeout(timer)
        switchFn()
      }
    }
  }

  public async run() {
    this.logger.log('自动切换画质模块开始运行')
    if (this.config.enabled) {
      try {
        const livePlayer = await this.waitForPlayer()
        this.switchQuality(livePlayer)
      } catch (e) {
        this.logger.error('等待播放器超时')
      }
    }
  }
}

export default SwitchLiveStreamQuality
