import { unsafeWindow } from '$'
import { useBiliStore } from '../../stores/useBiliStore'
import BAPI from '../../library/bili-api'
import { LiveData, MainData } from '../../library/bili-api/data'
import DefaultBaseModule from '../DefaultBaseModule'
import { getCookies } from '../../library/cookie'
import { IbiliCookies } from '../../types'
import { delayToNextMoment, isTimestampToday } from '../../library/luxon'
import { sleep } from '../../library/utils'
import { useModuleStore } from '../../stores/useModuleStore'

class BiliInfo extends DefaultBaseModule {
  public static sequence = 0

  private getBilibiliLive(): Window['BilibiliLive'] {
    this.logger.log('unsafeWindow.BilibiliLive', unsafeWindow.BilibiliLive)
    // 返回一个 BilibiliLive 的引用
    return unsafeWindow.BilibiliLive
  }

  /**
   * 获取 Cookies
   *
   * bili_jct: 常作为参数 csrf 在请求中出现
   * LIVE_BUVID 不能在此处获取，还没生成
   */
  private getCookies(): IbiliCookies {
    return getCookies(['bili_jct'])
  }

  /**
   * 通过 BAPI.main.nav 获取用户基本信息
   */
  private async getUserInfo(): Promise<MainData.Nav.Data> {
    try {
      const response = await BAPI.main.nav()
      this.logger.log('BAPI.main.nav response', response)
      if (response.code === 0) {
        return Promise.resolve(response.data)
      } else {
        this.logger.error('获取用户信息失败', response.message)
        return Promise.reject(response.message)
      }
    } catch (error) {
      this.logger.error('获取用户信息出错', error)
      return Promise.reject(error)
    }
  }

  /**
   * 获取礼物配置信息
   *
   * 如礼物id，名称，亲密度等等
   */
  private async getGiftConfig(): Promise<LiveData.RoomGiftConfig.Data> {
    try {
      // TODO: 添加条件判断
      throw new Error('送礼功能尚未完成，暂时不需要获取礼物配置信息，请忽略本报错 ＞︿＜')
      const response = await BAPI.live.roomGiftConfig()
      this.logger.log('BAPI.live.roomGiftConfig response', response)
      if (response.code === 0) {
        return Promise.resolve(response.data)
      } else {
        this.logger.error('获取礼物配置信息失败', response.message)
        return Promise.reject(response.message)
      }
    } catch (error) {
      this.logger.error('获取礼物配置信息出错', error)
      return Promise.reject(error)
    }
  }

