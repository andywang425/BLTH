import BaseModule from '../../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '../../../../library/luxon'
import BAPI from '../../../../library/bili-api'
import { useBiliStore } from '../../../../stores/useBiliStore'
import { sleep } from '../../../../library/utils'
import { moduleStatus } from '../../../../types/module'

class LikeTask extends BaseModule {
  medalTasksConfig = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
  config = this.medalTasksConfig.like

  set status(s: moduleStatus) {
    this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.like = s
  }

  /**
   * 获取粉丝勋章的房间号和主播uid，过滤等级大于等于20或不符合黑白名单要求的粉丝勋章
   * @returns 数组，数组中的每个元素都是数组：[房间号，主播uid]
   */
  private getRoomidUidList(): [number, number][] | null {
    const biliStore = useBiliStore()
    if (biliStore.filteredFansMedals) {
      return (
        biliStore.filteredFansMedals
          .filter(
            (medal) =>
              medal.medal.level < 20 &&
              (this.medalTasksConfig.isWhiteList
                ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id)
                : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id))
          )
          .map((medal) => [medal.room_info.room_id, medal.medal.target_id]) as [number, number][]
      ).slice(0, 199)
    } else {
      this.status = 'error'
      return null
    }
  }

  /**
   * 点赞
   * @param roomid 直播间号
   * @param target_id 主播UID
   */
  private async like(roomid: number, target_id: number): Promise<void> {
    try {
      const response = await BAPI.live.likeReport(roomid, target_id)
      this.logger.log(`BAPI.live.likeReport(${roomid}, ${target_id})`, response)
      if (response.code === 0) {
        this.logger.log(`给主播点赞 房间号 = ${roomid} 主播UID = ${target_id} 成功`)
      } else {
        this.logger.error(
          `给主播点赞 房间号 = ${roomid} 主播UID = ${target_id} 失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(`给主播点赞 房间号 = ${roomid} 主播UID = ${target_id} 出错`, error)
    }
  }

  public async run(): Promise<void> {
    this.logger.log('给主播点赞模块开始运行')
    if (this.config.enabled) {
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        this.status = 'running'
        const idList = this.getRoomidUidList()
        if (idList) {
          for (const [roomid, target_id] of idList) {
            await this.like(roomid, target_id)
            // 延时防风控
            await sleep(2000)
          }
          this.config._lastCompleteTime = tsm()
          this.status = 'done'
          this.logger.log('给主播点赞任务已完成')
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log('昨天的给主播点赞任务已经完成过了，等到今天的00:05再执行')
        } else {
          this.logger.log('今天已经完成过给主播点赞任务了')
          this.status = 'done'
        }
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离给主播点赞模块下次运行时间:', diff.str)
  }
}

export default LikeTask
