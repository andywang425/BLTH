// ==UserScript==
// @name         bliveproxy
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  B站直播websocket hook框架
// @author       xfgryujk
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/gh/google/brotli@5692e422da6af1e991f9182345d58df87866bc5e/js/decode.js
// @grant        none
// ==/UserScript==

// 使用方法：
// bliveproxy.addCommandHandler('DANMU_MSG', command => {
//   console.log(command)
//   let info = command.info
//   info[1] = '测试'
// })
//
// 如果@grant不是none，则要使用unsafeWindow.bliveproxy

(function () {
  const HEADER_SIZE = 16

  const WS_BODY_PROTOCOL_VERSION_NORMAL = 0
  const WS_BODY_PROTOCOL_VERSION_HEARTBEAT = 1
  const WS_BODY_PROTOCOL_VERSION_BROTLI = 3

  const OP_HEARTBEAT_REPLY = 3 // WS_OP_HEARTBEAT_REPLY
  const OP_SEND_MSG_REPLY = 5 // WS_OP_MESSAGE
  const OP_AUTH_REPLY = 8 // WS_OP_CONNECT_SUCCESS

  // 兼容@grant不是none的情况
  let pageWindow = window
  if (typeof unsafeWindow !== 'undefined') {
    pageWindow = unsafeWindow
  }

  let textEncoder = new TextEncoder()
  let textDecoder = new TextDecoder()

  function main() {
    if (pageWindow.bliveproxy) {
      // 防止多次加载
      return
    }
    initApi()
    //hook()
  }

  function initApi() {
    pageWindow.bliveproxy = api
  }

  let api = {
    addCommandHandler(cmd, handler) {
      let handlers = this._commandHandlers[cmd]
      if (!handlers) {
        handlers = this._commandHandlers[cmd] = []
      }
      handlers.push(handler)
    },
    removeCommandHandler(cmd, handler) {
      let handlers = this._commandHandlers[cmd]
      if (!handlers) {
        return
      }
      this._commandHandlers[cmd] = handlers.filter(item => item !== handler)
    },
    hook() {
      pageWindow.WebSocket = new Proxy(pageWindow.WebSocket, {
        construct(target, args) {
          let obj = new target(...args)
          return new Proxy(obj, proxyHandler)
        }
      })
    },

    // 私有API
    _commandHandlers: {},
    _getCommandHandlers(cmd) {
      return this._commandHandlers[cmd] || null
    }
  }

  let proxyHandler = {
    get(target, property) {
      let value = target[property]
      if ((typeof value) === 'function') {
        value = value.bind(target)
      }
      return value
    },
    set(target, property, value) {
      if (property === 'onmessage') {
        let realOnMessage = value
        value = function (event) {
          myOnMessage(event, realOnMessage)
        }
      }
      target[property] = value
      return value
    }
  }

  function myOnMessage(event, realOnMessage) {
    if (!(event.data instanceof ArrayBuffer)) {
      realOnMessage(event)
      return
    }

    let data = new Uint8Array(event.data)
    function callRealOnMessageByPacket(packet) {
      realOnMessage({ ...event, data: packet })
    }
    handleMessage(data, callRealOnMessageByPacket)
  }

  function makePacketFromCommand(command) {
    let body = textEncoder.encode(JSON.stringify(command))
    return makePacketFromUint8Array(body, OP_SEND_MSG_REPLY)
  }

  function makePacketFromUint8Array(body, operation) {
    let packLen = HEADER_SIZE + body.byteLength
    let packet = new ArrayBuffer(packLen)

    // 不需要压缩
    let ver = operation === OP_HEARTBEAT_REPLY ? WS_BODY_PROTOCOL_VERSION_HEARTBEAT : WS_BODY_PROTOCOL_VERSION_NORMAL
    let packetView = new DataView(packet)
    packetView.setUint32(0, packLen)        // pack_len
    packetView.setUint16(4, HEADER_SIZE)    // raw_header_size
    packetView.setUint16(6, ver)            // ver
    packetView.setUint32(8, operation)      // operation
    packetView.setUint32(12, 1)             // seq_id

    let packetBody = new Uint8Array(packet, HEADER_SIZE, body.byteLength)
    for (let i = 0; i < body.byteLength; i++) {
      packetBody[i] = body[i]
    }
    return packet
  }

  function handleMessage(data, callRealOnMessageByPacket) {
    let dataView = new DataView(data.buffer)
    let operation = dataView.getUint32(8)

    switch (operation) {
      case OP_AUTH_REPLY:
      case OP_SEND_MSG_REPLY: {
        // 可能有多个包一起发，需要分包
        let offset = 0
        while (offset < data.byteLength) {
          let dataView = new DataView(data.buffer, offset)
          let packLen = dataView.getUint32(0)
          let rawHeaderSize = dataView.getUint16(4)
          let ver = dataView.getUint16(6)
          let operation = dataView.getUint32(8)
          // let seqId = dataView.getUint32(12)

          let body = new Uint8Array(data.buffer, offset + rawHeaderSize, packLen - rawHeaderSize)
          if (operation === OP_SEND_MSG_REPLY) {
            // 业务消息
            switch (ver) {
              case WS_BODY_PROTOCOL_VERSION_NORMAL: {
                // body是单个JSON消息
                body = textDecoder.decode(body)
                body = JSON.parse(body)
                handleCommand(body, callRealOnMessageByPacket)
                break
              }
              case WS_BODY_PROTOCOL_VERSION_BROTLI: {
                // body是压缩过的多个消息
                body = BrotliDecode(body)
                handleMessage(body, callRealOnMessageByPacket)
                break
              }
              default: {
                // 未知的body格式
                let packet = makePacketFromUint8Array(body, operation)
                callRealOnMessageByPacket(packet)
                break
              }
            }
          } else {
            // 非业务消息
            let packet = makePacketFromUint8Array(body, operation)
            callRealOnMessageByPacket(packet)
          }

          offset += packLen
        }
        break
      }

      // 服务器心跳包，前4字节是人气值，后面是客户端发的心跳包内容
      // packLen不包括客户端发的心跳包内容，不知道是不是服务器BUG
      // 这里没用到心跳包就不处理了
      // case OP_HEARTBEAT_REPLY:
      default: {
        // 只有一个包
        let packLen = dataView.getUint32(0)
        let rawHeaderSize = dataView.getUint16(4)

        let body = new Uint8Array(data.buffer, rawHeaderSize, packLen - rawHeaderSize)
        let packet = makePacketFromUint8Array(body, operation)
        callRealOnMessageByPacket(packet)
        break
      }
    }
  }

  function handleCommand(command, callRealOnMessageByPacket) {
    if (command instanceof Array) {
      for (let oneCommand of command) {
        this.handleCommand(oneCommand)
      }
      return
    }

    let cmd = command.cmd || ''
    let pos = cmd.indexOf(':')
    if (pos != -1) {
      cmd = cmd.substr(0, pos)
    }
    let handlers = api._getCommandHandlers(cmd)
    if (handlers) {
      for (let handler of handlers) {
        handler(command)
      }
    }
    // console.log(command)

    let packet = makePacketFromCommand(command)
    callRealOnMessageByPacket(packet)
  }

  main()
})();
