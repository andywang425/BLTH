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
import mitt from 'mitt'
import { delayToNextMoment } from '../library/luxon'
import { ImoduleStatus, Istatus } from '../types/moduleStatus'
import { deepestIterate } from '../library/utils'

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
      danmu: '',
      like: '',
      watch: '',
      appUser: ''
    },
    OtherTasks: {
      groupSign: '',
      silverToCoin: '',
      coinToSilver: ''
    }
  }
}

export const useModuleStore = defineStore('module', () => {
  // 所有模块的配置信息
  const moduleConfig: ImoduleConfig = reactive(Storage.getModuleConfig())
  // 正在运行的模块的数组
  const runningModules: BaseModule[] = []
  // Emitter 实例，用于模块间信息传递和 wait 函数
  const emitter = mitt()
  // 模块状态，用于显示状态图标
  const moduleStatus: ImoduleStatus = reactive(defaultModuleStatus)

  /**
   * 加载（运行）所有模块
   */
  async function loadModules() {
    // 按优先级顺序逐个运行默认模块
    for (const [name, Module] of Object.entries(defaultModules).sort(
      (a, b) => a[1].sequence - b[1].sequence
    )) {
      const m = new (Module as new (name: string) => DefaultBaseModule)(name)
      runningModules.push(m)
      try {
        await m.run()
      } catch (err) {
        const logger = new Logger('loadModules')
        logger.error('加载默认模块时发生错误，挂机助手停止运行:', err)
        return
      }
    }
    // 运行其它模块
    for (const [name, Module] of Object.entries(otherModules)) {
      const m = new (Module as new (name: string) => BaseModule)(name)
      runningModules.push(m)
      m.run()
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
      deepestIterate(moduleStatus, (_value: Istatus, path: string) => {
        _.set(moduleStatus, path, '')
      })
      clearStatus()
    }, delayToNextMoment(0, 0).ms)
  })()

  return {
    moduleConfig,
    runningModules,
    emitter,
    moduleStatus,
    loadModules
  }
})
