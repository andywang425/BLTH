// ==UserScript==
// @name           B站直播间挂机助手
// @name:zh        B站直播间挂机助手
// @name:en        Bilibili Live Helper
// @namespace      https://github.com/andywang425
// @author         andywang425
// @description    优化直播观看体验
// @description:en Improve live viewing experience
// @updateURL      https://raw.githubusercontent.com/andywang425/BLTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @downloadURL    https://raw.githubusercontent.com/andywang425/BLTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @homepageURL    https://github.com/andywang425/BLTH
// @supportURL     https://github.com/andywang425/BLTH/issues
// @icon           https://z4a.net/images/2022/09/15/script-icon.png
// @copyright      2021, andywang425 (https://github.com/andywang425)
// @license        MIT
// @compatible     chrome 80 or later
// @compatible     firefox 77 or later
// @compatible     opera 69 or later
// @compatible     safari 13.1 or later
// @version        6.0.2
// @match          *://live.bilibili.com/*
// @exclude        *://live.bilibili.com/?*
// @run-at         document-start
// @connect        passport.bilibili.com
// @connect        api.live.bilibili.com
// @connect        api.bilibili.com
// @connect        api.vc.bilibili.com
// @connect        live-trace.bilibili.com
// @connect        sctapi.ftqq.com
// @connect        pushplus.plus
// @connect        andywang.top
// @connect        gitee.com
// @require        https://gcore.jsdelivr.net/gh/andywang425/BLTH@dac0d115a45450e6d3f3e17acd4328ab581d0514/assets/js/library/Ajax-hook.min.js
// @require        https://gcore.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require        https://gcore.jsdelivr.net/gh/andywang425/BLTH@4dbe95160c430bc64757580f07489bb11e766fcb/assets/js/library/bliveproxy.min.js
// @require        https://gcore.jsdelivr.net/gh/andywang425/BLTH@d1f68400ee93db4490e5747113a93378667ea0bc/assets/js/library/BilibiliAPI_Mod.min.js
// @require        https://gcore.jsdelivr.net/gh/andywang425/BLTH@4368883c643af57c07117e43785cd28adcb0cb3e/assets/js/library/layer.min.js
// @require        https://gcore.jsdelivr.net/gh/andywang425/BLTH@f9fc6466ae78ead12ddcd2909e53fcdcc7528f78/assets/js/library/Emitter.min.js
// @require        https://gcore.jsdelivr.net/npm/hotkeys-js@3.8.7/dist/hotkeys.min.js
// @require        https://gcore.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
// @require        https://gcore.jsdelivr.net/gh/andywang425/BLTH@c117d15784f92f478196de0129c8e5653a9cb32e/assets/js/library/BiliveHeart.min.js
// @resource       layerCss https://gcore.jsdelivr.net/gh/andywang425/BLTH@d25aa353c8c5b2d73d2217b1b43433a80100c61e/assets/css/layer.css
// @resource       myCss    https://gcore.jsdelivr.net/gh/andywang425/BLTH@5bcc31da7fb98eeae8443ff7aec06e882b9391a8/assets/css/myCss.min.css
// @resource       main     https://gcore.jsdelivr.net/gh/andywang425/BLTH@bd2b26eddac514781fbbe2f6cd7eb58963a14aa5/assets/html/main.min.html
// @resource       eula     https://gcore.jsdelivr.net/gh/andywang425/BLTH@da3d8ce68cde57f3752fbf6cf071763c34341640/assets/html/eula.min.html
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_notification
// @grant          GM_openInTab
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// ==/UserScript==

