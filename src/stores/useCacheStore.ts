import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import Storage from '../library/storage'
import { Icache } from '../types'

export const useCacheStore = defineStore('cache', () => {
  // 缓存
  const cache: Icache = reactive(Storage.getCache())
  // 是否有Main BLTH在运行
  // Main BLTH 指所有BLTH中唯一一个运行非 runMultiple 模块的 BLTH
  // 用户在打开第一个直播间页面时运行的BLTH一定是Main BLTH，之后打开的则不是
  // 如果关掉Main BLTH所在的页面，那么下一个打开的页面上所运行的BLTH则为Main BLTH
  // 增加这一概念主要时为了确保任务类模块不会重复运行（比如完成各种每日任务的模块）
  const isMainBLTHRunning = ref<boolean>(false)

  /**
   * Main BLTH 存活心跳
   */
  function startAliveHeartBeat(): void {
    cache.lastAliveHeartBeatTime = Date.now()
    // 每隔5秒写一次时间戳，表示有一个Main BLTH正在运行
    // 之所以写时间戳而不是布尔值，是因为出现类似于浏览器崩溃的情况时 window.onunload 不会触发
    // 那样就会留下一个永久的有脚本在运行的标记
    const timer = setInterval(() => (cache.lastAliveHeartBeatTime = Date.now()), 5000)

    window.addEventListener('unload', function () {
      clearInterval(timer)
      cache.lastAliveHeartBeatTime = 0
    })
  }

  /**
   * 检查是否有 Main BLTH 正在其它页面上运行
   */
  function checkIfMainBLTHRunning(): void {
    // 允许最多3秒的误差
    if (cache.lastAliveHeartBeatTime !== 0 && Date.now() - cache.lastAliveHeartBeatTime < 8000) {
      isMainBLTHRunning.value = true
    } else {
      isMainBLTHRunning.value = false
    }
  }

  // 监听缓存信息的变化，写缓存
  watch(cache, (newCache: Icache) => Storage.setCache(newCache))

  return {
    cache,
    isMainBLTHRunning,
    startAliveHeartBeat,
    checkIfMainBLTHRunning
  }
})
