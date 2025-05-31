import { unsafeWindow } from '$'
import type { OnFrameTypes, RunAtMoment } from '@/types'
import BaseModule from '../BaseModule'

class SwitchLiveStreamQuality extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'window-load'
  static runAfterDefault: boolean = false
  static onFrame: OnFrameTypes = 'top'

  config = this.moduleStore.moduleConfig.EnhanceExperience.switchLiveStreamQuality

  private async waitForPlayer(): Promise<Window['livePlayer']> {
    return new Promise<Window['livePlayer']>((resolve, reject) => {
      const findPlayerTimer = setInterval(() => {
        if (
          unsafeWindow.livePlayer &&
          Object.hasOwn(unsafeWindow.livePlayer, 'switchQuality') &&
          Object.hasOwn(unsafeWindow.livePlayer, 'getPlayerInfo')
        ) {
          clearInterval(findPlayerTimer)
          clearTimeout(timeoutTimer)
          resolve(unsafeWindow.livePlayer)
        }
      }, 200)
      const timeoutTimer = setTimeout(() => {
        clearInterval(findPlayerTimer)
        reject('等待播放器超时')
      }, 10e3)
    })
  }

  private switchQuality(livePlayer: Window['livePlayer']) {
    let playerInfo = livePlayer.getPlayerInfo()

    if (playerInfo.liveStatus === 0) {
      this.logger.log('当前直播间未开播，无需切换画质')
      return
    }

    const targetQuality = playerInfo.qualityCandidates.find(({ desc }) =>
      desc.includes(this.config.qualityDesc)
    )

    if (!targetQuality) {
      this.logger.log('当前直播不支持目标画质，保持默认画质')
      return
    }

    const switchQualityTimer = setInterval(() => {
      playerInfo = livePlayer.getPlayerInfo()

      if (playerInfo.quality === targetQuality.qn) {
        this.logger.log(`已将画质切换为${this.config.qualityDesc}`, targetQuality)
        clearInterval(switchQualityTimer)
        clearTimeout(timeoutTimer)
      } else {
        livePlayer.switchQuality(targetQuality.qn)
      }
    }, 500)

    const timeoutTimer = setTimeout(() => {
      clearInterval(switchQualityTimer)
      this.logger.warn('多次尝试自动切换画质失败')
    }, 10e3)
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
