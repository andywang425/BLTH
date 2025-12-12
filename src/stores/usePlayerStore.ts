import { unsafeWindow } from '$'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { waitForMoment } from '@/library/utils'
import { ref } from 'vue'
import _ from 'lodash'

export interface PlayerStoreConfig {
  getPlayer: {
    /** 检查间隔（毫秒），默认 200 毫秒 */
    interval?: number
    /** 超时时间（毫秒），默认 10 秒 */
    timeout?: number
  }
  waitForLiveStatus: {
    /** 检查间隔（毫秒），默认 10 秒 */
    interval?: number
    /** 超时时间（毫秒），默认不会超时 */
    timeout?: number
    /** 立刻成功回调 */
    onImmediateSuccess?: () => void
    /** 需要等待回调 */
    onNeedWait?: () => void
  }
}

const DEFAULT_CONFIG: PlayerStoreConfig = {
  getPlayer: {
    interval: 200,
    timeout: 12e3,
  },
  waitForLiveStatus: {
    interval: 10e3,
  },
}

export const usePlayerStore = defineStore('player', () => {
  // 播放器实例（window.livePlayer）
  const player = ref<Window['livePlayer']>()

  /**
   * 获取播放器实例
   * @param config 配置
   */
  const getPlayer = async (
    config: PlayerStoreConfig['getPlayer'] = DEFAULT_CONFIG.getPlayer,
  ): Promise<Window['livePlayer']> => {
    _.defaults(config, DEFAULT_CONFIG.getPlayer)

    if (player.value) {
      return player.value
    }

    const isPlayerAvailable = (): boolean => {
      return unsafeWindow.livePlayer && Object.hasOwn(unsafeWindow.livePlayer, 'getPlayerInfo')
    }

    await waitForMoment('window-load')

    if (isPlayerAvailable()) {
      player.value = unsafeWindow.livePlayer
      return player.value
    }

    return new Promise<Window['livePlayer']>(async (resolve, reject) => {
      const findPlayerTimer = setInterval(() => {
        if (isPlayerAvailable()) {
          clearInterval(findPlayerTimer)
          clearTimeout(timeoutTimer)
          player.value = unsafeWindow.livePlayer
          resolve(player.value)
        }
      }, config.interval)

      const timeoutTimer = setTimeout(() => {
        clearInterval(findPlayerTimer)
        reject('等待播放器超时')
      }, config.timeout)
    })
  }

  /**
   * 等待直播间开播或结束
   *
   * @param status 直播状态：0 未开播，1 开播
   * @param config 配置
   * @returns 是否在超时前达到目标状态
   */
  const waitForLiveStatus = async (
    status: 0 | 1,
    config: PlayerStoreConfig['waitForLiveStatus'] = DEFAULT_CONFIG.waitForLiveStatus,
  ): Promise<boolean> => {
    _.defaults(config, DEFAULT_CONFIG.waitForLiveStatus)

    const player = await getPlayer()

    const liveStatus = player.getPlayerInfo().liveStatus

    if (liveStatus === status) {
      config.onImmediateSuccess?.()
      return true
    }

    config.onNeedWait?.()

    return new Promise<boolean>((resolve) => {
      const liveStatusTimer = setInterval(() => {
        const liveStatus = player.getPlayerInfo().liveStatus
        if (liveStatus === status) {
          clearTimeout(timeoutTimer)
          clearInterval(liveStatusTimer)
          resolve(true)
        }
      }, config.interval)

      const timeoutTimer =
        config.timeout &&
        setTimeout(() => {
          clearInterval(liveStatusTimer)
          resolve(false)
        }, config.timeout)
    })
  }

  return {
    player,
    getPlayer,
    waitForLiveStatus,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
