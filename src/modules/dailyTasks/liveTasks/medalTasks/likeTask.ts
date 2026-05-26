import { delayToNextMoment, isNowAfter, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore, useModuleStore } from '@/stores'
import { sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'
import _ from 'lodash'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'

class LikeTask extends MedalModule {
  config = this.medalTasksConfig.like

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.like = s
  }

  /**
   * 获取已点亮且主播开播中的粉丝勋章
   */
  private getMedals(): LiveData.FansMedalPanel.List[] {
    const fansMedals = useBiliStore().filteredFansMedals
    const result = fansMedals.filter(
      (medal) =>
        this.SHARED_MEDAL_FILTERS.meetWhiteOrBlackList(medal) &&
        this.SHARED_MEDAL_FILTERS.levelLt120(medal) &&
        this.SHARED_MEDAL_FILTERS.isLighted(medal) &&
        this.SHARED_MEDAL_FILTERS.isLiving(medal),
    )

    if (this.config.isWhiteList) {
      this.sortMedals(result)
    }

    return result
  }

  /**
   * 点赞
   */
  private async like(medal: LiveData.FansMedalPanel.List, click_time: number): Promise<void> {
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
      } else {
        this.logger.error(`点赞 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`点赞 ${logMessage} 出错`, error)
    }
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
      const fansMedals = this.getMedals()
      let allCompleted = true

      outer: for (let i = 0; i < fansMedals.length; i++) {
        if (isNowAfter(23, 55) || isNowBefore(0, 5)) {
          this.logger.log('即将或刚刚发生跨天，提早结束本轮点赞任务')
          allCompleted = false
          break
        }

        const medal = fansMedals[i]
        const medalData = await this.fetchMedalData(medal.medal.target_id)
        if (!medalData) {
          this.logger.error(
            `无法获取主播【${medal.anchor_info.nick_name}】（UID：${medal.medal.target_id}）的粉丝团升级任务信息，跳过点赞任务`,
          )
          continue
        }

        const item = MedalModule.findTaskInfo(medalData.task_info, 'like')
        if (!item) {
          this.logger.error(
            `无法在主播【${medal.anchor_info.nick_name}】（UID：${medal.medal.target_id}）的粉丝团升级任务信息中找到点赞任务，跳过点赞任务`,
          )
          continue
        }

        if (item.is_done) continue

        const parsed = MedalModule.parseDailyLimit(item.sub_title)
        if (!parsed) {
          this.logger.error(
            `无法解析主播【${medal.anchor_info.nick_name}】（UID：${medal.medal.target_id}）的点赞任务的每日上限信息，跳过点赞任务`,
          )
          continue
        }

        if (parsed.current >= parsed.limit) continue

        // 每轮点赞次数
        const times = MedalModule.parseTitleCount(item.title) ?? 30
        // 剩余点赞轮数
        const remaining = parsed.limit - parsed.current
        for (let j = 0; j < remaining; j++) {
          if (isNowAfter(23, 55) || isNowBefore(0, 5)) {
            this.logger.log('即将或刚刚发生跨天，提早结束本轮点赞任务')
            allCompleted = false
            break outer
          }

          await this.like(medal, _.random(times, times + 3))

          if (j < remaining - 1 || i < fansMedals.length - 1) {
            await sleep(_.random(15000, 20000))
          }
        }

        await this.logFreeIntimacy(medal)
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
