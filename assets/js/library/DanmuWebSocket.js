// ==UserScript==
// @name         DanmuWebSocket
// @namespace    https://github.com/andywang425
// @version      0.1
// @description  B站直播WebSocket弹幕库
// @author       andywang425
// @require      https://fastly.jsdelivr.net/gh/andywang425/BLTH@d810c0c54546b88addc612522c76ba481285298d/assets/js/library/decode.min.js
// @require      https://fastly.jsdelivr.net/npm/pako@1.0.10/dist/pako.min.js
// @grant        none
// ==/UserScript==
class DanmuWebSocket extends WebSocket {
    HEADER_SIZE = 16;
    WS_BODY_PROTOCOL_VERSION_NORMAL = 0
    WS_BODY_PROTOCOL_VERSION_HEARTBEAT = 1
    WS_BODY_PROTOCOL_VERSION_INFLATE = 2;
    WS_BODY_PROTOCOL_VERSION_BROTLI = 3
    OP_HEARTBEAT_REPLY = 3 // WS_OP_HEARTBEAT_REPLY
    OP_SEND_MSG_REPLY = 5 // WS_OP_MESSAGE
    OP_AUTH_REPLY = 8 // WS_OP_CONNECT_SUCCESS

    MY_STATE_LIST = ['reconnect', 'login', 'heartbeat', 'cmd', 'unknownmsg'];

    reconnectInterval = 10e3;
    closed = false;
    handlers = {
        reconnect: [],
        login: [],
        heartbeat: [],
        cmd: [],
        receive: [],

        open: [],
        close: [],
        error: [],
        message: []
    };
    initObj = {};
    roomid = 0;
    uid = 0;
    host_server_list = [{
        host: '',
        port: 0,
        wss_port: 0,
        ws_port: 0
    }];
    address = '';
    token = '';
    /**
     * 触发事件
     * @param {string} type 事件类型
     * @param {JSON | Event} event 事件，当 type 为自定义事件类型 (MY_STATE_LIST) 时为 JSON，否则为 Event
     */

