import { LiveData, LiveTraceData, MainData, VcData } from './data'

declare namespace Live {
  interface FansMedalPanel {
    code: number
    message: string
    ttl: number
    data: LiveData.FansMedalPanel.Data
  }

  interface SendMsg {
    code: number
    data: LiveData.SendMsg.Data
    message: string
    msg: string
  }

  interface LikeReport {
    code: number
    message: string
    ttl: number
    data: {}
  }

  interface GetInfoByRoom {
    code: number
    message: string
    ttl: number
    data: LiveData.GetInfoByRoom.Data
  }

  interface Silver2coin {
    code: number
    data: LiveData.Silver2coin.Data
    message: string
  }

  interface Coin2silver {
    code: number
    data: { silver: number }
    message: string
  }
}

declare namespace LiveTrace {
  interface E {
    code: number
    message: string
    ttl: number
    data: LiveTraceData.E.Data
  }

  interface X {
    code: number
    message: string
    ttl: number
    data: LiveTraceData.X.Data
  }
}

declare namespace Main {
  interface Nav {
    code: number
    message: string
    ttl: number
    data: MainData.Nav.Data
  }

  interface Reward {
    code: number
    message: string
    ttl: number
    data: MainData.Reward.Data
  }

  interface DynamicAll {
    code: number
    message: string
    ttl: number
    data: MainData.DynamicAll.Data
  }

  interface VideoHeartbeat {
    code: number
    message: string
    ttl: number
  }

  interface Share {
    code: number
    message: string
    data: number
    ttl: number
  }

  interface CoinAdd {
    code: number
    message: string
    ttl: number
    data: { like: boolean }
  }

  interface VideoRelation {
    code: number
    message: string
    ttl: number
    data: MainData.VideoRelation.Data
  }

  namespace Vip {
    interface MyPrivilege {
      code: number
      message: string
      ttl: number
      data: MainData.Vip.MyPrivilege.Data
    }

    interface ReceivePrivilege {
      code: number
      message: string
      ttl: number
      data: MainData.Vip.ReceivePrivilege.Data
    }

    interface AddExperience {
      code: number
      message: string
      ttl: number
      data: MainData.Vip.AddExperience.Data
    }
  }
}

declare namespace Vc {
  interface MyGroups {
    code: number
    msg: string
    message: string
    ttl: number
    data: VcData.MyGroups.Data
  }

  interface SignIn {
    code: number
    msg: string
    message: string
    ttl: number
    data: VcData.SignIn.Data
  }
}

export { Live, LiveTrace, Main, Vc }
