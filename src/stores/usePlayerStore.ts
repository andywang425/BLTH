import { unsafeWindow } from '$'
import { defineStore } from 'pinia'
import { waitForMoment } from '@/library/utils'
import { readonly, ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // 播放器实例（window.livePlayer）
  const player = ref<Window['livePlayer']>()

  /**
   * 获取播放器实例
   * @param interval 检查间隔（毫秒），默认 200 毫秒
   * @param timeout 超时时间（毫秒），默认 10 秒
   */
  const getPlayer = async (
    interval: number = 200,
    timeout: number = 12e3,
  ): Promise<Window['livePlayer']> => {
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
      }, interval)

      const timeoutTimer = setTimeout(() => {
        clearInterval(findPlayerTimer)
        reject('等待播放器超时')
      }, timeout)
    })
  }

  /**
   * 等待直播间开播或结束
   *
   * @param status 直播状态：0 未开播，1 开播
   * @param interval 检查间隔（毫秒），默认 10 秒
   * @param timeout 超时时间（毫秒），默认不会超时
   * @returns 是否在超时前达到目标状态
   */
  const waitForLiveStatus = async (
    status: 0 | 1,
    interval: number = 10e3,
    timeout?: number,
  ): Promise<boolean> => {
    const player = await getPlayer()

    const liveStatus = player.getPlayerInfo().liveStatus

    if (liveStatus === status) {
      return true
    }

    return new Promise<boolean>((resolve) => {
      const liveStatusTimer = setInterval(() => {
        const liveStatus = player.getPlayerInfo().liveStatus
        if (liveStatus === status) {
          clearTimeout(timeoutTimer)
          clearInterval(liveStatusTimer)
          resolve(true)
        }
      }, interval)

      const timeoutTimer =
        timeout &&
        setTimeout(() => {
          clearInterval(liveStatusTimer)
          resolve(false)
        }, timeout)
    })
  }

  return {
    player: readonly(player),
    getPlayer,
    waitForLiveStatus,
  }
})
