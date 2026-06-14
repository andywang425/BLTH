import { delayToNextMoment, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore, useModuleStore } from '@/stores'
import type { ModuleStatusTypes } from '@/types'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'
import { sleep } from '@/library/utils'
import type { GroupedMedals, TaskExecutionResult } from './types'

class DanmuTask extends MedalModule {
  config = this.medalTasksConfig.danmu

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.danmu = s
  }

  /**
   * 获取已点亮的粉丝勋章，并按是否可立即发弹幕分组
   */
  private getMedals(): GroupedMedals<'readyMedals' | 'waitingMedals'> {
    const fansMedals = useBiliStore().filteredFansMedals
    const result: GroupedMedals<'readyMedals' | 'waitingMedals'> = {
      readyMedals: [],
      waitingMedals: [],
    }

    fansMedals.forEach((medal) => {
      if (
        this.SHARED_MEDAL_FILTERS.meetWhiteOrBlackList(medal) &&
        this.SHARED_MEDAL_FILTERS.levelLt120(medal) &&
        this.SHARED_MEDAL_FILTERS.isLighted(medal)
      ) {
        if (this.config.onlyWhenNotLiving && this.SHARED_MEDAL_FILTERS.isLiving(medal)) {
          // 开启了“仅在未开播的直播间发弹幕”且正在直播
          if (this.config.waitUntilNotLiving) {
            // 开启了“等待下播后再发弹幕”，等下播了再发弹幕
            result.waitingMedals.push(medal)
          }
          // 没开“等待下播后再发弹幕”，跳过
        } else {
          // 没开“仅在未开播的直播间发弹幕”或者直播间未开播，可立即发弹幕
          result.readyMedals.push(medal)
        }
      }
    })

    if (this.config.isWhiteList) {
      this.sortMedals(result.readyMedals)
      this.sortMedals(result.waitingMedals)
    }

    return result
  }

  /**
   * 发弹幕
   *
   * @returns 是否发送成功
   */
  private async sendDanmu(medal: LiveData.FansMedalPanel.List, danmu: string): Promise<boolean> {
    const room_id = medal.room_info.room_id
    const target_id = medal.medal.target_id
    const nick_name = medal.anchor_info.nick_name
    const medal_name = medal.medal.medal_name
    const logMessage = `粉丝勋章【${medal_name}】 在主播【${nick_name}】（UID：${target_id}）的直播间（${room_id}）发送弹幕 ${danmu}`

    try {
      const response = await BAPI.live.sendMsg(danmu, room_id)
      this.logger.log(`BAPI.live.sendMsg(${danmu}, ${room_id})`, response)
      if (response.code === 0) {
        if (response.msg === '') {
          this.logger.log(`发弹幕 ${logMessage} 成功`)
          return true
        } else if (response.msg === 'k') {
          this.logger.warn(`发弹幕 ${logMessage} 异常，弹幕可能包含屏蔽词`)
        } else if (response.msg === 'f') {
          this.logger.warn(`发弹幕 ${logMessage} 异常，弹幕被过滤`)
        } else {
          this.logger.warn(`发弹幕 ${logMessage} 异常，未知错误：${response.msg}`)
        }
      } else {
        this.logger.error(`发弹幕 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`发弹幕 ${logMessage} 出错`, error)
    }

    return false
  }

  /**
   * 执行单个直播间的发弹幕任务
   *
   * @returns 执行结果，包含是否中断以及是否确认完成
   */
  private async executeDanmuTask(
    medal: LiveData.FansMedalPanel.List,
    danmuIndexRef: { value: number },
  ): Promise<TaskExecutionResult> {
    if (this.shouldStopForCrossDay()) {
      this.logger.log('即将或刚刚发生跨天，提早结束本轮发弹幕任务')
      return { interrupted: true, verifiedCompleted: false }
    }

    const room_id = medal.room_info.room_id
    const target_id = medal.medal.target_id
    const nick_name = medal.anchor_info.nick_name
    const medal_name = medal.medal.medal_name

    const medalData = await this.fetchMedalData(target_id)
    if (!medalData) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法获取主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团升级任务信息，跳过发弹幕任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    if (medalData.reach_free_intimacy_limit) {
      this.logger.warn(
        `粉丝勋章【${medal_name}】（主播【${nick_name}】，UID：${target_id}，直播间：${room_id}）已达到储蓄亲密度上限（已储蓄 ${medalData.free_intimacy} 亲密度，投喂一个粉丝灯牌即可领取这些亲密度），无法通过发弹幕获取更多亲密度，跳过发弹幕任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    const item = MedalModule.findTaskInfo(medalData.task_info, 'sendDanmu')
    if (!item) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法在主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团升级任务信息中找到发弹幕任务，跳过发弹幕任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    if (item.is_done) return { interrupted: false, verifiedCompleted: true }

    const parsed = MedalModule.parseDailyLimit(item.sub_title)
    if (!parsed) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法解析主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的发弹幕任务的每日上限信息，跳过发弹幕任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    if (parsed.current >= parsed.limit) return { interrupted: false, verifiedCompleted: true }

    const target = this.config.useTargetRounds
      ? Math.min(parsed.limit, this.config.targetRounds)
      : parsed.limit
    let remaining = target - parsed.current
    let failedCount = 0
    let hasSuccessfulDanmu = false

    for (let j = 0; j < remaining; j++) {
      if (this.shouldStopForCrossDay()) {
        this.logger.log('即将或刚刚发生跨天，提早结束本轮发弹幕任务')
        return { interrupted: true, verifiedCompleted: false }
      }

      const danmuText = this.config.danmuList[danmuIndexRef.value++ % this.config.danmuList.length]
      if (await this.sendDanmu(medal, danmuText)) {
        hasSuccessfulDanmu = true
      } else {
        if (++failedCount > MedalModule.DANMU_RETRY_LIMIT) {
          this.logger.warn(`当前直播间（${medal.room_info.room_id}）弹幕发送失败次数过多，跳过`)
          break
        }
        remaining += 1
      }

      if (j < remaining - 1) {
        await sleep(MedalModule.SEND_DANMU_DYNAMIC_INTERVAL)
      }
    }

    if (hasSuccessfulDanmu) {
      return {
        interrupted: false,
        verifiedCompleted: await this.confirmTaskCompletedAfterUpdate(
          medal,
          'sendDanmu',
          this.config.useTargetRounds ? target : undefined,
        ),
      }
    }

    // 所有发弹幕尝试均失败，估计是有什么异常状况，跳过
    return { interrupted: false, verifiedCompleted: true }
  }

  /**
   * 顺序执行多个直播间的发弹幕任务
   *
   * @returns 执行结果，包含是否中断以及是否都确认完成
   */
  private async executeDanmuTasks(
    medals: LiveData.FansMedalPanel.List[],
    danmuIndexRef: { value: number },
  ): Promise<TaskExecutionResult> {
    let verifiedCompleted = true

    for (let i = 0; i < medals.length; i++) {
      const result = await this.executeDanmuTask(medals[i], danmuIndexRef)
      if (result.interrupted) return result
      if (!result.verifiedCompleted) {
        verifiedCompleted = false
      }

      if (i < medals.length - 1) {
        await sleep(MedalModule.SEND_DANMU_DYNAMIC_INTERVAL)
      }
    }

    return { interrupted: false, verifiedCompleted }
  }

  public async run(): Promise<void> {
    this.logger.log('发弹幕模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      await this.waitForLightTask()

      if (!(await this.waitForFansMedals())) {
        this.logger.error('粉丝勋章数据不存在，不执行发弹幕任务')
        this.status = 'error'
        return
      }

      this.status = 'running'
      const { readyMedals, waitingMedals } = this.getMedals()
      let allCompleted = true
      const danmuIndexRef = { value: 0 }
      let pendingRoomids = waitingMedals.map((medal) => medal.room_info.room_id)

      const initialResult = await this.executeDanmuTasks(readyMedals, danmuIndexRef)
      if (initialResult.interrupted) {
        allCompleted = false
      } else if (!initialResult.verifiedCompleted) {
        allCompleted = false
      }

      while (allCompleted && pendingRoomids.length > 0) {
        if (this.shouldStopForCrossDay()) {
          this.logger.log('即将或刚刚发生跨天，提早结束本轮发弹幕任务')
          allCompleted = false
          break
        }

        const { readyMedals: newlyReadyMedals, pendingRoomids: nextPendingRoomids } =
          await this.probeWaitingMedals(pendingRoomids, (liveStatus) => liveStatus !== 1)

        pendingRoomids = nextPendingRoomids

        const waitResult = await this.executeDanmuTasks(newlyReadyMedals, danmuIndexRef)
        if (waitResult.interrupted) {
          allCompleted = false
          break
        }
        if (!waitResult.verifiedCompleted) {
          allCompleted = false
          break
        }

        if (pendingRoomids.length > 0) {
          const medalMap = useBiliStore().filteredFansMedalsMap
          const pendingRoomsInfo: Record<number, string | undefined> = {}

          for (const roomid of pendingRoomids) {
            pendingRoomsInfo[roomid] = medalMap.get(roomid)?.anchor_info.nick_name
          }

          this.logger.log(
            `仍有 ${pendingRoomids.length} 个直播间未下播，${MedalModule.WAIT_POLL_INTERVAL / 1000} 秒后继续检查`,
            { pendingRoomsInfo },
          )
          await sleep(MedalModule.WAIT_POLL_INTERVAL)
        }
      }

      if (pendingRoomids.length > 0) {
        allCompleted = false
      }

      if (allCompleted) {
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
        this.logger.log('发弹幕任务已完成')
      } else {
        this.status = ''
      }
    } else {
      if (isNowBefore(0, 5)) {
        this.logger.log('昨天的发弹幕任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过发弹幕任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    this.nextRunTimer = setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离发弹幕模块下次运行时间:', diff.str)
  }
}

export default DanmuTask
