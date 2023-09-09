import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import Storage from '../library/storage'
import { Icache } from '../types'

type scriptType = 'Main' | 'SubMain' | 'Other'

export const useCacheStore = defineStore('cache', () => {
  // 缓存
  const cache: Icache = reactive(Storage.getCache())
  // 当前BLTH的类型：Main BLTH，Sub Main BLTH，Other BLTH
  // Main BLTH（以及可能存在的 Sub Main BLTH） 指所有BLTH中唯一一个（或两个，因为在特殊直播间脚本会被注入到两个 frame 上）运行 runOnMultiplePages 为 false 模块的 BLTH

  /**
   * 表示当前BLTH的类型
   * - `Main`: 运行`runOnMultiplePages`为`false`的模块，有存活心跳
   * - `SubMain`: 运行`runOnMultiplePages`为`false`的模块，无存活心跳
   * - `Other`: 运行`runOnMultiplePages`为`true`的模块，无存活心跳
   *
   * 用户在打开第一个直播间页面时运行的第一个BLTH一定是Main BLTH，
   * 假如是特殊直播间，在第二个frame上还会有个SubMain BLTH。
   * 之后打开的直播间页面上运行的则是Other BLTH。
   * 如果关掉 Main BLTH 所在的页面，那么下一个打开的页面上所运行的 BLTH 则为 Main BLTH（也可能会有SubMain BLTH）。
   * 增加这一概念主要时为了确保任务类模块不会重复运行（比如完成各种每日任务的模块）。
   */
  const currentScriptType = ref<scriptType>('Main')

  /**
   * Main BLTH 存活心跳
   */
  function startMainBLTHAliveHeartBeat(): void {
    cache.lastAliveHeartBeatTime = Date.now()
    // 每隔5秒写一次时间戳，表示有一个Main BLTH正在运行
    // 之所以写时间戳而不是布尔值，是因为出现类似于浏览器崩溃的情况时 window.onunload 不会触发
    // 那样就会留下一个永久的有脚本在运行的标记
    const timer = setInterval(() => (cache.lastAliveHeartBeatTime = Date.now()), 5000)

    window.addEventListener('unload', () => {
      clearInterval(timer)
      cache.lastAliveHeartBeatTime = 0
    })
  }

  /**
   * 检查当前脚本的类型
   */
  function checkCurrentScriptType(): void {
    if (
      cache.lastAliveHeartBeatTime !== 0 &&
      // 允许最多3秒的误差
      Date.now() - cache.lastAliveHeartBeatTime < 8000
    ) {
      // 通过 sessionStorage 中的 flag 来判断当前页面上有没有 Main BLTH
      if (sessionStorage.getItem('MainBLTHFlag') === null) {
        currentScriptType.value = 'Other'
      } else {
        // 如果有，那么当前脚本的类型是 SubMain
        currentScriptType.value = 'SubMain'
      }
    } else {
      currentScriptType.value = 'Main'
      sessionStorage.setItem('MainBLTHFlag', 'Hello World')
    }
  }

  // 监听缓存信息的变化，写缓存
  watch(cache, (newCache: Icache) => Storage.setCache(newCache))

  return {
    cache,
    currentScriptType,
    startMainBLTHAliveHeartBeat,
    checkCurrentScriptType
  }
})
