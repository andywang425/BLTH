import { delayToNextMoment, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore, useModuleStore } from '@/stores'
import type { ModuleStatusTypes } from '@/types'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'
import { sleep } from '@/library/utils'
import type { BatchExecutionResult, GroupedMedals, TaskExecutionResult } from './types'

class LikeTask extends MedalModule {
  config = this.medalTasksConfig.like

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.like = s
  }

  /**
   * 获取已点亮的粉丝勋章，并按是否可立即点赞分组
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
        if (this.SHARED_MEDAL_FILTERS.isLiving(medal)) {
          // 当前直播间正在直播，可立即点赞
          result.readyMedals.push(medal)
        } else if (this.config.waitUntilLiving) {
          // 当前直播未开播但开启了“等待开播后再点赞”，等直播间开播后再点赞
          result.waitingMedals.push(medal)
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
   * 点赞
   *
   * @returns 是否点赞成功
   */
  private async like(medal: LiveData.FansMedalPanel.List, click_time: number): Promise<boolean> {
    const room_id = medal.room_info.room_id
    const target_id = medal.medal.target_id
    const nick_name = medal.anchor_info.nick_name
    const medal_name = medal.medal.medal_name
    const logMessage = `粉丝勋章【${medal_name}】 给主播【${nick_name}】（UID：${target_id}）的直播间（${room_id}）点赞 ${click_time} 次`

    try {
      const response = await BAPI.live.likeReport(room_id, target_id, click_time)
      this.logger.log(`BAPI.live.likeReport(${room_id}, ${target_id}, ${click_time})`, response)
      if (response.code === 0) {
        this.logger.log(`点赞 ${logMessage} 成功`)
        return true
      } else {
        this.logger.error(`点赞 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`点赞 ${logMessage} 出错`, error)
    }

    return false
  }

  /**
   * 执行单个直播间的点赞任务
   *
   * @returns 执行结果，包含是否中断以及是否确认完成
   */
  private async executeLikeTask(medal: LiveData.FansMedalPanel.List): Promise<TaskExecutionResult> {
    if (this.shouldStopForCrossDay()) {
      this.logger.log('即将或刚刚发生跨天，提早结束本轮点赞任务')
      return { interrupted: true, verifiedCompleted: false }
    }

    const room_id = medal.room_info.room_id
    const target_id = medal.medal.target_id
    const nick_name = medal.anchor_info.nick_name
    const medal_name = medal.medal.medal_name

    const medalData = await this.fetchMedalData(target_id)
    if (!medalData) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法获取主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团升级任务信息，跳过点赞任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    if (medalData.reach_free_intimacy_limit) {
      this.logger.warn(
        `粉丝勋章【${medal_name}】（主播【${nick_name}】，UID：${target_id}，直播间：${room_id}）已达到储蓄亲密度上限（已储蓄 ${medalData.free_intimacy} 亲密度，投喂一个粉丝灯牌即可领取这些亲密度），无法通过点赞获取更多亲密度，跳过点赞任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    const item = MedalModule.findTaskInfo(medalData.task_info, 'like')
    if (!item) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法在主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团升级任务信息中找到点赞任务，跳过点赞任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    if (item.is_done) return { interrupted: false, verifiedCompleted: true }

    const parsed = MedalModule.parseDailyLimit(item.sub_title)
    if (!parsed) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法解析主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的点赞任务的每日上限信息，跳过点赞任务`,
      )
      return { interrupted: false, verifiedCompleted: true }
    }

    if (parsed.current >= parsed.limit) return { interrupted: false, verifiedCompleted: true }

    // 执行前校验：在发出第一个 likeReport 前确认直播间仍在直播
    // 以「每房间一次」的粒度，避免按过期状态点赞
    const verdict = await this.preExecuteVerify(
      room_id,
      (liveStatus) => liveStatus === 1,
      this.config.waitUntilLiving,
    )
    if (verdict !== 'pass') {
      this.logger.log(
        `粉丝勋章【${medal_name}】 执行前校验：主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）当前不在直播，${verdict === 'requeue' ? '回到等待队列' : '本轮跳过'}`,
      )
      return verdict === 'requeue'
        ? { interrupted: false, verifiedCompleted: false, requeue: true }
        : { interrupted: false, verifiedCompleted: true }
    }

    const times = MedalModule.parseTitleCount(item.title) ?? 30
    const target = this.config.useTargetRounds
      ? Math.min(parsed.limit, this.config.targetRounds)
      : parsed.limit
    const remaining = target - parsed.current
    let hasSuccessfulLike = false

    for (let j = 0; j < remaining; j++) {
      if (this.shouldStopForCrossDay()) {
        this.logger.log('即将或刚刚发生跨天，提早结束本轮点赞任务')
        return { interrupted: true, verifiedCompleted: false }
      }

      if (await this.like(medal, times)) {
        hasSuccessfulLike = true
      }

      if (j < remaining - 1) {
        await sleep(MedalModule.LIKE_DYNAMIC_INTERVAL)
      }
    }

    if (hasSuccessfulLike) {
      return {
        interrupted: false,
        verifiedCompleted: await this.confirmTaskCompletedAfterUpdate(
          medal,
          'like',
          this.config.useTargetRounds ? target : undefined,
        ),
      }
    }

    // 所有点赞尝试均失败，估计是有什么异常状况，跳过
    return { interrupted: false, verifiedCompleted: true }
  }

  /**
   * 顺序执行多个直播间的点赞任务
   *
   * @returns 执行结果，包含是否中断、是否都确认完成、以及执行前校验未通过需回到等待队列的直播间
   */
  private async executeLikeTasks(
    medals: LiveData.FansMedalPanel.List[],
  ): Promise<BatchExecutionResult> {
    let verifiedCompleted = true
    const requeueRoomids: number[] = []

    for (let i = 0; i < medals.length; i++) {
      const result = await this.executeLikeTask(medals[i])
      if (result.interrupted) {
        return { interrupted: true, verifiedCompleted: false, requeueRoomids }
      }
      if (result.requeue) {
        requeueRoomids.push(medals[i].room_info.room_id)
      } else if (!result.verifiedCompleted) {
        verifiedCompleted = false
      }

      if (i < medals.length - 1) {
        await sleep(MedalModule.LIKE_DYNAMIC_INTERVAL)
      }
    }

    return { interrupted: false, verifiedCompleted, requeueRoomids }
  }

  public async run(): Promise<void> {
    this.logger.log('点赞模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      await this.waitForLightTask()

      if (!(await this.waitForFansMedals())) {
        this.logger.error('粉丝勋章数据不存在，不执行点赞任务')
        this.status = 'error'
        return
      }

      this.status = 'running'

      const { readyMedals, waitingMedals } = this.getMedals()
      let pendingRoomids = waitingMedals.map((medal) => medal.room_info.room_id)
      let allCompleted = true

      const initialResult = await this.executeLikeTasks(readyMedals)
      // 初始 readyMedals 中执行前校验发现已下播、且开启了等待开播的房间，并入等待队列
      pendingRoomids.push(...initialResult.requeueRoomids)
      if (initialResult.interrupted || !initialResult.verifiedCompleted) {
        allCompleted = false
      }

      while (allCompleted && pendingRoomids.length > 0) {
        if (this.shouldStopForCrossDay()) {
          this.logger.log('即将或刚刚发生跨天，提早结束本轮点赞任务')
          allCompleted = false
          break
        }

        const roundResult = await this.runWaitingRound(
          pendingRoomids,
          (liveStatus) => liveStatus === 1,
          (medal) => this.executeLikeTask(medal),
        )
        pendingRoomids = roundResult.pendingRoomids

        if (roundResult.interrupted || !roundResult.verifiedCompleted) {
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
            `仍有 ${pendingRoomids.length} 个直播间未开播，${MedalModule.WAIT_POLL_INTERVAL / 1000} 秒后继续检查`,
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
        this.logger.log('点赞任务已完成')
      } else {
        this.status = ''
      }
    } else {
      if (isNowBefore(0, 5)) {
        this.logger.log('昨天的点赞任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过点赞任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    this.nextRunTimer = setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离点赞模块下次运行时间:', diff.str)
  }
}

export default LikeTask
