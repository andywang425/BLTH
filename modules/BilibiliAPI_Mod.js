// ==UserScript==
// @name          BilibiliAPI_mod
// @namespace     https://github.com/SeaLoong
// @version       2.0.7
// @description   BilibiliAPI，PC端抓包研究所得，原作者是SeaLoong。我在此基础上补充新的API。
// @author        SeaLoong, andywang425
// @require       https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant         none
// @include       *
// @license       MIT
// ==/UserScript==

let BAPI_csrf_token, BAPI_visit_id,
    BAPI_ts_ms = () => Date.now(),//当前毫秒
    BAPI_ts_s = () => Math.round(BAPI_ts_ms() / 1000);//当前秒
var BAPI = {
    setCommonArgs: (csrfToken = '', visitId = '') => {
        BAPI_csrf_token = csrfToken;
        BAPI_visit_id = visitId;
    },
    // 整合常用API
    TreasureBox: {
        getAward: (time_start, end_time, captcha) => BAPI.lottery.SilverBox.getAward(time_start, end_time, captcha),
        getCaptcha: (ts) => BAPI.lottery.SilverBox.getCaptcha(ts),
        getCurrentTask: () => BAPI.lottery.SilverBox.getCurrentTask()
    },
    Exchange: {
        coin2silver: (num, platform) => BAPI.pay.coin2silver(num, platform),
        silver2coin: (platform) => BAPI.pay.silver2coin(platform),
        old: {
            coin2silver: (coin) => BAPI.exchange.coin2silver(coin),
            silver2coin: () => BAPI.exchange.silver2coin()
        }
    },
    Lottery: {
        Gift: {
            check: (roomid) => BAPI.xlive.smalltv.check(roomid),
            join: (roomid, raffleId, type) => BAPI.xlive.smalltv.join(roomid, raffleId, type),
            notice: (raffleId, type) => BAPI.xlive.smalltv.notice(raffleId, type)
        },
        Raffle: {
            check: (roomid) => BAPI.activity.check(roomid),
            join: (roomid, raffleId) => BAPI.activity.join(roomid, raffleId),
            notice: (roomid, raffleId) => BAPI.activity.notice(roomid, raffleId)
        },
        MaterialObject: {
            getRoomActivityByRoomid: (roomid) => BAPI.lottery.box.getRoomActivityByRoomid(roomid),
            getStatus: (aid, times) => BAPI.lottery.box.getStatus(aid, times),
            draw: (aid, number) => BAPI.lottery.box.draw(aid, number),
            getWinnerGroupInfo: (aid, number) => BAPI.lottery.box.getWinnerGroupInfo(aid, number)
        },
        Guard: {
            check: (roomid) => BAPI.lottery.lottery.check_guard(roomid),
            join: (roomid, id, type) => BAPI.xlive.guard.join(roomid, id, type)
        },
        Pk: {
            check: (roomid) => BAPI.xlive.pk.check(roomid),
            join: (roomid, id) => BAPI.xlive.pk.join(roomid, id)
        }
    },
    Group: {
        my_groups: () => BAPI.link_group.my_groups(),
        sign_in: (group_id, owner_id) => BAPI.link_group.sign_in(group_id, owner_id)
    },
    Storm: {
        check: (roomid) => BAPI.lottery.Storm.check(roomid),
        join: (id, captcha_token, captcha_phrase, roomid, color) => BAPI.lottery.Storm.join(id, captcha_token, captcha_phrase, roomid, color),
        join_ex: (id, roomid, access_token, appKey, headers, captcha_token = "", captcha_phrase = "", color = 16777215) => BAPI.lottery.Storm.join_ex(id, roomid, access_token, appKey, headers, captcha_token = "", captcha_phrase = "", color = 16777215)
    },
    HeartBeat: {
        web: () => BAPI.user.userOnlineHeart(),
        mobile: () => BAPI.mobile.userOnlineHeart()
    },
    DailyReward: {
        task: () => BAPI.home.reward(), // CORS
        exp: () => BAPI.exp(),
        login: () => BAPI.x.now(),
        watch: (aid, cid, mid, start_ts, played_time, realtime, type, play_type, dt) => BAPI.x.heartbeat(aid, cid, mid, start_ts, played_time, realtime, type, play_type, dt),
        coin: (aid, multiply) => BAPI.x.coin_add(aid, multiply),
        share: (aid) => BAPI.x.share_add(aid)
    },
    // ajax调用B站API
    runUntilSucceed: (callback, delay = 0, maxTry = 2) => {
        if (maxTry > 0) {
            setTimeout(() => {
                if (!callback()) BAPI.runUntilSucceed(callback, 500, --maxTry);
            }, delay);
        }
    },
    processing: 0,
    ajax: (settings) => {
        if (settings.xhrFields === undefined) settings.xhrFields = {};
        settings.xhrFields.withCredentials = true;
        jQuery.extend(settings, {
            url: (settings.url.substr(0, 2) === '//' ? '' : '//api.live.bilibili.com/') + settings.url,
            method: settings.method || 'GET',
            crossDomain: true,
            dataType: settings.dataType || 'json'
        });
        const p = jQuery.Deferred();
        BAPI.runUntilSucceed(() => {
            if (BAPI.processing > 8) return false;
            ++BAPI.processing;
            return jQuery.ajax(settings).then((arg1, arg2, arg3,) => {
                --BAPI.processing;
                p.resolve(arg1, arg2, arg3);
                return true;
            }, (arg1, arg2, arg3) => {
                --BAPI.processing;
                p.reject(arg1, arg2, arg3);
                return true;
            });
        });
        return p;
    },
    ajaxWithCommonArgs: (settings) => {
        if (!settings.data) settings.data = {};
        settings.data.csrf = BAPI_csrf_token;
        settings.data.csrf_token = BAPI_csrf_token;
        settings.data.visit_id = BAPI_visit_id;
        return BAPI.ajax(settings);
    },
    // 以下按照URL分类
    ajaxGetCaptchaKey: () => {
        return BAPI.ajax({
            url: '//www.bilibili.com/plus/widget/ajaxGetCaptchaKey.php?js'
        });
    },
    exp: () => {
        // 获取今日已获得的投币经验?
        return BAPI.ajax({
            url: '//www.bilibili.com/plus/account/exp.php'
        });
    },
    msg: (roomid) => {
        return BAPI.ajaxWithCommonArgs({
            method: 'POST',
            url: 'ajax/msg',
            data: {
                roomid: roomid
            }
        });
    },
    ajaxCapsule: () => {
        return BAPI.ajax({
            url: 'api/ajaxCapsule'
        });
    },
    player: (id, ts, platform = 'pc', player_type = 'web') => {
        return BAPI.ajax({
            url: 'api/player',
            data: {
                id: typeof id === 'string' && id.substr(0, 4) === 'cid:' ? id : 'cid:' + id, // cid:{room_id}
                ts: typeof ts === 'string' ? ts : ts.toString(16), // HEX
                platform: platform,
                player_type: player_type
            },
            dataType: 'text'
        });
    },
    create: (width, height) => {
        // 生成一个验证码(用于节奏风暴)
        return BAPI.ajax({
            url: 'captcha/v1/Captcha/create',
            data: {
                width: width || '112',
                height: height || '32'
            },
            cache: false
        });
    },
    topList: (roomid, page, ruid) => {
        return BAPI.ajax({
            url: 'guard/topList',
            data: {
                roomid: roomid,
                page: page,
                ruid: ruid
            }
        });
    },
    getSuser: () => {
        return BAPI.ajax({
            url: 'msg/getSuser'
        });
    },
    refresh: (area = 'all') => {
        return BAPI.ajax({
            url: 'index/refresh?area=' + area
        });
    },
    get_ip_addr: () => {
        return BAPI.ajax({
            url: 'ip_service/v1/ip_service/get_ip_addr'
        });
    },
    getuserinfo: () => {
        return BAPI.ajax({
            url: 'user/getuserinfo'
        });
    },
    activity: {
        mobileActivity: () => {
            return BAPI.ajax({
                url: 'activity/v1/Common/mobileActivity'
            });
        },
        mobileRoomInfo: (roomid) => {
            return BAPI.ajax({
                url: 'activity/v1/Common/mobileRoomInfo',
                data: {
                    roomid: roomid
                }
            });
        },
        roomInfo: (roomid, ruid, area_v2_id, area_v2_parent_id) => {
            return BAPI.ajax({
                url: 'activity/v1/Common/roomInfo',
                data: {
                    roomid: roomid,
                    ruid: ruid,
                    area_v2_id: area_v2_id,
                    area_v2_parent_id: area_v2_parent_id
                }
            });
        },
        welcomeInfo: (roomid, ruid) => {
            return BAPI.ajax({
                url: 'activity/v1/Common/welcomeInfo',
                data: {
                    roomid: roomid,
                    ruid: ruid
                }
            });
        },
        check: (roomid) => {
            // 检查是否有活动抽奖
            return BAPI.ajax({
                url: 'activity/v1/Raffle/check?roomid=' + roomid
            });
        },
        join: (roomid, raffleId) => {
            // 参加活动抽奖
            return BAPI.ajax({
                url: 'activity/v1/Raffle/join',
                data: {
                    roomid: roomid,
                    raffleId: raffleId
                }
            });
        },
        notice: (roomid, raffleId) => {
            // 领取活动抽奖奖励
            return BAPI.ajax({
                url: 'activity/v1/Raffle/notice',
                data: {
                    roomid: roomid,
                    raffleId: raffleId
                }
            });
        },
        receive_award: (task_id) => {
            // 领取任务奖励
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'activity/v1/task/receive_award',
                data: {
                    task_id: task_id
                }
            });
        }
    },
    av: {
        getTimestamp: (platform = 'pc') => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'av/v1/Time/getTimestamp',
                data: {
                    platform: platform
                }
            });
        }
    },
    dynamic_svr: {
        dynamic_new: (uid, type = 8) => {
            // 获取动态
            return BAPI.ajax({
                url: 'dynamic_svr/v1/dynamic_svr/dynamic_new',
                data: {
                    uid: uid,
                    type: type // 8: 投稿视频; 268435455: 全部
                }
            });
        },
        space_history: (visitor_uid, host_uid, offset_dynamic_id, need_top) => {
            return BAPI.ajax({
                url: 'dynamic_svr/v1/dynamic_svr/space_history',
                data: {
                    visitor_uid: visitor_uid,
                    host_uid: host_uid,
                    offset_dynamic_id: offset_dynamic_id,
                    need_top: need_top
                }
            })
        },
        w_live_users: (size = 10) => {
            // 获取正在直播的用户
            return BAPI.ajax({
                url: '//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users',
                data: {
                    size: size
                }
            });
        }
    },
    exchange: {
        coin2silver: (coin) => {
            // 硬币兑换银瓜子(旧API)，1硬币=900银瓜子
            return BAPI.ajax({
                method: 'POST',
                url: 'exchange/coin2silver',
                data: {
                    coin: coin
                }
            });
        },
        silver2coin: () => {
            // 银瓜子兑换硬币(旧API)，1400银瓜子=1硬币
            return BAPI.ajax({
                type: 'GET',
                url: 'exchange/silver2coin'
            });
        }
    },
    fans_medal: {
        get_fans_medal_info: (uid, target_id, source = 1) => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'fans_medal/v1/fans_medal/get_fans_medal_info',
                data: {
                    source: source,
                    uid: uid,
                    target_id: target_id
                }
            });
        }
    },
    feed_svr: {
        notice: () => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'feed_svr/v1/feed_svr/notice',
                data: {}
            });
        },
        my: (page_size, live_status = 0, type = 0, offset = 0) => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'feed_svr/v1/feed_svr/my',
                data: {
                    live_status: live_status,
                    type: type,
                    page_size: page_size,
                    offset: offset
                }
            });
        }
    },
    gift: {//送礼物
        bag_list: () => {
            // 获取包裹礼物列表
            return BAPI.ajax({
                url: 'gift/v2/gift/bag_list'
            });
        },
        send: (uid, gift_id, ruid, gift_num, biz_id, rnd, coin_type = 'silver', platform = 'pc', biz_code = 'live', storm_beat_id = 0, price = 0) => {
            // 消耗瓜子送礼
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'gift/v2/gift/send',
                data: {
                    uid: uid,
                    gift_id: gift_id,
                    ruid: ruid,
                    gift_num: gift_num,
                    coin_type: coin_type,
                    bag_id: 0,
                    platform: platform,
                    biz_code: biz_code,
                    biz_id: biz_id, // roomid
                    rnd: rnd,
                    storm_beat_id: storm_beat_id,
                    metadata: '',
                    price: price
                }
            });
        },
        bag_send: (uid, gift_id, ruid, gift_num, bag_id, biz_id, rnd, platform = 'pc', biz_code = 'live', storm_beat_id = 0, price = 0) => {
            // 送出包裹中的礼物
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'gift/v2/live/bag_send',
                data: {
                    uid: uid,
                    gift_id: gift_id,
                    ruid: ruid,
                    gift_num: gift_num,
                    bag_id: bag_id,
                    platform: platform,
                    biz_code: biz_code,
                    biz_id: biz_id, // roomid
                    rnd: rnd,
                    storm_beat_id: storm_beat_id,
                    metadata: '',
                    price: price
                }
            });
        },
        gift_config: () => {
            return BAPI.ajax({
                url: 'gift/v3/live/gift_config'
            });
        },
        heart_gift_receive: (roomid, area_v2_id) => {
            return BAPI.ajax({
                url: 'gift/v2/live/heart_gift_receive',
                data: {
                    roomid: roomid,
                    area_v2_id: area_v2_id
                }
            });
        },
        heart_gift_status: (roomid, area_v2_id) => {
            return BAPI.ajax({
                url: 'gift/v2/live/heart_gift_status',
                data: {
                    roomid: roomid,
                    area_v2_id: area_v2_id
                }
            });
        },
        receive_daily_bag: () => {
            // 领取每日礼物
            return BAPI.ajax({
                url: 'gift/v2/live/receive_daily_bag'
            });
        },
        room_gift_list: (roomid, area_v2_id) => {
            return BAPI.ajax({
                url: 'gift/v2/live/room_gift_list',
                data: {
                    roomid: roomid,
                    area_v2_id: area_v2_id
                }
            });
        },
        smalltv: {
            // 礼物抽奖
            check: (roomid) => {
                return BAPI.ajax({
                    url: 'gift/v3/smalltv/check',
                    data: {
                        roomid: roomid
                    }
                });
            },
            join: (roomid, raffleId, type = 'Gift') => {
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'gift/v3/smalltv/join',
                    data: {
                        roomid: roomid,
                        raffleId: raffleId,
                        type: type
                    }
                });
            },
            notice: (raffleId, type = 'small_tv') => {
                return BAPI.ajax({
                    url: 'gift/v3/smalltv/notice',
                    data: {
                        type: type,
                        raffleId: raffleId
                    }
                });
            }
        }
    },
    giftBag: {//礼物包裹
        getSendGift: () => {
            return BAPI.ajax({
                url: 'giftBag/getSendGift'
            });
        },
        sendDaily: () => {
            return BAPI.ajax({
                url: 'giftBag/sendDaily'
            });
        }
    },
    home: {
        reward: () => {
            // 获取每日奖励情况
            return BAPI.ajax({
                url: '//account.bilibili.com/home/reward'
            });
        }
    },
    i: {
        ajaxCancelWear: () => {
            // 取消佩戴勋章
            return BAPI.ajax({
                url: 'i/ajaxCancelWear'
            });
        },
        ajaxGetAchieve: (keywords, page, pageSize = 6, type = 'normal', status = 0, category = 'all') => {
            return BAPI.ajax({
                url: 'i/api/ajaxGetAchieve',
                data: {
                    type: type, // 'legend'
                    status: status,
                    category: category,
                    keywords: keywords,
                    page: page,
                    pageSize: pageSize
                }
            });
        },
        ajaxGetMyMedalList: () => {
            // 勋章列表
            return BAPI.ajax({
                url: 'i/ajaxGetMyMedalList'
            });
        },
        ajaxWearFansMedal: (medal_id) => {
            // 佩戴勋章/更换当前佩戴的勋章
            return BAPI.ajax({
                url: 'i/ajaxWearFansMedal?medal_id=' + medal_id
            });
        },
        following: (page = 1, pageSize = 9) => {
            return BAPI.ajax({
                url: 'i/api/following',
                data: {
                    page: page,
                    pageSize: pageSize
                }
            });
        },
        guard: (page, pageSize = 10) => {
            return BAPI.ajax({
                url: 'i/api/guard',
                data: {
                    page: page,
                    pageSize: pageSize
                }
            });
        },
        liveinfo: () => {
            return BAPI.ajax({
                url: 'i/api/liveinfo'
            });
        },
        medal: (page = 1, pageSize = 10) => {
            // 获取勋章列表信息
            return BAPI.ajax({
                url: 'i/api/medal',
                data: {
                    page: page,
                    pageSize: pageSize
                }
            });
        },
        operation: (page = 1) => {
            return BAPI.ajax({
                url: 'i/api/operation?page=' + page
            });
        },
        taskInfo: () => {
            return BAPI.ajax({
                url: 'i/api/taskInfo'
            });
        }
    },
    link_group: {
        my_groups: () => {
            // 应援团列表
            return BAPI.ajax({
                url: 'link_group/v1/member/my_groups'
            });
        },
        sign_in: (group_id, owner_id) => {
            // 应援团签到
            return BAPI.ajax({
                url: 'link_setting/v1/link_setting/sign_in',
                data: {
                    group_id: group_id,
                    owner_id: owner_id
                }
            });
        },
        buy_medal: (master_uid, coin_type = 'metal', platform = 'android') => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.vc.bilibili.com/link_group/v1/member/buy_medal',
                data: {
                    master_uid: master_uid,
                    coin_type: coin_type,
                    platform: platform,
                },
            })
        }
    },
    live: {
        getRoomKanBanModel: (roomid) => {
            return BAPI.ajax({
                url: 'live/getRoomKanBanModel?roomid' + roomid
            });
        },
        rankTab: (roomid) => {
            return BAPI.ajax({
                url: 'live/rankTab?roomid=' + roomid
            });
        },
        roomAdList: () => {
            return BAPI.ajax({
                url: 'live/roomAdList'
            });
        }
    },
    live_user: {
        get_anchor_in_room: (roomid) => {//获取主播信息
            return BAPI.ajax({
                url: 'live_user/v1/UserInfo/get_anchor_in_room?roomid=' + roomid
            });
        },
        get_info_in_room: (roomid) => {//获取直播间信息
            return BAPI.ajax({
                url: 'live_user/v1/UserInfo/get_info_in_room?roomid=' + roomid
            });
        },
        get_weared_medal: (uid, target_id, source = 1) => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'live_user/v1/UserInfo/get_weared_medal',
                data: {
                    source: source,
                    uid: uid,
                    target_id: target_id // ruid
                }
            });
        },
        governorShow: (target_id) => {
            return BAPI.ajax({
                url: 'live_user/v1/Master/governorShow?target_id=' + target_id
            });
        }
    },
    lottery: {
        box: {
            getRoomActivityByRoomid: (roomid) => {
                // 获取房间特有的活动 （实物抽奖）
                return BAPI.ajax({
                    url: 'lottery/v1/box/getRoomActivityByRoomid?roomid=' + roomid
                });
            },
            getStatus: (aid, times = '') => {
                // 获取活动信息/状态
                return BAPI.ajax({
                    url: 'lottery/v2/box/getStatus',
                    data: {
                        aid: aid,
                        times: times
                    }
                });
            },
            draw: (aid, number = 1) => {
                // 参加实物抽奖
                return BAPI.ajax({
                    url: '/xlive/lottery-interface/v2/Box/draw',
                    data: {
                        aid: aid,
                        number: number
                    }
                });
            },
            getWinnerGroupInfo: (aid, number = 1) => {
                // 获取中奖名单
                return BAPI.ajax({
                    url: 'lottery/v2/box/getWinnerGroupInfo',
                    data: {
                        aid: aid,
                        number: number
                    }
                });
            }
        },
        SilverBox: {
            getAward: (time_start, end_time, captcha) => {
                // 领取银瓜子
                return BAPI.ajax({
                    url: 'lottery/v1/SilverBox/getAward',
                    data: {
                        time_start: time_start,
                        end_time: end_time,
                        captcha: captcha
                    }
                });
            },
            getCaptcha: (ts) => {
                // 获取银瓜子验证码图片
                return BAPI.ajax({
                    url: 'lottery/v1/SilverBox/getCaptcha?ts=' + ts
                });
            },
            getCurrentTask: () => {
                // 获取领取银瓜子的任务
                return BAPI.ajax({
                    url: 'lottery/v1/SilverBox/getCurrentTask'
                });
            }
        },
        Storm: {
            check: (roomid) => {
                // 检查是否有节奏风暴
                return BAPI.ajax({
                    url: 'lottery/v1/Storm/check?roomid=' + roomid
                });
            },
            join: (id, captcha_token, captcha_phrase, roomid, color = 16777215) => {
                // 参加节奏风暴
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'lottery/v1/Storm/join',
                    data: {
                        id: id,
                        color: color,
                        captcha_token: captcha_token,
                        captcha_phrase: captcha_phrase,
                        roomid: roomid
                    }
                });
            },
            join_ex: (id, roomid, access_token, appKey, headers/*, captcha_token = "", captcha_phrase = "", color = 16777215*/) => {
                // 参加节奏风暴
                let param = TokenUtil.signQuery(KeySign.sort({
                    id: id,
                    access_key: access_token,
                    appkey: appKey,
                    actionKey: 'appkey',
                    build: 5561000,
                    channel: 'bili',
                    device: 'android',
                    mobi_app: 'android',
                    platform: 'android',
                }));
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: `xlive/lottery-interface/v1/storm/Join?${param}`,
                    headers: headers,
                    roomid: roomid
                });
            }
        },
        lottery: {
            check_guard: (roomid) => {
                // 检查是否有舰队领奖
                return BAPI.ajax({
                    url: 'lottery/v1/Lottery/check_guard?roomid=' + roomid
                });
            },
            join: (roomid, id, type = 'guard') => {
                // 参加总督领奖
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'lottery/v2/Lottery/join',
                    data: {
                        roomid: roomid,
                        id: id,
                        type: type
                    }
                });
            }
        }
    },
    mobile: {//移动端心跳失效
        userOnlineHeart: () => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'mobile/userOnlineHeart',
                data: {}
            });
        }
    },
    pay: {
        coin2silver: (num, platform = 'pc') => {
            // 硬币兑换银瓜子(新API)，1硬币=450银瓜子
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'pay/v1/Exchange/coin2silver',
                data: {
                    num: num,
                    platform: platform
                }
            });
        },
        getRule: (platform = 'pc') => {
            return BAPI.ajax({
                url: 'pay/v1/Exchange/getRule?platform=' + platform
            });
        },
        getStatus: (platform = 'pc') => {
            return BAPI.ajax({
                url: 'pay/v1/Exchange/getStatus?platform=' + platform
            });
        },
        silver2coin: (platform = 'pc') => {
            // 银瓜子兑换硬币，700银瓜子=1硬币
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'pay/v1/Exchange/silver2coin',
                data: {
                    platform: platform
                }
            });
        },
        myWallet: (need_bp = 1, need_metal = 1, platform = 'pc') => {
            return BAPI.ajax({
                url: 'pay/v2/Pay/myWallet',
                data: {
                    need_bp: need_bp,
                    need_metal: need_metal,
                    platform: platform
                }
            })
        }
    },
    rankdb: {
        roomInfo: (ruid, roomid, areaId) => {
            return BAPI.ajax({
                url: 'rankdb/v1/Common/roomInfo',
                data: {
                    ruid: ruid,
                    roomid: roomid,
                    areaId: areaId
                }
            });
        },
        /*
            area_id :
            0    小时总榜
            1    娱乐小时榜
            2    网游小时榜
            3    手游小时榜
            4    绘画小时榜
            5    电台小时榜
            6    单机小时榜
        */
        getTopRealTimeHour: (areaId) => {
            return BAPI.ajax({
                url: 'rankdb/v1/Rank2018/getTop?type=master_realtime_hour&type_id=areaid_realtime_hour'
                    + `&area_id=${areaId}`
            })
        }
    },
    relation: {
        getList: (page, page_size) => {
            return BAPI.ajax({
                url: 'relation/v1/feed/getList',
                data: {
                    page: page,
                    page_size: page_size
                },
                cache: false
            });
        },
        heartBeat: () => {
            return BAPI.ajax({
                url: 'relation/v1/feed/heartBeat',
                cache: false
            });
        },
        GetUserFc: (follow) => { // follow: 主播uid===ruid
            return BAPI.ajax({
                url: 'relation/v1/Feed/GetUserFc?follow=' + follow
            });
        },
        IsUserFollow: (follow) => { // follow: 主播uid===ruid
            return BAPI.ajax({
                url: 'relation/v1/Feed/IsUserFollow?follow=' + follow
            });
        },
        getFollowings: (vmid, pn = 1, ps = 20, order = 'desc', jsonp = 'jsonp', callback = '') => {//获取关注列表
            return BAPI.ajax({
                url: '//api.bilibili.com/x/relation/followings',
                data: {
                    vmid: vmid,//uid
                    pn: pn,
                    ps: ps,
                    order: order,
                    jsonp: jsonp,
                    callback: callback//__jp5
                }
            })
        },
        getTags: () => {//获取关注分组
            return BAPI.ajax({
                url: '//api.bilibili.com/x/relation/tags',
                data: {
                    jsonp: 'jsonp',
                    callback: ''//__jp3
                }
            });
        },
        getUpInTag: (mid, tagid, pn = 1, ps = 20, jsonp = 'jsonp', callback = '') => {//获取一个关注分组中的UP
            return BAPI.ajax({
                url: '//api.bilibili.com/x/relation/tag',
                data: {
                    mid: mid,//自己的uid
                    tagid: tagid,//通过getTags获取
                    pn: pn,//页数
                    ps: ps,//每页数量
                    jsonp: jsonp,
                    callback: callback//__jp11
                }
            });
        },
        createTag: (tag, jsonp = 'jsonp') => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/relation/tag/create',
                data: {
                    tag: tag,//tag名称
                    jsonp: jsonp
                }
            })
        },
        getTagIDByName: (tag_name) => {
            return BAPI.ajax({
                url: '//api.bilibili.com/x/tag/info',
                data: {
                    tag_name: tag_name
                }
            })
        },
        delTag: (tagid, jsonp = 'jsonp') => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/relation/tag/del',
                data: {
                    tagid: tagid,
                    jsonp: jsonp
                }
            })
        },
        modify: (fid, act, re_src = 11) => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/relation/modify',
                data: {
                    fid: fid,//目标uid
                    act: act,//1关注 2取消关注
                    re_src: re_src,
                    jsonp: 'jsonp',
                    callback: ''//__jp3
                }
            });
        },
        addUsers: (fids, tagids) => { //可以直接设置分组，无需知道被移动用户之前在什么分组
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/relation/tags/addUsers?cross_domain=true',
                data: {
                    fids: fids,//目标uid
                    tagids: tagids//通过getTags获取。可以为数组，用逗号,隔开，需要编码(即用 %2C 隔开)
                }
            });
        },
        moveUsers: (beforeTagids, afterTagids, fids, jsonp = 'jsonp') => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/relation/tags/moveUsers',
                data: {
                    beforeTagids: beforeTagids,
                    afterTagids: afterTagids,
                    fids: fids,//目标uid。可以为数组，用逗号,隔开，需要编码(即用 %2C 隔开)
                    jsonp: jsonp
                }
            });
        }
    },
    room: {
        get_info: (room_id, from = 'room') => {
            return BAPI.ajax({
                url: 'room/v1/Room/get_info',
                data: {
                    room_id: room_id,
                    from: from
                }
            });
        },
        get_recommend_by_room: (room_id, count, rnd) => {
            return BAPI.ajax({
                url: 'room/v1/room/get_recommend_by_room',
                data: {
                    room_id: room_id,
                    count: count,
                    rnd: rnd || Math.floor(Date.now() / 1000)
                }
            });
        },
        playUrl: (cid, quality = '0', platform = 'web') => {
            return BAPI.ajax({
                url: 'room/v1/Room/playUrl',
                data: {
                    cid: cid, // roomid
                    quality: quality,
                    platform: platform
                }
            });
        },
        room_entry_action: (room_id, platform = 'pc') => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'room/v1/Room/room_entry_action',
                data: {
                    room_id: room_id,
                    platform: platform
                }
            });
        },
        room_init: (id) => {
            return BAPI.ajax({
                url: 'room/v1/Room/room_init?id=' + id
            });
        },
        getConf: (room_id, platform = 'pc', player = 'web') => {
            return BAPI.ajax({
                url: 'room/v1/Danmu/getConf',
                data: {
                    room_id: room_id,
                    platform: platform,
                    player: player
                }
            });
        },
        getList: () => {
            return BAPI.ajax({
                url: 'room/v1/Area/getList'
            });
        },
        getRoomList: (parent_area_id = 1, cate_id = 0, area_id = 0, page = 1, page_size = 30, sort_type = 'online', platform = 'web', tag_version = 1) => {
            return BAPI.ajax({
                url: 'room/v3/area/getRoomList',
                data: {
                    platform: platform,
                    parent_area_id: parent_area_id,//要检查的分区
                    cate_id: cate_id,
                    area_id: area_id,
                    sort_type: sort_type,
                    page: page,
                    page_size: page_size,
                    tag_version: tag_version
                }
            });
        },
        update: (room_id, description) => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: "room/v1/Room/update",
                data: {
                    room_id: room_id,
                    description: description
                }
            })
        },
        getRoomInfoOld: (mid) => {
            return BAPI.ajax({
                url: 'room/v1/Room/getRoomInfoOld',
                data: {
                    mid: mid //uid
                }
            });
        },
        getRoomBaseInfo: (room_ids, req_biz = 'link-center') => {
            return BAPI.ajax({
                url: 'xlive/web-room/v1/index/getRoomBaseInfo',
                data: {
                    room_ids: room_ids,//roomid
                    req_biz: req_biz
                }
            });
        },
        verify_room_pwd: (room_id, pwd = '') => {
            return BAPI.ajax({
                url: 'room/v1/Room/verify_room_pwd',
                data: {
                    room_id: room_id,
                    pwd: pwd
                }
            })
        }
    },
    sign: {
        doSign: () => {
            // 签到
            return BAPI.ajax({
                url: 'sign/doSign'
            });
        },
        GetSignInfo: () => {
            // 获取签到信息
            return BAPI.ajax({
                url: 'sign/GetSignInfo'
            });
        },
        getLastMonthSignDays: () => {
            return BAPI.ajax({
                url: 'sign/getLastMonthSignDays'
            });
        }
    },
    user: {
        getWear: (uid) => {
            return BAPI.ajax({
                url: 'user/v1/user_title/getWear?uid=' + uid
            });
        },
        isBiliVip: (uid) => {
            return BAPI.ajax({
                url: 'user/v1/user/isBiliVip?uid=' + uid
            });
        },
        userOnlineHeart: () => {
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: 'User/userOnlineHeart',
                data: {}
            });
        },
        getUserInfo: (ts) => { // ms
            return BAPI.ajax({
                url: 'User/getUserInfo?ts=' + ts
            });
        }
    },
    x: {
        getUserSpace: (mid, ps, tid, pn, keyword, order, jsonp) => { //查看用户动态
            return BAPI.ajax({
                url: '//api.bilibili.com/x/space/arc/search',
                data: {
                    mid: mid, //uid
                    ps: ps, //30
                    tid: tid, //0
                    pn: pn, //1 2 3页数
                    keyword: keyword, //''
                    order: order, //pubdate
                    jsonp: jsonp //jsonp
                }
            });
        },
        getAccInfo: (mid, jsonp = 'jsonp') => {
            return BAPI.ajax({
                url: '//api.bilibili.com/x/space/acc/info',
                data: {
                    mid: mid,  //uid
                    jsonp: jsonp
                }
            })
        },
        getCoinInfo: (callback, jsonp, aid, _) => { //获取视频投币状态
            return BAPI.ajax({
                url: '//api.bilibili.com/x/web-interface/archive/coins',
                data: {
                    callback: callback, //jqueryCallback_bili_1465130006244295 此项可以为空''
                    jsonp: jsonp, //jsonp
                    aid: aid,
                    _: _ //当前时间戳
                }
            })
        },
        getTodayExp: () => { //获取今日投币获得的经验
            return BAPI.ajax({
                url: '//api.bilibili.com/x/web-interface/coin/today/exp'
            })
        },
        coin_add: (aid, multiply = 1, select_like = 0) => {
            // 投币
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/web-interface/coin/add',
                data: {
                    aid: aid,
                    multiply: multiply,
                    select_like: select_like,
                    cross_domain: true
                }
            });
        },
        share_add: (aid) => {
            // 分享
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/web-interface/share/add',
                data: {
                    aid: aid,
                    jsonp: 'jsonp'
                }
            });
        },
        heartbeat: (aid, cid, mid, start_ts, played_time = 0, realtime = 0, type = 3, play_type = 1, dt = 2) => {
            // B站视频心跳
            return BAPI.ajaxWithCommonArgs({
                method: 'POST',
                url: '//api.bilibili.com/x/report/web/heartbeat',
                data: {
                    aid: aid,
                    cid: cid,
                    mid: mid, // uid
                    start_ts: start_ts || (Date.now() / 1000),
                    played_time: played_time,
                    realtime: realtime,
                    type: type,
                    play_type: play_type, // 1:播放开始，2:播放中
                    dt: dt
                }
            });
        },
        now: () => {
            // 点击播放视频时出现的事件，可能与登录/观看视频判定有关
            return BAPI.ajax({
                url: '//api.bilibili.com/x/report/click/now',
                data: {
                    jsonp: 'jsonp'
                }
            });
        }
    },
    xlive: {
        guard: {
            join: (roomid, id, type = 'guard') => {
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'xlive/lottery-interface/v3/guard/join',
                    data: {
                        roomid: roomid,
                        id: id,
                        type: type
                    }
                });
            }
        },
        lottery: {
            check: (roomid) => {
                return BAPI.ajax({
                    url: 'xlive/lottery-interface/v1/lottery/Check',
                    data: {
                        roomid: roomid
                    }
                });
            }
        },
        smalltv: {
            check: (roomid) => {
                return BAPI.ajax({
                    url: 'xlive/lottery-interface/v3/smalltv/Check',
                    data: {
                        roomid: roomid
                    }
                });
            },
            join: (roomid, id, type = 'small_tv') => {
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'xlive/lottery-interface/v5/smalltv/join',
                    data: {
                        roomid: roomid,
                        id: id,
                        type: type
                    }
                });
            },
            notice: (raffleId, type = 'small_tv') => {
                return BAPI.ajax({
                    url: 'xlive/lottery-interface/v3/smalltv/Notice',
                    data: {
                        type: type,
                        raffleId: raffleId
                    }
                });
            }
        },
        pk: {
            check: (roomid) => {
                return BAPI.ajax({
                    url: 'xlive/lottery-interface/v1/pk/check',
                    data: {
                        roomid: roomid
                    }
                });
            },
            join: (roomid, id) => {
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'xlive/lottery-interface/v1/pk/join',
                    data: {
                        roomid: roomid,
                        id: id
                    }
                });
            }
        },
        dosign: () => {
            return BAPI.ajax({
                url: 'xlive/web-ucenter/v1/sign/DoSign'
            });
        },
        getDanmuInfo: (id, type = 0) => {
            return BAPI.ajax({
                url: 'xlive/web-room/v1/index/getDanmuInfo',
                data: {
                    id: id,//roomid
                    type: type
                }
            });
        },
        getInfoByUser: (room_id) => {
            /**
             * 返回json中 data.privilege.privilege_type的值为上船种类
             * 0：未上船，1：总督，2：提督，3：舰长
             */
            return BAPI.ajax({
                url: 'xlive/web-room/v1/index/getInfoByUser',
                data: {
                    room_id: room_id
                }
            })
        },
        anchor: {
            check: (roomid) => {
                return BAPI.ajax({
                    url: 'xlive/lottery-interface/v1/Anchor/Check?roomid=' + roomid
                })
            },
            join: (id, gift_id, gift_num, platform = 'pc') => {
                var data = {
                    id: id,//通过anchor.check获取
                    platform: platform
                };
                if (gift_id !== undefined && gift_num !== undefined) {
                    data.gift_id = gift_id;
                    data.gift_num = gift_num;
                };
                return BAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'xlive/lottery-interface/v1/Anchor/Join',
                    data: data
                })
            },
            randTime: (id) => {
                return BAPI.ajax({
                    url: 'xlive/lottery-interface/v1/Anchor/RandTime?id=' + id
                })
            }
        }

    },
    YearWelfare: {
        checkFirstCharge: () => {
            return BAPI.ajax({
                url: 'YearWelfare/checkFirstCharge'
            });
        },
        inviteUserList: () => {
            return BAPI.ajax({
                url: 'YearWelfare/inviteUserList/1'
            });
        }
    },
    DanmuWebSocket: class extends WebSocket {
        static stringToUint(string) {
            const charList = string.split('');
            const uintArray = [];
            for (var i = 0; i < charList.length; ++i) {
                uintArray.push(charList[i].charCodeAt(0));
            }
            return new Uint8Array(uintArray);
        }
        static uintToString(uintArray) {
            return decodeURIComponent(escape(String.fromCharCode.apply(null, uintArray)));
        }
        constructor(uid, roomid, host_server_list, token) {
            // 总字节长度 int(4bytes) + 头字节长度(16=4+2+2+4+4) short(2bytes) + protover(1,2) short(2bytes) + operation int(4bytes) + sequence(1,0) int(4bytes) + Data
            let address = 'wss://broadcastlv.chat.bilibili.com/sub';
            if (Array.isArray(host_server_list) && host_server_list.length > 0) {
                let flag = false;
                do {
                    const chosen = host_server_list.shift();
                    if (chosen.wss_port) address = `wss://${chosen.host}:${chosen.wss_port}/sub`;
                    else flag = true;
                } while (flag && host_server_list.length > 0);
            } else if (typeof host_server_list === 'string' && host_server_list.length > 0) {
                address = host_server_list;
            }
            super(address);
            this.binaryType = 'arraybuffer';
            this.handlers = {
                reconnect: [],
                login: [],
                heartbeat: [],
                cmd: [],
                receive: []
            };
            this.host_server_list = host_server_list;
            this.token = token;
            this.closed = false;
            this.addEventListener('open', () => {
                this.sendLoginPacket(uid, roomid).sendHeartBeatPacket();
                this.heartBeatHandler = setInterval(() => {
                    this.sendHeartBeatPacket();
                }, 30e3);
            });
            this.addEventListener('close', () => {
                if (this.heartBeatHandler) clearInterval(this.heartBeatHandler);
                if (this.closed) return;
                // 自动重连
                setTimeout(() => {
                    const ws = new BAPI.DanmuWebSocket(uid, roomid, this.host_server_list, this.token);
                    ws.handlers = this.handlers;
                    ws.unzip = this.unzip;
                    for (const key in this.handlers) {
                        if (this.handlers.hasOwnProperty(key)) {
                            this.handlers[key].forEach(handler => {
                                switch (key) {
                                    case 'reconnect':
                                        ws.addEventListener('reconnect', (event) => {
                                            handler.call(ws, event.detail.ws);
                                        });
                                        break;
                                    case 'login':
                                        ws.addEventListener('login', () => {
                                            handler.call(ws);
                                        });
                                        break;
                                    case 'heartbeat':
                                        ws.addEventListener('heartbeat', (event) => {
                                            handler.call(ws, event.detail.num);
                                        });
                                        break;
                                    case 'cmd':
                                        ws.addEventListener('cmd', (event) => {
                                            handler.call(ws, event.detail.obj, event.detail.str);
                                        });
                                        break;
                                    case 'receive':
                                        ws.addEventListener('receive', (event) => {
                                            handler.call(ws, event.detail.len, event.detail.headerLen, event.detail.protover, event.detail.operation, event.detail.sequence, event.detail.data);
                                        });
                                        break;
                                }
                            });
                        }
                    }
                    this.dispatchEvent(new CustomEvent('reconnect', {
                        detail: {
                            ws: ws
                        }
                    }));
                }, 10e3);
            });
            this.addEventListener('message', (event) => {
                const dv = new DataView(event.data);
                let len = 0;
                for (let position = 0; position < event.data.byteLength; position += len) {
                    /*
                    登录 总字节长度 int(4bytes) + 头字节长度 short(2bytes) + 00 01 + 00 00 00 08 + 00 00 00 01
                    心跳 总字节长度 int(4bytes) + 头字节长度 short(2bytes) + 00 01 + 00 00 00 03 + 00 00 00 01 + 直播间人气 int(4bytes)
                    弹幕消息/系统消息/送礼 总字节长度 int(4bytes) + 头字节长度 short(2bytes) + 00 00 + 00 00 00 05 + 00 00 00 00 + Data
                    */
                    len = dv.getUint32(position);
                    const headerLen = dv.getUint16(position + 4);
                    const protover = dv.getUint16(position + 6);
                    const operation = dv.getUint32(position + 8);
                    const sequence = dv.getUint32(position + 12);
                    let data = event.data.slice(position + headerLen, position + len);
                    if (protover === 2 && this.unzip) data = this.unzip(data);
                    this.dispatchEvent(new CustomEvent('receive', {
                        detail: {
                            len: len,
                            headerLen: headerLen,
                            protover: protover,
                            operation: operation,
                            sequence: sequence,
                            data: data
                        }
                    }));
                    if (protover === 2 && !this.unzip) continue;
                    const dataV = new DataView(data);
                    switch (operation) {
                        case 3:
                            {
                                const num = dataV.getUint32(0); // 在线人数
                                this.dispatchEvent(new CustomEvent('heartbeat', {
                                    detail: {
                                        num: num
                                    }
                                }));
                                break;
                            }
                        case 5:
                            {
                                const str = BAPI.DanmuWebSocket.uintToString(new Uint8Array(data));
                                const obj = JSON.parse(str);
                                this.dispatchEvent(new CustomEvent('cmd', {
                                    detail: {
                                        obj: obj,
                                        str: str
                                    }
                                }));
                                break;
                            }
                        case 8:
                            this.dispatchEvent(new CustomEvent('login'));
                            break;
                    }
                }
            });
        }
        close(code, reason) {
            this.closed = true;
            super.close(code, reason);
        }
        setUnzip(fn) {
            this.unzip = fn;
        }
        bind(onreconnect = undefined, onlogin = undefined, onheartbeat = undefined, oncmd = undefined, onreceive = undefined) {
            /*
            参数说明
            onreconnect(DanmuWebSocket) // 必要，DanmuWebSocket为新的
            onlogin()
            onheartbeat(number)
            oncmd(object, string)
            onreceive(number, number, number, number, number, arraybuffer)
            */
            if (typeof onreconnect === 'function') {
                this.addEventListener('reconnect', (event) => {
                    onreconnect.call(this, event.detail.ws);
                });
                this.handlers.reconnect.push(onreconnect);
            }
            if (typeof onlogin === 'function') {
                this.addEventListener('login', () => {
                    onlogin.call(this);
                });
                this.handlers.login.push(onlogin);
            }
            if (typeof onheartbeat === 'function') {
                this.addEventListener('heartbeat', (event) => {
                    onheartbeat.call(this, event.detail.num);
                });
                this.handlers.heartbeat.push(onheartbeat);
            }
            if (typeof oncmd === 'function') {
                this.addEventListener('cmd', (event) => {
                    oncmd.call(this, event.detail.obj, event.detail.str);
                });
                this.handlers.cmd.push(oncmd);
            }
            if (typeof onreceive === 'function') {
                this.addEventListener('receive', (event) => {
                    onreceive.call(this, event.detail.len, event.detail.headerLen, event.detail.protover, event.detail.operation, event.detail.sequence, event.detail.data);
                });
                this.handlers.receive.push(onreceive);
            }
        }
        sendData(data, protover, operation, sequence) {
            if (this.readyState !== WebSocket.OPEN) throw new Error('DanmuWebSocket未连接');
            switch (Object.prototype.toString.call(data)) {
                case '[object Object]':
                    return this.sendData(JSON.stringify(data), protover, operation, sequence);
                case '[object String]':
                    {
                        let dataUint8Array = BAPI.DanmuWebSocket.stringToUint(data);
                        let buffer = new ArrayBuffer(BAPI.DanmuWebSocket.headerLength + dataUint8Array.byteLength);
                        let dv = new DataView(buffer);
                        dv.setUint32(0, BAPI.DanmuWebSocket.headerLength + dataUint8Array.byteLength);
                        dv.setUint16(4, BAPI.DanmuWebSocket.headerLength);
                        dv.setUint16(6, parseInt(protover, 10));
                        dv.setUint32(8, parseInt(operation, 10));
                        dv.setUint32(12, parseInt(sequence, 10));
                        for (let i = 0; i < dataUint8Array.byteLength; ++i) {
                            dv.setUint8(BAPI.DanmuWebSocket.headerLength + i, dataUint8Array[i]);
                        }
                        this.send(buffer);
                    }
                    return this;
                default:
                    this.send(data);
            }
            return this;
        }
        sendLoginPacket(uid, roomid) {
            // 总字节长度 int(4bytes) + 头字节长度 short(2bytes) + 00 01 + 00 00 00 07 + 00 00 00 01 + Data 登录数据包
            const data = {
                'uid': parseInt(uid, 10),
                'roomid': parseInt(roomid, 10),
                'protover': 2,
                'platform': 'web',
                'clientver': '1.8.5',
                'type': 2,
                'key': this.token
            };
            return this.sendData(data, 1, 7, 1);
        }
        sendHeartBeatPacket() {
            // 总字节长度 int(4bytes) + 头字节长度 short(2bytes) + 00 01 + 00 00 00 02 + 00 00 00 01 + Data 心跳数据包
            return this.sendData('[object Object]', 1, 2, 1);
        }
    },
    sendLiveDanmu: (msg, roomid, color = '16777215', fontsize = '25', mode = '1', bubble = '0') => {
        return BAPI.ajaxWithCommonArgs({
            method: 'POST',
            url: 'msg/send',
            data: {
                color: color,
                fontsize: fontsize,
                mode: mode,
                msg: msg,
                rnd: BAPI_ts_ms(),
                roomid: roomid,
                bubble: bubble

            }
        });
    },
    /**
     * 发私信
     * @param
        { 
            {
                sender_uid: number,
                receiver_id: number,
                receiver_type: number,
                msg_type: number,
                msg_status: number,
                content: object,
                dev_id: string
            }
        } msg
    */
    sendMsg: (msg, build = 0, mobi_app = 'web') => {
        return BAPI.ajaxWithCommonArgs({
            method: 'POST',
            url: '//api.vc.bilibili.com/web_im/v1/web_im/send_msg ',
            data: {
                'msg[sender_uid]': msg['sender_uid'],
                'msg[receiver_id]': msg['receiver_id'],
                'msg[receiver_type]': msg['receiver_type'] || 1,
                'msg[msg_type]': msg['msg_type'] || 1,
                'msg[msg_status]': msg['msg_status'] || 0,
                'msg[content]': msg['content'],
                'msg[timestamp]': BAPI_ts_s(),
                'msg[dev_id]': msg['dev_id'],
                'build': build,
                'mobi_app': mobi_app
            }
        });
    },
    /**
    * 获取cookie
    * @param name
    * @returns {string|boolean}
    */
    getCookie: (name) => {
        let cookies = document.cookie.split(';');
        let c;
        for (var i = 0; i < cookies.length; i++) {
            c = cookies[i].split('=');
            if (c[0].replace(' ', '') == name) {
                return decodeURIComponent(c[1]);
            }
        }
    },
    /**
    * 合并请求参数
    * @param obj
    * @returns {string}
    */
    KeySign: {
        sort: (obj) => {
            let keys = Object.keys(obj).sort();
            let p = [];
            for (let key of keys) {
                p.push(`${key}=${obj[key]}`);
            }
            return p.join('&');
        }
    }
}

BAPI.DanmuWebSocket.headerLength = 16;
