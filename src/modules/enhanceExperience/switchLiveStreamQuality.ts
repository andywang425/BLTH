import type { OnFrameTypes, RunAtMoment } from '@/types'
import BaseModule from '../BaseModule'
import { usePlayerStore } from '@/stores/usePlayerStore'

class SwitchLiveStreamQuality extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'window-load'
  static runAfterDefault: boolean = false
  static onFrame: OnFrameTypes = 'top'

  config = this.moduleStore.moduleConfig.EnhanceExperience.switchLiveStreamQuality

  private playerStore = usePlayerStore()

  private async switchQuality(livePlayer: Window['livePlayer']) {
    let playerInfo = livePlayer.getPlayerInfo()

    await this.playerStore.waitForLiveStatus(1, {
      onNeedWait: () => {
        this.logger.log('当前直播间未开播，开播后再切换画质')
      },
    })

    const targetQuality = playerInfo.qualityCandidates.find(({ desc }) =>
      desc.includes(this.config.qualityDesc),
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
      const livePlayer = await this.playerStore.getPlayer()
      this.switchQuality(livePlayer)
    } catch (e) {
      this.logger.error('自动切换画质模块出错', e)
    }
  }
}

export default SwitchLiveStreamQuality
