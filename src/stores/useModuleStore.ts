import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import Storage from '../library/storage'
import _ from 'lodash'
import { ImoduleConfig } from '../types'
import BaseModule from '../modules/BaseModule'
import * as defaultModules from '../modules/default'
import * as otherModules from '../modules'
import Logger from '../library/logger'
import mitt from '../library/mitt'
import { delayToNextMoment } from '../library/luxon'
import {
  ImoduleStatus,
  isOnTargetFrameTypes,
  moduleEmitterEvents,
  moduleStatus
} from '../types/module'
import { deepestIterate, waitForMoment } from '../library/utils'
import { useCacheStore } from './useCacheStore'
import { isSelfTopFrame } from '../library/dom'

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

// 在所有 frame 或顶层 frame 上运行的被加载的模块名称
const allAndTopFrameModuleNames: string[] = []

export const useModuleStore = defineStore('module', () => {
  // 所有模块的配置信息
  const moduleConfig: ImoduleConfig = reactive(Storage.getModuleConfig())
  // Emitter 实例，用于模块间信息传递和 wait 函数
  const emitter = mitt<moduleEmitterEvents>()
  // 模块状态，用于显示状态图标
  const moduleStatus: ImoduleStatus = reactive(defaultModuleStatus)

  /**
   * 加载默认模块（该函数不导出）
   */
  function loadDefaultModules(): Promise<void[]> {
    const cacheStore = useCacheStore()
    const promiseArray: Promise<void>[] = []
    for (const [name, module] of Object.entries(defaultModules)) {
      if (module.runOnMultiplePages || cacheStore.currentScriptType !== 'Other') {
        promiseArray.push(
          new (module as new (moduleName: string) => BaseModule)(name).run() as Promise<void>
        )
      }
    }
    return Promise.all<Promise<void>[]>(promiseArray)
  }

  /**
   * 加载模块
   *
   * @param isOnTargetFrame 当前脚本是否运行在目标 frame 上
   * - `unknown`: 不知道（至少要等到`document-body`后才能确定）
   * - `yes`: 是的
   */
  function loadModules(isOnTargetFrame: isOnTargetFrameTypes): void {
    const cacheStore = useCacheStore()
    const logger = new Logger('ModuleStore_LoadModules')
    if (isOnTargetFrame === 'unknown') {
      for (const [name, module] of Object.entries(otherModules)) {
        if (module.onFrame === 'all' || (module.onFrame === 'top' && isSelfTopFrame())) {
          if (module.runOnMultiplePages || cacheStore.currentScriptType !== 'Other') {
            if (!module.runAfterDefault) {
              // 如果不需要等默认模块运行完了再运行，现在就加载并记录
              // 否则不做记录，等之后（isOnTargetFrame 为 yes时）再加载
              waitForMoment(module.runAt).then(() =>
                new (module as new (moduleName: string) => BaseModule)(name).run()
              )
              // 记录被加载的 onFrame 为 all 或 top 的模块名称
              allAndTopFrameModuleNames.push(name)
            }
          }
        }
      }
    } else {
      // 加载默认模块
      const defaultModulesLoaded: Promise<void[]> = loadDefaultModules()
      // 加载其它模块
      for (const [name, module] of Object.entries(otherModules)) {
        // 对 onFrame 为 all 或 top 的模块来说，如果之前运行过，现在就不运行了
        if (
          module.onFrame === 'target' ||
          (module.onFrame === 'top' &&
            isSelfTopFrame() &&
            !allAndTopFrameModuleNames.includes(name)) ||
          (module.onFrame === 'all' && !allAndTopFrameModuleNames.includes(name))
        ) {
          if (module.runOnMultiplePages || cacheStore.currentScriptType !== 'Other') {
            waitForMoment(module.runAt).then(async () => {
              try {
                if (module.runAfterDefault) {
                  // 等待默认模块运行完毕
                  await defaultModulesLoaded
                }
                new (module as new (moduleName: string) => BaseModule)(name).run()
              } catch (e) {
                // 默认模块运行出错，不运行该模块
                logger.error(`运行默认模块时出错，模块 ${name} 不运行:`, e)
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
