import BaseModule from '../BaseModule'
import { runAtMoment } from '../../types/module'
import BAPI from '../../library/bili-api'
import { Live } from '../../library/bili-api/response'
import { dq } from '../../library/dom'
import { unsafeWindow } from '$'

class ContributionRank extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: runAtMoment = 'window-load'

  config = this.moduleStore.moduleConfig.EnhanceExperience.contributionRank

  private async getContributionRank(): Promise<Live.QueryContributionRank | null> {
    const biliInfo = unsafeWindow.BilibiliLive
    const response = await BAPI.live.queryContributionRank(
      biliInfo?.ANCHOR_UID ?? 0,
      biliInfo?.ROOMID ?? 0
    )
    return response
  }

  public run(): void {
    this.logger.log('显示高能用户数量模块开始运行')
    if (this.config.enabled) {
      setInterval(async () => {
        const contributionRankData = await this.getContributionRank()
        const rankTabElement = dq('.tab-list.dp-flex')
        if (rankTabElement && contributionRankData?.code === 0) {
          rankTabElement.children[0].innerHTML = `高能用户(${contributionRankData.data.count})`
        } else if (contributionRankData?.code !== 0) {
          this.logger.error('获取高能用户数量失败', contributionRankData)
        } else {
          this.logger.error('未找到高能用户数量标签')
        }
      }, 5000)
    }
  }
}

export default ContributionRank
