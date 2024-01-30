import BaseModule from '../BaseModule'
import { runAtMoment } from '../../types/module'
import BAPI from '../../library/bili-api'
import { dq } from '../../library/dom'
import { useBiliStore } from '../../stores/useBiliStore'
import _ from 'lodash'

class ShowContributionUserNum extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: runAtMoment = 'window-load'

  config = this.moduleStore.moduleConfig.EnhanceExperience.showContributionUserNum

  private async getContributionUserNum(
    anchor_uid: number,
    roomid: number,
    page: number = 1,
    page_size: number = 100
  ): Promise<number> {
    return BAPI.live.queryContributionRank(anchor_uid, roomid, page, page_size).then((response) => {
      this.logger.log(
        `BAPI.live.queryContributionRank(${anchor_uid}, ${roomid}, ${page}, ${page_size})`,
        response
      )
      if (response.code === 0) {
        return response.data.count
      } else {
        this.logger.error('获取高能用户数量失败', response.message)
        return -1
      }
    })
  }

  private async updateNumber(
    element: HTMLElement,
    anchor_uid: number,
    roomid: number
  ): Promise<void> {
    const num = await this.getContributionUserNum(anchor_uid, roomid, 1, 100)
    if (num !== -1) {
      element.innerText = `高能用户（${num}）`
      setTimeout(() => this.updateNumber(element, anchor_uid, roomid), _.random(50e3, 70e3))
    } else {
      element.innerText = '高能用户'
    }
  }

  public run(): void {
    this.logger.log('显示高能用户数量模块开始运行')
    if (this.config.enabled) {
      const biliStore = useBiliStore()
      const anchor_uid = biliStore.BilibiliLive!.ANCHOR_UID
      const roomid = biliStore.BilibiliLive!.ROOMID
      const element = dq('#rank-list-ctnr-box .tab-list')?.firstChild as HTMLElement
      if (element) {
        this.updateNumber(element, anchor_uid, roomid)
      } else {
        this.logger.error('未找到高能用户标签')
      }
    }
  }
}

export default ShowContributionUserNum
