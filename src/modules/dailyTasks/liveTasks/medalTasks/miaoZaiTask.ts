import { delayToNextMoment, isNowBefore, isTimestampToday, ts, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore, useModuleStore } from '@/stores'
import { sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'
import _ from 'lodash'
import type { MiaoZaiTaskResult } from './types'

/**
 * 超能粉丝节——粉丝福利——亲密喂养（养猫活动）
 *
 * 每天给每个粉丝勋章对应的直播间签到领猫粮、喂猫、撸猫，赚取成长值
 */
class MiaoZaiTask extends MedalModule {
  /** 活动结束时间戳（秒） */
  private static readonly ACTIVITY_END_TIME = 1789315199 // 2026-09-13 23:59:59
  /** 活动进行中的 activity_status */
  private static readonly ACTIVITY_STATUS_ONGOING = 1
  /** 签到任务的 task_key */
  private static readonly SIGN_IN_TASK_KEY = 'signin'
  /** 任务已完成的 task_status */
  private static readonly TASK_STATUS_DONE = 1
  /** 连续多少次撸猫没有获得成长值就视为今日撸猫任务已完成 */
  private static readonly PET_CAT_ZERO_GROWTH_LIMIT = 5
  /** 单个直播间最多喂猫次数（兜底，避免猫粮数量异常时无限循环） */
  private static readonly FEED_CAT_MAX_TIMES = 40
  /** 单个直播间最多撸猫次数（兜底，避免 growth_delta 一直大于 0 时无限循环） */
  private static readonly PET_CAT_MAX_TIMES = 30
  /** 相邻两次不同类型的养猫操作之间的动态间隔时间（长） */
  private static get ACTION_DYNAMIC_LONG_INTERVAL() {
    return _.random(1500, 2000)
  }
  /** 相邻两次撸猫或喂猫粮操作之间的动态间隔时间（短） */
  private static get ACTION_DYNAMIC_SHORT_INTERVAL() {
    return _.random(300, 500)
  }
  /** 相邻两个直播间之间的动态间隔时间 */
  private static get ROOM_DYNAMIC_INTERVAL() {
    return _.random(3000, 5000)
  }

  config = this.medalTasksConfig.miaoZai

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.miaoZai = s
  }

  /**
   * 获取黑白名单过滤后的粉丝勋章
   *
   * 养猫活动不要求勋章已点亮，也不受 120 级上限影响
   */
  private getMedals(): LiveData.FansMedalPanel.List[] {
    const result = useBiliStore().filteredFansMedals.filter((medal) =>
      this.SHARED_MEDAL_FILTERS.meetWhiteOrBlackList(medal),
    )

    if (this.config.isWhiteList) {
      this.sortMedals(result)
    }

    return result
  }

  /**
   * 获取养猫活动主页数据
   *
   * @param medal 粉丝勋章
   * @returns 成功返回主页数据，失败返回 null
   */
  private async fetchHome(
    medal: LiveData.FansMedalPanel.List,
  ): Promise<LiveData.Q3FansS1MiaoZai.HomeData | null> {
    const room_id = medal.room_info.room_id
    const ruid = medal.medal.target_id

    try {
      const response = await BAPI.live.Q3FansS1MiaoZaiHome(room_id, ruid)
      this.logger.log(`BAPI.live.Q3FansS1MiaoZaiHome(${room_id}, ${ruid}) response`, response)
      if (response.code === 0) {
        return response.data
      }
      this.logger.error(`BAPI.live.Q3FansS1MiaoZaiHome(${room_id}, ${ruid}) 失败`, response.message)
    } catch (error) {
      this.logger.error(`BAPI.live.Q3FansS1MiaoZaiHome(${room_id}, ${ruid}) 出错`, error)
    }

    return null
  }
  /**
   * 判断签到任务是否已完成
   *
   * @returns 已完成返回 true，未完成或找不到签到任务返回 false
   */
  private static isSignInDone(home: LiveData.Q3FansS1MiaoZai.HomeData): boolean {
    const task = home.daily_tasks?.find((t) => t.task_key === MiaoZaiTask.SIGN_IN_TASK_KEY)
    return task?.level_list?.[0]?.task_status === MiaoZaiTask.TASK_STATUS_DONE
  }

  /**
   * 执行一次养猫操作（选猫/签到/喂猫/撸猫）
   *
   * 外层 code 和 data.code 都为 0 才算成功
   *
   * @param actionText 操作名称，用于日志
   * @param logMessage 直播间描述信息，用于日志
   * @param requester 请求函数
   * @returns 成功返回 ActionData，失败返回 null
   */
  private async executeAction(
    actionText: string,
    logMessage: string,
    requester: () => Promise<{
      code: number
      message: string
      data: LiveData.Q3FansS1MiaoZai.ActionData
    }>,
  ): Promise<LiveData.Q3FansS1MiaoZai.ActionData | null> {
    try {
      const response = await requester()
      this.logger.log(`${actionText} ${logMessage} response`, response)

      if (response.code !== 0) {
        this.logger.error(`${actionText} ${logMessage} 失败`, response.message)
        return null
      }
      if (response.data.code !== 0) {
        this.logger.error(`${actionText} ${logMessage} 失败`, response.data.msg)
        return null
      }

      if (response.data.level_up_list && response.data.level_up_list.length > 0) {
        // 喂猫或撸猫后升级了
        const levelUpInfo = response.data.level_up_list[0]
        const rewardInfo = levelUpInfo.rewards?.map((r) => `${r.name}${r.desc}`).join('，')
        this.logger.log(
          `${actionText} ${logMessage} 已升级到 ${levelUpInfo.level_name}（Lv.${levelUpInfo.level}）${rewardInfo ? `，获得奖励：${rewardInfo}` : ''}`,
        )
      }

      return response.data
    } catch (error) {
      this.logger.error(`${actionText} ${logMessage} 出错`, error)
      return null
    }
  }

  /**
   * 喂猫，消耗掉所有剩余猫粮
   *
   * @param medal 粉丝勋章
   * @param logMessage 直播间描述信息，用于日志
   * @param balance 剩余猫粮数量
   * @returns 是否把猫粮都喂完了
   */
  private async feedCat(
    medal: LiveData.FansMedalPanel.List,
    logMessage: string,
    balance: number,
  ): Promise<boolean> {
    if (balance <= 0) {
      this.logger.log(`${logMessage} 没有剩余猫粮，跳过喂猫`)
      return true
    }

    const ruid = medal.medal.target_id
    this.logger.log(`${logMessage} 开始喂猫，剩余猫粮 ${balance} 份`)

    for (let i = 0; i < MiaoZaiTask.FEED_CAT_MAX_TIMES; i++) {
      const data = await this.executeAction('喂猫', logMessage, () =>
        BAPI.live.Q3FansS1MiaoZaiFeedCat(ruid),
      )

      if (!data) return false

      this.logger.log(
        `${logMessage} 喂猫成功，获得 ${data.growth_delta} 点成长值（当前成长值 ${data.growth}），剩余猫粮 ${data.food_balance} 份`,
      )

      if (data.food_balance <= 0) return true

      await sleep(MiaoZaiTask.ACTION_DYNAMIC_SHORT_INTERVAL)
    }

    this.logger.warn(`${logMessage} 喂猫次数已达上限 ${MiaoZaiTask.FEED_CAT_MAX_TIMES}，停止喂猫`)
    return false
  }

  /**
   * 撸猫，直到连续多次没有获得成长值
   *
   * @param medal 粉丝勋章
   * @param logMessage 直播间描述信息，用于日志
   * @returns 是否正常完成今日撸猫任务
   */
  private async petCat(medal: LiveData.FansMedalPanel.List, logMessage: string): Promise<boolean> {
    const ruid = medal.medal.target_id
    let zeroGrowthCount = 0
    let totalGrowth = 0

    this.logger.log(`${logMessage} 开始撸猫`)

    for (let i = 0; i < MiaoZaiTask.PET_CAT_MAX_TIMES; i++) {
      const data = await this.executeAction('撸猫', logMessage, () =>
        BAPI.live.Q3FansS1MiaoZaiPetCat(ruid),
      )

      if (!data) return false

      if (data.growth_delta > 0) {
        zeroGrowthCount = 0
        totalGrowth += data.growth_delta
        this.logger.log(
          `${logMessage} 撸猫成功，获得 ${data.growth_delta} 点成长值（当前成长值 ${data.growth}）`,
        )
      } else {
        zeroGrowthCount++
        this.logger.log(`${logMessage} 撸猫成功，但没有获得成长值（连续 ${zeroGrowthCount} 次）`)

        if (zeroGrowthCount >= MiaoZaiTask.PET_CAT_ZERO_GROWTH_LIMIT) {
          this.logger.log(
            `${logMessage} 连续 ${MiaoZaiTask.PET_CAT_ZERO_GROWTH_LIMIT} 次撸猫没有获得成长值，今日撸猫任务已完成，本次共获得 ${totalGrowth} 点成长值`,
          )
          return true
        }
      }

      await sleep(MiaoZaiTask.ACTION_DYNAMIC_SHORT_INTERVAL)
    }

    this.logger.warn(`${logMessage} 撸猫次数已达上限 ${MiaoZaiTask.PET_CAT_MAX_TIMES}，停止撸猫`)
    return false
  }

  /**
   * 复查养猫结果并输出喵崽的当前数据
   *
   * @param medal 粉丝勋章
   * @param logMessage 直播间描述信息，用于日志
   * @returns 签到和喂猫是否都已完成
   */
  private async verifyResult(
    medal: LiveData.FansMedalPanel.List,
    logMessage: string,
  ): Promise<boolean> {
    const home = await this.fetchHome(medal)

    if (!home) {
      this.logger.error(`${logMessage} 无法获取最新养猫活动数据，无法确认任务是否完成，默认已完成`)
      return true
    }

    const cat = home.cat_info
    if (cat) {
      this.logger.log(
        `${logMessage} 喵崽【${cat.cat_name}】当前为 ${cat.level_name}（Lv.${cat.level}），成长值 ${cat.growth}/${cat.next_level_growth}`,
      )
    }

    let completed = true

    if (!MiaoZaiTask.isSignInDone(home)) {
      this.logger.warn(`${logMessage} 签到任务仍未完成，下次运行会继续尝试`)
      completed = false
    }

    const balance = home.food_info?.balance ?? 0
    if (balance > 0) {
      this.logger.warn(`${logMessage} 仍剩余 ${balance} 份猫粮没有喂完，下次运行会继续尝试`)
      completed = false
    }

    await this.logFreeIntimacy(medal)

    return completed
  }

  /**
   * 获取并记录已储蓄的亲密度信息
   */
  private async logFreeIntimacy(medal: LiveData.FansMedalPanel.List): Promise<void> {
    const data = await this.fetchMedalData(medal.medal.target_id)
    if (data) {
      this.logFreeIntimacyFromData(medal, data)
    }
  }

  /**
   * 执行单个直播间的养猫任务
   *
   * @param medal 粉丝勋章
   * @returns 执行结果
   */
  private async executeMiaoZaiTask(
    medal: LiveData.FansMedalPanel.List,
  ): Promise<MiaoZaiTaskResult> {
    const room_id = medal.room_info.room_id
    const ruid = medal.medal.target_id
    const nick_name = medal.anchor_info.nick_name
    const medal_name = medal.medal.medal_name
    const logMessage = `粉丝勋章【${medal_name}】（主播【${nick_name}】，UID：${ruid}，直播间：${room_id}）`

    let home = await this.fetchHome(medal)
    if (!home) {
      this.logger.error(`${logMessage} 无法获取养猫活动数据，跳过该直播间`)
      return 'uncompleted'
    }

    if (home.activity_status !== MiaoZaiTask.ACTIVITY_STATUS_ONGOING) {
      this.logger.warn(
        `超能粉丝节——亲密喂养活动当前不可用（activity_status：${home.activity_status}），中断养猫任务`,
      )
      return 'activityInvalid'
    }

    // 还没选猫，先选一只
    if (!home.cat_selected) {
      this.logger.log(`${logMessage} 还没有选择喵崽，先选择一只`)

      const data = await this.executeAction('选择喵崽', logMessage, () =>
        BAPI.live.Q3FansS1MiaoZaiSelectCat(ruid),
      )

      if (!data) {
        this.logger.error(`${logMessage} 选择喵崽失败，跳过该直播间`)
        return 'uncompleted'
      }

      await sleep(MiaoZaiTask.ACTION_DYNAMIC_LONG_INTERVAL)

      // 重新获取主页数据，拿到选完猫之后的猫粮数量和任务状态
      home = await this.fetchHome(medal)
      if (!home) {
        this.logger.error(`${logMessage} 选择喵崽后无法获取养猫活动数据，跳过该直播间`)
        return 'uncompleted'
      }
    }

    let balance = home.food_info?.balance ?? 0

    // 签到领猫粮
    if (MiaoZaiTask.isSignInDone(home)) {
      this.logger.log(`${logMessage} 今天已经签到过了`)
    } else {
      const data = await this.executeAction('签到', logMessage, () =>
        BAPI.live.Q3FansS1MiaoZaiSignIn(ruid),
      )

      if (data) {
        this.logger.log(`${logMessage} 签到成功，当前共有 ${data.food_balance} 份猫粮`)
        balance = data.food_balance
      } else {
        this.logger.error(`${logMessage} 签到失败，仍然尝试喂完已有的猫粮`)
      }

      await sleep(MiaoZaiTask.ACTION_DYNAMIC_LONG_INTERVAL)
    }

    // 喂猫
    const fed = await this.feedCat(medal, logMessage, balance)
    await sleep(MiaoZaiTask.ACTION_DYNAMIC_LONG_INTERVAL)

    // 撸猫
    const petted = await this.petCat(medal, logMessage)
    await sleep(MiaoZaiTask.ACTION_DYNAMIC_LONG_INTERVAL)

    const verified = await this.verifyResult(medal, logMessage)

    return fed && petted && verified ? 'completed' : 'uncompleted'
  }

  public async run(): Promise<void> {
    this.logger.log('亲密喂养模块开始运行')

    if (ts() > MiaoZaiTask.ACTIVITY_END_TIME) {
      this.logger.warn('超能粉丝节——亲密喂养活动已结束，亲密喂养模块自动禁用')
      this.config.enabled = false
      return
    }

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      if (!(await MedalModule.waitForFansMedals())) {
        this.logger.error('粉丝勋章数据不存在，不执行养猫任务')
        this.status = 'error'
        return
      }

      this.status = 'running'
      const fansMedals = this.getMedals()

      if (fansMedals.length > 0) {
        let allCompleted = true

        for (let i = 0; i < fansMedals.length; i++) {
          if (MedalModule.shouldStopForCrossDay()) {
            this.logger.log('即将或刚刚发生跨天，提早结束本轮养猫任务')
            allCompleted = false
            break
          }

          const result = await this.executeMiaoZaiTask(fansMedals[i])

          if (result === 'activityInvalid') {
            allCompleted = false
            break
          } else if (result === 'uncompleted') {
            allCompleted = false
          }

          if (i < fansMedals.length - 1) {
            await sleep(MiaoZaiTask.ROOM_DYNAMIC_INTERVAL)
          }
        }

        if (allCompleted) {
          this.config._lastCompleteTime = tsm()
          this.logger.log('养猫任务已完成')
          this.status = 'done'
        } else {
          this.status = ''
        }
      } else {
        this.status = 'done'
        this.config._lastCompleteTime = tsm()
      }
    } else {
      if (isNowBefore(0, 5)) {
        this.logger.log('昨天的养猫任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过养猫任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    this.nextRunTimer = setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离亲密喂养模块下次运行时间:', diff.str)
  }
}

export default MiaoZaiTask
