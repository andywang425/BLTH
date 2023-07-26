import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '../../../library/luxon'
import BAPI from '../../../library/bili-api'
import { sleep, wait } from '../../../library/utils'
import { Istatus } from '../../../types/moduleStatus'

class AppUserTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.appUser

  set status(s: Istatus) {
    this.moduleStore.moduleStatus.DailyTasks.LiveTasks.appUser = s
  }

  private async getUserTaskProgress() {
    try {
      const response = await BAPI.live.getUserTaskProgress()
      this.logger.log('BAPI.live.getUserTaskProgress response', response)
      if (response.code === 0) {
        return response.data
      } else {
        this.logger.error('获取APP用户任务进度失败', response.message)
        this.status = 'error'
        return null
      }
    } catch (error) {
      this.logger.error('获取APP用户任务进度出错', error)
      this.status = 'error'
      return null
    }
  }

  private async userTaskReceiveRewards() {
    try {
      const response = await BAPI.live.userTaskReceiveRewards()
      this.logger.log('BAPI.live.userTaskReceiveRewards response', response)
      if (response.code === 0) {
        return response.data
      } else {
        this.logger.error('获取APP用户任务进度失败', response.message)
        this.status = 'error'
        return null
      }
    } catch (error) {
      this.logger.error('获取APP用户任务进度出错', error)
      this.status = 'error'
      return null
    }
  }

  private async sendDanmu(danmu: string, roomid: number) {
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

  public async run() {
    this.logger.log('APP用户任务模块开始运行')
    if (this.config.enabled) {
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        this.status = 'running'
        const danmuConfig = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.danmu
        if (danmuConfig.enabled && !isTimestampToday(danmuConfig._lastCompleteTime)) {
          // 如果开启了发送弹幕功能且今天还没完成，等发送弹幕功能完成了或者达到超时时间了再运行
          await wait(this.moduleName, 300e3)
        }
        const progressResponse = await this.getUserTaskProgress()
        if (progressResponse) {
          if (progressResponse.is_surplus !== -1) {
            if (progressResponse.day_task.status === 3) {
              // 今天用户已经手动领过奖励
              this.config._lastCompleteTime = tsm()
              this.status = 'done'
            } else if (progressResponse.day_task.status === 2) {
              // 已完成任务，直接领奖励
              const receiveResponse = await this.userTaskReceiveRewards()
              if (receiveResponse) {
                const num = receiveResponse.num
                if (num) {
                  this.logger.log(`领取奖励成功：${num}个电池`)
                } else {
                  this.logger.warn(`领取奖励失败：未领取到电池`)
                }
                this.config._lastCompleteTime = tsm()
                this.status = 'done'
              }
            } else {
              // 还没完成任务，先完成任务
              let remainProgress =
                progressResponse.day_task.target - progressResponse.day_task.progress
              while (remainProgress > 0) {
                await this.sendDanmu(`打卡${remainProgress}`, 22474988)
                await sleep(2000)
                remainProgress--
              }
              // 然后领奖励
              const receiveResponse = await this.userTaskReceiveRewards()
              if (receiveResponse) {
                const num = receiveResponse.num
                if (num) {
                  this.logger.log(`领取奖励成功：${num}个电池`)
                } else {
                  this.logger.warn(`领取奖励失败：未领取到电池`)
                }
                this.config._lastCompleteTime = tsm()
                this.status = 'done'
              }
            }
          } else {
            this.logger.log('今天APP用户任务的奖励已经没有了，明天早点来吧')
            this.config._lastCompleteTime = tsm()
            this.status = 'done'
          }
        }
      } else {
        if (!isNowIn(0, 0, 0, 5)) {
          this.logger.log('今天已经完成过APP用户任务了')
          this.status = 'done'
        } else {
          this.logger.log('昨天的APP用户任务已经完成过了，等到今天的00:05再执行')
        }
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离APP用户任务模块下次运行时间:', diff.str)
  }
}

export default AppUserTask
