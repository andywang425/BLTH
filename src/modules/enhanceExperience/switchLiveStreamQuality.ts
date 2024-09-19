import { unsafeWindow } from '$'
import { isSelfTopFrame } from '@/library/dom'
import type { RunAtMoment } from '@/types'
import BaseModule from '../BaseModule'

class SwitchLiveStreamQuality extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'window-load'
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.switchLiveStreamQuality

  private async waitForPlayer(): Promise<Window['livePlayer']> {
    return new Promise<Window['livePlayer']>((resolve, reject) => {
      const topWindow = unsafeWindow.top ? unsafeWindow.top : unsafeWindow
      const findPlayertimer = setInterval(() => {
        if (
          topWindow.livePlayer &&
          Object.hasOwn(topWindow.livePlayer, 'switchQuality') &&
          Object.hasOwn(topWindow.livePlayer, 'getPlayerInfo')
        ) {
          clearInterval(findPlayertimer)
          clearTimeout(timeoutTimer)
          resolve(topWindow.livePlayer)
        }
      }, 200)
      const timeoutTimer = setTimeout(() => {
        clearInterval(findPlayertimer)
        clearTimeout(timeoutTimer)
        reject('等待播放器超时')
      }, 10e3)
    })
  }

  private switchQuality(livePlayer: Window['livePlayer']) {
    const playerInfo = livePlayer.getPlayerInfo()
    if (playerInfo.liveStatus === 0) {
      this.logger.log('当前直播间未开播，无需切换画质')
    } else {
      // 直接切换画质可能会有个加载中图标一直转圈，目前没有找到确切的最早可切换画质时机
      setTimeout(
        () => {
          const targetQuality = playerInfo.qualityCandidates.find(
            ({ desc }) => desc === this.config.qualityDesc
          )
          if (targetQuality) {
            if (playerInfo.quality !== targetQuality.qn) {
              livePlayer.switchQuality(targetQuality.qn)
              this.logger.log(`已将画质切换为${this.config.qualityDesc}`, targetQuality)
            } else {
              this.logger.log('当前画质已经是目标画质了，无需切换画质')
            }
          } else {
            this.logger.log('当前直播不支持目标画质，保持默认画质')
          }
        },
        // 这里针对特殊直播间和普通直播间设置了两套超时时间，特殊直播间超时时间更长
        isSelfTopFrame() ? 2500 : 5000
      )
    }
  }

  public async run(): Promise<void> {
    this.logger.log('自动切换画质模块开始运行')

    try {
      const livePlayer = await this.waitForPlayer()
      this.switchQuality(livePlayer)
    } catch (e) {
      this.logger.error('自动切换画质模块出错', e)
    }
  }
}

export default SwitchLiveStreamQuality
