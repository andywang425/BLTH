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
import { ImoduleStatus, isOnTargetFrameTypes, moduleEmitterEvents, moduleStatus } from '../types/module'
import { deepestIterate, waitForMoment } from '../library/utils'
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

// 早期（不确定当前 frame 是否是目标 frame 的时候）加载的模块名称
const earlyLoadedModuleNames: string[] = []

export const useModuleStore = defineStore('module', () => {
  // 所有模块的配置信息
  const moduleConfig: ImoduleConfig = reactive(Storage.getModuleConfig())
  // Emitter 实例，用于模块间信息传递和 wait 函数
  // 建议使用模块名称作为 Emitter 方法的 type 参数
  const emitter = mitt<moduleEmitterEvents>()
  // 模块状态，用于显示状态图标
  const moduleStatus: ImoduleStatus = reactive(defaultModuleStatus)

  /**
   * 加载模块
   *
   * @param isOnTargetFrame 当前脚本是否运行在目标 frame 上
   * - `unknown`: 不知道（至少要等到`document-body`后才能确定）
   * - `yes`: 是的
   */
  async function loadModules(isOnTargetFrame: isOnTargetFrameTypes) {
    const cacheStore = useCacheStore()
    if (isOnTargetFrame === 'unknown') {
      for (const [name, module] of Object.entries(otherModules)) {
        if (module.onFrame === 'all') {
          if (module.runMultiple || !cacheStore.isMainBLTHRunning) {
            waitForMoment(module.runAt).then(() =>
              new (module as new (moduleName: string) => BaseModule)(name).run()
            )
            earlyLoadedModuleNames.push(name)
          }
        }
      }
    } else {
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
        // 对 onFrame 为 all 的模块来说，如果之前运行过，现在就不运行了
        if (!earlyLoadedModuleNames.includes(name)) {
          if (module.runMultiple || !cacheStore.isMainBLTHRunning) {
            waitForMoment(module.runAt).then(() =>
              new (module as new (moduleName: string) => BaseModule)(name).run()
            )
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
