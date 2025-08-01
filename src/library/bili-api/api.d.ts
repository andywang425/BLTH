import Request from '../request'
import { Live, LiveTrace, Main, Vc } from './response'

interface Requests {
  live: Request
  liveTrace: Request
  passport: Request
  main: Request
  vc: Request
  raw: Request
}

interface BapiMethods {
  live: {
    fansMedalPanel: (page: number, page_size?: number) => Promise<Live.FansMedalPanel>
    sendMsg: (
      msg: string,
      room_id: number,
      room_type?: number,
      mode?: number,
      jumpfrom?: number,
      fontsize?: number,
      color?: number,
      bubble?: number,
      reply_mid?: number,
      reply_attr?: number,
      replay_dmid?: any,
      reply_type?: number,
      reply_uname?: string,
      statistics?: string,
      web_location?: string,
    ) => Promise<Live.SendMsg>
    likeReport: (
      room_id: number,
      anchor_id: number,
      click_time?: number,
      web_location?: string,
    ) => Promise<Live.LikeReport>
    getInfoByRoom: (room_id: number, web_location?: string) => Promise<Live.GetInfoByRoom>
    silver2coin: (visit_id?: string) => Promise<Live.Silver2coin>
    coin2silver: (num: number, platform?: string, visit_id?: string) => Promise<Live.Coin2silver>
  }
  liveTrace: {
    E: (
      id: number[],
      device: string[],
      ruid: number,
      is_patch?: number,
      heart_beat?: any[],
      web_location?: string,
    ) => Promise<LiveTrace.E>
    X: (
      s: string,
      id: number[],
      device: string[],
      ruid: number,
      ets: number,
      benchmark: string,
      time: number,
      ts: number,
      trackid?: string,
      web_location?: string,
    ) => Promise<LiveTrace.X>
  }
  main: {
    nav: () => Promise<Main.Nav>
    reward: (web_location?: string) => Promise<Main.Reward>
    dynamicAll: (
      type?: string,
      page?: number,
      timezone_offset?: number,
      platform?: string,
      features?: string,
      web_location?: string,
      x_bili_device_req_json?: string,
      x_bili_web_req_json?: string,
    ) => Promise<Main.DynamicAll>
    videoHeartbeat: (
      aid: number,
      cid?: number,
      type?: number,
      sub_type?: number,
      dt?: number,
      play_type?: number,
      realtime?: number,
      played_time?: number,
      real_played_time?: number,
      refer_url?: string,
      quality?: number,
      video_duration?: number,
      last_play_progress_time?: number,
      max_play_progress_time?: number,
      outer?: number,
      statistics?: string,
      mobi_app?: string,
      device?: string,
      platform?: string,
      spmid?: string,
      from_spmid?: string,
      session?: string,
      extra?: string,
      web_location?: number,
    ) => Promise<Main.VideoHeartbeat>
    share: (
      aid: string,
      source?: string,
      eab_x?: number,
      ramval?: number,
      ga?: number,
      referer?: string,
    ) => Promise<Main.Share>
    coinAdd: (
      aid: string,
      num: number,
      select_like?: number,
      cross_domain?: boolean,
      from_spmid?: string,
      spmid?: string,
      statistics?: string,
      eab_x?: number,
      ramval?: number,
      source?: string,
      ga?: number,
    ) => Promise<Main.CoinAdd>
    videoRelation: (aid: string, bvid?: string) => Promise<Main.VideoRelation>
    vip: {
      myPrivilege: (web_location?: string) => Promise<Main.Vip.MyPrivilege>
      receivePrivilege: (type: number, platform?: string) => Promise<Main.Vip.ReceivePrivilege>
      addExperience: () => Promise<Main.Vip.AddExperience>
    }
  }
  vc: {
    myGroups: (build?: number, mobi_app?: string, web_location?: string) => Promise<Vc.MyGroups>
    signIn: (group_id: number, owner_id: number) => Promise<Vc.SignIn>
  }
}

export { Requests, BapiMethods }
