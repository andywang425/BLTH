import BaseModule from '@/modules/BaseModule'
import { storeToRefs } from 'pinia'
import { useBiliStore, useModuleStore } from '@/stores'
import { watch } from 'vue'
import type { MedalTaskSharedConfig, SharedMedalFilters } from './types'
import { arrayToMap, sleep } from '@/library/utils'
import type { LiveData } from '@/library/bili-api/data'
import BAPI from '@/library/bili-api'
import { isTimestampToday } from '@/library/luxon'
import _ from 'lodash'

type JumpType = 'like' | 'sendDanmu' | 'watchLive' | 'feedLight' | 'sendGift'

class MedalModule extends BaseModule {
  /**
   * 任务信息共享缓存
   *
   * target_id -> task_info Promise
   */
  private static taskInfoCache = new Map<
    number,
    Promise<LiveData.GetActivatedMedalInfo.TaskInfo[] | null>
  >()

  /**
   * 简单限流队列
   *
   * 串行执行获取任务信息请求
   */
  private static taskInfoRequestQueue: Promise<void> = Promise.resolve()

  medalTasksConfig = useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks

  /** 所有粉丝勋章任务的公共配置 */
  declare protected config: MedalTaskSharedConfig

  protected SHARED_MEDAL_FILTERS: SharedMedalFilters = {
    // 包含在白名单中或不包含在黑名单中返回true，否则返回false
    meetWhiteOrBlackList: (m) =>
      this.config.isWhiteList
        ? this.config.roomidList.includes(m.room_info.room_id)
        : !this.config.roomidList.includes(m.room_info.room_id),
    // 等级小于120返回true，否则返回false
    levelLt120: (medal) => medal.medal.level < 120,
    // 点亮返回true，否则返回false
    isLighted: (medal) => medal.medal.is_lighted === 1,
    // 直播中返回true，否则返回false
    isLiving: (medal) => medal.room_info.living_status === 1,
  }

  protected sortMedals(medals: LiveData.FansMedalPanel.List[]): LiveData.FansMedalPanel.List[] {
    const orderMap = arrayToMap(this.config.roomidList)
    return medals.sort(
      (a, b) => orderMap.get(a.room_info.room_id)! - orderMap.get(b.room_info.room_id)!,
    )
  }

  /**
   * 等待粉丝勋章数据获取完毕
   *
   * @returns 是否获取成功
   */
  protected waitForFansMedals(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const { fansMedalsStatus } = storeToRefs(useBiliStore())
      if (fansMedalsStatus.value === 'loaded') {
        resolve(true)
      } else {
        const unwatch = watch(fansMedalsStatus, (newValue) => {
          if (newValue === 'loaded') {
            unwatch()
            resolve(true)
          } else if (newValue === 'error') {
            unwatch()
            resolve(false)
          }
        })
      }
    })
  }

  /**
   * 解析每日任务进度文案 "每日上限 X/Y"
   *
   * @param sub_title API 返回的 sub_title
   * @returns 解析成功返回 `{ current, limit }`，否则返回 `null`
   */
  protected static parseDailyLimit(
    sub_title: string | undefined,
  ): { current: number; limit: number } | null {
    if (!sub_title) return null
    const match = sub_title.match(/(\d+)\s*\/\s*(\d+)/)
    if (!match) return null
    return { current: Number(match[1]), limit: Number(match[2]) }
  }

  /**
   * 按 jump_type 在 task_info 中查找任务项
   */
  protected static findTaskInfo(
    task_info: LiveData.GetActivatedMedalInfo.TaskInfo[] | null,
    jump_type: JumpType,
  ): LiveData.GetActivatedMedalInfo.TaskInfo | undefined {
    return task_info?.find((t) => t.jump_type === jump_type)
  }

  /**
   * 从任务 title 中解析数字（如 "点赞30次" → 30，"发弹幕10次" → 10）
   *
   * @returns 解析成功返回数字，否则返回 null
   */
  protected static parseTitleCount(title: string | undefined): number | null {
    if (!title) return null
    const match = title.match(/\d+/)
    if (!match) return null
    return Number(match[0])
  }

  /**
   * 清空任务信息共享缓存
   */
  protected static clearTaskInfoCache(): void {
    MedalModule.taskInfoCache.clear()
  }

  /**
   * 将获取任务信息请求加入全局串行队列
   */
  private static enqueueTaskInfoRequest<T>(requester: () => Promise<T>): Promise<T> {
    const task = MedalModule.taskInfoRequestQueue
      .catch(() => undefined)
      .then(async () => {
        await sleep(_.random(300, 500))
        return requester()
      })

    MedalModule.taskInfoRequestQueue = task.then(
      () => undefined,
      () => undefined,
    )

    return task
  }

  /**
   * 获取指定粉丝勋章的任务信息
   *
   * 同一 target_id 的并发请求会共享同一个 Promise；
   * 不同 target_id 的请求会进入全局串行队列，避免短时间内并发触发过多请求
   *
   * @param target_id 主播 uid
   * @returns 成功返回任务信息数组，失败返回 null
   */
  protected fetchTaskInfo(
    target_id: number,
  ): Promise<LiveData.GetActivatedMedalInfo.TaskInfo[] | null> {
    const cached = MedalModule.taskInfoCache.get(target_id)
    if (cached) return cached

    const promise = MedalModule.enqueueTaskInfoRequest(async () => {
      try {
        const response = await BAPI.live.getActivatedMedalInfo(target_id)
        this.logger.log(`BAPI.live.getActivatedMedalInfo(${target_id}) response`, response)
        if (response.code === 0) {
          return response.data.task_info
        } else {
          this.logger.error(`BAPI.live.getActivatedMedalInfo(${target_id}) 失败`, response.message)
          MedalModule.taskInfoCache.delete(target_id)
          return null
        }
      } catch (error) {
        this.logger.error(`BAPI.live.getActivatedMedalInfo(${target_id}) 出错`, error)
        MedalModule.taskInfoCache.delete(target_id)
        return null
      }
    })

    MedalModule.taskInfoCache.set(target_id, promise)
    return promise
  }

  /**
   * 若点亮熄灭勋章任务已启用且今天未完成，等待其结束后再继续
   *
   * 用于让 点赞/发弹幕/观看直播 在 点亮熄灭勋章 任务完成后再执行
   */
  protected async waitForLightTask(): Promise<void> {
    const lightConfig = this.medalTasksConfig.light
    if (!lightConfig.enabled) return
    if (isTimestampToday(lightConfig._lastCompleteTime)) return

    const moduleStore = useModuleStore()
    const lightStatus = moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.light
    if (lightStatus === 'done' || lightStatus === 'error') return

    this.logger.log('等待点亮熄灭勋章任务完成后再执行')

    return new Promise<void>((resolve) => {
      const unwatch = watch(
        () => moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.light,
        (newStatus) => {
          if (newStatus === 'done' || newStatus === 'error') {
            unwatch()

            if (lightConfig._lastEffectiveCompleteTime === lightConfig._lastCompleteTime) {
              // 如果点亮熄灭勋章模块确实进行了点亮操作
              // 重新获取粉丝勋章（主要是为了获取最新的点亮状态和直播状态）
              // FansMedals 模块内部做了防重入，因此无需担心会重复获取
              moduleStore.rerunModule('Default_FansMedals')
            }
            resolve()
          }
        },
      )
    })
  }
}

export default MedalModule
