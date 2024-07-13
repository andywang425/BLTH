import BaseModule from '../../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '../../../../library/luxon'
import BAPI from '../../../../library/bili-api'
import { useBiliStore } from '../../../../stores/useBiliStore'
import { sleep } from '../../../../library/utils'
import { ModuleStatusTypes } from '../../../../types/module'

class DanmuTask extends BaseModule {
  medalTasksConfig = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
  config = this.medalTasksConfig.danmu

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.danmu = s
  }

  /**
   * 获取粉丝勋章的房间号，过滤等级大于等于20或不符合黑白名单要求的粉丝勋章
   */
  private getRoomidList(): number[] | null {
    const biliStore = useBiliStore()
    if (biliStore.filteredFansMedals) {
      return biliStore.filteredFansMedals
        .filter(
          (medal) =>
            (this.config.includeHighLevelMedals ? true : medal.medal.level < 20) &&
            medal.room_info.room_id != 910884 &&
            (this.medalTasksConfig.isWhiteList
              ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id)
              : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id))
        )
        .map((medal) => medal.room_info.room_id)
        .slice(0, 199)
    } else {
      this.status = 'error'
      return null
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
        this.logger.log(`在直播间 ${roomid} 发送弹幕 ${danmu} 成功`)
      } else {
        this.logger.error(`在直播间 ${roomid} 发送弹幕 ${danmu} 失败`, response.message)
      }
    } catch (error) {
      this.logger.error(`在直播间 ${roomid} 发送弹幕 ${danmu} 出错`, error)
    }
  }

  public async run(): Promise<void> {
    this.logger.log('发送弹幕模块开始运行')
    if (this.config.enabled) {
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        this.status = 'running'
        const roomIdList = this.getRoomidList()
        if (roomIdList) {
          const danmuList = this.config.list
          for (let i = 0; i < roomIdList.length; i++) {
            // 循环抽取弹幕
            const danmu = danmuList[i % danmuList.length]
            await this.sendDanmu(danmu, roomIdList[i])
            // 延时防风控
            await sleep(2000)
          }
          this.config._lastCompleteTime = tsm()
          this.status = 'done'
          this.logger.log('发送弹幕任务已完成')
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log('昨天的发送弹幕任务已经完成过了，等到今天的00:05再执行')
        } else {
          this.logger.log('今天已经完成过发送弹幕任务了')
          this.status = 'done'
        }
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离发送弹幕模块下次运行时间:', diff.str)
  }
}

export default DanmuTask
