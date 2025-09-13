import { delayToNextMoment, isNowIn, isTimestampToday, tsm } from '@/library/luxon'
import BAPI from '@/library/bili-api'
import { useBiliStore } from '@/stores/useBiliStore'
import Logger from '@/library/logger'
import CryptoJS from 'crypto-js'
import { sleep, uuid } from '@/library/utils'
import { useModuleStore } from '@/stores/useModuleStore'
import type { ModuleConfig, ModuleStatusTypes, RunAtMoment } from '@/types'
import _ from 'lodash'
import MedalModule from '@/modules/dailyTasks/liveTasks/medalTasks/MedalModule'
import type { LiveData } from '@/library/bili-api/data'
import { usePlayerStore } from '@/stores/usePlayerStore'

interface SpyderData {
  benchmark: string
  device: string
  ets: number
  id: string
  time: number
  ts: number
  ua: string
}

class RoomHeart {
  constructor(
    roomID: number,
    areaID: number,
    parentID: number,
    ruid: number,
    watchedSeconds: number,
  ) {
    this.roomID = roomID
    this.areaID = areaID
    this.parentID = parentID
    this.ruid = ruid
    this.watchedSeconds = watchedSeconds

    this.config = useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks.watch
  }

  private logger = new Logger('RoomHeart')

