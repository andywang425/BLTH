import { delayToNextMoment, isNowAfter, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore, useModuleStore } from '@/stores'
import { sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'
import _ from 'lodash'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'

class DanmuTask extends MedalModule {
  config = this.medalTasksConfig.danmu

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.danmu = s
  }

  /**
   * 获取已点亮的粉丝勋章；开启 `onlyWhenNotLiving` 时排除开播中的
   */
  private getMedals(): LiveData.FansMedalPanel.List[] {
    const fansMedals = useBiliStore().filteredFansMedals
    const result = fansMedals.filter(
      (medal) =>
        this.SHARED_MEDAL_FILTERS.meetWhiteOrBlackList(medal) &&
        this.SHARED_MEDAL_FILTERS.levelLt120(medal) &&
        this.SHARED_MEDAL_FILTERS.isLighted(medal) &&
        (!this.config.onlyWhenNotLiving || !this.SHARED_MEDAL_FILTERS.isLiving(medal)),
    )

    if (this.config.isWhiteList) {
      this.sortMedals(result)
    }

    return result
  }

  /**
   * 发弹幕
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
      MedalModule.clearTaskInfoCache()
      const fansMedals = this.getMedals()
      let allCompleted = true
      let danmuIndex = 0

      outer: for (let i = 0; i < fansMedals.length; i++) {
        if (isNowAfter(23, 55) || isNowBefore(0, 5)) {
          this.logger.log('即将或刚刚发生跨天，提早结束本轮发弹幕任务')
          allCompleted = false
          break
        }

        const medal = fansMedals[i]
        const taskInfo = await this.fetchTaskInfo(medal.medal.target_id)
        if (!taskInfo) {
          this.logger.error(
            `无法获取主播【${medal.anchor_info.nick_name}】（UID：${medal.medal.target_id}）的粉丝团升级任务信息，跳过发弹幕任务`,
          )
          continue
        }

        const item = MedalModule.findTaskInfo(taskInfo, 'sendDanmu')
        if (!item) {
          this.logger.error(
            `无法在主播【${medal.anchor_info.nick_name}】（UID：${medal.medal.target_id}）的粉丝团升级任务信息中找到发弹幕任务，跳过发弹幕任务`,
          )
          continue
        }

        if (item.is_done) continue

        const parsed = MedalModule.parseDailyLimit(item.sub_title)
        if (!parsed) {
          this.logger.error(
            `无法解析主播【${medal.anchor_info.nick_name}】（UID：${medal.medal.target_id}）的发弹幕任务的每日上限信息，跳过发弹幕任务`,
          )
          continue
        }

        if (parsed.current >= parsed.limit) continue

        let target = parsed.limit - parsed.current
        let failedCount = 0

        for (let j = 0; j < target; j++) {
          if (isNowAfter(23, 55) || isNowBefore(0, 5)) {
            this.logger.log('即将或刚刚发生跨天，提早结束本轮发弹幕任务')
            allCompleted = false
            break outer
          }

          const danmuText = this.config.danmuList[danmuIndex++ % this.config.danmuList.length]
          if (!(await this.sendDanmu(medal, danmuText))) {
            if (++failedCount > MedalModule.DANMU_RETRY_LIMIT) {
              this.logger.warn(`当前直播间（${medal.room_info.room_id}）弹幕发送失败次数过多，跳过`)
              await sleep(_.random(6000, 8000))
              break
            }
            target++
          }

          if (j < target - 1 || i < fansMedals.length - 1) {
            await sleep(_.random(6000, 8000))
          }
        }
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
