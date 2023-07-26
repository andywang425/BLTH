import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import Storage from '../library/storage'
import { Icache } from '../types'

export const useCacheStore = defineStore('cache', () => {
  // 缓存
  const cache: Icache = reactive(Storage.getCache())

  /**
   * 脚本存活心跳
   */
  function starttAliveHeartBeat(): void {
    cache.lastAliveHeartBeatTime = Date.now()
    // 每隔5秒写一次时间戳，表示有一个BLTH正在运行
    // 之所以写时间戳而不是布尔值，是因为出现类似于浏览器崩溃的情况时 window.onunload 不会触发
    // 那样就会留下一个永久的有脚本在运行的标记
    const timer = setInterval(() => (cache.lastAliveHeartBeatTime = Date.now()), 5000)

    window.onunload = () => {
      // 页面被关闭时重置时间戳为0
      clearInterval(timer)
      cache.lastAliveHeartBeatTime = 0
    }
  }

  /**
   * 检查是否有别的BLTH正在其它页面上运行
   */
  function checkIfOtherScriptsRunning(): boolean {
    // 允许最多3秒的误差
    if (cache.lastAliveHeartBeatTime !== 0 && Date.now() - cache.lastAliveHeartBeatTime < 8000) {
      return true
    } else {
      return false
    }
  }

  // 监听缓存信息的变化，写缓存
  watch(cache, (newCache: Icache) => Storage.setCache(newCache))

  return {
    cache,
    starttAliveHeartBeat,
    checkIfOtherScriptsRunning
  }
})