(function () {
  localstorage2gm();
  const NAME = 'BLTH',
    W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow,
    eventListener = W.addEventListener,
    wfetch = W.fetch,
    _setTimeout = W.setTimeout,
    _setInterval = W.setInterval,
    ts_ms = () => Date.now(), // 当前毫秒
    ts_s = () => Math.round(ts_ms() / 1000), // 当前秒
    tz_offset = new Date().getTimezoneOffset() + 480, // 本地时间与东八区差的分钟数
    getCHSdate = () => {
      // 返回东八区 Date
      return new Date(ts_ms() + tz_offset * 60000);
    },
    delayCall = (callback, delay = 120e3) => {
      const p = $.Deferred();
      setTimeout(() => {
        const t = callback();
        if (t && t.then) t.then((arg1, arg2, arg3, arg4, arg5, arg6) => p.resolve(arg1, arg2, arg3, arg4, arg5, arg6));
        else p.resolve();
      }, delay);
      return p;
    },
    MYDEBUG = (sign, ...data) => {
      if (!SP_CONFIG.debugSwitch) return;
      if (typeof data[0] === "object" && data[0].netError) return MYERROR(sign, ...data);
      let d = new Date();
      d = `%c[${NAME}]%c[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}]%c`;
      if (data.length === 1) return console.log(d, "font-weight: bold;", "color: #0920e6;", "", `${sign}:`, data[0],);
      console.log(d, "font-weight: bold;", "color: #0920e6;", "", `${sign}:`, data,);
    },
    MYERROR = (sign, ...data) => {
      let d = new Date();
      d = `[${NAME}][${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}]`;
      if (data.length === 1) return console.error(d, `${sign}:`, data[0]);
      console.error(d, `${sign}:`, data);
    },
    runMidnight = (callback, msg) => {
      // 明天凌晨0点1分再次运行
      const t = new Date();
      let name = msg || ' ';
      t.setMinutes(t.getMinutes() + tz_offset);
      t.setDate(t.getDate() + 1);
      t.setHours(0, 1, 0, 0);
      t.setMinutes(t.getMinutes() - tz_offset);
      setTimeout(callback, t - ts_ms());
      MYDEBUG('runMidnight', name + " " + t.toString());
    },
    runExactMidnight = (callback, msg) => {
      // 明天凌晨0点再次运行
      const t = new Date();
      let name = msg || ' ';
      t.setMinutes(t.getMinutes() + tz_offset);
      t.setDate(t.getDate() + 1);
      t.setHours(0, 0, 0, 0);
      t.setMinutes(t.getMinutes() - tz_offset);
      setTimeout(callback, t - ts_ms());
      MYDEBUG('runExactMidnight', name + " " + t.toString());
    },
    runTomorrow = (callback, hour, minute, msg) => {
      // 明天运行，可自定义时间
      const t = new Date();
      let name = msg || ' ';
      t.setMinutes(t.getMinutes() + tz_offset);
      t.setDate(t.getDate() + 1);
      t.setHours(hour, minute, 0, 0);
      t.setMinutes(t.getMinutes() - tz_offset);
      setTimeout(callback, t - ts_ms());
      MYDEBUG('runTomorrow', name + " " + t.toString());
    },
    runToday = (callback, hour, minute, msg) => {
      // 今天运行，可自定义时间
      const t = new Date();
      let name = msg || ' ';
      t.setMinutes(t.getMinutes() + tz_offset);
      t.setHours(hour, minute, 0, 0);
      t.setMinutes(t.getMinutes() - tz_offset);
      setTimeout(callback, t - ts_ms());
      MYDEBUG('runToday', name + " " + t.toString());
    },
    newWindow = {
      init: () => {
        return newWindow.Toast.init();
      },
      Toast: {
        // 设置右上角浮动提示框 Need Init
        init: () => {
          try {
            const list = [];
            window.toast = (msg, type = 'info', timeout = 5e3) => {
              switch (type) {
                case 'success':
                case 'info':
                case 'caution':
                case 'error':
                  break;
                default:
                  type = 'info';
              }
              const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001"><span class="toast-text">${msg}</span></div>`)[0];
              document.body.appendChild(a);
              MYDEBUG("toast-" + type, msg);
              a.style.top = (document.body.scrollTop + list.length * 40 + 10) + 'px';
              a.style.left = (document.body.offsetWidth + document.body.scrollLeft - a.offsetWidth - 5) + 'px';
              if (!SP_CONFIG.windowToast) $('.link-toast').hide();
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
            window.singleToast = (msg, type = 'info', timeout = 5e3, top, left) => {
              switch (type) {
                case 'success':
                case 'info':
                case 'caution':
                case 'error':
                  break;
                default:
                  type = 'info';
              }
              const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001"><span class="toast-text">${msg}</span></div>`)[0];
              document.body.appendChild(a);
              MYDEBUG("singleToast-" + type, msg);
              a.style.top = top;
              a.style.left = left;
              setTimeout(() => {
                a.className += ' out';
                setTimeout(() => {
                  $(a).remove();
                }, 200);
              }, timeout);
            }
            return $.Deferred().resolve();
          } catch (err) {
            MYERROR(`初始化浮动提示时出现异常`, err);
            return $.Deferred().reject();
          }
        }
      }
    },
    addStyle = () => {
      const layerCss = GM_getResourceText('layerCss');
      const myCss = GM_getResourceText('myCss');
      const allCss = layerCss + myCss;
      return GM_addStyle(allCss);
    },
    getScrollPosition = (el = window) => ({
      x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
      y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
    }),
    linkMsg = (link, msg = link) => '<a href="' + link + '"target="_blank" style="color:">' + msg + '</a>',
    SP_CONFIG_DEFAULT = {
      showEula: true, // 显示EULA
      storageLastFixVersion: "0", // 上次修复设置的版本
      mainDisplay: 'show', // UI隐藏开关
      darkMode: false, // 深色模式
      debugSwitch: false, // 控制台日志开关
      windowToast: true, // 右上提示信息
      nosleep: true, // 屏蔽挂机检测
      invisibleEnter: false, // 隐身入场
      banP2p: false, // 禁止p2p上传
      lastShowUpdateMsgVersion: "0", // 上次显示更新信息的版本
      DANMU_MODIFY: false, // 修改弹幕
      AUTO_CHECK_DANMU: false, // 检查弹幕是否发送成功
      blockLiveStream: false, // 拦截直播流
      blockliveDataUpdate: false, // 拦截直播观看数据上报
      wear_medal_before_danmu: false, // 手动发弹幕前自动佩戴当前房间勋章
      wear_medal_type: 'ONLY_FIRST', // 自动佩戴勋章方式
      add_like_button: true // 添加一个点赞按钮
    };
  let otherScriptsRunningCheck = $.Deferred(),
    otherScriptsRunning = false,
    SP_CONFIG = GM_getValue("SP_CONFIG") || {},
    SEND_GIFT_NOW = false, // 立刻送出礼物
    SEND_DANMU_NOW = false, // 立刻发弹幕
    hideBtnClickable = false, // 隐藏/显示控制面板，面板加载后设为 true
    danmuTaskRunning = false,
    medalDanmuRunning = false,
    hasWornMedal = false,
    danmuEmitter = new Emitter(),
    Live_info = {
      room_id: undefined,
      short_room_id: undefined,
      uid: undefined,
      ruid: undefined,
      gift_list: [{ id: 6, price: 1e3 }, { id: 1, price: 100 }],
      rnd: undefined,
      visit_id: undefined,
      bili_jct: undefined,
      tid: undefined,
      uname: undefined,
      user_level: undefined, // 直播等级
      level: undefined,  // 主站等级
      danmu_length: undefined, // 直播弹幕长度限制
      medal: undefined, // 当前直播间勋章的 target_id
      vipStatus: undefined // 大会员状态 (0:无, 1:有)
    },
    medal_info = { status: $.Deferred(), medal_list: [] },
    mainIndex = undefined,
    logIndex = undefined,
    layerUiMain = undefined, // 控制面板
    layerLogWindow = undefined, // 日志窗口
    logDiv = undefined,
    tabContent = undefined,
    JQmenuWindow = undefined,
    layerLogWindow_Height = undefined,
    layerLogWindow_ScrollHeight = undefined,
    layerLogWindow_ScrollTop = undefined,
    layerLogWindow_ScrollY = undefined,
    readConfigArray = [undefined],
    noticeJson = GM_getValue("noticeJson") || {}; // 检查更新时获取的json

  /**
   * 替换字符串中所有的匹配项（可处理特殊字符如括号）
   * @param oldSubStr 搜索的字符串
   * @param newSubStr 替换内容
   */
  String.prototype.replaceall = function (oldSubStr, newSubStr) {
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 代表所有被匹配的字符串
    }
    return this.replace(new RegExp(escapeRegExp(oldSubStr), 'g'), () => newSubStr);
  }

  // 初始化特殊设置
  mergeObject(SP_CONFIG, SP_CONFIG_DEFAULT);

  // 拦截直播流/数据上报，需要尽早
  if (SP_CONFIG.blockLiveStream || SP_CONFIG.blockliveDataUpdate || SP_CONFIG.wear_medal_before_danmu || SP_CONFIG.AUTO_CHECK_DANMU) {
    W.fetch = (...arg) => {
      if (SP_CONFIG.blockLiveStream && arg[0].includes('bilivideo')) {
        return new Promise((resolve, reject) => { });
      } else if (SP_CONFIG.blockliveDataUpdate && arg[0].includes("data.bilibili.com/gol/postweb")) {
        return {};
      } else if (arg[0].includes('//api.live.bilibili.com/msg/send')) {
        if (SP_CONFIG.AUTO_CHECK_DANMU) {
          danmuEmitter.emit('danmu', arg[1].data.msg);
        }
        if (SP_CONFIG.wear_medal_before_danmu) {
          if (medal_info.status.state() !== "resolved" || Live_info.medal === null || (SP_CONFIG.wear_medal_type === "ONLY_FIRST" && hasWornMedal)) return wfetch(...arg);
          if (typeof Live_info.medal === "undefined") {
            for (const m of medal_info.medal_list) {
              if (m.roomid === Live_info.short_room_id) {
                Live_info.medal = m;
                break;
              }
            }
          }
          if (typeof Live_info.medal === "undefined") {
            Live_info.medal = null; // 没有该勋章，之后无需再检查
            return wfetch(...arg);
          }
          return BAPI.xlive.wearMedal(Live_info.medal.medal_id).then((response) => {
            MYDEBUG('API.xlive.wearMedal', response);
            if (response.code === 0) {
              hasWornMedal = true;
              try {
                let medalJqItem = $(".dp-i-block.medal-item-margin");
                if (medalJqItem === null) return;
                let border = medalJqItem.find(".v-middle.fans-medal-item");
                const medalColor = '#' + Live_info.medal.medal_color_start.toString(16);
                const medalLevel = Live_info.medal.medal_level;
                const medalText = Live_info.medal.medal_name;
                if (border.length !== 0) {
                  // 之前戴着勋章
                  let background = border.find('.fans-medal-label');
                  let level = border.find('.fans-medal-level');
                  let text = background.find('.fans-medal-content');
                  border.css('border-color', medalColor);
                  background.css('background-image', `linear-gradient(45deg, ${medalColor}, ${medalColor})`);
                  level.text(medalLevel);
                  text.text(medalText);
                } else {
                  // 如果没戴勋章则需插入缺失的 html
                  $(".action-item.medal.wear-medal").remove(); // 移除提示水印
                  medalJqItem.html(`<div data-v-2c4630d2="" data-v-34b5b0e1="" class="v-middle fans-medal-item" style="border-color: ${medalColor}">
                    <div data-v-2c4630d2="" class="fans-medal-label" style="background-image: linear-gradient(45deg, ${medalColor}, ${medalColor});">
                      <span data-v-2c4630d2="" class="fans-medal-content">${medalText}</span>
                    </div>
                    <div data-v-2c4630d2="" class="fans-medal-level" style="color: ${medalColor};">${medalLevel}</div>
                  </div>`);
                }
              } catch (e) {
                MYERROR("修改弹幕框左侧粉丝牌样式出错", e);
              }
            } else {
              window.toast(`自动佩戴粉丝勋章出错 ${response.message}`, 'error');
            }
            return wfetch(...arg);
          })
        }
        return wfetch(...arg);
      } else {
        return wfetch(...arg);
      }
    }
  }

  // DOM加载完成后运行
  $(document).ready(function ready() {
    // 若 window 下无 BilibiliLive，则说明页面有 iframe，此时脚本在在 top 中运行 或 发生错误
    if (W.BilibiliLive === undefined) return;
    // 等待BilibiliLive中数据加载完成
    if (!W.BilibiliLive.UID) return setTimeout(ready, 100);
    // 初始化右上角提示信息弹窗
    newWindow.init();
    // 检查浏览器版本并显示提示信息
    const checkBrowserArr = checkBrowserVersion();
    if (checkBrowserArr[0] !== "ok") {
      window.toast(...checkBrowserArr);
      if (checkBrowserArr[1] === "error") return;
    }
    // 唯一运行检测
    onlyScriptCheck();
    if (SP_CONFIG.DANMU_MODIFY || SP_CONFIG.AUTO_CHECK_DANMU) {
      W.bliveproxy.hook();
      MYDEBUG('bliveproxy hook complete', bliveproxy);
    }
    if (SP_CONFIG.nosleep) {
      setInterval(() => mouseMove(), 200e3);
      W.addEventListener = (...arg) => {
        if (arg[0].indexOf('visibilitychange') > -1) return;
        else return eventListener(...arg);
      }
      W.setTimeout = function (func, ...args) {
        if (String(func).indexOf('triggerSleepCallback') !== -1) return _setTimeout.call(this, function () { }, ...args)
        else return _setTimeout.call(this, func, ...args)
      }
      W.setInterval = function (func, ...args) {
        if (String(func).indexOf('triggerSleepCallback') !== -1) return _setTimeout.call(this, function () { }, ...args)
        else return _setInterval.call(this, func, ...args)
      }
    }
    if (SP_CONFIG.invisibleEnter || SP_CONFIG.blockliveDataUpdate) {
      try {
        ah.proxy({
          onRequest: (XHRconfig, handler) => {
            if (SP_CONFIG.invisibleEnter && XHRconfig.url.includes('//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser')) {
              MYDEBUG('getInfoByUser request', XHRconfig);
              XHRconfig.url = '//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=22474988&from=0';
              handler.next(XHRconfig);
            } else if (SP_CONFIG.blockliveDataUpdate && XHRconfig.url.includes('//data.bilibili.com/log')) {
              handler.resolve("ok");
            } else {
              handler.next(XHRconfig);
            }
          },
          onResponse: async (response, handler) => {
            if (response.config.url.includes('//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser')) {
              MYDEBUG('getInfoByUser response', response);
              if (!response.response.includes('"code":0')) {
                MYDEBUG('隐身入场出错，取消隐身入场并以当前房间号再次获取用户数据');
                response.response = await BAPI.xlive.getInfoByUser(W.BilibiliLive.ROOMID).then((re) => {
                  MYDEBUG('API.xlive.getInfoByUser(W.BilibiliLive.ROOMID)', re);
                  if (re.code === 0) return JSON.stringify(re);
                  else return window.toast(`获取房间基础信息失败 ${re.message}`, 'error')
                });
              }
              response.response = response.response.replace('"is_room_admin":false', '"is_room_admin":true');
              const json_response = JSON.parse(response.response);
              Live_info.danmu_length = json_response.data.property.danmu.length;
            }
            handler.next(response);
          }
        })
      } catch (e) { MYDEBUG('ah.proxy Ajax-hook代理运行出错', e) }
    }
    if (SP_CONFIG.banP2p) {
      const RTClist = ["RTCPeerConnection", "RTCDataChannel", "mozRTCPeerConnection", "webkitRTCPeerConnection", "DataChannel"];
      for (const i of RTClist) {
        delete W[i];
      }
    }
    if (SP_CONFIG.add_like_button) {
      const right_ctnr = $('.right-ctnr');
      const share = right_ctnr.find('.v-middle.icon-font.icon-share').parent();
      const like_button = $('<div data-v-6d89404b="" data-v-42ea937d="" title="" class="icon-ctnr live-skin-normal-a-text pointer" id = "blth_like_button" style="line-height: 16px;margin-left: 15px;"><i data-v-6d89404b="" class="v-middle icon-font icon-good" style="font-size: 16px;"></i><span data-v-6d89404b="" class="action-text v-middle" style="font-size: 12px;margin-left: 5px;">点赞</span></div>');
      like_button.click(() => {
        BAPI.xlive.likeInteract(Live_info.room_id).then((response) => {
          MYDEBUG(`点击点赞按钮 likeInteract(${Live_info.room_id}) response`, response);
          const offest = like_button.offset(),
            width = like_button.width(),
            height = like_button.height();
          const top = parseInt(offest.top + height * 1.2) + 'px',
            left = parseInt(offest.left + width * 1.2) + 'px';
          if (response.code === 0) window.singleToast('点赞成功', 'success', 2e3, top, left);
          else window.singleToast(`点赞失败`, 'caution', 2e3, top, left);
        });
      });
      if ($('.right-ctnr').length == 0)
        return MYERROR('[添加点赞按钮] 无法找到元素 .right-ctnr');
      right_ctnr[0].insertBefore(like_button[0], share[0]);
    }
    const loadInfo = (delay = 0) => {
      return setTimeout(async () => {
        if (parseInt(W.BilibiliLive.UID) === 0 || isNaN(parseInt(W.BilibiliLive.UID))) {
          //MYDEBUG(`${GM_info.script.name}`,'无配置信息');
          return loadInfo(500);
        } else {
          window.toast("正在获取礼物 / 用户 / 账号 / 粉丝勋章数据...", "info");
          Live_info.room_id = W.BilibiliLive.ROOMID;
          Live_info.short_room_id = W.BilibiliLive.SHORT_ROOMID;
          Live_info.uid = W.BilibiliLive.UID;
          Live_info.tid = W.BilibiliLive.ANCHOR_UID;
          await BAPI.gift.gift_config().then((response) => {
            MYDEBUG('InitData: API.gift.gift_config', response);
            if (response.data && Array.isArray(response.data)) {
              return Live_info.gift_list = response.data;
            } else if (response.data.list && Array.isArray(response.data.list)) {
              return Live_info.gift_list = response.data.list;
            } else {
              return window.toast(`直播间礼物数据获取失败 ${response.message}\n使用默认数据`, 'warning');
            }
          });
          await BAPI.getuserinfo().then((re) => {
            MYDEBUG('InitData: API.getuserinfo', re);
            if (re.code === "REPONSE_OK") {
              Live_info.uname = re.data.uname;
              Live_info.user_level = re.data.user_level;
            }
            else {
              window.toast(`API.getuserinfo 获取用户信息失败 ${re.message}`, 'error');
              return delayCall(() => loadInfo());
            }
          });
          await BAPI.x.getAccInfo(Live_info.uid).then((re) => {
            MYDEBUG('InitData: API.x.getAccInfo', re);
            if (re.code === 0) {
              Live_info.level = re.data.level;
              Live_info.vipStatus = re.data.vip.status;
            } else {
              window.toast(`API.x.getAccInfo 获取账号信息失败 ${re.message}`, 'error');
              return delayCall(() => loadInfo());
            }
          });
          Live_info.bili_jct = BAPI.getCookie('bili_jct');
          Live_info.ruid = W.BilibiliLive.ANCHOR_UID;
          Live_info.rnd = W.BilibiliLive.RND;
          Live_info.visit_id = W.__statisObserver ? W.__statisObserver.__visitId : '';
          MYDEBUG("Live_info", Live_info);
          await getMedalList();
          MYDEBUG("medla_info", medal_info);
          init();
        }
      }, delay);
    };
    return loadInfo();
  });
  function init() { // 初始化各项功能
    const MY_API = {
      CONFIG_DEFAULT: {
        AUTO_DANMU: false, // 发送弹幕
        AUTO_CHECK_DANMU_TIMEOUT: 3000, // 检测弹幕是否发送成功 超时时间
        AUTO_GIFT: false, // 自动送礼
        AUTO_GIFT_ROOMID: ["0"], // 送礼优先房间
        AUTO_GROUP_SIGN: true, // 应援团签到开关
        COIN: false, // 投币
        COIN_NUMBER: 0, // 投币数量
        COIN_TYPE: "COIN_DYN", // 投币方法 动态/UID
        COIN_UID: ['0'], // 投币up主
        COIN2SILVER: false, // 银币换银瓜子
        COIN2SILVER_NUM: 1, // 银币换银瓜子，硬币数量
        DANMU_CONTENT: ["这是一条弹幕"], // 弹幕内容
        DANMU_ROOMID: ["22474988"], // 发弹幕房间号
        DANMU_INTERVAL_TIME: ["10m"], // 弹幕发送时间
        DANMU_MODIFY_REGEX: ["/【/"],// 匹配弹幕 正则字符串
        DANMU_MODIFY_UID: [0], // 匹配弹幕 UID
        DANMU_MODIFY_POOL: [4], // 修改弹幕 弹幕池
        DANMU_MODIFY_COLOR: ["#f7335d"], // 修改弹幕 颜色
        DANMU_MODIFY_SIZE: [1.2], // 修改弹幕 大小
        GIFT_LIMIT: 1, // 礼物到期时间(天)
        GIFT_SEND_HOUR: 23, // 送礼小时
        GIFT_SEND_MINUTE: 59, // 送礼分钟
        GIFT_INTERVAL: 5, // 送礼间隔
        GIFT_METHOD: "GIFT_SEND_TIME", // 送礼时间策略
        GIFT_SORT: 'GIFT_SORT_HIGH', // 送礼优先高等级
        GIFT_ALLOW_TYPE: ["1", "6"], // 允许送出的礼物类型，默认：辣条，亿圆
        GIFT_SEND_METHOD: "GIFT_SEND_BLACK", // 送礼黑白名单策略
        GIFT_SEND_ROOM: ["0"], // 送礼黑白名单策略 - 房间列表
        GET_PRIVILEGE: false, // 自动领取大会员权益
        LIVE_SIGN: true, // 直播区签到
        LOGIN: true, // 主站登陆
        LIKE_LIVEROOM: false, // 点赞直播间
        LIKE_LIVEROOM_INTERVAL: 400, // 点赞间隔（毫秒）
        LIVE_TASKS_ROOM: ["0"], // 直播区任务房间列表
        LIVE_TASKS_METHOD: "BLACK", // 直播区任务执行方式
        MEDAL_DANMU_INTERVAL: 2, // 打卡弹幕发送间隔（秒）
        MEDAL_DANMU: false, // 粉丝勋章打卡弹幕
        MEDAL_DANMU_CONTENT: ["(⌒▽⌒)", "（￣▽￣）", "(=・ω・=)", "(｀・ω・´)", "(〜￣△￣)〜", "(･∀･)", "(°∀°)ﾉ", "╮(￣▽￣)╭", "_(:3」∠)_", "(^・ω・^ )", "(●￣(ｴ)￣●)", "ε=ε=(ノ≧∇≦)ノ", "⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄", "←◡←"], // 粉丝勋章打卡弹幕内容
        REMOVE_ELEMENT_2233: false, // 移除2233
        REMOVE_ELEMENT_pkBanner: true, // 移除大乱斗入口
        REMOVE_ELEMENT_rank: true, // 移除排行榜入口
        REMOVE_ELEMENT_followSideBar: false, // 移除右侧关注按钮及弹窗
        REMOVE_ELEMENT_flipView: true, // 移除移除礼物栏下方广告
        REMOVE_ELEMENT_anchor: false, // 移除天选时刻弹窗及图标
        REMOVE_ELEMENT_pk: false, // 移除PK弹窗及进度条
        REMOVE_ELEMENT_playerIcon: true, // 移除直播水印
        RND_DELAY_END: 5, // 延迟最大值
        RND_DELAY_START: 2, // 延迟最小值
        SEND_ALL_GIFT: false, // 送满全部勋章
        SHARE: true, // 分享
        SILVER2COIN: false, // 银瓜子换硬币
        SPARE_GIFT_ROOM: "0", // 剩余礼物送礼房间
        TIME_RELOAD: false, // 定时刷新直播间
        TIME_RELOAD_MINUTE: 120, // 直播间重载时间
        UPDATE_TIP: true, //更新提示
        WATCH: true, // 观看视频
        WatchLive: false, // 观看直播
        WatchLiveInterval: 400, // 观看直播每两次心跳的间隔
        WatchLiveTime: 65, // 观看直播时间
      },
      CACHE_DEFAULT: {
        AUTO_SEND_DANMU_TS: [], // 弹幕发送
        AUTO_GROUP_SIGH_TS: 0, // 应援团签到
        MainSite_login_TS: 0, // 登录
        MainSite_watch_TS: 0, // 观看视频
        MainSite_coin_TS: 0, // 投币
        MainSite_share_TS: 0, // 分享视频
        Live_sign_TS: 0, // 直播签到
        Live_like_TS: 0, // 点赞
        Live_share_TS: 0, // 分享
        Live_watch_TS: 0, // 观看直播
        Live_medalDanmu_TS: 0, // 粉丝勋章打卡弹幕
        Silver2Coin_TS: 0, // 银瓜子换硬币
        Coin2Sliver_TS: 0, // 硬币换银瓜子
        Gift_TS: 0, // 自动送礼（定时）
        GiftInterval_TS: 0, // 自动送礼（间隔）
        NextVipPrivilege_TS: 0 // 领取大会员权益
      },
      CONFIG: {},
      CACHE: {},
      init: () => {
        addStyle();
        SP_CONFIG.darkMode = $('html').attr('lab-style') === 'dark' ? true : false;
        const tabList = $('.tab-list.dp-flex'),
          ct = $(".chat-history-panel"),
          ctWidth = ct.width(),
          aside_area_vmHeight = $('#aside-area-vm').height(),
          chat_control_panel_vmHeight = $('#chat-control-panel-vm').height(),
          eleList = ['.chat-history-list', '.attention-btn-ctnr', '.live-player-mounter'];
        tabContent = $('.tab-content');
        logDiv = $(`<li data-v-2fdbecb2="" data-v-d2be050a="" class="item dp-i-block live-skin-separate-border border-box t-center pointer live-skin-normal-text" style = 'font-weight:bold;color: #999;' id = "logDiv"><span id="logDivText">日志</span><div class="blth_num" style="display: none;" id = 'logRedPoint'>0</div></mli>`);
        let tabOffSet = 0, top = 0, left = 0;
        if (eleList.some(i => i.length === 0) || tabList.length === 0 || tabContent.length === 0) {
          window.toast('必要页面元素缺失，强制运行（可能会看不到控制面板，提示信息）', 'error');
        }
        tabList.append(logDiv);
        JQlogRedPoint = $('#logRedPoint');
        let tabListItems = [];
        for (let i = 0; i < tabList.children('li').length; i++) {
          tabListItems.push(tabList.children('li')[i]);
        };
        logIndex = myopen({
          type: 1,
          title: false,
          offset: [String(top) + 'px', String(left) + 'px'],
          closeBtn: 0,
          shade: 0,
          zIndex: 2000,
          fixed: false,
          area: [String(ctWidth) + 'px', String(aside_area_vmHeight - chat_control_panel_vmHeight) + 'px'], //宽高
          anim: -1,
          isOutAnim: false,
          resize: false,
          content: '<div id = "menuWindow"></div>',
          success: () => {
            layerLogWindow = $('#layui-layer1 .layui-layer-content');
            JQmenuWindow = $('#menuWindow');
            let logDivText = $('#logDivText');
            layerLogWindow.on("DOMNodeInserted", function () {
              layerLogWindow_Height = $(this).height();
              layerLogWindow_ScrollHeight = $(this)[0].scrollHeight;
              if (layerLogWindow_ScrollHeight > layerLogWindow_Height) {
                layerLogWindow.scrollTop(layerLogWindow.prop("scrollHeight"));
                $(this).off("DOMNodeInserted");
              }
            })
            layerLogWindow.scroll(function () {
              layerLogWindow_Height = $(this).height();
              layerLogWindow_ScrollHeight = $(this)[0].scrollHeight;
              layerLogWindow_ScrollTop = $(this)[0].scrollTop;
              layerLogWindow_ScrollY = layerLogWindow_ScrollTop + layerLogWindow_Height + 1;
              if (layerLogWindow_ScrollY < layerLogWindow_ScrollHeight) logDivText.text('日志🚀');
              else logDivText.text('日志');
            });
          }
        });
        layer.style(logIndex, {
          'box-shadow': 'none',
          'display': 'none',
          'background-color': SP_CONFIG.darkMode ? '#1c1c1c' : '#f2f3f5'
        });
        for (const i of tabListItems) {
          let JQi = $(i);
          JQi.click(() => {
            for (const item of tabListItems) {
              let JQitem = $(item);
              if (item != i) {
                if (JQitem.css('color') !== 'rgb(153, 153, 153)') JQitem.css("color", "#999");
                if (JQitem.hasClass('live-skin-main-text')) JQitem.removeClass('live-skin-main-text');
                if (JQitem.hasClass('active')) JQitem.removeClass('active');
                if (!JQitem.hasClass('live-skin-normal-text')) JQitem.addClass('live-skin-normal-text')
              } else {
                if (JQitem.css('color') !== 'rgb(51, 51, 51)') JQi.css("color", "#333");
                if (!JQitem.hasClass('live-skin-main-text')) JQi.addClass('live-skin-main-text');
                if (!JQitem.hasClass('active')) JQi.addClass('active');
                if (JQitem.hasClass('live-skin-normal-text')) JQi.removeClass('live-skin-normal-text');
              }
            }
            if (JQi.attr('id') === "logDiv") {
              if (!tabOffSet) {
                tabOffSet = $('.tab-content').offset();
                top = tabOffSet.top;
                left = tabOffSet.left;
                layer.style(logIndex, {
                  'top': String(top) + 'px',
                  'left': String(left) + 'px'
                });
              }
              layer.style(logIndex, {
                'display': 'block'
              });
            } else {
              layer.style(logIndex, {
                'display': 'none'
              });
            }
          })
        };
        let p1 = $.Deferred(), p2 = $.Deferred(), p3 = $.Deferred();
        try {
          // 设置token
          BAPI.setCommonArgs(Live_info.bili_jct);
          p1.resolve()
        } catch (err) {
          MYERROR(`设置token错误`, err);
          p1.reject();
        }
        try {
          MY_API.loadConfig().then(() => {
            MY_API.chatLog('脚本载入配置成功', 'success');
            p2.resolve()
          });
        } catch (e) {
          MYERROR('API初始化出错', e);
          MY_API.chatLog('API初始化出错', 'error');
          p2.reject()
        }
        try {
          MY_API.loadCache().then(() => {
            window.toast('CACHE载入成功', 'success')
            p3.resolve()
          });
        } catch (e) {
          MYERROR('CACHE初始化出错', e);
          window.toast('CACHE初始化出错', 'error')
          p3.reject()
        }
        return $.when(p1, p2, p3);
      },
      loadConfig: () => {
        // 加载配置函数
        let p = $.Deferred();
        try {
          MY_API.CONFIG = GM_getValue("CONFIG") || {};
          mergeObject(MY_API.CONFIG, MY_API.CONFIG_DEFAULT);
          p.resolve()
        } catch (e) {
          MYDEBUG('API载入配置失败，加载默认配置', e);
          MY_API.setDefaults();
          p.reject()
        }
        return p
      },
      loadCache: () => {
        // 加载CACHE
        let p = $.Deferred();
        try {
          MY_API.CACHE = GM_getValue("CACHE") || {}
          mergeObject(MY_API.CACHE, MY_API.CACHE_DEFAULT);
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
          const cache = SP_CONFIG.lastShowUpdateMsgVersion || '0';
          if (versionStringCompare(cache, version) === -1) {
            // cache < version
            const clientMliList = [
              "修复【检查弹幕是否发送成功】和【弹幕修改】不生效的 Bug。",
              "【直播区任务】中的粉丝勋章相关任务（点赞直播间，连续观看直播，粉丝勋章打卡弹幕）统一采用黑白名单机制。",
              "自动保存设置：在控制面板上的文本框中输入内容后脚本会自动保存设置。",
              "减缓了【自动投币】的速度，降低被风控的可能。"
            ];
            function createHtml(mliList) {
              if (mliList.length === 0) return "无";
              let mliHtml = "";
              for (const mli of mliList) {
                mliHtml = mliHtml + "<mli>" + mli + "</mli>";
              }
              return mliHtml;
            }
            myopen({
              title: `${version}更新提示`,
              area: [String($(window).width() * 0.382) + 'px', String($(window).height() * 0.618) + 'px'],
              content: `
                <h2>更新内容</h2>
                <mol>${createHtml(clientMliList)}</mol>
                <h2>通知</h2>
                <mol>经过慎重考虑，我决定将脚本中所有和抽奖有关的功能删除，请各位谅解。日后会将工作重心放到其他功能上。
                在被封了两个QQ群后我决定建一个QQ频道${linkMsg('https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W7eVLs&businessType=9&from=181074&biz=ka&shareSource=5', '（点我加入）')}，
                也可以加入非官方电报群：${linkMsg('https://t.me/LaTiao01', 'LaTiao01')}。
                </mol>
                <hr><em style="color:grey;">
                如果在使用过程中遇到问题，请到 ${linkMsg('https://github.com/andywang425/BLTH/issues', 'github')}反馈。
                也欢迎加入${linkMsg('https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W7eVLs&businessType=9&from=181074&biz=ka&shareSource=5', '官方QQ频道')}（聊天、反馈问题、提出建议）和${linkMsg('https://t.me/LaTiao01', '非官方电报群')}（纯聊天）。
                </em>
                `
            });
            SP_CONFIG.lastShowUpdateMsgVersion = version;
            saveSpConfig();
          }
        } catch (e) {
          MYDEBUG('提示信息CACHE载入失败', e);
        }
      },
      saveConfig: (show = true) => {
        // 保存配置函数
        try {
          GM_setValue("CONFIG", MY_API.CONFIG);
          if (show) window.toast('配置已保存，部分设置需刷新后才能生效', 'info');
          MYDEBUG('MY_API.CONFIG', MY_API.CONFIG);
          return true
        } catch (e) {
          MYDEBUG('API保存出错', e);
          return false
        }
      },
      saveCache: (logswitch = true) => {
        // 保存缓存函数
        try {
          GM_setValue("CACHE", MY_API.CACHE);
          if (logswitch) MYDEBUG('CACHE已保存', MY_API.CACHE)
          return true
        } catch (e) {
          MYDEBUG('CACHE保存出错', e);
          return false
        }
      },
      setDefaults: () => {
        // 重置配置函数
        MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
        MY_API.CACHE = MY_API.CACHE_DEFAULT;
        MY_API.saveConfig();
        MY_API.saveCache();
        mymsg('配置和缓存已重置为默认，请刷新页面使配置生效。', { icon: 1 });
      },
      resetCache: () => {
        MY_API.CACHE = MY_API.CACHE_DEFAULT;
        MY_API.saveCache();
        mymsg('缓存已重置为默认，请刷新页面使配置生效。', { icon: 1 });
      },
      resetMainSiteTasksCache: () => {
        MY_API.CACHE.MainSite_login_TS = 0;
        MY_API.CACHE.MainSite_watch_TS = 0;
        MY_API.CACHE.MainSite_coin_TS = 0;
        MY_API.CACHE.MainSite_share_TS = 0;
        MY_API.saveCache();
        mymsg('主站每日任务缓存已重置为默认，请刷新页面使配置生效。', { icon: 1 });
      },
      resetLiveTasksCache: () => {
        MY_API.CACHE.Live_sign_TS = 0;
        MY_API.CACHE.Live_like_TS = 0;
        MY_API.CACHE.Live_share_TS = 0;
        MY_API.CACHE.Live_watch_TS = 0;
        MY_API.CACHE.Live_medalDanmu_TS = 0;
        MY_API.saveCache();
        mymsg('直播任务缓存已重置为默认，请刷新页面使配置生效。', { icon: 1 });
      },
      resetOtherTasksCache: () => {
        MY_API.CACHE.Silver2Coin_TS = 0;
        MY_API.CACHE.Coin2Sliver_TS = 0;
        MY_API.CACHE.AUTO_GROUP_SIGH_TS = 0;
        MY_API.saveCache();
        mymsg('其它任务缓存已重置为默认，请刷新页面使配置生效。', { icon: 1 });
      },
      removeUnnecessary: () => {
        // 移除不必要的页面元素
        const unnecessaryObj = [
          {
            // 2233
            settingName: 'REMOVE_ELEMENT_2233',
            rmJQpath: ['#my-dear-haruna-vm']
          },
          {
            // 大乱斗入口
            settingName: 'REMOVE_ELEMENT_pkBanner',
            rmJQpath: ['.chaos-pk-banner']
          },
          {
            // 排行榜（活动？）
            settingName: 'REMOVE_ELEMENT_rank',
            rmJQpath: ['.activity-gather-entry', '.activity-rank', '.rank-item']
          },
          {
            // 关注按钮及弹窗
            settingName: 'REMOVE_ELEMENT_followSideBar',
            rmJQpath: ['div[data-upgrade-intro="Follow"]', '.side-bar-popup-cntr.ts-dot-4']
          },
          {
            // 礼物栏下方广告
            settingName: 'REMOVE_ELEMENT_flipView',
            rmJQpath: ['.flip-view']
          },
          {
            // 天选时刻弹窗及图标
            settingName: 'REMOVE_ELEMENT_anchor',
            addCss: '.anchor-lottery-entry * {display: none;} #anchor-guest-box-id * {display: none;}',
            eval: `setInterval(() => {$("iframe").contents().find("#app .close-btn").click()}, 200)`
          },
          {
            // PK弹窗及进度条
            settingName: 'REMOVE_ELEMENT_pk',
            addCss: '.process-box * {display: none;} #chaos-pk-vm * {display:none;}',
            eval: `setInterval(() => {$("iframe").contents().find("#app .closeBtn").click()}, 200)`
          },
          {
            // 直播水印
            settingName: 'REMOVE_ELEMENT_playerIcon',
            rmJQpath: ['.web-player-icon-roomStatus']
          }
        ];

        const removeElement = (obj) => {
          if (MY_API.CONFIG[obj.settingName]) {
            if (obj.hasOwnProperty('rmJQpath')) {
              for (const path of obj.rmJQpath) {
                let timer = setInterval(() => {
                  const unnecessaryItem = $(path);
                  if (unnecessaryItem.length > 0) {
                    unnecessaryItem.remove();
                    clearInterval(timer)
                  }
                }, 200);
              }
            }
            if (obj.hasOwnProperty('addCss')) GM_addStyle(obj.addCss);
            if (obj.hasOwnProperty('eval')) eval(obj.eval);
          }
        };
        for (const i of unnecessaryObj) {
          removeElement(i);
        };
      },
      buyFanMedal: (room_id) => {
        return BAPI.live_user.get_anchor_in_room(room_id).then(function (response) {
          MYDEBUG('API.live_user.get_anchor_in_room response', response)
          if (response.code === 0 && response.data.info) {
            const uid = String(response.data.info.uid),
              uname = response.data.info.uname;
            return BAPI.xlive.getInfoByUser(room_id).then(function (res) {
              if (res.code === 0) {
                if (!res.data.medal.up_medal) {
                  return mymsg(`<div style = "text-align:center">UP主<br>${linkMsg("https://space.bilibili.com/" + uid, uname)}<br>没有粉丝勋章，无法购买</div>`, {
                    time: 2500,
                    icon: 2
                  });
                }
                myconfirm(`<div style = "text-align:center">是否消耗2B币购买UP主<br>${linkMsg("https://space.bilibili.com/" + uid, uname)}<br>的粉丝勋章？</div>`, {
                  title: `购买勋章 房间号：${room_id}`,
                  btn: ['是', '否']
                }, function () {
                  BAPI.x.elec_pay_quick(response.data.info.uid).then((re) => {
                    MYDEBUG('API.x.elec_pay_quick re', re);
                    if (re.code === 0 && re.data.status === 4) {
                      mymsg('购买成功', {
                        time: 2000,
                        icon: 1
                      });
                    } else {
                      mymsg(`购买失败 ${re.data.msg}`, {
                        time: 2500,
                        icon: 2
                      });
                    }
                  });
                }, function () {
                  mymsg('已取消购买', {
                    time: 2000
                  });
                });
              } else {
                return mymsg(`检查房间出错 ${response.message}`, {
                  time: 2500
                });
              }
            });
          }
          else if (response.code === 0 && response.data.info === undefined) {
            mymsg(`房间不存在`, {
              time: 2500
            });
          }
          else {
            mymsg(`检查房间出错 ${response.message}`, {
              time: 2500
            });
          }
        });
      },
      creatSetBox: async () => {
        //添加按钮
        const btnmsg = SP_CONFIG.mainDisplay === 'hide' ? '显示控制面板' : '隐藏控制面板';
        const btn = $(`<button class="blth_btn" style="display: inline-block; float: left; margin-right: 7px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;" id="hiderbtn">${btnmsg}<br></button>`);
        const body = $('body');
        const webHtml = $('html');
        const html = GM_getResourceText('main');
        function layerOpenAbout() {
          return myopen({
            title: `版本${GM_info.script.version}`,
            content: `<h3 style="text-align:center">B站直播间挂机助手</h3>作者：${linkMsg("https://github.com/andywang425/", "andywang425")}<br>许可证：${linkMsg("https://raw.githubusercontent.com/andywang425/BLTH/master/LICENSE", "MIT")}<br>github项目地址：${linkMsg("https://github.com/andywang425/BLTH", "BLTH")}<br>反馈：${linkMsg("https://github.com/andywang425/BLTH/issues", "BLTH/issues")}<br>交流qq群：${linkMsg("https://jq.qq.com/?_wv=1027&k=9refOc8c", '657763329')}<br>`
          });
        };
        const saveAction = (div) => {
          let val = undefined;
          let valArray = undefined;
          let val1, val2, val3;
          // TIME_RELOAD save
          val = parseInt(div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val());
          if (val <= 0 || val > 10000)
            return window.toast('[直播间重载时间]数据小于等于0或大于10000', 'caution');
          MY_API.CONFIG.TIME_RELOAD_MINUTE = val;
          // COIN
          val = parseInt(div.find('div[data-toggle="COIN"] .coin_number').val());
          if (val < 0 || val > 5)
            return window.toast("[自动投币]数据小于0或大于5", 'caution');
          MY_API.CONFIG.COIN_NUMBER = val;
          // AUTO_GIFT_ROOMID
          val = div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') {
              valArray[i] = 22474988;
            }
          };
          MY_API.CONFIG.AUTO_GIFT_ROOMID = valArray;
          // GIFT_LIMIT
          val = parseInt(div.find('div[data-toggle="GIFT_LIMIT"] .num').val());
          MY_API.CONFIG.GIFT_LIMIT = val;
          // GIFT_INTERVAL
          val = parseInt(div.find('div[data-toggle="GIFT_INTERVAL"] .num').val());
          MY_API.CONFIG.GIFT_INTERVAL = val;
          // GIFT_SEND_TIME
          val1 = parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val());
          val2 = parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val());
          if (val1 < 0 || val2 < 0 || val1 >= 24 || val2 >= 60)
            return window.toast("[送礼时间]时间错误", 'caution');
          MY_API.CONFIG.GIFT_SEND_HOUR = val1;
          MY_API.CONFIG.GIFT_SEND_MINUTE = val2;
          // SPARE_GIFT_ROOM
          val = div.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val();
          MY_API.CONFIG.SPARE_GIFT_ROOM = val;
          // COIN_UID
          val = div.find('div[data-toggle="COIN_UID"] .num').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') {
              valArray[i] = 0;
            }
          };
          MY_API.CONFIG.COIN_UID = valArray;
          // AUTO_DANMU
          val1 = div.find('div[data-toggle="AUTO_DANMU_SETTINGS"] .Danmu').val();
          valArray = val1.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') {
              valArray[i] = '这是一条弹幕';
            }
          };
          val1 = valArray;
          val2 = div.find('div[data-toggle="AUTO_DANMU_SETTINGS"] .Roomid').val();
          valArray = val2.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') {
              valArray[i] = '22474988';
            }
          };
          val2 = valArray;
          val3 = div.find('div[data-toggle="AUTO_DANMU_SETTINGS"] .Time').val();
          valArray = val3.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') {
              valArray[i] = '10m';
            }
          };
          val3 = valArray;
          MY_API.CONFIG.DANMU_CONTENT = val1;
          MY_API.CONFIG.DANMU_ROOMID = val2;
          MY_API.CONFIG.DANMU_INTERVAL_TIME = val3;
          // MEDAL_DANMU_INTERVAL
          val = parseFloat(div.find('[data-toggle="MEDAL_DANMU_INTERVAL"] .num').val())
          if (isNaN(val) || val < 0) return window.toast('[打卡弹幕发送间隔] 错误输入', 'caution');
          MY_API.CONFIG.MEDAL_DANMU_INTERVAL = val;
          // COIN2SILVER_NUM
          val = parseInt(div.find('[data-toggle="COIN2SILVER"] .coin_number').val());
          if (isNaN(val) || val < 0) return window.toast('[硬币换银瓜子] 错误输入', 'caution');
          MY_API.CONFIG.COIN2SILVER_NUM = val;
          // GIFT_ALLOW_TYPE
          val = div.find('[data-toggle="GIFT_ALLOW_TYPE"] .str').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') {
              valArray[i] = '0';
            }
          };
          MY_API.CONFIG.GIFT_ALLOW_TYPE = valArray;
          // DANMU_MODIFY_REGEX
          val = div.find('div[data-toggle="DANMU_MODIFY_REGEX"] .str').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') valArray[i] = 1;
            else valArray[i] = valArray[i];
          };
          MY_API.CONFIG.DANMU_MODIFY_REGEX = valArray;
          // DANMU_MODIFY_UID
          val = div.find('div[data-toggle="DANMU_MODIFY_UID"] .str').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') valArray[i] = 0;
            else valArray[i] = parseInt(valArray[i]);
          };
          MY_API.CONFIG.DANMU_MODIFY_UID = valArray;
          // DANMU_MODIFY_POOL
          val = div.find('div[data-toggle="DANMU_MODIFY_POOL"] .str').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') valArray[i] = 1;
            else valArray[i] = parseInt(valArray[i]);
          };
          MY_API.CONFIG.DANMU_MODIFY_POOL = valArray;
          // DANMU_MODIFY_COLOR
          val = div.find('div[data-toggle="DANMU_MODIFY_COLOR"] .str').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') valArray[i] = '#FF000';
          };
          MY_API.CONFIG.DANMU_MODIFY_COLOR = valArray;
          // DANMU_MODIFY_SIZE
          val = div.find('div[data-toggle="DANMU_MODIFY_SIZE"] .str').val();
          valArray = val.split(",");
          for (let i = 0; i < valArray.length; i++) {
            if (valArray[i] === '') valArray[i] = 1;
            else valArray[i] = parseFloat(valArray[i]);
          };
          MY_API.CONFIG.DANMU_MODIFY_SIZE = valArray;
          // AUTO_CHECK_DANMU_TIMEOUT
          val = parseInt(div.find('[data-toggle="AUTO_CHECK_DANMU_TIMEOUT"] .num').val());
          if (isNaN(val) || val <= 0) return window.toast('[检查弹幕是否发送成功超时时间] 错误输入', 'caution');
          MY_API.CONFIG.AUTO_CHECK_DANMU_TIMEOUT = val;
          // LIKE_LIVEROOM_INTERVAL
          val = parseInt(div.find('[data-toggle="LIKE_LIVEROOM_INTERVAL"] .num').val());
          if (isNaN(val) || val < 0) return window.toast('[直播点赞请求间隔] 错误输入', 'caution');
          MY_API.CONFIG.LIKE_LIVEROOM_INTERVAL = val;
          // WatchLiveInterval
          val = parseInt(div.find('[data-toggle="WatchLiveInterval"] .num').val());
          if (isNaN(val) || val < 0) return window.toast('[观看直播心跳请求间隔] 错误输入', 'caution');
          MY_API.CONFIG.WatchLiveInterval = val;
          // WatchLiveTime
          val = parseInt(div.find('[data-toggle="WatchLiveTime"] .num').val());
          if (isNaN(val) || val < 0) return window.toast('[观看直播心跳请求间隔] 错误输入', 'caution');
          MY_API.CONFIG.WatchLiveTime = val;
          return MY_API.saveConfig();
        };
        const checkList = [
          "AUTO_DANMU",
          "AUTO_GIFT",
          "AUTO_GROUP_SIGN",
          "COIN",
          "COIN2SILVER",
          "GET_PRIVILEGE",
          "WatchLive",
          "LIVE_SIGN",
          "LOGIN",
          "MEDAL_DANMU",
          "REMOVE_ELEMENT_2233",
          "REMOVE_ELEMENT_anchor",
          "REMOVE_ELEMENT_flipView",
          "REMOVE_ELEMENT_followSideBar",
          "REMOVE_ELEMENT_pk",
          "REMOVE_ELEMENT_pkBanner",
          "REMOVE_ELEMENT_playerIcon",
          "REMOVE_ELEMENT_rank",
          "SEND_ALL_GIFT",
          "SHARE",
          "SILVER2COIN",
          "TIME_RELOAD",
          "UPDATE_TIP",
          "WATCH",
          "LIKE_LIVEROOM"
        ];
        const radioList = [
          /**
           *  {
           *     name: 包含所有多选框的div的data-toggle，多选框的name，MY_API.CONFIG中的对象名
           *     toggle<num>: 每个多选框的div的data-toggle，MY_API.CONFIG中对应设置的值
           *  }
           */
          {
            name: 'COIN_TYPE',
            toggle1: 'COIN_DYN',
            toggle2: 'COIN_UID'
          },
          {
            name: 'GIFT_METHOD',
            toggle1: 'GIFT_INTERVAL',
            toggle2: 'GIFT_SEND_TIME'
          },
          {
            name: 'GIFT_SORT',
            toggle1: 'GIFT_SORT_HIGH',
            toggle2: 'GIFT_SORT_LOW'
          },
          {
            name: 'LIVE_TASKS_METHOD',
            toggle1: 'LIVE_TASKS_WHITE',
            toggle2: 'LIVE_TASKS_BLACK'
          },
          {
            name: 'GIFT_SEND_METHOD',
            toggle1: 'GIFT_SEND_WHITE',
            toggle2: 'GIFT_SEND_BLACK'
          }
        ];
        const helpText = {
          // 帮助信息
          GIFT_SEND_METHOD: "自动送礼策略，有白名单和黑名单两种。后文中的<code>直播间</code>指拥有粉丝勋章的直播间。<mul><mli>白名单：仅给房间列表内的直播间送礼。</mli><mli>黑名单：给房间列表以外的直播间送礼。</mli><mli>如果要填写多个房间，每两个房间号之间需用半角逗号<code>,</code>隔开。</mli></mul>",
          MEDAL_DANMU: '在拥有粉丝勋章的直播间内，每天发送的首条弹幕将点亮对应勋章并给该勋章+100亲密度。<mh3>注意：</mh3><mul><mli>如果要填写多条弹幕，每条弹幕间请用半角逗号<code>,</code>隔开，发弹幕时将依次选取弹幕进行发送（若弹幕数量不足则循环选取）。</mli><mli>本功能运行时【自动发弹幕】和【自动送礼】将暂停运行。</mli></mul>',
          AUTO_DANMU: '发送直播间弹幕。<mh3>注意：</mh3><mul><mli>本功能运行时【粉丝勋章打卡弹幕】将暂停运行。</mli><mli><mp>弹幕内容，房间号，发送时间可填多个，数据之间用半角逗号<code>,</code>隔开(数组格式)。脚本会按顺序将这三个值一一对应，发送弹幕。</mp></mli><mli><mp>由于B站服务器限制，每秒最多只能发1条弹幕。若在某一时刻有多条弹幕需要发送，脚本会在每条弹幕间加上1.5秒间隔时间（对在特定时间点发送的弹幕无效）。</mp></mli><mli><mp>如果数据没对齐，缺失的数据会自动向前对齐。如填写<code>弹幕内容 lalala</code>，<code>房间号 3,4</code>，<code>发送时间 5m,10:30</code>，少填一个弹幕内容。那么在发送第二条弹幕时，第二条弹幕的弹幕内容会自动向前对齐（即第二条弹幕的弹幕内容是lalala）。</mp></mli><mli><mp>可以用默认值所填的房间号来测试本功能，但是请不要一直发。</mp></mli><mli><mp>发送时间有两种填写方法</mp><mp>1.【小时】h【分钟】m【秒】s</mp><mul><mli>每隔一段时间发送一条弹幕</mli><mli>例子：<code>1h2m3s</code>, <code>300m</code>, <code>30s</code>, <code>1h50s</code>, <code>2m6s</code>, <code>0.5h</code></mli><mli>可以填小数</mli><mli>可以只填写其中一项或两项</mli></mul><mp>脚本会根据输入数据计算出间隔时间，每隔一个间隔时间就会发送一条弹幕。如果不加单位，如填写<code>10</code>则默认单位是分钟（等同于<code>10m</code>）。</mp><mp><em>注意：必须按顺序填小时，分钟，秒，否则会出错(如<code>3s5h</code>就是错误的写法)</em></mp><mp>2.【小时】:【分钟】:【秒】</mp><mul><mli>在特定时间点（本地时间）发一条弹幕</mli><mli>例子： <code>10:30:10</code>, <code>0:40</code></mli><mli>只能填整数</mli><mli>小时分钟必须填写，秒数可以不填</mli></mul><mp>脚本会在该时间点发一条弹幕（如<code>13:30:10</code>就是在下午1点30分10秒的时候发弹幕）。</mp></mli></mul>',
          NOSLEEP: '屏蔽B站的挂机检测。不开启本功能时，标签页后台或长时间无操作就会触发B站的挂机检测。<mh3>原理：</mh3><mul><mli>劫持页面上的<code>addEventListener</code>绕过页面可见性检测，每5分钟触发一次鼠标移动事件规避鼠标移动检测。同时劫持页面上的setTimeout和setInterval避免暂停直播的函数被调用。</mli><mul>',
          INVISIBLE_ENTER: '开启后进任意直播间其他人都不会看到你进直播间的提示【xxx 进入直播间】（只有你自己能看到）。<mh3>缺点：</mh3><mul><mli>开启后无法获取自己是否是当前直播间房管的数据，关注按钮状态均为未关注。所以开启本功能后进任意直播间都会有【禁言】按钮（如果不是房管操作后会显示你没有权限），发弹幕时弹幕旁边会有房管标识（如果不是房管则只有你能看到此标识）。</mli><mli>无法打开页面下拉后出现的动态的评论区。</mli></mul>',
          BUY_MEDAL: "通过给UP充电，消耗2B币购买某位UP的粉丝勋章。<mul><mli>默认值为当前房间号。点击购买按钮后有确认界面，无需担心误触。</mli></mul>",
          btnArea: "缓存中存放的是各个任务上次运行的时间，脚本通过缓存来判断某些周期性执行的任务需不需要执行（比如每天一次的分享视频任务）。<mul><mli>重置所有为默认：指将设置和缓存重置为默认。</mli><mli>导出配置：导出一个包含当前脚本设置的json到浏览器的默认下载路径，文件名为<code>BLTH_CONFIG.json</code>。</mli><mli>导入配置：从一个json文件导入脚本配置，导入成功后脚本会自动刷新页面使配置生效。</mli></mul>",
          WatchLive: "通过模拟心跳完成连续观看直播的任务（无论目标房间是否开播都能完成任务）。<mul><mli>本任务运行时不会自动刷新页面。</mli><mli>如果你使用了带有广告拦截功能的浏览器拓展，可能会导致该功能无法使用。请自行将以下两个URL（或者合适的拦截规则）添加到拓展程序的白名单中：<br><code>https://live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/E</code><br><code>https://live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/X</code></mli><mli>如果主播没有设置直播分区，该任务无法完成。</mli></mul>",
          SEND_ALL_GIFT: "若不勾选该项，自动送礼只会送出在【允许被送出的礼物类型】中的礼物。",
          AUTO_GIFT_ROOMID: "送礼时优先给这些房间送礼，送到对应粉丝牌亲密度上限后再送其它的。<mul><mli>如果要填写多个房间，每两个房间号之间需用半角逗号<code>,</code>隔开。如<code>666,777,888</code>。</mli></mul>",
          GIFT_LIMIT: "将要在这个时间段里过期的礼物会被送出。<mh3>注意：</mh3><mul><mli>勾选【无视礼物类型和到期时间限制】时无论礼物是否将要过期都会被送出。</mli></mul>",
          AUTO_GIFT: "<mh3>说明：</mh3><mul><mli>送礼设置优先级：<br>不送礼房间 >优先送礼房间 >优先高/低等级粉丝牌。</mli><mli>送礼设置逻辑规则：<br>无论【优先高/低等级粉丝牌】如何设置，会根据【无视礼物类型和到期时间限制】（勾选则无视是否到期补满亲密度，否则只送到期的）条件去按优先送礼房间先后顺序送礼。之后根据【优先高/低等级粉丝牌】决定先送高级还是低级。 </mli><mli>送礼顺序：<br>高亲密度的礼物会被优先送出，在满足此条件的情况下先送快要过期的礼物。 </mli><mli>不会送出永久礼物。 </mli></mul>",
          SPARE_GIFT_ROOM: "【剩余礼物】指送满了所有粉丝牌，但仍有剩余的将在1天内过期的礼物。<mul><mli>该项填<code>0</code>则不送剩余礼物。</mli></mul>",
          COIN: "自动给视频投币，每天最多投5个。<mul><mli>脚本会根据今日你已获得的投币经验值判断你已经投了多少个币，然后自动投剩余没投的币。<blockquote>如今日已获得投币经验20，脚本投币数量设置为4，则会投2个币。</blockquote></mli></mul>",
          COIN_UID: "该项若填<code>0</code>则给动态中的视频依次投币(不存在UID为0的用户)。<mul><mli>可以填写多个uid，每两个uid间用半角逗号<code>,</code>隔开。</mli><mli>如果填了多个uid，则会依次检查这些UP是否有可投币的视频。</mli></mul>",
          LIVE_TASKS_METHOD: "执行以下三个任务（点赞直播间，连续观看直播，粉丝勋章打卡弹幕）的任务模式，有白名单和黑名单两种。后文中的<code>直播间</code>指拥有粉丝勋章的直播间。<mul><mli>白名单：仅在房间列表内的直播间执行任务。</mli><mli>黑名单：在房间列表以外的直播间执行任务。</mli><mli>若要填写多个直播间，每两个直播间号之间用半角逗号<code>,</code>隔开。</mli></mul>",
          debugSwitch: "开启或关闭控制台日志(Chrome可通过<code>ctrl + shift + i</code>，再点击<code>Console</code>打开控制台)。<mul><mli>平时建议关闭，减少资源占用。</mli><mli>该设置只会影响日志(<code>console.log</code>)，不会影响报错(<code>console.error</code>)。</mli></mul>",
          UPDATE_TIP: "每次更新后第一次运行脚本时显示关于更新内容的弹窗。",
          MEDAL_DANMU_INTERVAL: "每两条弹幕间所等待的时间。<mh3>注意：</mh3><mul><mli>由于B站服务器限制，间隔时间必须大于等于1秒，否则弹幕发送会出错。</mli></mul>",
          SHARE: "并不会真的分享视频，通过调用特定api直接完成任务。",
          COIN2SILVER: "普通用户每天兑换上限<code>25</code>硬币，老爷或大会员每天兑换上限<code>50</code>硬币。<mul><mli><code>1</code>硬币 = <code>450</code>银瓜子（老爷或大会员<code>500</code>银瓜子）。</mli></mul>",
          SILVER2COIN: "每日直播用户都可以将部分银瓜子转化为硬币，每天仅一次机会。<mul><mli><code>700</code>银瓜子 = <code>1</code>硬币。</mul></mli>",
          windowToast: `右上角的提示信息。相对来说不是那么重要，所以不放在日志窗口里。<mul style = "line-height:1em;"><div class="link-toast info fixed"><span class="toast-text">普通消息</span></div><br><br><br><div class="link-toast success fixed"><span class="toast-text">成功</span></div><br><br><br><div class="link-toast error fixed"><span class="toast-text">发生错误</span></div></mul>`,
          GIFT_ALLOW_TYPE: "可以填写礼物的id或者礼物名称。<mul><mli>如果要填写多个，每两项之间请用半角逗号<code>,</code>隔开。</mli><mli>如果填写礼物名称，请确保所填写的名称与官方名称完全一致，否则将无法识别。</mli><mli>在脚本中打开控制台日志后，在控制台(Chrome可通过<code>ctrl + shift + i</code>，再点击<code>Console</code>打开控制台)中搜索<code>InitData: API.gift.gift_config</code>可以找到一个包含礼物名称和 id 的json。将data下的几项全部展开，再搜索礼物名即可找到 id 。</mli><mli>常用 id ：1: <code>辣条</code> 6: <code>亿圆</code></mli></mul>",
          REMOVE_ELEMENT_anchor: "屏蔽天选时刻弹窗和礼物栏左侧的图标。<mh3>注意：</mh3><mul><mli>开启这一功能后会消耗相对较多的资源。</mli><mli>弹窗出现后（不可见）0-200ms的时间内浏览器窗口会无法滚动。</mli></mul><mh3>原理：</mh3><mul>通过修改css样式使弹窗不显示。但弹窗出现时浏览器窗口会被限制滚动，脚本检测到之后会将其关闭来解除滚动限制。</mul>",
          REMOVE_ELEMENT_anchor: "屏蔽天选时刻弹窗和礼物栏左侧的图标。<mh3>注意：</mh3><mul><mli>开启这一功能后会消耗相对较多的资源。</mli><mli>弹窗出现后（不可见）0-200ms的时间内浏览器窗口会无法滚动。</mli></mul><mh3>原理：</mh3><mul>通过修改css样式使弹窗不显示。但弹窗出现时浏览器窗口会被限制滚动，脚本检测到之后会将其关闭来解除滚动限制。</mul>",
          REMOVE_ELEMENT_pk: "屏蔽大乱斗弹窗和进度条。<mh3>注意：</mh3><mul><mli>开启这一功能后会消耗相对较多的资源。</mli><mli>弹窗出现后（不可见）0-200ms的时间内浏览器窗口会无法滚动。</mli></mul><mh3>原理：</mh3><mul>通过修改css样式使弹窗不显示。但弹窗出现时浏览器窗口会被限制滚动，脚本检测到之后会将其关闭来解除滚动限制。</mul>",
          banP2p: "禁止p2p上传（下载），减少上行带宽的占用。<mh3>原理：</mh3><mul>删除window下部分WebRTC方法，如<code>RTCPeerConnection</code>,<code>RTCDataChannel</code>。</mul><h3>说明：</h3><mul><mli>B站的<a href = 'https://baike.baidu.com/item/%E5%AF%B9%E7%AD%89%E7%BD%91%E7%BB%9C/5482934' target = '_blank'>P2P</a>上传速率大概在600KB/s左右，目的是为了让其他用户能更加流畅地观看直播。如果你的上行带宽较小建议禁用。</mli><mli>开启后控制台可能会出现大量报错如<code style='color:red;'>unsupported bilibili p2p</code>，<code style='color:red;'>Error: launch bili_p2p failed</code>，此类报错均为b站js的报错，无视即可。</mli></mul>",
          DANMU_MODIFY: "修改匹配到的当前直播间弹幕，改变弹幕的显示方式。<mh3>注意：</mh3><mul><mli>匹配弹幕和修改弹幕中的所有设置项都支持填写多个数据。若要填写多个，请用半角逗号<code>,</code>隔开。例：正则表达式 <code>/团【/,/P【/</code>。 </mli><mli>若填写了多个数据，脚本会把这些数据一一匹配，创建不同的规则。缺失的数据会自动向前对齐。<br>例：脚本设置为 匹配弹幕：<code>/团【/,/P【/</code> 发送者UID：<code>0</code> 弹幕池：<code>4,5</code> 颜色：<code>#FF0000,#9932CC</code> 大小：<code>1.2</code><br>此时有这么一条弹幕：<code>P【这个塔的伤害好高啊</code>，满足了第二条匹配规则<code>/P【/</code>。但由于该规则中缺少【大小】数据，则自动向前对齐，即大小被设为<code>1.2</code>。</mli></mli></mul><mh3>匹配弹幕</mh3>有【正则表达式】和【发送者UID】两种匹配方式，任意一项匹配成功则对弹幕进行修改。<mul><mli>正则表达式：即<a href='https://www.runoob.com/js/js-regexp.html' target='_blank'>JavaScript正则表达式</a>。格式为<code>/【正则】/【修饰符】（可选）</code>，如<code>/cards/i</code>。<br>如果填写的正则表达式能匹配弹幕内容则对弹幕进行修改。 </mli><mli>发送者UID：如果填写的UID中包含弹幕发送者的UID则对弹幕进行修改。</mli></mul><mh3>修改弹幕</mh3><mul><mli>弹幕池：修改弹幕所在的弹幕池，可以改变弹幕的显示位置。<br>弹幕池编号：<code>1</code>滚动，<code>4</code>底部，<code>5</code>顶部。如果填写其他数字则不会显示。</mli><mli>颜色：修改弹幕的颜色。<br>需填写所要修改颜色的<a href='http://tools.jb51.net/color/rgb_hex_color' target='_blank'>十六进制颜色码</a>，如<code style='color:#FF0000;'>#FF0000</code>。</mli><mli>大小：缩放弹幕到指定大小。<br>填<code>1.5</code>就是放大到原来的1.5倍，填<code>0.5</code>则是缩小到一半。</mli></mul>",
          blockLiveStream: `拦截直播流。开启本功能后将无法观看直播。<mh3>原理：</mh3><mul>劫持页面上的fetch，通过判断url是否含有<code>bilivideo</code>拦截所有直播流请求。</mul><mh3>注意：</mh3><mul><mli>开启本功能后控制台中会出现大量报错，如<code style='color:red;'>id 38: player core NetworkError, {"code":11001,"errInfo":{"url":"https://d1--cn-gotcha204.bilivideo.com/live-bvc/284219/live_50333369_2753084_4000/index.m3u8?expires=1618677399&len=0&oi=1700331273&pt=web&qn=0&trid=9cc4c8772c0543999b03360f513dd1fa&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha04&sign=bd05d848ebf2c7a815e0242ac1477187&p2p_type=1&src=9&sl=4&sk=59b4112a8c653bb","info":"TypeError: Cannot read property 'then' of undefined"}}</code>，此类报错均为b站js的报错，无视即可。</mli></mul>`,
          blockliveDataUpdate: "拦截直播观看数据上报。<mh3>原理：</mh3><mul>劫持页面上的fetch和XMLHttpRequest，拦截所有url中含有<code>data.bilibili.com/gol/postweb</code>的fetch请求和url中含有<code>data.bilibili.com/log</code>的xhr请求。</mul><mh3>注意：</mh3><mul><mli>开启本功能后控制台中会出现大量警告，如<code style='color:rgb(255 131 0);'>jQuexry.Deferred exception: Cannot read property 'status' of undefined TypeError: Cannot read property 'status' of undefined</code>，此类报错均为b站js的报错，无视即可。 </mli></mul><mh3>说明：</mh3><mul><mli>根据观察，目前上报的数据有：p2p种类，直播画质，直播流编码方式，直播流地址，直播流名称，直播流协议，窗口大小，观看时长，请求花费时长， 请求成功/失败数量，通过p2p下载的有效直播流大小，通过p2p上传的直播流大小，当前直播间地址，当前时间戳等等。 </mli></mul>",
          WEAR_MEDAL_BEFORE_DANMU: "手动发送弹幕前自动佩戴当前房间的粉丝勋章再发弹幕。<mul><mli>如果没有当前直播间的粉丝勋章则不进行任何操作。</mli><mli>【一直自动佩戴】比较适合需要同时在多个直播间发弹幕的情况。如果只想在某一个直播间发弹幕勾选【仅在首次发弹幕时自动佩戴】即可。</mli><mli>佩戴成功后会把弹幕框左侧的粉丝牌替换为当前直播间的粉丝牌。</mli></mul>",
          REMOVE_ELEMENT_followSideBar: "开启本功能后会导致【实验室】按钮点击后无法出现弹窗。",
          REMOVE_ELEMENT_pkBanner: "移除位于直播画面上方的大乱斗入口。",
          REMOVE_ELEMENT_rank: "移除位于直播画面上方的排行榜（？）入口。<mul><mli>这个位置有时候会变成某个活动的入口。如果你不是主播也不是喜欢给主播送礼物的观众，那么这些活动通常和你没关系。</mli></mul>",
          GET_PRIVILEGE: "每个月领取一次大会员权益。<mul><mli>目前仅支持领取B币券和会员购优惠券。</mli></mul>",
          AUTO_CHECK_DANMU: "检查你在当前直播间发送的弹幕是否发送成功。脚本向其它直播间发送的弹幕不在检测范围内。<mul><mli>这里的发送成功指的是你发送的弹幕对其他人可见。有时候表面上弹幕发送成功了，但实际上只有你自己能看见那条弹幕。</mli><mli>若弹幕疑似发送失败，则在右上角显示一条提示信息。</mli></mul>",
          AUTO_CHECK_DANMU_TIMEOUT: "弹幕被发送出去后开始计时，如果没有在超时时间内从当前直播间的webSocket中接收到之前所发送的弹幕则认为发送失败。",
          LIKE_LIVEROOM: "完成点赞直播间1次的任务",
          LIKE_LIVEROOM_INTERVAL: "每两次点赞之间的间隔时间。<mul><mli>若间隔时间过短，部分点赞可能会无效，即不加亲密度。请自行调整到一个合适的间隔时间。</mli></mul>",
          WatchLiveInterval: "每两次心跳的间隔时间。<mul><mli>脚本会依次给每个粉丝勋章对应的直播间发心跳包，然后重复数次直到观看时间达标为止。</mli><mli>若间隔时间过短可能会出错。</mli></mul>",
          DailyTasksBtnArea: "缓存中存放的是各个任务上次运行的时间，脚本通过缓存来判断某些周期性执行的任务需不需要执行（比如每天一次的分享视频任务）。<mul><mli>重置缓存并刷新页面可以让脚本再次执行今天已经执行过的任务。</mli></mul>",
          add_like_button: "在直播画面上方，分享按钮左侧添加一个点赞按钮。<mul><mli>该按钮被按下后只会触发一次点赞事件（可用来完成点赞任务），不会发送点赞弹幕。如果想发送点赞弹幕请使用B站的原生功能。</mli></mul>",
          WatchLiveTime: `观看直播时长。单位分钟，必须填写整数。<mul><mli>每观看五分钟可获得100亲密度。如果完成了点赞和发弹幕任务，观看65分钟即可挂满亲密度。请根据自身情况调整观看时间。</mli><mli>具体规则请查阅B站官方公告${linkMsg('https://link.bilibili.com/p/eden/news#/newsdetail?id=2886')}。</mli></mul>`
        };
        const openMainWindow = () => {
          let settingTableoffset = $('.live-player-mounter').offset(),
            settingTableHeight = $('.live-player-mounter').height();
          mainIndex = myopen({
            type: 1,
            title: false,
            offset: [String(settingTableoffset.top - getScrollPosition().y) + 'px', String(settingTableoffset.left - getScrollPosition().x) + 'px'],
            closeBtn: 0,
            shade: 0,
            zIndex: 1000,
            fixed: false,
            area: [, String(settingTableHeight) + 'px'], // 宽高
            resize: false,
            content: html,
            success: () => {
              // layer窗口中的总div
              let myDiv = $('#allsettings');
              // 整个layer窗口
              layerUiMain = myDiv.parent().parent();
              // 显示输入框的值
              myDiv.find('div[data-toggle="WatchLiveTime"] .num').val(MY_API.CONFIG.WatchLiveTime);
              myDiv.find('div[data-toggle="WatchLiveInterval"] .num').val(MY_API.CONFIG.WatchLiveInterval);
              myDiv.find('div[data-toggle="LIKE_LIVEROOM_INTERVAL"] .num').val(MY_API.CONFIG.LIKE_LIVEROOM_INTERVAL);
              myDiv.find('div[data-toggle="AUTO_CHECK_DANMU_TIMEOUT"] .num').val(MY_API.CONFIG.AUTO_CHECK_DANMU_TIMEOUT);
              myDiv.find('div[data-toggle="DANMU_MODIFY_SIZE"] .str').val(MY_API.CONFIG.DANMU_MODIFY_SIZE.toString());
              myDiv.find('div[data-toggle="DANMU_MODIFY_COLOR"] .str').val(MY_API.CONFIG.DANMU_MODIFY_COLOR.toString());
              myDiv.find('div[data-toggle="DANMU_MODIFY_POOL"] .str').val(MY_API.CONFIG.DANMU_MODIFY_POOL.toString());
              myDiv.find('div[data-toggle="DANMU_MODIFY_REGEX"] .str').val(MY_API.CONFIG.DANMU_MODIFY_REGEX.toString());
              myDiv.find('div[data-toggle="DANMU_MODIFY_UID"] .str').val(MY_API.CONFIG.DANMU_MODIFY_UID.toString());
              myDiv.find('div[data-toggle="GIFT_ALLOW_TYPE"] .str').val(MY_API.CONFIG.GIFT_ALLOW_TYPE.toString());
              myDiv.find('div[data-toggle="COIN2SILVER"] .coin_number').val(parseInt(MY_API.CONFIG.COIN2SILVER_NUM).toString());
              myDiv.find('div[data-toggle="MEDAL_DANMU_INTERVAL"] .num').val(parseFloat(MY_API.CONFIG.MEDAL_DANMU_INTERVAL).toString());
              myDiv.find('div[data-toggle="AUTO_DANMU_SETTINGS"] .Time').val(MY_API.CONFIG.DANMU_INTERVAL_TIME.toString());
              myDiv.find('div[data-toggle="AUTO_DANMU_SETTINGS"] .Roomid').val(MY_API.CONFIG.DANMU_ROOMID.toString());
              myDiv.find('div[data-toggle="AUTO_DANMU_SETTINGS"] .Danmu').val(MY_API.CONFIG.DANMU_CONTENT.toString());
              myDiv.find('div[data-toggle="GIFT_INTERVAL"] .num').val(parseInt(MY_API.CONFIG.GIFT_INTERVAL).toString());
              myDiv.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val(MY_API.CONFIG.SPARE_GIFT_ROOM.toString());
              myDiv.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val(parseInt(MY_API.CONFIG.TIME_RELOAD_MINUTE).toString());
              myDiv.find('div[data-toggle="COIN"] .coin_number').val(parseInt(MY_API.CONFIG.COIN_NUMBER).toString());
              myDiv.find('div[data-toggle="COIN_UID"] .num').val(MY_API.CONFIG.COIN_UID.toString());
              myDiv.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val((MY_API.CONFIG.AUTO_GIFT_ROOMID).toString());
              myDiv.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val(MY_API.CONFIG.GIFT_SEND_HOUR.toString());
              myDiv.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val(MY_API.CONFIG.GIFT_SEND_MINUTE.toString());
              myDiv.find('div[data-toggle="GIFT_LIMIT"] .num').val(parseInt(MY_API.CONFIG.GIFT_LIMIT).toString());
              myDiv.find('div[data-toggle="BUY_MEDAL"] .num').val(Live_info.room_id);
              // 监听导入文件按钮
              const inputConfig = $("#BLTH_config_file");
              inputConfig.on("change", importConfig);
              // 禁止选中
              myDiv[0].onselectstart = function () {
                return false;
              }
              // 输入后自动保存
              myDiv.find('.blth_input').bind('input', debounce(() => saveAction(myDiv), 1000));
              myDiv.find('button[data-action="exportConfig"]').click(() => {
                // 导出配置按钮
                exportConfig(MY_API.CONFIG, SP_CONFIG)
                mymsg('配置已导出', {
                  time: 2500,
                });
              });
              myDiv.find('button[data-action="importConfig"]').click(() => {
                // 导入配置按钮
                readConfigArray[1] = $.Deferred();
                inputConfig.click();
                readConfigArray[1].then(() => {
                  let json = readConfigArray[0];
                  MYDEBUG('readConfigArray 文件读取结果：', readConfigArray[0]);
                  MY_API.CONFIG = json.MY_API_CONFIG;
                  MY_API.saveConfig(false);
                  SP_CONFIG = json.SP_CONFIG;
                  saveSpConfig();
                  mymsg('配置导入成功，3秒后将自动刷新页面', {
                    time: 3000,
                    icon: 1
                  });
                  setTimeout(() => {
                    W.location.reload()
                  }, 3000);
                })
              });
              myDiv.find('div[data-toggle="BUY_MEDAL"] [data-action="buy_medal"]').click(function () {
                // 购买勋章
                const room_id = parseInt(myDiv.find('div[data-toggle="BUY_MEDAL"] .num').val());
                MY_API.buyFanMedal(room_id);
              });

              myDiv.find('button[data-action="reset"]').click(() => {
                // 重置按钮
                const index = myconfirm(`<div style = "text-align:center">是否重置所有设置及缓存为默认？</div>`, {
                  title: '重置所有为默认',
                  btn: ['是', '否']
                }, function () {
                  layer.close(index);
                  MY_API.setDefaults();
                }, function () {
                  mymsg('已取消', { time: 2000 });
                })
              });
              myDiv.find('button[data-action="resetCache"]').click(() => {
                // 重置缓存 CACHE
                const index = myconfirm(`<div style = "text-align:center">是否重置缓存为默认？</div>`, {
                  title: '重置缓存',
                  btn: ['是', '否']
                }, function () {
                  layer.close(index);
                  MY_API.resetCache();
                }, function () {
                  mymsg('已取消', { time: 2000 });
                })
              });
              myDiv.find('button[data-action="resetMainSiteTasksCache"]').click(() => {
                // 重置主站任务缓存
                const index = myconfirm(`<div style = "text-align:center">是否重置主站每日任务缓存为默认？</div>`, {
                  title: '重置缓存',
                  btn: ['是', '否']
                }, function () {
                  layer.close(index);
                  MY_API.resetMainSiteTasksCache();
                }, function () {
                  mymsg('已取消', { time: 2000 });
                })
              });
              myDiv.find('button[data-action="resetLiveTasksCache"]').click(() => {
                // 重置直播区任务缓存
                const index = myconfirm(`<div style = "text-align:center">是否重置直播区任务缓存为默认？</div>`, {
                  title: '重置缓存',
                  btn: ['是', '否']
                }, function () {
                  layer.close(index);
                  MY_API.resetLiveTasksCache();
                }, function () {
                  mymsg('已取消', { time: 2000 });
                })
              });
              myDiv.find('button[data-action="resetOtherTasksCache"]').click(() => {
                // 重置主站任务缓存
                const index = myconfirm(`<div style = "text-align:center">是否重置其它任务缓存为默认？</div>`, {
                  title: '重置缓存',
                  btn: ['是', '否']
                }, function () {
                  layer.close(index);
                  MY_API.resetOtherTasksCache();
                }, function () {
                  mymsg('已取消', { time: 2000 });
                })
              });
              myDiv.find('button[data-action="about"]').click(() => {
                // 关于
                layerOpenAbout();
              });
              myDiv.find('button[data-action="edit_liveTasksRoomList"]').click(() => {
                // 编辑直播区任务房间列表
                myprompt({
                  formType: 2,
                  value: String(MY_API.CONFIG.LIVE_TASKS_ROOM),
                  maxlength: Number.MAX_SAFE_INTEGER,
                  title: '请输入直播区任务房间列表',
                  btn: ['保存', '取消']
                },
                  function (value, index) {
                    let valArray = value.split(",");
                    valArray = [...new Set(valArray)];
                    for (let i = 0; i < valArray.length; i++) {
                      if (!valArray[i]) valArray.splice(i, 1);
                    };
                    MY_API.CONFIG.LIVE_TASKS_ROOM = [...valArray];
                    MY_API.saveConfig(false);
                    mymsg('直播区任务房间列表保存成功', {
                      time: 2500,
                      icon: 1
                    });
                    layer.close(index);
                  });
              });
              myDiv.find('button[data-action="edit_GIFT_SEND_ROOM"]').click(() => {
                // 编辑自动送礼黑白名单策略
                myprompt({
                  formType: 2,
                  value: String(MY_API.CONFIG.GIFT_SEND_ROOM),
                  maxlength: Number.MAX_SAFE_INTEGER,
                  title: '请输入自动送礼房间列表',
                  btn: ['保存', '取消']
                },
                  function (value, index) {
                    let valArray = value.split(",");
                    valArray = [...new Set(valArray)];
                    for (let i = 0; i < valArray.length; i++) {
                      if (!valArray[i]) valArray.splice(i, 1);
                    };
                    MY_API.CONFIG.GIFT_SEND_ROOM = [...valArray];
                    MY_API.saveConfig(false);
                    mymsg('自动送礼房间列表保存成功', {
                      time: 2500,
                      icon: 1
                    });
                    layer.close(index);
                  });
              });
              myDiv.find('button[data-action="edit_medalDanmu"]').click(() => {
                // 编辑打卡弹幕内容
                myprompt({
                  formType: 2,
                  value: String(MY_API.CONFIG.MEDAL_DANMU_CONTENT),
                  maxlength: Number.MAX_SAFE_INTEGER,
                  title: '请输入粉丝勋章打卡弹幕',
                  btn: ['保存', '取消']
                },
                  function (value, index) {
                    let valArray = value.split(",");
                    for (let i = 0; i < valArray.length; i++) {
                      if (!valArray[i]) valArray.splice(i, 1);
                    };
                    MY_API.CONFIG.MEDAL_DANMU_CONTENT = [...valArray];
                    MY_API.saveConfig(false);
                    mymsg('粉丝勋章打卡弹幕保存成功', {
                      time: 2500,
                      icon: 1
                    });
                    layer.close(index);
                  });
              });
              myDiv.find('button[data-action="sendGiftNow"]').click(() => {
                // 立刻开始送礼
                if (!MY_API.CONFIG.AUTO_GIFT) {
                  window.toast('[ 立刻开始送礼 ] 请先勾选【自动送礼】再点击此按钮', 'info');
                  return
                }
                SEND_GIFT_NOW = true;
                MY_API.Gift.run();
              });
              myDiv.find('button[data-action="sendDanmuNow"]').click(() => {
                // 立刻发送弹幕
                if (!MY_API.CONFIG.AUTO_DANMU) {
                  window.toast('[ 立刻发送弹幕 ] 请先勾选【自动发弹幕】再点击此按钮', 'info');
                  return
                }
                SEND_DANMU_NOW = true;
                MY_API.AUTO_DANMU.run();
              });
              myDiv.find('button[data-action="clearDanmuCache"]').click(() => {
                // 清除弹幕缓存
                MY_API.CACHE.AUTO_SEND_DANMU_TS = [];
                if (MY_API.saveCache()) MY_API.chatLog('清除弹幕缓存成功', 'success');
              });
              // 绑定所有checkbox事件
              for (const i of checkList) {
                const input = myDiv.find(`div[data-toggle="${i}"] input:checkbox`);
                if (MY_API.CONFIG[i]) input.prop('checked', true);
                input.change(function () {
                  MY_API.CONFIG[i] = $(this).prop('checked');
                  input.each(function () { this.checked = MY_API.CONFIG[i] });
                  MY_API.saveConfig();
                });
              };
              // 绑定特殊设置（不在MY_API.CONFIG中）
              const specialSetting = [
                {
                  jqPath1: `div[data-toggle="INVISIBLE_ENTER"] input:checkbox`,
                  gmItem: `invisibleEnter`,
                  toastMsg: ["[隐身入场] 配置已保存", "info"],
                },
                {
                  jqPath1: `div[data-toggle="NOSLEEP"] input:checkbox`,
                  gmItem: `nosleep`,
                  toastMsg: ["[屏蔽挂机检测] 配置已保存", "info"],
                },
                {
                  jqPath1: `div[data-toggle="banP2p"] input:checkbox`,
                  gmItem: `banP2p`,
                  toastMsg: ["[禁止p2p上传] 配置已保存", "info"],
                },
                {
                  jqPath1: `div[data-toggle="debugSwitch"] input:checkbox`,
                  gmItem: `debugSwitch`,
                  toastMsg: ["[控制台日志] 配置已保存", "info"],
                  changeFn: function (self) { SP_CONFIG.debugSwitch = $(self).prop('checked'); }
                },
                {
                  jqPath1: `div[data-toggle="windowToast"] input:checkbox`,
                  gmItem: `windowToast`,
                  // toastMsg: ["[提示信息] 配置已保存", "info"],
                  changeFn: function (self) {
                    SP_CONFIG.windowToast = $(self).prop('checked');
                    if (SP_CONFIG.windowToast) $('.link-toast').show();
                    else $('.link-toast').hide();
                  }
                },
                {
                  jqPath1: `div[data-toggle="DANMU_MODIFY"] input:checkbox`,
                  gmItem: `DANMU_MODIFY`,
                  toastMsg: ["[弹幕修改] 配置已保存", "info"]
                },
                {
                  jqPath1: `div[data-toggle="blockLiveStream"] input:checkbox`,
                  gmItem: `blockLiveStream`,
                  toastMsg: ["[拦截直播流] 配置已保存", "info"]
                }, {
                  jqPath1: `div[data-toggle="blockliveDataUpdate"] input:checkbox`,
                  gmItem: `blockliveDataUpdate`,
                  toastMsg: ["[拦截直播观看数据上报] 配置已保存", "info"]
                }, {
                  jqPath1: `div[data-toggle="WEAR_MEDAL_BEFORE_DANMU"] input:checkbox`,
                  gmItem: `wear_medal_before_danmu`,
                  toastMsg: ["[自动佩戴勋章] 配置已保存", "info"]
                }, {
                  jqPath1: `div[data-toggle="ONLY_FIRST"] input:radio`,
                  jqPath2: `div[data-toggle="ALWAYS"] input:radio`,
                  changeFn: function (self, gmItem) {
                    if ($(self).is(':checked')) SP_CONFIG[gmItem] = $(self).parent().attr("data-toggle");
                  },
                  name: 'WEAR_MEDAL_BEFORE_DANMU',
                  gmItem: `wear_medal_type`,
                  toastMsg: ["[自动佩戴勋章] 配置已保存", "info"]
                }, {
                  jqPath1: `div[data-toggle="AUTO_CHECK_DANMU"] input:checkbox`,
                  gmItem: `AUTO_CHECK_DANMU`,
                  toastMsg: ["[检测弹幕是否发送成功] 配置已保存", "info"]
                }, {
                  jqPath1: `div[data-toggle="add_like_button"] input:checkbox`,
                  gmItem: `add_like_button`,
                  toastMsg: ["[添加点赞按钮] 配置已保存", "info"]
                }
              ];
              for (const i of specialSetting) {
                let input, isradio = i.hasOwnProperty('name') ? true : false;
                for (let count = 1; true; count++) {
                  const jqPathNum = "jqPath" + String(count);
                  if (!i.hasOwnProperty(jqPathNum)) break;
                  input = myDiv.find(i[jqPathNum]);
                  const setting = SP_CONFIG[i.gmItem];
                  if (!isradio) {
                    if (setting) input.attr('checked', '');
                  } else {
                    if (setting === i[jqPathNum].match(/data\-toggle="(.*)"/)[1]) {
                      $(i[jqPathNum]).attr('checked', '');
                      break;
                    }
                  }
                }
                if (isradio) input = $(`input:radio[name= ${i.name} ]`);
                input.change(function () {
                  let self = this;
                  if (i.hasOwnProperty('changeFn')) isradio ? i.changeFn(self, i.gmItem) : i.changeFn(self);
                  if (!isradio) SP_CONFIG[i.gmItem] = $(self).prop('checked');
                  saveSpConfig();
                  if (i.hasOwnProperty('toastMsg')) window.toast(i.toastMsg[0], i.toastMsg[1]);
                })
              }
              // 绑定多选框事件
              for (const i of radioList) {
                for (let count = 1; true; count++) {
                  const toggleName = "toggle" + String(count);
                  if (!i.hasOwnProperty(toggleName)) break;
                  if (MY_API.CONFIG[i.name] === i[toggleName]) {
                    $(`div[data-toggle= ${i[toggleName]}] input:radio`).attr('checked', '');
                    break;
                  }
                }
                $(`input:radio[name= ${i.name} ]`).change(function () {
                  for (let count = 1; true; count++) {
                    const toggleName = "toggle" + String(count);
                    if (!i.hasOwnProperty(toggleName)) break;
                    if ($(`div[data-toggle= ${i[toggleName]} ] input:radio`).is(':checked')) {
                      MY_API.CONFIG[i.name] = i[toggleName];
                      MY_API.saveConfig();
                      break;
                    }
                  }
                })
              }
              // 绑定帮助文字 (?)
              $('.helpText').click(function () {
                const id = $(this).attr('helpdata');
                if (id !== undefined) {
                  if (helpText.hasOwnProperty(id)) {
                    myopen({
                      title: `帮助信息 ${id}`,
                      anim: 5,
                      area: [String($(window).width() * 0.382) + 'px', String($(window).height() * 0.618) + 'px'],
                      content: helpText[id]
                    });
                  }
                }
              });
              // 允许按钮点击
              hideBtnClickable = true;
            },
            end: () => {
              // 理论上此处代码不会运行，因为窗口保持常开不关闭
              SP_CONFIG.mainDisplay = 'hide';
              saveSpConfig();
              document.getElementById('hiderbtn').innerHTML = "显示控制面板";
            }
          });
        };
        // 打开窗口
        openMainWindow();
        let JQshow = false;
        if (SP_CONFIG.mainDisplay === 'hide') {
          layerUiMain.hide();
          JQshow = true;
        }
        if (SP_CONFIG.darkMode) {
          layer.style(mainIndex, {
            'background-color': '#1c1c1c',
            'color': '#a2a7ae'
          });
        } else {
          layer.style(mainIndex, {
            'background-color': 'white',
            'color': 'black'
          });
        }
        // 添加隐藏/显示窗口按钮
        let followCntr = $('.follow-ctnr');
        followCntr[0].insertBefore(btn[0], followCntr.children()[0])
        // 监听隐藏/显示窗口按钮
        function btnClickFunc() {
          if (hideBtnClickable) {
            hideBtnClickable = false;
            setTimeout(function () { hideBtnClickable = true }, 310);
            if (SP_CONFIG.mainDisplay === 'show') { // 显示 -> 隐藏
              SP_CONFIG.mainDisplay = 'hide';
              saveSpConfig(false);
              animChange(layerUiMain, true);
              document.getElementById('hiderbtn').innerHTML = "显示控制面板";
              setTimeout(() => layer.style(mainIndex, { "zIndex": 0 }), 300);
            }
            else { // 隐藏 -> 显示
              SP_CONFIG.mainDisplay = 'show';
              layer.style(mainIndex, { "zIndex": 1000 })
              saveSpConfig(false);
              if (JQshow) {
                layerUiMain.show();
                JQshow = false;
              }
              else animChange(layerUiMain, false)
              document.getElementById('hiderbtn').innerHTML = "隐藏控制面板";
            }
          }
        }
        btn.click(btnClickFunc);
        // 绑定快捷键
        hotkeys('alt+b', btnClickFunc);
        // 监听播放器全屏变化
        function bodyPropertyChange() {
          let attr = body.attr('class'), tabOffSet = tabContent.offset(), top = tabOffSet.top, left = tabOffSet.left;
          if (/[player\-full\-win]|[fullscreen\-fix]/.test(attr)) {
            if (SP_CONFIG.mainDisplay === 'show') { // 显示 -> 隐藏
              SP_CONFIG.mainDisplay = 'hide';
              saveSpConfig(false);
              animChange(layerUiMain, true);
              document.getElementById('hiderbtn').innerHTML = "显示控制面板";
              setTimeout(() => layer.style(mainIndex, { "zIndex": 0 }), 300);
            }
          }
          layer.style(logIndex, {
            'top': String(top) + 'px',
            'left': String(left) + 'px'
          });
        }
        let bodyMutationObserver = new MutationObserver(bodyPropertyChange);
        bodyMutationObserver.observe(body[0], { attributes: true });
        // 监听页面html节点属性变化
        function webHtmlPropertyChange() {
          let attr = webHtml.attr('lab-style');
          if (attr === 'dark') {
            SP_CONFIG.darkMode = true;
            layer.style(logIndex, {
              'background-color': '#1c1c1c'
            });
            layer.style(mainIndex, {
              'background-color': '#1c1c1c',
              'color': '#a2a7ae'
            });
          } else {
            SP_CONFIG.darkMode = false;
            layer.style(logIndex, {
              'background-color': '#f2f3f5'
            });
            layer.style(mainIndex, {
              'background-color': 'white',
              'color': 'black'
            });
          }
        }
        let webHtmlMutationObserver = new MutationObserver(webHtmlPropertyChange);
        webHtmlMutationObserver.observe(webHtml[0], { attributes: true });
        // 初次运行时tips
        if (!MY_API.CACHE.MainSite_login_TS) {
          mytips('点我隐藏/显示控制面板', '#hiderbtn', {
            tips: 1
          });
          setTimeout(() => mytips('点我查看日志', '#logDivText'), 5e3);
        }
      },
      chatLog: function (text, _type = 'info') { // 自定义提示
        let div = $("<div class='chatLogDiv'>"),
          msg = $("<div class='chatLogMsg'>"),
          myDate = new Date();
        msg.html(text);
        div.text(myDate.toLocaleString());
        div.append(msg);
        switch (_type) {
          case 'warning':
            div.addClass('chatLogWarning')
            break;
          case 'success':
            div.addClass('chatLogSuccess')
            break;
          case 'error':
            div.addClass('chatLogError')
            break;
          case 'prize':
            div.addClass('chatLogWinPrize')
            break;
          default:
            div.addClass('chatLogDefault')
        };
        JQmenuWindow.append(div);
        if (layerLogWindow_ScrollY >= layerLogWindow_ScrollHeight)
          layerLogWindow.scrollTop(layerLogWindow.prop("scrollHeight"));
      },
      GroupSign: {
        fullLevalMedalUidList: [],
        getGroups: () => {
          //获取应援团列表
          return BAPI.Group.my_groups().then((response) => {
            MYDEBUG('GroupSign.getGroups: API.Group.my_groups', response);
            if (response.code === 0) return $.Deferred().resolve(response.data.list);
            else {
              window.toast(`[自动应援团签到]获取应援团列表失败 ${response.msg}`, 'error');
              return delayCall(() => MY_API.GroupSign.getGroups());
            }
          });
        },
        signInList: (list, i = 0) => {
          // 应援团签到
          if (i >= list.length) return $.Deferred().resolve();
          const obj = list[i];
          // 自己不能给自己的应援团应援，不给20或40级粉丝牌的应援团签到
          if (obj.owner_uid == Live_info.uid || MY_API.GroupSign.fullLevalMedalUidList == Live_info.uid) return MY_API.GroupSign.signInList(list, i + 1);
          return BAPI.Group.sign_in(obj.group_id, obj.owner_uid).then((response) => {
            MYDEBUG('GroupSign.signInList: API.Group.sign_in', response);
            let p = $.Deferred();
            if (response.code === 0) {
              if (response.data.add_num > 0) { // || response.data.status === 1
                MYDEBUG(`[自动应援团签到] 应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到成功，当前勋章亲密度+${response.data.add_num}`);
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
              window.toast(`[自动应援团签到] 应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到失败 ${response.msg}`, 'caution');
              p.reject();
              return delayCall(() => MY_API.GroupSign.signInList(list, i));
            }
            return $.when(MY_API.GroupSign.signInList(list, i + 1), p);
          });
        },
        run: () => {
          // 执行应援团任务
          try {
            if (!MY_API.CONFIG.AUTO_GROUP_SIGN || otherScriptsRunning) return $.Deferred().resolve();
            if (!checkNewDay(MY_API.CACHE.AUTO_GROUP_SIGH_TS)) {
              runTomorrow(() => MY_API.GroupSign.run(), 8, 1, '应援团签到');
              return $.Deferred().resolve();
            } else if (getCHSdate().getHours() < 8 && MY_API.CACHE.AUTO_GROUP_SIGH_TS !== 0) {
              runToday(() => MY_API.GroupSign.run(), 8, 1, '应援团签到');
              return $.Deferred().resolve();
            }
            window.toast(`[应援团签到] 开始签到`, 'info');
            return MY_API.GroupSign.getGroups().then((list) => {
              for (const i of medal_info.medal_list) {
                if (i.medal_level === 20 || i.medal_level === 40)
                  MY_API.GroupSign.fullLevalMedalUidList.push(i.target_id)
              }
              return MY_API.GroupSign.signInList(list).then(() => {
                window.toast(`[应援团签到] 今日签到已完成`, 'success');
                MY_API.CACHE.AUTO_GROUP_SIGH_TS = ts_ms();
                MY_API.saveCache();
                runTomorrow(() => MY_API.GroupSign.run(), 8, 1, '应援团签到');
                return $.Deferred().resolve();
              });

            });
          } catch (err) {
            window.toast('[自动应援团签到]运行时出现异常，已停止', 'error');
            MYERROR(`自动应援团签到出错`, err);
            return $.Deferred().reject();
          }
        }
      },
      DailyReward: {
        // 每日任务
        coin_exp: 0,
        login: () => {
          if (!MY_API.CONFIG.LOGIN) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.MainSite_login_TS)) {
            runMidnight(() => MY_API.DailyReward.login(), '主站任务 - 登录');
            return $.Deferred().resolve();
          }
          return BAPI.DailyReward.login().then((response) => {
            MYDEBUG('DailyReward.login: API.DailyReward.login');
            if (response.code === 0) {
              window.toast('[自动每日奖励][每日登录]完成', 'success');
              MY_API.CACHE.MainSite_login_TS = ts_ms();
              MY_API.saveCache();
              runMidnight(() => MY_API.DailyReward.login(), '主站任务 - 登录');
            }
            else {
              window.toast(`[自动每日奖励][每日登录]失败 ${response.message}`, 'error');
              return delayCall(() => MY_API.DailyReward.login());
            }
          });
        },
        watch: (aid, cid) => {
          if (!MY_API.CONFIG.WATCH) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.MainSite_watch_TS)) {
            return $.Deferred().resolve();
          }
          return BAPI.DailyReward.watch(aid, cid, Live_info.uid, ts_s()).then((response) => {
            MYDEBUG('DailyReward.watch: API.DailyReward.watch', response);
            if (response.code === 0) {
              window.toast(`[自动每日奖励][每日观看]完成(av=${aid})`, 'success');
              MY_API.CACHE.MainSite_watch_TS = ts_ms();
              MY_API.saveCache();
            } else {
              window.toast(`[自动每日奖励][每日观看]失败 aid=${aid}, cid=${cid} ${response.msg}`, 'error');
              return delayCall(() => MY_API.DailyReward.watch(aid, cid));
            }
          });
        },
        coin: (cards, n, i = 0, one = false) => {
          if (!MY_API.CONFIG.COIN) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.MainSite_coin_TS)) {
            return $.Deferred().resolve();
          }
          if (MY_API.DailyReward.coin_exp >= MY_API.CONFIG.COIN_NUMBER * 10) {
            window.toast('[自动每日奖励][每日投币]今日投币已完成', 'info');
            MY_API.CACHE.MainSite_coin_TS = ts_ms();
            MY_API.saveCache();
            return $.Deferred().resolve();
          }
          if (i >= cards.length) {
            window.toast('[自动每日奖励][每日投币]动态里可投币的视频不足', 'caution');
            return $.Deferred().resolve();
          }
          const obj = JSON.parse(cards[i].card);
          let num = Math.min(2, n);
          if (one) num = 1;
          return BAPI.x.getCoinInfo('', 'jsonp', obj.aid, ts_ms()).then(async (re) => {
            if (re.code === 0) {
              await sleep(500);
              if (re.data.multiply === 2) {
                MYDEBUG('API.x.getCoinInfo', `已投币两个 aid = ${obj.aid}`)
                return MY_API.DailyReward.coin(vlist, n, i + 1);
              }
              else {
                if (re.data.multiply === 1) num = 1;
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
                  window.toast(`[自动每日奖励][每日投币]出错 ${response.msg}`, 'error');
                  return delayCall(() => MY_API.DailyReward.coin(cards, n, i))
                });
              }
            } else {
              window.toast(`[自动每日奖励][每日投币]获取视频(aid=${obj.aid})投币状态出错 ${response.msg}`, 'error');
              return delayCall(() => MY_API.DailyReward.coin(cards, n, i))
            }
          })
        },
        coin_uid: (vlist, n, pagenum, uidIndex, i = 0, one = false) => {
          if (!MY_API.CONFIG.COIN) return $.Deferred().resolve();
          if (MY_API.DailyReward.coin_exp >= MY_API.CONFIG.COIN_NUMBER * 10) {
            window.toast('[自动每日奖励][每日投币]今日投币已完成', 'info');
            MY_API.CACHE.MainSite_coin_TS = ts_ms();
            MY_API.saveCache();
            return $.Deferred().resolve();
          }
          if (i >= vlist.length) {
            return MY_API.DailyReward.UserSpace(uidIndex, 30, 0, pagenum + 1, '', 'pubdate', 'jsonp');
          }
          const obj = vlist[i], uid = MY_API.CONFIG.COIN_UID[uidIndex];
          if (obj.hasOwnProperty('is_union_video') && obj.is_union_video === 1 && obj.mid != uid) {
            MYDEBUG('DailyReward.coin_uid', `联合投稿且UP不是指定UID用户 aid = ${obj.aid}`)
            return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uidIndex, i + 1);
          }
          let num = Math.min(2, n);
          if (one) num = 1;
          return BAPI.x.getCoinInfo('', 'jsonp', obj.aid, ts_ms()).then(async (re) => {
            if (re.code === 0) {
              await sleep(500);
              if (re.data.multiply === 2) {
                MYDEBUG('API.x.getCoinInfo', `已投币两个 aid = ${obj.aid}`)
                return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uidIndex, i + 1);
              }
              else {
                if (re.data.multiply === 1) num = 1;
                return BAPI.DailyReward.coin(obj.aid, num).then((response) => {
                  MYDEBUG('DailyReward.coin_uid: API.DailyReward.coin_uid', response);
                  if (response.code === 0) {
                    MY_API.DailyReward.coin_exp += num * 10;
                    window.toast(`[自动每日奖励][每日投币]投币成功(av=${obj.aid},num=${num})`, 'success');
                    return MY_API.DailyReward.coin_uid(vlist, n - num, pagenum, uidIndex, i + 1);
                  } else if (response.code === -110) {
                    window.toast('[自动每日奖励][每日投币]未绑定手机，已停止', 'error');
                    return $.Deferred().reject();
                  } else if (response.code === 34003) {
                    // 非法的投币数量
                    if (one) return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uidIndex, i + 1);
                    return MY_API.DailyReward.coin_uid(vlist, n, i, pagenum, uidIndex, true);
                  } else if (response.code === 34005) {
                    // 塞满啦！先看看库存吧~
                    return MY_API.DailyReward.coin_uid(vlist, n, pagenum, uidIndex, i + 1);
                  } else if (response.code === -104) {
                    // 硬币余额不足
                    window.toast('[自动每日奖励][每日投币]剩余硬币不足，已停止', 'warning');
                    return $.Deferred().reject();
                  }
                  window.toast(`[自动每日奖励][每日投币] 出错 ${response.msg}`, 'caution');
                  return delayCall(() => MY_API.DailyReward.coin_uid(vlist, n, pagenum, uidIndex, i))
                });
              }
            } else {
              window.toast(`[自动每日奖励][每日投币]获取视频(aid=${obj.aid})投币状态出错 ${response.msg}`, 'error');
              return delayCall(() => MY_API.DailyReward.coin(cards, n, i))
            }
          });
        },
        share: (aid) => {
          if (!MY_API.CONFIG.SHARE) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.MainSite_share_TS)) {
            return $.Deferred().resolve();
          }
          return BAPI.DailyReward.share(aid).then((response) => {
            MYDEBUG('DailyReward.share: API.DailyReward.share', response);
            if (response.code === 0) {
              window.toast(`[自动每日奖励][每日分享]分享成功(av=${aid})`, 'success');
            } else if (response.code === 71000) {
              // 重复分享
              window.toast('[自动每日奖励][每日分享]今日分享已完成', 'info');
            } else {
              window.toast(`[自动每日奖励][每日分享] 出错 ${response.msg}`, 'caution');
              return delayCall(() => MY_API.DailyReward.share(aid));
            }
            MY_API.CACHE.MainSite_share_TS = ts_ms();
            MY_API.saveCache();
          });
        },
        dynamic: async () => {
          if (!MY_API.CONFIG.COIN && !MY_API.CONFIG.WATCH && !MY_API.CONFIG.SHARE)
            return $.Deferred().resolve();
          if ((!MY_API.CONFIG.WATCH || (MY_API.CONFIG.WATCH && !checkNewDay(MY_API.CACHE.MainSite_watch_TS))) && (!MY_API.CONFIG.SHARE || (MY_API.CONFIG.SHARE && !checkNewDay(MY_API.CACHE.MainSite_share_TS))) && (!MY_API.CONFIG.COIN || (MY_API.CONFIG.COIN && !checkNewDay(MY_API.CACHE.MainSite_coin_TS))))
            return runMidnight(() => MY_API.DailyReward.dynamic(), `主站任务 - ${MY_API.CONFIG.WATCH ? '观看视频' : ''} ${MY_API.CONFIG.SHARE ? '分享视频' : ''} ${MY_API.CONFIG.COIN ? '投币' : ''}`);
          MY_API.DailyReward.coin_exp = await BAPI.DailyReward.exp().then((response) => {
            MYDEBUG('DailyReward.run: API.DailyReward.exp', response);
            if (response.code === 0) {
              return response.number;
            } else {
              window.toast(`[自动每日奖励] 获取今日已获得的投币经验出错 ${response.message}`, 'caution');
              return delayCall(() => MY_API.DailyReward.run());
            }
          });
          const coinNum = MY_API.CONFIG.COIN_NUMBER - MY_API.DailyReward.coin_exp / 10;
          const throwCoinNum = await BAPI.getuserinfo().then((re) => {
            MYDEBUG('DailyReward.dynamic: API.getuserinfo', re);
            if (re.code === "REPONSE_OK") {
              if (re.data.biliCoin < coinNum) return re.data.biliCoin
              else return coinNum
            } else {
              window.toast(`[自动每日奖励][每日投币] 获取用户信息失败 ${response.message}`, 'error');
            }
          });
          if (throwCoinNum < coinNum) window.toast(`[自动每日奖励][每日投币]剩余硬币不足，仅能投${throwCoinNum}个币`, 'warning');
          return BAPI.dynamic_svr.dynamic_new(Live_info.uid, 8).then((response) => {
            MYDEBUG('DailyReward.dynamic: API.dynamic_svr.dynamic_new', response);
            if (response.code === 0) {
              if (response.data.cards) {
                const obj = JSON.parse(response.data.cards[0].card);
                const p1 = MY_API.DailyReward.watch(obj.aid, obj.cid);
                let p2;
                if (MY_API.CONFIG.COIN_UID == 0 || MY_API.CONFIG.COIN_TYPE == 'COIN_DYN') {
                  p2 = MY_API.DailyReward.coin(response.data.cards, Math.max(throwCoinNum, 0));
                } else {
                  p2 = MY_API.DailyReward.UserSpace(0, 30, 0, 1, '', 'pubdate', 'jsonp');
                }
                const p3 = MY_API.DailyReward.share(obj.aid);
                return $.when(p1, p2, p3).then(() => runMidnight(() => MY_API.DailyReward.dynamic(), `主站任务 - ${MY_API.CONFIG.WATCH ? '观看视频' : ''} ${MY_API.CONFIG.SHARE ? '分享视频' : ''} ${MY_API.CONFIG.COIN ? '投币' : ''}`));
              } else {
                window.toast('[自动每日奖励]"动态-投稿视频"中暂无动态', 'info');
              }
            } else {
              window.toast(`[自动每日奖励]获取"动态-投稿视频"失败 ${response.msg}`, 'caution');
              return delayCall(() => MY_API.DailyReward.dynamic());
            }
          });
        },
        UserSpace: (uidIndex, ps, tid, pn, keyword, order, jsonp) => {
          if (!checkNewDay(MY_API.CACHE.MainSite_coin_TS)) {
            return $.Deferred().resolve();
          }
          return BAPI.x.getUserSpace(MY_API.CONFIG.COIN_UID[uidIndex], ps, tid, pn, keyword, order, jsonp).then((response) => {
            MYDEBUG('DailyReward.UserSpace: API.dynamic_svr.UserSpace', response);
            if (response.code === 0) {
              if (response.data.list.vlist) {
                const throwCoinNum = MY_API.CONFIG.COIN_NUMBER - MY_API.DailyReward.coin_exp / 10;
                return MY_API.DailyReward.coin_uid(response.data.list.vlist, Math.max(throwCoinNum, 0), pn, uidIndex);
              } else if (uidIndex < MY_API.CONFIG.COIN_UID.length - 1) {
                const throwCoinNum = MY_API.CONFIG.COIN_NUMBER - MY_API.DailyReward.coin_exp / 10;
                return MY_API.DailyReward.coin_uid(response.data.list.vlist, Math.max(throwCoinNum, 0), pn, uidIndex + 1);
              } else {
                window.toast(`[自动每日奖励]"UID = ${String(MY_API.CONFIG.COIN_UID)}的空间-投稿视频"中暂无视频`, 'info');
              }
            }
            else {
              window.toast(`[自动每日奖励]获取UID = ${MY_API.CONFIG.COIN_UID[uidIndex]}的"空间-投稿视频"失败 ${response.msg}`, 'caution');
              return delayCall(() => MY_API.DailyReward.UserSpace(uid, ps, tid, pn, keyword, order, jsonp));
            }
          });
        },
        run: () => {
          if ((!MY_API.CONFIG.LOGIN && !MY_API.CONFIG.COIN && !MY_API.CONFIG.WATCH && !MY_API.CONFIG.SHARE) || otherScriptsRunning) return $.Deferred().resolve();
          MY_API.DailyReward.login();
          MY_API.DailyReward.dynamic();
        }
      },
      LiveReward: {
        dailySignIn: () => {
          if (!MY_API.CONFIG.LIVE_SIGN) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.Live_sign_TS)) return runMidnight(() => MY_API.LiveReward.dailySignIn(), '直播区 - 直播签到');
          return BAPI.xlive.dosign().then((response) => {
            MYDEBUG('LiveReward.dailySignIn: API.xlive.dosign', response);
            if (response.code === 0) {
              window.toast('[自动直播签到]完成', 'success');
              $('.hinter').remove(); // 移除签到按钮和小红点
              $('.checkin-btn').remove();
            } else if (response.code === 1011040) {
              window.toast('[自动直播签到]今日直播签到已完成', 'info')
            } else {
              window.toast(`[自动直播签到]失败 ${response.message}，尝试点击签到按钮`, 'caution');
              $('.checkin-btn').click();
              return delayCall(() => MY_API.LiveReward.dailySignIn());
            }
            MY_API.CACHE.Live_sign_TS = ts_ms();
            MY_API.saveCache();
            runMidnight(() => MY_API.LiveReward.dailySignIn(), '直播区 - 直播签到');
          });
        },
        likeLiveRoom: async (medal_list) => {
          if (!MY_API.CONFIG.LIKE_LIVEROOM) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.Live_like_TS)) return runMidnight(() => MY_API.LiveReward.likeLiveRoom(), '直播区 - 点赞');
          const likeTimes = 1;
          window.toast('[点赞直播间] 开始点赞直播间', 'info');
          for (let i = 0; i < likeTimes; i++) {
            for (const medal of medal_list) {
              await BAPI.xlive.likeInteract(medal.real_roomid).then((response) => {
                MYDEBUG(`API.xlive.likeInteract(${medal.real_roomid}) response`, response);
                if (response.code !== 0) window.toast(`[点赞直播间] 直播间${medal.real_roomid}点赞失败 ${response.message}`, 'caution');
              });
              await sleep(MY_API.CONFIG.LIKE_LIVEROOM_INTERVAL);
            }
          }
          window.toast('[点赞直播间] 今日点赞完成', 'success');
          MY_API.CACHE.Live_like_TS = ts_ms();
          MY_API.saveCache();
          runMidnight(() => MY_API.LiveReward.likeLiveRoom(), '直播区 - 点赞');
        },
        WatchLive: async (medal_list) => {
          if (!MY_API.CONFIG.WatchLive) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.Live_watch_TS)) return runMidnight(() => MY_API.LiveReward.WatchLive(), '直播区 - 观看直播');
          window.toast('[观看直播] 开始模拟观看直播', 'info');
          let pReturn = $.Deferred();
          for (let f = 0; f < medal_list.length; f++) {
            const funsMedalData = medal_list[f];
            let roomHeart = new RoomHeart(funsMedalData.real_roomid, MY_API.CONFIG.WatchLiveTime)
            await roomHeart.start()
            if (f === medal_list.length - 1) roomHeart.doneFunc = () => {
              window.toast('[观看直播] 今日观看任务已完成', 'success');
              pReturn.resolve();
            }
            await sleep(MY_API.CONFIG.WatchLiveInterval);
          }
          await pReturn;
          MY_API.CACHE.Live_watch_TS = ts_ms();
          MY_API.saveCache();
          runMidnight(() => MY_API.LiveReward.WatchLive(), '直播区 - 观看直播');
        },
        run: () => {
          if ((!MY_API.CONFIG.LIVE_SIGN && !MY_API.CONFIG.WatchLive && !MY_API.CONFIG.LIKE_LIVEROOM) || otherScriptsRunning) return $.Deferred().resolve();
          let runTasksMedalList;
          if (medal_info.status.state() === "resolved") {
            if (MY_API.CONFIG.LIVE_TASKS_METHOD === 'LIVE_TASKS_WHITE')
              runTasksMedalList = medal_info.medal_list.filter(r => MY_API.CONFIG.LIVE_TASKS_ROOM.findIndex(m => m == r.roomid) > -1 && r.roomid && r.level < 20);
            else {
              runTasksMedalList = medal_info.medal_list.filter(r => MY_API.CONFIG.LIVE_TASKS_ROOM.findIndex(m => m == r.roomid) === -1 && r.roomid && r.level < 20);
            }
          } else {
            window.toast('[观看直播] [点赞直播间] 粉丝勋章列表未被完全获取，暂停运行', 'error');
            return medal_info.status.then(() => { MY_API.LiveReward.WatchLive(); MY_API.LiveReward.likeLiveRoom(); });
          }
          MY_API.LiveReward.dailySignIn();
          MY_API.LiveReward.WatchLive(runTasksMedalList);
          MY_API.LiveReward.likeLiveRoom(runTasksMedalList);
        }
      },
      Exchange: {
        coin2silver: (num) => {
          return BAPI.xlive.revenue.coin2silver(num).then((response) => {
            MYDEBUG('Exchange.coin2silver: API.Exchange.coin2silver', response);
            if (response.code === 0) {
              window.toast(`[硬币换银瓜子] ${response.message}，获得${response.data.silver}银瓜子`, 'success');
            } else {
              // 其它状态码待补充
              window.toast(`[银瓜子换硬币] 失败 ${response.message}`, 'caution');
              return delayCall(() => MY_API.Exchange.coin2silver(num));
            }
          });
        },
        silver2coin: () => {
          return BAPI.xlive.revenue.silver2coin().then((response) => {
            MYDEBUG('Exchange.silver2coin: API.Exchange.silver2coin', response);
            if (response.code === 0) {
              window.toast(`[银瓜子换硬币] ${response.message}`, 'success'); // 兑换成功
            } else if (response.code === 403) {
              window.toast(`[银瓜子换硬币] ${response.message}`, 'info'); // 每天最多能兑换 1 个 or 银瓜子余额不足
            } else {
              window.toast(`[银瓜子换硬币] 失败 ${response.message}`, 'caution');
              return delayCall(() => MY_API.Exchange.silver2coin());
            }
          });
        },
        runC2S: () => {
          if (!MY_API.CONFIG.COIN2SILVER || otherScriptsRunning) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.Coin2Sliver_TS)) {
            // 同一天，不再兑换瓜子
            runMidnight(() => MY_API.Exchange.runC2S(), '硬币换瓜子');
            return $.Deferred().resolve();
          }
          return MY_API.Exchange.coin2silver(MY_API.CONFIG.COIN2SILVER_NUM).then(() => {
            MY_API.CACHE.Coin2Sliver_TS = ts_ms();
            MY_API.saveCache();
            runMidnight(() => MY_API.Exchange.runC2S(), '硬币换瓜子');
          }, () => delayCall(() => MY_API.Exchange.runC2S()))
        },
        runS2C: () => {
          try {
            if (!MY_API.CONFIG.SILVER2COIN || otherScriptsRunning) return $.Deferred().resolve();
            if (!checkNewDay(MY_API.CACHE.Silver2Coin_TS)) {
              // 同一天，不再兑换硬币
              runMidnight(() => MY_API.Exchange.runS2C(), '瓜子换硬币');
              return $.Deferred().resolve();
            }
            return MY_API.Exchange.silver2coin().then(() => {
              MY_API.CACHE.Silver2Coin_TS = ts_ms();
              MY_API.saveCache();
              runMidnight(() => MY_API.Exchange.runS2C(), '瓜子换硬币');
            }, () => delayCall(() => MY_API.Exchange.runS2C()));
          } catch (err) {
            window.toast('[银瓜子换硬币]运行时出现异常，已停止', 'error');
            MYERROR(`银瓜子换硬币出错`, err);
            return $.Deferred().reject();
          }
        }
      },
      Gift: {
        run_timer: undefined, // 可用来取消下次运行的计划 clearTimeout(MY_API.Gift.run_timer)
        ruid: undefined, // 包裹内礼物的ruid
        room_id: undefined, // 送礼目标房间号
        medal_list: undefined, // 勋章列表
        bag_list: undefined, // 包裹
        giftFeed_list: {}, // 每种礼物所对应的亲密度
        remain_feed: undefined, // 该勋章今日剩余亲密度
        over: undefined, // 是否结束送礼
        allowGiftList: undefined, // 允许被送出礼物的id
        /**
         * 获取礼物包裹
         */
        getBagList: async () => {
          return BAPI.gift.bag_list().then((response) => {
            MYDEBUG('Gift.getBagList: API.gift.bag_list', response);
            if (response.code === 0) {
              MY_API.Gift.bag_list = response.data.list;
            } else {
              window.toast(`[自动送礼]获取包裹列表失败，${response.message}`, 'error');
              return delayCall(() => MY_API.Gift.getBagList());
            }
          });
        },
        /**
         * 通过礼物id获取礼物的亲密度
         * @param {Number} gift_id 礼物id
         */
        getFeedByGiftID: (gift_id) => {
          for (let i = Live_info.gift_list.length - 1; i >= 0; --i) {
            if (Live_info.gift_list[i].id === gift_id) {
              return Math.ceil(Live_info.gift_list[i].price / 100);
            }
          }
          return 0;
        },
        /**
         * 排序粉丝勋章
         * @param {Object} medals 
         */
        sort_medals: (medals) => {
          if (MY_API.CONFIG.GIFT_SORT == 'GIFT_SORT_HIGH') {
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
          if (MY_API.CONFIG.AUTO_GIFT_ROOMID) {
            let sortRooms = [...MY_API.CONFIG.AUTO_GIFT_ROOMID];
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
        run: async (noTimeCheck = false) => {
          /**
           * 一轮送礼结束后运行的函数
           */
          const waitForNextRun = () => {
            window.toast('[自动送礼] 本次送礼结束', 'info');
            SEND_GIFT_NOW = false;
            if (MY_API.CONFIG.GIFT_METHOD == "GIFT_SEND_TIME") {
              let alternateTime = getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR, MY_API.CONFIG.GIFT_SEND_MINUTE);
              MY_API.Gift.run_timer = setTimeout(() => MY_API.Gift.run(true), alternateTime);
              let runTime = new Date(ts_ms() + alternateTime).toLocaleString();
              MYDEBUG("[自动送礼]", `将在${runTime}进行自动送礼`);
              MY_API.CACHE.Gift_TS = ts_ms();
              MY_API.saveCache();
            } else {
              let alternateTime = MY_API.CONFIG.GIFT_INTERVAL * 60 * 1000;
              MY_API.Gift.run_timer = setTimeout(() => MY_API.Gift.run(true), alternateTime);
              MYDEBUG("[自动送礼]", `将在${MY_API.CONFIG.GIFT_INTERVAL}分钟后进行自动送礼`);
              MY_API.CACHE.GiftInterval_TS = ts_ms();
              MY_API.saveCache();
            }
          };
          /**
           * 处理用户输入的【允许被送出的礼物类型】，将礼物名转换为id
           */
          const handleGiftList = () => {
            MY_API.Gift.allowGiftList = [...MY_API.CONFIG.GIFT_ALLOW_TYPE];
            MYDEBUG('[自动送礼]', `处理前的礼物列表 ${MY_API.Gift.allowGiftList}`);
            for (let i = 0; i < MY_API.Gift.allowGiftList.length; i++) {
              const listItem = MY_API.Gift.allowGiftList[i];
              let matchItem;
              if (isNaN(listItem)) {
                // 如果填了礼物名，转换为id
                matchItem = Live_info.gift_list.find(item => item.name === listItem);
                if (matchItem) MY_API.Gift.allowGiftList[i] = String(matchItem.id);
              }
            }
            MYDEBUG('[自动送礼]', `处理后得到的礼物id列表 ${MY_API.Gift.allowGiftList}`)
          };
          /**
           * 获取礼物列表中的每种礼物所对应的亲密度，把结果保存至 giftFeed_list。
           * 格式：{ id1: feed1, id2: feed2, ... }
           */
          const getGiftFeed = async () => {
            for (const i of MY_API.Gift.bag_list) {
              if (!MY_API.Gift.giftFeed_list.hasOwnProperty(i.gift_id)) {
                MY_API.Gift.giftFeed_list[i.gift_id] = await MY_API.Gift.getFeedByGiftID(i.gift_id);
              }
            }
          }
          /**
           * 处理包裹。
           * 1. 根据礼物到期时间过滤包裹
           * 2. 按礼物亲密度由高到低排序
           * 3. 按过期时间由早到晚排序
           * @param filter 是否按设置过滤礼物
           */
          const handleBagList = (filter = true) => {
            let bag_list;
            if (!MY_API.CONFIG.SEND_ALL_GIFT && filter) {
              // 送之前查一次有没有可送的
              bag_list = MY_API.Gift.bag_list.filter(r => MY_API.Gift.allowGiftList.includes(String(r.gift_id)) && r.gift_num > 0 &&
                Number(r.corner_mark.substring(0, r.corner_mark.indexOf("天"))) <= MY_API.CONFIG.GIFT_LIMIT);
              MYDEBUG("[自动送礼] if分支 过滤后的礼物", bag_list);
              if (bag_list.length === 0) {
                MY_API.Gift.over = true;
                return;
              }
            } else {
              bag_list = MY_API.Gift.bag_list.filter(r => r.gift_num > 0 && r.corner_mark != '永久');
              MYDEBUG("[自动送礼] else分支 过滤后的礼物", bag_list);
              if (bag_list.length === 0) {
                MY_API.Gift.over = true;
                return;
              }
            }
            // 按礼物亲密度由高到低排序
            for (const i of bag_list) {
              i.gift_feed = MY_API.Gift.giftFeed_list[i.gift_id];
            }
            bag_list.sort(function (a, b) { return b.gift_feed - a.gift_feed });
            // 按过期时间由早到晚
            bag_list.sort(function (a, b) {
              if (b.gift_feed === a.gift_feed) {
                return a.expire_at - b.expire_at
              }
            });
            MY_API.Gift.bag_list = [...bag_list];
            MYDEBUG('Gift.bag_list (sorted)', MY_API.Gift.bag_list);
          };
          /**
           * 处理粉丝勋章
           * @param {Object} MY_API.Gift.medal_list 
           */
          const handleMedalList = () => {
            MY_API.Gift.medal_list = MY_API.Gift.medal_list.filter(it => it.day_limit - it.today_feed > 0 && it.level < 20 && it.roomid);
            MY_API.Gift.medal_list = MY_API.Gift.sort_medals(MY_API.Gift.medal_list);
            // 排除直播间
            if (MY_API.CONFIG.GIFT_SEND_METHOD === "GIFT_SEND_BLACK") {
              // 黑名单
              MY_API.Gift.medal_list = MY_API.Gift.medal_list.filter(Er => MY_API.CONFIG.GIFT_SEND_ROOM.findIndex(exp => exp == Er.roomid) == -1);
            } else {
              // 白名单
              MY_API.Gift.medal_list = MY_API.Gift.medal_list.filter(Er => MY_API.CONFIG.GIFT_SEND_ROOM.findIndex(exp => exp == Er.roomid) > -1);
            }
          }
          /**
           * 判断包裹内是否还有礼物
           * @returns {Boolean} 有礼物 true, 无礼物 false
           */
          const checkRemainGift = () => {
            return MY_API.Gift.bag_list.some(g => g.gift_num > 0) ? true : false;
          };
          try {
            if ((!MY_API.CONFIG.AUTO_GIFT) || otherScriptsRunning) return $.Deferred().resolve();
            if (medalDanmuRunning) {
              // [自动送礼]【粉丝牌打卡】任务运行中
              return setTimeout(() => MY_API.Gift.run(), 3e3);
            }
            if (MY_API.Gift.run_timer) clearTimeout(MY_API.Gift.run_timer);
            if (MY_API.CONFIG.GIFT_METHOD == "GIFT_SEND_TIME" && !isTime(MY_API.CONFIG.GIFT_SEND_HOUR, MY_API.CONFIG.GIFT_SEND_MINUTE) && !SEND_GIFT_NOW && !noTimeCheck) {
              // 定时送礼
              let alternateTime = getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR, MY_API.CONFIG.GIFT_SEND_MINUTE);
              MY_API.Gift.run_timer = setTimeout(() => MY_API.Gift.run(true), alternateTime);
              let runTime = new Date(ts_ms() + alternateTime).toLocaleString();
              MYDEBUG("[自动送礼]", `将在${runTime}进行自动送礼`);
              return $.Deferred().resolve();
            } else if (MY_API.CONFIG.GIFT_METHOD == "GIFT_INTERVAL" && !SEND_GIFT_NOW && !noTimeCheck) {
              // 间隔__分钟送礼
              let GiftInterval = MY_API.CONFIG.GIFT_INTERVAL * 60e3;
              if (MY_API.CACHE.GiftInterval_TS) {
                const interval = ts_ms() - MY_API.CACHE.GiftInterval_TS;
                if (interval < GiftInterval) {
                  let intervalTime = GiftInterval - interval;
                  MY_API.Gift.run_timer = setTimeout(() => MY_API.Gift.run(true), intervalTime);
                  MYDEBUG("[自动送礼]", `将在${intervalTime}毫秒后进行自动送礼`);
                  return $.Deferred().resolve();
                }
              }
              else {
                MY_API.CACHE.GiftInterval_TS = ts_ms();
                MY_API.saveCache();
              }
            }
            if (medal_info.status.state() === "resolved") MY_API.Gift.medal_list = [...medal_info.medal_list];
            else {
              window.toast('[自动送礼] 粉丝勋章列表未被完全获取，暂停运行', 'error');
              return medal_info.status.then(() => MY_API.Gift.run());
            }
            MYDEBUG('Gift.run: Gift.getMedalList().then: Gift.medal_list', MY_API.Gift.medal_list);
            MY_API.Gift.over = false; // 开始运行前先把停止运行设为 false
            handleGiftList();
            await MY_API.Gift.getBagList();
            await getGiftFeed();
            handleBagList(false);
            if (MY_API.Gift.over) return waitForNextRun();
            if (MY_API.Gift.medal_list.length > 0) {
              handleMedalList();
              handleBagList();
              if (MY_API.Gift.over) return waitForNextRun();
              for (const v of MY_API.Gift.medal_list) {
                if (!checkRemainGift()) {
                  MY_API.Gift.over = true;
                  break;
                }
                const response = await BAPI.room.room_init(parseInt(v.roomid, 10)).then(re => {
                  MYDEBUG(`[自动送礼] API.room.room_init(${v.roomid})`, re);
                  if (re.code !== 0) throw re.msg;
                  return re;
                });
                MY_API.Gift.room_id = parseInt(response.data.room_id, 10);
                MY_API.Gift.ruid = v.target_id;
                MY_API.Gift.remain_feed = v.day_limit - v.today_feed;
                if (MY_API.Gift.remain_feed > 0) {
                  window.toast(`[自动送礼]勋章[${v.medal_name}] 今日亲密度未满[${v.today_feed}/${v.day_limit}]，预计需要[${MY_API.Gift.remain_feed}]送礼开始`, 'info');
                  await MY_API.Gift.sendGift(v);
                } else {
                  window.toast(`[自动送礼]勋章[${v.medal_name}] 今日亲密度已满`, 'info');
                }
              }
            }
            if (!MY_API.Gift.over) await MY_API.Gift.sendRemainGift(MY_API.CONFIG.SPARE_GIFT_ROOM);
            return waitForNextRun();
          } catch (err) {
            window.toast('[自动送礼] 运行时出现异常，已停止', 'error');
            MYERROR(`自动送礼出错`, err);
            return delayCall(() => MY_API.Gift.run());
          }
        },
        sendGift: async (medal) => {
          for (const v of MY_API.Gift.bag_list) {
            if (MY_API.Gift.remain_feed <= 0) {
              return window.toast(`[自动送礼]勋章[${medal.medal_name}]送礼结束，今日亲密度已满[${medal.today_feed}/${medal.day_limit}]`, 'info');
            }
            if (v.gift_num === 0) continue; // 如果这一礼物送完了则跳到下一个礼物
            const feed = MY_API.Gift.giftFeed_list[v.gift_id];
            if (feed > 0) {
              let feed_num = Math.floor(MY_API.Gift.remain_feed / feed);
              if (feed_num === 0) continue; // 当前礼物亲密度大于勋章今日剩余亲密度
              if (feed_num > v.gift_num) feed_num = v.gift_num;
              MYDEBUG(`[自动送礼]送出礼物类型${v.gift_name}，该项礼物数量${v.gift_num}，送出礼物数量${feed_num}`);
              await BAPI.gift.bag_send(Live_info.uid, v.gift_id, MY_API.Gift.ruid, feed_num, v.bag_id, MY_API.Gift.room_id, Live_info.rnd).then((response) => {
                MYDEBUG('Gift.sendGift: API.gift.bag_send', response);
                if (response.code === 0) {
                  v.gift_num -= feed_num;
                  medal.today_feed += feed_num * feed;
                  MY_API.Gift.remain_feed -= feed_num * feed;
                  window.toast(`[自动送礼]勋章[${medal.medal_name}] 送礼成功，送出${feed_num}个${v.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离今日亲密度上限还需[${MY_API.Gift.remain_feed}]`, 'success');
                } else if (response.code === 200028) {
                  // 当前直播间无法赠送礼物哦～
                  window.toast(`[自动送礼]勋章[${medal.medal_name}] 送礼失败：${response.msg}`, 'caution');
                }
                else {
                  window.toast(`[自动送礼]勋章[${medal.medal_name}] 送礼异常：${response.msg}`, 'caution');
                  return delayCall(() => MY_API.Gift.sendGift(medal));
                }
              });
            }
          }
        },
        sendRemainGift: async (ROOM_ID) => {
          if (ROOM_ID == 0) return $.Deferred().resolve();
          let UID = undefined;
          await BAPI.room.room_init(ROOM_ID).then((response) => {
            MYDEBUG('API.room.room_init', response);
            if (response.code === 0) UID = response.data.uid;
            else {
              window.toast(`[自动送礼]【剩余礼物】检查房间出错 ${response.message}`);
              return delayCall(() => BAPI.room.room_init(ROOM_ID));
            }
          })
          let bag_list = MY_API.Gift.bag_list.filter(r => MY_API.Gift.allowGiftList.includes(String(r.gift_id)) && r.gift_num > 0 &&
            r.corner_mark == '1天');
          if (bag_list.length === 0) return;
          MYDEBUG('[自动送礼]【剩余礼物】bag_list', bag_list);
          for (const v of bag_list) {
            if (v.gift_num <= 0) continue;
            const feed = MY_API.Gift.giftFeed_list[v.gift_id];
            if (feed > 0) {
              let feed_num = v.gift_num;
              await BAPI.gift.bag_send(Live_info.uid, v.gift_id, UID, feed_num, v.bag_id, ROOM_ID, Live_info.rnd).then((response) => {
                MYDEBUG('Gift.sendGift: API.gift.bag_send', response);
                if (response.code === 0) {
                  v.gift_num -= feed_num;
                  window.toast(`[自动送礼]【剩余礼物】房间[${ROOM_ID}] 送礼成功，送出${feed_num}个${v.gift_name}`, 'success');
                } else if (response.code === 200028) {
                  // 当前直播间无法赠送礼物哦～
                  window.toast(`[自动送礼]勋章[${medal.medal_name}] 送礼失败：${response.msg}`, 'caution');
                } else {
                  window.toast(`[自动送礼]【剩余礼物】房间[${ROOM_ID}] 送礼异常：${response.msg}`, 'caution');
                  return delayCall(() => MY_API.Gift.sendGift(medal));
                }
              });
            }
          }
        }
      },
      AUTO_DANMU: {
        setValue: (array, index) => {
          if (MY_API.CONFIG[array][index] === undefined && index > 0)
            return MY_API.AUTO_DANMU.setValue(array, index - 1);
          else return MY_API.CONFIG[array][index];
        },
        sendDanmu: async (danmuContent, roomId) => {
          let realRoomId = roomId;
          if (Number(roomId) <= 10000) {
            realRoomId = await BAPI.room.get_info(roomId).then((res) => {
              MYDEBUG(`API.room.get_info roomId=${roomId} res`, res); // 可能是短号，要用长号发弹幕
              if (res.code === 0) {
                return res.data.room_id;
              } else {
                window.toast(`[自动发弹幕]房间号【${roomId}】信息获取失败 ${res.message}`, 'error');
                return roomId
              }
            });
          }
          return BAPI.sendLiveDanmu(danmuContent, realRoomId).then((response) => {
            MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmuContent}】，房间号【${roomId}】`, response);
            if (response.code === 0) {
              window.toast(`[自动发弹幕]弹幕【${danmuContent}】（房间号【${roomId}】）发送成功`, 'success');
            } else {
              window.toast(`[自动发弹幕]弹幕【${danmuContent}】（房间号【${roomId}】）出错 ${response.msg}`, 'caution');
            }
          })
        },
        getMaxLength: () => {
          let maxLength = undefined;
          const contentLength = MY_API.CONFIG.DANMU_CONTENT.length,
            roomidLength = MY_API.CONFIG.DANMU_ROOMID.length,
            intervalTimeLength = MY_API.CONFIG.DANMU_INTERVAL_TIME.length;
          if (contentLength >= roomidLength) maxLength = contentLength;
          else maxLength = roomidLength;
          if (maxLength < intervalTimeLength)
            maxLength = intervalTimeLength;
          return maxLength
        },
        run: async () => {
          if (!MY_API.CONFIG.AUTO_DANMU || otherScriptsRunning) return $.Deferred().resolve();
          if (medalDanmuRunning) {
            // [自动发弹幕]【粉丝牌打卡】任务运行中
            return setTimeout(() => MY_API.AUTO_DANMU.run(), 3e3);
          }
          danmuTaskRunning = true;
          if (SEND_DANMU_NOW) {
            for (let i = 0; i < MY_API.CONFIG.DANMU_CONTENT.length; i++) {
              let danmu_content = MY_API.AUTO_DANMU.setValue('DANMU_CONTENT', i),
                danmu_roomid = parseInt(MY_API.AUTO_DANMU.setValue('DANMU_ROOMID', i));
              await MY_API.AUTO_DANMU.sendDanmu(danmu_content, danmu_roomid);
              await sleep(1000);
            }
            SEND_DANMU_NOW = false;
          } else {
            let maxLength = MY_API.AUTO_DANMU.getMaxLength();
            for (let i = 0; i < maxLength; i++) {
              let danmu_content = MY_API.AUTO_DANMU.setValue('DANMU_CONTENT', i),
                danmu_roomid = parseInt(MY_API.AUTO_DANMU.setValue('DANMU_ROOMID', i)),
                danmu_intervalTime = MY_API.AUTO_DANMU.setValue('DANMU_INTERVAL_TIME', i), // 设置-发送时间
                lastSendTime = undefined, // 上次发弹幕的时间戳(毫秒)
                jsonCache = MY_API.CACHE.AUTO_SEND_DANMU_TS,
                objIndex = undefined, // 弹幕缓存下标
                isTimeData = undefined, // 是否是时间点数据(eg 9:01)
                intervalTime = undefined, // 据上次发弹幕的时间(毫秒)
                danmu_intervalTime_Ts = undefined, // 间隔时间
                sleepTime = 0;
              function getDanmuCache() {
                for (let i = 0; i < jsonCache.length; i++) {
                  const obj = jsonCache[i];
                  if (obj.roomid == danmu_roomid && obj.content == danmu_content) {
                    lastSendTime = obj.sendTs
                    objIndex = i;
                    break;
                  }
                }
              }
              if (danmu_intervalTime.indexOf(':') > -1) { // 时间
                isTimeData = true;
                const danmu_time = danmu_intervalTime.split(':'); // 小时，分钟，秒
                const hour = parseInt(danmu_time[0]), minute = parseInt(danmu_time[1]), second = parseInt(danmu_time[2]);
                if (!isTime(hour, minute, second)) sleepTime = getIntervalTime(hour, minute, second);
                else sleepTime = 86400000;
              }
              else {
                isTimeData = false;
                danmu_intervalTime = danmu_intervalTime.toLowerCase();
                if (danmu_intervalTime.indexOf('h') > -1 || danmu_intervalTime.indexOf('m') > -1 || danmu_intervalTime.indexOf('s') > -1) {
                  const hourArray = danmu_intervalTime.split('h'); // 1h5m3s
                  const minuteArray = (hourArray[1] === undefined) ? hourArray[0].split('m') : hourArray[1].split('m');
                  const secondArray = (minuteArray[1] === undefined) ? minuteArray[0].split('s') : minuteArray[1].split('s');
                  const hour = hourArray[0],
                    minute = minuteArray[0],
                    second = secondArray[0];
                  const finalHour = isNaN(hour) ? 0 : hour || 0,
                    finalMinute = isNaN(minute) ? 0 : minute || 0,
                    finalSecond = isNaN(second) ? 0 : second || 0;
                  danmu_intervalTime_Ts = finalHour * 3600000 + finalMinute * 60000 + finalSecond * 1000;
                } else { // 没有h或m或s则默认是分钟
                  danmu_intervalTime_Ts = danmu_intervalTime * 60000;
                }
              }
              MYDEBUG('[自动发弹幕]MY_API.CACHE.AUTO_SEND_DANMU_TS => jsoncache', jsonCache);
              getDanmuCache();
              if (!isTimeData) {
                if (lastSendTime) intervalTime = ts_ms() - lastSendTime;
                else intervalTime = ts_ms();
              }
              const setCache = () => {
                const newJson = {
                  roomid: danmu_roomid,
                  content: danmu_content,
                  sendTs: ts_ms()
                };
                getDanmuCache();
                if (objIndex === undefined) {
                  jsonCache.push(newJson);
                } else {
                  jsonCache[objIndex].sendTs = ts_ms();
                }
                MY_API.CACHE.AUTO_SEND_DANMU_TS = jsonCache;
                return MY_API.saveCache(false);
              };
              const sendNextDanmu = (intervalTS, isTime) => {
                if (!isTime) setCache();
                return setTimeout(async () => {
                  await MY_API.AUTO_DANMU.sendDanmu(danmu_content, danmu_roomid);
                  if (!isTime) setCache();
                  return sendNextDanmu(intervalTS, isTime);
                }, intervalTS);
              }
              if (!isTimeData && intervalTime >= danmu_intervalTime_Ts) {
                // 非时间点数据，距上次发送的时间大于间隔时间
                await MY_API.AUTO_DANMU.sendDanmu(danmu_content, danmu_roomid);
                MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmu_content}】，房间号【${danmu_roomid}】，距下次发送还有`, danmu_intervalTime);
                sendNextDanmu(danmu_intervalTime_Ts, isTimeData);
              } else if (isTimeData && !sleepTime) {
                // 时间点数据，立刻发送
                await MY_API.AUTO_DANMU.sendDanmu(danmu_content, danmu_roomid);
                MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmu_content}】，房间号【${danmu_roomid}】，距下次发送还有`, '24小时');
                sendNextDanmu(sleepTime, isTimeData);
              }
              else {
                // 时间点数据，需等待一段时间再发送
                MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmu_content}】，房间号【${danmu_roomid}】，距下次发送还有`, `${(!isTimeData) ? (danmu_intervalTime_Ts - intervalTime) / 60000 : sleepTime / 60000}分钟`);
                setTimeout(async () => {
                  await MY_API.AUTO_DANMU.sendDanmu(danmu_content, danmu_roomid);
                  sendNextDanmu((isTimeData) ? 86400000 : danmu_intervalTime_Ts, isTimeData);
                }, (isTimeData) ? sleepTime : danmu_intervalTime_Ts - intervalTime);
              }
              await sleep(1500);
            }
          }
          danmuTaskRunning = false;
        }
      },
      AUTO_CHECK_DANMU: {
        sendDanmu: {},
        initEmitter: () => {
          danmuEmitter.on('danmu', (msg) => {
            let timer = setTimeout(() => {
              window.toast(`弹幕【${msg}】疑似发送失败`, 'caution');
              delete MY_API.AUTO_CHECK_DANMU.sendDanmu[timer];
            }, MY_API.CONFIG.AUTO_CHECK_DANMU_TIMEOUT);
            MY_API.AUTO_CHECK_DANMU.sendDanmu[timer] = msg;
          })
        },
        run: () => {
          if (!SP_CONFIG.AUTO_CHECK_DANMU) return;
          MY_API.AUTO_CHECK_DANMU.initEmitter();
          W.bliveproxy.addCommandHandler("DANMU_MSG", (command) => {
            if (MY_API.AUTO_CHECK_DANMU.sendDanmu === {}) return;
            const info = command.info;
            if (info[2][0] === Live_info.uid) {
              for (const d in MY_API.AUTO_CHECK_DANMU.sendDanmu) {
                if (MY_API.AUTO_CHECK_DANMU.sendDanmu[d] === info[1]) {
                  MYDEBUG(`[检查弹幕是否发送成功] 已找到弹幕(timer = ${d})`, MY_API.AUTO_CHECK_DANMU.sendDanmu[d])
                  clearTimeout(d);
                  delete MY_API.AUTO_CHECK_DANMU.sendDanmu[d];
                }
              }
            }
          });
        }
      },
      MEDAL_DANMU: {
        medal_list: [],
        sendDanmu: async (danmuContent, roomId, medal_name) => {
          return BAPI.sendLiveDanmu(danmuContent, roomId).then((response) => {
            MYDEBUG(`API.sendLiveDanmu(弹幕 = ${danmuContent}, roomid = ${roomId})`, response);
            if (response.code === 0) {
              return MYDEBUG(`[粉丝牌打卡弹幕] 弹幕发送内容【${danmuContent}】，房间号【${roomId}】，真实房间号【${roomId}】，粉丝勋章【${medal_name}】`, response);
            } else {
              return window.toast(`[粉丝牌打卡弹幕] 弹幕【${danmuContent}】（房间号【${roomId}】，粉丝勋章【${medal_name}】）出错 ${response.message}`, 'caution');
            }
          })
        },
        run: async () => {
          if (!MY_API.CONFIG.MEDAL_DANMU || otherScriptsRunning) return $.Deferred().resolve();
          if (!checkNewDay(MY_API.CACHE.Live_medalDanmu_TS)) {
            runMidnight(() => MY_API.MEDAL_DANMU.run(), '粉丝勋章打卡弹幕');
            return $.Deferred().resolve();
          }
          if (danmuTaskRunning) {
            // [粉丝牌打卡]【自动发弹幕】任务运行中
            return setTimeout(() => MY_API.MEDAL_DANMU.run(), 3e3);
          }
          if (medal_info.status.state() === "resolved") MY_API.MEDAL_DANMU.medal_list = [...medal_info.medal_list];
          else {
            window.toast('[粉丝牌打卡] 粉丝勋章列表未被完全获取，暂停运行', 'error');
            return medal_info.status.then(() => MY_API.MEDAL_DANMU.run());
          }
          medalDanmuRunning = true;
          let lightMedalList;
          if (MY_API.CONFIG.LIVE_TASKS_METHOD === 'LIVE_TASKS_WHITE')
            lightMedalList = MY_API.MEDAL_DANMU.medal_list.filter(r => MY_API.CONFIG.LIVE_TASKS_ROOM.findIndex(m => m == r.roomid) > -1 && r.roomid);
          else {
            lightMedalList = MY_API.MEDAL_DANMU.medal_list.filter(r => MY_API.CONFIG.LIVE_TASKS_ROOM.findIndex(m => m == r.roomid) === -1 && r.roomid);
          }
          MYDEBUG('[粉丝牌打卡] 过滤后的粉丝勋章房间列表', lightMedalList);
          let danmuContentIndex = 0;
          const configDanmuLength = MY_API.CONFIG.MEDAL_DANMU_CONTENT.length;
          // 第一轮
          for (const up of lightMedalList) {
            if (danmuContentIndex >= configDanmuLength) danmuContentIndex = 0;
            const medal_name = up.medal_name,
              roomid = up.real_roomid,
              danmuContent = MY_API.CONFIG.MEDAL_DANMU_CONTENT[danmuContentIndex];
            await MY_API.MEDAL_DANMU.sendDanmu(danmuContent, roomid, medal_name);
            danmuContentIndex++;
            await sleep(MY_API.CONFIG.MEDAL_DANMU_INTERVAL * 1000);
          }
          medalDanmuRunning = false;
          window.toast('[粉丝牌打卡弹幕] 今日已完成', 'success');
          MY_API.CACHE.Live_medalDanmu_TS = ts_ms();
          MY_API.saveCache();
          return runTomorrow(() => MY_API.MEDAL_DANMU.run(), 0, 2, '粉丝勋章打卡弹幕');
        }
      },
      DANMU_MODIFY: {
        maxLength: 0,
        configJson: {
          DANMU_MODIFY_REGEX: [],
          DANMU_MODIFY_UID: [],
          DANMU_MODIFY_POOL: [],
          DANMU_MODIFY_SIZE: [],
          DANMU_MODIFY_COLOR: []
        },
        handleConfig: () => {
          for (const i in MY_API.DANMU_MODIFY.configJson) {
            MY_API.DANMU_MODIFY.configJson[i] = MY_API.CONFIG[i];
          }
          for (const i in MY_API.DANMU_MODIFY.configJson) {
            if (MY_API.DANMU_MODIFY.configJson[i].length > MY_API.DANMU_MODIFY.maxLength)
              MY_API.DANMU_MODIFY.maxLength = MY_API.DANMU_MODIFY.configJson[i].length;
          }
          for (const i in MY_API.DANMU_MODIFY.configJson) {
            if (MY_API.DANMU_MODIFY.configJson[i].length < MY_API.DANMU_MODIFY.maxLength) {
              let lastIndex = MY_API.DANMU_MODIFY.configJson[i].length - 1;
              for (let c = lastIndex; c < MY_API.DANMU_MODIFY.maxLength - 1; c++) {
                MY_API.DANMU_MODIFY.configJson[i].push(MY_API.DANMU_MODIFY.configJson[i][lastIndex])
              }
            }
          }
        },
        check: (info) => {
          for (let i = 0; i < MY_API.DANMU_MODIFY.maxLength; i++) {
            let regex,
              uid = info[2][0],
              danmu = info[1];
            try { regex = eval(MY_API.DANMU_MODIFY.configJson.DANMU_MODIFY_REGEX[i]) }
            catch (e) { MYDEBUG('bliveproxy', `正则表达式出错 ${MY_API.DANMU_MODIFY.configJson.DANMU_MODIFY_REGEX[i]}`); regex = /^【/; }
            if (regex.test(danmu) || MY_API.DANMU_MODIFY.configJson.DANMU_MODIFY_UID[i] == uid) return i;
          }
          return -1;
        },
        run: () => {
          if (!SP_CONFIG.DANMU_MODIFY) return $.Deferred().resolve();
          MY_API.DANMU_MODIFY.handleConfig();
          // MYDEBUG('MY_API.DANMU_MODIFY.configJson', MY_API.DANMU_MODIFY.configJson);
          W.bliveproxy.addCommandHandler('DANMU_MSG', command => {
            if (!SP_CONFIG.DANMU_MODIFY) return $.Deferred().resolve();
            let info = command.info;
            MYDEBUG('bliveproxy DANMU_MSG', info);
            let index = MY_API.DANMU_MODIFY.check(info);
            if (index === -1) return $.Deferred().resolve();
            // 显示模式
            info[0][1] = MY_API.DANMU_MODIFY.configJson.DANMU_MODIFY_POOL[index];
            // 尺寸
            info[0][2] *= MY_API.DANMU_MODIFY.configJson.DANMU_MODIFY_SIZE[index];
            // 颜色
            info[0][3] = Number("0x" + MY_API.DANMU_MODIFY.configJson.DANMU_MODIFY_COLOR[index].replace("#", ""));
          })
        }
      },
      GET_PRIVILEGE: {
        check_cache: () => {
          if (ts_ms() >= MY_API.CACHE.NextVipPrivilege_TS) return true;
          else return false;
        },
        save_cache: (expire_time) => {
          const newTs = (expire_time + 2) * 1000;
          if (newTs < MY_API.CACHE.NextVipPrivilege_TS || !MY_API.CACHE.NextVipPrivilege_TS) {
            MY_API.CACHE.NextVipPrivilege_TS = newTs;
            return MY_API.saveCache(false);
          }
        },
        get_info: () => {
          return BAPI.x.vip.privilege.my().then(response => {
            MYDEBUG(`API.x.vip.privilege.my response`, response);
            if (response.code === 0) return response.data.list;
            else window.toast(`[大会员] 获取权益状态失败 ${response.message}`, 'error');
            return false;
          })
        },
        receive: (type) => {
          return BAPI.x.vip.privilege.receive(type).then(response => {
            MYDEBUG(`API.x.vip.privilege.receive response`, response);
            if (response.code === 0) return true;
            else window.toast(`[大会员] 领取权益失败(type=${type}) ${response.message}`, 'warning');
            return false;
          })
        },
        run: async () => {
          if (!MY_API.CONFIG.GET_PRIVILEGE || otherScriptsRunning || Live_info.vipStatus === 0 || ts_ms() < MY_API.CACHE.NextVipPrivilege_TS) return $.Deferred().resolve();
          let privilege_info = await MY_API.GET_PRIVILEGE.get_info();
          if (!privilege_info) return $.Deferred().resolve();
          let flag = false;
          for (const i of privilege_info) {
            if (i.state === 0) {
              flag = await MY_API.GET_PRIVILEGE.receive(i.type, i.expire_time);
            }
          }
          if (flag) window.toast("[大会员] 权益已领取", "success");
          if (privilege_info.every(obj => obj.state === 1)) {
            let min_expire_time = privilege_info[0].expire_time;
            for (let i = 1; i < privilege_info.length; i++) {
              if (privilege_info[i].expire_time < min_expire_time) min_expire_time = privilege_info[i].expire_time;
            }
            MY_API.GET_PRIVILEGE.save_cache(min_expire_time);
          }
          return $.Deferred().resolve();
        }
      },
    };
    MY_API.init().then(() => {
      try {
        let runNext = $.Deferred();
        if (SP_CONFIG.showEula) {
          const eula = GM_getResourceText('eula');
          myopen({
            title: `${GM_info.script.name}最终用户许可协议`,
            btn: ['同意协议并继续', '不同意'],
            closeBtn: 0,
            area: [String($(window).width() * 0.618) + 'px', String($(window).height() * 0.8) + 'px'],
            content: eula,
            yes: function (index) {
              SP_CONFIG.showEula = false;
              saveSpConfig();
              layer.close(index);
              runNext.resolve();
            },
            btn2: function () {
              mymsg('脚本已停止运行', {
                time: 3000,
                icon: 2
              });
              window.toast('由于未同意最终用户许可协议，脚本已停止运行。', 'caution');
              SP_CONFIG.showEula = true;
              saveSpConfig();
              runNext.reject();
            }
          });
        } else runNext.resolve();
        runNext.then(() => {
          if (parseInt(Live_info.uid) === 0 || isNaN(parseInt(Live_info.uid)))
            return window.toast('未登录，请先登录再使用脚本', 'caution');
          // 新版本提示信息
          if (MY_API.CONFIG.UPDATE_TIP) MY_API.newMessage(GM_info.script.version);
          MYDEBUG('MY_API.CONFIG', MY_API.CONFIG);
          main(MY_API);
        });
      }
      catch (e) {
        MYERROR('初始化错误', e);
      }
    });
  }

  async function main(API) {
    // 检查更新
    checkUpdate(GM_info.script.version);
    // 修复版本更新产生的兼容性问题
    fixVersionDifferences(API, GM_info.script.version);
    runExactMidnight(() => clearStat(), '重置统计');
    API.creatSetBox(); // 创建设置框
    API.removeUnnecessary(); // 移除页面元素
    API.DANMU_MODIFY.run(); // 弹幕修改
    const taskList = [
      // 每日任务     
      API.MEDAL_DANMU.run, // 粉丝牌打卡弹幕
      API.GroupSign.run, // 应援团签到
      API.DailyReward.run, // 每日任务
      API.LiveReward.run, // 直播每日任务
      API.Exchange.runS2C, // 银瓜子换硬币
      API.Exchange.runC2S, // 硬币换银瓜子
      // 其它任务
      API.AUTO_DANMU.run, // 自动发弹幕
      API.Gift.run, // 送礼物
      API.GET_PRIVILEGE.run, // 领取大会员权益
      API.AUTO_CHECK_DANMU.run, // 检查弹幕是否发送成功
    ];
    otherScriptsRunningCheck.then(() => runAllTasks(5000, 200, taskList));
    if (API.CONFIG.TIME_RELOAD) reset(API.CONFIG.TIME_RELOAD_MINUTE * 60000);// 刷新直播间
    function reset(delay) {
      let resetTimer = setTimeout(() => {
        if (API.CONFIG.WatchLive && checkNewDay(API.CACHE.LiveReward_TS)) {
          MYDEBUG('[刷新直播间]', '正在运行观看直播任务，10分钟后再次检查');
          clearTimeout(resetTimer);
          return reset(600e3);
        }
        const resetTime = sleepCheck(API.CONFIG);
        if (resetTime) {
          MYDEBUG('[刷新直播间]', `处于休眠时间段，将在${resetTime}毫秒后刷新直播间`);
          clearTimeout(resetTimer);
          return reset(resetTime);
        }
        W.location.reload();
      }, delay);
    };
  }
  function checkUpdate(version) {
    if (!checkNewDay(noticeJson.lastCheckUpdateTs)) return;
    const headers = {
      "Accept": `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-User": "?1",
      "Sec-Fetch-Dest": "document",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
    };
    XHR({
      GM: true,
      anonymous: true,
      method: "GET",
      url: "https://andywang.top:3001/api/v1/notice",
      headers: headers,
      responseType: "json"
    }).then(response => {
      MYDEBUG("检查更新 checkUpdate", response);
      if (response.response.status !== 200)
        return window.toast(`[检查更新] 获取notice.json出错 ${response.response.statusText}`, 'caution');
      noticeJson = response.body.data;
      noticeJson.lastCheckUpdateTs = ts_ms();
      GM_setValue(`noticeJson`, noticeJson);
      const scriptVersion = noticeJson.version;
      const greasyforkOpenTabOptions = { active: true, insert: true, setParent: true };
      if (versionStringCompare(version, scriptVersion) === -1) { // version < scriptVersion
        // 需要更新
        let updateSource, updateURL;
        if (GM_info.script.updateURL === null) {
          updateSource = "Greasy Fork"
          updateURL = "https://greasyfork.org/scripts/406048-b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B";
        } else {
          updateSource = "BLTH-server";
          updateURL = "https://andywang.top:3001/api/v1/BLTH.user.js";
        }
        let index = myconfirm(`检测到新版本 <strong>${scriptVersion}</strong>。<br>是否从 ${updateSource} 更新脚本？`, {
          title: '更新脚本',
          btn: ['是', '否']
        }, function () {
          // 更新
          if (updateSource === "Greasy Fork") {
            layer.close(index);
            GM_openInTab(updateURL, greasyforkOpenTabOptions);
          }
          else {
            updateBLTH(updateURL);
            mymsg('正在更新...', { time: 2000 });
          }
        }, function () {
          // 不更新
        });
      }
    })
  }
  /**
   * 获取粉丝勋章列表和真实直播间号
   * @param {Number} page 
   * @returns 
   */
  async function getMedalList(page = 1) {
    if (page === 1) medal_info = { status: $.Deferred(), medal_list: [] };
    let end = false;
    while (true) {
      await BAPI.i.medal(page).then((response) => {
        MYDEBUG('before init() getMedalList: API.i.medal', response);
        if (response.code === 0) {
          for (let i = 0; i < response.data.items.length; i++) {
            if (response.data.items[i].roomid && response.data.items[i].roomid <= 100000) {
              BAPI.room.get_info(response.data.items[i].roomid).then((res) => {
                if (res.code === 0) {
                  response.data.items[i].real_roomid = res.data.room_id;
                } else {
                  MYERROR(`获取直播间${response.data.items[i].roomid}的真实房间号出错`);
                }
              })
            } else {
              response.data.items[i].real_roomid = response.data.items[i].roomid;
            }
          }
          medal_info.medal_list = medal_info.medal_list.concat(response.data.items);
          if (response.data.page_info.cur_page < response.data.page_info.total_page) page++;
          else { medal_info.status.resolve(); end = true }
        } else if (response.code === 1024) {
          window.toast(`获取粉丝勋章列表超时 ${response.message} 部分功能将无法正常运行`, 'error');
          delayCall(() => getMedalList(page));
          end = true;
        } else {
          window.toast(`获取粉丝勋章列表失败 ${response.message} 部分功能将无法正常运行`, 'error');
          delayCall(() => getMedalList(page));
          end = true;
        }
      });
      if (end) {
        runTomorrow(() => getMedalList(), 0, 1, "获取粉丝勋章列表");
        break;
      }
      await sleep(200);
    }
  };
  /**
   * 比较版本号大小
   * @param {string} ver1
   * @param {string} ver2
   * @returns {boolean} 若 ver1 > ver2 返回 1, ver1 = ver2 返回 0, ver1 < ver2, 返回 -1
   */
  function versionStringCompare(ver1 = '0', ver2 = '0') {
    function changeVersion2Num(ver) {
      return ver.match(/\d.*/)[0].split('.').reduce((total, value, index) => total + (0.01 ** index) * Number(value), 0);
    }
    const verNum1 = changeVersion2Num(ver1),
      verNum2 = changeVersion2Num(ver2);
    if (verNum1 > verNum2) return 1
    else if (verNum1 < verNum2) return -1
    else return 0;
  }
  /**
   * 模拟鼠标移动
   */
  function mouseMove() {
    MYDEBUG('屏蔽挂机检测', "触发一次MouseEvent(mousemove)")
    document.dispatchEvent(new MouseEvent('mousemove', {
      screenX: Math.floor(Math.random() * screen.availWidth),
      screenY: Math.floor(Math.random() * screen.availHeight),
      clientX: Math.floor(Math.random() * W.innerWidth),
      clientY: Math.floor(Math.random() * W.innerHeight),
      ctrlKey: Math.random() > 0.8,
      shiftKey: Math.random() > 0.8,
      altKey: Math.random() > 0.9,
      metaKey: false,
      button: 0,
      buttons: 0,
      relatedTarget: null,
      region: null,
      detail: 0,
      view: W,
      sourceCapabilities: W.InputDeviceCapabilities ? new W.InputDeviceCapabilities({ fireTouchEvents: false }) : null,
      bubbles: true,
      cancelable: true,
      composed: true
    }));
  }
  /**
   * 执行所有任务
   * @param {Number} sleep 休眠时间
   * @param {Number} interval 任务间隔
   * @param  {list} task 任务
   */
  function runAllTasks(sleep, interval, task) {
    let num = 0;
    setTimeout(() => {
      for (const i of task) {
        setTimeout(() => i(), interval * num++);
      }
    }, sleep);
  }
  /**
   * 修复因版本差异造成的错误
   * @param API MY_API
   */
  function fixVersionDifferences(API, version) {
    // 添加新的修复后需修改版本号
    if (versionStringCompare(SP_CONFIG.storageLastFixVersion, "6.0.1") >= 0) return;
    // 修复变量类型错误
    const configFixList = ['AUTO_GIFT_ROOMID', 'COIN_UID'];
    if (!configFixList.every(i => Array.isArray(API.CONFIG[i]))) {
      for (const i of configFixList) {
        if (!Array.isArray(API.CONFIG[i])) {
          API.CONFIG[i] = String(API.CONFIG[i]).split(",");
        }
      }
    }
    // 修复变量值差异
    if (API.CONFIG.GIFT_SORT == 'high') API.CONFIG.GIFT_SORT = 'GIFT_SORT_HIGH';
    else if (API.CONFIG.GIFT_SORT == 'low') API.CONFIG.GIFT_SORT = 'GIFT_SORT_LOW'
    if (API.CONFIG.MEDAL_DANMU_ROOM)
      API.CONFIG.LIVE_TASKS_ROOM = API.CONFIG.MEDAL_DANMU_ROOM;
    if (API.CONFIG.MEDAL_DANMU_METHOD)
      API.CONFIG.LIVE_TASKS_METHOD = 'LIVE_TASKS_' + API.CONFIG.MEDAL_DANMU_METHOD.split('_').pop();
    // localStorage fix
    localStorage.removeItem("im_deviceid_IGIFTMSG");
    // save settings
    SP_CONFIG.storageLastFixVersion = version;
    API.saveConfig(false);
    API.saveCache();
    saveSpConfig();
  }
  /**
   * 把localstorage中的设置迁移到GM储存
   * 对版本小于5.6.6.4时保存的设置项进行修复
   */
  function localstorage2gm() {
    if (!localStorage.getItem("IGIFTMSG_CONFIG")) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (/IGIFTMSG.*/.test(key)) {
        let val = localStorage.getItem(key);
        try {
          val = JSON.parse(val);
          let length = 0;
          for (const i in val) { length++ }
          if (val.hasOwnProperty("list") && length === 1) val = val.list;
        } catch (e) { }
        const jumpList = ["AnchorRoomidList"]
        if (jumpList.indexOf(key) === -1) GM_setValue(key.replace(/IGIFTMSG_|IGIFTMSG/, ""), val);
        localStorage.removeItem(key); i--;
      }
    }
    W.location.reload();
  }
  /**
   * 保存特殊设置
   */
  function saveSpConfig(printLog = true) {
    if (printLog) MYDEBUG('SP_CONFIG已保存', SP_CONFIG);
    return GM_setValue(`SP_CONFIG`, SP_CONFIG);
  }
  /**
   * layer动画
   * @param {jqdom} jqdom
   * @param {boolean} bool 
   */
  function animChange(jqdom, bool) {
    if (bool) {
      // show => hide
      jqdom.removeClass('layer-anim');
      jqdom.removeClass('layer-anim-00');
      jqdom.addClass('layer-anim');
      jqdom.addClass('layer-anim-close');
    } else {
      // hide => show
      jqdom.removeClass('layer-anim');
      jqdom.removeClass('layer-anim-close');
      jqdom.addClass('layer-anim');
      jqdom.addClass('layer-anim-00');
    }
  }
  /**
   * 合并两个对象，只合并 obj1 中不包含（或为undefined, null）但 obj2 中有的属性 
   * 删除 obj1 有但 obj2 中没有的属性
   */
  function mergeObject(obj1, obj2) {
    function combine(object1, object2) {
      for (let i in object2) {
        if (object1[i] === undefined || object1[i] === null) object1[i] = object2[i];
        else if (!Array.isArray(object1[i]) && typeof object1[i] === 'object') combine(object1[i], object2[i]);
      }
    }
    function del(object1, object2) {
      for (let i in object1) {
        if (object2[i] === undefined || object2[i] === null) delete object1[i];
        else if (!Array.isArray(object1[i]) && typeof object1[i] === 'object') del(object1[i], object2[i]);
      }
    }
    combine(obj1, obj2);
    del(obj1, obj2);
  }
  /**
   * 通过检查某些特性是否存在判断浏览器版本
   * @returns {Array} 0: 提示字符串 1: 等级字符串
   */
  function checkBrowserVersion() {
    if (typeof Array.prototype.findIndex === "undefined")
      return ["浏览器版本过低，挂机助手停止运行", "error"];
    else if (typeof String.prototype.replaceAll === 'undefined')
      return ["浏览器版本略低，挂机助手可以正常运行但建议升级浏览器到最新版", "info"];
    else
      return ["ok", "info"]
  }
  /**
   * 保存文件到本地
   * @param fileName 文件名
   * @param fileContent 文件内容
   */
  function downFile(fileName, fileContent) {
    let elementA = document.createElement("a");
    elementA.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(fileContent))
    );
    elementA.setAttribute("download", fileName);
    elementA.style.display = "none";
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  }
  /**
   * 更新 BLTH 脚本
   * @param {*} link 更新地址
   */
  function updateBLTH(link) {
    let elementA = document.createElement("a");
    elementA.setAttribute("href", link);
    elementA.style.display = "none";
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  }
  /**
   * 导出配置文件
   * @param MY_API_CONFIG MY_API.CONFIG
   * @param SP_CONFIG SP_CONFIG
   */
  function exportConfig(MY_API_CONFIG, SP_CONFIG) {
    const exportJson = {
      VERSION: GM_info.script.version,
      MY_API_CONFIG: MY_API_CONFIG,
      SP_CONFIG: SP_CONFIG
    };
    return downFile('BLTH_CONFIG.json', exportJson);
  }
  /**
   * 导入配置文件
   */
  function importConfig() {
    let selectedFile = document.getElementById("BLTH_config_file").files[0];
    let reader = new FileReader();
    reader.onload = function () {
      MYDEBUG("importConfig 文件读取结果：", this.result);
      try {
        readConfigArray[0] = JSON.parse(decodeURIComponent(this.result));
        if (typeof readConfigArray[0] == 'object' && readConfigArray[0]) {
          const list = ["VERSION", "MY_API_CONFIG", "SP_CONFIG"];
          for (const i of list) {
            if (!readConfigArray[0].hasOwnProperty(i)) return wrongFile();
          }
          if (versionStringCompare("5.6.6.3", readConfigArray[0]["VERSION"]) === 1) // 5.6.6.3 > VERSION
            return wrongFile('该配置文件版本过低')
          return readConfigArray[1].resolve();
        } else {
          return wrongFile();
        }
      } catch (e) {
        MYDEBUG('importConfig error：', e);
        return wrongFile();
      }
    };
    reader.readAsText(selectedFile);
    function wrongFile(msg = '文件格式错误') {
      return mymsg(msg, {
        time: 2500,
        icon: 2
      });
    }
  }
  /**
   * （23,50） 获取与目标时间在一天内的间隔时间,24小时制（毫秒）
   * @param hour 整数 小时
   * @param minute 整数 分钟
   * @param second 整数 秒（可不填）
   * @returns {number} intervalTime
   */
  function getIntervalTime(hour, minute, second) {
    const myDate = new Date();
    const h = myDate.getHours();
    const m = myDate.getMinutes();
    const s = myDate.getSeconds();
    const TargetTime = hour * 3600 * 1e3 + minute * 60 * 1e3 + (!second ? 0 : second * 1e3)
    const nowTime = h * 3600 * 1e3 + m * 60 * 1e3 + s * 1e3;
    const intervalTime = TargetTime - nowTime;
    MYDEBUG("[getIntervalTime]获取间隔时间", `${intervalTime}毫秒`);
    if (intervalTime < 0) {
      return 24 * 3600 * 1e3 + intervalTime
    }
    else {
      return intervalTime
    }
  }
  /**
   * （23,50） 当前时间是否为23:50
   * @param hour 整数 小时
   * @param minute 整数 分钟
   * @param second 整数 秒（可不填）
   * @returns {boolean}
   */
  function isTime(hour, minute, second) {
    let myDate = new Date();
    let h = myDate.getHours();
    let m = myDate.getMinutes();
    let s = myDate.getSeconds();
    if ((h == hour && m == minute && !second) || (h == hour && m == minute && s == second)) {
      return true
    } else {
      MYDEBUG("isTime 错误时间", `目标时间${hour}时${minute}分${second || 0}秒，当前时间${h}时${m}分${s}秒`);
      return false
    }
  }
  /**
   * （2,10,0,1） 当前是否在两点0分到十点1分之间
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
    const hourMs = 3600000, minMs = 60000,
      myDate = new Date(),
      nowHour = myDate.getHours(),
      nowMin = myDate.getMinutes(),
      nowTimeTs = nowHour * hourMs + nowMin * minMs,
      targetStartTs = sH * hourMs + sM * minMs,
      targetEndTs = eH * hourMs + eM * minMs;
    if (targetStartTs < targetEndTs) {
      if (nowTimeTs >= targetStartTs && nowTimeTs < targetEndTs)
        return true;
      else return false;
    } else {
      if (nowTimeTs >= targetStartTs || nowTimeTs < targetEndTs)
        return true
      else return false;
    }
  };
  /**
   * 暂停
   * @param millisecond
   * @returns {Promise} resolve
   */
  function sleep(millisecond) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, millisecond)
    })
  }
  /**
   * 检查是否为新一天
   * 注：并无要求被检查时间戳大于当前时间戳
   * @param ts 被检查的时间戳
   * @param type 检查标准 北京时间（默认）: Beijing 本地时间: local
   * @returns {boolean}
   */
  function checkNewDay(ts, type = 'Beijing') {
    if (ts == 0) return true;
    let t = new Date(ts);
    let d = type === 'Beijing' ? getCHSdate() : new Date();
    let td = t.getDate();
    let dd = d.getDate();
    let now_ts = d.getTime();
    return dd !== td || now_ts - ts > 86400000;
  };
  /**
   * 唯一运行检测
   */
  function onlyScriptCheck() {
    try {
      let UNIQUE_CHECK_CACHE = localStorage.getItem("UNIQUE_CHECK_CACHE") || 0;
      const t = ts_ms();
      if (t - UNIQUE_CHECK_CACHE >= 0 && t - UNIQUE_CHECK_CACHE <= 11e3) {
        // 其他脚本正在运行
        window.toast('检测到其他直播间页面的挂机助手正在运行，无需重复运行的功能将停止运行', 'caution');
        otherScriptsRunning = true;
        return otherScriptsRunningCheck.resolve();
      }
      let timer_unique;
      const uniqueMark = () => {
        timer_unique = setTimeout(() => uniqueMark(), 10e3);
        UNIQUE_CHECK_CACHE = ts_ms();
        localStorage.setItem("UNIQUE_CHECK_CACHE", UNIQUE_CHECK_CACHE)
      };
      W.addEventListener('unload', () => {
        clearTimeout(timer_unique);
        localStorage.setItem("UNIQUE_CHECK_CACHE", 0);
      });
      uniqueMark();
      return otherScriptsRunningCheck.resolve();
    }
    catch (e) {
      MYDEBUG('重复运行检测出错', e);
      return otherScriptsRunningCheck.reject();
    }
  }
  /**
   * 防抖
   * @param {function} func 
   * @param {number} wait 
   * @returns {function}
   */
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    };
  };
  /**
   * 发起xmlhttpRequest请求（GM函数和浏览器原生）
   * @param XHROptions
   * @returns {object}  resolve({response: res, body: res.response})
   */
  function XHR(XHROptions) {
    return new Promise(resolve => {
      const onerror = (error) => {
        MYERROR('XHR出错', XHROptions, error);
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
        XHROptions.onload = res => resolve({ response: res, body: res.response });
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
  /**
   * 包装layer的prompt方法
   * @param obj 
   * @param func 
   * @returns index
   */
  function myprompt(obj, func) {
    if (SP_CONFIG.darkMode) {
      if (obj.title) obj.title = '<span style="color:#a2a7ae;">' + obj.title + '</span>'
    }
    let index = layer.prompt(obj, func);
    if (SP_CONFIG.darkMode) {
      layer.style(index, {
        'background-color': '#1c1c1c'
      });
    }
    return index;
  }
  /**
   * 包装layer的msg方法
   * @param  msg 
   * @param  obj 
   * @returns index
   */
  function mymsg(msg, obj) {
    let index = layer.msg(msg, obj);
    if (SP_CONFIG.darkMode) {
      layer.style(index, {
        'background-color': '#1c1c1c',
        'color': '#a2a7ae'
      });
    }
    return index;
  }
  /**
 * 包装layer的open方法
 * @param  obj 
 * @returns index
 */
  function myopen(obj) {
    if (SP_CONFIG.darkMode) {
      if (obj.title) obj.title = '<span style="color:#a2a7ae;">' + obj.title + '</span>'
    }
    let index = layer.open(obj);
    if (SP_CONFIG.darkMode) {
      layer.style(index, {
        'background-color': '#1c1c1c',
        'color': '#a2a7ae'
      });
    }
    return index;
  }
  /**
   * 包装layer的confirm方法
   * @param msg 
   * @param obj 
   * @param func 
   * @returns index
   */
  function myconfirm(msg, obj, ...func) {
    if (SP_CONFIG.darkMode) {
      if (obj.title) obj.title = '<span style="color:#a2a7ae;">' + obj.title + '</span>'
    }
    let index = layer.confirm(msg, obj, ...func);
    if (SP_CONFIG.darkMode) {
      layer.style(index, {
        'background-color': '#1c1c1c',
        'color': '#a2a7ae'
      });
    }
    return index;
  }
  /**
   * 包装layer的tips方法
   * @param content 
   * @param element 
   * @param obj 
   */
  function mytips(content, element, obj = {}) {
    const contentCss = { "border-radius": "20px", "background-color": "#00c4f8" },
      tipsGTCss = { "border-right-color": "#00c4f8" };
    function _successFn(dom, index) {
      const layerContent = dom.children('.layui-layer-content'),
        layerTipsGT = layerContent.children('.layui-layer-TipsG.layui-layer-TipsT');
      layerContent.css(contentCss);
      layerTipsGT.css(tipsGTCss);
    }
    if (!obj.success) obj.success = _successFn;
    else obj.success = function () { obj.success(); _successFn() };
    layer.tips(content, element, obj);
  }
})();
