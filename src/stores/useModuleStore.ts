import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import Storage from '@/library/storage'
import _ from 'lodash'
import type { ModuleConfig, ModuleReset } from '@/types'
import * as defaultModules from '@/modules/default'
import * as otherModules from '@/modules'
import Logger from '@/library/logger'
import mitt from '@/library/mitt'
import { delayToNextMoment } from '@/library/luxon'
import type {
  ModuleStatus,
  IsOnTargetFrameTypes,
  ModuleEmitterEvents,
  ModuleStatusTypes,
} from '@/types'
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
        watch: '',
      },
    },
    OtherTasks: {
      groupSign: '',
      silverToCoin: '',
      coinToSilver: '',
      getYearVipPrivilege: '',
    },
  },
}

// 在所有 frame 或顶层 frame 上运行的被加载的模块名称
const allAndTopFrameModuleNames: string[] = []

export const useModuleStore = defineStore('module', () => {
  // 所有模块的配置信息
  const moduleConfig: ModuleConfig = reactive(Storage.getModuleConfig())
  // Emitter 实例，用于模块间信息传递和 wait 函数
  const emitter = mitt<ModuleEmitterEvents>()
  // 模块状态，用于显示状态图标
  const moduleStatus: ModuleStatus = reactive(defaultModuleStatus)
  // 模块实例
  const moduleInstances: BaseModule[] = []
  // 模块状态、运行记录重置和再运行
  const moduleReset: ModuleReset = {
    DailyTasks: {
      MainSiteTasks: {
        login: () => {
          moduleStatus.DailyTasks.MainSiteTasks.login = ''
          moduleConfig.DailyTasks.MainSiteTasks.login._lastCompleteTime = 0
          const instance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_MainSiteTask_LoginTask',
          )!
          console.log('instance moduleInstances', instance, moduleInstances)
          clearTimeout(instance.nextRunTimer)
          instance.run()
        },
        watch: async () => {
          moduleStatus.DailyTasks.MainSiteTasks.watch = ''
          moduleConfig.DailyTasks.MainSiteTasks.watch._lastCompleteTime = 0

          const dailyRewardInfoInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'Default_DailyRewardInfo',
          )!
          clearTimeout(dailyRewardInfoInstance.nextRunTimer)
          const p1 = dailyRewardInfoInstance.run(true)

          const dynamicVideosInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'Default_DynamicVideos',
          )!
          clearTimeout(dynamicVideosInstance.nextRunTimer)
          const p2 = dynamicVideosInstance.run(true)

          await Promise.all([p1, p2])

          const watchInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_MainSiteTask_WatchTask',
          )!
          clearTimeout(watchInstance.nextRunTimer)
          watchInstance.run()
        },
        coin: async () => {
          moduleStatus.DailyTasks.MainSiteTasks.coin = ''
          moduleConfig.DailyTasks.MainSiteTasks.coin._lastCompleteTime = 0

          const dailyRewardInfoInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'Default_DailyRewardInfo',
          )!
          clearTimeout(dailyRewardInfoInstance.nextRunTimer)
          const p1 = dailyRewardInfoInstance.run(true)

          const dynamicVideosInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'Default_DynamicVideos',
          )!
          clearTimeout(dynamicVideosInstance.nextRunTimer)
          const p2 = dynamicVideosInstance.run(true)

          await Promise.all([p1, p2])

          const coinInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_MainSiteTask_CoinTask',
          )!
          clearTimeout(coinInstance.nextRunTimer)
          coinInstance.run()
        },
        share: async () => {
          moduleStatus.DailyTasks.MainSiteTasks.share = ''
          moduleConfig.DailyTasks.MainSiteTasks.share._lastCompleteTime = 0

          const dailyRewardInfoInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'Default_DailyRewardInfo',
          )!
          clearTimeout(dailyRewardInfoInstance.nextRunTimer)
          const p1 = dailyRewardInfoInstance.run(true)

          const dynamicVideosInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'Default_DynamicVideos',
          )!
          clearTimeout(dynamicVideosInstance.nextRunTimer)
          const p2 = dynamicVideosInstance.run(true)

          await Promise.all([p1, p2])

          const shareInstance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_MainSiteTask_ShareTask',
          )!
          clearTimeout(shareInstance.nextRunTimer)
          shareInstance.run()
        },
      },
      LiveTasks: {
        medalTasks: {
          light: () => {
            moduleStatus.DailyTasks.LiveTasks.medalTasks.light = ''
            moduleConfig.DailyTasks.LiveTasks.medalTasks.light._lastCompleteTime = 0
            const instance = moduleInstances.find(
              (ins) => ins.moduleName === 'DailyTask_LiveTask_MedalTask_LightTask',
            )!
            clearTimeout(instance.nextRunTimer)
            instance.run()
          },
          watch: () => {
            moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = ''
            moduleConfig.DailyTasks.LiveTasks.medalTasks.watch._lastCompleteTime = 0
            moduleConfig.DailyTasks.LiveTasks.medalTasks.watch._lastWatchTime = 0
            moduleConfig.DailyTasks.LiveTasks.medalTasks.watch._watchingProgress = {}
            const instance = moduleInstances.find(
              (ins) => ins.moduleName === 'DailyTask_LiveTask_MedalTask_WatchTask',
            )!
            clearTimeout(instance.nextRunTimer)
            instance.run()
          },
        },
      },
      OtherTasks: {
        groupSign: () => {
          moduleStatus.DailyTasks.OtherTasks.groupSign = ''
          moduleConfig.DailyTasks.OtherTasks.groupSign._lastCompleteTime = 0
          const instance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_OtherTask_GroupSignTask',
          )!
          clearTimeout(instance.nextRunTimer)
          instance.run()
        },
        silverToCoin: () => {
          moduleStatus.DailyTasks.OtherTasks.silverToCoin = ''
          moduleConfig.DailyTasks.OtherTasks.silverToCoin._lastCompleteTime = 0
          const instance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_OtherTask_SilverToCoinTask',
          )!
          clearTimeout(instance.nextRunTimer)
          instance.run()
        },
        coinToSilver: () => {
          moduleStatus.DailyTasks.OtherTasks.coinToSilver = ''
          moduleConfig.DailyTasks.OtherTasks.coinToSilver._lastCompleteTime = 0
          const instance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_OtherTask_CoinToSilverTask',
          )!
          clearTimeout(instance.nextRunTimer)
          instance.run()
        },
        getYearVipPrivilege: () => {
          moduleStatus.DailyTasks.OtherTasks.getYearVipPrivilege = ''
          moduleConfig.DailyTasks.OtherTasks.getYearVipPrivilege._nextReceiveTime = 0
          const instance = moduleInstances.find(
            (ins) => ins.moduleName === 'DailyTask_OtherTask_GetYearVipPrivilegeTask',
          )!
          clearTimeout(instance.nextRunTimer)
          instance.run()
        },
      },
    },
  }

  /**
   * 运行模块
   *
   * @param module 模块类
   * @param name 模块名称
   */
  function _runModule(module: typeof BaseModule, name: string): Promise<void> | void {
    const moduleInstance = new module(name)
    moduleInstances.push(moduleInstance)

    if (moduleInstance.isEnabled()) {
      return moduleInstance.run()
    }
  }

  /**
   * 加载默认模块
   */
  function _loadDefaultModules(): Promise<PromiseSettledResult<void>[]> {
    const cacheStore = useCacheStore()
    const promiseArray: Promise<void>[] = []
    for (const [name, module] of Object.entries(defaultModules)) {
      if (module.runOnMultiplePages || cacheStore.currentScriptType !== 'Other') {
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
              new Logger('ModuleStore').error(`意外错误: ${error.message}`)
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

  // 监听模块配置信息的变化，使用防抖降低油猴写配置信息频率
  watch(
    moduleConfig,
    _.debounce((newModuleConfig: ModuleConfig) => Storage.setModuleConfig(newModuleConfig), 250, {
      leading: true,
      trailing: true,
    }),
  )

  /**
   * 每天0点把所有每日任务模块的状态置为空
   */
  ;(function clearStatus() {
    setTimeout(() => {
      deepestIterate(moduleStatus, (_value: ModuleStatusTypes, path: string) => {
        _.set(moduleStatus, path, '')
      })
      clearStatus()
    }, delayToNextMoment(0, 0).ms)
  })()

  return {
    moduleConfig,
    moduleInstances,
    moduleReset,
    emitter,
    moduleStatus,
    loadModules,
  }
})
