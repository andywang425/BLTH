import { delayToNextMoment, isNowBefore, isTimestampToday, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore, useModuleStore } from '@/stores'
import { sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'
import _ from 'lodash'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'

type MedalsByLiving = [LiveData.FansMedalPanel.List[], LiveData.FansMedalPanel.List[]]

class LightTask extends MedalModule {
  config = this.medalTasksConfig.light

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.light = s
  }

  /**
   * 获取未点亮的粉丝勋章
   *
   * @returns [[主播未开播的粉丝勋章], [主播开播中的粉丝勋章]]
   */
  private getMedals(): MedalsByLiving {
    const fansMedals = useBiliStore().filteredFansMedals
    const result: MedalsByLiving = [[], []]

    fansMedals.forEach((medal) => {
      if (
        !this.SHARED_MEDAL_FILTERS.meetWhiteOrBlackList(medal) ||
        this.SHARED_MEDAL_FILTERS.isLighted(medal)
      ) {
        // 跳过被黑白名单过滤的和已经点亮的粉丝勋章
        return
      }

      // 根据直播状态划分
      const index = this.SHARED_MEDAL_FILTERS.isLiving(medal) ? 1 : 0
      result[index].push(medal)
    })

    if (this.config.isWhiteList) {
      // 白名单排序
      this.sortMedals(result[0])
      this.sortMedals(result[1])
    }

    return result
  }

  /**
   * 点赞
   * @param medal 粉丝勋章
   * @param click_time 点赞次数
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
        this.logger.log(`点亮熄灭勋章-点赞 ${logMessage} 成功`)
      } else {
        this.logger.error(`点亮熄灭勋章-点赞 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`点亮熄灭勋章-点赞 ${logMessage} 出错`, error)
    }
  }

  /**
   * 发弹幕
   * @param medal 粉丝勋章
   * @param danmu 弹幕内容
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
          this.logger.warn(`点亮熄灭勋章-发送弹幕 ${logMessage} 异常，弹幕可能包含屏蔽词`)
        } else {
          this.logger.log(`点亮熄灭勋章-发送弹幕 ${logMessage} 成功`)
          return true
        }
      } else {
        this.logger.error(`点亮熄灭勋章-发送弹幕 ${logMessage} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`点亮熄灭勋章-发送弹幕 ${logMessage} 出错`, error)
    }

    return false
  }

  /**
   * 给正在直播的直播间点赞
   * @param medals
   * @private
   */
  private async likeTask(medals: LiveData.FansMedalPanel.List[]) {
    for (let i = 0; i < medals.length; i++) {
      const medal = medals[i]
      const taskInfo = await this.fetchTaskInfo(medal.medal.target_id)
      const item = MedalModule.findTaskInfo(taskInfo, 'like')
      // 从 title 解析点亮所需点赞次数（如 "点赞30次" → 30），失败时 fallback 到 30
      const baseCount = MedalModule.parseTitleCount(item?.title) ?? 30
      await this.like(medal, _.random(baseCount, baseCount + 5))

      if (i < medals.length - 1) {
        await sleep(_.random(30000, 35000))
      }
    }
  }

  /**
   * 在未开播的直播间发弹幕
   * @param medals
   * @private
   */
  private async sendDanmuTask(medals: LiveData.FansMedalPanel.List[]) {
    let danmuIndex = 0

    for (let i = 0; i < medals.length; i++) {
      const medal = medals[i]
      const taskInfo = await this.fetchTaskInfo(medal.medal.target_id)
      const item = MedalModule.findTaskInfo(taskInfo, 'sendDanmu')
      // 从 title 解析点亮所需弹幕条数（如 "发弹幕10次" → 10），失败时 fallback 到 10
      const baseTarget = MedalModule.parseTitleCount(item?.title) ?? 10
      let target = baseTarget
      const maxTarget = baseTarget + 3 // 失败补偿，最多多发 3 条

      for (let j = 0; j < target; j++) {
        const danmuText = this.config.danmuList[danmuIndex++ % this.config.danmuList.length]

        if (!(await this.sendDanmu(medal, danmuText))) {
          target = Math.min(target + 1, maxTarget)
        }

        if (i < medals.length - 1 || j < target - 1) {
          await sleep(_.random(6000, 8000))
        }
      }
    }
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
      this.resetTaskInfoCache()
      const fansMedals = this.getMedals()

      await Promise.allSettled([this.sendDanmuTask(fansMedals[0]), this.likeTask(fansMedals[1])])

      this.config._lastCompleteTime = tsm()
      this.status = 'done'
      this.logger.log('点亮熄灭勋章任务已完成')
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
