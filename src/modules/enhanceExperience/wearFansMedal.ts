import { fproxy, IrequestConfig, IrequestHandler } from '../../library/fetch-hook'
import BaseModule from '../BaseModule'
import { unsafeWindow } from '$'
import { getUrlFromFetchInput } from '../../library/utils'
import BAPI from '../../library/bili-api'
import { useBiliStore } from '../../stores/useBiliStore'

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
              console.log('发送弹幕', config)
              // TODO
              const biliStore = useBiliStore()
              const roomid = biliStore.BilibiliLive?.ROOMID
              if (roomid) {
                const medal_id = biliStore.fansMedals?.find((m) => m.room_info.room_id === roomid)
                  ?.medal.medal_id
                if (medal_id) {
                  await BAPI.live.wearMedal(medal_id).then((response) => {
                    this.logger.log(`BAPI.live.wearMedal(${medal_id}) response`, response)
                    if (response.code === 0) {
                      this.logger.log('自动佩戴粉丝勋章成功')
                    } else {
                      this.logger.error('自动佩戴粉丝勋章失败', response.message)
                    }
                  })
                }
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
