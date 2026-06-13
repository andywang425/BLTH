import { unsafeWindow } from '$'
import type { OnFrameTypes, RunAtMoment } from '@/types'
import BaseModule from '@/modules/BaseModule'
import { useModuleStore } from '@/stores'

class BanP2P extends BaseModule {
  static runOnMultiplePages: boolean = true
  static runAt: RunAtMoment = 'document-start'
  static onFrame: OnFrameTypes = 'all'
  static runAfterDefault: boolean = false

  config = useModuleStore().moduleConfig.EnhanceExperience.banp2p

  /**
   * 创建 unsafeWindow.DOMException（B站实现了自己的 DOMException）
   */
  private static createDOMException(message: string, name: string): Error {
    return new unsafeWindow.DOMException(message, name)
  }

  /**
   * 构造 unsafeWindow.Event 并派发事件
   */
  private static dispatchEvent(
    target: {
      dispatchEvent?: (event: Event) => boolean
    },
    type: string,
    eventInit: Record<string, unknown> = {},
  ): void {
    const event = new unsafeWindow.Event(type)
    Object.assign(event, eventInit)
    target.dispatchEvent?.(event)
  }

  /**
   * 安装一个“高仿但失效”的 RTCPeerConnection 实现
   *
   * 设计目标是让B站页面觉得 RTCPeerConnection 可用，但连接始终失败，无法真正建立 P2P
   */
  private banP2P(): void {
    /**
     * 一个极简 EventTarget 实现
     */
    class FakeEventTarget implements EventTarget {
      private listeners = new Map<string, Set<EventListenerOrEventListenerObject>>()

      /**
       * 记录事件监听器
       */
      addEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
        if (!listener) {
          return
        }
        if (!this.listeners.has(type)) {
          this.listeners.set(type, new Set())
        }
        this.listeners.get(type)!.add(listener)
      }

      /**
       * 移除指定监听器
       */
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
        if (!listener) {
          return
        }
        this.listeners.get(type)?.delete(listener)
      }