  private config: ModuleConfig['DailyTasks']['LiveTasks']['medalTasks']['watch']

  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = s
  }

  /** 今日当前直播间已观看时间（秒） */
  private watchedSeconds: number

  private readonly areaID: number
  private readonly parentID: number
  private readonly roomID: number
  /** 主播的 UID */
  private readonly ruid: number
  private seq = 0

  /** 计算签名和发送请求时均需要 JSON.stringify */
  private get id(): number[] {
    return [this.parentID, this.areaID, this.seq, this.roomID]
  }

  /** 更新当前直播间的观看任务进度 */
  private updateProgress() {
    // 记录观看时间
    this.watchedSeconds += this.heartBeatInterval

    useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks.watch._watchingProgress[
      this.roomID
    ] = this.watchedSeconds
  }

  /** Cookie LIVE_BUVID */
  private buvid?: string = useBiliStore().cookies!.LIVE_BUVID

  private uuid = uuid()

  /** 计算签名和发送请求时均需要 JSON.stringify */
  private device: string[] = [this.buvid as string, this.uuid]
  /** 浏览器 user agent */
  private ua = navigator.userAgent

  private heartBeatInterval!: number
  private secretKey!: string
  private secretRule!: number[]
  /** ets */
  private timestamp!: number

  /**
   * 开始心跳
   */
  public start(): Promise<void> {
    if (!this.buvid) {
      this.logger.error(`缺少buvid，无法为直播间 ${this.roomID} 执行观看直播任务，请尝试刷新页面`)
      return Promise.resolve()
    }
    return this.E()
  }

  /**
   * E心跳，开始时发送一次
   */
  private async E(): Promise<void> {
    try {
      const response = await BAPI.liveTrace.E(this.id, this.device, this.ruid)
      this.logger.log(
        `BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) response`,
        response,
      )
      if (response.code === 0) {
        this.seq += 1
        ;({
          heartbeat_interval: this.heartBeatInterval,
          secret_key: this.secretKey,
          secret_rule: this.secretRule,
          timestamp: this.timestamp,
        } = response.data)
        await sleep(this.heartBeatInterval * 1000)
        return this.X()
      } else {
        this.logger.error(
          `BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) 失败`,
          response.message,
        )
      }
    } catch (error) {
      this.logger.error(`BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) 出错`, error)
    }
  }

  /**
   * X心跳，E心跳过后都是X心跳
   */
  private async X(): Promise<void> {
    if (isNowIn(23, 59, 0, 5)) {
      this.logger.log(`即将或刚刚发生跨天，停止直播间 ${this.roomID} 的X心跳`)
      return
    }

    try {
      const spyderData: SpyderData = {
        id: JSON.stringify(this.id),
        device: JSON.stringify(this.device),
        ets: this.timestamp,
        benchmark: this.secretKey,
        time: this.heartBeatInterval,
        ts: tsm(),
        ua: this.ua,
      }
      // 签名
      const s = this.spyder(JSON.stringify(spyderData), this.secretRule)

      const response = await BAPI.liveTrace.X(
        s,
        this.id,
        this.device,
        this.ruid,
        this.timestamp,
        this.secretKey,
        this.heartBeatInterval,
        spyderData.ts,
      )
      this.logger.log(
        `BAPI.liveTrace.X(${s}, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}, ${spyderData.ts}) response`,
        response,
      )
      if (response.code === 0) {
        this.seq += 1
        this.updateProgress()
        if (this.watchedSeconds >= this.config.time * 60) {
          // 达到设置的观看时间，结束
          return
        }
        ;({
          heartbeat_interval: this.heartBeatInterval,
          secret_key: this.secretKey,
          secret_rule: this.secretRule,
          timestamp: this.timestamp,
        } = response.data)
        await sleep(this.heartBeatInterval * 1000)
        return this.X()
      } else {
        this.logger.error(
          `BAPI.liveTrace.X(${s}, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}) 失败`,
          response.message,
        )
      }
    } catch (error) {
      this.logger.error(
        `BAPI.liveTrace.X(s, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}) 出错`,
        error,
      )
    }
  }

  /**
   * wasm 导出的 spyder 函数的 javascript 实现
   * @param str 一个经过 JSON.stringify 的 json 字符串
   * @param rule secret_rule 数组
   * @returns s
   */
  private spyder(str: string, rule: number[]): string {
    const data: SpyderData = JSON.parse(str)
    const [parent_id, area_id, seq_id, room_id]: number[] = JSON.parse(data.id)
    const [buvid, uuid]: string[] = JSON.parse(data.device)
    const key: string = data.benchmark
    const newData = {
      platform: 'web',
      parent_id,
      area_id,
      seq_id,
      room_id,
      buvid,
      uuid,
      ets: data.ets,
      time: data.time,
      ts: data.ts,
    }
    let s = JSON.stringify(newData)
    for (const r of rule) {
      switch (r) {
        case 0:
          s = CryptoJS.HmacMD5(s, key).toString(CryptoJS.enc.Hex)
          break
        case 1:
          s = CryptoJS.HmacSHA1(s, key).toString(CryptoJS.enc.Hex)
          break
        case 2:
          s = CryptoJS.HmacSHA256(s, key).toString(CryptoJS.enc.Hex)
          break
        case 3:
          s = CryptoJS.HmacSHA224(s, key).toString(CryptoJS.enc.Hex)
          break
        case 4:
          s = CryptoJS.HmacSHA512(s, key).toString(CryptoJS.enc.Hex)
          break
        case 5:
          s = CryptoJS.HmacSHA384(s, key).toString(CryptoJS.enc.Hex)
          break
        default:
          s = CryptoJS.HmacMD5(s, key).toString(CryptoJS.enc.Hex)
      }
    }
    return s
  }
}

class WatchTask extends MedalModule {
  static runAt: RunAtMoment = 'window-load'

