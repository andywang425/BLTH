import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import Storage from '../library/storage'
import { Icache } from '../types'

export const useCacheStore = defineStore('cache', () => {
  // 缓存
  const cache: Icache = reactive(Storage.getCache())
  // 是否有Main BLTH在运行
  // Main BLTH 指所有BLTH中唯一一个（或两个，因为在特殊直播间脚本会被注入到两个 frame 上）运行 runOnMultiplePages 为 false 模块的 BLTH
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
      cache.isMainBLTHRunningOnTargetFrame = false
    })
  }

  /**
   * 检查是否有 Main BLTH 正在其它页面上运行
   */
  function checkIfMainBLTHRunning(): void {
    if (
      cache.lastAliveHeartBeatTime !== 0 &&
      // 允许最多3秒的误差
      Date.now() - cache.lastAliveHeartBeatTime < 8000 &&
      // 是否有 Main BLTH 运行在目标 frame 上
      // 对于特殊直播间，一个页面上会有两个 Main BLTH，需要依赖这个 flag 来判断第二个 frame 上的 BTLH 是不是 Main BLTH
      cache.isMainBLTHRunningOnTargetFrame
    ) {
      isMainBLTHRunning.value = true
    } else {
      isMainBLTHRunning.value = false
      // 如果上次网页因浏览器崩溃而关闭，此时 isMainBLTHRunningOnTargetFrame 可能为 true，将其重新置为 false
      cache.isMainBLTHRunningOnTargetFrame = false
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