      /**
       * 派发事件
       */
      dispatchEvent(event: Event): boolean {
        const { type } = event
        const handler = (this as any)[`on${type}`]
        if (typeof handler === 'function') {
          // 调用 onxxx 属性回调
          handler.call(this, event)
        }

        const listeners = this.listeners.get(type)
        if (!listeners) {
          return true
        }

        // 调用 addEventListener 注册的监听器
        for (const listener of listeners) {
          if (typeof listener === 'function') {
            listener.call(this, event)
          } else {
            listener.handleEvent(event)
          }
        }

        return !event.defaultPrevented
      }
    }

    /**
     * 假的 RTCDataChannel
     *
     * 不会真的打开或传输数据
     */
    class FakeRTCDataChannel extends FakeEventTarget {
      binaryType: BinaryType = 'arraybuffer'
      bufferedAmount = 0
      bufferedAmountLowThreshold = 0
      id: number | null = null
      label: string
      maxPacketLifeTime: number | null = null
      maxRetransmits: number | null = null
      negotiated: boolean = false
      ordered: boolean
      protocol = ''
      readyState: RTCDataChannelState = 'connecting'

      onbufferedamountlow: ((ev: Event) => any) | null = null
      onclose: ((ev: Event) => any) | null = null
      onclosing: ((ev: Event) => any) | null = null
      onerror: ((ev: RTCErrorEvent) => any) | null = null
      onmessage: ((ev: MessageEvent) => any) | null = null
      onopen: ((ev: Event) => any) | null = null

      constructor(label: string, ordered = true) {
        super()
        this.label = label
        this.ordered = ordered
      }

      send(_data: string | Blob | ArrayBuffer | ArrayBufferView): void {
        if (this.readyState !== 'open') {
          // 只有在 open 状态下才能 send，与原生行为保持一致
          throw BanP2P.createDOMException(
            "Failed to execute 'send' on 'RTCDataChannel': RTCDataChannel.readyState is not 'open'.",
            'InvalidStateError',
          )
        }
      }

      close(): void {
        if (this.readyState === 'closed') {
          return
        }

        this.readyState = 'closing'
        setTimeout(() => {
          this.readyState = 'closed'
          BanP2P.dispatchEvent(this, 'close')
        }, 0)
      }
    }

    /**
     * 假的 RTCPeerConnection
     */
    class FakeRTCPeerConnection extends FakeEventTarget {
      canTrickleIceCandidates: boolean | null = false
      connectionState: RTCPeerConnectionState = 'new'
      currentLocalDescription: RTCSessionDescriptionInit | null = null
      currentRemoteDescription: RTCSessionDescriptionInit | null = null
      iceConnectionState: RTCIceConnectionState = 'new'
      iceGatheringState: RTCIceGatheringState = 'new'
      localDescription: RTCSessionDescriptionInit | null = null
      pendingLocalDescription: RTCSessionDescriptionInit | null = null
      pendingRemoteDescription: RTCSessionDescriptionInit | null = null
      remoteDescription: RTCSessionDescriptionInit | null = null
      sctp: RTCSctpTransport | null = null
      signalingState: RTCSignalingState = 'stable'

      onconnectionstatechange: ((ev: Event) => any) | null = null
      ondatachannel: ((ev: RTCDataChannelEvent) => any) | null = null
      onicecandidate: ((ev: RTCPeerConnectionIceEvent) => any) | null = null
      onicecandidateerror: ((ev: RTCPeerConnectionIceErrorEvent) => any) | null = null
      oniceconnectionstatechange: ((ev: Event) => any) | null = null
      onicegatheringstatechange: ((ev: Event) => any) | null = null
      onnegotiationneeded: ((ev: Event) => any) | null = null
      onsignalingstatechange: ((ev: Event) => any) | null = null
      ontrack: ((ev: RTCTrackEvent) => any) | null = null

      private configuration: RTCConfiguration
      private closed = false
      private dataChannels: FakeRTCDataChannel[] = []

      static readonly name = 'RTCPeerConnection'

      constructor(configuration: RTCConfiguration = {}) {
        super()
        this.configuration = configuration
      }

      /**
       * 更新 signaling 状态
       */
      private updateSignalingState(state: RTCSignalingState): void {
        this.signalingState = state
        BanP2P.dispatchEvent(this, 'signalingstatechange')
      }

      /**
       * 更新 ICE gathering 状态
       */
      private updateIceGatheringState(state: RTCIceGatheringState): void {
        this.iceGatheringState = state
        BanP2P.dispatchEvent(this, 'icegatheringstatechange')
      }

      /**
       * 更新 ICE connection 状态
       */
      private updateIceConnectionState(state: RTCIceConnectionState): void {
        this.iceConnectionState = state
        BanP2P.dispatchEvent(this, 'iceconnectionstatechange')
      }

      /**
       * 更新连接状态
       */
      private updateConnectionState(state: RTCPeerConnectionState): void {
        this.connectionState = state
        BanP2P.dispatchEvent(this, 'connectionstatechange')
      }

      private isClosed(): boolean {
        return this.closed
      }

      /**
       * 安排一次“看起来努力过，但最终失败”的连接流程
       */
      private scheduleConnectionFailure(): void {
        this.updateIceGatheringState('gathering')
        this.updateIceConnectionState('checking')
        this.updateConnectionState('connecting')

        unsafeWindow.setTimeout(() => {
          if (this.closed) {
            return
          }

          // 模拟候选收集完成，但是没有收集到任何候选
          this.updateIceGatheringState('complete')
          BanP2P.dispatchEvent(this, 'icecandidate', { candidate: null })
        }, 0)

        unsafeWindow.setTimeout(() => {
          if (this.closed) {
            return
          }

          this.updateIceConnectionState('failed')
          this.updateConnectionState('failed')

          // 连接失败时，把已创建的数据通道一起关掉，模拟底层传输不可用
          for (const channel of this.dataChannels) {
            channel.close()
          }
        }, 78)
      }

      /**
       * 返回一个结构上合法的假 offer，供页面继续执行协商流程
       */
      createOffer(): Promise<RTCSessionDescriptionInit> {
        return Promise.resolve({
          type: 'offer',
          sdp: 'v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        })
      }

      /**
       * 返回一个结构上合法的假 answer
       */
      createAnswer(): Promise<RTCSessionDescriptionInit> {
        return Promise.resolve({
          type: 'answer',
          sdp: 'v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        })
      }

      /**
       * 记录描述对象并启动一次假的连接失败流程
       *
       * 如果连接已经 close，则静默成功
       */
      setLocalDescription(description?: RTCLocalSessionDescriptionInit): Promise<void> {
        if (this.isClosed()) {
          return Promise.resolve()
        }

        const nextDescription: RTCSessionDescriptionInit = description
          ? {
              type: description.type ?? 'offer',
              sdp: description.sdp,
            }
          : {
              type: 'offer',
              sdp: 'v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
            }

        this.pendingLocalDescription = nextDescription
        this.localDescription = nextDescription
        this.currentLocalDescription = nextDescription
        this.updateSignalingState(nextDescription.type === 'offer' ? 'have-local-offer' : 'stable')
        this.scheduleConnectionFailure()

        return Promise.resolve()
      }

      /**
       * 记录远端描述并启动一次假的连接失败流程
       *
       * 如果连接已经 close，则静默成功
       */
      setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
        if (this.isClosed()) {
          return Promise.resolve()
        }
        this.pendingRemoteDescription = description
        this.remoteDescription = description
        this.currentRemoteDescription = description
        this.canTrickleIceCandidates = false // 表示不接收 trickle ICE 候选
        this.updateSignalingState(description.type === 'offer' ? 'have-remote-offer' : 'stable')
        this.scheduleConnectionFailure()
        return Promise.resolve()
      }

      addIceCandidate(_candidate?: RTCIceCandidateInit | RTCIceCandidate): Promise<void> {
        // 模拟“候选添加成功但没有实际效果“
        return Promise.resolve()
      }

      /**
       * 返回一个假的 DataChannel
       */
      createDataChannel(
        label: string,
        options: RTCDataChannelInit = { ordered: true },
      ): FakeRTCDataChannel {
        const channel = new FakeRTCDataChannel(label, options.ordered)
        if (this.isClosed()) {
          // 即便 PeerConnection 已经 closed，也返回对象而不是报错
          channel.close()
          return channel
        }
        this.dataChannels.push(channel)
        return channel
      }

      /**
       * 返回构造时传入的配置
       */
      getConfiguration(): RTCConfiguration {
        return this.configuration
      }

      getSenders(): RTCRtpSender[] {
        return []
      }

      getReceivers(): RTCRtpReceiver[] {
        return []
      }

      getTransceivers(): RTCRtpTransceiver[] {
        return []
      }

      /**
       * 返回一个空的 stats report
       */
      getStats(): Promise<RTCStatsReport> {
        return Promise.resolve(new Map() as RTCStatsReport)
      }

      /**
       * 返回空 sender，占位满足 addTrack 的返回类型要求
       */
      addTrack(): RTCRtpSender {
        return {} as RTCRtpSender
      }

      /**
       * 无操作的 removeTrack
       */
      removeTrack(_sender: RTCRtpSender): void {}

      /**
       * 不真正重启，而是再安排一轮连接失败流程
       */
      restartIce(): void {
        if (this.isClosed()) {
          return
        }
        this.scheduleConnectionFailure()
      }

      /**
       * 把连接彻底标记为关闭，并同步更新各类状态字段
       */
      close(): void {
        if (this.closed) {
          return
        }

        this.closed = true
        this.updateSignalingState('closed')
        this.updateIceGatheringState('complete')
        this.updateIceConnectionState('closed')
        this.updateConnectionState('closed')

        for (const channel of this.dataChannels) {
          channel.close()
        }
      }
    }

    Object.defineProperty(FakeRTCPeerConnection.prototype, Symbol.toStringTag, {
      value: 'RTCPeerConnection',
      configurable: true,
    })

    const RTClist: string[] = [
      'RTCPeerConnection',
      'mozRTCPeerConnection',
      'webkitRTCPeerConnection',
    ]

    for (const i of RTClist) {
      Object.defineProperty(unsafeWindow, i, {
        value: FakeRTCPeerConnection,
        enumerable: false,
        writable: true,
        configurable: true,
      })
    }
  }

  public run(): void {
    this.logger.log('禁用P2P模块开始运行')

    try {
      this.banP2P()
    } catch (e) {
      this.logger.error('禁用P2P失败', e)
    }
  }
}

export default BanP2P
