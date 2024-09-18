import Request from '../request'
import type { Requests, BapiMethods } from './api'
import { useBiliStore } from '@/stores/useBiliStore'
import { packFormData, uuid, wbiSign } from '../utils'
import { ts, tsm } from '../luxon'

const request: Requests = {
  live: new Request('https://api.live.bilibili.com', 'https://live.bilibili.com'),
  liveTrace: new Request('https://live-trace.bilibili.com', 'https://live.bilibili.com'),
  passport: new Request('https://passport.bilibili.com', 'https://passport.bilibili.com/'),
  main: new Request('https://api.bilibili.com', 'https://www.bilibili.com'),
  vc: new Request('https://api.vc.bilibili.com', 'https://message.bilibili.com/'),
  raw: new Request()
}

const BAPI: BapiMethods = {
  live: {
    roomGiftConfig: (room_id = 0, area_parent_id = 0, area_id = 0, platform = 'pc') => {
      return request.live.get('/xlive/web-room/v1/giftPanel/roomGiftConfig', {
        platform,
        room_id,
        area_parent_id,
        area_id
      })
    },
    doSign: () => {
      return request.live.get('/xlive/web-ucenter/v1/sign/DoSign')
    },
    /**
     * 网页直播签到功能已不存在，但该API仍可以使用（并且也存在于B站js代码中）
     */
    getSignInfo: () => {
      return request.live.get('/xlive/web-ucenter/v1/sign/WebGetSignInfo')
    },
    fansMedalPanel: (page, page_size = 10) => {
      // 返回的 room_id 是长号
      return request.live.get('/xlive/app-ucenter/v1/fansMedal/panel', {
        page,
        page_size
      })
    },
    sendMsg: (
      msg,
      roomid,
      room_type = 0,
      mode = 1,
      jumpfrom = 0,
      fontsize = 25,
      color = 16777215,
      bubble = 0,
      reply_mid = 0,
      reply_attr = 0,
      replay_dmid = '',
      statistics = '{"appId":100,"platform":5}'
    ) => {
      const biliStore = useBiliStore()
      const bili_jct = biliStore.cookies!.bili_jct
      return request.live.post(
        '/msg/send',
        packFormData({
          bubble,
          msg,
          color,
          mode,
          room_type,
          jumpfrom,
          reply_mid,
          reply_attr,
          replay_dmid,
          statistics,
          fontsize,
          rnd: ts(),
          roomid,
          csrf: bili_jct,
          csrf_token: bili_jct
        })
      )
    },
    likeReport: (room_id, anchor_id, click_time = 1, visit_id = '') => {
      const biliStore = useBiliStore()
      const bili_jct = biliStore.cookies!.bili_jct
      const uid = biliStore.BilibiliLive!.UID
      return request.live.post('/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3', {
        click_time,
        room_id,
        uid,
        anchor_id,
        csrf_token: bili_jct,
        csrf: bili_jct,
        visit_id
      })
    },
    /**
     * 该API只在带有多层iframe（背景很好看）的直播间中被使用，但参数填任意直播间均可
     */
    getInfoByRoom: (room_id, web_location = '444.8') => {
      return request.live.get(
        '/xlive/web-room/v1/index/getInfoByRoom',
        wbiSign({
          room_id,
          web_location
        })
      )
    },
    getUserTaskProgress: (target_id = 11153765) => {
      // 该 API 是 APP API，但也可以使用 web 的身份校验方式
      const biliStore = useBiliStore()
      const bili_jct = biliStore.cookies!.bili_jct
      return request.live.get('/xlive/app-ucenter/v1/userTask/GetUserTaskProgress', {
        target_id,
        csrf: bili_jct,
        ts: ts()
      })
    },
    userTaskReceiveRewards: (target_id = 11153765) => {
      // 该 API 是 APP API，但也可以使用 web 的身份校验方式，将 actionKey 设置为 csrf 即可
      // 而且似乎不需要观看直播5分钟，只要发5条弹幕就行了
      const biliStore = useBiliStore()
      const bili_jct = biliStore.cookies!.bili_jct
      return request.live.post('/xlive/app-ucenter/v1/userTask/UserTaskReceiveRewards', {
        actionKey: 'csrf',
        target_id,
        csrf: bili_jct,
        ts: ts()
      })
    },
    silver2coin: (visit_id = '') => {
      const bili_jct = useBiliStore().cookies!.bili_jct
      return request.live.post('/xlive/revenue/v1/wallet/silver2coin', {
        csrf: bili_jct,
        csrf_token: bili_jct,
        visit_id
      })
    },
    coin2silver: (num, platform = 'pc', visit_id = '') => {
      const bili_jct = useBiliStore().cookies!.bili_jct
      return request.live.post('/xlive/revenue/v1/wallet/coin2silver', {
        num,
        csrf: bili_jct,
        csrf_token: bili_jct,
        platform,
        visit_id
      })
    },
    wearMedal: (medal_id, visit_id = '') => {
      const bili_jct = useBiliStore().cookies!.bili_jct
      return request.live.post('/xlive/web-room/v1/fansMedal/wear', {
        medal_id,
        csrf_token: bili_jct,
        csrf: bili_jct,
        visit_id: visit_id
      })
    }
  },
  liveTrace: {
    E: (id, device, ruid, is_patch = 0, heart_beat = [], visit_id = '') => {
      const bili_jct = useBiliStore().cookies!.bili_jct
      return request.liveTrace.post('/xlive/data-interface/v1/x25Kn/E', {
        id: JSON.stringify(id),
        device: JSON.stringify(device),
        ruid, // 主播 uid
        ts: tsm(),
        is_patch,
        heart_beat: JSON.stringify(heart_beat),
        ua: navigator.userAgent,
        csrf_token: bili_jct,
        csrf: bili_jct,
        visit_id
      })
    },
    X: (s, id, device, ruid, ets, benchmark, time, ts, visit_id = '') => {
      const bili_jct = useBiliStore().cookies!.bili_jct
      return request.liveTrace.post('/xlive/data-interface/v1/x25Kn/X', {
        s,
        id: JSON.stringify(id),
        device: JSON.stringify(device),
        ruid, // 主播 uid
        ets: ets,
        benchmark,
        time,
        ts,
        ua: navigator.userAgent,
        csrf_token: bili_jct,
        csrf: bili_jct,
        visit_id
      })
    }
  },
  main: {
    nav: () => {
      return request.main.get('/x/web-interface/nav')
    },
    reward: () => {
      return request.main.get('/x/member/web/exp/reward')
    },
    dynamicAll: (
      type = 'video',
      page = 1,
      timezone_offset = -480,
      platform = 'web',
      features = 'itemOpusStyle,listOnlyfans,opusBigCover,onlyfansVote,decorationCard,onlyfansAssetsV2,forwardListHidden,ugcDelete',
      web_location = '333.1365',
      x_bili_device_req_json = '{"platform":"web","device":"pc"}',
      x_bili_web_req_json = '{"spm_id":"333.1365"}'
    ) => {
      return request.main.get(
        '/x/polymer/web-dynamic/v1/feed/all',
        {
          timezone_offset,
          type,
          platform,
          page,
          features,
          web_location,
          x_bili_device_req_json,
          x_bili_web_req_json
        },
        {
          Origin: 'https://t.bilibili.com',
          Referer: 'https://t.bilibili.com/'
        }
      )
    },
    videoHeartbeat: (
      aid,
      cid = 1000000000,
      type = 3,
      sub_type = 0,
      dt = 2,
      play_type = 1,
      realtime = 61,
      played_time = 62,
      real_played_time = 62,
      refer_url = 'https://t.bilibili.com/?tab=video',
      quality = 64,
      video_duration = 180,
      last_play_progress_time = 62,
      max_play_progress_time = 62,
      outer = 0,
      spmid = '333.788.0.0',
      from_spmid = '333.1365.list.card_archive.click',
      session = uuid().replaceAll('-', ''),
      extra = '{"player_version":"4.8.43"}',
      web_location = 1315873
    ) => {
      const biliStore = useBiliStore()
      const start_ts = ts()
      const mid = useBiliStore().userInfo!.mid

      return request.main.post(
        '/x/click-interface/web/heartbeat',
        {
          start_ts,
          mid,
          aid,
          cid,
          type,
          sub_type,
          dt,
          play_type,
          realtime,
          played_time,
          real_played_time,
          refer_url,
          quality,
          video_duration,
          last_play_progress_time,
          max_play_progress_time,
          outer,
          spmid,
          from_spmid,
          session,
          extra,
          csrf: biliStore.cookies!.bili_jct
        },
        {
          params: wbiSign({
            w_start_ts: start_ts,
            w_mid: mid,
            w_aid: aid,
            w_dt: dt,
            w_realtime: realtime,
            w_played_time: played_time,
            w_real_played_time: real_played_time,
            w_video_duration: video_duration,
            w_last_play_progress_time: last_play_progress_time,
            web_location
          })
        }
      )
    },
    share: (aid, source = 'pc_client_normal', eab_x = 2, ramval = 0, ga = 1, referer = '') => {
      // source 不能用 web 端的值，改成 pc 客户端的才能完成任务
      const bili_jct = useBiliStore().cookies!.bili_jct
      return request.main.post('/x/web-interface/share/add', {
        eab_x,
        ramval,
        referer,
        source,
        aid,
        ga,
        csrf: bili_jct
      })
    },
    coinAdd: (
      aid,
      num,
      select_like = 0,
      cross_domain = true,
      eab_x = 2,
      ramval = 6,
      source = 'web_normal',
      ga = 1
    ) => {
      const bili_jct = useBiliStore().cookies!.bili_jct
      return request.main.post('/x/web-interface/coin/add ', {
        aid,
        multiply: num,
        select_like: select_like,
        cross_domain: cross_domain,
        eab_x,
        ramval,
        source,
        ga,
        csrf: bili_jct
      })
    },
    videoRelation: (aid, bvid = '') => {
      return request.main.get('/x/web-interface/archive/relation', {
        aid,
        bvid
      })
    },
    vip: {
      myPrivilege: (web_location = '333.33') => {
        return request.main.get(
          '/x/vip/privilege/my',
          {
            web_location
          },
          {
            headers: {
              Referer: 'https://account.bilibili.com/account/big/myPackage',
              Origin: 'https://account.bilibili.com'
            }
          }
        )
      },
      receivePrivilege: (type, platform = 'web') => {
        const bili_jct = useBiliStore().cookies!.bili_jct
        return request.main.post(
          '/x/vip/privilege/receive',
          {
            type,
            platform,
            csrf: bili_jct
          },
          {
            headers: {
              Referer: 'https://account.bilibili.com/account/big/myPackage',
              Origin: 'https://account.bilibili.com'
            }
          }
        )
      },
      addExperience: () => {
        const biliStore = useBiliStore()
        const mid = biliStore.BilibiliLive!.UID
        const buvid = biliStore.cookies!.buvid3
        const bili_jct = biliStore.cookies!.bili_jct
        return request.main.post(
          '/x/vip/experience/add',
          {
            mid,
            buvid,
            csrf: bili_jct
          },
          {
            headers: {
              Referer: 'https://account.bilibili.com/big',
              Origin: 'https://account.bilibili.com'
            }
          }
        )
      }
    }
  },
  vc: {
    myGroups: (build = 0, mobi_app = 'web') => {
      return request.vc.get('/link_group/v1/member/my_groups', {
        build,
        mobi_app
      })
    },
    signIn: (group_id, owner_id) => {
      // 此处 v1 也能改成 v2，v3，v4 ...返回的数据略微不同
      return request.vc.get('/link_setting/v1/link_setting/sign_in', {
        group_id,
        owner_id
      })
    }
  }
}

export default BAPI
