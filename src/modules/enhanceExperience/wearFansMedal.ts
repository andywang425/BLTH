import { fproxy, IrequestConfig, IrequestHandler } from '../../library/fetch-hook'
import BaseModule from '../BaseModule'
import { unsafeWindow } from '$'
import { getUrlFromFetchInput, sleep } from '../../library/utils'
import BAPI from '../../library/bili-api'
import { useBiliStore } from '../../stores/useBiliStore'
import { dq } from '../../library/dom'

class WearFansMedal extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAfterDefault: boolean = false

  config = this.moduleStore.moduleConfig.EnhanceExperience.wearFansMedal

  public run(): void {
    this.logger.log('发弹幕自动佩戴粉丝勋章模块开始运行')
    if (this.config.enabled) {
      fproxy(
        {
          onRequest: async (config: IrequestConfig, handler: IrequestHandler) => {
            if (getUrlFromFetchInput(config.input).includes('//api.live.bilibili.com/msg/send')) {
              const biliStore = useBiliStore()
              const roomid = biliStore.BilibiliLive?.ROOMID
              if (roomid) {
                const medal_id = biliStore.fansMedals?.find((m) => m.room_info.room_id === roomid)
                  ?.medal.medal_id
                if (medal_id) {
                  await BAPI.live.wearMedal(medal_id).then(async (response) => {
                    this.logger.log(`BAPI.live.wearMedal(${medal_id}) response`, response)
                    if (response.code === 0) {
                      this.logger.log('自动佩戴粉丝勋章成功')
                      const medal_span = dq("#control-panel-ctnr-box .medal-section")?.firstElementChild as HTMLElement;
                      if (medal_span) {
                        // 点击弹幕输入框左侧的粉丝勋章图标，让显示的粉丝勋章发生变化
                        medal_span.click();
                        // 延迟一个很短的时间让页面发生更新
                        await sleep(1);
                        // 再次点击关闭打开的弹窗
                        medal_span.click()
                      }
                    } else {
                      this.logger.error('自动佩戴粉丝勋章失败', response.message)
                    }
                  })
                }
                handler.next(config)
              }
            } else {
              handler.next(config)
            }
          }
        },
        unsafeWindow
      )
    }
  }
}

export default WearFansMedal
