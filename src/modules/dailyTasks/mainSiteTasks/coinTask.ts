import BaseModule from '../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '@/library/luxon'
import { useBiliStore } from '@/stores/useBiliStore'
import BAPI from '@/library/bili-api'
import type { ModuleStatusTypes } from '@/types'

class CoinTask extends BaseModule {
  config = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.coin

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.coin = s
  }

  // 暂时先限制每个视频最多投一个币
  // 因为转载视频只能投一个币，原创视频能投两个币
  // 但是想查询视频是否为转载，我目前只知道一个 /x/web-interface/wbi/view
  // 通过其响应的copyright字段（1原创，2转载）来判断
  // 不过视频数量足够多，所以干脆直接限制每个视频最多投一个币
  private readonly MAX_COIN = 1

  /**
   * 获取动态视频的 aid 和 bvid
   */
  private getDynamicVideoIds(): { aid: string; bvid: string }[] {
    const biliStore = useBiliStore()
    // 返回所有视频的 aid 和 bvid
    return biliStore.dynamicVideos!.map((item) => {
      const archive = item.modules.module_dynamic.major.archive
      return {
        aid: archive.aid,
        bvid: archive.bvid
      }
    })
  }

  /**
   * 获取一个视频的你的已投硬币数量
   *
   * @returns 你的已投硬币数
   */
  private async getVideoCoinInfo(aid: string, bvid: string): Promise<number> {
    try {
      const response = await BAPI.main.videoRelation(aid, bvid)
      this.logger.log(`BAPI.main.videoRelation(${aid}, ${bvid}) response`, response)
      if (response.code === 0) {
        return response.data.coin
      } else {
        this.logger.error(`获取视频投币信息失败 aid = ${aid} bvid = ${bvid}`, response.message)
        return 0
      }
    } catch (error) {
      this.logger.error(`获取视频投币信息出错 aid = ${aid} bvid = ${bvid}`, error)
      return 0
    }
  }

  /**
   * 给动态中的视频投币
   * @param left_coin_num 还需要投的硬币数
   */
  private async coinDynamicVideos(left_coin_num: number): Promise<void> {
    const ids = this.getDynamicVideoIds()
    for (const { aid, bvid } of ids) {
      // 该视频已投币数量
      const coined_num = await this.getVideoCoinInfo(aid, bvid)
      // 剩余可投硬币数量
      const allowed_coin_num = this.MAX_COIN - coined_num
      if (allowed_coin_num > 0) {
        // 剩余可投硬币数和剩余所需投币数取较小者
        const coin_num = Math.min(allowed_coin_num, left_coin_num)
        const result = await this.coin(aid, coin_num)
        if (result === 0) {
          // 成功投币
          left_coin_num -= coin_num
          if (left_coin_num === 0) {
            this.logger.log('每日投币任务已完成')
            this.config._lastCompleteTime = tsm()
            this.status = 'done'
            break
          }
        } else if (result === 1) {
          // 硬币余额不足，终止任务，不记录完成时间
          this.logger.warn('硬币余额不足，每日投币任务终止')
          this.status = 'error'
          break
        }
      }
    }

    if (left_coin_num > 0) {
      // 硬币余额不足，终止任务，不记录完成时间
      this.logger.warn('硬币余额不足，每日投币任务终止')
      this.status = 'error'
    }
  }

  /**
   * 投币
   */
  private async coin(aid: string, num: number): Promise<number> {
    try {
      const response = await BAPI.main.coinAdd(aid, num)
      this.logger.log(`BAPI.main.coinAdd(${aid}) response`, response)
      if (response.code === 0) {
        this.logger.log(`投币成功 视频aid = ${aid} 投币数量num = ${num}`)
        return 0
      } else if (response.code === -104) {
        this.logger.warn('硬币余额不足，每日投币任务终止')
        return 1
      } else {
        this.logger.error(`投币失败 视频aid = ${aid} 投币数量num = ${num}`, response.message)
        return 2
      }
    } catch (err) {
      this.logger.error(`投币出错 视频aid = ${aid} 投币数量num = ${num}`, err)
      return 3
    }
  }

  /**
   * 运行前检查
   */
  private runCheck(): boolean {
    const biliStore = useBiliStore()

    if (!biliStore.dailyRewardInfo) {
      this.logger.error('主站每日任务完成情况不存在，不执行每日投币任务')
      this.status = 'error'
      return false
    }
    if (!biliStore.dynamicVideos) {
      this.logger.error('动态视频数据不存在，不执行每日投币任务')
      this.status = 'error'
      return false
    }

    return true
  }

  public async run(): Promise<void> {
    this.logger.log('每日投币模块开始运行')

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      if (!this.runCheck()) {
        return
      }

      const biliStore = useBiliStore()
      this.status = 'running'
      // 今日已投币数量
      const total_coined_num = biliStore.dailyRewardInfo!.coins / 10
      if (total_coined_num < this.config.num) {
        // 剩余要投的硬币数量
        const left_coin_num = this.config.num - total_coined_num
        // 拥有的硬币数量
        const money = biliStore.userInfo!.money ?? 5
        if (left_coin_num > money) {
          this.logger.log('硬币余额不足，不执行每日投币任务')
          this.status = 'done'
        } else {
          // 目前仅支持动态视频投币
          await this.coinDynamicVideos(left_coin_num)
        }
      } else {
        this.config._lastCompleteTime = tsm()
        this.status = 'done'
        this.logger.log('每日投币任务已完成')
      }
    } else {
      // 为了更加准确的语言描述和任务状态图标显示，需要判断当前所处的时间段
      // 下面文字中的今天、昨天是指真实的今天、昨天而非在 isTimestampToday 函数中重新定义的
      if (isNowIn(0, 0, 0, 5)) {
        // 在半夜00:00 ~ 00:05
        this.logger.log('昨天的每日投币任务已经完成过了，等到今天的00:05再执行')
      } else {
        // 在其它时间
        this.logger.log('今天已经完成过每日投币任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离每日投币模块下次运行时间:', diff.str)
  }
}

export default CoinTask
