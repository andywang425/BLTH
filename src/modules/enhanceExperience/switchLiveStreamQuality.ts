import type { OnFrameTypes, RunAtMoment } from '@/types'
import BaseModule from '@/modules/BaseModule'
import { usePlayerStore, useModuleStore } from '@/stores'

class SwitchLiveStreamQuality extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'window-load'
  static runAfterDefault: boolean = false
  static onFrame: OnFrameTypes = 'top'

  config = useModuleStore().moduleConfig.EnhanceExperience.switchLiveStreamQuality

  private playerStore = usePlayerStore()

  private async switchQuality(livePlayer: Window['livePlayer']) {
    let playerInfo = livePlayer.getPlayerInfo()

    await this.playerStore.waitForLiveStatus(1, {
      onNeedWait: () => {
        this.logger.log('当前直播间未开播，开播后再切换画质')
      },
    })

    const isHDR = this.config.qualityDesc.includes('HDR')
    const searchStr = this.config.qualityDesc.replace(/（.*）/, '')

    const targetQuality =
      playerInfo.qualityCandidates.find(
        ({ desc, hdrType }) => desc.includes(searchStr) && hdrType > 0 === isHDR,
      ) ??
      // 尝试寻找不带 HDR 的画质
      (isHDR ? playerInfo.qualityCandidates.find(({ desc }) => desc.includes(searchStr)) : null)

    if (!targetQuality) {
      this.logger.log('当前直播不支持目标画质，保持默认画质')
      return
    }

    if (isHDR && targetQuality.hdrType === 0) {
      this.logger.log(`当前直播不支持 ${this.config.qualityDesc}，回退到 ${targetQuality.desc}`)
    }

    const switchQualityTimer = setInterval(() => {
      playerInfo = livePlayer.getPlayerInfo()

      if (playerInfo.quality === targetQuality.qn && playerInfo.hdrType === targetQuality.hdrType) {
        this.logger.log(`已将画质切换为 ${targetQuality.desc}`, targetQuality)
        clearInterval(switchQualityTimer)
        clearTimeout(timeoutTimer)
      } else {
        livePlayer.switchQuality(targetQuality.qn, targetQuality.hdrType)
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
      await this.switchQuality(livePlayer)
    } catch (e) {
      this.logger.error('自动切换画质模块出错', e)
    }
  }
}

export default SwitchLiveStreamQuality