    emitEvent(type, event) {
        this.dispatchEvent(new CustomEvent(type, event));
    }
    /**
     * 把 string 转换为 uint8array
     * @param {string} string 
     * @returns Uint8array
     */
    string2Uint(string) {
        return new Uint8Array(Array.from(string).map(char => char.charCodeAt(0)));
    }
    /**
     * 调用 TextDecoder 的 decode 方法
     * @param {BufferSource} BufferSource 
     * @returns string
     */
    textdecode(bufferSource) {
        return new TextDecoder("utf-8").decode(bufferSource);
    }
    /**
     * 获取弹幕服务器地址（列表），token
     * @param {{roomid: int, uid?: int, host_server_list?:[...{host: string, port: int, wss_port: int, ws_port: int}], address?: string, token?: string}} obj 
     */
    static async getWebSocketConf(obj) {
        if ((!obj.address && !obj.host_server_list) || !obj.token) {
            ({ data: { host_server_list: obj.host_server_list, token: obj.token } } = await BAPI.room.getConf(obj.roomid).then(res => { return res; }));
            if (Array.isArray(obj.host_server_list) && obj.host_server_list.length > 0) {
                for (const i of obj.host_server_list) {
                    if (i.host && i.wss_port) {
                        obj.address = `wss://${i.host}:${i.wss_port}/sub`;
                        break;
                    }
                }
            } else {
                throw new Error('无法获取弹幕服务器地址');
            }
        }
        if (!obj.uid) obj.uid = 0;
    }
    /**
     * 设置属性
     * @param {*} initObj 
     */
    setProperties(initObj) {
        this.binaryType = 'arraybuffer';
        this.initObj = initObj;
        Object.keys(initObj).forEach(key => {
            this[key] = initObj[key];
        })
    }
    /**
     * Websocket关闭后操作（自动重连）
     */
    wsClose() {
        // 清除心跳
        if (this.heartBeatHandler) clearInterval(this.heartBeatHandler);
        // 如果是主动关闭连接，不重连
        if (this.closed) return;
        // 自动重连
        setTimeout(async () => {
            const ws = await new DanmuWebSocket(this.initObj);
            ws.handlers = this.handlers;
            Object.keys(ws.handlers).forEach(key => { ws.addEventListener(key, event => ws.handlers[key].call(ws, event)) });
            if (ws.handlers.onreconnect.length > 0) this.emitEvent('reconnect', { detail: ws });
        }, this.reconnectInterval);
    }
    /**
     * 处理收到的消息
     * @param {ArrayBuffer} arrBuffer 
     */
    handleMessage(arrBuffer) {
        let dataView = new DataView(arrBuffer)
        let operation = dataView.getUint32(8)
        switch (operation) {
            case this.OP_AUTH_REPLY:
            case this.OP_SEND_MSG_REPLY: {
                // 可能有多个包一起发，需要分包
                let offset = 0
                while (offset < arrBuffer.byteLength) {
                    let dataView = new DataView(arrBuffer, offset)
                    let packLen = dataView.getUint32(0)
                    let rawHeaderSize = dataView.getUint16(4)
                    let ver = dataView.getUint16(6)
                    let operation = dataView.getUint32(8)
                    // let seqId = dataView.getUint32(12)

                    let body = new Uint8Array(arrBuffer, offset + rawHeaderSize, packLen - rawHeaderSize)
                    if (operation === this.OP_SEND_MSG_REPLY) {
                        // 业务消息
                        switch (ver) {
                            case this.WS_BODY_PROTOCOL_VERSION_NORMAL: {
                                // body是单个JSON消息
                                body = this.textdecode(body)
                                body = JSON.parse(body)
                                this.emitEvent('cmd', { detail: body });
                                break
                            }
                            case this.WS_BODY_PROTOCOL_VERSION_HEARTBEAT: {
                                // 心跳回应，人气值
                                console.log('心跳会在这里吗？')
                                this.emitEvent('heartbeat', {
                                    detail: {
                                        popularity: parseInt([...body].map(x => x.toString(16)).join(''), 16),
                                        heartbeat: this.textdecode(body.buffer.slice(packLen))
                                    }
                                });
                                break;
                            }
                            case this.WS_BODY_PROTOCOL_VERSION_INFLATE: {
                                body = pako.inflate(body).buffer;
                                this.handleMessage(body)
                                break
                            }
                            case this.WS_BODY_PROTOCOL_VERSION_BROTLI: {
                                // body是压缩过的多个消息
                                body = BrotliDecode(body)
                                this.handleMessage(body)
                                break
                            }
                            default: {
                                // 未知的body格式
                                const detail = {
                                    rawArrayBuffer: arrBuffer,
                                    packLen: packLen,
                                    headerLen: rawHeaderSize,
                                    protover: ver,
                                    operation: operation,
                                    body: body
                                };
                                console.log('[DanmuWebSocket] 未知的body格式', detail);
                                this.emitEvent('unknownmsg', {
                                    detail: detail
                                });
                                break
                            }
                        }
                    } else if (operation === this.OP_AUTH_REPLY) {
                        // 登录回应
                        this.emitEvent('login', { detail: JSON.parse(this.textdecode(body.buffer.slice(rawHeaderSize))) });
                    }
                    else {
                        // 非业务消息
                        const detail = {
                            rawArrayBuffer: arrBuffer,
                            packLen: packLen,
                            headerLen: rawHeaderSize,
                            protover: ver,
                            operation: operation,
                            body: body
                        };
                        console.log('[DanmuWebSocket] 非业务消息', detail);
                        this.emitEvent('unknownmsg', {
                            detail: detail
                        });
                    }
                    offset += packLen
                }
                break
            }

            case this.OP_HEARTBEAT_REPLY: {
                let packLen = dataView.getUint32(0)
                let rawHeaderSize = dataView.getUint16(4)
                let body = new Uint8Array(arrBuffer, rawHeaderSize, packLen - rawHeaderSize)
                this.emitEvent('heartbeat', {
                    detail: {
                        popularity: parseInt([...body].map(x => x.toString(16)).join(''), 16),
                        heartbeat: this.textdecode(body.buffer.slice(packLen))
                    }
                });
                break;
            }
            default: {
                // 只有一个包
                let packLen = dataView.getUint32(0)
                let rawHeaderSize = dataView.getUint16(4)
                let ver = dataView.getUint16(6)
                let body = new Uint8Array(arrBuffer, rawHeaderSize, packLen - rawHeaderSize)
                const detail = {
                    rawArrayBuffer: arrBuffer,
                    packLen: packLen,
                    headerLen: rawHeaderSize,
                    protover: ver,
                    operation: operation,
                    body: body
                };
                console.log('[DanmuWebSocket]  只有一个包', detail)
                this.emitEvent('unknownmsg', {
                    detail: detail
                });
                break
            }
        }
    }
    /**
     * async constructor (await new Xxx(...))
     * @param {{roomid: int, uid?: int, host_server_list?:[...{host: string, port: int, wss_port: int, ws_port: int}], address?: string, token?: string}} initObj 
     */
    constructor(initObj) {
        return (async () => {
            await DanmuWebSocket.getWebSocketConf(initObj);
            super(initObj.address);
            this.setProperties(initObj);

            this.addEventListener('open', () => {
                this.sendLoginPacket();
                this.sendHeartBeatPacket();
                this.heartBeatHandler = setInterval(() => {
                    this.sendHeartBeatPacket();
                }, 30e3);
            });
            this.addEventListener('close', () => {
                this.wsClose();
            });
            this.addEventListener('message', event => {
                this.handleMessage(event.data);
            });
            return this;
        })();
    }
    /**
     * 主动关闭 WebSocket 连接
     * @param {int} code 
     * @param {string} reason 
     */
    close(code, reason) {
        this.closed = true;
        super.close(code, reason);
    }
    /**
     * 绑定 handlers
     * @param {{reconnect: function({detail:DanmuWebSocket}), login: function({detail:{code: int}}), heartbeat: function({detail:popularity: int, heartbeat: string}), cmd: function({detail:{cmd: string, data: Object}}), unknownmsg: function({detail:{rawArrayBuffer: ArrayBuffer, packLen: int, headerLen: int, protover: int, operation: int, sequence: int, body: Uint8Array}})}} obj 
     */
    bind(obj) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'function') {
                this.addEventListener(key, event => obj[key].call(this, this.MY_STATE_LIST.includes(key) ? event.detail : event));
                if (!this.handlers[key]) this.handlers[key] = [];
                this.handlers[key].push(obj[key]);
            }
        })
    }
    /**
     * 发送数据
     * @param {JSON | string} data 
     * @param {int} protover 
     * @param {int} operation 
     * @param {int} sequence 
     * @returns 
     */
    sendData(data, protover, operation, sequence) {
        if (this.readyState !== WebSocket.OPEN) throw new Error('DanmuWebSocket未连接');
        switch (Object.prototype.toString.call(data)) {
            case '[object Object]':
                return this.sendData(JSON.stringify(data), protover, operation, sequence);
            case '[object String]':
                {
                    let dataUint8Array = this.string2Uint(data);
                    let buffer = new ArrayBuffer(this.HEADER_SIZE + dataUint8Array.byteLength);
                    let dv = new DataView(buffer);
                    dv.setUint32(0, this.HEADER_SIZE + dataUint8Array.byteLength);
                    dv.setUint16(4, this.HEADER_SIZE);
                    dv.setUint16(6, parseInt(protover, 10));
                    dv.setUint32(8, parseInt(operation, 10));
                    dv.setUint32(12, parseInt(sequence, 10));
                    for (let i = 0; i < dataUint8Array.byteLength; ++i) {
                        dv.setUint8(this.HEADER_SIZE + i, dataUint8Array[i]);
                    }
                    this.send(buffer);
                }
                return this;
            default:
                this.send(data);
        }
        return this;
    }
    /**
     * 登陆包，连接成功后需立刻发送
     * @returns 
     */
    sendLoginPacket() {
        const data = {
            'uid': this.uid,
            'roomid': this.roomid,
            'protover': 2, // 3?
            'platform': 'web',
            'type': 2,
            'key': this.token,
            'clientver': '1.8.5',
        };
        return this.sendData(data, 1, 7, 1);
    }
    /**
     * 心跳包
     * @returns 
     */
    sendHeartBeatPacket() {
        return this.sendData('[object Object]', 1, 2, 1);
    }
}
