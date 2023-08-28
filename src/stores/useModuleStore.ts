import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import Storage from '../library/storage'
import _ from 'lodash'
import { ImoduleConfig } from '../types'
import DefaultBaseModule from '../modules/DefaultBaseModule'
import BaseModule from '../modules/BaseModule'
import * as defaultModules from '../modules/default'
import * as otherModules from '../modules'
import Logger from '../library/logger'
import mitt from '../library/mitt'
import { delayToNextMoment } from '../library/luxon'
import { ImoduleStatus, moduleEmitterEvents, moduleStatus } from '../types/module'
import { deepestIterate } from '../library/utils'
import { useCacheStore } from './useCacheStore'

const defaultModuleStatus: ImoduleStatus = {
  DailyTasks: {
    MainSiteTasks: {
      login: '',
      watch: '',
      coin: '',
      share: ''
    },
    LiveTasks: {
      sign: '',
      appUser: '',
      medalTasks: {
        danmu: '',
        like: '',
        watch: ''
      }
    },
    OtherTasks: {
      groupSign: '',
      silverToCoin: '',
      coinToSilver: '',
      getYearVipPrivilege: ''
    }
  }
}

export const useModuleStore = defineStore('module', () => {
  // 所有模块的配置信息
  const moduleConfig: ImoduleConfig = reactive(Storage.getModuleConfig())
  // Emitter 实例，用于模块间信息传递和 wait 函数
  // 建议使用模块名称作为 Emitter 方法的 type 参数
  const emitter = mitt<moduleEmitterEvents>()
  // 模块状态，用于显示状态图标
  const moduleStatus: ImoduleStatus = reactive(defaultModuleStatus)

  /**
   * 加载（运行）所有模块
   */
  async function loadModules() {
    const cacheStore = useCacheStore()
    // 按优先级顺序逐个运行默认模块
    for (const [name, module] of Object.entries(defaultModules).sort(
      (a, b) => a[1].sequence - b[1].sequence
    )) {
      try {
        if (module.runMultiple || !cacheStore.isMainBLTHRunning) {
          await new (module as new (moduleName: string) => DefaultBaseModule)(name).run()
        }
      } catch (err) {
        new Logger('loadModules').error('加载默认模块时发生致命错误，挂机助手停止运行:', err)
        return
      }
    }
    // 运行其它模块
    for (const [name, module] of Object.entries(otherModules)) {
      if (module.runMultiple || !cacheStore.isMainBLTHRunning) {
        const m = new (module as new (moduleName: string) => BaseModule)(name)
        if (module.runAt === 'document-start') {
          m.run()
        } else if (module.runAt === 'document-end') {
          if (document.readyState !== 'loading') {
            m.run()
          } else {
            emitter.on('Main', function fn(event: moduleEmitterEvents['Main']) {
              if (event.moment === 'document-end') {
                emitter.off('Main', fn)
                m.run()
              }
            })
          }
        } else {
          if (document.readyState === 'complete') {
            m.run()
          } else {
            emitter.on('Main', function fn(event: moduleEmitterEvents['Main']) {
              if (event.moment === 'window-load') {
                emitter.off('Main', fn)
                m.run()
              }
            })
          }
        }
      }
    }
  }

  // 监听模块配置信息的变化，使用防抖降低油猴写配置信息频率
  watch(
    moduleConfig,
    _.debounce((newModuleConfig: ImoduleConfig) => Storage.setModuleConfig(newModuleConfig), 250, {
      leading: true,
      trailing: true
    })
  )

  /**
   * 每天0点把所有每日任务模块的状态置为空
   */
  ;(function clearStatus() {
    setTimeout(() => {
      deepestIterate(moduleStatus, (_value: moduleStatus, path: string) => {
        _.set(moduleStatus, path, '')
      })
      clearStatus()
    }, delayToNextMoment(0, 0).ms)
  })()

  return {
    moduleConfig,
    emitter,
    moduleStatus,
    loadModules
  }
})
