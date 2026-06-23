import { delayToNextMoment, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import { useBiliStore, useModuleStore } from '@/stores'
import { sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'
import type { GroupedMedals, LightPathExecutionResult } from './types'

class LightTask extends MedalModule {
  config = this.medalTasksConfig.light

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.light = s
  }

  /**
   * 获取未点亮的粉丝勋章，并按是否开播分组
   */
  private getMedals(): GroupedMedals<'notLivingMedals' | 'livingMedals'> {
    const fansMedals = useBiliStore().filteredFansMedals
    const result: GroupedMedals<'notLivingMedals' | 'livingMedals'> = {
      notLivingMedals: [],
      livingMedals: [],
    }

    fansMedals.forEach((medal) => {
      if (
        !this.SHARED_MEDAL_FILTERS.meetWhiteOrBlackList(medal) ||
        this.SHARED_MEDAL_FILTERS.isLighted(medal)
      ) {
        // 跳过被黑白名单过滤的和已经点亮的粉丝勋章
        return
      }

      // 根据直播状态分组
      if (this.SHARED_MEDAL_FILTERS.isLiving(medal)) {
        result.livingMedals.push(medal)
      } else {
        result.notLivingMedals.push(medal)
      }
    })

    if (this.config.isWhiteList) {
      // 白名单排序
      this.sortMedals(result.livingMedals)
      this.sortMedals(result.notLivingMedals)
    }

    return result
  }

  /**
   * 点亮任务完成后，是否仍有下游任务需要最新的粉丝勋章点亮状态
   */
  private shouldRefreshFansMedals(): boolean {
    const { like, danmu, watch } = this.medalTasksConfig
    const downstreamTasks = [like, danmu, watch]

    return downstreamTasks.some((task) => task.enabled && !isTimestampToday(task._lastCompleteTime))
  }

  /**
   * 校验本轮尝试点亮的粉丝勋章是否都已点亮
   */
  private verifyLightedMedals(medals: LiveData.FansMedalPanel.List[]): boolean {
    const latestMedalMap = useBiliStore().filteredFansMedalsMap
    let allVerified = true

    medals.forEach((medal) => {
      const latestMedal = latestMedalMap.get(medal.room_info.room_id)
      if (!latestMedal) {
        this.logger.warn(
          `粉丝勋章【${medal.medal.medal_name}】点亮后，未在刷新后的粉丝勋章列表中找到该勋章，忽略该勋章`,
          medal,
        )
        return
      }

      if (latestMedal.medal.is_lighted !== 1) {
        this.logger.warn(
          `粉丝勋章【${medal.medal.medal_name}】已执行点亮任务，但刷新粉丝勋章后仍未点亮，下次运行会继续尝试点亮`,
        )
        allVerified = false
      }
    })

    return allVerified
  }

  /**
   * 给正在直播的直播间点赞
   * @param medals
   */
  private async likeTask(
    medals: LiveData.FansMedalPanel.List[],
  ): Promise<LightPathExecutionResult> {
    const attemptedMedals: LiveData.FansMedalPanel.List[] = []
    const skippedByStatusMedals: LiveData.FansMedalPanel.List[] = []

    for (let i = 0; i < medals.length; i++) {
      const medal = medals[i]
      const room_id = medal.room_info.room_id
      const target_id = medal.medal.target_id
      const nick_name = medal.anchor_info.nick_name
      const medal_name = medal.medal.medal_name

      const medalData = await this.fetchMedalData(target_id)
      if (!medalData) {
        this.logger.error(
          `粉丝勋章【${medal_name}】 无法获取主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团点亮任务信息，跳过点赞任务`,
        )
        continue
      }

      const likeItem = MedalModule.findTaskInfo(medalData.task_info, 'like')
      if (!likeItem) {
        this.logger.error(
          `粉丝勋章【${medal_name}】 无法在主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团点亮任务信息中找到点赞任务，跳过点赞任务`,
        )
        continue
      }

      const verdict = await this.preExecuteVerify(room_id, (liveStatus) => liveStatus === 1)

      if (verdict === 'error') {
        skippedByStatusMedals.push(medal)
        this.logger.error(
          `粉丝勋章【${medal_name}】 执行前校验：无法确认主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）当前是否在直播，转交下一轮发弹幕点亮；可能遭遇风控，休眠 5 分钟再继续`,
        )
        await sleep(300e3)
        continue
      } else if (verdict === 'fail') {
        skippedByStatusMedals.push(medal)
        this.logger.log(
          `粉丝勋章【${medal_name}】 执行前校验：主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）当前不在直播，转交下一轮发弹幕点亮`,
        )
        continue
      }

      const times = MedalModule.parseTitleCount(likeItem.title) ?? 30
      await this.like(medal, times)
      attemptedMedals.push(medal)

      if (i < medals.length - 1) {
        await sleep(MedalModule.LIKE_DYNAMIC_INTERVAL)
      }
    }

    return { attemptedMedals, skippedByStatusMedals }
  }

  /**
   * 在未开播的直播间发弹幕
   *
   * @param medals 待发弹幕的粉丝勋章
   * @param danmuIndexRef 弹幕索引引用，用于记录当前正在发送的弹幕索引
   */
  private async sendDanmuTask(
    medals: LiveData.FansMedalPanel.List[],
    danmuIndexRef: { value: number },
  ): Promise<LightPathExecutionResult> {
    const attemptedMedals: LiveData.FansMedalPanel.List[] = []
    const skippedByStatusMedals: LiveData.FansMedalPanel.List[] = []

    for (let i = 0; i < medals.length; i++) {
      const medal = medals[i]
      const room_id = medal.room_info.room_id
      const target_id = medal.medal.target_id
      const nick_name = medal.anchor_info.nick_name
      const medal_name = medal.medal.medal_name

      const medalData = await this.fetchMedalData(target_id)
      if (!medalData) {
        this.logger.error(
          `粉丝勋章【${medal_name}】 无法获取主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团点亮任务信息，跳过发弹幕任务`,
        )
        continue
      }

      const danmuItem = MedalModule.findTaskInfo(medalData.task_info, 'sendDanmu')
      if (!danmuItem) {
        this.logger.error(
          `粉丝勋章【${medal_name}】 无法在主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）的粉丝团点亮任务信息中找到发弹幕任务，跳过发弹幕任务`,
        )
        continue
      }

      const verdict = await this.preExecuteVerify(room_id, (liveStatus) => liveStatus !== 1)

      if (verdict === 'error') {
        skippedByStatusMedals.push(medal)
        this.logger.error(
          `粉丝勋章【${medal_name}】 执行前校验：无法确认主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）当前是否在直播，转交下一轮点赞点亮；可能遭遇风控，休眠 5 分钟再继续`,
        )
        await sleep(300e3)
        continue
      } else if (verdict === 'fail') {
        skippedByStatusMedals.push(medal)
        this.logger.log(
          `粉丝勋章【${medal_name}】 执行前校验：主播【${nick_name}】（UID：${target_id}，直播间：${room_id}）当前正在直播，转交下一轮点赞点亮`,
        )
        continue
      }

      let remaining = MedalModule.parseTitleCount(danmuItem.title) ?? 10
      let failedCount = 0

      for (let j = 0; j < remaining; j++) {
        const danmuText =
          this.config.danmuList[danmuIndexRef.value++ % this.config.danmuList.length]

        if (!(await this.sendDanmu(medal, danmuText))) {
          if (++failedCount > MedalModule.DANMU_RETRY_LIMIT) {
            this.logger.warn(`当前直播间（${medal.room_info.room_id}）弹幕发送失败次数过多，跳过`)
            if (i < medals.length - 1) await sleep(MedalModule.SEND_DANMU_DYNAMIC_INTERVAL)
            break
          }
          remaining += 1
        }

        if (i < medals.length - 1 || j < remaining - 1) {
          await sleep(MedalModule.SEND_DANMU_DYNAMIC_INTERVAL)
        }
      }

      attemptedMedals.push(medal)
    }

    return { attemptedMedals, skippedByStatusMedals }
  }

  public async run(): Promise<void> {
    this.logger.log('点亮熄灭勋章模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      if (!(await this.waitForFansMedals())) {
        this.logger.error('粉丝勋章数据不存在，不执行点亮熄灭勋章任务')
        this.status = 'error'
        return
      }

      this.status = 'running'
      MedalModule.initSnapshotsWithFansMedalsData()

      let { notLivingMedals, livingMedals } = this.getMedals()
      // 是否有需要点亮的粉丝勋章（是不是一次有效运行？）
      const isEffectiveRun = notLivingMedals.length > 0 || livingMedals.length > 0
      let allCompleted = true

      if (isEffectiveRun) {
        const attemptedMedals: LiveData.FansMedalPanel.List[] = []
        // 跨房间共享的弹幕索引，避免每个房间都从同一条弹幕开始发
        const danmuIndexRef = { value: 0 }

        while (notLivingMedals.length > 0 || livingMedals.length > 0) {
          const [danmuResult, likeResult] = await Promise.allSettled([
            this.sendDanmuTask(notLivingMedals, danmuIndexRef),
            this.likeTask(livingMedals),
          ])
          if (danmuResult.status === 'rejected' || likeResult.status === 'rejected') {
            allCompleted = false
            break
          }

          attemptedMedals.push(
            ...danmuResult.value.attemptedMedals,
            ...likeResult.value.attemptedMedals,
          )

          livingMedals = danmuResult.value.skippedByStatusMedals
          notLivingMedals = likeResult.value.skippedByStatusMedals
          if (notLivingMedals.length > 0 || livingMedals.length > 0) {
            this.logger.log(
              `有 ${notLivingMedals.length + livingMedals.length} 个粉丝勋章因执行前校验发现直播状态不符被跳过，立即按最新状态重试`,
              {
                retryDanmuMedals: notLivingMedals,
                retryLikeMedals: livingMedals,
              },
            )
          }
        }

        if (attemptedMedals.length > 0 || this.shouldRefreshFansMedals()) {
          // 刷新粉丝勋章，确保 点亮任务自身以及 点赞/发弹幕/观看直播 任务都能拿到最新勋章状态
          await sleep(MedalModule.WAIT_MEDAL_UPDATE_DELAY)
          const refreshed = await this.refreshFansMedals()

          if (attemptedMedals.length > 0) {
            if (refreshed) {
              allCompleted = this.verifyLightedMedals(attemptedMedals)
            } else {
              this.logger.warn('无法确认点亮任务是否完成，本轮按未完成处理')
              allCompleted = false
            }
          }
        }
      }

      if (allCompleted) {
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
        this.logger.log('点亮熄灭勋章任务已完成')
      } else {
        this.status = ''
      }
    } else {
      if (isNowBefore(0, 5)) {
        this.logger.log('昨天的给点亮熄灭勋章任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过点亮熄灭勋章任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    this.nextRunTimer = setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离点亮熄灭勋章模块下次运行时间:', diff.str)
  }
}

export default LightTask
