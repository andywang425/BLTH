import { delayToNextMoment, isNowIn, isTimestampToday, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore, useModuleStore } from '@/stores'
import { sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'
import _ from 'lodash'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'

class DanmuTask extends MedalModule {
  config = this.medalTasksConfig.danmu

  protected get taskConfig() {
    return this.config
  }

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
        this.PUBLIC_MEDAL_FILTERS.whiteBlackList(medal) &&
        this.PUBLIC_MEDAL_FILTERS.levelLt120(medal) &&
        medal.medal.is_lighted === 1 &&
        (!this.config.onlyWhenNotLiving || medal.room_info.living_status !== 1),
    )

    if (this.taskConfig.isWhiteList) {
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
        if (response.msg === 'k') {
          this.logger.warn(`粉丝团发弹幕 ${logMessage} 异常，弹幕可能包含屏蔽词`)
        } else {
          this.logger.log(`粉丝团发弹幕 ${logMessage} 成功`)
          return true
        }
      } else {
        this.logger.error(`粉丝团发弹幕 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`粉丝团发弹幕 ${logMessage} 出错`, error)
    }

    return false
  }

  public async run(): Promise<void> {
    this.logger.log('粉丝团发弹幕模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      await this.waitForLightTask()

      if (!(await this.waitForFansMedals())) {
        this.logger.error('粉丝勋章数据不存在，不执行粉丝团发弹幕任务')
        this.status = 'error'
        return
      }

      this.status = 'running'
      this.resetTaskInfoCache()
      const fansMedals = this.getMedals()
      let allCompleted = true
      let danmuIndex = 0

      outer: for (let i = 0; i < fansMedals.length; i++) {
        if (isNowIn(23, 55, 0, 5)) {
          this.logger.log('即将或刚刚发生跨天，提早结束本轮粉丝团发弹幕任务')
          allCompleted = false
          break
        }

        const medal = fansMedals[i]
        const taskInfo = await this.fetchTaskInfo(medal.medal.target_id)
        if (!taskInfo) continue

        const item = MedalModule.findTaskInfo(taskInfo, 'sendDanmu')
        if (!item || item.is_done) continue

        const parsed = MedalModule.parseDailyLimit(item.sub_title)
        if (!parsed || parsed.current >= parsed.limit) continue

        const remaining = parsed.limit - parsed.current
        // 失败补偿：最多额外发 3 条
        let target = remaining
        const maxTarget = remaining + 3

        for (let j = 0; j < target; j++) {
          if (isNowIn(23, 55, 0, 5)) {
            this.logger.log('即将或刚刚发生跨天，提早结束本轮粉丝团发弹幕任务')
            allCompleted = false
            break outer
          }

          const danmuText = this.config.danmuList[danmuIndex++ % this.config.danmuList.length]
          const ok = await this.sendDanmu(medal, danmuText)
          if (!ok) {
            target = Math.min(target + 1, maxTarget)
          }

          if (j < target - 1 || i < fansMedals.length - 1) {
            await sleep(_.random(6000, 8000))
          }
        }
      }

      if (allCompleted) {
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
        this.logger.log('粉丝团发弹幕任务已完成')
      } else {
        this.status = ''
      }
    } else {
      if (isNowIn(0, 0, 0, 5)) {
        this.logger.log('昨天的粉丝团发弹幕任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过粉丝团发弹幕任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    this.nextRunTimer = setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离粉丝团发弹幕模块下次运行时间:', diff.str)
  }
}

export default DanmuTask
