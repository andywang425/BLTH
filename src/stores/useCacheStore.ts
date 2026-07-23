import { acceptHMRUpdate, defineStore } from 'pinia'
import { toRaw, ref, watch } from 'vue'
import Storage from '@/library/storage'
import type { Cache } from '@/types'
import { unsafeWindow } from '$'
import { tsm } from '@/library/luxon'

type ScriptType = 'Main' | 'SubMain' | 'Other'

export const useCacheStore = defineStore('cache', () => {
  // 缓存
  const cache = ref<Cache>(Storage.getCache())

  /**
   * 表示当前 BLTH 的类型
   * - `Main`: 运行`runOnMultiplePages`为`false`的模块，有存活心跳
   * - `SubMain`: 运行`runOnMultiplePages`为`false`的模块，无存活心跳
   * - `Other`: 运行`runOnMultiplePages`为`true`的模块，无存活心跳
   *
   * 用户在打开第一个直播间页面时运行的第一个 BLTH 一定是 Main BLTH，
   * 假如是特殊直播间，在第二个 frame 上还会有个 SubMain BLTH。在这种情况下，SubMain 能通过 `isTargetFrame()` 判定而 Main 不行。
   * 之后打开的直播间页面上运行的则是 Other BLTH。
   * 如果关掉 Main BLTH 所在的页面，那么下一个打开的页面上所运行的 BLTH 则为 Main BLTH（也可能会有 SubMain BLTH）。
   * 增加这一概念主要时为了确保任务类模块不会重复运行（比如完成各种每日任务的模块）。
   */
  const currentScriptType = ref<ScriptType>('Main')

  /**
   * Main BLTH 存活心跳
   */
  function startMainBLTHAliveHeartBeat(): void {
    const heartBeatTimer = setInterval(() => {
      // 每隔 5 秒写一次时间戳，表示有一个 Main BLTH 正在运行
      cache.value.lastAliveHeartBeatTime = tsm()
    }, 5000)

    window.addEventListener('unload', () => {
      clearInterval(heartBeatTimer)

      const rawCache = toRaw(cache.value)
      rawCache.lastAliveHeartBeatTime = 0
      // 手动写缓存，防止 watch 监听写入延迟过大无法在页面关闭前写入缓存
      Storage.setCache(rawCache)
    })
  }

  /**
   * 检查当前脚本的类型
   */
  function checkCurrentScriptType(): void {
    if (
      cache.value.lastAliveHeartBeatTime !== 0 &&
      tsm() - cache.value.lastAliveHeartBeatTime < 8000 // 容许 3 秒的误差
    ) {
      // 已存在 Main BLTH
      currentScriptType.value = unsafeWindow.top!.__BLTH_MAIN_FLAG__ ? 'SubMain' : 'Other'
    } else {
      // 不存在 Main BLTH，当前脚本成为 Main BLTH
      const rawCache = toRaw(cache.value)
      // 开始心跳
      rawCache.lastAliveHeartBeatTime = tsm()
      // 立刻写缓存
      Storage.setCache(rawCache)

      unsafeWindow.top!.__BLTH_MAIN_FLAG__ = '🚩'
      currentScriptType.value = 'Main'
    }
  }

  // 监听缓存信息的变化，写缓存
  watch(cache, (newCache: Cache) => Storage.setCache(newCache), { deep: true })

  return {
    cache,
    currentScriptType,
    startMainBLTHAliveHeartBeat,
    checkCurrentScriptType,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCacheStore, import.meta.hot))
}
