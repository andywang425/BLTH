import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore } from '@/stores/useBiliStore'
import { arrayToMap, sleep } from '@/library/utils'
import type { ModuleStatusTypes } from '@/types'
import _ from 'lodash'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'

class LightTask extends MedalModule {
  medalTasksConfig = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
  config = this.medalTasksConfig.light

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.light = s
  }

  /**
   * 获取粉丝勋章，过滤不符合黑白名单要求和不需要点亮的粉丝勋章
   * @returns 数组，数组中的每个元素都是数组：[房间号，主播uid]
   */
  private getRoomidTargetidList(): [number, number][] {
    const filtered = useBiliStore()
      .filteredFansMedals.filter(
        (medal) =>
          medal.medal.level < 20 &&
          (this.medalTasksConfig.isWhiteList
            ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id)
            : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id)) &&
          medal.medal.is_lighted === 0
      )
      .map<[number, number]>((medal) => [medal.room_info.room_id, medal.medal.target_id])

    if (this.medalTasksConfig.isWhiteList) {
      const orderMap = arrayToMap(this.medalTasksConfig.roomidList)
      return filtered.sort((a, b) => orderMap.get(a[0])! - orderMap.get(b[0])!)
    }

    return filtered
  }

  /**
   * 点赞
   * @param roomid 直播间号
   * @param target_id 主播UID
   * @param click_time 点赞次数
   */
  private async like(roomid: number, target_id: number, click_time: number): Promise<void> {
    try {
      const response = await BAPI.live.likeReport(roomid, target_id, click_time)
      this.logger.log(`BAPI.live.likeReport(${roomid}, ${target_id}, ${click_time})`, response)
      if (response.code === 0) {
        this.logger.log(
          `点亮熄灭勋章-点赞 房间号 = ${roomid} 主播UID = ${target_id} 点赞次数 = ${click_time} 成功`
        )
      } else {
        this.logger.error(
          `点亮熄灭勋章-点赞 房间号 = ${roomid} 主播UID = ${target_id} 点赞次数 = ${click_time} 失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(
        `点亮熄灭勋章-点赞 房间号 = ${roomid} 主播UID = ${target_id} 点赞次数 = ${click_time} 出错`,
        error
      )
    }
  }

  /**
   * 发弹幕
   * @param danmu 弹幕内容
   * @param roomid 直播间号
   */
  private async sendDanmu(danmu: string, roomid: number): Promise<void> {
    try {
      const response = await BAPI.live.sendMsg(danmu, roomid)
      this.logger.log(`BAPI.live.sendMsg(${danmu}, ${roomid})`, response)
      if (response.code === 0) {
        if (response.msg === 'k') {
          this.logger.warn(
            `点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 异常，弹幕可能包含屏蔽词`
          )
        } else {
          this.logger.log(`点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 成功`)
        }
      } else {
        this.logger.error(
          `点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(`点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 出错`, error)
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
      const roomidTargetidList: number[][] = this.getRoomidTargetidList()

      if (roomidTargetidList.length > 0) {
        for (let i = 0; i < roomidTargetidList.length; i++) {
          const [roomid, target_id] = roomidTargetidList[i]
          if (this.config.mode === 'like') {
            await this.like(roomid, target_id, _.random(31, 33))
          } else {
            await this.sendDanmu(this.config.danmuList[i % this.config.danmuList.length], roomid)
          }
          // 延时防风控
          await sleep(_.random(3000, 5000))
        }
      }

      this.config._lastCompleteTime = tsm()
      this.status = 'done'
      this.logger.log('点亮熄灭勋章任务已完成')
    } else {
      if (isNowIn(0, 0, 0, 5)) {
        this.logger.log('昨天的给点亮熄灭勋章任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过点亮熄灭勋章任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离点亮熄灭勋章模块下次运行时间:', diff.str)
  }
}

export default LightTask
