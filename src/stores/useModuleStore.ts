import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watch } from 'vue'
import Storage from '@/library/storage'
import _ from 'lodash'
import type { ModuleConfig, ModuleReset } from '@/types'
import * as defaultModules from '@/modules/default'
import * as otherModules from '@/modules'
import Logger from '@/library/logger'
import { delayToNextMoment } from '@/library/luxon'
import type { ModuleStatus, IsOnTargetFrameTypes, ModuleStatusTypes } from '@/types'
import { deepestIterate, waitForMoment } from '@/library/utils'
import { useCacheStore } from './useCacheStore'
import { isSelfTopFrame } from '@/library/dom'
import type BaseModule from '@/modules/BaseModule'
import ModuleCriticalError from '@/library/error/ModuleCriticalError'
import ModuleError from '@/library/error/ModuleError'

const defaultModuleStatus: ModuleStatus = {
  DailyTasks: {
    MainSiteTasks: {
      login: '',
      watch: '',
      coin: '',
      share: '',
    },
    LiveTasks: {
      medalTasks: {
        light: '',
        like: '',
        danmu: '',
        watch: '',
      },
    },
    OtherTasks: {
      silverToCoin: '',
      coinToSilver: '',
      getYearVipPrivilege: '',
    },
  },
}

const logger = new Logger('ModuleStore')

// 在所有 frame 或顶层 frame 上运行的被加载的模块名称
const allAndTopFrameModuleNames: string[] = []

