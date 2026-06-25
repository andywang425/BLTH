import { delayToNextMoment, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import { useBiliStore, useModuleStore } from '@/stores'
import type { ModuleStatusTypes } from '@/types'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'
import { sleep } from '@/library/utils'
import type { AfterExecutionAction, BatchExecutionResult, GroupedMedals } from './types'

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
   * 执行单个直播间的点赞任务
   *
   * @param medal 粉丝勋章
   * @param skipPreVerify 是否跳过执行前直播状态校验，默认 false
   *
   * @returns 执行结果
   */
  private async executeLikeTask(
    medal: LiveData.FansMedalPanel.List,
    skipPreVerify?: false,
  ): Promise<AfterExecutionAction>
  private async executeLikeTask(
    medal: LiveData.FansMedalPanel.List,
    skipPreVerify?: true,
  ): Promise<Exclude<AfterExecutionAction, 'requeue'>>
  private async executeLikeTask(
    medal: LiveData.FansMedalPanel.List,
    skipPreVerify = false,
  ): Promise<AfterExecutionAction | Exclude<AfterExecutionAction, 'requeue'>> {
    if (MedalModule.shouldStopForCrossDay()) {
      this.logger.log('即将或刚刚发生跨天，提早结束本轮点赞任务')
      return 'stop'
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
      return null
    }

    if (medalData.reach_free_intimacy_limit) {
      this.logger.warn(
        `粉丝勋章【${medal_name}】（主播【${nick_name}】，UID：${target_id}，直播间：${room_id}）已达到储蓄亲密度上限（已储蓄 ${medalData.free_intimacy} 亲密度，投喂一个粉丝灯牌即可领取这些亲密度），无法通过点赞获取更多亲密度，跳过点赞任务`,
      )
      return null
    }

    const item = MedalModule.findTaskInfo(medalData.task_info, 'like')
    if (!item) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法在主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团升级任务信息中找到点赞任务，跳过点赞任务`,
      )
      return null
    }

    if (item.is_done) return null

    const parsed = MedalModule.parseDailyLimit(item.sub_title)
    if (!parsed) {
      this.logger.error(
        `粉丝勋章【${medal_name}】 无法解析主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的点赞任务的每日上限信息，跳过点赞任务`,
      )
      return null
    }

    if (parsed.current >= parsed.limit) return null

    if (!skipPreVerify) {
      const verdict = await this.preExecuteVerify(room_id, (liveStatus) => liveStatus === 1)

      if (verdict === 'error') {
        this.logger.error(
          `粉丝勋章【${medal_name}】 执行前校验：无法获取主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的直播状态，${this.config.waitUntilLiving ? '回到等待队列' : '跳过点赞任务'}；可能遭遇风控，休眠 5 分钟再继续`,
        )
        await sleep(300e3)

        return this.config.waitUntilLiving ? 'requeue' : null
      } else if (verdict === 'fail') {
        this.logger.log(
          `粉丝勋章【${medal_name}】 执行前校验：主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）当前不在直播，${this.config.waitUntilLiving ? '回到等待队列' : '跳过点赞任务'}`,
        )
        return this.config.waitUntilLiving ? 'requeue' : null
      }
    }

    const times = MedalModule.parseTitleCount(item.title) ?? 30
    const target = this.config.useTargetRounds
      ? Math.min(parsed.limit, this.config.targetRounds)
      : parsed.limit
    const remaining = target - parsed.current
    let hasSuccessfulLike = false

    for (let j = 0; j < remaining; j++) {
      if (MedalModule.shouldStopForCrossDay()) {
        this.logger.log('即将或刚刚发生跨天，提早结束本轮点赞任务')
        return 'stop'
      }

      if (await this.like(medal, times)) {
        hasSuccessfulLike = true
      }

      if (j < remaining - 1) {
        await sleep(MedalModule.LIKE_DYNAMIC_INTERVAL)
      }
    }

    if (hasSuccessfulLike) {
      return (await this.confirmTaskCompletedAfterUpdate(
        medal,
        'like',
        this.config.useTargetRounds ? target : undefined,
      ))
        ? null
        : 'markUncompleted'
    }

    // 所有点赞尝试均失败，估计是有什么异常状况，跳过
    return null
  }

  /**
   * 顺序执行多个直播间的点赞任务
   *
   * @returns 执行结果
   */
  private async executeLikeTasks(
    medals: LiveData.FansMedalPanel.List[],
  ): Promise<BatchExecutionResult> {
    let markUncompleted = false
    const requeueRoomids: number[] = []

    for (let i = 0; i < medals.length; i++) {
      const action = await this.executeLikeTask(medals[i])
      if (action === 'stop') {
        return { stop: true }
      } else if (action === 'requeue') {
        requeueRoomids.push(medals[i].room_info.room_id)
      } else if (action === 'markUncompleted') {
        markUncompleted = true
      }

      if (i < medals.length - 1) {
        await sleep(MedalModule.LIKE_DYNAMIC_INTERVAL)
      }
    }

    return { markUncompleted, requeueRoomids }
  }

  public async run(): Promise<void> {
    this.logger.log('点赞模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      await this.waitForLightTask()

      if (!(await MedalModule.waitForFansMedals())) {
        this.logger.error('粉丝勋章数据不存在，不执行点赞任务')
        this.status = 'error'
        return
      }

      this.status = 'running'
      MedalModule.initSnapshotsWithFansMedalsData()

      const { readyMedals, waitingMedals } = this.getMedals()
      let pendingRoomids = waitingMedals.map((medal) => medal.room_info.room_id)
      let allCompleted = true

      const { stop, markUncompleted, requeueRoomids } = await this.executeLikeTasks(readyMedals)

      if (stop) {
        allCompleted = false
      } else {
        if (markUncompleted) {
          allCompleted = false
        }
        if (requeueRoomids) {
          pendingRoomids.push(...requeueRoomids)
        }

        while (pendingRoomids.length > 0) {
          const { stop, markUncompleted, requeueRoomids } = await this.runWaitingRound(
            pendingRoomids,
            (liveStatus) => liveStatus === 1,
            (medal) => this.executeLikeTask(medal, true),
          )
          if (stop) {
            allCompleted = false
            break
          }
          if (markUncompleted) {
            allCompleted = false
          }

          pendingRoomids = requeueRoomids!

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
