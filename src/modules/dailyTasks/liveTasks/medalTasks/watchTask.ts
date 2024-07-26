import BaseModule from '../../../BaseModule'
import { isTimestampToday, delayToNextMoment, tsm, isNowIn } from '../../../../library/luxon'
import BAPI from '../../../../library/bili-api'
import { useBiliStore } from '../../../../stores/useBiliStore'
import Logger from '../../../../library/logger'
import CryptoJS from 'crypto-js'
import { uuid, sleep } from '../../../../library/utils'
import { useModuleStore } from '../../../../stores/useModuleStore'
import type { ModuleConfig } from '../../../../types'
import type { ModuleStatusTypes, RunAtMoment } from '../../../../types/module'
import { getCookie } from '../../../../library/cookie'

interface SypderData {
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
    isLast: boolean = false
  ) {
    this.roomID = roomID
    this.areaID = areaID
    this.parentID = parentID
    this.ruid = ruid
    this.watchedSeconds = watchedSeconds
    this.isLast = isLast

    this.config = useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks.watch
  }

  private logger = new Logger('RoomHeart')

  private config: ModuleConfig['DailyTasks']['LiveTasks']['medalTasks']['watch']
  set status(s: ModuleStatusTypes) {
    useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = s
  }
  /** 是不是最后一个心跳任务 */
  private isLast: boolean
  /** 已观看时间（秒） */
  private watchedSeconds: number

  private timer!: number
  private stop: boolean = false

  private areaID: number
  private parentID: number
  private roomID: number
  /** 主播的 UID */
  private ruid: number
  private seq = 0

  /** 计算签名和发送请求时均需要 JSON.stringify */
  private get id(): number[] {
    return [this.parentID, this.areaID, this.seq, this.roomID]
  }

  /** Cookie LIVE_BUVID */
  private buvid: string | null = useBiliStore().cookies?.LIVE_BUVID ?? getCookie('LIVE_BUVID')

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
  public start() {
    if (!this.buvid) {
      this.logger.error(`缺少buvid，无法为直播间 ${this.roomID} 执行观看直播任务，请尝试刷新页面`)
      return
    }
    // 如果到了0点还没完成任务，就不继续了
    this.timer = setTimeout(() => (this.stop = true), delayToNextMoment(0, 0).ms)
    return this.E()
  }

  /**
   * E心跳，开始时发送一次
   */
  private async E() {
    if (this.stop) {
      this.status = ''
      return
    }
    try {
      const response = await BAPI.liveTrace.E(this.id, this.device, this.ruid)
      this.logger.log(
        `BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) response`,
        response
      )
      if (response.code === 0) {
        this.seq += 1
        ;({
          heartbeat_interval: this.heartBeatInterval,
          secret_key: this.secretKey,
          secret_rule: this.secretRule,
          timestamp: this.timestamp
        } = response.data)
        setTimeout(() => this.X(), this.heartBeatInterval * 1000)
      } else {
        this.logger.error(
          `BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) 失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(`BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) 出错`, error)
    }
  }

  /**
   * X心跳，E心跳过后都是X心跳
   */
  private async X() {
    if (this.stop) {
      this.status = ''
      return
    }
    try {
      const sypderData: SypderData = {
        id: JSON.stringify(this.id),
        device: JSON.stringify(this.device),
        ets: this.timestamp,
        benchmark: this.secretKey,
        time: this.heartBeatInterval,
        ts: tsm(),
        ua: this.ua
      }
      // 签名
      const s = this.sypder(JSON.stringify(sypderData), this.secretRule)

      const response = await BAPI.liveTrace.X(
        s,
        this.id,
        this.device,
        this.ruid,
        this.timestamp,
        this.secretKey,
        this.heartBeatInterval,
        sypderData.ts
      )
      this.logger.log(
        `BAPI.liveTrace.X(${s}, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}, ${sypderData.ts}) response`,
        response
      )
      if (response.code === 0) {
        this.seq += 1
        this.watchedSeconds += this.heartBeatInterval
        if (this.isLast) {
          // 记录观看时间（秒）
          this.config._watchedSecondsToday = this.watchedSeconds
        }
        if (this.watchedSeconds >= this.config.time * 60) {
          // 达到设置的观看时间，结束
          if (this.isLast) {
            this.config._lastCompleteTime = tsm()
            this.logger.log('观看直播任务已完成')
            this.status = 'done'
          }
          clearTimeout(this.timer)
          return
        }
        ;({
          heartbeat_interval: this.heartBeatInterval,
          secret_key: this.secretKey,
          secret_rule: this.secretRule,
          timestamp: this.timestamp
        } = response.data)
        setTimeout(() => this.X(), this.heartBeatInterval * 1000)
      } else {
        this.logger.error(
          `BAPI.liveTrace.X(${s}, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}) 失败`,
          response.message
        )
      }
    } catch (error) {
      this.logger.error(
        `BAPI.liveTrace.X(s, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}) 出错`,
        error
      )
    }
  }

  /**
   * wasm 导出的 spyider 函数的 javascript 实现
   * @param str 一个经过 JSON.stringify 的 json 字符串
   * @param rule secret_rule 数组
   * @returns s
   */
  private sypder(str: string, rule: number[]): string {
    const data: SypderData = JSON.parse(str)
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
      ts: data.ts
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

class WatchTask extends BaseModule {
  static runAt: RunAtMoment = 'window-load'

  medalTasksConfig = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks
  config = this.medalTasksConfig.watch

  set status(s: ModuleStatusTypes) {
    this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = s
  }

  /**
   * 获取粉丝勋章的房间号和主播uid，过滤等级大于等于20或不符合黑白名单要求的粉丝勋章
   * @returns 数组，数组中的每个元素都是数组：[房间号，主播uid]
   */
  private getRoomidUidList(): [number, number][] | null {
    const biliStore = useBiliStore()
    if (biliStore.filteredFansMedals) {
      return (
        biliStore.filteredFansMedals
          .filter(
            (medal) =>
              medal.medal.level < 20 &&
              (this.medalTasksConfig.isWhiteList
                ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id)
                : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id))
          )
          .map((medal) => [medal.room_info.room_id, medal.medal.target_id]) as [number, number][]
      ).slice(0, 199)
    } else {
      return null
    }
  }

  /**
   * 获取指定直播间的 area_id 和 parent_area_id
   *
   * 出错时返回 [-1, -1]
   *
   * @param roomid 房间号
   * @returns [area_id, parent_area_id]
   */
  private async getAreaInfo(roomid: number): Promise<[number, number]> {
    try {
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
        error
      )
      return [-1, -1]
    }
  }

  public async run(): Promise<void> {
    this.logger.log('观看直播模块开始运行')
    if (this.config.enabled) {
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        this.status = 'running'
        if (!isTimestampToday(this.config._lastWatchTime, 0, 0)) {
          // 如果上次观看（不是完成任务）的时间戳不在今天，将今天已观看的秒数置为0
          this.config._watchedSecondsToday = 0
        } else {
          // 因为连续看 5 分钟（300秒）才能加亲密度，所以上一次观看时最后不足 5 分钟的时间是无效的
          this.config._watchedSecondsToday -= this.config._watchedSecondsToday % 300
        }
        this.config._lastWatchTime = tsm()
        const idList: number[][] | null = this.getRoomidUidList()
        if (idList) {
          if (idList.length === 0) {
            this.status = 'done'
            this.config._lastCompleteTime = tsm()
          } else {
            for (let i = 0; i < idList.length; i++) {
              const [roomid, uid] = idList[i]
              const [area_id, parent_area_id] = await this.getAreaInfo(roomid)
              if (area_id > 0 && parent_area_id > 0) {
                // area_id 和 parent_area_id 都大于 0，说明直播间设置了分区。开始心跳
                new RoomHeart(
                  roomid,
                  area_id,
                  parent_area_id,
                  uid,
                  this.config._watchedSecondsToday,
                  i === idList.length - 1 ? true : false
                ).start()
              }
              // 延时防风控
              await sleep(3000)
            }
          }
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log('昨天的观看直播任务已经完成过了，等到今天的00:05再执行')
        } else {
          this.logger.log('今天已经完成过观看直播任务了')
          this.status = 'done'
        }
      }
    }

    const diff = delayToNextMoment()
    setTimeout(() => this.run(), diff.ms)
    this.logger.log('距离观看直播模块下次运行时间:', diff.str)
  }
}

export default WatchTask