export const useModuleStore = defineStore('module', () => {
  // 模块配置信息
  const moduleConfig = ref<ModuleConfig>(Storage.getModuleConfig())
  // 模块状态
  const moduleStatus = ref<ModuleStatus>(defaultModuleStatus)
  // 模块实例映射（key: 模块名称, value: 模块实例）
  const moduleInstances = ref<Record<string, BaseModule>>({})
  // 模块状态、运行记录重置和再运行
  const moduleReset: ModuleReset = {
    DailyTasks: {
      MainSiteTasks: {
        login: async () => {
          moduleStatus.value.DailyTasks.MainSiteTasks.login = ''
          moduleConfig.value.DailyTasks.MainSiteTasks.login._lastCompleteTime = 0

          await rerunModule('Default_DailyRewardInfo', true)
          rerunModule('DailyTask_MainSiteTask_LoginTask')
        },
        watch: async () => {
          moduleStatus.value.DailyTasks.MainSiteTasks.watch = ''
          moduleConfig.value.DailyTasks.MainSiteTasks.watch._lastCompleteTime = 0

          await Promise.all([
            rerunModule('Default_DailyRewardInfo', true),
            rerunModule('Default_DynamicVideos', true),
          ])
          rerunModule('DailyTask_MainSiteTask_WatchTask')
        },
        coin: async () => {
          moduleStatus.value.DailyTasks.MainSiteTasks.coin = ''
          moduleConfig.value.DailyTasks.MainSiteTasks.coin._lastCompleteTime = 0

          await Promise.all([
            rerunModule('Default_DailyRewardInfo', true),
            rerunModule('Default_DynamicVideos', true),
          ])
          rerunModule('DailyTask_MainSiteTask_CoinTask')
        },
        share: async () => {
          moduleStatus.value.DailyTasks.MainSiteTasks.share = ''
          moduleConfig.value.DailyTasks.MainSiteTasks.share._lastCompleteTime = 0

          await Promise.all([
            rerunModule('Default_DailyRewardInfo', true),
            rerunModule('Default_DynamicVideos', true),
          ])
          rerunModule('DailyTask_MainSiteTask_ShareTask')
        },
      },
      LiveTasks: {
        medalTasks: {
          light: () => {
            const medalTasksStatus = moduleStatus.value.DailyTasks.LiveTasks.medalTasks

            if (medalTasksStatus.like === 'running' || medalTasksStatus.danmu === 'running') {
              logger.warn('【点赞】或【发弹幕】模块仍在运行中，无法重新运行【点亮熄灭勋章】模块')
              return
            }

            moduleStatus.value.DailyTasks.LiveTasks.medalTasks.light = ''
            moduleConfig.value.DailyTasks.LiveTasks.medalTasks.light._lastCompleteTime = 0

            rerunModule('Default_FansMedals', true)
            rerunModule('DailyTask_LiveTask_LightTask')
          },
          like: () => {
            moduleStatus.value.DailyTasks.LiveTasks.medalTasks.like = ''
            moduleConfig.value.DailyTasks.LiveTasks.medalTasks.like._lastCompleteTime = 0

            rerunModule('Default_FansMedals', true)
            rerunModule('DailyTask_LiveTask_LikeTask')
          },
          danmu: () => {
            moduleStatus.value.DailyTasks.LiveTasks.medalTasks.danmu = ''
            moduleConfig.value.DailyTasks.LiveTasks.medalTasks.danmu._lastCompleteTime = 0

            rerunModule('Default_FansMedals', true)
            rerunModule('DailyTask_LiveTask_DanmuTask')
          },
          watch: () => {
            moduleStatus.value.DailyTasks.LiveTasks.medalTasks.watch = ''
            moduleConfig.value.DailyTasks.LiveTasks.medalTasks.watch._lastCompleteTime = 0

            rerunModule('Default_FansMedals', true)
            rerunModule('DailyTask_LiveTask_WatchTask')
          },
        },
      },
      OtherTasks: {
        silverToCoin: () => {
          moduleStatus.value.DailyTasks.OtherTasks.silverToCoin = ''
          moduleConfig.value.DailyTasks.OtherTasks.silverToCoin._lastCompleteTime = 0

          rerunModule('DailyTask_OtherTask_SilverToCoinTask')
        },
        coinToSilver: () => {
          moduleStatus.value.DailyTasks.OtherTasks.coinToSilver = ''
          moduleConfig.value.DailyTasks.OtherTasks.coinToSilver._lastCompleteTime = 0

          rerunModule('DailyTask_OtherTask_CoinToSilverTask')
        },
        getYearVipPrivilege: () => {
          moduleStatus.value.DailyTasks.OtherTasks.getYearVipPrivilege = ''
          moduleConfig.value.DailyTasks.OtherTasks.getYearVipPrivilege._nextReceiveTime = 0

          rerunModule('DailyTask_OtherTask_GetYearVipPrivilegeTask')
        },
      },
    },
  }

  /**
   * 运行模块
   *
   * @inner
   * @param module 模块类
   * @param name 模块名称
   */
  function _runModule(module: typeof BaseModule, name: string): Promise<void> | void {
    const moduleInstance = new module(name)
    moduleInstances.value[name] = moduleInstance

    if (moduleInstance.isEnabled()) {
      return moduleInstance.run()
    }
  }

  /**
   * 加载默认模块
   *
   * @inner
   */
  function _loadDefaultModules(): Promise<PromiseSettledResult<void>[]> {
    const cacheStore = useCacheStore()
    const promiseArray: Promise<void>[] = []
    for (const [name, module] of Object.entries(defaultModules)) {
      if (module.runOnMultiplePages || cacheStore.currentScriptType !== 'Other') {
        // 默认模块一定会返回一个 Promise
        // 即使意外返回 undefined，Promise.allSettled 会将其当作已 fulfilled 的 Promise
        promiseArray.push(_runModule(module, name)!)
      }
    }
    return Promise.allSettled<Promise<void>[]>(promiseArray)
  }

  /**
   * 加载模块
   *
   * @param isOnTargetFrame 当前脚本是否运行在目标 frame 上
   * - `unknown`: 不知道（至少要等到`document-body`后才能确定）
   * - `yes`: 是的
   */
  function loadModules(isOnTargetFrame: IsOnTargetFrameTypes): void {
    const cacheStore = useCacheStore()

    if (isOnTargetFrame === 'unknown') {
      for (const [name, module] of Object.entries(otherModules)) {
        if (module.onFrame === 'all' || (module.onFrame === 'top' && isSelfTopFrame())) {
          if (module.runOnMultiplePages || cacheStore.currentScriptType !== 'Other') {
            if (!module.runAfterDefault) {
              // 如果不需要等默认模块运行完了再运行，现在就加载并记录
              // 否则不做记录，等之后（isOnTargetFrame 为 yes 时）再加载
              waitForMoment(module.runAt).then(() => _runModule(module, name))
              // 记录被加载的 onFrame 为 all 或 top 的模块名称
              allAndTopFrameModuleNames.push(name)
            }
          }
        }
      }
    } else {
      // 在默认模块之后运行的模块（key为模块名称，value为模块class）
      const moduleAfterDefault: Record<string, typeof BaseModule> = {}
      // 加载默认模块
      const defaultModulesLoadingResult: Promise<PromiseSettledResult<void>[]> =
        _loadDefaultModules()
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
            if (module.runAfterDefault) {
              // 记录需要等默认模块运行完后再运行的模块，暂时不运行
              moduleAfterDefault[name] = module
            } else {
              waitForMoment(module.runAt).then(() => _runModule(module, name))
            }
          }
        }
      }

      // 等待默认模块运行完毕
      defaultModulesLoadingResult.then((results) => {
        // 解析默认模块返回的 Promises
        for (const result of results) {
          if (result.status === 'rejected') {
            const error: Error = result.reason

            if (error instanceof ModuleCriticalError) {
              // 致命错误，停止运行
              new Logger(error.moduleName).error(error.message)
              return
            } else if (error instanceof ModuleError) {
              // 一般错误，继续运行
              new Logger(error.moduleName).error(error.message)
            } else {
              // 意外错误，停止运行（可能是默认模块编写有误）
              logger.error(`意外错误: ${error.message}`)
              return
            }
          }
        }
        // 一切正常或只有一般错误，运行模块
        for (const [name, module] of Object.entries(moduleAfterDefault)) {
          waitForMoment(module.runAt).then(() => _runModule(module, name))
        }
      })
    }
  }

  /**
   * 重新运行模块
   *
   * @param moduleName 模块名称
   * @param args `run()` 方法参数
   */
  function rerunModule(moduleName: string, ...args: any[]): Promise<void> | void {
    const moduleInstance = moduleInstances.value[moduleName]

    if (moduleInstance) {
      clearTimeout(moduleInstance.nextRunTimer)
      return moduleInstance.run(...args)
    } else {
      throw new ModuleError('ModuleStore', `模块 ${moduleName} 不存在`)
    }
  }

  // 监听模块配置信息的变化，使用防抖降低油猴写配置信息频率
  watch(
    moduleConfig,
    _.debounce((newModuleConfig: ModuleConfig) => Storage.setModuleConfig(newModuleConfig), 250, {
      leading: true,
      trailing: true,
    }),
    { deep: true },
  )

  /**
   * 每天0点把所有每日任务模块的状态置为空
   */
  ;(function clearStatus() {
    setTimeout(() => {
      deepestIterate(moduleStatus.value, (_value: ModuleStatusTypes, path: string) => {
        _.set(moduleStatus.value, path, '')
      })
      clearStatus()
    }, delayToNextMoment(0, 0).ms)
  })()

  return {
    moduleConfig,
    moduleInstances,
    moduleReset,
    moduleStatus,
    loadModules,
    rerunModule,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModuleStore, import.meta.hot))
}