  config = this.medalTasksConfig.watch

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = s
  }

  private playerStore = usePlayerStore()

  /**
   * 获取粉丝勋章
   * @returns 根据直播状态划分、经过排序和过滤的粉丝勋章
   */
  private getMedals(): LiveData.FansMedalPanel.List[] {
    const fansMedals = useBiliStore().filteredFansMedals

    const result = fansMedals.filter(
      (medal) =>
        this.PUBLIC_MEDAL_FILTERS.whiteBlackList(medal) &&
        this.PUBLIC_MEDAL_FILTERS.levelLt120(medal),
    )

    if (this.medalTasksConfig.isWhiteList) {
      this.sortMedals(result)
    }

    return result
  }

  /**
   * 获取指定直播间的 area_id 和 parent_area_id
   *
   * 出错时返回 [-1, -1]
   *
   * @param roomid 房间号
   * @returns [area_id, parent_area_id]
   */
  private async getAreaInfo(url: string, roomid: number): Promise<[number, number]> {
    try {
      // 先尝试从 url 中提取 area_id 和 parent_area_id
      const urlObj = new URL(url)
      const area_id = Number(urlObj.searchParams.get('area_id'))
      const parent_area_id = Number(urlObj.searchParams.get('parent_area_id'))

      if (area_id > 0 && parent_area_id > 0) {
        this.logger.log(
          `已从直播间链接中（roomid = ${roomid}）获取到分区数据（area_id = ${area_id}，parent_area_id = ${parent_area_id}）`,
          urlObj,
        )
        return [area_id, parent_area_id]
      }

      // 如果无法从 url 中提取到分区数据，调用 API 获取
      const response = await BAPI.live.getInfoByRoom(roomid)
      this.logger.log(`BAPI.live.getInfoByRoom(${roomid}) response`, response)

      if (response.code === 0) {
        const room_info = response.data.room_info
        return [room_info.area_id, room_info.parent_area_id]
      } else {
        return [-1, -1]
      }
    } catch (error) {
      this.logger.error(
        `获取指定直播间的 area_id 和 parent_area_id(roomid = ${roomid}) 出错`,
        error,
      )
      return [-1, -1]
    }
  }

  public async run(): Promise<void> {
    this.logger.log('观看直播模块开始运行')

    await this.playerStore.waitForLiveStatus(0, {
      onNeedWait: () => {
        this.logger.log('当前直播间正在直播，直播结束后再执行观看直播任务')
      },
    })

    if (!isTimestampToday(this.config._lastCompleteTime)) {
      if (!(await this.waitForFansMedals())) {
        this.logger.error('粉丝勋章数据不存在，不执行观看直播任务')
        this.status = 'error'
        return
      }

      this.status = 'running'

      if (!isTimestampToday(this.config._lastWatchTime, 0, 0)) {
        // 如果上次观看（不是完成任务）的时间戳不在今天，将今天已观看的秒数置为0
        this.config._watchingProgress = {}
      } else {
        // 因为连续看 5 分钟（300秒）才能加亲密度，所以上一次观看时最后不足 5 分钟的时间是无效的
        _.forOwn(this.config._watchingProgress, (value, key, object) => {
          object[key] -= value % 300
        })
      }

      this.config._lastWatchTime = tsm()
      const fansMedals = this.getMedals()

      if (fansMedals.length > 0) {
        let i: number

        for (i = 0; i < fansMedals.length; i++) {
          if (isNowIn(23, 55, 0, 5)) {
            this.logger.log('即将或刚刚发生跨天，提早结束本轮观看直播任务')
            break
          }

          const medal = fansMedals[i]
          const roomid = medal.room_info.room_id
          const uid = medal.medal.target_id
          const [area_id, parent_area_id] = await this.getAreaInfo(medal.room_info.url, roomid)

          if (area_id > 0 && parent_area_id > 0) {
            // area_id 和 parent_area_id 都大于 0，说明直播间设置了分区，心跳有效
            if (
              !this.config._watchingProgress[roomid] ||
              this.config._watchingProgress[roomid] < this.config.time * 60
            ) {
              // 今日观看时间未达到设置值，开始心跳
              this.logger.log(
                `粉丝勋章【${medal.medal.medal_name}】 开始直播间 ${roomid}（主播【${medal.anchor_info.nick_name}】，UID：${uid}）的观看直播任务`,
              )

              await new RoomHeart(
                roomid,
                area_id,
                parent_area_id,
                uid,
                this.config._watchingProgress[roomid] ?? 0,
              ).start()
            }
          }
        }

        if (i === fansMedals.length) {
          // 没有提早跳出循环，说明所有直播间的观看任务均已完成
          this.config._lastCompleteTime = tsm()
          this.logger.log('观看直播任务已完成')
          this.status = 'done'
        }
      } else {
        this.status = 'done'
        this.config._lastCompleteTime = tsm()
      }
    } else {
      if (isNowIn(0, 0, 0, 5)) {
        this.logger.log('昨天的观看直播任务已经完成过了，等到今天的00:05再执行')
      } else {
        this.logger.log('今天已经完成过观看直播任务了')
        this.status = 'done'
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离观看直播模块下次运行时间:', diff.str)
  }
}

export default WatchTask