  /**
   * 获取今日主站每日任务的完成情况
   */
  private async getDailyRewardInfo(): Promise<MainData.Reward.Data> {
    const MainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks
    // 开启了任意一项主站功能且该功能今天没完成过
    if (
      Object.values(MainSiteTasks).some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime))
    ) {
      try {
        const response = await BAPI.main.reward()
        this.logger.log('BAPI.main.reward response', response)
        if (response.code === 0) {
          return Promise.resolve(response.data)
        } else {
          this.logger.error('获取主站每日任务完成情况失败', response.message)
          return Promise.reject(response.message)
        }
      } catch (error) {
        this.logger.error('获取主站每日任务完成情况出错', error)
        return Promise.reject(error)
      }
    } else {
      return Promise.reject()
    }
  }

  /**
   * 从动态中获取一页视频的信息
   *
   * 每日观看视频，每日分享视频，每日投币都会用到
   */
  private async getDynamicVideo(): Promise<MainData.DynamicAll.Item[]> {
    const MainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks
    // 开启了观看视频、每日分享视频或每日投币功能且今天没完成过
    if (
      Object.entries(MainSiteTasks)
        .filter(([key]) => ['watch', 'share', 'coin'].includes(key))
        .some((keyValue) => keyValue[1].enabled && !isTimestampToday(keyValue[1]._lastCompleteTime))
    ) {
      try {
        const response = await BAPI.main.dynamicAll('video')
        this.logger.log('BAPI.main.dynamicAll response', response)
        if (response.code === 0) {
          return Promise.resolve(response.data.items)
        } else {
          this.logger.error('获取主站每日任务完成情况失败', response.message)
          return Promise.reject(response.message)
        }
      } catch (error) {
        this.logger.error('获取主站每日任务完成情况出错', error)
        return Promise.reject(error)
      }
    } else {
      return Promise.reject()
    }
  }

  /**
   * 获取粉丝勋章
   *
   * @param pages 获取的页数
   * @param force 是否无视配置强制获取，默认fasle
   */
  private async getFansMetals(pages = 10, force = false): Promise<LiveData.FansMedalPanel.List[]> {
    const medalTasks = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
    // 开启了任意一项粉丝勋章相关功能且该功能今天没完成过
    if (
      force ||
      Object.entries(medalTasks)
        .filter(([key]) => ['danmu', 'like', 'watch'].includes(key))
        .some(
          (keyValue) =>
            (keyValue[1] as any).enabled &&
            !isTimestampToday((keyValue[1] as any)._lastCompleteTime)
        )
    ) {
      const fansMetalList: LiveData.FansMedalPanel.List[] = []
      let total_page = 1
      try {
        const firstPageResponse = await BAPI.live.fansMedalPanel(1)
        this.logger.log('BAPI.live.fansMedalPanel(1) response', firstPageResponse)
        if (firstPageResponse.code === 0) {
          total_page = firstPageResponse.data.page_info.total_page
          // 第一页的 list 缺少当前佩戴和最卷获得BAPI.main.share的勋章，需通过 special_list 获取
          fansMetalList.push(...firstPageResponse.data.special_list, ...firstPageResponse.data.list)
        } else {
          this.logger.error('获取粉丝勋章列表第1页失败', firstPageResponse.message)
          return Promise.reject(firstPageResponse.message)
        }
        for (let page = 2; page <= Math.min(total_page, pages); page++) {
          const response = await BAPI.live.fansMedalPanel(page)
          this.logger.log(`BAPI.live.fansMedalPanel(${page}) response`, response)
          if (firstPageResponse.code === 0) {
            fansMetalList.push(...response.data.list)
          } else {
            this.logger.error(`获取粉丝勋章列表第${page}页失败`, firstPageResponse.message)
            return fansMetalList
          }
          // 防止风控，稍微加点延时
          await sleep(250)
        }
        return Promise.resolve(fansMetalList)
      } catch (error) {
        return Promise.reject(error)
      }
    } else {
      return Promise.reject()
    }
  }

  public async run(): Promise<void> {
    const biliStore = useBiliStore()
    // 直接返回目标值的方法
    biliStore.BilibiliLive = this.getBilibiliLive()
    biliStore.cookies = this.getCookies()
    // 返回 Promise 的方法
    // 如果 this.getUserInfo 发生错误，会被 loadModules 捕获，脚本终止运行
    biliStore.userInfo = await this.getUserInfo()
    setTimeout(async () => {
      biliStore.userInfo = await this.getUserInfo()
    }, delayToNextMoment(0, 4).ms)

    // 并发运行多个 Promise
    const allPromiseResult = await Promise.allSettled([
      this.getGiftConfig(),
      this.getDailyRewardInfo(),
      this.getDynamicVideo(),
      this.getFansMetals()
    ])
    this.logger.log('allPromiseResult', allPromiseResult)

    biliStore.giftConfig =
      allPromiseResult[0].status === 'fulfilled' ? allPromiseResult[0].value : null

    biliStore.dailyRewardInfo =
      allPromiseResult[1].status === 'fulfilled' ? allPromiseResult[1].value : null
    setTimeout(async () => {
      const biliStore = useBiliStore()
      // 先将主站每日任务状态重置成未完成，防止API数据更新不及时
      if (biliStore.dailyRewardInfo) {
        biliStore.dailyRewardInfo.login = false
        biliStore.dailyRewardInfo.share = false
        biliStore.dailyRewardInfo.watch = false
        biliStore.dailyRewardInfo.coins = 0
      }
      // 再次获取任务完成情况
      biliStore.dailyRewardInfo = await this.getDailyRewardInfo()
    }, delayToNextMoment(0, 4).ms)

    biliStore.dynamicVideos =
      allPromiseResult[2].status === 'fulfilled' ? allPromiseResult[2].value : null
    setTimeout(async () => {
      biliStore.dynamicVideos = await this.getDynamicVideo()
    }, delayToNextMoment(0, 4).ms)

    biliStore.fansMedals =
      allPromiseResult[3].status === 'fulfilled' ? allPromiseResult[3].value : null
    setTimeout(async () => {
      biliStore.fansMedals = await this.getFansMetals()
    }, delayToNextMoment(0, 4).ms)

    useModuleStore().emitter.on(this.moduleName, async (event) => {
      if ((event as any).target === 'getFansMetals') {
        biliStore.fansMedals = await this.getFansMetals(10, true)
      }
    })
  }
}

export default BiliInfo
