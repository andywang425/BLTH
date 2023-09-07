import { unsafeWindow } from '$'
import { isSelfTopFrame } from '../../library/dom'
import { runAtMoment } from '../../types/module'
import BaseModule from '../BaseModule'

class SwitchLiveStreamQuality extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: runAtMoment = 'window-load'
  static runAfterDefault: boolean = false

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
      // 直接切换画质可能会有个加载中图标一直转圈，目前没有找到确切的最早可切换画质时机
      setTimeout(
        () => switchFn(),
        // 这里针对特殊直播间和普通直播间设置了两套超时时间，特殊直播间超时时间更长
        !isSelfTopFrame() ? 5000 : 2500
      )
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
