// ==UserScript==
// @namespace     https://github.com/andywang425
// @name          B站直播间挂机助手
// @name:en       B站直播间挂机助手
// @author        andywang425
// @description   自动参与Bilibili直播区抽奖(现在极少)，直播区签到，完成主站每日任务，领银瓜子宝箱，自动送礼，自动获取小心心，批量点亮勋章，快捷购买粉丝勋章
// @description:en 自动参与Bilibili直播区抽奖(现在极少)，直播区签到，完成主站每日任务，领银瓜子宝箱，自动送礼，自动获取小心心，批量点亮勋章，快捷购买粉丝勋章
// @updateURL     https://raw.githubusercontent.com/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @downloadURL    https://raw.githubusercontent.com/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @homepageURL   https://github.com/andywang425/BLTH/
// @supportURL    https://github.com/andywang425/BLTH/issues
// @icon          https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png
// @copyright     2020, andywang425 (https://github.com/andywang425)
// @license       MIT
// @version       4.1.4
// @include      /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @run-at       document-start
// @connect      passport.bilibili.com
// @connect      api.live.bilibili.com
// @connect      live-trace.bilibili.com
//@require https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/dist/jquery.min.js
//@require https://cdn.jsdelivr.net/gh/andywang425/BLTH@v2.1/BilibiliAPI_Mod.min.js
//@require https://cdn.jsdelivr.net/gh/andywang425/BLTH@v1.3.2/OCRAD.min.js
//@require https://cdn.jsdelivr.net/gh/andywang425/BLTH@v1.3.4/libBilibiliToken.user.js
//@require https:///cdn.jsdelivr.net/gh/sentsin/layer@v3.1.1/dist/layer.js
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_getResourceText
// ==/UserScript==
(function () {
    const NAME = 'IGIFTMSG';
    const block_live = localStorage.getItem(`${NAME}_block_live`) || 'pass';
    //const originFetch = fetch;
    if (block_live == 'block' && /https?:\/\/live\.bilibili\.com\/.*\?cut/.test(window.location.href)) {
        return blockLiveStream();
    };
    window.localStorage["LIVE_PLAYER_STATUS"] = window.localStorage["LIVE_PLAYER_STATUS"].replace("flash", 'html5');
    const debugSwitch = true; //控制开关
    let msgHide = localStorage.getItem(`${NAME}_msgHide`) || 'hide'; //UI隐藏开关
    const BAPI = BilibiliAPI;
    //let DanMuServerHost;
    let gift_join_try = 0,
        guard_join_try = 0,
        pk_join_try = 0,
        SEND_GIFT_NOW = false,//立刻送出礼物
        layerIndex_list = [],
        liveRoom_list = [],
        Live_info = {
            room_id: undefined,
            uid: undefined,
            ruid: undefined,
            mobile_verify: undefined,
            gift_list: undefined,
            //gift_list_str: undefined,
            rnd: undefined,
            visit_id: undefined,
            identification: undefined,
            bili_jct: undefined
        };
    const tz_offset = new Date().getTimezoneOffset() + 480;
    const ts_ms = () => Date.now();//当前毫秒
    const ts_s = () => Math.round(ts_ms() / 1000);//当前秒
    const runUntilSucceed = (callback, delay = 0, period = 100) => {
        setTimeout(() => {
            if (!callback()) runUntilSucceed(callback, period, period);
        }, delay);
    };
    const delayCall = (callback, delay = 10e3) => {
        const p = $.Deferred();
        setTimeout(() => {
            const t = callback();
            if (t && t.then) t.then((arg1, arg2, arg3, arg4, arg5, arg6) => p.resolve(arg1, arg2, arg3, arg4, arg5, arg6));
            else p.resolve();
        }, delay);
        return p;
    };
    const MYDEBUG = (sign, ...data) => {
        if (!debugSwitch) return;
        let d = new Date();
        d = `[${NAME}][${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}]`;
        if (data.length === 1) { console.log(d, `${sign}:`, data[0]); return }
        console.log(d, `${sign}:`, data);
    };
    const runMidnight = (callback, msg) => {//明天凌晨0点1分再次运行（因为12点时任务可能没刷新）
        const t = new Date();
        let name = msg || ' ';
        t.setMinutes(t.getMinutes() + tz_offset);
        t.setDate(t.getDate() + 1);
        t.setHours(0, 1, 0, 0);
        t.setMinutes(t.getMinutes() - tz_offset);
        setTimeout(callback, t - ts_ms());
        MYDEBUG('runMidnight', name + " " + t.toString());
    };
    const runExactMidnight = (callback, msg) => {//明天凌晨0点再次运行（清空统计）
        const t = new Date();
        let name = msg || ' ';
        t.setMinutes(t.getMinutes() + tz_offset);
        t.setDate(t.getDate() + 1);
        t.setHours(0, 0, 0, 0);
        t.setMinutes(t.getMinutes() - tz_offset);
        setTimeout(callback, t - ts_ms());
        MYDEBUG('runExactMidnight', name + " " + t.toString());
    };
    const runTomorrow = (callback, hour, minute, msg) => {//明天运行，可自定义时间
        const t = new Date();
        let name = msg || ' ';
        t.setMinutes(t.getMinutes() + tz_offset);
        t.setDate(t.getDate() + 1);
        t.setHours(hour, minute, 0, 0);
        t.setMinutes(t.getMinutes() - tz_offset);
        setTimeout(callback, t - ts_ms());
        MYDEBUG('runTomorrow', name + " " + t.toString());
    }
    const appToken = new BilibiliToken();
    const baseQuery = `actionKey=appkey&appkey=${BilibiliToken.appKey}&build=5561000&channel=bili&device=android&mobi_app=android&platform=android&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%225.57.0%22%2C%22abtest%22%3A%22%22%7D`;
    //let tokenData = JSON.parse(GM_getValue('userToken', '{}'));
    let userToken = undefined,
        tokenData = JSON.parse(localStorage.getItem(`${NAME}_userToken`)) || {};
    const setToken = async () => {
        if (tokenData.time > ts_s()) {
            userToken = tokenData;
        } else {
            tokenData = await appToken.getToken();
            tokenData.time = ts_s() + tokenData.expires_in;
            localStorage.setItem(`${NAME}_Token`, JSON.stringify(tokenData));
            userToken = tokenData;
        };
        MYDEBUG(`${NAME}_userToken`, tokenData);
        return 'OK';
    };
    const newWindow = {
        init: () => {
            return newWindow.Toast.init().then(() => {
            });
        },
        Toast: { //设置右上角弹窗
            init: () => {
                try {
                    const list = [];
                    window.toast = (msg, type = 'info', timeout = 5e3) => {
                        switch (type) {
                            case 'success':
                            case 'info':
                                break;
                            case 'caution':
                                break;
                            case 'error':
                                break;
                            default:
                                type = 'info';
                        }
                        const a = $(`<div class="link-toast ${type} fixed"><span class="toast-text">${msg}</span></div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = (document.body.scrollTop + list.length * 40 + 10) + 'px';
                        a.style.left = (document.body.offsetWidth + document.body.scrollLeft - a.offsetWidth - 5) + 'px';
                        if (msgHide == 'hide') {
                            $('.link-toast').hide();
                        }
                        list.push(a);
                        setTimeout(() => {
                            a.className += ' out';
                            setTimeout(() => {
                                list.shift();
                                list.forEach((v) => {
                                    v.style.top = (parseInt(v.style.top, 10) - 40) + 'px';
                                });
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                    return $.Deferred().resolve();
                } catch (err) {
                    console.error(`初始化浮动提示时出现异常`, err);
                    return $.Deferred().reject();
                }
            }
        }// Need Init
    }
    newWindow.init();

    $(() => {//DOM完毕，等待弹幕加载完成
        let loadInfo = (delay) => {
            setTimeout(() => {
                const W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
                if ((W.BilibiliLive === undefined || parseInt(W.BilibiliLive.UID) === 0 || isNaN(parseInt(W.BilibiliLive.UID)))) {
                    loadInfo(1000);
                    window.toast(`[${GM_info.script.name}]无配置信息`, 'warning');
                    MYDEBUG('无配置信息');
                } else {
                    Live_info.room_id = W.BilibiliLive.ROOMID;
                    Live_info.uid = W.BilibiliLive.UID;
                    BAPI.live_user.get_info_in_room(Live_info.room_id).then((response) => {
                        MYDEBUG('InitData: API.live_user.get_info_in_room', response);
                        Live_info.mobile_verify = response.data.info.mobile_verify;
                        Live_info.identification = response.data.info.identification;
                    });
                    BAPI.gift.gift_config().then((response) => {
                        MYDEBUG('InitData: API.gift.gift_config', response);
                        if (!!response.data && $.isArray(response.data)) {
                            Live_info.gift_list = response.data;
                        } else if (!!response.data.list && $.isArray(response.data.list)) {
                            Live_info.gift_list = response.data.list;
                        } else {
                            Live_info.gift_list = [
                                {
                                    "id": 6,//亿圆
                                    "price": 1000
                                }, {
                                    "id": 1,//辣条
                                    "price": 100
                                }, {
                                    'id': 30607, //小心心
                                    'price': 5000
                                }];
                            window.toast('直播间礼物数据获取失败，使用备用数据', 'error');
                        }
                        /*
                        Live_info.gift_list.forEach((v, i) => {
                            if (i % 3 === 0) Live_info.gift_list_str += '<br>';
                            Live_info.gift_list_str += `${v.id}：${v.name}`;
                            if (i < Live_info.gift_list.length - 1) Live_info.gift_list_str += '，';
                        });*/
                    });
                    Live_info.bili_jct = BAPI.getCookie('bili_jct');
                    Live_info.ruid = W.BilibiliLive.ANCHOR_UID;
                    Live_info.rnd = W.BilibiliLive.RND;
                    Live_info.visit_id = W.__statisObserver ? W.__statisObserver.__visitId : '';
                    MYDEBUG("Live_info", Live_info);
                    init();
                }
            }, delay);
        };
        loadInfo(1000);
        addStyle();//加载style
    });

    Array.prototype.remove = function (val) {
        let index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    function addStyle() {
        $('head').append(`
        <style>
            .igiftMsg_input{
                outline: none;
                border: 1px solid #e9eaec;
                background-color: #fff;
                border-radius: 4px;
                padding: 1px 0 0;
                overflow: hidden;
                font-size: 12px;
                line-height: 19px;
                width: 30px;
                'z-index': '10001';
            }
            .igiftMsg_btn{
                background-color: #23ade5;
                color: #fff;
                border-radius: 4px;
                border: none;
                padding: 5px;
                cursor: pointer;
                box-shadow: 0 0 2px #00000075;
                line-height: 10px;
                'z-index': '10001';
            }
            .igiftMsg_fs{
                border: 2px solid #d4d4d4;
                'z-index': '10001';
            }
        </style>
            `);
        //加载layer样式。如果用GM_addStyle加载会无法使用icon，原因不明
        $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/sentsin/layer@v3.1.1/dist/theme/default/layer.css">');
    }
    function init() {//API初始化
        const MY_API = {
            CONFIG_DEFAULT: {
                AUTO_GIFT: false,//自动送礼
                AUTO_GIFT_ROOMID: "0",//送礼优先房间
                AUTO_GROUP_SIGN: true,//应援团签到开关
                AUTO_TREASUREBOX: true,//每日宝箱
                CHECK_HOUR_ROOM_INTERVAL: 120,//小时间检查间隔时间(秒)
                COIN: false,//投币
                COIN_NUMBER: 0,//投币数量
                COIN_TYPE: "COIN_DYN",//投币方法 动态/UID
                COIN_UID: 0,//投币up主
                BLOCK_LIVE_VIDEO: true,//拦截挂小心心打开窗口的直播流
                EXCLUDE_ROOMID: "0",//送礼排除房间号
                FORCE_LOTTERY: false,//黑屋强制抽奖
                FORCE_LIGHT: false,//忽略亲密上限点亮
                GIFT_LIMIT: 1,//礼物到期时间(天)
                GIFT_SEND_HOUR: 23,//送礼小时
                GIFT_SEND_MINUTE: 59,//送礼分钟
                GIFT_INTERVAL: 5,//送礼间隔
                GIFT_METHOD: "GIFT_SEND_TIME",//送礼策略
                GIFT_SORT: false,//送礼优先高等级
                IN_TIME_RELOAD_DISABLE: false,//休眠时段是否禁止刷新直播间 false为刷新
                LIVE_SIGN: true,//直播区签到
                LOGIN: true,//主站登陆
                LITTLE_HEART: false,//打开隐形窗口获取小心心
                LIGHT_MEDALS: "0",//点亮勋章
                LIGHT_METHOD: "LIGHT_WHITE",
                MAX_GIFT: 99999,//辣条上限
                MAX_TAB: 5,//标签页上限
                MOBILE_HEARTBEAT: false,//移动端心跳
                RANDOM_DELAY: true,//抽奖随机延迟
                RANDOM_SEND_DANMU: 0,//随机弹幕发送概率
                RANDOM_SKIP: 0,//随机跳过抽奖概率
                REMOVE_ELEMENT_2233: false,//移除2233
                REMOVE_ELEMENT_activity: false,//移除夏日活动入口
                RND_DELAY_END: 5,//延迟最大值
                RND_DELAY_START: 2,//延迟最小值
                SEND_ALL_GIFT: false,//送满全部勋章
                SHARE: true,//分享
                SILVER2COIN: false,//银瓜子换硬币
                SPARE_GIFT_ROOM: "0",//剩余礼物送礼房间
                SPARE_GIFT_UID: "0",//剩余礼物送礼uid
                STORM: false,//节奏风暴
                STORM_MAX_COUNT: 100,//单个风暴最大尝试次数
                STORM_ONE_LIMIT: 200,//单个风暴参与次数间隔（毫秒）
                STORM_QUEUE_SIZE: 3,//允许同时参与的风暴次数
                TIME_AREA_DISABLE: true,//不抽奖时段开关
                TIME_AREA_END_H0UR: 8,//不抽奖结束小时
                TIME_AREA_END_MINUTE: 0,//不抽奖结束分钟
                TIME_AREA_START_H0UR: 2,//不抽奖开始小时
                TIME_AREA_START_MINUTE: 0,//不抽奖开始分钟
                TIME_RELOAD: 120,//直播间重载时间
                WATCH: true,//观看视频
            },
            CACHE_DEFAULT: {
                UNIQUE_CHECK: 0,//唯一运行检测
                AUTO_GROUP_SIGH_TS: 0,//应援团执行时间，用于判断是否为新的一天
                DailyReward_TS: 0,//其它每日任务
                LiveReward_TS: 0,//直播每日任务
                TreasureBox_TS: 0,//银瓜子宝箱
                Silver2Coin_TS: 0,//银瓜子换硬币
                Gift_TS: 0,//自动送礼（定时）
                GiftInterval_TS: 0,//自动送礼（间隔）
                MobileHeartBeat_TS: 0,//移动端心跳
                LittleHeart_TS: 0//小心心
            },
            CONFIG: {},
            CACHE: {},
            GIFT_COUNT: {
                COUNT: 0,
                SILVER_COUNT: 0,
                CLEAR_TS: 0,
            },
            init: () => {
                try {
                    BAPI.setCommonArgs(Live_info.bili_jct);// 设置token
                } catch (err) {
                    console.error(`[${NAME}]`, err);
                    return;
                }
                let p = $.Deferred();
                try {
                    MY_API.loadConfig().then(() => {
                        MY_API.chatLog('脚本载入配置成功', 'success');
                        p.resolve()
                    });
                } catch (e) {
                    console.error('API初始化出错', e);
                    MY_API.chatLog('API初始化出错', 'error');
                    p.reject()
                }
                try {
                    MY_API.loadCache().then(() => {
                        window.toast('CACHE载入成功', 'success')
                        p.resolve()
                    });
                } catch (e) {
                    console.error('CACHE初始化出错', e);
                    window.toast('CACHE初始化出错', 'error')
                    p.reject()
                }

                setTimeout(() => {
                    MY_API.TreasureBox.init();
                }, 5750);

                return p;
            },
            loadConfig: () => {//加载配置函数
                let p = $.Deferred();
                try {
                    let config = JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));
                    $.extend(true, MY_API.CONFIG, MY_API.CONFIG_DEFAULT);
                    for (let item in MY_API.CONFIG) {
                        if (!MY_API.CONFIG.hasOwnProperty(item)) continue;
                        if (config[item] !== undefined && config[item] !== null) MY_API.CONFIG[item] = config[item];
                    }
                    MY_API.loadGiftCount();//载入礼物统计
                    p.resolve()
                } catch (e) {
                    MYDEBUG('API载入配置失败，加载默认配置', e);
                    MY_API.setDefaults();
                    p.reject()
                }
                return p
            },
            loadCache: () => {//加载CACHE
                let p = $.Deferred();
                try {
                    let cache = JSON.parse(localStorage.getItem(`${NAME}_CACHE`));
                    $.extend(true, MY_API.CACHE, MY_API.CACHE_DEFAULT);
                    for (let item in MY_API.CACHE) {
                        if (!MY_API.CACHE.hasOwnProperty(item)) continue;
                        if (cache[item] !== undefined && cache[item] !== null) MY_API.CACHE[item] = cache[item];
                    }
                    p.resolve()
                } catch (e) {
                    MYDEBUG('CACHE载入配置失败，加载默认配置', e);
                    MY_API.setDefaults();
                    p.reject()
                }
                return p
            },
            newMessage: (version) => {
                try {
                    let cache = localStorage.getItem(`${NAME}_NEWMSG_CACHE`);
                    if ((cache == undefined || cache == null || cache != '4.1.4') &&
                        version == '4.1.4') { //更新公告时需要修改
                        layer.open({
                            title: `${version}更新提示`,
                            content: `因为技术原因，现在改为用flash播放的方式拦截直播流。
                            如果想要用脚本挂小心心，请禁用flash（大多数浏览器默认禁用）。
                            距离flash被淘汰还有几个月的时间，在此期间我会再想想其它方法。
                            如果你有好的想法欢迎反馈。`
                        });
                        localStorage.setItem(`${NAME}_NEWMSG_CACHE`, version);
                    }
                } catch (e) {
                    MYDEBUG('提示信息CACHE载入失败', e);
                }
            },
            saveConfig: () => {//保存配置函数
                try {
                    localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                    MY_API.chatLog('配置已保存');
                    MYDEBUG('MY_API.CONFIG', MY_API.CONFIG);
                    return true
                } catch (e) {
                    MYDEBUG('API保存出错', e);
                    return false
                }
            },
            saveCache: (logswitch) => {//保存配置函数
                try {
                    localStorage.setItem(`${NAME}_CACHE`, JSON.stringify(MY_API.CACHE));
                    if (logswitch != false) {
                        MYDEBUG('CACHE已保存', MY_API.CACHE)
                    };
                    return true
                } catch (e) {
                    MYDEBUG('CACHE保存出错', e);
                    return false
                }
            },
            setDefaults: () => {//重置配置函数
                MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
                MY_API.CACHE = MY_API.CACHE_DEFAULT;
                MY_API.saveConfig();
                MY_API.saveCache();
                MY_API.chatLog('配置和CACHE已重置为默认。3秒后刷新页面');
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
            },
            ReDoDailyTasks: () => {
                window.toast('3秒后再次执行所有任务', 'info')
                setTimeout(() => {
                    MY_API.CACHE = MY_API.CACHE_DEFAULT;
                    MY_API.GroupSign.run();//应援团签到
                    MY_API.DailyReward.run();//每日任务
                    MY_API.LiveReward.run();//直播每日任务
                    MY_API.Exchange.runS2C();//银瓜子换硬币
                    MY_API.TreasureBox.run();//领宝箱
                    MY_API.Gift.run();//送礼物
                    MY_API.LITTLE_HEART.run();//小心心
                    MY_API.MobileHeartBeat.run();//移动端心跳
                }, 3000);
            },
            loadGiftCount: () => {//读取礼物数量
                try {
                    let config = JSON.parse(localStorage.getItem(`${NAME}_GIFT_COUNT`));
                    for (let item in MY_API.GIFT_COUNT) {
                        if (!MY_API.GIFT_COUNT.hasOwnProperty(item)) continue;
                        if (config[item] !== undefined && config[item] !== null) MY_API.GIFT_COUNT[item] = config[item];
                    }
                    MYDEBUG('MY_API.GIFT_COUNT', MY_API.GIFT_COUNT);
                } catch (e) {
                    MYDEBUG('读取统计失败', e);
                }
            },
            saveGiftCount: () => {
                try {
                    localStorage.setItem(`${NAME}_GIFT_COUNT`, JSON.stringify(MY_API.GIFT_COUNT));
                    MYDEBUG('统计保存成功', MY_API.GIFT_COUNT);
                    return true
                } catch (e) {
                    MYDEBUG('统计保存出错', e);
                    return false
                }
            },
            addGift: (count) => {
                MY_API.GIFT_COUNT.COUNT += count;
                $('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);
                MY_API.saveGiftCount();
            },
            addSilver: (count) => {
                MY_API.GIFT_COUNT.SILVER_COUNT += (count);
                $('#giftCount span:eq(1)').text(MY_API.GIFT_COUNT.SILVER_COUNT);
                MY_API.saveGiftCount();
            },
            removeUnnecessary: () => {//移除不必要的页面元素
                let unnecessaryList = [
                    '#my-dear-haruna-vm',//2233
                    '.activity-entry',//活动入口
                    '.bilibili-live-player'
                ];
                const removeUntiSucceed = (settingName, list_id) => {
                    if (MY_API.CONFIG[settingName] === true) {
                        setInterval(() => {
                            if ($(unnecessaryList[list_id]).length > 0) {
                                $(unnecessaryList[list_id]).remove();
                            } else {
                                return
                            }
                        }, 200);
                    }
                };
                const mute = () => {
                    window.localStorage["videoVolume"] = 0;
                    if (!!!window.localStorage["videoVolume"]) {
                        delayCall(() => mute, 200);
                    }
                };
                if(MY_API.CONFIG.LITTLE_HEART) mute();
                removeUntiSucceed('REMOVE_ELEMENT_2233', 0);
                removeUntiSucceed('REMOVE_ELEMENT_activity', 1);
                removeUntiSucceed('REMOVE_ELEMENT_player', 2);
            },
            creatSetBox: () => {//创建设置框
                const eleList = ['.chat-history-list', '.attention-btn-ctnr', '.live-player-mounter']//确保必要元素已加载
                for (const ele of eleList) {
                    if ($(ele).length == 0) {
                        return delayCall(() => MY_API.creatSetBox(), 200);
                    }
                }
                //添加按钮
                const btnmsg = msgHide == 'hide' ? '显示窗口和提示信息' : '隐藏窗口和提示信息';
                let btn = $(`<button style="display: inline-block; float: left; margin-right: 7px;background-color: #23ade5;color: #fff;border-radius: 4px;border: none; padding:4px; cursor: pointer;box-shadow: 1px 1px 2px #00000075;" id="hiderbtn">${btnmsg}<br></button>`);

                btn.click(() => {
                    if (msgHide == 'show') {//false 显示=>隐藏
                        msgHide = 'hide';
                        localStorage.setItem(`${NAME}_msgHide`, msgHide);
                        $('.igiftMsg').hide();
                        div.hide();
                        $('.link-toast').hide();
                        let ct = $('.chat-history-list');
                        ct.animate({ scrollTop: 0 }, 0);
                        setTimeout(() => { ct.animate({ scrollTop: ct.prop("scrollHeight") }, 10) }, 100);
                        document.getElementById('hiderbtn').innerHTML = "显示窗口和提示信息";
                    }
                    else {
                        msgHide = 'show';
                        localStorage.setItem(`${NAME}_msgHide`, msgHide);
                        $('.igiftMsg').show();
                        $('.link-toast').show();
                        div.show();
                        let ct = $('.chat-history-list');
                        ct.animate({ scrollTop: ct.prop("scrollHeight") }, 0);
                        document.getElementById('hiderbtn').innerHTML = "隐藏窗口和提示信息";
                    }
                });
                $('.attention-btn-ctnr').append(btn);
                let div = $('<div>');
                let settingTableHeight = $('.live-player-mounter').height()
                div.css({
                    'width': 'auto',
                    'height': settingTableHeight,
                    'position': 'absolute',
                    'top': '-2px',
                    'right': '0px',
                    'background': '#F0F0F0',
                    'padding': '10px',
                    'z-index': '10001',
                    'border-radius': '4px',
                    'overflow': 'scroll',
                    'line-height': '15px'
                });
                div.append(`
                <div id='allsettings'>
                <fieldset class="igiftMsg_fs">
                    <legend style="color: black">今日统计</legend>
                    <div id="giftCount" style="font-size: large; text-shadow: 1px 1px #00000066; color: blueviolet;">
                        辣条&nbsp;<span>${MY_API.GIFT_COUNT.COUNT}</span>
                        银瓜子&nbsp;<span>${MY_API.GIFT_COUNT.SILVER_COUNT}万</span>
                        <button style="font-size: small" class="igiftMsg_btn" data-action="save">保存所有设置</button>
                    </div>
                </fieldset>
                <div id="left_fieldset" style="float:left;">
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">抽奖设置</legend>
                        <div data-toggle="RANDOM_DELAY">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                <input style="vertical-align: text-top;" type="checkbox">抽奖附加随机延迟
                                <input class="RND_DELAY_START igiftMsg_input" style="width: 30px;vertical-align: top;" type="text">~
                                <input class="RND_DELAY_END igiftMsg_input" style="width: 30px;vertical-align: top;" type="text">s
                            </label>
                        </div>
                        <div data-toggle="TIME_AREA_DISABLE">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                <input style="vertical-align: text-top;" type="checkbox">启用
                                <input class="startHour igiftMsg_input" style="width: 20px;" type="text">点
                                <input class="startMinute igiftMsg_input" style="width: 20px;" type="text">分至
                                <input class="endHour igiftMsg_input" style="width: 20px;" type="text">点
                                <input class="endMinute igiftMsg_input" style="width: 20px;" type="text">分不抽奖(24小时制)
                            </label>
                        </div>
                        <div data-toggle="RANDOM_SKIP">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                随机跳过礼物(0到100,为0则不跳过)<input class="per igiftMsg_input" style="width: 30px;" type="text">%
                            </label>
                        </div>
                        <div data-toggle="MAX_GIFT">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                当天最多抢辣条数量<input class="num igiftMsg_input" style="width: 100px;" type="text">
                            </label>
                        </div>
                        <div data-toggle="RANDOM_SEND_DANMU">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                抽奖时活跃弹幕发送概率(0到5,为0则不发送)<input class="per igiftMsg_input" style="width: 30px;" type="text">%
                            </label>
                        </div>
                        <div data-toggle="CHECK_HOUR_ROOM_INTERVAL">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                检查小时榜间隔时间<input class="num igiftMsg_input" style="width: 25px;" type="text">秒
                            </label>
                        </div>
                        <div data-toggle="FORCE_LOTTERY" style="line-height: 20px">
                        <label style="margin: 5px auto; color: red;">
                            <input style="vertical-align: text-top;" type="checkbox">访问被拒绝后强制重复抽奖(最多5次)
                        </label>
                    </div>
                    </fieldset>
            
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">每日任务设置</legend>
                        <div data-toggle="LOGIN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            登陆
                        </div>
                        <div data-toggle="WATCH" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            观看视频
                        </div>
                        <div data-toggle="COIN" style=" color: black">
                            <label style="cursor: pointer">
                                <input style="cursor: pointer; vertical-align: text-top;" type="checkbox">
                                自动投币<input class="coin_number igiftMsg_input" style="width: 40px;" type="text">个(0-5)
                            </label>
                        </div>
                        <div data-toggle="COIN_TYPE" style=" color: black">
                            <div data-toggle="COIN_UID">
                            <input style="vertical-align: text-top;" type="radio" name="COIN_TYPE">
                            给用户(UID:<input class="num igiftMsg_input" style="width: 80px;" type="text">)
                            的视频投币
                            </div>
                            <div data-toggle="COIN_DYN">
                                <input style="vertical-align: text-top;" type="radio" name="COIN_TYPE">
                                给动态中的的视频投币
                            </div>
                        </div>
                        <div data-toggle="SHARE" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            分享视频
                        </div>
                        <div data-toggle="SILVER2COIN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            银瓜子换硬币
                        </div>
                        <div data-toggle="LIVE_SIGN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            直播区签到
                        </div>
                        <div data-toggle="AUTO_GROUP_SIGN" style=" color: darkgreen">
                            <input style="vertical-align: text-top;" type="checkbox">
                            应援团签到
                        </div>
                        <div data-toggle="AUTO_TREASUREBOX" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            自动领银瓜子宝箱
                        </div>
                        <div data-toggle="MOBILE_HEARTBEAT" style=" color: gray">
                        <input style="vertical-align: text-top;" type="checkbox">
                        模拟移动端心跳
                        </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">自动送礼设置</legend>
                        <div data-toggle="AUTO_GIFT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            自动送礼
                        </div>
            
                        <div data-toggle="AUTO_GIFT_ROOMID" style=" color: purple">
                            优先送礼房间
                            <input class="num igiftMsg_input" style="width: 150px;" type="text">
                        </div>
            
                        <div data-toggle="EXCLUDE_ROOMID" style=" color: purple">
                            不送礼房间
                            <input class="num igiftMsg_input" style="width: 150px;" type="text">
                        </div>
                        <div data-toggle="GIFT_INTERVAL" style=" color: black">
                            <input style="vertical-align: text-top;" type="radio" name="GIFT_TYPE">
                            间隔
                            <input class="num igiftMsg_input" style="width: 30px;" type="text">
                            分钟送礼
                        </div>
                        <div data-toggle="GIFT_SEND_TIME" style=" color: purple">
                            <input style="vertical-align: text-top;" type="radio" name="GIFT_TYPE">
                            定时送礼<br>
                            送礼时间
                            <input class="Hour igiftMsg_input" style="width: 20px;" type="text">点
                            <input class="Minute igiftMsg_input" style="width: 20px;" type="text">分
                            <button style="font-size: small" class="igiftMsg_btn" data-action="sendGiftNow">立刻开始送礼</button>
                        </div>
                        
                        <div data-toggle="GIFT_LIMIT" style=" color: purple">
                            礼物到期时间
                            <input class="num igiftMsg_input" style="width: 20px;" type="text">
                            天
                        </div>
                        <div data-toggle="GIFT_SORT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            送礼优先高等级粉丝牌
                        </div>
                        <div data-toggle="SEND_ALL_GIFT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            送满全部勋章
                        </div>
                        <div data-toggle="SPARE_GIFT_ROOM" style=" color: black">
                            剩余礼物送礼直播间：
                            <input class="num igiftMsg_input" type="text" style="width: 100px;">
                        </div>
                        <div data-toggle="SPARE_GIFT_UID" style=" color: black">
                            剩余礼物送礼直播间拥有者UID：
                            <input class="num igiftMsg_input" type="text" style="width: 100px;">
                        </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">节奏风暴设置</legend>
                        <div data-toggle="STORM" style="line-height: 15px">
                            <label style="margin: 5px auto; color: #ff5200">
                                <input style="vertical-align: text-top;" type="checkbox">参与节奏风暴
                            </label>
                        </div>
                        <div data-toggle="STORM_QUEUE_SIZE" style="color: black">
                            允许同时参与的节奏风暴次数：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                        </div>
                        <div data-toggle="STORM_MAX_COUNT" style="color: black">
                            单个风暴最大尝试次数：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                        </div>
                        <div data-toggle="STORM_ONE_LIMIT" style="color: black">
                            单个风暴参与次数间隔：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                            毫秒
                        </div>
                    </fieldset>
                </div>
            
            
            
                <div id="right_fieldset" style="float:left;">
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">购买粉丝勋章</legend>
                        <div data-toggle="BUY_MEDAL" style="color: black; line-height: 15px">
                        输入粉丝勋章对应房间号：<input class="num igiftMsg_input" type="text" value = ${Live_info.room_id} onclick="select();" style="width: 70px">
                        <button  class="igiftMsg_btn" data-action="buy_medal">点击购买勋章</button>
                        （花费20硬币）
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">小心心</legend>
                        <div data-toggle="LITTLE_HEART" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox"> 自动获取小心心
                            </label>
                        </div>
                        <div data-toggle="MAX_TAB" style="line-height: 15px">
                        <label style="margin: 5px auto; color: black">
                            打开窗口数量上限
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                        </label>
                    </div>
                        <div data-toggle="LIGHT_MEDALS" style=" color: purple">
                            自动点亮勋章房间号
                        <input class="num igiftMsg_input" style="width: 300px;" type="text">
                    </div>
                    <div data-toggle="LIGHT_METHOD" style="line-height: 15px; color: black; display:inline">
                        勋章点亮模式：&nbsp;&nbsp;
                        <div data-toggle="LIGHT_WHITE" style="color: black; display:inline">
                            <input style="vertical-align: text-top;" type="radio" name="LIGHT_TYPE">
                            白名单
                        </div>
                        <div data-toggle="LIGHT_BLACK" style="color: black; display:inline">
                            &nbsp;
                            <input style="vertical-align: text-top;" type="radio" name="LIGHT_TYPE">
                            黑名单
                        </div>
                    </div>
                    <div data-toggle="FORCE_LIGHT" style="line-height: 15px">
                    <label style="margin: 5px auto; color: black">
                        <input style="vertical-align: text-top;" type="checkbox"> 点亮勋章时忽略亲密度上限
                    </label>
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">内容屏蔽</legend>
                        <div data-toggle="REMOVE_ELEMENT_2233" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox"> 移除2233模型
                            </label>
                        </div>
                        <div data-toggle="REMOVE_ELEMENT_activity" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox"> 移除活动入口
                            </label>
                        </div>
                        <div data-toggle="BLOCK_LIVE_VIDEO" style="line-height: 15px">
                        <label style="margin: 5px auto; color: black">
                            <input style="vertical-align: text-top;" type="checkbox"> 拦截挂小心心打开窗口的直播流
                        </label>
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs" style="line-height: 15px">
                        <legend style="color: black">其他设置</legend>
                        <div data-toggle="TIME_RELOAD" style="color: black">
                            本直播间刷新时间：
                            <input class="delay-seconds igiftMsg_input" type="text" style="width: 30px;">分
                        </div>
                        <div data-toggle="IN_TIME_RELOAD_DISABLE" style="line-height: 15px">
                            <label style="margin: 5px auto; color: darkgreen">
                                <input style="vertical-align: text-top;" type="checkbox">不抽奖时段不重载直播间
                            </label>
                        </div>
                        <div id="resetArea">
                            <button data-action="reset" style="color: red;" class="igiftMsg_btn">重置所有为默认</button>
                            <button data-action="redo_dailyTasks" style="color: red;" class="igiftMsg_btn">再次执行所有任务</button>
                            <button style="font-size: small" class="igiftMsg_btn" data-action="countReset">重置统计</button>
                        </div>
            
                    </fieldset>
                    <label style="color: darkblue; font-size:large;">
                        v${GM_info.script.version} <a href="https://github.com/andywang425/BLTH"
                            target="_blank">更多说明和更新日志见github上的项目说明(点我)</a>
                    </label>
                </div>
            </div>
    `);
                if (msgHide == 'show') {
                    $('.live-player-mounter').append(div);
                } else {
                    $('.live-player-mounter').append(div.hide());
                }

                //显示对应配置状态
                div.find('div[data-toggle="MAX_TAB"] .num').val(parseInt(MY_API.CONFIG.MAX_TAB).toString());
                div.find('div[data-toggle="GIFT_INTERVAL"] .num').val(parseInt(MY_API.CONFIG.GIFT_INTERVAL).toString());
                div.find('div[data-toggle="LIGHT_MEDALS"] .num').val(MY_API.CONFIG.LIGHT_MEDALS.toString());
                div.find('div[data-toggle="STORM_MAX_COUNT"] .num').val(parseInt(MY_API.CONFIG.STORM_MAX_COUNT).toString());
                div.find('div[data-toggle="STORM_ONE_LIMIT"] .num').val(parseInt(MY_API.CONFIG.STORM_ONE_LIMIT).toString());
                div.find('div[data-toggle="STORM_QUEUE_SIZE"] .num').val(parseInt(MY_API.CONFIG.STORM_QUEUE_SIZE).toString());
                div.find('div[data-toggle="SPARE_GIFT_UID"] .num').val(MY_API.CONFIG.SPARE_GIFT_UID.toString());
                div.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val(MY_API.CONFIG.SPARE_GIFT_ROOM.toString());
                div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val(parseInt(MY_API.CONFIG.TIME_RELOAD).toString());
                div.find('div[data-toggle="RANDOM_SKIP"] .per').val((parseFloat(MY_API.CONFIG.RANDOM_SKIP)).toString());
                div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val((parseFloat(MY_API.CONFIG.RANDOM_SEND_DANMU)).toString());
                div.find('div[data-toggle="MAX_GIFT"] .num').val((parseInt(MY_API.CONFIG.MAX_GIFT)).toString());
                div.find('div[data-toggle="COIN"] .coin_number').val(parseInt(MY_API.CONFIG.COIN_NUMBER).toString());
                div.find('div[data-toggle="COIN_UID"] .num').val(parseInt(MY_API.CONFIG.COIN_UID).toString());
                div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val(parseFloat(MY_API.CONFIG.RND_DELAY_START).toString());
                div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val(parseFloat(MY_API.CONFIG.RND_DELAY_END).toString());
                div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val(parseInt(MY_API.CONFIG.TIME_AREA_START_H0UR).toString());
                div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val(parseInt(MY_API.CONFIG.TIME_AREA_END_H0UR).toString());
                div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val(parseInt(MY_API.CONFIG.TIME_AREA_START_MINUTE).toString());
                div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val(parseInt(MY_API.CONFIG.TIME_AREA_END_MINUTE).toString());
                div.find('div[data-toggle="CHECK_HOUR_ROOM_INTERVAL"] .num').val(parseInt(MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL).toString());
                div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val((MY_API.CONFIG.AUTO_GIFT_ROOMID).toString());
                div.find('div[data-toggle="EXCLUDE_ROOMID"] .num').val((MY_API.CONFIG.EXCLUDE_ROOMID).toString());
                div.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val(MY_API.CONFIG.GIFT_SEND_HOUR.toString());
                div.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val(MY_API.CONFIG.GIFT_SEND_MINUTE.toString());
                div.find('div[data-toggle="GIFT_LIMIT"] .num').val(parseInt(MY_API.CONFIG.GIFT_LIMIT).toString());

                function saveAction() {
                    //TIME_AREA_DISABLE（控制输入的两个小时两个分钟）
                    let val = undefined;
                    let valArray = undefined;
                    let val1 = MY_API.CONFIG.TIME_AREA_START_H0UR = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val());
                    let val2 = MY_API.CONFIG.TIME_AREA_END_H0UR = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val());
                    let val3 = MY_API.CONFIG.TIME_AREA_START_MINUTE = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val());
                    let val4 = MY_API.CONFIG.TIME_AREA_END_MINUTE = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val());
                    if (val1 < 0 || val2 < 0 || val3 < 0 || val4 < 0) {
                        MY_API.chatLog("[定时休眠]数据小于0", 'warning');
                        return
                    }
                    else if (val1 >= 24 || val2 >= 24 || val3 >= 60 || val4 >= 60) {
                        MY_API.chatLog("[定时休眠]时间错误", 'warning');
                        return
                    }
                    MY_API.CONFIG.TIME_AREA_START_H0UR = val1;
                    MY_API.CONFIG.TIME_AREA_END_H0UR = val2;
                    MY_API.CONFIG.TIME_AREA_START_MINUTE = val3;
                    MY_API.CONFIG.TIME_AREA_END_MINUTE = val4;
                    //RANDOM_SKIP save
                    val = parseFloat(div.find('div[data-toggle="RANDOM_SKIP"] .per').val());
                    if (val < 0 || val > 100) {
                        MY_API.chatLog('[随机跳过礼物]数据小于0或大于100', 'warning');
                        return
                    }
                    MY_API.CONFIG.RANDOM_SKIP = val;
                    //RANDOM_SEND_DANMU save
                    val = parseFloat(div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val());
                    if (val > 5) {
                        MY_API.chatLog("[活跃弹幕]为维护直播间弹幕氛围,弹幕发送概率不得大于5%", 'warning');
                        return
                    }
                    else if (val < 0) {
                        MY_API.chatLog("[活跃弹幕]数据小于0", 'warning');
                        return
                    }
                    MY_API.CONFIG.RANDOM_SEND_DANMU = val;
                    //MAX_GIFT save
                    val = parseInt(div.find('div[data-toggle="MAX_GIFT"] .num').val());
                    MY_API.CONFIG.MAX_GIFT = val;
                    //TIME_RELOAD save
                    val = parseInt(div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val());
                    if (val <= 0 || val > 10000) {
                        MY_API.chatLog('[直播间重载时间]数据小于等于0或大于10000', 'warning');
                        return
                    }
                    MY_API.CONFIG.TIME_RELOAD = val;
                    //RANDOM_DELAY
                    val = parseFloat(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val());
                    val2 = parseFloat(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val());

                    if (val < 0 || val2 > 100) {
                        MY_API.chatLog('[抽奖延时]数据小于0或大于100', 'warning');
                        return
                    }
                    else if (val2 <= val) {
                        MY_API.chatLog('[抽奖延时]数据大小关系不正确', 'warning');
                        return
                    }
                    MY_API.CONFIG.RND_DELAY_START = val;
                    MY_API.CONFIG.RND_DELAY_END = val2;
                    //COIN
                    val = parseInt(div.find('div[data-toggle="COIN"] .coin_number').val());
                    if (val < 0 || val > 5) {
                        MY_API.chatLog("[自动投币]数据小于0或大于5", 'warning');
                        return
                    }
                    MY_API.CONFIG.COIN_NUMBER = val;
                    //CHECK_HOUR_ROOM_INTERVAL
                    val = parseInt(div.find('div[data-toggle="CHECK_HOUR_ROOM_INTERVAL"] .num').val());
                    if (val <= 0) {
                        MY_API.chatLog("[检查小时榜间隔]数据小于等于0", 'warning');
                        return
                    }
                    MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL = val;
                    //AUTO_GIFT_ROOMID
                    val = div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val();
                    valArray = val.split(",");
                    for (let i = 0; i < valArray.length; i++) {
                        if (valArray[i] === '') {
                            valArray[i] = 0;
                        }
                    };
                    val = valArray.join(",");
                    MY_API.CONFIG.AUTO_GIFT_ROOMID = val;
                    //EXCLUDE_ROOMID
                    val = div.find('div[data-toggle="EXCLUDE_ROOMID"] .num').val();
                    valArray = val.split(",");
                    for (let i = 0; i < valArray.length; i++) {
                        if (valArray[i] === '') {
                            valArray[i] = 0;
                        }
                    };
                    val = valArray.join(",");
                    MY_API.CONFIG.EXCLUDE_ROOMID = val;
                    //GIFT_LIMIT
                    val = parseInt(div.find('div[data-toggle="GIFT_LIMIT"] .num').val());
                    MY_API.CONFIG.GIFT_LIMIT = val;
                    //GIFT_SEND_TIME
                    val1 = parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val());
                    val2 = parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val());
                    if (val1 < 0 || val2 < 0) {
                        MY_API.chatLog("[送礼时间]数据小于0", 'warning');
                        return
                    }
                    else if (val1 >= 24 || val2 >= 60) {
                        MY_API.chatLog("[送礼时间]时间错误", 'warning');
                        return
                    }
                    MY_API.CONFIG.GIFT_SEND_HOUR = val1;
                    MY_API.CONFIG.GIFT_SEND_MINUTE = val2;
                    //SPARE_GIFT_ROOM
                    val = div.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val();
                    MY_API.CONFIG.SPARE_GIFT_ROOM = val;
                    //SPARE_GIFT_UID
                    val = div.find('div[data-toggle="SPARE_GIFT_UID"] .num').val();
                    MY_API.CONFIG.SPARE_GIFT_UID = val;
                    //STORM_QUEUE_SIZE
                    val = parseInt(div.find('div[data-toggle="STORM_QUEUE_SIZE"] .num').val());
                    MY_API.CONFIG.STORM_QUEUE_SIZE = val;
                    //STORM_MAX_COUNT
                    val = parseInt(div.find('div[data-toggle="STORM_MAX_COUNT"] .num').val());
                    MY_API.CONFIG.STORM_MAX_COUNT = val;
                    //STORM_ONE_LIMIT
                    val = parseInt(div.find('div[data-toggle="STORM_ONE_LIMIT"] .num').val());
                    MY_API.CONFIG.STORM_ONE_LIMIT = val;
                    //COIN_UID
                    val = parseInt(div.find('div[data-toggle="COIN_UID"] .num').val());
                    MY_API.CONFIG.COIN_UID = val;
                    //LIGHT_MEDALS
                    val = div.find('div[data-toggle="LIGHT_MEDALS"] .num').val();
                    MY_API.CONFIG.LIGHT_MEDALS = val;
                    //MAX_TAB
                    val = parseInt(div.find('div[data-toggle="MAX_TAB"] .num').val());
                    MY_API.CONFIG.MAX_TAB = val;
                    MY_API.saveConfig();
                };
                function buyFanMedal(room_id) {
                    return BAPI.live_user.get_anchor_in_room(room_id).then(function (response) {
                        MYDEBUG('API.live_user.get_anchor_in_room response', response)
                        if (response.code === 0) {
                            layer.confirm(`是否消耗20硬币购买UP主【${response.data.info.uname}】的粉丝勋章？`, {
                                title: '购买勋章',
                                btn: ['是', '否'] //按钮
                            }, function () {
                                return BAPI.link_group.buy_medal(response.data.info.uid).then((re) => {
                                    MYDEBUG('API.link_group.buy_medal re', re);
                                    if (re.code === 0) {
                                        layer.msg('购买成功', {
                                            time: 2000,
                                            icon: 1
                                        });
                                    } else {
                                        layer.msg(`购买失败 ${re.message}`, {
                                            time: 2500,
                                            icon: 2
                                        });
                                    }
                                })
                            }, function () {
                                layer.msg('已取消购买', {
                                    time: 2000
                                });
                            });

                        } else {
                            layer.msg(`检查房间出错 ${response.message}`, {
                                time: 2500
                            });
                        }
                    });
                }
                div.find('div[id="giftCount"] [data-action="save"]').click(() => {//保存按钮
                    saveAction();
                });
                div.find('div[data-toggle="BUY_MEDAL"] [data-action="buy_medal"]').click(function () {//购买勋章
                    const room_id = parseInt(div.find('div[data-toggle="BUY_MEDAL"] .num').val());
                    buyFanMedal(room_id);
                });

                div.find('button[data-action="reset"]').click(() => {//重置按钮
                    MY_API.setDefaults();
                });
                div.find('button[data-action="checkUpdate"]').click(() => {//检查更新按钮
                    MY_API.checkUpdate();
                });
                div.find('button[data-action="redo_dailyTasks"]').click(() => {//重置每日任务状态
                    MY_API.ReDoDailyTasks();
                });
                div.find('#resetArea [data-action="countReset"]').click(() => {//清空统计数据按钮
                    MY_API.GIFT_COUNT = {
                        COUNT: 0,
                        SILVER_COUNT: 0,
                        CLEAR_TS: 0,
                    };
                    MY_API.saveGiftCount();
                    $('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);
                    $('#giftCount span:eq(1)').text(MY_API.GIFT_COUNT.SILVER_COUNT);
                    MY_API.chatLog('已重置统计数据');
                });
                div.find('button[data-action="sendGiftNow"]').click(() => {//立刻开始送礼
                    SEND_GIFT_NOW = true;
                    MY_API.Gift.run();
                });
                let checkList = [
                    'RANDOM_DELAY',
                    'TIME_AREA_DISABLE',
                    'AUTO_GROUP_SIGN',
                    'FORCE_LOTTERY',
                    'LOGIN',
                    'WATCH',
                    'COIN',
                    'SHARE',
                    'SILVER2COIN',
                    'LIVE_SIGN',
                    'IN_TIME_RELOAD_DISABLE',
                    'AUTO_TREASUREBOX',
                    'IN_TIME_RELOAD_DISABLE',
                    "AUTO_GIFT",
                    "GIFT_SORT",
                    "SEND_ALL_GIFT",
                    'MOBILE_HEARTBEAT',
                    'STORM',
                    'LITTLE_HEART',
                    'REMOVE_ELEMENT_2233',
                    'REMOVE_ELEMENT_activity',
                    'BLOCK_LIVE_VIDEO',
                    "FORCE_LIGHT"
                ];
                for (let i of checkList) {//绑定所有checkbox事件
                    let input = div.find(`div[data-toggle="${i}"] input:checkbox`);
                    if (MY_API.CONFIG[i]) input.attr('checked', '');
                    input.change(function () {
                        MY_API.CONFIG[i] = $(this).prop('checked');
                        MY_API.saveConfig();
                        if (MY_API.CONFIG.BLOCK_LIVE_VIDEO) {
                            localStorage.setItem(`${NAME}_block_live`, 'block');
                        } else {
                            localStorage.setItem(`${NAME}_block_live`, 'pass');
                        }
                    });
                };
                $('input:text').bind('keydown', function (event) {//绑定回车保存
                    if (event.keyCode == "13") {
                        saveAction();
                    }
                });
                if (MY_API.CONFIG.COIN_TYPE == 'COIN_DYN') {
                    $("div[data-toggle='COIN_DYN'] input:radio").attr('checked', '');
                } else {
                    $("div[data-toggle='COIN_UID'] input:radio").attr('checked', '');
                };
                if (MY_API.CONFIG.LIGHT_METHOD == 'LIGHT_WHITE') {
                    $("div[data-toggle='LIGHT_WHITE'] input:radio").attr('checked', '');
                } else {
                    $("div[data-toggle='LIGHT_BLACK'] input:radio").attr('checked', '');
                };
                if (MY_API.CONFIG.GIFT_METHOD == 'GIFT_INTERVAL') {
                    $("div[data-toggle='GIFT_INTERVAL'] input:radio").attr('checked', '');
                } else {
                    $("div[data-toggle='GIFT_SEND_TIME'] input:radio").attr('checked', '');
                };

                $("input:radio[name='COIN_TYPE']").change(function () { //投币模式变化
                    let a = $("div[data-toggle='COIN_DYN'] input:radio").is(':checked');
                    if (a == true) {
                        MY_API.CONFIG.COIN_TYPE = 'COIN_DYN';
                    }
                    else {
                        MY_API.CONFIG.COIN_TYPE = 'COIN_UID';
                    }
                    MY_API.saveConfig();
                });
                $("input:radio[name='LIGHT_TYPE']").change(function () { //点亮勋章模式变化
                    let a = $("div[data-toggle='LIGHT_WHITE'] input:radio").is(':checked');
                    if (a == true) {
                        MY_API.CONFIG.LIGHT_METHOD = 'LIGHT_WHITE';
                    }
                    else {
                        MY_API.CONFIG.LIGHT_METHOD = 'LIGHT_BLACK';
                    }
                    MY_API.saveConfig();
                });
                $("input:radio[name='GIFT_TYPE']").change(function () { //送礼模式变化
                    let a = $("div[data-toggle='GIFT_INTERVAL'] input:radio").is(':checked');
                    if (a == true) {
                        MY_API.CONFIG.GIFT_METHOD = 'GIFT_INTERVAL';
                    }
                    else {
                        MY_API.CONFIG.GIFT_METHOD = 'GIFT_SEND_TIME';
                    }
                    MY_API.saveConfig();
                });
            },

            chatLog: function (text, type = 'info') {//自定义提示
                let div = $("<div class='igiftMsg'>");
                let msg = $("<div>");
                let ct = $('#chat-history-list');
                let myDate = new Date();
                msg.text(text);
                div.text(myDate.toLocaleString());
                div.append(msg);
                div.css({
                    'text-align': 'center',
                    'border-radius': '4px',
                    'min-height': '30px',
                    'width': '256px',
                    'color': '#9585FF',
                    'line-height': '30px',
                    'padding': '0 10px',
                    'margin': '10px auto',
                });
                msg.css({
                    'word-wrap': 'break-word',
                    'width': '100%',
                    'line-height': '1em',
                    'margin-bottom': '10px',
                });
                switch (type) {
                    case 'warning':
                        div.css({
                            'border': '1px solid rgb(236, 221, 192)',
                            'color': 'rgb(218, 142, 36)',
                            'background': 'rgb(245, 235, 221) none repeat scroll 0% 0%',
                        });
                        break;
                    case 'success':
                        div.css({
                            'border': '1px solid rgba(22, 140, 0, 0.28)',
                            'color': 'rgb(69, 171, 69)',
                            'background': 'none 0% 0% repeat scroll rgba(16, 255, 0, 0.18)',
                        });
                        break;
                    case 'error':
                        div.css({
                            'border': '1px solid rgb(255, 46, 0)',
                            'color': 'white',
                            'background': 'none 0% 0% repeat scroll #ff4c4c',
                        });
                        break;
                    default:
                        div.css({
                            'border': '1px solid rgb(203, 195, 255)',
                            'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
                        });
                }
                if (msgHide == 'show') {//false
                    ct.find('#chat-items').append(div);//向聊天框加入信息  
                } else {
                    ct.find('#chat-items').append(div.hide());//向聊天框加入信息
                }
                ct.scrollTop(ct.prop("scrollHeight"));//滚动到底部
            },
            blocked: false,
            max_blocked: false,
            listen: (roomId, uid, area = '本直播间') => {
                BAPI.room.getConf(roomId).then((response) => {
                    //DanMuServerHost = response.data.host;
                    MYDEBUG(`获取弹幕服务器信息 ${area}`, response);
                    let wst = new BAPI.DanmuWebSocket(uid, roomId, response.data.host_server_list, response.data.token);
                    wst.bind((newWst) => {
                        wst = newWst;
                        MY_API.chatLog(`${area}弹幕服务器连接断开，尝试重连`, 'warning');
                    }, () => {
                        MY_API.chatLog(`——————连接弹幕服务器成功——————\n房间号: ${roomId} 分区: ${area}`
                            , 'success');
                    }, () => {
                        if (MY_API.blocked || MY_API.stormBlack) {
                            wst.close();
                            MY_API.chatLog(`进了小黑屋主动与弹幕服务器断开连接-${area}`, 'warning')
                        }
                        if (MY_API.max_blocked && !MY_API.CONFIG.STORM) {
                            wst.close();
                            MY_API.chatLog(`辣条最大值主动与弹幕服务器断开连接-${area}`, 'warning')
                        }
                    }, (obj) => {
                        if (inTimeArea(MY_API.CONFIG.TIME_AREA_START_H0UR, MY_API.CONFIG.TIME_AREA_END_H0UR, MY_API.CONFIG.TIME_AREA_START_MINUTE, MY_API.CONFIG.TIME_AREA_END_MINUTE) && MY_API.CONFIG.TIME_AREA_DISABLE) return;//当前是否在两点到八点 如果在则返回

                        MYDEBUG('弹幕公告' + area, obj);
                        switch (obj.cmd) {
                            case 'GUARD_MSG':
                                if (obj.roomid === obj.real_roomid) {
                                    MY_API.checkRoom(obj.roomid, area);
                                } else {
                                    MY_API.checkRoom(obj.roomid, area);
                                    MY_API.checkRoom(obj.real_roomid, area);
                                }
                                break;
                            case 'PK_BATTLE_SETTLE_USER':
                                if (!!obj.data.winner) {
                                    MY_API.checkRoom(obj.data.winner.room_id, area);
                                } else {
                                    MY_API.checkRoom(obj.data.my_info.room_id, area);
                                }
                                MY_API.checkRoom(obj.data.winner.room_id, area);
                                break;
                            case 'NOTICE_MSG':
                                switch (obj.msg_type) {
                                    case 1:// 系统
                                        break;
                                    case 2:
                                    case 3:// 舰队领奖
                                    case 4:// 登船
                                    case 8:// 礼物抽奖
                                        if (obj.roomid === obj.real_roomid) {
                                            MY_API.checkRoom(obj.roomid, area);
                                        } else {
                                            MY_API.checkRoom(obj.roomid, area);
                                            MY_API.checkRoom(obj.real_roomid, area);
                                        }
                                        break;
                                    /*case 4:
                                        // 登船
                                        break;*/
                                    case 5:
                                        // 获奖
                                        break;
                                    case 6:
                                        // 节奏风暴
                                        window.toast(`监控到房间 ${obj.roomid} 的节奏风暴`, 'info');
                                        MY_API.Storm.run(obj.roomid);
                                        break;
                                }
                                break;
                            case 'SPECIAL_GIFT':
                                //DEBUG(`DanmuWebSocket${area}(${roomid})`, str);
                                if (obj.data['39']) {
                                    switch (obj.data['39'].action) {
                                        case 'start':
                                            // 节奏风暴开始
                                            window.toast(`监控到房间 ${obj.roomid} 的节奏风暴`, 'info');
                                            MY_API.Storm.run(obj.roomid);
                                        case 'end':
                                        // 节奏风暴结束
                                    }
                                };
                                break;
                            default:
                                return;
                        }
                    });
                }, () => {
                    MY_API.chatLog('获取弹幕服务器地址错误', 'error')
                });
            },
            EntryRoom_list_history: {//进入房间历史记录缓存
                add: function (EntryRoom) {
                    let EntryRoom_list = [];
                    try {
                        let config = JSON.parse(localStorage.getItem(`${NAME}_EntryRoom_list`));
                        EntryRoom_list = [].concat(config.list);
                        EntryRoom_list.push(EntryRoom);
                        if (EntryRoom_list.length > 100) {
                            EntryRoom_list.splice(0, 50);//删除前50条数据
                        }
                        localStorage.setItem(`${NAME}_EntryRoom_list`, JSON.stringify({ list: EntryRoom_list }));
                        MYDEBUG(`${NAME}_EntryRoom_list_add`, EntryRoom_list);
                    } catch (e) {
                        EntryRoom_list.push(EntryRoom);
                        localStorage.setItem(`${NAME}_EntryRoom_list`, JSON.stringify({ list: EntryRoom_list }));
                    }
                },
                isIn: function (EntryRoom) {
                    let EntryRoom_list = [];
                    try {
                        let config = JSON.parse(localStorage.getItem(`${NAME}_EntryRoom_list`));
                        if (config === null) {
                            EntryRoom_list = [];
                        } else {
                            EntryRoom_list = [].concat(config.list);
                        }
                        MYDEBUG(`${NAME}_EntryRoom_list_read`, config);
                        return EntryRoom_list.indexOf(EntryRoom) > -1
                    } catch (e) {
                        localStorage.setItem(`${NAME}_EntryRoom_list`, JSON.stringify({ list: EntryRoom_list }));
                        MYDEBUG('读取' + `${NAME}_EntryRoom_list` + '缓存错误已重置');
                        return EntryRoom_list.indexOf(EntryRoom) > -1
                    }
                }
            },
            RoomId_list: [],
            err_roomId: [],
            auto_danmu_list: ["(=・ω・=)", "（￣▽￣）", "nice", "666", "kksk", "(⌒▽⌒)", "(｀・ω・´)", "╮(￣▽￣)╭", "(￣3￣)", "Σ( ￣□￣||)",
                "(^・ω・^ )", "_(:3」∠)_"],//共11个
            checkRoom: function (roomId, area = '本直播间') {
                if (MY_API.blocked || MY_API.max_blocked) {
                    return
                }
                if (MY_API.RoomId_list.indexOf(roomId) >= 0) {//防止重复检查直播间
                    return
                } else {
                    MY_API.RoomId_list.push(roomId);
                }
                if (!MY_API.EntryRoom_list_history.isIn(roomId)) {
                    BAPI.room.room_entry_action(roomId);//直播间进入记录
                    MY_API.EntryRoom_list_history.add(roomId);//加入列表
                }
                if (probability(MY_API.CONFIG.RANDOM_SEND_DANMU)) {//概率发活跃弹幕
                    BAPI.sendLiveDanmu(MY_API.auto_danmu_list[Math.floor(Math.random() * 12)], roomId).then((response) => {
                        MYDEBUG('弹幕发送返回信息', response);
                    })
                }//Math.floor(Math.random() * (max - min + 1) ) + min
                BAPI.xlive.lottery.check(roomId).then((re) => {
                    MY_API.RoomId_list.remove(roomId);//移除房间号
                    MYDEBUG('检查房间返回信息', re);
                    let data = re.data;
                    if (re.code === 0) {
                        let list;
                        if (data.gift) {
                            list = data.gift;
                            for (let i in list) {
                                if (!list.hasOwnProperty(i)) continue;
                                MY_API.creat_join(roomId, list[i], 'gift', area)
                            }
                        }
                        if (data.guard) {
                            list = data.guard;
                            for (let i in list) {
                                if (!list.hasOwnProperty(i)) continue;
                                MY_API.creat_join(roomId, list[i], 'guard', area)
                            }
                        }
                        if (data.pk) {
                            list = data.pk;
                            for (let i in list) {
                                if (!list.hasOwnProperty(i)) continue;
                                MY_API.creat_join(roomId, list[i], 'pk', area)
                            }
                        }

                    } else {
                        MY_API.chatLog(`[检查房间出错]${response.msg}`, 'error');
                        if (MY_API.err_roomId.indexOf(roomId) > -1) {
                            MYDEBUG(`[检查此房间出错多次]${roomId}${re.message}`);
                        }
                        else {
                            MY_API.err_roomId.push(roomId);
                            MY_API.checkRoom(roomId, area);
                            MYDEBUG(`[检查房间出错_重试一次]${roomId}${re.message}`);
                        }
                    }
                })

            },
            Id_list_history: {//礼物历史记录缓存
                add: function (id, type) {
                    let id_list = [];
                    try {
                        let config = JSON.parse(localStorage.getItem(`${NAME}_${type}Id_list`));
                        id_list = [].concat(config.list);
                        id_list.push(id);
                        if (id_list.length > 200) {
                            id_list.splice(0, 50);//删除前50条数据
                        }
                        localStorage.setItem(`${NAME}_${type}Id_list`, JSON.stringify({ list: id_list }));
                        MYDEBUG(`${NAME}_${type}Id_list_add`, id_list);
                    } catch (e) {
                        id_list.push(id);
                        localStorage.setItem(`${NAME}_${type}Id_list`, JSON.stringify({ list: id_list }));
                    }
                },
                isIn: function (id, type) {
                    let id_list = [];
                    try {
                        let config = JSON.parse(localStorage.getItem(`${NAME}_${type}Id_list`));
                        if (config === null) {
                            id_list = [];
                        } else {
                            id_list = [].concat(config.list);
                        }
                        MYDEBUG(`${NAME}_${type}Id_list_read`, config);
                        return id_list.indexOf(id) > -1
                    } catch (e) {
                        localStorage.setItem(`${NAME}_${type}Id_list`, JSON.stringify({ list: id_list }));
                        MYDEBUG('读取' + `${NAME}_${type}Id_list` + '缓存错误已重置');
                        return id_list.indexOf(id) > -1
                    }
                }
            },
            raffleId_list: [],
            guardId_list: [],
            pkId_list: [],
            creat_join: function (roomId, data, type, area = '本直播间') {
                MYDEBUG('礼物信息', data);
                if (MY_API.GIFT_COUNT.COUNT >= MY_API.CONFIG.MAX_GIFT) {//判断是否超过辣条限制
                    MYDEBUG('超过今日辣条限制，不参与抽奖');
                    MY_API.max_blocked = true;
                    return
                }
                switch (type) {//防止重复抽奖上船PK
                    case 'gift':
                        if (MY_API.Id_list_history.isIn(data.raffleId, 'raffle')) {
                            MYDEBUG('礼物重复', `raffleId ${data.raffleId}`);
                            return
                        } else {
                            MY_API.raffleId_list.push(data.raffleId);
                            MY_API.Id_list_history.add(data.raffleId, 'raffle');
                        }
                        break;
                    case 'guard':
                        if (MY_API.Id_list_history.isIn(data.id, 'guard')) {
                            MYDEBUG('舰长重复', `id ${data.id}`);
                            return
                        } else {
                            MY_API.guardId_list.push(data.id);
                            MY_API.Id_list_history.add(data.id, 'guard');
                        }
                        break;
                    case 'pk':
                        if (MY_API.Id_list_history.isIn(data.id, 'pk')) {
                            MYDEBUG('pk重复', `id ${data.id}`);
                            return
                        } else {
                            MY_API.pkId_list.push(data.id);
                            MY_API.Id_list_history.add(data.id, 'pk');
                        }
                        break;
                }

                let delay = data.time_wait || 0;
                if (MY_API.CONFIG.RANDOM_DELAY)
                    delay += Math.floor(Math.random() * (MY_API.CONFIG.RND_DELAY_END - MY_API.CONFIG.RND_DELAY_START + 1)) + MY_API.CONFIG.RND_DELAY_START;
                //随机延迟 return Math.floor(Math.random() * (max - min + 1) ) + min; min，max都包括
                let div = $("<div class='igiftMsg'>");
                let msg = $("<div>");
                let aa = $("<div>");
                let ct = $('#chat-history-list');
                let myDate = new Date();
                msg.text(`[${area}]` + data.thank_text.split('<%')[1].split('%>')[0] + data.thank_text.split('%>')[1]);
                div.text(myDate.toLocaleString());
                div.append(msg);
                aa.css('color', 'red');
                aa.text('等待抽奖');
                msg.append(aa);
                div.css({
                    'text-align': 'center',
                    'border-radius': '4px',
                    'min-height': '30px',
                    'width': '256px',
                    'color': '#9585FF',
                    'line-height': '30px',
                    'padding': '0 10px',
                    'margin': '10px auto',
                });
                msg.css({
                    'word-wrap': 'break-word',
                    'width': '100%',
                    'line-height': '1em',
                    'margin-bottom': '10px',
                });

                div.css({
                    'border': '1px solid rgb(203, 195, 255)',
                    'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
                });
                if (msgHide == 'show') {//false
                    ct.find('#chat-items').append(div);//向聊天框加入信息
                } else {
                    ct.find('#chat-items').append(div.hide());//向聊天框加入信息                 
                }
                ct.scrollTop(ct.prop("scrollHeight"));//滚动到底部
                let timer = setInterval(() => {
                    aa.text(`等待抽奖倒计时${delay}秒`);
                    if (delay <= 0) {
                        if (probability(MY_API.CONFIG.RANDOM_SKIP)) {
                            aa.text(`跳过此礼物抽奖`);
                        } else {
                            aa.text(`进行抽奖...`);
                            switch (type) {
                                case 'gift':
                                    MY_API.gift_join(roomId, data.raffleId, data.type).then(function (msg, num) {
                                        aa.text(msg);
                                        if (num) {
                                            if (msg.indexOf('辣条') > -1) {
                                                MY_API.addGift(num);
                                            }
                                            else if (msg.indexOf('银瓜子') > -1) {
                                                MY_API.addSilver(num);
                                            }

                                        }
                                        MY_API.raffleId_list.remove(data.raffleId);//移除礼物id列表
                                    });
                                    break;
                                case 'guard':
                                    MY_API.guard_join(roomId, data.id).then(function (msg, num) {
                                        aa.text(msg);
                                        if (num) {
                                            if (msg.indexOf('辣条') > -1) {
                                                MY_API.addGift(num);
                                            }
                                            else if (msg.indexOf('银瓜子') > -1) {
                                                MY_API.addSilver(num);
                                            }
                                        }
                                        MY_API.guardId_list.remove(data.id);//移除礼物id列表
                                    });
                                    break;
                                case 'pk':
                                    MY_API.pk_join(roomId, data.id).then(function (msg, num) {
                                        aa.text(msg);
                                        if (num) {
                                            if (msg.indexOf('辣条') > -1) {
                                                MY_API.addGift(num);
                                            }
                                            else if (msg.indexOf('银瓜子') > -1) {
                                                MY_API.addSilver(num);
                                            }
                                        }
                                        MY_API.pkId_list.remove(data.id);//移除礼物id列表
                                    });
                                    break;
                            }
                        }

                        aa.css('color', 'green');
                        clearInterval(timer)
                    }
                    delay--;
                }, 1000);


            },
            gift_join: function (roomid, raffleId, type) {
                let p = $.Deferred();
                BAPI.Lottery.Gift.join(roomid, raffleId, type).then((response) => {
                    MYDEBUG('抽奖返回信息', response);
                    switch (response.code) {
                        case 0:
                            if (response.data.award_text) {
                                p.resolve(response.data.award_text, response.data.award_num);
                            } else {
                                p.resolve(response.data.award_name + 'X' + response.data.award_num.toString()
                                    , response.data.award_num);
                            }
                            break;
                        default:
                            if (response.msg.indexOf('拒绝') > -1) {
                                if (MY_API.CONFIG.FORCE_LOTTERY == false) {
                                    MY_API.blocked = true;//停止抽奖
                                    p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');
                                } else if (++gift_join_try <= 5) {
                                    MY_API.gift_join(roomid, raffleId, type);
                                } else {
                                    gift_join_try = 0;
                                    p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);
                                }
                            } else {
                                p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);
                            }
                    }
                });
                return p
            },
            guard_join: function (roomid, Id) {
                let p = $.Deferred();
                BAPI.Lottery.Guard.join(roomid, Id).then((response) => {
                    MYDEBUG('上船抽奖返回信息', response);
                    switch (response.code) {
                        case 0:
                            if (response.data.award_text) {
                                p.resolve(response.data.award_text, response.data.award_num);
                            } else {
                                p.resolve(response.data.award_name + 'X' + response.data.award_num.toString()
                                    , response.data.award_num);
                            }
                            break;
                        default:
                            if (response.msg.indexOf('拒绝') > -1) {
                                if (MY_API.CONFIG.FORCE_LOTTERY == false) {
                                    MY_API.blocked = true;//停止抽奖
                                    p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');
                                } else if (++guard_join_try <= 5) { //若被拒绝则再次尝试，最高五次
                                    MY_API.guard_join(roomid, id);
                                } else {
                                    guard_join_try = 0;
                                    p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);
                                }
                            } else {
                                p.resolve(`[上船](roomid=${roomid},id=${Id})${response.msg}`);
                            }
                            break;
                    }
                });
                return p
            },
            pk_join: function (roomid, Id) {
                let p = $.Deferred();
                BAPI.Lottery.Pk.join(roomid, Id).then((response) => {
                    MYDEBUG('PK抽奖返回信息', response);
                    switch (response.code) {
                        case 0:
                            if (response.data.award_text) {
                                p.resolve(response.data.award_text, response.data.award_num);
                            } else {
                                p.resolve(response.data.award_name + 'X' + response.data.award_num.toString()
                                    , response.data.award_num);
                            }
                            break;
                        default:
                            if (response.msg.indexOf('拒绝') > -1) {
                                if (MY_API.CONFIG.FORCE_LOTTERY == false) {
                                    MY_API.blocked = true;//停止抽奖
                                    p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');
                                } else if (++pk_join_try <= 5) {
                                    MY_API.pk_join(roomid, id);
                                } else {
                                    pk_join_try = 0;
                                    p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);
                                }
                            } else {
                                p.resolve(`[PK](roomid=${roomid},id=${Id})${response.msg}`);
                            }
                            break;
                    }
                });
                return p
            },
            GroupSign: {
                getGroups: () => {//获取应援团列表
                    return BAPI.Group.my_groups().then((response) => {
                        MYDEBUG('GroupSign.getGroups: API.Group.my_groups', response);
                        if (response.code === 0) return $.Deferred().resolve(response.data.list);
                        window.toast(`[自动应援团签到]'${response.msg}`, 'caution');
                        return $.Deferred().reject();
                    }, () => {
                        window.toast('[自动应援团签到]获取应援团列表失败，请检查网络', 'error');
                        return delayCall(() => MY_API.GroupSign.getGroups());
                    });
                },
                signInList: (list, i = 0) => {//应援团签到
                    if (i >= list.length) return $.Deferred().resolve();
                    const obj = list[i];
                    //自己不能给自己的应援团应援
                    if (obj.owner_uid == Live_info.uid) return GroupSign.signInList(list, i + 1);
                    return BAPI.Group.sign_in(obj.group_id, obj.owner_uid).then((response) => {
                        MYDEBUG('GroupSign.signInList: API.Group.sign_in', response);
                        let p = $.Deferred();
                        if (response.code === 0) {
                            if (response.data.add_num > 0) {// || response.data.status === 1
                                window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到成功，当前勋章亲密度+${response.data.add_num}`, 'success');
                                p.resolve();
                            }
                            else if (response.data.add_num == 0) {
                                window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})已签到`, 'caution');
                                p.resolve();
                            }
                            else {
                                p.reject();
                            }

                        } else {
                            window.toast(`[自动应援团签到]'${response.msg}`, 'caution');
                            //return MY_API.GroupSign.signInList(list, i);
                            return $.Deferred().reject();
                        }
                        return $.when(MY_API.GroupSign.signInList(list, i + 1), p);
                    }, () => {
                        window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到失败，请检查网络`, 'error');
                        return delayCall(() => MY_API.GroupSign.signInList(list, i));
                    });
                },
                run: () => {//执行应援团任务
                    try {
                        if (!MY_API.CONFIG.AUTO_GROUP_SIGN) return $.Deferred().resolve();
                        /*let alternateTime = GetTomorrowIntervalTime(MY_API.CACHE.AUTO_GROUP_SIGH_TS);
                        if (alternateTime < 86400 * 1e3) { //间隔小于24小时
                            setTimeout(MY_API.GroupSign.run, alternateTime);
                            let runTime = new Date(ts_ms() + alternateTime).toLocaleString();
                            MYDEBUG("[自动应援团签到]", `将在${runTime}进行应援团签到`);
                            return $.Deferred().resolve();
                        }*/
                        if (!checkNewDay(MY_API.CACHE.AUTO_GROUP_SIGH_TS)) {
                            runTomorrow(MY_API.GroupSign.run, 8, 0, '应援团签到');
                            return $.Deferred().resolve();
                        } else if (new Date().getHours() < 8 && MY_API.CACHE.AUTO_GROUP_SIGH_TS != 0) {
                            setTimeout(MY_API.GroupSign.run, getIntervalTime(8, 0));
                            return $.Deferred().resolve();
                        }
                        return MY_API.GroupSign.getGroups().then((list) => {
                            return MY_API.GroupSign.signInList(list).then(() => {
                                MY_API.CACHE.AUTO_GROUP_SIGH_TS = ts_ms();
                                MY_API.saveCache();/*
                                alternateTime = GetTomorrowIntervalTime(MY_API.CACHE.AUTO_GROUP_SIGH_TS);
                                setTimeout(MY_API.GroupSign.run, alternateTime);
                                let runTime = new Date(ts_ms() + alternateTime).toLocaleString();
                                MYDEBUG("[自动应援团签到]", `将在${runTime}进行应援团签到`);*/
                                runTomorrow(MY_API.GroupSign.run, 8, 0, '应援团签到');
                                return $.Deferred().resolve();
                            }, () => delayCall(() => MY_API.GroupSign.run()));

                        }, () => delayCall(() => MY_API.GroupSign.run()));
                    } catch (err) {
                        window.toast('[自动应援团签到]运行时出现异常，已停止', 'error');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                }
            }, //"api.live.bilibili.com"
            DailyReward: {//每日任务
                coin_exp: 0,
                login: () => {
                    return BAPI.DailyReward.login().then(() => {
                        MYDEBUG('DailyReward.login: API.DailyReward.login');
                        window.toast('[自动每日奖励][每日登录]完成', 'success');
                    }, () => {
                        window.toast('[自动每日奖励][每日登录]完成失败，请检查网络', 'error');
                        return delayCall(() => MY_API.DailyReward.login());
                    });
                },
                watch: (aid, cid) => {
                    if (!MY_API.CONFIG.WATCH) return $.Deferred().resolve();
                    return BAPI.DailyReward.watch(aid, cid, Live_info.uid, ts_s()).then((response) => {
                        MYDEBUG('DailyReward.watch: API.DailyReward.watch', response);
                        if (response.code === 0) {
                            window.toast(`[自动每日奖励][每日观看]完成(av=${aid})`, 'success');
                        } else {
                            window.toast(`[自动每日奖励][每日观看]'${response.msg}`, 'caution');
                        }
                    }, () => {
                        window.toast('[自动每日奖励][每日观看]完成失败，请检查网络', 'error');
                        return delayCall(() => MY_API.DailyReward.watch(aid, cid));
                    });
                },
                coin: (cards, n, i = 0, one = false) => {
                    if (!MY_API.CONFIG.COIN) return $.Deferred().resolve();
                    if (MY_API.DailyReward.coin_exp >= MY_API.CONFIG.COIN_NUMBER * 10) {
                        window.toast('[自动每日奖励][每日投币]今日投币已完成', 'info');
                        return $.Deferred().resolve();
                    }
                    if (i >= cards.length) {
                        window.toast('[自动每日奖励][每日投币]动态里可投币的视频不足', 'caution');
                        return $.Deferred().resolve();
                    }
                    const obj = JSON.parse(cards[i].card);
                    let num = Math.min(2, n);
                    if (one) num = 1;
                    BAPI.x.getCoinInfo('', 'jsonp', obj.aid, ts_ms()).then((re) => {
                        if (re.data.multiply === 2) {
                            MYDEBUG('API.x.getCoinInfo', `已投币两个 aid = ${obj.aid}`)
                            return MY_API.DailyReward.coin(vlist, n, i + 1);
                        }
                        else {
                            return BAPI.DailyReward.coin(obj.aid, num).then((response) => {
                                MYDEBUG('DailyReward.coin: API.DailyReward.coin', response);
                                if (response.code === 0) {
                                    MY_API.DailyReward.coin_exp += num * 10;
                                    window.toast(`[自动每日奖励][每日投币]投币成功(av=${obj.aid},num=${num})`, 'success');
                                    return MY_API.DailyReward.coin(cards, n - num, i + 1);
                                } else if (response.code === -110) {
                                    window.toast('[自动每日奖励][每日投币]未绑定手机，已停止', 'error');
                                    return $.Deferred().reject();
                                } else if (response.code === 34003) {
                                    // 非法的投币数量
                                    if (one) return MY_API.DailyReward.coin(cards, n, i + 1);
                                    return MY_API.DailyReward.coin(cards, n, i, true);
                                } else if (response.code === 34005) {
                                    // 塞满啦！先看看库存吧~
                                    return MY_API.DailyReward.coin(cards, n, i + 1);
                                } else if (response.code === -104) {
                                    //硬币余额不足
                                    window.toast('[自动每日奖励][每日投币]剩余硬币不足，已停止', 'warning');
                                    return $.Deferred().reject();
                                }
                                window.toast(`[自动每日奖励][每日投币]'${response.msg}`, 'caution');
                                return MY_API.DailyReward.coin(cards, n, i + 1);
                            }, () => delayCall(() => MY_API.DailyReward.coin(cards, n, i)));
                        }
                    })
                },
                coin_uid: (vlist, n, pagenum, uid, i = 0, one = false) => {
                    if (!MY_API.CONFIG.COIN) return $.Deferred().resolve();
                    if (MY_API.DailyReward.coin_exp >= MY_API.CONFIG.COIN_NUMBER * 10) {
                        window.toast('[自动每日奖励][每日投币]今日投币已完成', 'info');
                        return $.Deferred().resolve();
                    }
                    if (i >= vlist.length) {
                        MY_API.DailyReward.UserSpace(MY_API.CONFIG.COIN_UID, 30, 0, pagenum++, '', 'pubdate', 'jsonp');
                    }
                    const obj = vlist[i];
                    if (obj.is_union_video === 1 || obj.mid != uid) {
                        MYDEBUG('DailyReward.coin_uid', `联合投稿且UP不是指定UID用户 aid = ${obj.aid}`)
                        return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uid, i + 1);
                    }
                    let num = Math.min(2, n);
                    if (one) num = 1;
                    BAPI.x.getCoinInfo('', 'jsonp', obj.aid, ts_ms()).then((re) => {
                        if (re.data.multiply === 2) {
                            MYDEBUG('API.x.getCoinInfo', `已投币两个 aid = ${obj.aid}`)
                            return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uid, i + 1);
                        }
                        else {
                            return BAPI.DailyReward.coin(obj.aid, num).then((response) => {
                                MYDEBUG('DailyReward.coin_uid: API.DailyReward.coin_uid', response);
                                if (response.code === 0) {
                                    MY_API.DailyReward.coin_exp += num * 10;
                                    window.toast(`[自动每日奖励][每日投币]投币成功(av=${obj.aid},num=${num})`, 'success');
                                    return MY_API.DailyReward.coin_uid(vlist, n - num, pagenum, uid, i + 1);
                                } else if (response.code === -110) {
                                    window.toast('[自动每日奖励][每日投币]未绑定手机，已停止', 'error');
                                    return $.Deferred().reject();
                                } else if (response.code === 34003) {
                                    // 非法的投币数量
                                    if (one) return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uid, i + 1);
                                    return MY_API.DailyReward.coin_uid(vlist, n, i, pagenum, uid, true);
                                } else if (response.code === 34005) {
                                    // 塞满啦！先看看库存吧~
                                    return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uid, i + 1);
                                } else if (response.code === -104) {
                                    //硬币余额不足
                                    window.toast('[自动每日奖励][每日投币]剩余硬币不足，已停止', 'warning');
                                    return $.Deferred().reject();
                                }
                                window.toast(`[自动每日奖励][每日投币]'${response.msg}`, 'caution');
                                return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uid, i + 1);
                            }, () => delayCall(() => MY_API.DailyReward.coin_uid(vlist, n, pagenum, uid, i)));
                        }
                    });

                },
                share: (aid) => {
                    if (!MY_API.CONFIG.SHARE) return $.Deferred().resolve();
                    return BAPI.DailyReward.share(aid).then((response) => {
                        MYDEBUG('DailyReward.share: API.DailyReward.share', response);
                        if (response.code === 0) {
                            window.toast(`[自动每日奖励][每日分享]分享成功(av=${aid})`, 'success');
                        } else if (response.code === 71000) {
                            // 重复分享
                            window.toast('[自动每日奖励][每日分享]今日分享已完成', 'info');
                        } else {
                            window.toast(`[自动每日奖励][每日分享]'${response.msg}`, 'caution');
                        }
                    }, () => {
                        window.toast('[自动每日奖励][每日分享]分享失败，请检查网络', 'error');
                        return delayCall(() => MY_API.DailyReward.share(aid));
                    });
                },
                dynamic: async () => {
                    let throwCoinNum = undefined;
                    let coinNum = MY_API.CONFIG.COIN_NUMBER - MY_API.DailyReward.coin_exp / 10;
                    throwCoinNum = await BAPI.getuserinfo().then((re) => {
                        MYDEBUG('DailyReward.dynamic: API.getuserinfo', re);
                        if (re.data.biliCoin < coinNum) return re.data.biliCoin
                        else return coinNum
                    });
                    if (throwCoinNum < coinNum) window.toast(`[自动每日奖励][每日投币]剩余硬币不足，仅能投${throwCoinNum}个币`, 'warning');
                    return BAPI.dynamic_svr.dynamic_new(Live_info.uid, 8).then((response) => {
                        MYDEBUG('DailyReward.dynamic: API.dynamic_svr.dynamic_new', response);
                        if (response.code === 0) {
                            if (!!response.data.cards) {
                                const obj = JSON.parse(response.data.cards[0].card);
                                const p1 = MY_API.DailyReward.watch(obj.aid, obj.cid);
                                let p2;
                                if (MY_API.CONFIG.COIN_UID == 0 || MY_API.CONFIG.COIN_TYPE == 'COIN_DYN') {
                                    p2 = MY_API.DailyReward.coin(response.data.cards, Math.max(throwCoinNum, 0));
                                } else {
                                    p2 = MY_API.DailyReward.UserSpace(MY_API.CONFIG.COIN_UID, 30, 0, 1, '', 'pubdate', 'jsonp');
                                }
                                const p3 = MY_API.DailyReward.share(obj.aid);
                                return $.when(p1, p2, p3);
                            } else {
                                window.toast('[自动每日奖励]"动态-投稿视频"中暂无动态', 'info');
                            }
                        } else {
                            window.toast(`[自动每日奖励]获取"动态-投稿视频"'${response.msg}`, 'caution');
                        }
                    }, () => {
                        window.toast('[自动每日奖励]获取"动态-投稿视频"失败，请检查网络', 'error');
                        return delayCall(() => MY_API.DailyReward.dynamic());
                    });
                },
                UserSpace: (uid, ps, tid, pn, keyword, order, jsonp) => {
                    return BAPI.x.getUserSpace(uid, ps, tid, pn, keyword, order, jsonp).then((response) => {
                        MYDEBUG('DailyReward.UserSpace: API.dynamic_svr.UserSpace', response);
                        if (response.code === 0) {
                            if (!!response.data.list.vlist) {
                                let throwCoinNum = MY_API.CONFIG.COIN_NUMBER - MY_API.DailyReward.coin_exp / 10;
                                const p1 = MY_API.DailyReward.coin_uid(response.data.list.vlist, Math.max(throwCoinNum, 0), pn, uid);
                                return p1;
                            } else {
                                window.toast('[自动每日奖励]"空间-投稿视频"中暂无视频', 'info');
                            }
                        }
                        else {
                            window.toast(`[自动每日奖励]获取"空间-投稿视频"'${response.msg}`, 'caution');
                        }
                    }, () => {
                        window.toast('[自动每日奖励]获取"空间-投稿视频"失败，请检查网络', 'error');
                        return delayCall(() => MY_API.DailyReward.UserSpace(uid, ps, tid, pn, keyword, order, jsonp));
                    })
                },
                run: () => {
                    try {
                        //if (!MY_API.CONFIG.DailyReward) return $.Deferred().resolve();
                        if (!checkNewDay(MY_API.CACHE.DailyReward_TS)) {
                            // 同一天，不执行每日任务
                            runMidnight(MY_API.DailyReward.run, '每日任务');
                            return $.Deferred().resolve();
                        }
                        return BAPI.DailyReward.exp().then((response) => {
                            MYDEBUG('DailyReward.run: API.DailyReward.exp', response);
                            if (response.code === 0) {
                                MY_API.DailyReward.coin_exp = response.number;
                                MY_API.DailyReward.login();
                                return MY_API.DailyReward.dynamic().then(() => {
                                    MY_API.CACHE.DailyReward_TS = ts_ms();
                                    MY_API.saveCache();
                                    runMidnight(MY_API.DailyReward.run, '每日任务');
                                });
                            } else {
                                window.toast(`[自动每日奖励]${response.message}`, 'caution');
                            }
                        }, () => {
                            window.toast('[自动每日奖励]获取每日奖励信息失败，请检查网络', 'error');
                            return delayCall(() => MY_API.DailyReward.run());
                        });
                    } catch (err) {
                        window.toast('[自动每日奖励]运行时出现异常', 'error');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                }
            }, // Once Run every day "api.live.bilibili.com"
            LiveReward: {
                dailySignIn: () => {
                    return BAPI.xlive.dosign().then((response) => {
                        MYDEBUG('LiveReward.dailySignIn: API.xlive.dosign', response);
                        if (response.code === 0) {
                            window.toast('[自动直播签到]完成', 'success')
                        } else if (response.code === 1011040) {
                            window.toast('[自动直播签到]今日直播签到已完成', 'info')
                        } else {
                            window.toast(`[自动直播签到]${response.message}`, 'caution')
                        }
                    }, () => {
                        window.toast('[自动直播签到]直播签到失败，请检查网络', 'error');
                        return delayCall(() => MY_API.LiveReward.dailySignIn());
                    });
                },
                run: () => {
                    try {
                        if (!MY_API.CONFIG.LIVE_SIGN) return $.Deferred().resolve();
                        if (!checkNewDay(MY_API.CACHE.LiveReward_TS)) {
                            // 同一天，不执行
                            runMidnight(MY_API.LiveReward.run, '直播签到');
                            return $.Deferred().resolve();
                        }
                        MY_API.LiveReward.dailySignIn()
                        MY_API.CACHE.LiveReward_TS = ts_ms();
                        MY_API.saveCache();
                        runMidnight(MY_API.LiveReward.run, '直播签到');
                    } catch (err) {
                        window.toast('[自动直播签到]运行时出现异常', 'error');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                }
            },
            Exchange: {
                silver2coin: () => {
                    return BAPI.Exchange.silver2coin().then((response) => {
                        MYDEBUG('Exchange.silver2coin: API.SilverCoinExchange.silver2coin', response);
                        if (response.code === 0) {
                            window.toast(`[银瓜子换硬币]${response.msg}`, 'success');// 兑换成功
                        } else if (response.code === 403) {

                            window.toast(`[银瓜子换硬币]${response.msg}`, 'info');// 每天最多能兑换 1 个or银瓜子余额不足
                        } else {
                            window.toast(`[银瓜子换硬币]${response.msg}`, 'caution');
                        }
                    }, () => {
                        window.toast('[银瓜子换硬币]兑换失败，请检查网络', 'error');
                        return delayCall(() => MY_API.Exchange.silver2coin());
                    });
                },
                runS2C: () => {
                    try {
                        if (!MY_API.CONFIG.SILVER2COIN) return $.Deferred().resolve();
                        if (!checkNewDay(MY_API.CACHE.Silver2Coin_TS)) {
                            // 同一天，不再兑换硬币
                            runMidnight(MY_API.Exchange.runS2C, '瓜子换硬币');
                            return $.Deferred().resolve();
                        }
                        return MY_API.Exchange.silver2coin().then(() => {
                            MY_API.CACHE.Silver2Coin_TS = ts_ms();
                            MY_API.saveCache();
                            runMidnight(MY_API.Exchange.runS2C, '瓜子换硬币');
                        }, () => delayCall(() => MY_API.Exchange.runS2C()));
                    } catch (err) {
                        window.toast('[银瓜子换硬币]运行时出现异常，已停止', 'error');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                }
            }, // Once Run every day
            TreasureBox: {//领宝箱
                timer: undefined,
                time_end: undefined,
                time_start: undefined,
                promise: {
                    calc: undefined,
                    timer: undefined
                },
                DOM: {
                    image: undefined,
                    canvas: undefined,
                    div_tip: undefined,
                    div_timer: undefined
                },
                init: () => {
                    if (!MY_API.CONFIG.AUTO_TREASUREBOX) return $.Deferred().resolve();
                    const p = $.Deferred();
                    runUntilSucceed(() => {
                        try {
                            if ($('.draw-box.gift-left-part').length) {
                                window.toast('[自动领取瓜子]当前直播间有实物抽奖，暂停领瓜子功能', 'caution');
                                p.resolve();
                                return true;
                            }
                            let treasure_box = $('#gift-control-vm div.treasure-box.p-relative');
                            if (!treasure_box.length) return false;
                            treasure_box = treasure_box.first();
                            treasure_box.attr('id', 'old_treasure_box');
                            treasure_box.hide();
                            const div = $(`<div id="${NAME}_treasure_div" class="treasure-box p-relative" style="min-width: 46px;display: inline-block;float: left;padding: 22px 0 0 15px;"></div>`);
                            MY_API.TreasureBox.DOM.div_tip = $(`<div id="${NAME}_treasure_div_tip" class="t-center b-box none-select">自动<br>领取中</div>`);
                            MY_API.TreasureBox.DOM.div_timer = $(`<div id="${NAME}_treasure_div_timer" class="t-center b-box none-select">0</div>`);
                            MY_API.TreasureBox.DOM.image = $(`<img id="${NAME}_treasure_image" style="display:none">`);
                            MY_API.TreasureBox.DOM.canvas = $(`<canvas id="${NAME}_treasure_canvas" style="display:none" height="40" width="120"></canvas>`);
                            const css_text = 'min-width: 40px;padding: 2px 3px;margin-top: 3px;font-size: 12px;color: #fff;background-color: rgba(0,0,255,.5);border-radius: 10px;';
                            MY_API.TreasureBox.DOM.div_tip[0].style = css_text;
                            MY_API.TreasureBox.DOM.div_timer[0].style = css_text;
                            div.append(MY_API.TreasureBox.DOM.div_tip);
                            div.append(MY_API.TreasureBox.DOM.image);
                            div.append(MY_API.TreasureBox.DOM.canvas);
                            MY_API.TreasureBox.DOM.div_tip.after(MY_API.TreasureBox.DOM.div_timer);
                            treasure_box.after(div);
                            /*
                            if (!Live_info.mobile_verify) {
                                MY_API.TreasureBox.setMsg('未绑定<br>手机');
                                window.toast('[自动领取瓜子]未绑定手机，已停止', 'caution');
                                p.resolve();
                                return true;
                            }*/
                            try {
                                if (OCRAD);
                            } catch (err) {
                                MY_API.TreasureBox.setMsg('初始化<br>失败');
                                window.toast('[自动领取瓜子]OCRAD初始化失败，请检查网络', 'error');
                                console.error(`[${NAME}]`, err);
                                p.resolve();
                                return true;
                            }
                            MY_API.TreasureBox.timer = setInterval(() => {
                                let t = parseInt(MY_API.TreasureBox.DOM.div_timer.text(), 10);
                                if (isNaN(t)) t = 0;
                                if (t > 0) MY_API.TreasureBox.DOM.div_timer.text(`${t - 1}s`);
                                else MY_API.TreasureBox.DOM.div_timer.hide();
                            }, 1e3);
                            MY_API.TreasureBox.DOM.image[0].onload = () => {
                                // 实现功能类似 https://github.com/bilibili-helper/bilibili-helper-o/tree/master/src/js/modules/treasure
                                const ctx = MY_API.TreasureBox.DOM.canvas[0].getContext('2d');
                                ctx.font = '40px agencyfbbold';
                                ctx.textBaseline = 'top';
                                ctx.clearRect(0, 0, MY_API.TreasureBox.DOM.canvas[0].width, MY_API.TreasureBox.DOM.canvas[0].height);
                                ctx.drawImage(MY_API.TreasureBox.DOM.image[0], 0, 0);
                                const grayscaleMap = MY_API.TreasureBox.captcha.OCR.getGrayscaleMap(ctx);
                                const filterMap = MY_API.TreasureBox.captcha.OCR.orderFilter2In3x3(grayscaleMap);
                                ctx.clearRect(0, 0, 120, 40);
                                for (let i = 0; i < filterMap.length; ++i) {
                                    const gray = filterMap[i];
                                    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
                                    ctx.fillRect(i % 120, Math.round(i / 120), 1, 1);
                                }
                                try {
                                    const question = MY_API.TreasureBox.captcha.correctQuestion(OCRAD(ctx.getImageData(0, 0, 120, 40)));
                                    MYDEBUG('TreasureBox.DOM.image.load', 'question =', question);
                                    const answer = MY_API.TreasureBox.captcha.eval(question);
                                    MYDEBUG('TreasureBox.DOM.image.load', 'answer =', answer);
                                    if (answer !== undefined) {
                                        //window.toast(`[自动领取瓜子]验证码识别结果: ${question} = ${answer}`, 'info');
                                        console.info(`[${NAME}][自动领取瓜子]验证码识别结果: ${question} = ${answer}`);
                                        MY_API.TreasureBox.promise.calc.resolve(answer);
                                    }
                                } catch (err) {
                                    MY_API.TreasureBox.promise.calc.reject();
                                }
                            };
                            p.resolve();
                            return true;
                        } catch (err) {
                            window.toast('[自动领取瓜子]初始化时出现异常，已停止', 'error');
                            console.error(`[${NAME}]`, err);
                            p.reject();
                            return true;
                        }
                    });
                    return p;
                },
                run: () => {
                    try {
                        if (!MY_API.CONFIG.AUTO_TREASUREBOX || !MY_API.TreasureBox.timer) return;
                        if (Live_info.blocked) {
                            MY_API.TreasureBox.setMsg('小黑屋');
                            window.toast('[自动领取瓜子]帐号被关小黑屋，停止领取瓜子', 'caution');
                            return;
                        }
                        if (!checkNewDay(MY_API.CACHE.TreasureBox_TS)) {
                            MY_API.TreasureBox.setMsg('今日<br>已领完');
                            runMidnight(MY_API.TreasureBox.run, '领银瓜子宝箱');
                            return;
                        }
                        MY_API.TreasureBox.getCurrentTask().then((response) => {
                            MYDEBUG('TreasureBox.run: TreasureBox.getCurrentTask().then', response);
                            if (response.code === 0) {
                                // 获取任务成功
                                MY_API.TreasureBox.promise.timer = $.Deferred();
                                MY_API.TreasureBox.promise.timer.then(() => {
                                    MY_API.TreasureBox.captcha.calc().then((captcha) => {
                                        // 验证码识别完成
                                        MY_API.TreasureBox.getAward(captcha).then(() => MY_API.TreasureBox.run(), () => MY_API.TreasureBox.run());
                                    }, () => TreasureBox.run());
                                });
                                MY_API.TreasureBox.time_end = response.data.time_end;
                                MY_API.TreasureBox.time_start = response.data.time_start;
                                let t = MY_API.TreasureBox.time_end - ts_s() + 1;
                                if (t < 0) t = 0;
                                setTimeout(() => {
                                    if (MY_API.TreasureBox.promise.timer) MY_API.TreasureBox.promise.timer.resolve();
                                }, t * 1e3);
                                MY_API.TreasureBox.DOM.div_timer.text(`${t}s`);
                                MY_API.TreasureBox.DOM.div_timer.show();
                                MY_API.TreasureBox.DOM.div_tip.html(`轮数<br>${response.data.times}/${response.data.max_times}<br>银瓜子<br>${response.data.silver}`);
                            } else if (response.code === -10017) {
                                // 今天所有的宝箱已经领完!
                                MY_API.TreasureBox.setMsg('今日<br>已领完');
                                // window.toast(`[自动领取瓜子]${response.msg}`, 'info');
                                MY_API.CACHE.TreasureBox_TS = ts_ms();
                                MY_API.saveCache();
                                runMidnight(MY_API.TreasureBox.run, '领银瓜子宝箱');
                            } else if (response.code === -500) {
                                // 请先登录!
                                location.reload();
                            } else {
                                window.toast(`[自动领取瓜子]${response.msg}`, 'caution');
                                return MY_API.TreasureBox.run();
                            }
                        });
                    } catch (err) {
                        MY_API.TreasureBox.setMsg('运行<br>异常');
                        window.toast('[自动领取瓜子]运行时出现异常，已停止', 'error');
                        console.error(`[${NAME}]`, err);
                    }
                },
                setMsg: (htmltext) => {
                    if (!MY_API.CONFIG.AUTO_TREASUREBOX) return;
                    if (MY_API.TreasureBox.promise.timer) {
                        MY_API.TreasureBox.promise.timer.reject();
                        MY_API.TreasureBox.promise.timer = undefined;
                    }
                    if (MY_API.TreasureBox.DOM.div_timer) MY_API.TreasureBox.DOM.div_timer.hide();
                    if (MY_API.TreasureBox.DOM.div_tip) MY_API.TreasureBox.DOM.div_tip.html(htmltext);
                },
                getAward: (captcha, cnt = 0) => {
                    if (!MY_API.CONFIG.AUTO_TREASUREBOX) return $.Deferred().reject();
                    if (cnt > 3) return $.Deferred().resolve(); // 3次时间未到，重新运行任务
                    return BAPI.TreasureBox.getAward(MY_API.TreasureBox.time_start, MY_API.TreasureBox.time_end, captcha).then(async (response) => {
                        MYDEBUG('TreasureBox.getAward: getAward', response);
                        switch (response.code) {
                            case 0:
                                window.toast(`[自动领取瓜子]领取了 ${response.data.awardSilver} 银瓜子`, 'success');
                            case -903: // -903: 已经领取过这个宝箱
                                // window.toast('[自动领取瓜子]已经领取过这个宝箱', 'caution');
                                return $.Deferred().resolve();
                            case -902: // -902: 验证码错误
                            case -901: // -901: 验证码过期
                            case -10017: // -10017: 验证码过期
                                await sleep(150);
                                return MY_API.TreasureBox.captcha.calc().then((captcha) => {
                                    return MY_API.TreasureBox.getAward(captcha, cnt);
                                });
                            case -800: // -800：未绑定手机
                                MY_API.TreasureBox.setMsg('未绑定<br>手机');
                                window.toast('[自动领取瓜子]未绑定手机，已停止', 'caution');
                                return $.Deferred().reject();
                            case -500: // -500：领取时间未到, 请稍后再试
                                const p = $.Deferred();
                                setTimeout(() => {
                                    MY_API.TreasureBox.captcha.calc().then((captcha) => {
                                        MY_API.TreasureBox.getAward(captcha, cnt + 1).then(() => p.resolve(), () => p.reject());
                                    }, () => p.reject());
                                }, 3e3);
                                return p;
                            case 400: // 400: 访问被拒绝
                                if (response.msg.indexOf('拒绝') > -1) {
                                    Live_info.blocked = true;
                                    MY_API.TreasureBox.setMsg('拒绝<br>访问');
                                    window.toast('[自动领取瓜子]访问被拒绝，您的帐号可能已经被关小黑屋，已停止', 'error');
                                    return $.Deferred().reject();
                                }
                                window.toast(`[自动领取瓜子]${response.msg}`, 'caution');
                                return $.Deferred().resolve();
                            default: // 其他错误
                                window.toast(`[自动领取瓜子]${response.msg}`, 'caution');
                        }
                    }, () => {
                        window.toast('[自动领取瓜子]获取任务失败，请检查网络', 'error');
                        return delayCall(() => MY_API.TreasureBox.getAward(captcha, cnt));
                    });
                },
                getCurrentTask: () => {
                    if (!MY_API.CONFIG.AUTO_TREASUREBOX) return $.Deferred().reject();
                    return BAPI.TreasureBox.getCurrentTask().then((response) => {
                        MYDEBUG('TreasureBox.getCurrentTask: API.TreasureBox.getCurrentTask', response);
                        return $.Deferred().resolve(response);
                    }, () => {
                        window.toast('[自动领取瓜子]获取当前任务失败，请检查网络', 'error');
                        return delayCall(() => MY_API.TreasureBox.getCurrentTask());
                    });
                },
                captcha: {
                    cnt: 0,
                    calc: () => {
                        if (!MY_API.CONFIG.AUTO_TREASUREBOX) {
                            MY_API.TreasureBox.captcha.cnt = 0;
                            return $.Deferred().reject();
                        }
                        if (MY_API.TreasureBox.captcha.cnt > 20) { // 允许验证码无法识别的次数
                            // 验证码识别失败
                            MY_API.TreasureBox.setMsg('验证码<br>识别<br>失败');
                            window.toast('[自动领取瓜子]验证码识别失败，已停止', 'error');
                            return $.Deferred().reject();
                        }
                        return BAPI.TreasureBox.getCaptcha(ts_ms()).then((response) => {
                            MYDEBUG('TreasureBox.captcha.calc: getCaptcha', response);
                            if (response.code === 0) {
                                MY_API.TreasureBox.captcha.cnt++;
                                const p = $.Deferred();
                                MY_API.TreasureBox.promise.calc = $.Deferred();
                                MY_API.TreasureBox.promise.calc.then((captcha) => {
                                    MY_API.TreasureBox.captcha.cnt = 0;
                                    p.resolve(captcha);
                                }, () => {
                                    MY_API.TreasureBox.captcha.calc().then((captcha) => {
                                        p.resolve(captcha);
                                    }, () => {
                                        p.reject();
                                    });
                                });
                                MY_API.TreasureBox.DOM.image.attr('src', response.data.img);
                                return p;
                            } else {
                                window.toast(`[自动领取瓜子]${response.msg}`, 'caution');
                                return delayCall(() => MY_API.TreasureBox.captcha.calc());
                            }
                        }, () => {
                            window.toast('[自动领取瓜子]加载验证码失败，请检查网络', 'error');
                            return delayCall(() => MY_API.TreasureBox.captcha.calc());
                        });
                    },
                    // 对B站验证码进行处理
                    // 代码来源：https://github.com/zacyu/bilibili-helper/
                    // 删除了未使用的变量
                    OCR: {
                        getGrayscaleMap: (context, rate = 235, width = 120, height = 40) => {
                            const pixelMap = context.getImageData(0, 0, width, height).data;
                            const map = [];
                            for (let y = 0; y < height; y++) { // line y
                                for (let x = 0; x < width; x++) { // column x
                                    const index = (y * width + x) * 4;
                                    const pixel = pixelMap.slice(index, index + 4);
                                    const gray = pixel ? (77 * pixel[0] + 150 * pixel[1] + 29 * pixel[2] + 128) >> 8 : 0;
                                    map.push(gray > rate ? gray : 0);
                                }
                            }
                            return map;
                        },
                        orderFilter2In3x3: (grayscaleMap, n = 9, width = 120) => {
                            const gray = (x, y) => (x + y * width >= 0) ? grayscaleMap[x + y * width] : 255;
                            const map = [];
                            const length = grayscaleMap.length;
                            const catchNumber = n - 1;
                            for (let i = 0; i < length; ++i) {
                                const [x, y] = [i % width, Math.floor(i / width)];
                                const matrix = new Array(9);
                                matrix[0] = gray(x - 1, y - 1);
                                matrix[1] = gray(x + 0, y - 1);
                                matrix[2] = gray(x + 1, y - 1);
                                matrix[3] = gray(x - 1, y + 0);
                                matrix[4] = gray(x + 0, y + 0);
                                matrix[5] = gray(x + 1, y + 0);
                                matrix[6] = gray(x - 1, y + 1);
                                matrix[7] = gray(x + 0, y + 1);
                                matrix[8] = gray(x + 1, y + 1);
                                matrix.sort((a, b) => a - b);
                                map.push(matrix[catchNumber]);
                            }
                            return map;
                        },
                    },
                    eval: (fn) => {
                        let Fn = Function;
                        return new Fn(`return ${fn}`)();
                    },
                    // 修正OCRAD识别结果
                    // 代码来源：https://github.com/zacyu/bilibili-helper
                    // 修改部分：
                    // 1.将correctStr声明在correctQuestion函数内部，并修改相关引用
                    // 2.在correctStr中增加'>': 3
                    correctStr: {
                        'i': 1, 'I': 1, '|': 1, 'l': 1,
                        'o': 0, 'O': 0, 'D': 0,
                        'S': 6, 's': 6, 'b': 6,
                        'R': 8, 'B': 8,
                        'z': 2, 'Z': 2,
                        '.': '-',
                        '_': 4,
                        'g': 9,
                        '>': 3
                    },
                    correctQuestion: (question) => {
                        let q = '';
                        question = question.trim();
                        for (let i in question) {
                            let a = MY_API.TreasureBox.captcha.correctStr[question[i]];
                            q += (a !== undefined ? a : question[i]);
                        }
                        if (q[2] === '4') q[2] = '+'; //若第三位为4则替换为+
                        for (let c = 0; c <= parseInt(q.length - 2); c++) {//'1 => 7
                            if (q[c] === '\'' && q[c + 1] === '1') {
                                q[c] = '7';
                                q.splice(c + 1, 1)
                            }
                        }
                        return q;
                    }
                }
            }, // Constantly Run, Need Init
            Gift: {
                run_timer: undefined,
                ruid: undefined,
                room_id: undefined,
                medal_list: undefined,
                bag_list: undefined,
                time: undefined,
                remain_feed: undefined,
                over: false,
                run_timer: undefined,
                //notSendGiftList: [3, 4, 9, 10, 39, 30588, 30587, 30586, 30585],
                //B坷垃,喵娘,爱心便当,蓝白胖次,节奏风暴,如意小香包,软糯白糖粽,飘香大肉粽,端午茗茶
                sendGiftList: [1, 6, 30607],//辣条，亿圆, 小心心
                getMedalList: async (page = 1) => {
                    if (page === 1) MY_API.Gift.medal_list = [];
                    return await BAPI.i.medal(page, 25).then((response) => {
                        MYDEBUG('Gift.getMedalList: API.i.medal', response);
                        MY_API.Gift.medal_list = MY_API.Gift.medal_list.concat(response.data.fansMedalList);
                        if (response.data.pageinfo.curPage < response.data.pageinfo.totalpages) return MY_API.Gift.getMedalList(page + 1);
                    }, () => {
                        window.toast('[自动送礼]获取勋章列表失败，请检查网络', 'error');
                        return delayCall(() => MY_API.Gift.getMedalList());
                    });
                },
                getBagList: async () => {
                    return await BAPI.gift.bag_list().then((response) => {
                        MYDEBUG('Gift.getBagList: API.gift.bag_list', response);
                        MY_API.Gift.bag_list = response.data.list;
                        MY_API.Gift.time = response.data.time;
                    }, () => {
                        window.toast('[自动送礼]获取包裹列表失败，请检查网络', 'error');
                        return delayCall(() => MY_API.Gift.getBagList());
                    });
                },
                getFeedByGiftID: (gift_id) => {
                    for (let i = Live_info.gift_list.length - 1; i >= 0; --i) {
                        if (Live_info.gift_list[i].id === gift_id) {
                            return Math.ceil(Live_info.gift_list[i].price / 100);
                        }
                    }
                    return 0;
                },
                sort_medals: (medals) => {
                    if (MY_API.CONFIG.GIFT_SORT) {
                        medals.sort((a, b) => {
                            if (b.level - a.level == 0) {
                                return b.intimacy - a.intimacy;
                            }
                            return b.level - a.level;
                        });
                    } else {
                        medals.sort((a, b) => {
                            if (a.level - b.level == 0) {
                                return a.intimacy - b.intimacy;
                            }
                            return a.level - b.level;
                        });
                    }
                    if (MY_API.CONFIG.AUTO_GIFT_ROOMID && MY_API.CONFIG.AUTO_GIFT_ROOMID.length > 0) {
                        let sortRooms = MY_API.CONFIG.AUTO_GIFT_ROOMID.split(",");
                        sortRooms.reverse();
                        for (let froom of sortRooms) {
                            let rindex = medals.findIndex(r => r.roomid == froom);
                            if (rindex != -1) {
                                let tmp = medals[rindex];
                                medals.splice(rindex, 1);
                                medals.unshift(tmp);
                            }
                        }
                    }
                    return medals;
                },
                auto_light: async (medal_list) => {
                    try {
                        const feed = MY_API.Gift.getFeedByGiftID(30607);//小心心
                        let light_roomid = MY_API.CONFIG.LIGHT_MEDALS.split(",");
                        let unLightedMedals = undefined;
                        if (MY_API.CONFIG.LIGHT_METHOD == 'LIGHT_WHITE') {//白名单
                            unLightedMedals = medal_list.filter(m => m.is_lighted == 0 && m.day_limit - m.today_feed >= feed &&
                                light_roomid.findIndex(it => it == m.roomid) >= 0)
                        } else {//黑名单
                            unLightedMedals = medal_list.filter(m => m.is_lighted == 0 && m.day_limit - m.today_feed >= feed &&
                                light_roomid.findIndex(it => it == m.roomid) == -1)
                        };
                        MYDEBUG('[auto_light]即将点亮勋章房间列表', unLightedMedals);
                        if (unLightedMedals && unLightedMedals.length > 0) {
                            unLightedMedals = MY_API.Gift.sort_medals(unLightedMedals);
                            await MY_API.Gift.getBagList();
                            let heartBags = MY_API.Gift.bag_list.filter(r => r.gift_id == 30607);
                            if (heartBags && heartBags.length > 0) {
                                for (let medal of unLightedMedals) {
                                    let gift = heartBags.find(g => g.gift_id == 30607 && g.gift_num > 0);
                                    if (gift) {
                                        let remain_feed = medal.day_limit - medal.today_feed;
                                        if (remain_feed - feed >= 0 || MY_API.CONFIG.FORCE_LIGHT) {
                                            let response = await BAPI.room.room_init(parseInt(medal.roomid, 10));
                                            let send_room_id = parseInt(response.data.room_id, 10);
                                            let feed_num = 1;
                                            let rsp = await BAPI.gift.bag_send(Live_info.uid, 30607, medal.target_id, feed_num, gift.bag_id, send_room_id, Live_info.rnd)
                                            if (rsp.code === 0) {
                                                gift.gift_num -= feed_num;
                                                medal.today_feed += feed_num * feed;
                                                remain_feed -= feed_num * feed;
                                                window.toast(`[自动送礼]勋章[${medal.medalName}]点亮成功，送出${feed_num}个${gift.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离升级还需[${remain_feed}]`, 'success');
                                                MYDEBUG('Gift.auto_light', `勋章[${medal.medalName}]点亮成功，送出${feed_num}个${gift.gift_name}，[${medal.today_feed}/${medal.day_limit}]`)
                                            } else {
                                                window.toast(`[自动送礼]勋章[${medal.medalName}]点亮失败【${response.msg}】`, 'caution');
                                            }
                                        }
                                        continue;
                                    }
                                    break;
                                }
                            }
                        }
                    } catch (e) {
                        console.error(e);
                        window.toast(`[自动送礼]点亮勋章出错:${e}`, 'error');
                    }
                },
                run: async () => {
                    const FailFunc = () => {
                        window.toast('[自动送礼]送礼失败，请检查网络', 'error');
                        return delayCall(() => MY_API.Gift.run());
                    };
                    const nextTimeDebug = () => {
                        if (MY_API.CONFIG.GIFT_METHOD == "GIFT_SEND_TIME") {
                            let alternateTime = getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR, MY_API.CONFIG.GIFT_SEND_MINUTE);
                            MY_API.Gift.run_timer = setTimeout(MY_API.Gift.run, alternateTime);
                            let runTime = new Date(ts_ms() + alternateTime).toLocaleString();
                            MYDEBUG("[自动送礼]", `将在${runTime}进行自动送礼`);
                            MY_API.CACHE.Gift_TS = ts_ms();
                            MY_API.saveCache();
                        } else {
                            MYDEBUG("[自动送礼]", `将在${MY_API.CONFIG.GIFT_INTERVAL}分钟后进行自动送礼`);
                            MY_API.CACHE.GiftInterval_TS = ts_ms();
                            MY_API.saveCache();
                        }
                        return
                    }
                    try {
                        if (!MY_API.CONFIG.AUTO_GIFT) return $.Deferred().resolve();
                        if (MY_API.Gift.run_timer) clearTimeout(MY_API.Gift.run_timer);
                        if (MY_API.CONFIG.GIFT_METHOD == "GIFT_SEND_TIME" && !isTime(MY_API.CONFIG.GIFT_SEND_HOUR, MY_API.CONFIG.GIFT_SEND_MINUTE) && SEND_GIFT_NOW == false) {
                            let alternateTime = getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR, MY_API.CONFIG.GIFT_SEND_MINUTE);
                            MY_API.Gift.run_timer = setTimeout(MY_API.Gift.run, alternateTime);
                            let runTime = new Date(ts_ms() + alternateTime).toLocaleString();
                            MYDEBUG("[自动送礼]", `将在${runTime}进行自动送礼`);
                            return $.Deferred().resolve();

                        } else if (MY_API.CONFIG.GIFT_METHOD == "GIFT_INTERVAL" && SEND_GIFT_NOW == false) {
                            let GiftInterval = MY_API.CONFIG.GIFT_INTERVAL * 60e3;
                            if (MY_API.CACHE.GiftInterval_TS) {
                                const interval = ts_ms() - MY_API.CACHE.GiftInterval_TS;
                                if (interval < GiftInterval) {
                                    let intervalTime = GiftInterval - interval;
                                    MY_API.Gift.run_timer = setTimeout(() => MY_API.Gift.run(), intervalTime);
                                    MYDEBUG("[自动送礼]", `将在${intervalTime}毫秒后进行自动送礼`);
                                    return;
                                }
                            }
                            else {
                                MY_API.CACHE.GiftInterval_TS = ts_ms();
                                MY_API.saveCache();
                            }
                        }
                        MY_API.Gift.over = false
                        await MY_API.Gift.getMedalList();
                        let medal_list = MY_API.Gift.medal_list;
                        MYDEBUG('Gift.run: Gift.getMedalList().then: Gift.medal_list', medal_list);
                        if (medal_list && medal_list.length > 0) {
                            medal_list = medal_list.filter(it => it.day_limit - it.today_feed > 0 && it.level < 20);
                            medal_list = MY_API.Gift.sort_medals(medal_list);
                            //排除直播间
                            if (MY_API.CONFIG.EXCLUDE_ROOMID && MY_API.CONFIG.EXCLUDE_ROOMID.length > 0) {
                                const ArrayEXCLUDE_ROOMID = MY_API.CONFIG.EXCLUDE_ROOMID.split(",");
                                medal_list = medal_list.filter(Er => ArrayEXCLUDE_ROOMID.findIndex(exp => exp == Er.roomid) == -1);
                            };
                            await MY_API.Gift.auto_light(medal_list);//点亮勋章
                            let limit = MY_API.CONFIG.GIFT_LIMIT * 86400;
                            for (let v of medal_list) {
                                if (MY_API.Gift.over) break;
                                let response = await BAPI.room.room_init(parseInt(v.roomid, 10));
                                MY_API.Gift.room_id = parseInt(response.data.room_id, 10);
                                MY_API.Gift.ruid = v.target_id;
                                MY_API.Gift.remain_feed = v.day_limit - v.today_feed;
                                if (MY_API.Gift.remain_feed > 0) {
                                    await MY_API.Gift.getBagList();
                                    let now = ts_s();
                                    if (!MY_API.CONFIG.SEND_ALL_GIFT) {
                                        //送之前查一次有没有可送的
                                        let pass = MY_API.Gift.bag_list.filter(r => MY_API.Gift.sendGiftList.includes(r.gift_id) && r.gift_num > 0 && r.expire_at > now && (r.expire_at - now < limit));
                                        if (pass.length == 0) {
                                            break;
                                        }
                                    };
                                    if (MY_API.Gift.remain_feed > 0) {
                                        window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度未满[${v.today_feed}/${v.day_limit}]，预计需要[${MY_API.Gift.remain_feed}]送礼开始`, 'info');
                                        await MY_API.Gift.sendGift(v);
                                        if (!MY_API.CONFIG.SEND_ALL_GIFT) {
                                            let pass = MY_API.Gift.bag_list.filter(r => MY_API.Gift.sendGiftList.includes(r.gift_id) && r.gift_num > 0 && r.expire_at > now && (r.expire_at - now < limit));
                                            if (pass.length == 0) {
                                                break;
                                            } else {
                                                MY_API.Gift.bag_list = pass;
                                            }
                                        }
                                    } else {
                                        window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度已满`, 'info');
                                    }
                                }
                            }
                        }
                        await MY_API.Gift.getBagList();
                        let i = 0;
                        for (i = 0; i <= MY_API.Gift.bag_list.length - 1; i++) {
                            if (MY_API.Gift.bag_list[i].gift_id == 1) {
                                break;
                            }
                        }
                        let v = MY_API.Gift.bag_list[i];
                        if (v == undefined) {
                            SEND_GIFT_NOW = false;
                            nextTimeDebug();
                            return $.Deferred().resolve();
                        }
                        let feed = MY_API.Gift.getFeedByGiftID(v.gift_id);
                        let limit = 86400;
                        let now = ts_s();
                        if (//剩余礼物,今日送完所有牌子后若有小于1天的礼物则送礼。检查有没有可送的
                            MY_API.Gift.bag_list.filter(r => MY_API.Gift.sendGiftList.includes(r.gift_id) && r.gift_num > 0 && r.expire_at > now && (r.expire_at - now < limit)).length != 0
                            && //满足到期时间小于一天
                            v.expire_at > MY_API.Gift.time && (v.expire_at - MY_API.Gift.time < limit
                                && MY_API.CONFIG.SPARE_GIFT_ROOM != '0' && MY_API.CONFIG.SPARE_GIFT_UID != '0'
                                && feed > 0)) {
                            let giftnum = v.gift_num;
                            return BAPI.gift.bag_send(Live_info.uid, v.gift_id, MY_API.CONFIG.SPARE_GIFT_UID, giftnum, v.bag_id, MY_API.CONFIG.SPARE_GIFT_ROOM, Live_info.rnd).then((response) => {
                                MYDEBUG('Gift.sendGift(剩余礼物): API.gift.bag_send', response);
                                if (response.code === 0) {
                                    window.toast(`[自动送礼](剩余礼物)房间[${MY_API.CONFIG.SPARE_GIFT_ROOM}] 送礼成功，送出${giftnum}个${v.gift_name}`, 'success');
                                } else {
                                    window.toast(`[自动送礼](剩余礼物)房间[${MY_API.CONFIG.SPARE_GIFT_ROOM}] 送礼异常:${response.msg}`, 'caution');
                                }
                            }, () => {
                                window.toast('[自动送礼](剩余礼物)包裹送礼失败，请检查网络', 'error');
                                return delayCall(() => MY_API.Gift.sendGift(medal));
                            });
                        }

                    } catch (err) {
                        FailFunc();
                        window.toast('[自动送礼]运行时出现异常，已停止', 'error');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                    SEND_GIFT_NOW = false;
                    nextTimeDebug();
                    return $.Deferred().resolve();
                },
                sendGift: async (medal) => {
                    await MY_API.Gift.getBagList();
                    let bag_list;
                    if (MY_API.Gift.remain_feed <= 0) {
                        window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼结束，今日亲密度已满[${medal.today_feed}/${medal.day_limit}]`, 'info');
                        return $.Deferred().resolve();
                    }
                    if (MY_API.Gift.time <= 0) MY_API.Gift.time = ts_s();

                    if (!MY_API.CONFIG.SEND_ALL_GIFT) {
                        //送之前查一次有没有可送的
                        let pass = MY_API.Gift.bag_list.filter(r => MY_API.Gift.sendGiftList.includes(r.gift_id) && r.gift_num > 0 &&
                            r.expire_at > MY_API.Gift.time && (r.expire_at - MY_API.Gift.time < MY_API.CONFIG.GIFT_LIMIT * 86400)
                            && r.corner_mark != '永久');
                        if (pass.length == 0) {
                            MY_API.Gift.over = true;
                            return;
                        } else {
                            bag_list = pass;
                        }
                    } else {
                        let pass = MY_API.Gift.bag_list.filter(r => r.gift_num > 0 && r.corner_mark != '永久');
                        if (pass.length == 0) {
                            MY_API.Gift.over = true;
                            return;
                        } else {
                            bag_list = pass;
                        }
                    }
                    MYDEBUG('bag_list', bag_list)
                    for (let v of bag_list) {
                        if (medal.day_limit - medal.today_feed <= 0) {
                            window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼结束，今日亲密度已满[${medal.today_feed}/${medal.day_limit}]`, 'info');
                            return;
                        }

                        const feed = MY_API.Gift.getFeedByGiftID(v.gift_id);
                        if (feed > 0) {
                            let feed_num = Math.floor(MY_API.Gift.remain_feed / feed);
                            if (feed_num > v.gift_num) feed_num = v.gift_num;
                            if (feed_num > 0) {
                                await BAPI.gift.bag_send(Live_info.uid, v.gift_id, MY_API.Gift.ruid, feed_num, v.bag_id, MY_API.Gift.room_id, Live_info.rnd).then((response) => {
                                    MYDEBUG('Gift.sendGift: API.gift.bag_send', response);
                                    if (response.code === 0) {
                                        v.gift_num -= feed_num;
                                        medal.today_feed += feed_num * feed;
                                        MY_API.Gift.remain_feed -= feed_num * feed;
                                        window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼成功，送出${feed_num}个${v.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离升级还需[${MY_API.Gift.remain_feed}]`, 'success');
                                    } else {
                                        window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼异常:${response.msg}`, 'caution');
                                    }
                                }, () => {
                                    window.toast('[自动送礼]包裹送礼失败，请检查网络', 'error');
                                    return delayCall(() => MY_API.Gift.sendGift(medal));
                                });
                            }
                        }
                    }
                }
            },
            MobileHeartBeat: {
                run:
                    async () => {
                        if (MY_API.CONFIG.MOBILE_HEARTBEAT == false) return $.Deferred().resolve();
                        if (!checkNewDay(MY_API.CACHE.MobileHeartBeat_TS)) {
                            runMidnight(MY_API.MobileHeartBeat.run, '移动端心跳');
                            return $.Deferred().resolve();
                        }
                        if (Live_info.mobile_verify === false) {
                            window.toast('[移动端心跳]未绑定手机，已停止', 'warning');
                            MYDEBUG('MobileHeartBeat', `未绑定手机 mobile_verify = ${Live_info.mobile_verify}`);
                            return $.Deferred().resolve();
                        }
                        const mobileOnline = () => {
                            XHR({
                                GM: true,
                                anonymous: true,
                                method: 'POST',
                                url: `https://api.live.bilibili.com/heartbeat/v1/OnLine/mobileOnline?${BilibiliToken.signQuery(`access_key=${tokenData.access_token}&${baseQuery}`)}`,
                                data: `room_id=${Live_info.room_id}&scale=xxhdpi`,
                                responseType: 'json',
                                headers: appToken.headers
                            });
                        };
                        const EndFunc = (re) => {
                            MYDEBUG('MobileHeartBeat GetAward', re);
                            clearInterval(HBinterval);
                            MY_API.CACHE.MobileHeartBeat_TS = ts_ms();
                            MY_API.saveCache();
                            runMidnight(MY_API.MobileHeartBeat.run, '移动端心跳');
                        };
                        const getWatchingAward = () => {
                            BAPI.activity.receive_award('double_watch_task').then((response) => {
                                if (response.code === 0) {
                                    window.toast('[双端观看直播]奖励领取成功', 'success');
                                    EndFunc(response);
                                    return $.Deferred().resolve();
                                }
                                else if (response.code === -400) {
                                    window.toast('[双端观看直播]奖励已领取', 'info');
                                    EndFunc(response);
                                    return $.Deferred().resolve();
                                }
                                else {
                                    window.toast(`[双端观看直播]${response}`, 'warning');
                                    EndFunc(response);
                                    return $.Deferred().resolve();
                                }
                            }, (err) => {
                                window.toast('[双端观看直播]奖励领取失败，请检查网络', 'error');
                                console.error('MobileHeartBeat GetAward', err);
                                clearInterval(HBinterval);
                                return delayCall(() => MY_API.MobileHeartBeat.run());
                            });
                        }
                        if (await setToken() === undefined && tokenData.access_token === undefined) {
                            MYDEBUG('MobileHeartBeat', 'token设置失败');
                            return;
                        }
                        MYDEBUG('MobileHeartBeat', '开始客户端心跳');
                        mobileOnline();
                        let HBinterval = undefined;
                        HBinterval = setInterval(() => mobileOnline(), 300 * 1e3);
                        setTimeout(() => getWatchingAward(), 360 * 1e3);
                    }

            },
            stormQueue: [],//n节奏风暴队列
            stormBlack: false,//n节奏风暴黑屋
            stormIdSet: {//风暴历史记录缓存
                add: function (id) {
                    let storm_id_list = [];
                    try {
                        let config = JSON.parse(localStorage.getItem(`${NAME}stormIdSet`));
                        storm_id_list = [].concat(config.list);
                        storm_id_list.push(id);
                        if (storm_id_list.length > 50) {
                            storm_id_list.splice(0, 10);//删除前10条数据
                        }
                        localStorage.setItem(`${NAME}stormIdSet`, JSON.stringify({ list: storm_id_list }));
                        MYDEBUG(`${NAME}storm_Id_list_add`, storm_id_list);
                    } catch (e) {
                        storm_id_list.push(id);
                        localStorage.setItem(`${NAME}stormIdSet`, JSON.stringify({ list: storm_id_list }));
                    }
                },
                isIn: function (id) {
                    let storm_id_list = [];
                    try {
                        let config = JSON.parse(localStorage.getItem(`${NAME}stormIdSet`));
                        if (config === null) {
                            storm_id_list = [];
                        } else {
                            storm_id_list = [].concat(config.list);
                        }
                        MYDEBUG(`${NAME}storm_Id_list_read`, config);
                        return storm_id_list.indexOf(id) > -1
                    } catch (e) {
                        localStorage.setItem(`${NAME}stormIdSet`, JSON.stringify({ list: storm_id_list }));
                        MYDEBUG('读取' + `${NAME}stormIdSet` + '缓存错误已重置');
                        return storm_id_list.indexOf(id) > -1
                    }
                }
            },
            Storm: {
                check: (id) => {
                    return MY_API.stormQueue.indexOf(id) > -1;
                },
                append: (id) => {
                    MY_API.stormQueue.push(id);
                    if (MY_API.stormQueue.length > MY_API.CONFIG.STORM_QUEUE_SIZE) {
                        MY_API.stormQueue.shift();
                    }
                },
                over: (id) => {
                    var index = MY_API.stormQueue.indexOf(id);
                    if (index > -1) {
                        MY_API.stormQueue.splice(id, 1);
                    }
                },
                run: (roomid) => {
                    try {
                        if (!MY_API.CONFIG.STORM) return $.Deferred().resolve();
                        //if (Info.blocked) return $.Deferred().resolve();
                        if (MY_API.stormBlack) return $.Deferred().resolve();
                        if (inTimeArea(MY_API.CONFIG.TIME_AREA_START_H0UR, MY_API.CONFIG.TIME_AREA_END_H0UR, MY_API.CONFIG.TIME_AREA_START_MINUTE, MY_API.CONFIG.TIME_AREA_END_MINUTE) && MY_API.CONFIG.TIME_AREA_DISABLE) {
                            MYDEBUG(`节奏风暴`, `自动休眠，跳过检测roomid=${roomid}`);
                            return $.Deferred().resolve();
                        }
                        return BAPI.Storm.check(roomid).then((response) => {
                            MYDEBUG('MY_API.Storm.run: MY_API.API.Storm.check', response);
                            if (response.code === 0) {
                                var data = response.data;
                                MY_API.Storm.join(data.id, data.roomid, Math.round(new Date().getTime() / 1000) + data.time);
                                return $.Deferred().resolve();
                            } else {
                                window.toast(`[自动抽奖][节奏风暴](roomid=${roomid})${response.msg}`, 'caution');
                            }
                        }, () => {
                            window.toast(`[自动抽奖][节奏风暴]检查直播间(${roomid})失败，请检查网络`, 'error');
                            //return delayCall(() => MY_API.Storm.run(roomid));
                        });
                    } catch (err) {
                        window.toast('[自动抽奖][节奏风暴]运行时出现异常', 'error');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                },
                join: (id, roomid, endtime) => {
                    //if (Info.blocked) return $.Deferred().resolve();
                    roomid = parseInt(roomid, 10);
                    id = parseInt(id, 10);
                    if (isNaN(roomid) || isNaN(id)) return $.Deferred().reject();
                    var tid = Math.round(id / 1000000);
                    if (MY_API.stormIdSet.isIn(tid)) return $.Deferred().resolve();
                    MY_API.stormIdSet.add(tid);
                    if (MY_API.Storm.check(id)) {
                        return;
                    }
                    MY_API.Storm.append(id);
                    var stormInterval = 0;
                    if (endtime <= 0) {
                        endtime = Math.round(new Date().getTime() / 1000) + 90;
                    }
                    var count = 0;
                    window.toast(`[自动抽奖][节奏风暴]尝试抽奖(roomid=${roomid},id=${id})`, 'success');
                    async function process() {
                        try {
                            if (!MY_API.Storm.check(id)) {
                                clearInterval(stormInterval);
                                return;
                            }
                            var timenow = Math.round(new Date().getTime() / 1000);
                            //console.log('stormdebug:',id,count,timenow,endtime);
                            if (timenow > endtime && endtime > 0) {
                                MY_API.Storm.over(id);
                                clearInterval(stormInterval);
                                //window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})过期。\r\n尝试次数:${count}`, 'caution');
                                return;
                            }
                            count++;
                            if (count > MY_API.CONFIG.STORM_MAX_COUNT && MY_API.CONFIG.STORM_MAX_COUNT > 0) {
                                MY_API.Storm.over(id);
                                clearInterval(stormInterval);
                                window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})到达尝试次数。\r\n尝试次数:${count},距离到期:${endtime - timenow}s`, 'caution');
                                return;
                            }
                            let response;
                            try {
                                if (userToken && appToken && tokenData.access_token) {
                                    response = await BAPI.Storm.join_ex(id, roomid, tokenData.access_token, BilibiliToken.appKey, BilibiliToken.headers);
                                } else {
                                    response = await BAPI.Storm.join(id, captcha_token = '', captcha_phrase = '', roomid);
                                }
                                MYDEBUG('MY_API.Storm.join: MY_API.API.Storm.join', response);
                                if (response.code) {
                                    if (response.msg.indexOf("领取") != -1) {
                                        MY_API.Storm.over(id);
                                        clearInterval(stormInterval);
                                        window.toast(`[自动抽奖][节奏风暴]领取(roomid=${roomid},id=${id})成功,${response.msg}\r\n尝试次数:${count}`, 'success');
                                        return;
                                    }
                                    if (response.msg.indexOf("验证码") != -1) {
                                        MY_API.Storm.over(id);
                                        clearInterval(stormInterval);
                                        MY_API.stormBlack = true;
                                        window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})失败,疑似账号不支持,${response.msg}`, 'caution');
                                        return;
                                    }
                                    if (response.data && response.data.length == 0 && response.msg.indexOf("下次要更快一点") != -1) {
                                        MY_API.Storm.over(id);
                                        window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})疑似风暴黑屋,终止！`, 'error');
                                        clearInterval(stormInterval);
                                        MY_API.stormBlack = true;
                                        setTimeout(() => { MY_API.stormBlack = false; }, 3600 * 1000);
                                        return;
                                    }
                                    if (response.msg.indexOf("下次要更快一点") == -1) {
                                        clearInterval(stormInterval);
                                        return;
                                    }
                                    //setTimeout(()=>process(),CONFIG.AUTO_LOTTERY_CONFIG.STORM_CONFIG.STORM_ONE_LIMIT);
                                } else {
                                    MY_API.Storm.over(id);
                                    Statistics.appendGift(response.data.gift_name, response.data.gift_num);
                                    window.toast(`[自动抽奖][节奏风暴]领取(roomid=${roomid},id=${id})成功,${response.data.gift_name + "x" + response.data.gift_num}\r\n${response.data.mobile_content}\r\n尝试次数:${count}`, 'success');
                                    clearInterval(stormInterval);
                                    return;
                                }
                            } catch (e) {
                                MY_API.Storm.over(id);
                                window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})疑似触发风控,终止！\r\n尝试次数:${count}`, 'error');
                                console.error(e);
                                clearInterval(stormInterval);
                                return;
                            }
                        }
                        catch (e) {
                            MY_API.Storm.over(id);
                            window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})抽奖异常,终止！`, 'error');
                            console.error(e);
                            clearInterval(stormInterval);
                            return;
                        }
                    }
                    //setTimeout(()=>process(),1);
                    stormInterval = setInterval(() => process(), MY_API.CONFIG.STORM_ONE_LIMIT);
                    return $.Deferred().resolve();
                }
            },
            LITTLE_HEART: {
                medalRoom_list: [],
                liveRoom_list: [],
                getMedalRoomList: (page = 1) => {
                    if (page === 1) MY_API.LITTLE_HEART.medalRoom_list = [];
                    return BAPI.i.medal(page, 25).then((response) => {
                        MYDEBUG('LITTLE_HEART.getMedalRoomList: API.i.medal', response);
                        //MY_API.Gift.medal_list = MY_API.Gift.medal_list.concat(response.data.fansMedalList);
                        for (let i of response.data.fansMedalList) {
                            MY_API.LITTLE_HEART.medalRoom_list = MY_API.LITTLE_HEART.medalRoom_list.concat(i.roomid);
                        }
                        MYDEBUG('MY_API.LITTLE_HEART.medalRoom_list', MY_API.LITTLE_HEART.medalRoom_list)
                        if (response.data.pageinfo.curPage < response.data.pageinfo.totalpages) MY_API.LITTLE_HEART.getMedalRoomList(page + 1);
                    }, () => {
                        window.toast('[小心心]获取勋章列表失败，请检查网络', 'error');
                        return delayCall(() => MY_API.LITTLE_HEART.getMedalRoomList(page));
                    });
                },

                checkRoomList: async (roomList) => {
                    let returnRoom = [];
                    for (let r of roomList) {
                        await BAPI.room.get_info(r).then((re) => {
                            if (re.data.live_status === 1) {
                                returnRoom = returnRoom.concat(re.data.room_id);
                                return
                            }
                        }, () => {
                            window.toast('[小心心]获取房间信息失败，请检查网络', 'error');
                            return delayCall(() => MY_API.LITTLE_HEART.checkRoomList(roomList));
                        });
                    };
                    MYDEBUG('MY_API.LITTLE_HEART.checkRoomList returnRoom', returnRoom)
                    if (returnRoom != undefined) {
                        return returnRoom
                    } else {
                        window.toast('[小心心]当前粉丝勋章列表中无正在直播房间，5分钟后重试');
                        return delayCall(() => MY_API.LITTLE_HEART.getMedalRoomList(page), 300e3);
                    }
                },
                checkRoom: async (roomid) => {
                    let roomCheck = undefined;
                    await BAPI.room.get_info(roomid).then((re) => {
                        if (re.data.live_status === 1) {//live_status=1
                            roomCheck = true;
                        } else {
                            roomCheck = false;
                        }
                    }, () => {
                        window.toast('[小心心]获取房间信息失败，请检查网络', 'error');
                        return delayCall(() => MY_API.LITTLE_HEART.checkRoomList(roomList));
                    });
                    return roomCheck;
                },
                doHeartBeat: async (roomId) => {
                    if (liveRoom_list.indexOf(roomId) == -1) return
                    MYDEBUG('[小心心]打开房间', liveRoom_list);
                    const index = layer.open({
                        title: `${roomId}`,
                        type: 2,
                        shade: 0,
                        content: `https://live.bilibili.com/${roomId}?cut`,
                        end: () => {
                            clearTimeout(Timer);
                            delListItem(roomId, liveRoom_list);
                            delListItem(index, layerIndex_list)
                        }
                    });/*
                    layer.style(index, { // 隐藏弹窗
                        display: 'none',
                    });*/
                    layerIndex_list.push(index);
                    let Timer = setTimeout(async () => {
                        if (!checkNewDay(MY_API.CACHE.LittleHeart_TS)) {
                            MYDEBUG('[小心心]', `今日任务完成，房间${roomId}不再打开`);
                            return
                        }
                        if (!MY_API.LITTLE_HEART.checkRoom(roomId)) {
                            //不开播则删除房间记录，重新运行run
                            window.toast(`[小心心]房间${roomId}下播，再次寻找开播房间`, 'info');
                            layer.close(index);
                            return MY_API.LITTLE_HEART.run();
                        };//如果小心心未全部获取且开播，关闭窗口再打开
                        MYDEBUG('[小心心]关闭窗口 roomId', roomId);
                        layer.close(index);
                        return MY_API.LITTLE_HEART.doHeartBeat(roomId);
                    }, 310e3);
                },
                checkHeart: () => {
                    const checkbag = () => {
                        BAPI.gift.bag_list().then((re) => {
                            MYDEBUG('[小心心]检查包裹', re)
                            let heart = re.data.list.filter(r => r.gift_id == 30607 && r.gift_num == 24 && r.corner_mark == "7天");
                            MYDEBUG('[小心心]包裹内7天24个小心心', heart);
                            if (heart.length > 0) {
                                clearInterval(timer);
                                window.toast('[小心心]今日小心心已全部获取', 'success');
                                MY_API.CACHE.LittleHeart_TS = ts_ms();
                                MY_API.saveCache();
                                closeAllIndex(layerIndex_list);
                                return runMidnight(MY_API.LITTLE_HEART.run, "获取小心心");
                            }
                        })
                    }
                    checkbag();
                    let timer = setInterval(() => {
                        checkbag();
                    }, 310e3);
                    return
                },
                run: () => {
                    if (!MY_API.CONFIG.LITTLE_HEART) return $.Deferred().resolve();
                    if (!checkNewDay(MY_API.CACHE.LittleHeart_TS)) {
                        return runMidnight(MY_API.LITTLE_HEART.run, "获取小心心");
                    };
                    const runFunc = async () => {
                        await MY_API.LITTLE_HEART.getMedalRoomList();
                        liveRoom_list = await MY_API.LITTLE_HEART.checkRoomList(MY_API.LITTLE_HEART.medalRoom_list);
                        let tabNum = 0;
                        for (let room of liveRoom_list) {
                            if (tabNum < MY_API.CONFIG.MAX_TAB) {
                                await MY_API.LITTLE_HEART.doHeartBeat(room);
                                tabNum++;
                            } else {
                                break;
                            }
                        };
                        MY_API.LITTLE_HEART.checkHeart();
                    };
                    if (!MY_API.CONFIG.BLOCK_LIVE_VIDEO) {
                        layer.confirm('若不勾选【拦截挂小心心打开窗口的直播流】将耗费大量流量，是否继续？', {
                            title: '警告',
                            btn: ['是', '否'] //按钮
                        }, async () => {
                            layer.msg('那算了╮(￣▽￣)╭', {
                                time: 2000
                            });
                            runFunc();
                        }, function () {
                            layer.msg('勾选【拦截挂小心心打开窗口的直播流】后需刷新页面使其生效', {
                                time: 2500
                            });
                        });
                    } else {
                        runFunc();
                    }
                    return
                }
            }
        };

        MY_API.init().then(() => {//主函数
            try {
                const promiseInit = $.Deferred();
                const uniqueCheck = () => {
                    const t = Date.now();
                    if (t - MY_API.CACHE.UNIQUE_CHECK >= 0 && t - MY_API.CACHE.UNIQUE_CHECK <= 15e3) {
                        // 其他脚本正在运行
                        $('.link-toast').hide();
                        $('.igiftMsg').hide();
                        MY_API.CONFIG.AUTO_TREASUREBOX = false;
                        window.toast('有其他直播间页面的脚本正在运行，本页面脚本停止运行', 'caution');
                        return promiseInit.reject();
                    } else {
                        // 没有其他脚本正在运行 /https?:\/\/live\.bilibili\.com\/.*\?cut/.test(window.location.href)
                        return promiseInit.resolve();
                    }
                };
                uniqueCheck().then(() => {
                    let timer_unique;
                    const uniqueMark = () => {
                        timer_unique = setTimeout(uniqueMark, 10e3);
                        MY_API.CACHE.UNIQUE_CHECK = Date.now();
                        MY_API.saveCache(false);
                    };
                    window.addEventListener('unload', () => {
                        if (timer_unique) {
                            clearTimeout(timer_unique);
                            MY_API.CACHE.UNIQUE_CHECK = 0;
                            MY_API.saveCache();
                        }
                        closeAllIndex(layerIndex_list);
                    });
                    uniqueMark();
                    if (parseInt(Live_info.uid) === 0 || isNaN(parseInt(Live_info.uid))) {//登陆判断
                        MY_API.chatLog('未登录，请先登录再使用脚本', 'warning');
                        return
                    };
                    MY_API.newMessage(GM_info.script.version);//新版本提示信息
                    MYDEBUG('MY_API.CONFIG', MY_API.CONFIG);
                    StartPlunder(MY_API);
                })
            }
            catch (e) {
                console.error('重复运行检测错误', e);
            }

        });
    }

    function StartPlunder(API) {
        'use strict';
        //清空辣条数量
        let clearStat = () => {
            API.GIFT_COUNT.COUNT = 0;
            API.GIFT_COUNT.CLEAR_TS = dateNow();
            API.saveGiftCount();
            MYDEBUG('已清空辣条数量')
        }
        if (checkNewDay(API.GIFT_COUNT.CLEAR_TS)) clearStat();
        runExactMidnight(clearStat, '重置统计');
        API.LITTLE_HEART.run();//小心心
        API.removeUnnecessary();//移除页面元素
        setTimeout(() => {
            API.GroupSign.run();//应援团签到
            API.DailyReward.run();//每日任务
            API.LiveReward.run();//直播每日任务
            API.Exchange.runS2C();//银瓜子换硬币
            API.TreasureBox.run();//领宝箱
            API.Gift.run();//送礼物
            API.MobileHeartBeat.run();//移动端心跳
        }, 6e3);//脚本加载后6秒执行任务
        API.creatSetBox();//创建设置框
        BAPI.room.getList().then((response) => {//获取各分区的房间号
            MYDEBUG('直播间列表', response);
            for (const obj of response.data) {
                BAPI.room.getRoomList(obj.id, 0, 0, 1, 1).then((response) => {
                    MYDEBUG('直播间号列表', response);
                    for (let j = 0; j < response.data.length; ++j) {
                        API.listen(response.data[j].roomid, Live_info.uid, `${obj.name}区`);
                    }
                });
            }
        });
        let check_top_room = () => { //检查小时榜房间
            if (API.GIFT_COUNT.COUNT >= API.CONFIG.MAX_GIFT) {//判断是否超过辣条限制
                MYDEBUG('超过今日辣条限制，不参与抽奖');
                API.max_blocked = true;
            }
            if (API.blocked || API.max_blocked) {//如果被禁用则停止
                if (API.blocked) {
                    API.chatLog('进入小黑屋检查小时榜已停止运行');
                    clearInterval(check_timer);
                    return
                }
                else {
                    API.chatLog('辣条已达到最大值检查小时榜已停止运行');
                    return
                }
            }
            if (inTimeArea(API.CONFIG.TIME_AREA_START_H0UR, API.CONFIG.TIME_AREA_END_H0UR, API.CONFIG.TIME_AREA_START_MINUTE, API.CONFIG.TIME_AREA_END_MINUTE) && API.CONFIG.TIME_AREA_DISABLE) {//判断时间段
                API.chatLog('当前时间段不检查小时榜礼物', 'warning');
                return
            }

            const AreaIdList = [
                '小时总榜',
                '娱乐小时榜',
                '网游小时榜',
                '手游小时榜',
                '绘画小时榜',
                '电台小时榜',
                '单机小时榜',
            ];
            let AreaNum = 1;//总榜中的抽奖肯定在对应分区榜，无需检查
            let checkHourRank = (areaId) => {
                BAPI.rankdb.getTopRealTimeHour(areaId).then((data) => {
                    let list = data.data.list;// [{id: ,link:}]
                    API.chatLog(`检查${AreaIdList[areaId]}房间的礼物`, 'warning');
                    MYDEBUG(`${AreaIdList[areaId]}房间列表`, list);
                    for (let i of list) {
                        API.checkRoom(i.roomid, `小时榜-${i.area_v2_parent_name}区`);
                    }
                })
            };
            let timer = setInterval(() => {
                if (AreaNum <= AreaIdList.length - 1) {
                    checkHourRank(AreaNum);
                    AreaNum++;
                }
                else {
                    clearInterval(timer)
                }
            }, 1000);
        };
        setTimeout(check_top_room, 6e3);//加载脚本后6秒检查一次小时榜
        let check_timer = setInterval(check_top_room, parseInt(API.CONFIG.CHECK_HOUR_ROOM_INTERVAL * 1000));

        let reset = (delay) => {
            let resetTimer = setTimeout(() => {//重置直播间
                if (API.raffleId_list.length > 0 || API.guardId_list.length > 0 || API.pkId_list.length > 0) {
                    MYDEBUG('[刷新直播间]', '还有礼物没抽，延迟15s后刷新直播间');
                    reset(15000);
                    return
                }
                if (checkNewDay(API.CACHE.LittleHeart_TS)) {
                    MYDEBUG('[刷新直播间]', '正在发送获取小心心，10分钟后再次检查');
                    clearTimeout(resetTimer);
                    reset(600e3);
                    return
                }
                if (inTimeArea(API.CONFIG.TIME_AREA_START_H0UR, API.CONFIG.TIME_AREA_END_H0UR, API.CONFIG.TIME_AREA_START_MINUTE, API.CONFIG.TIME_AREA_END_MINUTE)
                    && API.CONFIG.IN_TIME_RELOAD_DISABLE) {//在不抽奖时段且不抽奖时段不刷新开启
                    let resetTime = getIntervalTime(API.CONFIG.TIME_AREA_START_MINUTE, API.CONFIG.TIME_AREA_END_MINUTE) + 60e3;
                    reset(resetTime);
                    MYDEBUG('[刷新直播间]', `处于休眠时间段，将在${resetTime}毫秒后刷新直播间`);
                    return;
                }
                /* if (API.blocked || API.max_blocked) { //被阻止不刷新直播间
                     return
                 }*/
                window.location.reload();
            }, delay);
        };

        reset(API.CONFIG.TIME_RELOAD * 60000);//单位1分钟，重新加载直播间
    }

    /**
     * （23,50） 获取与目标时间在时间轴上的间隔时间,24小时制（毫秒）
     * @param hour 整数 小时
     * @param minute 整数 分钟
     * @returns {number} intervalTime
     */
    function getIntervalTime(hour, minute) {
        let myDate = new Date();
        let h = myDate.getHours();
        let m = myDate.getMinutes();
        let s = myDate.getSeconds();
        let TargetTime = hour * 3600 * 1e3 + minute * 60 * 1e3;
        let nowTime = h * 3600 * 1e3 + m * 60 * 1e3 + s * 1e3;
        let intervalTime = TargetTime - nowTime;
        MYDEBUG("[getIntervalTime]获取间隔时间", intervalTime + '毫秒');
        if (intervalTime < 0) {
            return 24 * 3600 * 1e3 + intervalTime
        }
        else {
            return intervalTime
        }
    }
    /**
     * 删除一维数组中指定元素
     * @param item 元素
     * @param list 数组
     * @returns {boolean}
     */
    function delListItem(item, list) {
        list.splice(list.indexOf(item), 1)
    }

    /**
     * 关闭所有由layer打开的index
     * @param layerIndex_list 数组
     */
    function closeAllIndex(list) {
        if (list != undefined) {
            for (const Index of list) {
                layer.close(Index)
            }
        }
        return
    }
    function blockLiveStream() {/*
        unsafeWindow.fetch = (...arg) => {
            console.log('fetch arg', ...arg);
            if (arg[0].indexOf('bilivideo.com') > -1 && /https?:\/\/live\.bilibili\.com\/.*\?cut/.test(window.location.href)) {
                console.log('拦截直播流')
                return new Promise(() => {
                throw new Error();
                });
            } else {
                console.log('通过')
                return originFetch(...arg);
            }
        }*/
        if($('[data-title="Flash播放器"]').length > 0) $('[data-title="Flash播放器"]').click();
        else setTimeout(() => blockLiveStream(), 200);
    };
    /**
     * （1000000000） 获取到明天的目标时间戳所在的相同【时间点】所需时间（毫秒）
     * @param date 整数 时间戳
     * @returns {number} intervalTime
     */
    /*
    function GetTomorrowIntervalTime(date) {
        let intervalTime = ts_ms() - date;
        MYDEBUG("[GetTomorrowIntervalTime]获取间隔时间", intervalTime + '毫秒');
        if (intervalTime > 24 * 3600 * 1e3) {
            return intervalTime;
        }
        else {
            return 24 * 3600 * 1e3 - intervalTime;
        }
    }*/
    /**
     * （23,50） 当前时间是否为23:50
     * @param hour 整数 小时
     * @param minute 整数 分钟
     * @returns {boolean}
     */
    function isTime(hour, minute) {
        let myDate = new Date();
        let h = myDate.getHours();
        let m = myDate.getMinutes();
        if (h == hour && m == minute) {
            return true
        } else {
            MYDEBUG("错误时间");
            return false
        }
    }
    /**
     * （2,10,0,1） 当前是否在两点0分到十点0分之间
     * @param sH 整数 起始小时
     * @param eH 整数 终止小时
     * @param sM 整数 起始分钟
     * @param eM 整数 终止分钟
     * @returns {boolean}
     */
    function inTimeArea(sH, eH, sM, eM) {
        if (sH > 23 || eH > 24 || sH < 0 || eH < 1 || sM > 59 || sM < 0 || eM > 59 || eM < 0) {
            return false
        }
        let myDate = new Date();
        let h = myDate.getHours();
        let m = myDate.getMinutes();
        if (sH < eH) {//如(2,0,8,0)
            if (h >= sH && h < eH)
                return true;
            else if (h == eH && m >= sM && m < eM)
                return true;
            else return false;
        }
        else if (sH > eH) {//如(22,0,12,0)
            if (h >= sH || h < eH)
                return true;
            else if (h == eH && m >= sM && m < eM)
                return true;
            else return false;
        }
        else if (sH == eH) {
            if (h == sH && sM <= eM && m >= sM && m < eM)
                return true
            else if (h == sH && sM > eM && m <= eM && m > sM)
                return true
            else return false;
        }
    };

    function sleep(millisecond) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, millisecond)
        })
    }

    /**
     * 概率
     * @param val
     * @returns {boolean}
     */
    function probability(val) {
        if (val <= 0) return false;
        let rad = Math.random();
        return (val / 100) >= rad
    }

    const dateNow = () => Date.now();
    /**
     * 检查是否为新一天
     * @param ts
     * @returns {boolean}
     */
    const checkNewDay = (ts) => {
        if (ts === 0) return true;
        let t = new Date(ts);
        let d = new Date();
        let td = t.getDate();
        let dd = d.getDate();
        return (dd !== td);
    };

    function XHR(XHROptions) {
        return new Promise(resolve => {
            const onerror = (error) => {
                console.error('XHR', error);
                resolve(undefined);
            };
            if (XHROptions.GM) {
                if (XHROptions.method === 'POST') {
                    if (XHROptions.headers === undefined)
                        XHROptions.headers = {};
                    if (XHROptions.headers['Content-Type'] === undefined)
                        XHROptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
                }
                XHROptions.timeout = 30 * 1000;
                XHROptions.onload = res => { resolve(res.response) };
                XHROptions.onerror = onerror;
                XHROptions.ontimeout = onerror;
                GM_xmlhttpRequest(XHROptions);
            }
            else {
                const xhr = new XMLHttpRequest();
                xhr.open(XHROptions.method, XHROptions.url);
                if (XHROptions.method === 'POST' && xhr.getResponseHeader('Content-Type') === null)
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
                if (XHROptions.cookie)
                    xhr.withCredentials = true;
                if (XHROptions.responseType !== undefined)
                    xhr.responseType = XHROptions.responseType;
                xhr.timeout = 30 * 1000;
                xhr.onload = ev => {
                    const res = ev.target;
                    resolve({ response: res, body: res.response });
                };
                xhr.onerror = onerror;
                xhr.ontimeout = onerror;
                xhr.send(XHROptions.data);
            }
        });
    };


})();
