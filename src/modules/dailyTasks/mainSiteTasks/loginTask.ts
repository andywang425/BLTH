import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import { useBiliStore } from '@/stores/useBiliStore'
import type { ModuleStatusTypes } from '@/types'

class LoginTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s
  }

  private async login(): Promise<void> {
    // 触发每日登录任务的请求是 BAPI.main.nav
    // 这个请求脚本在默认模块 userInfo 中每天都会发送
    // 而且打开任意B站页面的时候都会有这个请求
    // 所以直接当作是完成了
    this.logger.log('每日登录任务已完成')
    // 记录当前时间戳
    this.config._lastCompleteTime = tsm()
    this.status = 'done'
    return Promise.resolve()
  }

  public async run(): Promise<void> {
    this.logger.log('每日登录模块开始运行')

    // 上一次完成每日登录任务的时间不在今天
    if (!isTimestampToday(this.config._lastCompleteTime)) {
      const biliStore = useBiliStore()

      if (!biliStore.dailyRewardInfo) {
        this.logger.error('主站每日任务完成情况不存在，不执行每日登录任务')
        this.status = 'error'
        return
      }

      this.status = 'running'

      if (!biliStore.dailyRewardInfo!.login) {
        // 每日登录任务未完成
        await this.login()
      } else {
        // 用户在运行脚本前已经完成了任务，也记录完成时间
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
      }
    } else {
      if (isNowIn(0, 0, 0, 5)) {
        this.logger.log('昨天的每日登录任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过每日登录任务了')
        this.status = 'done'
      }
    }

    // 明天半夜再运行
    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离每日登录模块下次运行时间:', diff.str)
  }
}

export default LoginTask
