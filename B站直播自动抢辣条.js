// ==UserScript==
// @namespace     https://github.com/andywang425
// @name          B站直播自动抢辣条
// @name:en       B站直播自动抢辣条
// @author        andywang425
// @description   自动参与Bilibili直播区广播礼物及小时榜房间礼物的抽奖;完成每日任务
// @description:en 自动参与Bilibili直播区广播礼物及小时榜房间礼物的抽奖;完成每日任务
// @updateURL     https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js
// @downloadURL    https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js
// @homepageURL   https://github.com/andywang425/Bilibili-SGTH/
// @supportURL    https://github.com/andywang425/Bilibili-SGTH/issues
// @icon          https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png
// @copyright     2020, andywang425 (https://github.com/andywang425)
// @license       MIT
// @version       3.0
// @include      /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH@v1.2/BilibiliAPI_Mod.min.js
// @require      https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH@v1.2/OCRAD.min.js
// @grant        none
// ==/UserScript==
let msgHide = false; //UI隐藏开关
let logSwitch = true; //控制开关
let NAME = 'IGIFTMSG';
let BAPI = BilibiliAPI;
let server_host;
let gift_join_try = 0;
let guard_join_try = 0;
let pk_join_try = 0;
const tz_offset = new Date().getTimezoneOffset() + 480;
const ts_ms = () => Date.now();
const ts_s = () => Math.round(ts_ms() / 1000);
if (!logSwitch) {
    console.log = () => {};//关闭控制台日志输出
}
let Live_info = {
    room_id: undefined,
    uid: undefined,
    ruid : undefined,
    mobile_verify: undefined,
    gift_list: undefined,
    rnd : undefined,
    visit_id : undefined
};
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
const runTomorrow = (callback,msg) => {
    const t = new Date();
    let name = msg || ' ';
    t.setMinutes(t.getMinutes() + tz_offset);
    t.setDate(t.getDate() + 1);
    t.setHours(0, 1, 0, 0);
    t.setMinutes(t.getMinutes() - tz_offset);
    setTimeout(callback, t - ts_ms());
    console.log('runTomorrow', name + " " + t.toString());
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
            if (BilibiliLive === undefined || parseInt(BilibiliLive.UID) === 0 || isNaN(parseInt(BilibiliLive.UID))) {
                loadInfo(1000);
                console.log('无配置信息');
            } else {
                Live_info.room_id = BilibiliLive.ROOMID;
                Live_info.uid = BilibiliLive.UID;
                BAPI.live_user.get_info_in_room(Live_info.room_id).then((response) => {
                    console.log('InitData: API.live_user.get_info_in_room', response);
                    Live_info.mobile_verify = response.data.info.mobile_verify;
                });
                BAPI.gift.gift_config().then((response) => {
                    console.log('InitData: API.gift.gift_config', response);
                    Live_info.gift_list = response.data;
                    Live_info.gift_list.forEach((v, i) => {
                        if (i % 3 === 0) Live_info.gift_list_str += '<br>';
                        Live_info.gift_list_str += `${v.id}：${v.name}`;
                        if (i < Live_info.gift_list.length - 1) Live_info.gift_list_str += '，';
                    });
                });
                Live_info.ruid = window.BilibiliLive.ANCHOR_UID;
                Live_info.rnd = window.BilibiliLive.RND;
                Live_info.visit_id = window.__statisObserver ? window.__statisObserver.__visitId : '';
                console.log(Live_info);
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
        input[type=checkbox] {
            margin-right: 10px;
            cursor: pointer;
            width: 10px;
            height: 10px;
            position: relative;
        }

        input[type=checkbox]:after {
            position: absolute;
            width: 8px;
            height: 10px;
            top: 0;
            content: " ";
            background-color: #fff;
            color: #fff;
            display: inline-block;
            visibility: visible;
            border: 1px solid grey;
            padding: 0 2px;
            border-radius: 2px;
        }

        input[type=checkbox]:checked:after {
            background-color: #0f97e7;
            content: "✔";
            font-size: 10px;
        }

        input[type=checkbox]:disabled:after {
            width: 8px;
            height: 10px;
            top: 0;
            color: #fff;
            display: inline-block;
            visibility: visible;
            border: 1px solid grey;
            padding: 0 2px;
            border-radius: 2px;
            background-color: #E9E7E3;
            content: "✔";
            font-size: 10px;
        }
    </style>
        `)
}
function init() {//API初始化
    const MY_API = {
        CONFIG_DEFAULT: {
            TIME_RELOAD: 60,//直播间重载时间
            RANDOM_DELAY: true,//抽奖随机延迟
            RND_DELAY_START: 2,//延迟最小值
            RND_DELAY_END: 5,//延迟最大值
            TIME_AREA_DISABLE: true,//不抽奖时段开关
            TIME_AREA_START_H0UR: 2,//不抽奖开始小时
            TIME_AREA_END_H0UR: 8,//不抽奖结束小时
            TIME_AREA_START_MINUTE: 0,//不抽奖开始分钟
            TIME_AREA_END_MINUTE: 0,//不抽奖结束分钟
            RANDOM_SKIP: 0,//随机跳过抽奖概率
            MAX_GIFT: 99999,//辣条上限
            IN_TIME_RELOAD_DISABLE: false,//休眠时段是否禁止刷新直播间 false为刷新
            RANDOM_SEND_DANMU: 0,//随机弹幕发送概率
            CHECK_HOUR_ROOM_INTERVAL: 120,//小时间检查间隔时间(秒)
            AUTO_GROUP_SIGN: true,//应援团签到开关
            LIVE_SIGN: true,//直播区签到
            FORCE_LOTTERY: false,//黑屋强制抽奖
            LOGIN: true,//主站登陆
            WATCH: true,//观看视频
            COIN: false,//投币
            COIN_NUMBER: 0,//投币数量
            SHARE: true,//分享
            AUTO_TREASUREBOX: true,//每日宝箱
            SILVER2COIN: false,//银瓜子换硬币
            AUTO_GIFT: false,//自动送礼
            GIFT_INTERVAL : 10,//送礼检查间隔
            GIFT_SORT : false,//送礼优先高等级
            AUTO_GIFT_ROOMID : "0",//送礼优先房间
            GIFT_LIMIT : 86400,//礼物到期时间
            SEND_ALL_GIFT : false//送满全部勋章
        },
        CACHE_DEFAULT: {
            UNIQUE_CHECK: 0,//唯一运行检测
            AUTO_GROUP_SIGH_TS: 0,//应援团执行时间，用于判断是否为新的一天
            DailyReward_TS: 0,//其它每日任务
            LiveReward_TS: 0,//直播每日任务
            TreasureBox_TS: 0,//银瓜子宝箱
            Silver2Coin_TS: 0,//银瓜子换硬币
            Gift_TS: 0//自动送礼
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
                BAPI.setCommonArgs(BAPI.getCookie('bili_jct'));// 设置token
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
                MY_API.chatLog('API初始化出错', 'warning');
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
            }, 5000);

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
                console.log('API载入配置失败，加载默认配置', e);
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
                console.log('CACHE载入配置失败，加载默认配置', e);
                MY_API.setDefaults();
                p.reject()
            }
            return p
        },
        saveConfig: () => {//保存配置函数
            try {
                localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                MY_API.chatLog('配置已保存');
                console.log(MY_API.CONFIG);
                return true
            } catch (e) {
                console.log('API保存出错', e);
                return false
            }
        },
        saveCache: () => {//保存配置函数
            try {
                localStorage.setItem(`${NAME}_CACHE`, JSON.stringify(MY_API.CACHE));
                console.log('CACHE已保存', MY_API.CACHE);
                return true
            } catch (e) {
                console.log('CACHE保存出错', e);
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
        setDailyTasksDefaults: () => {
            window.toast('3秒后刷新页面并再次执行每日任务', 'info')
            setTimeout(() => {
                MY_API.CACHE = MY_API.CACHE_DEFAULT;
                MY_API.saveCache();
                window.location.reload()
            }, 3000);
        },
        loadGiftCount: () => {//读取礼物数量
            try {
                let config = JSON.parse(localStorage.getItem(`${NAME}_GIFT_COUNT`));
                for (let item in MY_API.GIFT_COUNT) {
                    if (!MY_API.GIFT_COUNT.hasOwnProperty(item)) continue;
                    if (config[item] !== undefined && config[item] !== null) MY_API.GIFT_COUNT[item] = config[item];
                }
                console.log(MY_API.GIFT_COUNT);
            } catch (e) {
                console.log('读取统计失败', e);
            }
        },
        saveGiftCount: () => {
            try {
                localStorage.setItem(`${NAME}_GIFT_COUNT`, JSON.stringify(MY_API.GIFT_COUNT));
                console.log('统计保存成功', MY_API.GIFT_COUNT);
                return true
            } catch (e) {
                console.log('统计保存出错', e);
                return false
            }
        },
        addGift: (count) => {
            MY_API.GIFT_COUNT.COUNT += count;
            $('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);
            MY_API.saveGiftCount();
        },
        addSilver: (count) => {
            MY_API.GIFT_COUNT.SILVER_COUNT += (count * 10);
            $('#giftCount span:eq(2)').text(MY_API.GIFT_COUNT.SILVER_COUNT);
            MY_API.saveGiftCount();
        },
        checkUpdate: () => {
            window.open('https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js', '_blank').location;
        },

        creatSetBox: () => {//创建设置框
            let unnecessaryList = [//移除不必要的页面元素
                '#my-dear-haruna-vm',//2233
                '.june-activity-entry',//活动入口
                //'.rank-banner',//周星计划
                //'.chaos-pk-banner'//大乱斗信息
            ];
            for(let i of unnecessaryList) {
                $(i).remove();
            };
            //添加按钮
            let btn = $('<button style="display: inline-block; float: left; margin-right: 7px;background-color: #23ade5;color: #fff;border-radius: 4px;border: none; padding:4px; cursor: pointer;box-shadow: 1px 1px 2px #00000075;" id="hiderbtn">隐藏窗口和抽奖信息<br></button>');

            btn.click(() => {
                if (msgHide == false) {
                    msgHide = true;
                    $('.igiftMsg').hide();
                    div.hide();
                    let ct = $('.chat-history-list');
                    ct.animate({ scrollTop: 0 }, 0);
                    setTimeout(() => {ct.animate({ scrollTop: ct.prop("scrollHeight") }, 10)}, 100);
                    document.getElementById('hiderbtn').innerHTML = "显示窗口和抽奖信息";
                }
                else {
                    msgHide = false;
                    $('.igiftMsg').show();
                    div.show();
                    let ct = $('.chat-history-list');
                    ct.animate({ scrollTop: ct.prop("scrollHeight") }, 0);
                    document.getElementById('hiderbtn').innerHTML = "隐藏窗口和抽奖信息";
                }
            });
            $('.attention-btn-ctnr').append(btn);
            let div = $('<div>');

            div.css({
                'width': 'auto',
                'height': 'auto',
                'position': 'absolute',
                'top': '0px',
                'right': '0px',
                'background': '#F0F0F0',
                'padding': '10px',
                'z-index': '10001',
                'border-radius': '4px',
                'overflow': 'hidden',
            });

            div.append(`
<fieldset class="igiftMsg_fs">
     <legend style = "color: black">今日统计</legend>
            <div id="giftCount" style="font-size: large; text-shadow: 1px 1px #00000066; color: blueviolet;">
            辣条&nbsp;<span>${MY_API.GIFT_COUNT.COUNT}</span>
            银瓜子&nbsp;<span>${MY_API.GIFT_COUNT.SILVER_COUNT}万</span>
            <button style="font-size: small" class="igiftMsg_btn" data-action="save">保存所有设置</button>
            </div>
</fieldset>

<fieldset class="igiftMsg_fs" style="float: right;">
     <legend style = "color: black">低调设置</legend>
     <div data-toggle="RANDOM_DELAY">
        <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
        <input style="vertical-align: text-top;" type="checkbox">抽奖附加随机延迟
        <input class="RND_DELAY_START igiftMsg_input" style="width: 20px;vertical-align: top;" type="text">~
        <input class="RND_DELAY_END igiftMsg_input" style="width: 20px;vertical-align: top;" type="text">s
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
        随机跳过礼物(0到100,为0则不跳过)<input class="per igiftMsg_input" style="width: 20px;" type="text">%
        </label>
    </div>
    <div data-toggle="MAX_GIFT">
        <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
        当天最多抢辣条数量<input class="num igiftMsg_input" style="width: 100px;" type="text">
        </label>
    </div>
    <div data-toggle="RANDOM_SEND_DANMU">
        <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
        抽奖时活跃弹幕发送概率(0到5,为0则不发送)<input class="per igiftMsg_input" style="width: 20px;" type="text">%
        </label>
    </div>
    <div data-toggle="CHECK_HOUR_ROOM_INTERVAL">
    <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
        检查小时榜间隔时间<input class="num igiftMsg_input" style="width: 25px;" type="text">秒
    </label>
</div>
    </div>
    <fieldset class="igiftMsg_fs">
<legend style = "color: black">说明</legend>
    所有输入的数据必须为整数。<br>
    自动送礼中如果要填写多个优先送礼房间，<br>
    每个房间号之间需用半角逗号,隔开。<br>
    如 666,777,888。为0则不送。<br>
    若不勾选送礼优先高等级粉丝牌则优先送低等级粉丝牌。<br>
    送礼设置优先级:<br>
    优先送礼房间>送礼优先高等级粉丝牌
</fieldset>
</fieldset>

<fieldset class="igiftMsg_fs">
    <legend style = "color: black">每日任务设置</legend>
    <div data-toggle="LOGIN" style ="line-height: 15px; color: black">
    <input style="vertical-align: text-top;" type="checkbox">
    登陆
    </div>
    <div data-toggle="WATCH" style ="line-height: 15px; color: black">
    <input style="vertical-align: text-top;" type="checkbox">
    观看视频
    </div>
    <div data-toggle="COIN" style ="line-height: 15px; color: black">
    <label style="cursor: pointer">
    <input style="cursor: pointer; vertical-align: text-top;" type="checkbox">
    自动投币<input class="coin_number igiftMsg_input" style="width: 40px;" type="text">个
    </label>
    </div>
    <div data-toggle="SHARE" style ="line-height: 15px; color: black">
    <input style="vertical-align: text-top;" type="checkbox">
    分享视频
    </div>
    <div data-toggle="SILVER2COIN"style ="line-height: 15px; color: black">
    <input style="vertical-align: text-top;" type="checkbox">
    银瓜子换硬币
    </div>
    <div data-toggle="LIVE_SIGN" style ="line-height: 15px; color: black">
    <input style="vertical-align: text-top;" type="checkbox">
    直播区签到
    </div>
    <div data-toggle="AUTO_GROUP_SIGN" style ="line-height: 15px; color: darkgreen">
        <input style="vertical-align: text-top;" type="checkbox">
        应援团签到
    </div>
    <div data-toggle="AUTO_TREASUREBOX" style ="line-height: 15px; color: purple">
        <input style="vertical-align: text-top;" type="checkbox">
        自动领银瓜子宝箱
    </div>

    <div data-toggle="AUTO_GIFT" style ="line-height: 15px; color: purple">
        <input style="vertical-align: text-top;" type="checkbox">
        自动送礼
    </div>

    <div data-toggle="AUTO_GIFT_ROOMID" style ="line-height: 15px; color: purple">
        优先送礼房间
        <input class="num igiftMsg_input" style="width: 150px;" type="text">
    </div>

    <div data-toggle="GIFT_INTERVAL" style ="line-height: 15px; color: purple">
        检查间隔
        <input class="num igiftMsg_input" style="width: 25px;" type="text">
        分钟
    </div>
    <div data-toggle="GIFT_LIMIT" style ="line-height: 15px; color: purple">
        礼物到期时间
        <input class="num igiftMsg_input" style="width: 100px;" type="text">
        秒
    </div>
    <div data-toggle="GIFT_SORT" style ="line-height: 15px; color: purple">
        <input style="vertical-align: text-top;" type="checkbox">
        送礼优先高等级粉丝牌
    </div>
    <div data-toggle="SEND_ALL_GIFT" style ="line-height: 15px; color: purple">
        <input style="vertical-align: text-top;" type="checkbox">
        送满全部勋章
    </div>
    <div><button data-action="reset_dailyTasks" style="color: red;" class="igiftMsg_btn">再次执行每日任务</button></div>
    </fieldset>

<fieldset class="igiftMsg_fs">
    <legend style = "color: black">其他设置</legend>
    <div data-toggle="TIME_RELOAD" style = "color: black">
    本直播间重载时间(刷新后生效)：
    <input class="delay-seconds igiftMsg_input" type="text" style="width: 30px;">分
    </div>
    <div data-toggle="IN_TIME_RELOAD_DISABLE" style = "line-height: 15px">
        <label style="margin: 5px auto; color: darkgreen">
            <input style="vertical-align: text-top;" type="checkbox">不抽奖时段不重载直播间
        </label>
    </div>
    <div data-toggle="FORCE_LOTTERY" style = "line-height: 15px">
        <label style="margin: 5px auto; color: red;">
            <input style="vertical-align: text-top;" type="checkbox">进入小黑屋后强制重复抽奖(危)
        </label>
    </div>
    <div id = "resetArea">
        <button data-action="reset" style="color: red;" class="igiftMsg_btn">重置所有为默认</button>
        <button style="font-size: small" class="igiftMsg_btn" data-action="countReset">重置统计</button>
        <button style="font-size: small; color: green;" class="igiftMsg_btn" data-action="checkUpdate">检查更新</button>
    </div>

</fieldset>

<label style ="color: darkblue">
        v3.0 <a href="https://github.com/andywang425/Bilibili-SGTH/" target="_blank">更多说明和更新日志见github上的项目说明(点我)</a>
</label>
`);

           // $('.live-player-mounter').append(div);
           $('.bilibili-live-player').append(div);

            //对应配置状态
            div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val(MY_API.CONFIG.TIME_RELOAD.toString());
            div.find('div[data-toggle="RANDOM_SKIP"] .per').val((parseInt(MY_API.CONFIG.RANDOM_SKIP)).toString());
            div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val((parseInt(MY_API.CONFIG.RANDOM_SEND_DANMU)).toString());
            div.find('div[data-toggle="MAX_GIFT"] .num').val((parseInt(MY_API.CONFIG.MAX_GIFT)).toString());
            div.find('div[data-toggle="COIN"] .coin_number').val(MY_API.CONFIG.COIN_NUMBER.toString());
            div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val(MY_API.CONFIG.RND_DELAY_START.toString());
            div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val(MY_API.CONFIG.RND_DELAY_END.toString());
            div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val(MY_API.CONFIG.TIME_AREA_START_H0UR.toString());
            div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val(MY_API.CONFIG.TIME_AREA_END_H0UR.toString());
            div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val(MY_API.CONFIG.TIME_AREA_START_MINUTE.toString());
            div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val(MY_API.CONFIG.TIME_AREA_END_MINUTE.toString());
            div.find('div[data-toggle="CHECK_HOUR_ROOM_INTERVAL"] .num').val(MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL.toString());
            div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val((MY_API.CONFIG.AUTO_GIFT_ROOMID).toString());
            div.find('div[data-toggle="GIFT_INTERVAL"] .num').val(MY_API.CONFIG.GIFT_INTERVAL.toString());
            div.find('div[data-toggle="GIFT_LIMIT"] .num').val(MY_API.CONFIG.GIFT_LIMIT.toString());


            div.find('div[id="giftCount"] [data-action="save"]').click(() => {//保存按钮
                //TIME_AREA_DISABLE（控制输入的两个小时两个分钟）
                let val = undefined;
                let valArray = undefined;
                let val1 = MY_API.CONFIG.TIME_AREA_START_H0UR = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val());
                let val2 = MY_API.CONFIG.TIME_AREA_END_H0UR = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val());
                let val3 = MY_API.CONFIG.TIME_AREA_START_MINUTE = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val());
                let val4 = MY_API.CONFIG.TIME_AREA_END_MINUTE = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val());
                if (val1 < 0 || val2 < 0 || val3 < 0 || val4 < 0) {
                    MY_API.chatLog("[定时休眠]数据小于0");
                    return
                }
                else if (val1 > 24 || val2 > 24 || val3 > 60 || val4 > 60) {
                    MY_API.chatLog("[定时休眠]时间错误");
                    return
                }
                MY_API.CONFIG.TIME_AREA_START_H0UR = val1;
                MY_API.CONFIG.TIME_AREA_END_H0UR = val2;
                MY_API.CONFIG.TIME_AREA_START_MINUTE = val3;
                MY_API.CONFIG.TIME_AREA_END_MINUTE = val4;
                //RANDOM_SKIP save
                val = parseInt(div.find('div[data-toggle="RANDOM_SKIP"] .per').val());
                if (val < 0 || val > 100) {
                    MY_API.chatLog('[随机跳过礼物]数据小于等于0或大于10000');
                    return
                }
                MY_API.CONFIG.RANDOM_SKIP = val;
                //RANDOM_SEND_DANMU save
                val = parseInt(div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val());
                if (val > 5) {
                    MY_API.chatLog("[活跃弹幕]为维护直播间弹幕氛围,弹幕发送概率不得大于5%");
                    return
                }
                else if (val < 0) {
                    MY_API.chatLog("[活跃弹幕]数据小于0");
                    return
                }
                MY_API.CONFIG.RANDOM_SEND_DANMU = val;
                //MAX_GIFT save
                val = parseInt(div.find('div[data-toggle="MAX_GIFT"] .num').val());
                MY_API.CONFIG.MAX_GIFT = val;
                //TIME_RELOAD save
                val = parseInt(div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val());
                if (val <= 0 || val > 10000) {
                    MY_API.chatLog('[直播间重载时间]数据小于等于0或大于10000');
                    return
                }
                MY_API.CONFIG.TIME_RELOAD = val;
                //RANDOM_DELAY
                val = parseInt(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val());
                val2 = parseInt(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val());

                if (val < 0 || val2 > 100) {
                    MY_API.chatLog('[抽奖延时]数据小于0或大于100');
                    return
                }
                else if (val2 <= val) {
                    MY_API.chatLog('[抽奖延时]数据大小关系不正确');
                    return
                }
                MY_API.CONFIG.RND_DELAY_START = val;
                MY_API.CONFIG.RND_DELAY_END = val2;
                //COIN
                val = parseInt(div.find('div[data-toggle="COIN"] .coin_number').val());
                if (val < 0) {
                    MY_API.chatLog("[自动投币]数据小于0");
                    return
                }
                MY_API.CONFIG.COIN_NUMBER = val;
                //CHECK_HOUR_ROOM_INTERVAL
                val = parseInt(div.find('div[data-toggle="CHECK_HOUR_ROOM_INTERVAL"] .num').val());
                if (val <= 0) {
                    MY_API.chatLog("[检查小时榜间隔]数据小于等于0");
                    return
                }
                MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL = val;
                //AUTO_GIFT_ROOMID
                val = div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val();
                valArray = val.split(",");
                for (let i = 0; i < valArray.length; i++){
                    if (valArray[i] === ''){
                       valArray[i] = 0;
                 　　}
                };
                val = valArray.join(","); 
                console.log(val);
                MY_API.CONFIG.AUTO_GIFT_ROOMID = val;
                //GIFT_INTERVAL
                val = parseInt(div.find('div[data-toggle="GIFT_INTERVAL"] .num').val());
                if (val <= 0) {
                    MY_API.chatLog("[检查送礼间隔]数据小于等于0");
                    return
                }
                MY_API.CONFIG.GIFT_INTERVAL = val;
                //GIFT_LIMIT
                val = parseInt(div.find('div[data-toggle="GIFT_LIMIT"] .num').val());
                MY_API.CONFIG.GIFT_LIMIT = val;
                MY_API.saveConfig();

            });

            div.find('button[data-action="reset"]').click(() => {//重置按钮
                MY_API.setDefaults();
            });
            div.find('button[data-action="checkUpdate"]').click(() => {//检查更新按钮
                MY_API.checkUpdate();
            });
            div.find('button[data-action="reset_dailyTasks"]').click(() => {//重置每日任务状态
                MY_API.setDailyTasksDefaults();
            });
            div.find('#resetArea [data-action="countReset"]').click(() => {//清空统计数据按钮
                MY_API.GIFT_COUNT = {
                    COUNT: 0,
                    CLEAR_TS: 0,
                };
                MY_API.saveGiftCount();
                MY_API.chatLog('已清空3秒后刷新页面');
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
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
                "SEND_ALL_GIFT"
            ];
            for (let i of checkList) {//绑定所有checkbox事件
                let input = div.find(`div[data-toggle="${i}"] input:checkbox`);
                if (MY_API.CONFIG[i]) input.attr('checked', '');
                input.change(function () {
                    MY_API.CONFIG[i] = $(this).prop('checked');
                    MY_API.saveConfig()
                });
            };

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
                default:
                    div.css({
                        'border': '1px solid rgb(203, 195, 255)',
                        'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
                    });
            }
            if (msgHide == false) {
                ct.find('#chat-items').append(div);//向聊天框加入信息
                ct.scrollTop(ct.prop("scrollHeight"));//滚动到底部
            }
        },
        blocked: false,
        max_blocked: false,
        listen: (roomId, uid, area = '本直播间') => {
            BAPI.room.getConf(roomId).then((response) => {
                server_host = response.data.host;
                console.log('服务器地址', response);
                let wst = new BAPI.DanmuWebSocket(uid, roomId, response.data.host_server_list, response.data.token);
                wst.bind((newWst) => {
                    wst = newWst;
                    MY_API.chatLog(`${area}弹幕服务器连接断开，尝试重连`, 'warning');
                }, () => {
                    MY_API.chatLog(`——————连接弹幕服务器成功——————\n房间号: ${roomId} 分区: ${area}`
                        , 'success');
                }, () => {
                    if (MY_API.blocked) {
                        wst.close();
                        MY_API.chatLog(`进了小黑屋主动与弹幕服务器断开连接-${area}`, 'warning')
                    }
                    if (MY_API.max_blocked) {
                        wst.close();
                        MY_API.chatLog(`辣条最大值主动与弹幕服务器断开连接-${area}`, 'warning')
                    }
                }, (obj) => {
                    if (inTimeArea(MY_API.CONFIG.TIME_AREA_START_H0UR, MY_API.CONFIG.TIME_AREA_END_H0UR, MY_API.CONFIG.TIME_AREA_START_MINUTE, MY_API.CONFIG.TIME_AREA_END_MINUTE) && MY_API.CONFIG.TIME_AREA_DISABLE) return;//当前是否在两点到八点 如果在则返回

                    console.log('弹幕公告' + area, obj);
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
                            MY_API.checkRoom(obj.data.winner.room_id, area);
                            break;
                        case 'NOTICE_MSG':
                            if (obj.roomid === obj.real_roomid) {
                                MY_API.checkRoom(obj.roomid, area);
                            } else {
                                MY_API.checkRoom(obj.roomid, area);
                                MY_API.checkRoom(obj.real_roomid, area);
                            }
                            break;
                        default:
                            return;
                    }
                });
            }, () => {
                MY_API.chatLog('获取弹幕服务器地址错误', 'warning')
            });
        },
        RoomId_list: [],
        err_roomId: [],
        auto_danmu_list: ["(=・ω・=)", "（￣▽￣）", "awsl", "666", "kksk", "(⌒▽⌒)", "(｀・ω・´)", "╮(￣▽￣)╭", "(￣3￣)", "Σ( ￣□￣||)",
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
            BAPI.room.room_entry_action(roomId);//直播间进入记录
            if (probability(MY_API.CONFIG.RANDOM_SEND_DANMU)) {//概率发活跃弹幕
                BAPI.sendLiveDanmu(MY_API.auto_danmu_list[Math.floor(Math.random() * 12)], roomId).then((response) => {
                    console.log('弹幕发送返回信息', response);
                })
            }//Math.floor(Math.random() * (max - min + 1) ) + min
            BAPI.xlive.lottery.check(roomId).then((re) => {
                MY_API.RoomId_list.remove(roomId);//移除房间号
                console.log('检查房间返回信息', re);
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
                    MY_API.chatLog(`[检查房间出错]${response.msg}`, 'warning');
                    if (MY_API.err_roomId.indexOf(roomId) > -1) {
                        console.log(`[检查此房间出错多次]${roomId}${re.message}`);
                    }
                    else {
                        MY_API.err_roomId.push(roomId);
                        MY_API.checkRoom(roomId, area);
                        console.log(`[检查房间出错_重试一次]${roomId}${re.message}`);
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
                    if (id_list.length > 150) {
                        id_list.splice(0, 50);//删除前50条数据
                    }
                    localStorage.setItem(`${NAME}_${type}Id_list`, JSON.stringify({ list: id_list }));
                    console.log(`${NAME}_${type}Id_list_add`, id_list);
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
                    console.log(`${NAME}_${type}Id_list_read`, config);
                    return id_list.indexOf(id) > -1
                } catch (e) {
                    localStorage.setItem(`${NAME}_${type}Id_list`, JSON.stringify({ list: id_list }));
                    console.log('读取' + `${NAME}_${type}Id_list` + '缓存错误已重置');
                    return id_list.indexOf(id) > -1
                }
            }
        },
        raffleId_list: [],
        guardId_list: [],
        pkId_list: [],
        creat_join: function (roomId, data, type, area = '本直播间') {
            console.log('礼物信息', data);
            if (MY_API.GIFT_COUNT.COUNT >= MY_API.CONFIG.MAX_GIFT) {//判断是否超过辣条限制
                console.log('超过今日辣条限制，不参与抽奖');
                MY_API.max_blocked = true;
                return
            }
            switch (type) {//防止重复抽奖上船PK
                case 'gift':
                    if (MY_API.Id_list_history.isIn(data.raffleId, 'raffle')) {
                        console.log('礼物重复');
                        return
                    } else {
                        MY_API.raffleId_list.push(data.raffleId);
                        MY_API.Id_list_history.add(data.raffleId, 'raffle');
                    }
                    break;
                case 'guard':
                    if (MY_API.Id_list_history.isIn(data.id, 'guard')) {
                        console.log('舰长重复');
                        return
                    } else {
                        MY_API.guardId_list.push(data.id);
                        MY_API.Id_list_history.add(data.id, 'guard');
                    }
                    break;
                case 'pk':
                    if (MY_API.Id_list_history.isIn(data.id, 'pk')) {
                        console.log('pk重复');
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
            if (msgHide == false) {
                ct.find('#chat-items').append(div);//向聊天框加入信息
                ct.scrollTop(ct.prop("scrollHeight"));//滚动到底部
            }
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
                                    aa.text('获得' + msg);
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
                                    aa.text('获得' + msg);
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
                                    aa.text('获得' + msg);
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
                console.log('抽奖返回信息', response);
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
                console.log('上船抽奖返回信息', response);
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
                console.log('PK抽奖返回信息', response);
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
                    console.log('GroupSign.getGroups: API.Group.my_groups', response);
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
                return BAPI.Group.sign_in(obj.group_id, obj.owner_uid).then((response) => {
                    console.log('GroupSign.signInList: API.Group.sign_in', response);
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
                        return MY_API.GroupSign.signInList(list, i);
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
                    if (!checkNewDay(MY_API.CACHE.AUTO_GROUP_SIGH_TS)) {
                        // 同一天，不再检查应援团签到
                        runTomorrow(MY_API.GroupSign.run, '应援团签到');
                        return $.Deferred().resolve();
                    }
                    return MY_API.GroupSign.getGroups().then((list) => {
                        return MY_API.GroupSign.signInList(list).then(() => {
                            MY_API.CACHE.AUTO_GROUP_SIGH_TS = ts_ms();
                            MY_API.saveCache();
                            runTomorrow(MY_API.GroupSign.run, '应援团签到');

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
                    console.log('DailyReward.login: API.DailyReward.login');
                    window.toast('[自动每日奖励][每日登录]完成', 'success');
                }, () => {
                    window.toast('[自动每日奖励][每日登录]完成失败，请检查网络', 'error');
                    return delayCall(() => MY_API.DailyReward.login());
                });
            },
            watch: (aid, cid) => {
                if (!MY_API.CONFIG.WATCH) return $.Deferred().resolve();
                return BAPI.DailyReward.watch(aid, cid, Live_info.uid, ts_s()).then((response) => {
                    console.log('DailyReward.watch: API.DailyReward.watch', response);
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
                return BAPI.DailyReward.coin(obj.aid, num).then((response) => {
                    console.log('DailyReward.coin: API.DailyReward.coin', response);
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
                    }
                    window.toast(`[自动每日奖励][每日投币]'${response.msg}`, 'caution');
                    return MY_API.DailyReward.coin(cards, n, i + 1);
                }, () => delayCall(() => MY_API.DailyReward.coin(cards, n, i)));
            },
            share: (aid) => {
                if (!MY_API.CONFIG.SHARE) return $.Deferred().resolve();
                return BAPI.DailyReward.share(aid).then((response) => {
                    console.log('DailyReward.share: API.DailyReward.share', response);
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
            dynamic: () => {
                return BAPI.dynamic_svr.dynamic_new(Live_info.uid, 8).then((response) => {
                    console.log('DailyReward.dynamic: API.dynamic_svr.dynamic_new', response);
                    if (response.code === 0) {
                        if (response.data.exist_gap === 1) {
                            const obj = JSON.parse(response.data.cards[0].card);
                            const p1 = MY_API.DailyReward.watch(obj.aid, obj.cid);
                            const p2 = MY_API.DailyReward.coin(response.data.cards, Math.max(MY_API.CONFIG.COIN_NUMBER - MY_API.DailyReward.coin_exp / 10, 0));
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
            run: () => {
                try {
                    //if (!MY_API.CONFIG.DailyReward) return $.Deferred().resolve();
                    if (!checkNewDay(MY_API.CACHE.DailyReward_TS)) {
                        // 同一天，不执行每日任务
                        runTomorrow(MY_API.DailyReward.run, '每日任务');
                        return $.Deferred().resolve();
                    }
                    return BAPI.DailyReward.exp().then((response) => {
                        console.log('DailyReward.run: API.DailyReward.exp', response);
                        if (response.code === 0) {
                            MY_API.DailyReward.coin_exp = response.number;
                            MY_API.DailyReward.login();
                            return MY_API.DailyReward.dynamic().then(() => {
                                MY_API.CACHE.DailyReward_TS = ts_ms();
                                MY_API.saveCache();
                                runTomorrow(MY_API.DailyReward.run, '每日任务');
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
                    console.log('LiveReward.dailySignIn: API.xlive.dosign', response);
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
                        runTomorrow(MY_API.LiveReward.run, '直播签到');
                        return $.Deferred().resolve();
                    }
                    MY_API.LiveReward.dailySignIn()
                    MY_API.CACHE.LiveReward_TS = ts_ms();
                    MY_API.saveCache();
                    runTomorrow(MY_API.LiveReward.run, '直播签到');
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
                    console.log('Exchange.silver2coin: API.SilverCoinExchange.silver2coin', response);
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
                        runTomorrow(MY_API.Exchange.runS2C, '瓜子换硬币');
                        return $.Deferred().resolve();
                    }
                    return MY_API.Exchange.silver2coin().then(() => {
                        MY_API.CACHE.Silver2Coin_TS = ts_ms();
                        MY_API.saveCache();
                        runTomorrow(MY_API.Exchange.runS2C, '瓜子换硬币');
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
                        if (!Live_info.mobile_verify) {
                            MY_API.TreasureBox.setMsg('未绑定<br>手机');
                            window.toast('[自动领取瓜子]未绑定手机，已停止', 'caution');
                            p.resolve();
                            return true;
                        }
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
                                console.log('TreasureBox.DOM.image.load', 'question =', question);
                                const answer = MY_API.TreasureBox.captcha.eval(question);
                                console.log('TreasureBox.DOM.image.load', 'answer =', answer);
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
                        runTomorrow(MY_API.TreasureBox.run, '领银瓜子宝箱');
                        return;
                    }
                    MY_API.TreasureBox.getCurrentTask().then((response) => {
                        console.log('TreasureBox.run: TreasureBox.getCurrentTask().then', response);
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
                            runTomorrow(MY_API.TreasureBox.run, '领银瓜子宝箱');
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
                return BAPI.TreasureBox.getAward(MY_API.TreasureBox.time_start, MY_API.TreasureBox.time_end, captcha).then((response) => {
                    console.log('TreasureBox.getAward: getAward', response);
                    switch (response.code) {
                        case 0:
                            window.toast(`[自动领取瓜子]领取了 ${response.data.awardSilver} 银瓜子`, 'success');
                        case -903: // -903: 已经领取过这个宝箱
                            // window.toast('[自动领取瓜子]已经领取过这个宝箱', 'caution');
                            return $.Deferred().resolve();
                        case -902: // -902: 验证码错误
                        case -901: // -901: 验证码过期
                        case -10017: // -10017: 验证码过期
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
                    console.log('TreasureBox.getCurrentTask: API.TreasureBox.getCurrentTask', response);
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
                        console.log('TreasureBox.captcha.calc: getCaptcha', response);
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
                // 代码来源：https://github.com/zacyu/bilibili-helper/blob/master/src/bilibili_live.js
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
                    /*execMap: (connectMap, rate = 4) => {
                        const map = [];
                        const connectMapLength = connectMap.length;
                        for (let i = 0; i < connectMapLength; ++i) {
                            let blackPoint = 0;
                            // const [x, y] = [i % 120, Math.round(i / 120)];
                            const top = connectMap[i - 120];
                            const topLeft = connectMap[i - 120 - 1];
                            const topRight = connectMap[i - 120 + 1];
                            const left = connectMap[i - 1];
                            const right = connectMap[i + 1];
                            const bottom = connectMap[i + 120];
                            const bottomLeft = connectMap[i + 120 - 1];
                            const bottomRight = connectMap[i + 120 + 1];
                            if (top) blackPoint += 1;
                            if (topLeft) blackPoint += 1;
                            if (topRight) blackPoint += 1;
                            if (left) blackPoint += 1;
                            if (right) blackPoint += 1;
                            if (bottom) blackPoint += 1;
                            if (bottomLeft) blackPoint += 1;
                            if (bottomRight) blackPoint += 1;
                            if (blackPoint > rate) map.push(1);
                            else map.push(0);
                        }
                        return map;
                    }*/
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
                        if(q[c] === '\'' && q[c+1] === '1') {
                            q[c] = '7';
                            q.splice(c + 1, 1)
                        }
                    }
                    return q;
                }
            }
        }, // Constantly Run, Need Init
        Gift : {
            interval: 600e3,
            run_timer: undefined,
            ruid: undefined,
            room_id: undefined,
            medal_list: undefined,
            bag_list: undefined,
            time: undefined,
            remain_feed: undefined,
            getMedalList: (page = 1) => {
                if (page === 1) MY_API.Gift.medal_list = [];
                return BAPI.i.medal(page, 25).then((response) => {
                    console.log('Gift.getMedalList: API.i.medal', response);
                    MY_API.Gift.medal_list = MY_API.Gift.medal_list.concat(response.data.fansMedalList);
                    if (response.data.pageinfo.curPage < response.data.pageinfo.totalpages) return MY_API.Gift.getMedalList(page + 1);
                }, () => {
                    window.toast('[自动送礼]获取勋章列表失败，请检查网络', 'error');
                    return delayCall(() => MY_API.Gift.getMedalList(page));
                });
            },
            getBagList: () => {
                return BAPI.gift.bag_list().then((response) => {
                    console.log('Gift.getBagList: API.gift.bag_list', response);
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
            run: async () => {
                const FailFunc = () => {
                    window.toast('[自动送礼]送礼失败，请检查网络', 'error');
                    return delayCall(() => MY_API.Gift.run());
                };
                try {
                    if (!MY_API.CONFIG.AUTO_GIFT) return $.Deferred().resolve();
                    if (MY_API.Gift.run_timer) clearTimeout(MY_API.Gift.run_timer);
                    MY_API.Gift.interval = MY_API.CONFIG.GIFT_INTERVAL * 60e3;
                    if (MY_API.CACHE.gift_ts) {
                        const diff = ts_ms() - MY_API.CACHE.gift_ts;
                        if (diff < MY_API.Gift.interval) {
                            MY_API.Gift.run_timer = setTimeout(MY_API.Gift.run, MY_API.Gift.interval - diff);
                            return $.Deferred().resolve();
                        }
                    }
                    await MY_API.Gift.getMedalList();
                    console.log('Gift.run: Gift.getMedalList().then: Gift.medal_list', MY_API.Gift.medal_list);
                    if(MY_API.Gift.medal_list && MY_API.Gift.medal_list.length>0){
                        MY_API.Gift.medal_list = MY_API.Gift.medal_list.filter(it=>it.dayLimit-it.today_feed>0 && it.level < 20);
                        if(MY_API.CONFIG.GIFT_SORT){
                            MY_API.Gift.medal_list.sort((a,b)=>{
                                if(b.level-a.level==0){
                                    return b.intimacy-a.intimacy;
                                }
                                return b.level-a.level;
                            });
                        }else{
                            MY_API.Gift.medal_list.sort((a,b)=>{
                                if(a.level-b.level==0){
                                    return a.intimacy-b.intimacy;
                                }
                                return a.level-b.level;
                            });
                        }
                        if(MY_API.CONFIG.AUTO_GIFT_ROOMID && MY_API.CONFIG.AUTO_GIFT_ROOMID.length>0){
                            let sortRooms = MY_API.CONFIG.AUTO_GIFT_ROOMID.split(",");
                            sortRooms.reverse();
                            for(let froom of sortRooms){
                                let rindex = MY_API.Gift.medal_list.findIndex(r=>r.roomid==froom);
                                if(rindex!=-1){
                                    let tmp = MY_API.Gift.medal_list[rindex];
                                    MY_API.Gift.medal_list.splice(rindex,1);
                                    MY_API.Gift.medal_list.unshift(tmp);
                                }
                            }
                        }
                        let limit = MY_API.CONFIG.GIFT_LIMIT;
                        for(let v of MY_API.Gift.medal_list){
                            let response = await BAPI.room.room_init(parseInt(v.roomid, 10));
                            MY_API.Gift.room_id = parseInt(response.data.room_id, 10);
                            MY_API.Gift.ruid = v.target_id;
                            MY_API.Gift.remain_feed = v.day_limit - v.today_feed;
                            if(MY_API.Gift.remain_feed > 0){
                                await MY_API.Gift.getBagList();
                                let now = ts_s();
                                if(!MY_API.CONFIG.SEND_ALL_GIFT){
                                    //送之前查一次有没有可送的
                                    let pass = MY_API.Gift.bag_list.filter(r=>![4, 3, 9, 10].includes(r.gift_id) && r.gift_num > 0 && r.expire_at > now && (r.expire_at - now < limit));
                                    if(pass.length==0){
                                        break;
                                    }
                                }
                                MY_API.CACHE.Gift_TS = ts_ms();
                                MY_API.saveCache();
                                if (MY_API.Gift.remain_feed > 0) {
                                    window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度未满[${v.today_feed}/${v.day_limit}]，预计需要[${MY_API.Gift.remain_feed}]送礼开始`, 'info');
                                    await MY_API.Gift.sendGift(v);
                                    if(!MY_API.CONFIG.SEND_ALL_GIFT){
                                        let pass = MY_API.Gift.bag_list.filter(r=>![4, 3, 9, 10].includes(r.gift_id) && r.gift_num > 0 && r.expire_at > now && (r.expire_at - now < limit));
                                        if(pass.length==0){
                                            break;
                                        }
                                    }
                                } else {
                                    window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度已满`, 'info');
                                }
                            }
                        }
                    }
                    setTimeout(MY_API.Gift.run, MY_API.Gift.interval);
                } catch (err) {
                    FailFunc();
                    window.toast('[自动送礼]运行时出现异常，已停止', 'error');
                    console.error(`[${NAME}]`, err);
                    return $.Deferred().reject();
                }
            },
            sendGift: (medal,i = 0) => {
                if (i >= MY_API.Gift.bag_list.length) {
                    return $.Deferred().resolve();
                }
                if (MY_API.Gift.remain_feed <= 0) {
                    window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼结束，今日亲密度已满[${medal.today_feed}/${medal.day_limit}]`, 'info');
                    return $.Deferred().resolve();
                }
                if (MY_API.Gift.time <= 0) MY_API.Gift.time = ts_s();
                const v = MY_API.Gift.bag_list[i];
                if (
                    //特殊礼物排除
                    (![3, 4, 9, 10, 39, 30588, 30587, 30586, 30585].includes(v.gift_id)
                     //满足到期时间
                     && v.expire_at > MY_API.Gift.time && (v.expire_at - MY_API.Gift.time < MY_API.CONFIG.GIFT_LIMIT)
                    )
                    //或者全部送满
                    || MY_API.CONFIG.SEND_ALL_GIFT){
                    // 检查SEND_ALL_GIFT和礼物到期时间 送当天到期的
                    const feed = MY_API.Gift.getFeedByGiftID(v.gift_id);
                    if (feed > 0) {
                        let feed_num = Math.floor(MY_API.Gift.remain_feed / feed);
                        if (feed_num > v.gift_num) feed_num = v.gift_num;
                        if (feed_num > 0) {
                            return BAPI.gift.bag_send(Live_info.uid, v.gift_id, MY_API.Gift.ruid, feed_num, v.bag_id, MY_API.Gift.room_id, Live_info.rnd).then((response) => {
                                console.log('Gift.sendGift: API.gift.bag_send', response);
                                if (response.code === 0) {
                                    v.gift_num -= feed_num;
                                    medal.today_feed += feed_num * feed;
                                    MY_API.Gift.remain_feed -= feed_num * feed;
                                    window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼成功，送出${feed_num}个${v.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离升级还需[${MY_API.Gift.remain_feed}]`, 'success');
                                } else {
                                    window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼异常:${response.msg}`, 'caution');
                                }
                                return MY_API.Gift.sendGift(medal,i + 1);
                            }, () => {
                                window.toast('[自动送礼]包裹送礼失败，请检查网络', 'error');
                                return delayCall(() => MY_API.Gift.sendGift(medal,i));
                            });
                        }
                    }
                }
                return MY_API.Gift.sendGift(medal,i + 1);
            }
        } // Once Run every 10 minutes

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
                }
                // 没有其他脚本正在运行
                return promiseInit.resolve();
            };
            uniqueCheck().then(() => {
                let timer_unique;
                const uniqueMark = () => {
                    timer_unique = setTimeout(uniqueMark, 10e3);
                    MY_API.CACHE.UNIQUE_CHECK = Date.now();
                    MY_API.saveCache();
                };
                window.addEventListener('unload', () => {
                    if (timer_unique) {
                        clearTimeout(timer_unique);
                        MY_API.CACHE.UNIQUE_CHECK = 0;
                        MY_API.saveCache();
                    }
                });
                uniqueMark();
                if (parseInt(Live_info.uid) === 0 || isNaN(parseInt(Live_info.uid))) {//登陆判断
                    MY_API.chatLog('未登录，请先登录再使用脚本', 'warning');
                    return
                }
                console.log(MY_API.CONFIG);
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
    let LT_Timer = () => {//判断是否清空辣条数量
        if (checkNewDay(API.GIFT_COUNT.CLEAR_TS)) {
            API.GIFT_COUNT.COUNT = 0;
            API.GIFT_COUNT.CLEAR_TS = dateNow();
            API.saveGiftCount();
            console.log('清空辣条数量')
        } else {
            console.log('无需清空辣条数量')
        }
    };
    setInterval(LT_Timer, 60e3);//每隔60秒检查是否清空辣条数量
    LT_Timer();
    setTimeout(() => {
        API.GroupSign.run();//应援团签到
        API.DailyReward.run();//每日任务
        API.LiveReward.run();//直播每日任务
        API.Exchange.runS2C();//银瓜子换硬币
        API.TreasureBox.run();//领宝箱
        API.Gift.run();//送礼物
    }, 6e3);//脚本加载后6秒执行每日任务
    API.creatSetBox();//创建设置框
    BAPI.room.getList().then((response) => {//获取各分区的房间号
        console.log('直播间列表', response);
        for (const obj of response.data) {
            BAPI.room.getRoomList(obj.id, 0, 0, 1, 1).then((response) => {
                console.log('直播间号列表', response);
                for (let j = 0; j < response.data.length; ++j) {
                    API.listen(response.data[j].roomid, Live_info.uid, `${obj.name}区`);
                }
            });
        }
    });
    let check_top_room = () => { //检查小时榜房间时钟
        if (API.GIFT_COUNT.COUNT >= API.CONFIG.MAX_GIFT) {//判断是否超过辣条限制
            console.log('超过今日辣条限制，不参与抽奖');
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

        BAPI.rankdb.getTopRealTimeHour().then(function (data) {
            let list = data.data.list;// [{id: ,link:}]
            API.chatLog('检查小时榜房间的礼物', 'warning');
            console.log(list);
            for (let i of list) {
                API.checkRoom(i.roomid, `小时榜-${i.area_v2_parent_name}区`);
            }
        })
    };

    setTimeout(check_top_room, 6e3);//加载脚本后6秒检查一次小时榜
    let check_timer = setInterval(check_top_room, parseInt(API.CONFIG.CHECK_HOUR_ROOM_INTERVAL * 1000));


    let reset = (delay) => {
        setTimeout(() => {//重置直播间
            if (API.raffleId_list.length > 0 || API.guardId_list.length > 0 || API.pkId_list.length > 0) {
                console.log('还有礼物没抽 延迟30s后刷新直播间');
                reset(30000);
                return
            }
            if (inTimeArea(API.CONFIG.TIME_AREA_START_H0UR, API.CONFIG.TIME_AREA_END_H0UR, API.CONFIG.TIME_AREA_START_MINUTE, API.CONFIG.TIME_AREA_END_MINUTE)
                && API.CONFIG.IN_TIME_RELOAD_DISABLE) {//在不抽奖时段且不抽奖时段不刷新开启
                return;
            }
            if (API.blocked || API.max_blocked) { //被阻止不刷新直播间
                return
            }
            window.location.reload();
        }, delay);
    };

    reset(API.CONFIG.TIME_RELOAD * 60000);//单位1分钟，重新加载直播间
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
    if (sH > eH || sH > 23 || eH > 24 || sH < 0 || eH < 1 || sM > 59 || sM < 0 || eM > 59 || eM < 0) {
        console.log('错误时间段');
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
        if (m >= sM && m < eM)
            return true
        else return false;
    }
}
/**
 * 概率
 * @param val
 * @returns {boolean}
 */
function probability(val) {
    if (val <= 0) return false;
    let rad = Math.ceil(Math.random() * 100);
    return val >= rad
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

