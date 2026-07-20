import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watch } from 'vue'
import Storage from '@/library/storage'
import type { Cache } from '@/types'
import { unsafeWindow } from '$'
import { tsm } from '@/library/luxon'
import { sleep } from '@/library/utils'

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

  /** 当前 Main BLTH 的标识 */
  let mainScriptId = ''
  let heartBeatTimer: number | undefined

  /**
   * 判断 Main BLTH 的心跳是否新鲜
   */
  function _isHeartBeatFresh(): boolean {
    return (
      cache.value.lastAliveHeartBeatTime !== 0 && tsm() - cache.value.lastAliveHeartBeatTime < 8000 // 容许 3 秒的误差
    )
  }

  /**
   * 解析非 Main 类型的脚本类型
   *
   * 如果当前标签页已存在 Main BLTH，则为 SubMain，否则为 Other
   */
  function _resolveNonMainType(): ScriptType {
    return unsafeWindow.top!.__BLTH_MAIN_FLAG__ ? 'SubMain' : 'Other'
  }

  /**
   * Main BLTH 存活心跳
   */
  function startMainBLTHAliveHeartBeat(): void {
    cache.value.lastAliveHeartBeatTime = tsm()

    heartBeatTimer = setInterval(() => {
      if (cache.value.mainScriptId !== mainScriptId && _isHeartBeatFresh()) {
        // 有其它 Main BLTH 正在运行，自己失去 Main 资格
        clearInterval(heartBeatTimer)
        currentScriptType.value = _resolveNonMainType()
        return
      }
      // 每隔 5 秒写一次时间戳，表示有一个 Main BLTH 正在运行
      cache.value.lastAliveHeartBeatTime = tsm()
    }, 5000)

    window.addEventListener('unload', () => {
      clearInterval(heartBeatTimer)

      if (cache.value.mainScriptId === mainScriptId) {
        // 如果自己是 Main BLTH，卸载时清除 Main BLTH 的标记
        cache.value.mainScriptId = ''
        cache.value.lastAliveHeartBeatTime = 0
      }
    })
  }

  /**
   * 检查当前脚本的类型
   */
  async function checkCurrentScriptType(): Promise<void> {
    if (_isHeartBeatFresh()) {
      // 已存在 Main BLTH
      currentScriptType.value = _resolveNonMainType()
      return
    }

    // 不存在 Main BLTH，尝试成为 Main BLTH
    mainScriptId = crypto.randomUUID()
    cache.value.mainScriptId = mainScriptId
    // 立刻写缓存（watch 写入有延迟）
    Storage.setCache(cache.value)
    // 等待一个微小间隔后再读取缓存
    await sleep(100)

    if (Storage.getCache().mainScriptId === mainScriptId) {
      // 如果在此期间其它标签页上没有 BLTH 尝试成为 Main BLTH，自己成为 Main BLTH
      currentScriptType.value = 'Main'
      unsafeWindow.top!.__BLTH_MAIN_FLAG__ = '🚩'
      return
    }

    // 否则让其它页面上的 BLTH 成为 Main，自己当 SubMain 或 Other
    currentScriptType.value = _resolveNonMainType()
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
