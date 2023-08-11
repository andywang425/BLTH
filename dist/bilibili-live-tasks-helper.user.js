// ==UserScript==
// @name            Bilibili Live Tasks Helper
// @name:en         Bilibili Live Tasks Helper
// @name:zh         Bilibili Live Tasks Helper
// @namespace       https://github.com/andywang425
// @version         7.0.7
// @author          andywang425
// @description     Enhancing the experience of watching Bilibili live streaming.
// @description:en  Enhancing the experience of watching Bilibili live streaming.
// @description:zh  Enhancing the experience of watching Bilibili live streaming.
// @license         MIT
// @copyright       2023, andywang425 (https://github.com/andywang425)
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDEuMDY1IiBoZWlnaHQ9IjEyNy43NDciIHZpZXdCb3g9IjAgMCAzNy4zMjQgMzMuOCI+PHBhdGggZmlsbD0iIzIwYjBlMyIgZD0iTTg2Ljk2MiAxMTIuMzMyYTIuNjYxIDIuNjYxIDAgMCAxIDIuMjYyIDAgNS41MzYgNS41MzYgMCAwIDEgMS4zODQgMS4wMTFsNS4zMjMgNC42NThoMy44MDVsNS4zMjMtNC42NThhNS41ODkgNS41ODkgMCAwIDEgMS4zODQtMS4wMTEgMi42NjEgMi42NjEgMCAwIDEgMy41NCAyLjIwOSAyLjY2MSAyLjY2MSAwIDAgMS0uNTg2IDEuNzgzIDE0Ljg3NyAxNC44NzcgMCAwIDEtMS4xNzEgMS4wNjUgNy42OTEgNy42OTEgMCAwIDEtLjc0NS42MTJoMy4zMjZhNS42NDIgNS42NDIgMCAwIDEgMy45MTIgMS43NTYgNS42NjkgNS42NjkgMCAwIDEgMS43ODQgMy45MTJ2MTUuMzAzYTEwLjc3OCAxMC43NzggMCAwIDEtLjEzNCAyLjMxNSA1LjkwOCA1LjkwOCAwIDAgMS0yLjY2IDMuNzI2IDUuNzIyIDUuNzIyIDAgMCAxLTMuMDYxLjg1Mkg4Ni4yMTdhMTEuMjg0IDExLjI4NCAwIDAgMS0yLjM5Ni0uMTMzIDUuODgyIDUuODgyIDAgMCAxLTMuNjcyLTIuNjYyIDUuNjk1IDUuNjk1IDAgMCAxLS45MDUtMy4wNnYtMTUuMTQzYTExLjkyMyAxMS45MjMgMCAwIDEgMC0yLjIwOSA1Ljg1NSA1Ljg1NSAwIDAgMSA1LjMyMy00LjczN2gzLjQ4NmMtLjU1OS0uNC0xLjAzOC0uODc4LTEuNTQ0LTEuMzA0YTIuNjYxIDIuNjYxIDAgMCAxLS44NTEtMi4xODMgMi42NjEgMi42NjEgMCAwIDEgMS4zMDQtMi4xMDJtLS42MTIgMTAuMzI2YTIuNjYxIDIuNjYxIDAgMCAwLTIuMTAzIDEuOTE2IDMuNTkzIDMuNTkzIDAgMCAwIDAgMS4wMTF2MTIuNTg4YTIuNjYxIDIuNjYxIDAgMCAwIDEuODM3IDIuNjYyIDMuNTEzIDMuNTEzIDAgMCAwIDEuMTQ0LjE4NmgyMS42MzdhMi42NjEgMi42NjEgMCAwIDAgMi41MjgtMS41NyAzLjcyNiAzLjcyNiAwIDAgMCAuMjY2LTEuNzU3di0xMS43MWE0LjQ3MSA0LjQ3MSAwIDAgMCAwLTEuMjc3IDIuNjYxIDIuNjYxIDAgMCAwLTEuNzMtMS44MSA0LjI4NSA0LjI4NSAwIDAgMC0xLjY1LS4yMzlIODcuNjAxYTguODg5IDguODg5IDAgMCAwLTEuMjUxIDB6bTAgMCIgc3R5bGU9InN0cm9rZS13aWR0aDouMDMzMDcyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc5LjE5MyAtMTEyLjA4KSIvPjxwYXRoIGQ9Ik04OC45NyAxMjguNjM2Yy4zNjMuMzc3Ljc0NS43NDcgMS4wODggMS4xNDIuNTk3LjY4NyAxLjExOCAxLjE5NyAxLjY2NiAxLjgwOS0uMTI5LTEuMTE3IDEuMzA0LTEuMTk4LjA3NC0xLjc1Ny0uNDA4LjQxNy0uOTQxLjg4NC0xLjM2IDEuMjIzLS4zOTIuMzE2LS44NjMuNjctMS4yMzUuOTUyLTEuOTA3IDEuNDQzLjIyNiA0LjA1MyAyLjEzIDIuNjA3IDAgMCAyLTEuNTM1IDIuODA3LTIuMzAxLjQ0LS40MTcuNjgtLjk1Ni43Mi0xLjU5Mi4wNC0uNjU0LS41MzUtMS4yNC0uNzk0LTEuNDk4LS45Mi0uOTE0LTEuNzQzLTEuOTY4LTIuNTUtMi44MTItMS41NzUtMS44LTQuMTIuNDI4LTIuNTQ2IDIuMjI3ek0xMDYuOTc5IDEyOC42MzZjLS4zNjMuMzc3LS43NDUuNzQ3LTEuMDg4IDEuMTQyLS41OTcuNjg3LTEuMTE4IDEuMTk3LTEuNjY2IDEuODA5LjEyOS0xLjExNy0xLjMwNC0xLjE5OC0uMDc0LTEuNzU3LjQwOC40MTcuOTQxLjg4NCAxLjM2IDEuMjIzLjM5Mi4zMTYuODYzLjY3IDEuMjM1Ljk1MiAxLjkwNyAxLjQ0My0uMjI2IDQuMDUzLTIuMTMgMi42MDcgMCAwLTItMS41MzUtMi44MDctMi4zMDEtLjQ0LS40MTctLjY4LS45NTYtLjcyLTEuNTkyLS4wNC0uNjU0LjUzNS0xLjI0Ljc5NC0xLjQ5OC45Mi0uOTE0IDEuNzQzLTEuOTY4IDIuNTUtMi44MTIgMS41NzUtMS44IDQuMTIuNDI4IDIuNTQ2IDIuMjI3eiIgc3R5bGU9ImZpbGw6IzIwYjBlMztmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6LjUyNDE1OTtzdHJva2UtZGFzaGFycmF5Om5vbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03OS4xOTMgLTExMi4wOCkiLz48L3N2Zz4NCg==
// @homepageURL     https://github.com/andywang425/BLTH
// @supportURL      https://github.com/andywang425/BLTH/issues
// @downloadURL     https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.min.user.js
// @updateURL       https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.min.user.js
// @include         /^https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*$/
// @require         https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js
// @require         data:application/javascript,window.Vue%3DVue%2Cwindow.VueDemi%3DVue%3B
// @require         https://unpkg.com/element-plus@2.3.9/dist/index.full.min.js
// @require         https://unpkg.com/@element-plus/icons-vue@2.1.0/dist/index.iife.min.js
// @require         https://unpkg.com/pinia@2.1.6/dist/pinia.iife.prod.js
// @require         https://unpkg.com/lodash@4.17.21/lodash.min.js
// @require         https://unpkg.com/hotkeys-js@3.12.0/dist/hotkeys.min.js
// @require         https://unpkg.com/luxon@3.4.0/build/global/luxon.min.js
// @require         https://unpkg.com/crypto-js@4.1.1/crypto-js.js
// @resource        element-plus/dist/index.css  https://unpkg.com/element-plus@2.3.9/dist/index.css
// @connect         api.bilibili.com
// @connect         api.live.bilibili.com
// @connect         api.vc.bilibili.com
// @connect         passport.bilibili.com
// @connect         live.bilibili.com
// @connect         live-trace.bilibili.com
// @grant           GM_getResourceText
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @run-at          document-end
// ==/UserScript==

(a=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=a,document.head.append(e)})(" .title[data-v-dda95e10]{padding-left:20px;align-items:center;display:flex}.header-big-text[data-v-dda95e10]{font-size:var(--big-text-size)}.header-small-text[data-v-dda95e10]{font-size:var(--small-text-size);padding-top:calc(var(--big-text-size) - var(--small-text-size));margin-left:10px;--small-text-size: 18px}.collapse-btn[data-v-dda95e10]{display:flex;justify-content:center;align-items:center;height:100%;float:left;cursor:pointer}.avatar-wrap[data-v-f7944e85]{width:80px;height:80px}.avatar[data-v-f7944e85]{display:flex;justify-content:center;align-items:center;border-radius:50%}.base[data-v-4aed17ff]{z-index:1003;position:absolute;background-color:#fff;border-bottom:1px solid #e3e5e7;border-left:1px solid #e3e5e7;border-right:1px solid #e3e5e7}.header[data-v-4aed17ff]{position:relative;box-sizing:border-box;width:100%;font-size:var(--big-text-size);align-items:center;display:flex;border-bottom:1px solid #e3e5e7;height:60px;--big-text-size: 25px}.aside[data-v-4aed17ff]{width:auto}.aside #aside-el-menu[data-v-4aed17ff]:not(.el-menu--collapse){width:150px}.main[data-v-4aed17ff]{--main-top-botton-padding: calc(var(--el-main-padding) * .625);padding-top:var(--main-top-botton-padding);padding-bottom:var(--main-top-botton-padding)}.fade-enter-active[data-v-4aed17ff],.fade-leave-active[data-v-4aed17ff]{transition:opacity .1s ease}.fade-enter-from[data-v-4aed17ff],.fade-leave-to[data-v-4aed17ff]{opacity:0}.info-icon[data-v-c1d8df5e]{font-size:var(--el-font-size-base);cursor:pointer}.status-icon[data-v-2f9d6050]{font-size:var(--el-font-size-base)}.blth_btn{background-color:#23ade5;font-size:small;margin-inline-start:5px;color:#fff;border-radius:4px;border:none;padding:5px;cursor:pointer;box-shadow:0 0 2px #00000075;line-height:10px;margin-left:15px}.blth_btn:hover{background-color:#1097cc}.blth_btn:hover:active{background-color:#0e86b6;position:relative;top:1px}.el-link-va-baseline{vertical-align:baseline} ");

(function (vue, pinia, _, luxon, CryptoJS, ElementPlusIconsVue, ElementPlus, hotkeys) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const ElementPlusIconsVue__namespace = /*#__PURE__*/_interopNamespaceDefault(ElementPlusIconsVue);

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const defaultValues = {
    ui: {
      isCollapse: false,
      isShowPanel: true,
      activeMenuIndex: "MainSiteTasks"
    },
    modules: {
      DailyTasks: {
        MainSiteTasks: {
          login: {
            enabled: false,
            _lastCompleteTime: 0
          },
          watch: {
            enabled: false,
            _lastCompleteTime: 0
          },
          coin: {
            enabled: false,
            num: 1,
            _lastCompleteTime: 0
          },
          share: {
            enabled: false,
            _lastCompleteTime: 0
          }
        },
        LiveTasks: {
          sign: {
            enabled: false,
            _lastCompleteTime: 0
          },
          appUser: {
            enabled: false,
            _lastCompleteTime: 0
          },
          medalTasks: {
            danmu: {
              enabled: false,
              list: [
                "(⌒▽⌒)",
                "（￣▽￣）",
                "(=・ω・=)",
                "(｀・ω・´)",
                "(〜￣△￣)〜",
                "(･∀･)",
                "(°∀°)ﾉ",
                "╮(￣▽￣)╭",
                "_(:3」∠)_",
                "(^・ω・^ )",
                "(●￣(ｴ)￣●)",
                "ε=ε=(ノ≧∇≦)ノ",
                "⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄",
                "←◡←",
                `(●'◡'●)ﾉ♥`
              ],
              _lastCompleteTime: 0
            },
            like: {
              enabled: false,
              includeHighLevelMedals: false,
              _lastCompleteTime: 0
            },
            watch: {
              enabled: false,
              time: 70,
              _watchedSecondsToday: 0,
              _lastWatchTime: 0,
              _lastCompleteTime: 0
            },
            isWhiteList: false,
            roomidList: []
          }
        },
        OtherTasks: {
          groupSign: {
            enabled: false,
            _lastCompleteTime: 0
          },
          silverToCoin: {
            enabled: false,
            _lastCompleteTime: 0
          },
          coinToSilver: {
            enabled: false,
            num: 1,
            _lastCompleteTime: 0
          },
          getYearVipPrivilege: {
            enabled: false,
            _nextReceiveTime: 0
          }
        }
      },
      EnhanceExperience: {
        switchLiveStreamQuality: {
          enabled: false,
          qualityDesc: "原画"
        },
        banp2p: {
          enabled: false
        }
      }
    },
    cache: {
      lastAliveHeartBeatTime: 0
    }
  };
  class Storage {
    /**
     * 递归合并配置项。删除当前配置中不存在于默认配置的键，补上相对于默认配置缺少的键值，其它键值不变。
     *
     * 该方法会修改当前配置。
     *
     * @param current_config_item 当前配置
     * @param default_config_item 默认配置
     * @returns 修改后的当前配置
     * @example
     *
     * const current_config = { enabled: true, details: { type: 'efg', status: 'ok' }, msg: 'hi' };
     * const default_config = { enabled: false, details: { type: 'abc', num = 1 } };
     *
     * mergeConfig(current_config, default_config);
     * // => { enabled: true, details: { type: 'efg', num = 1 } }
     */
    static mergeConfigs(current_config_item, default_config_item) {
      const keysOnlyInCurrentConfigItem = _.difference(
        _.keys(current_config_item),
        _.keys(default_config_item)
      );
      current_config_item = _.omit(current_config_item, keysOnlyInCurrentConfigItem);
      const keysOnlyInDefaultItem = _.difference(
        _.keys(default_config_item),
        _.keys(current_config_item)
      );
      _.assign(current_config_item, _.pick(default_config_item, keysOnlyInDefaultItem));
      for (const [key, value] of Object.entries(current_config_item).filter(
        (keyValue) => !keysOnlyInDefaultItem.includes(keyValue[0])
      )) {
        if (_.isPlainObject(value)) {
          current_config_item[key] = this.mergeConfigs(value, default_config_item[key]);
        }
      }
      return current_config_item;
    }
    static setUiConfig(uiConfig) {
      _GM_setValue("ui", uiConfig);
    }
    static getUiConfig() {
      return this.mergeConfigs(_GM_getValue("ui", {}), defaultValues.ui);
    }
    static setModuleConfig(moduleConfig) {
      _GM_setValue("modules", moduleConfig);
    }
    static getModuleConfig() {
      return this.mergeConfigs(_GM_getValue("modules", {}), defaultValues.modules);
    }
    static setCache(cache) {
      _GM_setValue("cache", cache);
    }
    static getCache() {
      return this.mergeConfigs(_GM_getValue("cache", {}), defaultValues.cache);
    }
  }
  const useUIStore = pinia.defineStore("ui", () => {
    const uiConfig = vue.reactive(Storage.getUiConfig());
    const activeMenuName = vue.computed(() => {
      const index2name = {
        MainSiteTasks: "主站任务",
        LiveTasks: "直播任务",
        OtherTasks: "其它任务"
      };
      return index2name[uiConfig.activeMenuIndex];
    });
    const baseStyleValue = vue.reactive({
      top: 0,
      left: 0,
      height: 0,
      width: 0
    });
    const baseStyle = vue.computed(() => ({
      top: baseStyleValue.top.toString() + "px",
      left: baseStyleValue.left.toString() + "px",
      height: baseStyleValue.height.toString() + "px",
      width: baseStyleValue.width.toString() + "px"
    }));
    const isShowPanelButtonText = vue.computed(() => {
      if (uiConfig.isShowPanel) {
        return "隐藏控制面板";
      } else {
        return "显示控制面板";
      }
    });
    const scrollBarHeight = vue.computed(() => (baseStyleValue.height - 60).toString() + "px");
    function changeCollapse() {
      uiConfig.isCollapse = !uiConfig.isCollapse;
    }
    function changeShowPanel() {
      uiConfig.isShowPanel = !uiConfig.isShowPanel;
    }
    function setActiveMenuIndex(index) {
      uiConfig.activeMenuIndex = index;
    }
    vue.watch(
      uiConfig,
      _.debounce((newUiConfig) => Storage.setUiConfig(newUiConfig), 350)
    );
    return {
      isShowPanelButtonText,
      activeMenuName,
      baseStyleValue,
      baseStyle,
      scrollBarHeight,
      uiConfig,
      changeCollapse,
      changeShowPanel,
      setActiveMenuIndex
    };
  });
  const useBiliStore = pinia.defineStore("bili", () => {
    const BilibiliLive = vue.ref();
    const cookies = vue.ref();
    const userInfo = vue.ref();
    const giftConfig = vue.ref();
    const dailyRewardInfo = vue.ref();
    const dynamicVideos = vue.ref();
    const fansMedals = vue.ref();
    const filteredFansMedals = vue.computed(() => {
      if (!fansMedals.value)
        return null;
      return fansMedals.value.filter((m) => m.room_info.room_id !== 0);
    });
    return {
      BilibiliLive,
      userInfo,
      giftConfig,
      cookies,
      dailyRewardInfo,
      dynamicVideos,
      fansMedals,
      filteredFansMedals
    };
  });
  class Request {
    constructor(url_prefix, orgin) {
      /** 请求 URL 的前缀 */
      __publicField(this, "url_prefix");
      /**
       * 请求 Header 中 Origin 的值，为了方便同时也是 Referer 的值
       */
      __publicField(this, "origin");
      this.url_prefix = url_prefix ?? "";
      this.origin = orgin ?? "https://bilibili.com";
    }
    /**
     * 发起一个 GET 请求
     * @param url 请求 URL 除去前缀的部分
     * @param params URL 参数
     * @param otherDetails GM_xmlhttpRequest 的 details 参数
     * @returns Promise
     */
    get(url, params, otherDetails) {
      return new Promise((resolve, reject) => {
        const defaultDetails = {
          method: "GET",
          url: this.url_prefix + url + (params ? "?" + new URLSearchParams(params).toString() : ""),
          responseType: "json",
          headers: {
            Accept: "application/json, text/plain, */*",
            Referer: this.origin,
            Origin: this.origin,
            "Sec-Fetch-Site": "same-site"
          },
          onload: function(response) {
            resolve(response.response);
          },
          onerror: function(err) {
            reject(err);
          }
        };
        const details = _.defaultsDeep(otherDetails, defaultDetails);
        _GM_xmlhttpRequest(details);
      });
    }
    /**
     * 发起一个 POST 请求
     * @param url 请求 URL 除去前缀的部分
     * @param data application/x-www-form-urlencoded 其它类型的数据需要在 otherDetails 中定义
     * @param otherDetails GM_xmlhttpRequest 的 details 参数
     * @returns Promise
     */
    post(url, data, otherDetails) {
      return new Promise((resolve, reject) => {
        const defaultDetails = {
          method: "POST",
          url: this.url_prefix.concat(url),
          data: new URLSearchParams(data).toString(),
          responseType: "json",
          headers: {
            Accept: "application/json, text/plain, */*",
            Referer: this.origin,
            Origin: this.origin,
            "Sec-Fetch-Site": "same-site",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          onload: function(response) {
            resolve(response.response);
          },
          onerror: function(err) {
            reject(err);
          }
        };
        const details = _.defaultsDeep(otherDetails, defaultDetails);
        if (details.headers["Content-Type"] === "multipart/form-data") {
          delete details.headers["Content-Type"];
        }
        _GM_xmlhttpRequest(details);
      });
    }
  }
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(char) {
      const randomInt = 16 * Math.random() | 0;
      return ("x" === char ? randomInt : 3 & randomInt | 8).toString(16);
    });
  }
  function sleep(miliseconds) {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
  }
  function wait(type, timeout = -1) {
    return new Promise((resolve) => {
      useModuleStore().emitter.on(type, (event) => resolve(event));
      if (timeout !== -1)
        setTimeout(resolve, timeout);
    });
  }
  function packFormData(json) {
    const formData = new FormData();
    _.forEach(json, (value, key) => formData.append(key, value.toString()));
    return formData;
  }
  function deepestIterate(obj, fn, path) {
    _.forOwn(obj, function(value, key) {
      const newPath = path ? path + "." + key : key;
      if (_.isPlainObject(value) && !_.isEmpty(value)) {
        deepestIterate(value, fn, newPath);
      } else {
        fn(value, newPath);
      }
    });
  }
  luxon.Settings.defaultZone = "Asia/Shanghai";
  function isTimestampToday(timestamp, hour = 0, minute = 5) {
    const time = luxon.DateTime.fromMillis(timestamp);
    const startOfADay = luxon.DateTime.now().set({
      hour,
      minute,
      second: 0,
      millisecond: 0
    });
    const startOfTomorrow = startOfADay.plus({ days: 1 });
    const startOfYesterday = startOfADay.minus({ days: 1 });
    if (luxon.DateTime.now() >= startOfADay) {
      return time >= startOfADay && time < startOfTomorrow;
    } else {
      return time >= startOfYesterday && time < startOfADay;
    }
  }
  function delayToNextMoment(hour = 0, minute = 5) {
    const now = luxon.DateTime.now();
    let nextTime = luxon.DateTime.local(now.year, now.month, now.day, hour, minute);
    if (now > nextTime) {
      nextTime = nextTime.plus({ days: 1 });
    }
    const diff = nextTime.diff(now);
    return {
      // 时间戳
      ms: diff.toMillis(),
      // 便于阅读的字符串，去掉开头的0小时和0分钟
      str: diff.toFormat("h小时m分钟s秒").replace(/^0小时/, "").replace(/^0分钟/, "")
    };
  }
  function isNowIn(startHour, startMinute, endHour, endMinute) {
    const now = luxon.DateTime.now();
    const start = luxon.DateTime.local(now.year, now.month, now.day, startHour, startMinute);
    const end = luxon.DateTime.local(now.year, now.month, now.day, endHour, endMinute);
    return now >= start && now < end;
  }
  function ts() {
    return Math.round(luxon.DateTime.now().toSeconds());
  }
  function tsm() {
    return luxon.DateTime.now().toMillis();
  }
  const request = {
    live: new Request("https://api.live.bilibili.com", "https://live.bilibili.com"),
    liveTrace: new Request("https://live-trace.bilibili.com", "https://live.bilibili.com"),
    passport: new Request("https://passport.bilibili.com", "https://passport.bilibili.com/"),
    main: new Request("https://api.bilibili.com", "https://www.bilibili.com"),
    vc: new Request("https://api.vc.bilibili.com", "https://message.bilibili.com/"),
    raw: new Request()
  };
  const BAPI = {
    live: {
      roomGiftConfig: (room_id = 0, area_parent_id = 0, area_id = 0, platform = "pc") => {
        return request.live.get("/xlive/web-room/v1/giftPanel/roomGiftConfig", {
          platform,
          room_id,
          area_parent_id,
          area_id
        });
      },
      doSign: () => {
        return request.live.get("/xlive/web-ucenter/v1/sign/DoSign");
      },
      getSignInfo: () => {
        return request.live.get("/xlive/web-ucenter/v1/sign/WebGetSignInfo");
      },
      fansMedalPanel: (page, page_size = 10) => {
        return request.live.get(
          "/xlive/app-ucenter/v1/fansMedal/panel",
          {
            page,
            page_size
          },
          {
            Origin: "https://link.bilibili.com",
            Referer: "https://link.bilibili.com/p/center/index"
          }
        );
      },
      sendMsg: (msg, roomid, room_type = 0, mode = 1, jumpfrom = 0, fontsize = 25, color = 16777215, bubble = 0) => {
        const biliStore = useBiliStore();
        const bili_jct = biliStore.cookies.bili_jct;
        return request.live.post("/msg/send", void 0, {
          data: packFormData({
            roomid,
            room_type,
            rnd: ts(),
            msg,
            mode,
            jumpfrom,
            fontsize,
            csrf: bili_jct,
            csrf_token: bili_jct,
            color,
            bubble
          }),
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      },
      likeReport: (room_id, anchor_id) => {
        const biliStore = useBiliStore();
        const bili_jct = biliStore.cookies.bili_jct;
        return request.live.post("/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3", {
          room_id,
          anchor_id,
          uid: anchor_id,
          ts: ts(),
          csrf: bili_jct
        });
      },
      /**
       * 该API只在带有多层iframe（背景很好看）的直播间中被使用，但参数填任意直播间均可
       */
      getInfoByRoom: (room_id) => {
        return request.live.get("/xlive/web-room/v1/index/getInfoByRoom", {
          room_id
        });
      },
      getUserTaskProgress: (target_id = 11153765) => {
        const biliStore = useBiliStore();
        const bili_jct = biliStore.cookies.bili_jct;
        return request.live.get("/xlive/app-ucenter/v1/userTask/GetUserTaskProgress", {
          target_id,
          csrf: bili_jct,
          ts: ts()
        });
      },
      userTaskReceiveRewards: (target_id = 11153765) => {
        const biliStore = useBiliStore();
        const bili_jct = biliStore.cookies.bili_jct;
        return request.live.post("/xlive/app-ucenter/v1/userTask/UserTaskReceiveRewards", {
          actionKey: "csrf",
          target_id,
          csrf: bili_jct,
          ts: ts()
        });
      },
      silver2coin: (visit_id = "") => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.live.post("/xlive/revenue/v1/wallet/silver2coin", {
          csrf: bili_jct,
          csrf_token: bili_jct,
          visit_id
        });
      },
      coin2silver: (num, platform = "pc", visit_id = "") => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.live.post("/xlive/revenue/v1/wallet/coin2silver", {
          num,
          csrf: bili_jct,
          csrf_token: bili_jct,
          platform,
          visit_id
        });
      }
    },
    liveTrace: {
      E: (id, device, ruid, is_patch = 0, heart_beat = [], visit_id = "") => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.liveTrace.post("/xlive/data-interface/v1/x25Kn/E", {
          id: JSON.stringify(id),
          device: JSON.stringify(device),
          ruid,
          // 主播 uid
          ts: tsm(),
          is_patch,
          heart_beat: JSON.stringify(heart_beat),
          ua: navigator.userAgent,
          csrf_token: bili_jct,
          csrf: bili_jct,
          visit_id
        });
      },
      X: (s, id, device, ruid, ets, benchmark, time, ts2, visit_id = "") => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.liveTrace.post("/xlive/data-interface/v1/x25Kn/X", {
          s,
          id: JSON.stringify(id),
          device: JSON.stringify(device),
          ruid,
          // 主播 uid
          ets,
          benchmark,
          time,
          ts: ts2,
          ua: navigator.userAgent,
          csrf_token: bili_jct,
          csrf: bili_jct,
          visit_id
        });
      }
    },
    main: {
      nav: () => {
        return request.main.get("/x/web-interface/nav");
      },
      reward: () => {
        return request.main.get("/x/member/web/exp/reward");
      },
      dynamicAll: (type, page = 1, timezone_offset = -480, features = "itemOpusStyle") => {
        return request.main.get("/x/polymer/web-dynamic/v1/feed/all", {
          timezone_offset,
          type,
          page,
          features
        });
      },
      videoHeartbeat: (aid, cid = "", realtime = 0, played_time = 0, real_played_time = 0, refer_url = "https://t.bilibili.com/?spm_id_from=444.3.0.0", quality = 116, video_duration = 100, type = 3, sub_type = 0, play_type = 0, dt = 2, last_play_progress_time = 0, max_play_progress_time = 0, spmid = "333.488.0.0", from_spmid = "333.31.list.card_archive.click", extra = '{"player_version":"4.1.21-rc.1727.0"}') => {
        const biliStore = useBiliStore();
        return request.main.post("/x/click-interface/web/heartbeat", {
          start_ts: ts(),
          mid: useBiliStore().BilibiliLive.UID,
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
          spmid,
          from_spmid,
          extra,
          csrf: biliStore.cookies.bili_jct
        });
      },
      share: (aid, source = "pc_client_normal", eab_x = 2, ramval = 0, ga = 1) => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.main.post("/x/web-interface/share/add", {
          aid,
          eab_x,
          ramval,
          source,
          ga,
          csrf: bili_jct
        });
      },
      coinAdd: (aid, num, select_like = 0, cross_domain = true, eab_x = 2, ramval = 6, source = "web_normal", ga = 1) => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.main.post("/x/web-interface/coin/add ", {
          aid,
          multiply: num,
          select_like,
          cross_domain,
          eab_x,
          ramval,
          source,
          ga,
          csrf: bili_jct
        });
      },
      videoRelation: (aid, bvid = "") => {
        return request.main.get("/x/web-interface/archive/relation", {
          aid,
          bvid
        });
      },
      vip: {
        myPrivilege: () => {
          const bili_jct = useBiliStore().cookies.bili_jct;
          return request.main.get(
            "/x/vip/privilege/my",
            {
              csrf: bili_jct
            },
            {
              headers: {
                Referer: "https://account.bilibili.com/account/big/myPackage",
                Origin: "https://account.bilibili.com/account/big/myPackage"
              }
            }
          );
        },
        receivePrivilege: (type, platform = "web") => {
          const bili_jct = useBiliStore().cookies.bili_jct;
          return request.main.post(
            "/x/vip/privilege/receive",
            {
              type,
              platform,
              csrf: bili_jct
            },
            {
              headers: {
                Referer: "https://account.bilibili.com/account/big/myPackage",
                Origin: "https://account.bilibili.com/account/big/myPackage"
              }
            }
          );
        }
      }
    },
    vc: {
      myGroups: (build = 0, mobi_app = "web") => {
        return request.vc.get("/link_group/v1/member/my_groups", {
          build,
          mobi_app
        });
      },
      signIn: (group_id, owner_id) => {
        return request.vc.get("/link_setting/v1/link_setting/sign_in", {
          group_id,
          owner_id
        });
      }
    }
  };
  class Logger {
    constructor(title) {
      __publicField(this, "NAME", "BLTH");
      __publicField(this, "prefix_title_str");
      __publicField(this, "_title");
      this._title = title;
      this.prefix_title_str = title.split("_").join("][");
    }
    get prefix() {
      return [
        `%c${this.NAME}%c[${( new Date()).toLocaleString()}]%c[${this.prefix_title_str}]%c:`,
        "font-weight: bold; color: white; background-color: #23ade5; padding: 1px 4px; border-radius: 4px;",
        "font-weight: bold; color: #0920e6;",
        "font-weight: bold;",
        ""
      ];
    }
    log(...data) {
      console.log(...this.prefix, ...data);
    }
    error(...data) {
      console.error(...this.prefix, ...data);
    }
    warn(...data) {
      console.warn(...this.prefix, ...data);
    }
  }
  class BaseModule {
    constructor(moduleName) {
      /**
       * 模块名称，在被导出时定义
       *
       * 输出控制台日志时会用到
       */
      __publicField(this, "moduleName");
      /**
       * 用于在控制台中输出日志信息
       */
      __publicField(this, "logger");
      /**
       * 储存所有模块信息的 Pinia Store
       */
      __publicField(this, "moduleStore", useModuleStore());
      /**
       * 推荐添加一个 config 属性来表示当前模块的配置项
       *
       * @example this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login
       */
      __publicField(this, "config");
      this.moduleName = moduleName;
      this.logger = new Logger(this.moduleName);
    }
    /**
     * 如果需要在控制面板上显示模块状态，推荐添加一个 status setter 用来设置模块状态
     *
     * @example
     * public set status(s: Istatus) {
     *    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s
     * }
     */
    set status(_s) {
      throw new Error("Method not implemented.");
    }
    run() {
      throw new Error("Method not implemented.");
    }
  }
  /**
   * 当脚本在多个页面上运行的时候，该模块是否要在每个页面上运行
   *
   * 默认false，即只在Main BLTH运行的页面上运行
   */
  __publicField(BaseModule, "runMultiple", false);
  class DefaultBaseModule extends BaseModule {
    /**
     * 默认模块按顺序逐个运行，所以必须返回一个 Promise
     */
    run() {
      throw new Error("Method not implemented.");
    }
  }
  /**
   * 优先级，数字越小优先级越高
   */
  __publicField(DefaultBaseModule, "sequence");
  function getCookie(name) {
    const nameEqual = name + "=";
    for (const cookie of document.cookie.split("; ")) {
      if (cookie.startsWith(nameEqual)) {
        const value = cookie.substring(nameEqual.length);
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  function getCookies(names) {
    const cookies = {};
    for (const name of names) {
      cookies[name] = null;
    }
    for (const cookie of document.cookie.split("; ")) {
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const nameEqual = name + "=";
        if (cookie.startsWith(nameEqual)) {
          const value = cookie.substring(nameEqual.length);
          cookies[name] = decodeURIComponent(value);
          names.splice(i, 1);
          break;
        }
      }
      if (names.length === 0)
        break;
    }
    return cookies;
  }
  class BiliInfo extends DefaultBaseModule {
    getBilibiliLive() {
      this.logger.log("unsafeWindow.BilibiliLive", _unsafeWindow.BilibiliLive);
      return _unsafeWindow.BilibiliLive;
    }
    /**
     * 获取 Cookies
     *
     * bili_jct: 常作为参数 csrf 在请求中出现
     * LIVE_BUVID 不能在此处获取，还没生成
     */
    getCookies() {
      return getCookies(["bili_jct"]);
    }
    /**
     * 通过 BAPI.main.nav 获取用户基本信息
     */
    async getUserInfo() {
      try {
        const response = await BAPI.main.nav();
        this.logger.log("BAPI.main.nav response", response);
        if (response.code === 0) {
          return Promise.resolve(response.data);
        } else {
          this.logger.error("获取用户信息失败", response.message);
          return Promise.reject(response.message);
        }
      } catch (error) {
        this.logger.error("获取用户信息出错", error);
        return Promise.reject(error);
      }
    }
    /**
     * 获取礼物配置信息
     *
     * 如礼物id，名称，亲密度等等
     */
    async getGiftConfig() {
      try {
        throw new Error("送礼功能尚未完成，暂时不需要获取礼物配置信息，请忽略本报错 ＞︿＜");
        const response = await BAPI.live.roomGiftConfig();
        this.logger.log("BAPI.live.roomGiftConfig response", response);
        if (response.code === 0) {
          return Promise.resolve(response.data);
        } else {
          this.logger.error("获取礼物配置信息失败", response.message);
          return Promise.reject(response.message);
        }
      } catch (error) {
        this.logger.error("获取礼物配置信息出错", error);
        return Promise.reject(error);
      }
    }
    /**
     * 获取今日主站每日任务的完成情况
     */
    async getDailyRewardInfo() {
      const MainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks;
      if (Object.values(MainSiteTasks).some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime))) {
        try {
          const response = await BAPI.main.reward();
          this.logger.log("BAPI.main.reward response", response);
          if (response.code === 0) {
            return Promise.resolve(response.data);
          } else {
            this.logger.error("获取主站每日任务完成情况失败", response.message);
            return Promise.reject(response.message);
          }
        } catch (error) {
          this.logger.error("获取主站每日任务完成情况出错", error);
          return Promise.reject(error);
        }
      } else {
        return Promise.reject();
      }
    }
    /**
     * 从动态中获取一页视频的信息
     *
     * 每日观看视频，每日分享视频，每日投币都会用到
     */
    async getDynamicVideo() {
      const MainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks;
      if (Object.entries(MainSiteTasks).filter(([key]) => ["watch", "share", "coin"].includes(key)).some((keyValue) => keyValue[1].enabled && !isTimestampToday(keyValue[1]._lastCompleteTime))) {
        try {
          const response = await BAPI.main.dynamicAll("video");
          this.logger.log("BAPI.main.dynamicAll response", response);
          if (response.code === 0) {
            return Promise.resolve(response.data.items);
          } else {
            this.logger.error("获取主站每日任务完成情况失败", response.message);
            return Promise.reject(response.message);
          }
        } catch (error) {
          this.logger.error("获取主站每日任务完成情况出错", error);
          return Promise.reject(error);
        }
      } else {
        return Promise.reject();
      }
    }
    /**
     * 获取粉丝勋章
     *
     * @param pages 获取的页数
     * @param force 是否无视配置强制获取，默认fasle
     */
    async getFansMetals(pages = 10, force = false) {
      const medalTasks = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks;
      if (force || Object.entries(medalTasks).filter(([key]) => ["danmu", "like", "watch"].includes(key)).some(
        (keyValue) => keyValue[1].enabled && !isTimestampToday(keyValue[1]._lastCompleteTime)
      )) {
        const fansMetalList = [];
        let total_page = 1;
        try {
          const firstPageResponse = await BAPI.live.fansMedalPanel(1);
          this.logger.log("BAPI.live.fansMedalPanel(1) response", firstPageResponse);
          if (firstPageResponse.code === 0) {
            total_page = firstPageResponse.data.page_info.total_page;
            fansMetalList.push(...firstPageResponse.data.special_list, ...firstPageResponse.data.list);
          } else {
            this.logger.error("获取粉丝勋章列表第1页失败", firstPageResponse.message);
            return Promise.reject(firstPageResponse.message);
          }
          for (let page = 2; page <= Math.min(total_page, pages); page++) {
            const response = await BAPI.live.fansMedalPanel(page);
            this.logger.log(`BAPI.live.fansMedalPanel(${page}) response`, response);
            if (firstPageResponse.code === 0) {
              fansMetalList.push(...response.data.list);
            } else {
              this.logger.error(`获取粉丝勋章列表第${page}页失败`, firstPageResponse.message);
              return fansMetalList;
            }
            await sleep(250);
          }
          return Promise.resolve(fansMetalList);
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        return Promise.reject();
      }
    }
    async run() {
      const biliStore = useBiliStore();
      biliStore.BilibiliLive = this.getBilibiliLive();
      biliStore.cookies = this.getCookies();
      biliStore.userInfo = await this.getUserInfo();
      setTimeout(async () => {
        biliStore.userInfo = await this.getUserInfo();
      }, delayToNextMoment(0, 4).ms);
      const allPromiseResult = await Promise.allSettled([
        this.getGiftConfig(),
        this.getDailyRewardInfo(),
        this.getDynamicVideo(),
        this.getFansMetals()
      ]);
      this.logger.log("allPromiseResult", allPromiseResult);
      biliStore.giftConfig = allPromiseResult[0].status === "fulfilled" ? allPromiseResult[0].value : null;
      biliStore.dailyRewardInfo = allPromiseResult[1].status === "fulfilled" ? allPromiseResult[1].value : null;
      setTimeout(async () => {
        const biliStore2 = useBiliStore();
        if (biliStore2.dailyRewardInfo) {
          biliStore2.dailyRewardInfo.login = false;
          biliStore2.dailyRewardInfo.share = false;
          biliStore2.dailyRewardInfo.watch = false;
          biliStore2.dailyRewardInfo.coins = 0;
        }
        biliStore2.dailyRewardInfo = await this.getDailyRewardInfo();
      }, delayToNextMoment(0, 4).ms);
      biliStore.dynamicVideos = allPromiseResult[2].status === "fulfilled" ? allPromiseResult[2].value : null;
      setTimeout(async () => {
        biliStore.dynamicVideos = await this.getDynamicVideo();
      }, delayToNextMoment(0, 4).ms);
      biliStore.fansMedals = allPromiseResult[3].status === "fulfilled" ? allPromiseResult[3].value : null;
      setTimeout(async () => {
        biliStore.fansMedals = await this.getFansMetals();
      }, delayToNextMoment(0, 4).ms);
      useModuleStore().emitter.on(this.moduleName, async (event) => {
        if (event.target === "getFansMetals") {
          biliStore.fansMedals = await this.getFansMetals(10, true);
        }
      });
    }
  }
  __publicField(BiliInfo, "sequence", 0);
  const defaultModules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    BiliInfo
  }, Symbol.toStringTag, { value: "Module" }));
  class LoginTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s;
    }
    async login() {
      this.logger.log("每日登录任务已完成");
      this.config._lastCompleteTime = tsm();
      this.status = "done";
      return Promise.resolve();
    }
    async run() {
      this.logger.log("每日登录模块开始运行");
      if (this.config.enabled) {
        const biliStore = useBiliStore();
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          if (biliStore.dailyRewardInfo && !biliStore.dailyRewardInfo.login) {
            await this.login();
          } else {
            this.config._lastCompleteTime = tsm();
            this.status = "done";
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过每日登录任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的每日登录任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离每日登录模块下次运行时间:", diff.str);
    }
  }
  let WatchTask$1 = class WatchTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.watch);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.watch = s;
    }
    getAid() {
      const biliStore = useBiliStore();
      if (!_.isEmpty(biliStore.dynamicVideos)) {
        return biliStore.dynamicVideos[0].modules.module_dynamic.major.archive.aid;
      } else {
        return "2";
      }
    }
    async watch(aid) {
      try {
        const response = await BAPI.main.videoHeartbeat(aid);
        this.logger.log(`BAPI.main.videoHeartbeat(${aid}) response`, response);
        if (response.code === 0) {
          this.logger.log("每日观看视频任务已完成");
          this.config._lastCompleteTime = tsm();
          this.status = "done";
        } else {
          this.logger.error("发送观看视频心跳失败", response.message);
          this.status = "error";
        }
      } catch (err) {
        this.logger.error("执行每日观看视频任务出错", err);
        this.status = "error";
      }
    }
    async run() {
      this.logger.log("每日观看视频模块开始运行");
      if (this.config.enabled) {
        const biliStore = useBiliStore();
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          if (biliStore.dailyRewardInfo && !biliStore.dailyRewardInfo.watch) {
            const aid = this.getAid();
            await this.watch(aid);
          } else {
            this.config._lastCompleteTime = tsm();
            this.status = "done";
            this.logger.log("每日观看视频任务已完成");
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过每日观看视频任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的每日观看视频任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离每日观看视频模块下次运行时间:", diff.str);
    }
  };
  class ShareTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.share);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.share = s;
    }
    getAid() {
      const biliStore = useBiliStore();
      if (!_.isEmpty(biliStore.dynamicVideos)) {
        return biliStore.dynamicVideos[0].modules.module_dynamic.major.archive.aid;
      } else {
        return "2";
      }
    }
    async share(aid) {
      try {
        const response = await BAPI.main.share(aid);
        this.logger.log(`BAPI.main.share(${aid}) response`, response);
        if (response.code === 0 || response.code === 71e3) {
          this.logger.log("每日分享视频任务已完成");
          this.config._lastCompleteTime = tsm();
          this.status = "done";
        } else {
          this.logger.error("分享视频失败", response.message);
          this.status = "error";
        }
      } catch (err) {
        this.logger.error("执行每日分享视频任务出错", err);
        this.status = "error";
      }
    }
    async run() {
      this.logger.log("每日分享视频模块开始运行");
      if (this.config.enabled) {
        const biliStore = useBiliStore();
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          if (biliStore.dailyRewardInfo && !biliStore.dailyRewardInfo.share) {
            const aid = this.getAid();
            await this.share(aid);
          } else {
            this.config._lastCompleteTime = tsm();
            this.status = "done";
            this.logger.log("每日分享视频任务已完成");
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过每日分享任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的每日分享任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离每日分享视频模块下次运行时间:", diff.str);
    }
  }
  class CoinTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.coin);
      // 暂时先限制每个视频最多投一个币
      // 因为转载视频只能投一个币，原创视频能投两个币
      // 但是想查询视频是否为转载，我目前只知道一个 /x/web-interface/wbi/view
      // 通过其响应的copyright字段（1原创，2转载）来判断
      // 不过这个接口带有 wbi 签名，实现起来复杂
      // 所以干脆直接限制每个视频最多投一个币，反正视频数量足够
      __publicField(this, "MAX_COIN", 1);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.coin = s;
    }
    getDynamicVideoIds() {
      const biliStore = useBiliStore();
      if (!_.isEmpty(biliStore.dynamicVideos)) {
        return biliStore.dynamicVideos.map((item) => {
          const archive = item.modules.module_dynamic.major.archive;
          return {
            aid: archive.aid,
            bvid: archive.bvid
          };
        });
      } else {
        this.status = "error";
        return null;
      }
    }
    async getVideoCoinInfo(aid, bvid) {
      try {
        const response = await BAPI.main.videoRelation(aid, bvid);
        this.logger.log(`BAPI.main.videoRelation(${aid}, ${bvid}) response`, response);
        if (response.code === 0) {
          return response.data.coin;
        } else {
          this.logger.error(`获取视频投币信息失败 aid = ${aid} bvid = ${bvid}`, response.message);
          return 0;
        }
      } catch (error) {
        this.logger.error(`获取视频投币信息出错 aid = ${aid} bvid = ${bvid}`, error);
        return 0;
      }
    }
    async coinDynamicVideos(left_coin_num) {
      const ids = this.getDynamicVideoIds();
      if (ids) {
        for (const { aid, bvid } of ids) {
          const coined_num = await this.getVideoCoinInfo(aid, bvid);
          const allowed_coin_num = this.MAX_COIN - coined_num;
          if (allowed_coin_num > 0) {
            const coin_num = Math.min(allowed_coin_num, left_coin_num);
            const result = await this.coin(aid, coin_num);
            if (result === 0) {
              left_coin_num -= coin_num;
              if (left_coin_num === 0) {
                this.logger.log("每日投币任务已完成");
                this.config._lastCompleteTime = tsm();
                this.status = "done";
                break;
              }
            } else if (result === 1) {
              this.status = "error";
              break;
            }
          }
        }
      }
    }
    async coin(aid, num) {
      try {
        const response = await BAPI.main.coinAdd(aid, num);
        this.logger.log(`BAPI.main.coinAdd(${aid}) response`, response);
        if (response.code === 0) {
          this.logger.log(`投币成功 视频aid = ${aid} 投币数量num = ${num}`);
          return 0;
        } else if (response.code === -104) {
          this.logger.warn("硬币余额不足，每日投币任务终止");
          return 1;
        } else {
          this.logger.error(`投币失败 视频aid = ${aid} 投币数量num = ${num}`, response.message);
          return 2;
        }
      } catch (err) {
        this.logger.error(`投币出错 视频aid = ${aid} 投币数量num = ${num}`, err);
        return 3;
      }
    }
    async run() {
      this.logger.log("每日投币模块开始运行");
      if (this.config.enabled) {
        const biliStore = useBiliStore();
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          if (biliStore.dailyRewardInfo) {
            const total_coined_num = biliStore.dailyRewardInfo.coins / 10;
            if (total_coined_num < this.config.num) {
              const left_coin_num = this.config.num - total_coined_num;
              const biliStore2 = useBiliStore();
              const money = biliStore2.userInfo.money ?? 5;
              if (left_coin_num > money) {
                this.logger.log("硬币余额不足，不执行每日投币任务");
                this.status = "done";
              } else {
                await this.coinDynamicVideos(left_coin_num);
              }
            } else {
              this.config._lastCompleteTime = tsm();
              this.status = "done";
              this.logger.log("每日投币任务已完成");
            }
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过每日投币任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的每日投币任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离每日投币模块下次运行时间:", diff.str);
    }
  }
  const dq = document.querySelector.bind(document);
  document.querySelectorAll.bind(document);
  const dce = document.createElement.bind(document);
  const pollingQuery = (element, selectors, intervel, timeout) => {
    return new Promise((resolve, reject) => {
      const timerPolling = setInterval(() => {
        const ele = element.querySelector(selectors);
        if (ele) {
          clearTimeout(timerPolling);
          resolve(ele);
        }
      }, intervel);
      const timerTimeout = setTimeout(() => {
        clearTimeout(timerPolling);
        clearTimeout(timerTimeout);
        reject();
      }, timeout);
    });
  };
  const isTargetFrame = () => {
    if (_unsafeWindow.BilibiliLive) {
      return true;
    } else {
      return false;
    }
  };
  const isSelfTopFrame = () => _unsafeWindow.self === _unsafeWindow.top;
  const topFrameDocuemnt = () => {
    var _a;
    return (_a = _unsafeWindow.top) == null ? void 0 : _a.document;
  };
  class SignTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.LiveTasks.sign);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.LiveTasks.sign = s;
    }
    async getSignInfo() {
      try {
        const response = await BAPI.live.getSignInfo();
        this.logger.log("BAPI.live.getSignInfo response", response);
        if (response.code === 0) {
          return response.data;
        } else {
          this.logger.error("获取直播签到信息失败", response.message);
          return null;
        }
      } catch (error) {
        this.logger.error("获取直播签到信息出错", error);
        return null;
      }
    }
    async sign() {
      try {
        const response = await BAPI.live.doSign();
        this.logger.log(`BAPI.live.doSign response`, response);
        if (response.code === 0) {
          this.logger.log("直播签到成功，获得奖励：", response.data.text);
          this.config._lastCompleteTime = tsm();
          this.status = "done";
          this.logger.log("直播签到任务已完成");
          const checkinBtn = dq(".checkin-btn");
          if (checkinBtn) {
            checkinBtn.remove();
          }
        } else {
          this.logger.error("直播签到失败", response.message);
          this.status = "error";
        }
      } catch (err) {
        this.logger.error("执行直播签到任务出错", err);
        this.status = "error";
      }
    }
    async run() {
      this.logger.log("直播签到模块开始运行");
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          const signInfo = await this.getSignInfo();
          if (signInfo) {
            if (signInfo.status === 0) {
              await this.sign();
            } else {
              this.config._lastCompleteTime = tsm();
              this.status = "done";
            }
          } else {
            await this.sign();
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过直播签到任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的直播签到任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离直播签到模块下次运行时间:", diff.str);
    }
  }
  class AppUserTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.LiveTasks.appUser);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.LiveTasks.appUser = s;
    }
    async getUserTaskProgress() {
      try {
        const response = await BAPI.live.getUserTaskProgress();
        this.logger.log("BAPI.live.getUserTaskProgress response", response);
        if (response.code === 0) {
          return response.data;
        } else {
          this.logger.error("获取APP用户任务进度失败", response.message);
          this.status = "error";
          return null;
        }
      } catch (error) {
        this.logger.error("获取APP用户任务进度出错", error);
        this.status = "error";
        return null;
      }
    }
    async userTaskReceiveRewards() {
      try {
        const response = await BAPI.live.userTaskReceiveRewards();
        this.logger.log("BAPI.live.userTaskReceiveRewards response", response);
        if (response.code === 0) {
          return response.data;
        } else {
          this.logger.error("获取APP用户任务进度失败", response.message);
          this.status = "error";
          return null;
        }
      } catch (error) {
        this.logger.error("获取APP用户任务进度出错", error);
        this.status = "error";
        return null;
      }
    }
    async sendDanmu(danmu, roomid) {
      try {
        const response = await BAPI.live.sendMsg(danmu, roomid);
        this.logger.log(`BAPI.live.sendMsg(${danmu}, ${roomid})`, response);
        if (response.code === 0) {
          this.logger.log(`在直播间 ${roomid} 发送弹幕 ${danmu} 成功`);
        } else {
          this.logger.error(`在直播间 ${roomid} 发送弹幕 ${danmu} 失败`, response.message);
        }
      } catch (error) {
        this.logger.error(`在直播间 ${roomid} 发送弹幕 ${danmu} 出错`, error);
      }
    }
    async run() {
      this.logger.log("APP用户任务模块开始运行");
      this.logger.warn("APP用户任务暂时没有，该模块不运行");
      this.config.enabled = false;
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          const danmuConfig = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks.danmu;
          if (danmuConfig.enabled && !isTimestampToday(danmuConfig._lastCompleteTime)) {
            await wait(this.moduleName, 3e5);
          }
          const progressResponse = await this.getUserTaskProgress();
          if (progressResponse) {
            if (progressResponse.is_surplus !== -1) {
              if (progressResponse.day_task.status === 3) {
                this.config._lastCompleteTime = tsm();
                this.status = "done";
              } else if (progressResponse.day_task.status === 2) {
                const receiveResponse = await this.userTaskReceiveRewards();
                if (receiveResponse) {
                  const num = receiveResponse.num;
                  if (num) {
                    this.logger.log(`领取奖励成功：${num}个电池`);
                  } else {
                    this.logger.warn(`领取奖励失败：未领取到电池`);
                  }
                  this.config._lastCompleteTime = tsm();
                  this.status = "done";
                }
              } else {
                let remainProgress = progressResponse.day_task.target - progressResponse.day_task.progress;
                while (remainProgress > 0) {
                  await this.sendDanmu(`打卡${remainProgress}`, 22474988);
                  await sleep(2e3);
                  remainProgress--;
                }
                const receiveResponse = await this.userTaskReceiveRewards();
                if (receiveResponse) {
                  const num = receiveResponse.num;
                  if (num) {
                    this.logger.log(`领取奖励成功：${num}个电池`);
                  } else {
                    this.logger.warn(`领取奖励失败：未领取到电池`);
                  }
                  this.config._lastCompleteTime = tsm();
                  this.status = "done";
                }
              }
            } else {
              this.logger.log("今天APP用户任务的奖励已经没有了，明天早点来吧");
              this.config._lastCompleteTime = tsm();
              this.status = "done";
            }
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过APP用户任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的APP用户任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离APP用户任务模块下次运行时间:", diff.str);
    }
  }
  class LikeTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "medalTasksConfig", this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks);
      __publicField(this, "config", this.medalTasksConfig.like);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.like = s;
    }
    /**
     * 获取粉丝勋章的房间号和主播uid，过滤等级大于等于20或不符合黑白名单要求的粉丝勋章
     * @returns 数组，每个元素都是数组：[房间号，主播uid]
     */
    getRoomidUidList() {
      const biliStore = useBiliStore();
      if (biliStore.filteredFansMedals) {
        return biliStore.filteredFansMedals.filter(
          (medal) => (this.config.includeHighLevelMedals ? true : medal.medal.level < 20) && (this.medalTasksConfig.isWhiteList ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id) : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id))
        ).map((medal) => [medal.room_info.room_id, medal.medal.target_id]).slice(0, 100);
      } else {
        this.status = "error";
        return null;
      }
    }
    async like(roomid, target_id) {
      try {
        const response = await BAPI.live.likeReport(roomid, target_id);
        this.logger.log(`BAPI.live.likeReport(${roomid}, ${target_id})`, response);
        if (response.code === 0) {
          this.logger.log(`给主播点赞 房间号 = ${roomid} 主播UID = ${target_id} 成功`);
        } else {
          this.logger.error(
            `给主播点赞 房间号 = ${roomid} 主播UID = ${target_id} 失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(`给主播点赞 房间号 = ${roomid} 主播UID = ${target_id} 出错`, error);
      }
    }
    async run() {
      this.logger.log("给主播点赞模块开始运行");
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          const idList = this.getRoomidUidList();
          if (idList) {
            for (const [roomid, target_id] of idList) {
              await this.like(roomid, target_id);
              await sleep(2e3);
            }
            this.config._lastCompleteTime = tsm();
            this.status = "done";
            this.logger.log("给主播点赞任务已完成");
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过给主播点赞任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的给主播点赞任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离给主播点赞模块下次运行时间:", diff.str);
    }
  }
  class RoomHeart {
    constructor(roomID, areaID, parentID, ruid, watchedSeconds, isLast = false) {
      __publicField(this, "logger", new Logger("RoomHeart"));
      __publicField(this, "config");
      /** 是不是最后一个心跳任务 */
      __publicField(this, "isLast");
      /** 已观看时间（秒） */
      __publicField(this, "watchedSeconds");
      __publicField(this, "timer");
      __publicField(this, "stop", false);
      __publicField(this, "areaID");
      __publicField(this, "parentID");
      __publicField(this, "roomID");
      /** 主播的 UID */
      __publicField(this, "ruid");
      __publicField(this, "seq", 0);
      /** Cookie LIVE_BUVID */
      __publicField(this, "buvid", getCookie("LIVE_BUVID"));
      __publicField(this, "uuid", uuid());
      /** 计算签名和发送请求时均需要 JSON.stringify */
      __publicField(this, "device", [this.buvid, this.uuid]);
      /** 浏览器 user agent */
      __publicField(this, "ua", navigator.userAgent);
      __publicField(this, "heartBeatInterval");
      __publicField(this, "secretKey");
      __publicField(this, "secretRule");
      /** ets */
      __publicField(this, "timestamp");
      this.roomID = roomID;
      this.areaID = areaID;
      this.parentID = parentID;
      this.ruid = ruid;
      this.watchedSeconds = watchedSeconds;
      this.isLast = isLast;
      this.config = useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks.watch;
    }
    set status(s) {
      useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = s;
    }
    /** 计算签名和发送请求时均需要 JSON.stringify */
    get id() {
      return [this.parentID, this.areaID, this.seq, this.roomID];
    }
    /**
     * 开始心跳
     */
    start() {
      if (!this.buvid)
        return;
      this.timer = setTimeout(() => this.stop = true, delayToNextMoment(0, 0).ms);
      return this.E();
    }
    /**
     * E心跳，开始时发送一次
     */
    async E() {
      if (this.stop) {
        this.status = "";
        return;
      }
      try {
        const response = await BAPI.liveTrace.E(this.id, this.device, this.ruid);
        this.logger.log(
          `BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) response`,
          response
        );
        if (response.code === 0) {
          this.seq += 1;
          ({
            heartbeat_interval: this.heartBeatInterval,
            secret_key: this.secretKey,
            secret_rule: this.secretRule,
            timestamp: this.timestamp
          } = response.data);
          setTimeout(() => this.X(), this.heartBeatInterval * 1e3);
        } else {
          this.logger.error(
            `BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) 失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(`BAPI.liveTrace.E(${this.id}, ${this.device}, ${this.ruid}) 出错`, error);
      }
    }
    /**
     * X心跳，E心跳过后都是X心跳
     */
    async X() {
      if (this.stop) {
        this.status = "";
        return;
      }
      try {
        const sypderData = {
          id: JSON.stringify(this.id),
          device: JSON.stringify(this.device),
          ets: this.timestamp,
          benchmark: this.secretKey,
          time: this.heartBeatInterval,
          ts: tsm(),
          ua: this.ua
        };
        const s = this.sypder(JSON.stringify(sypderData), this.secretRule);
        const response = await BAPI.liveTrace.X(
          s,
          this.id,
          this.device,
          this.ruid,
          this.timestamp,
          this.secretKey,
          this.heartBeatInterval,
          sypderData.ts
        );
        this.logger.log(
          `BAPI.liveTrace.X(${s}, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}, ${sypderData.ts}) response`,
          response
        );
        if (response.code === 0) {
          this.seq += 1;
          this.watchedSeconds += this.heartBeatInterval;
          if (this.isLast) {
            this.config._watchedSecondsToday = this.watchedSeconds;
          }
          if (this.watchedSeconds >= this.config.time * 60) {
            if (this.isLast) {
              this.config._lastCompleteTime = tsm();
              this.logger.log("观看直播任务已完成");
              this.status = "done";
            }
            clearTimeout(this.timer);
            return;
          }
          ;
          ({
            heartbeat_interval: this.heartBeatInterval,
            secret_key: this.secretKey,
            secret_rule: this.secretRule,
            timestamp: this.timestamp
          } = response.data);
          setTimeout(() => this.X(), this.heartBeatInterval * 1e3);
        } else {
          this.logger.error(
            `BAPI.liveTrace.X(${s}, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}) 失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(
          `BAPI.liveTrace.X(s, ${this.id}, ${this.device}, ${this.ruid}, ${this.timestamp}, ${this.secretKey}, ${this.heartBeatInterval}) 出错`,
          error
        );
      }
    }
    /**
     * wasm 导出的 spyider 函数的 javascript 实现
     * @param str 一个经过 JSON.stringify 的 json 字符串
     * @param rule secret_rule 数组
     * @returns s
     */
    sypder(str, rule) {
      const data = JSON.parse(str);
      const [parent_id, area_id, seq_id, room_id] = JSON.parse(data.id);
      const [buvid, uuid2] = JSON.parse(data.device);
      const key = data.benchmark;
      const newData = {
        platform: "web",
        parent_id,
        area_id,
        seq_id,
        room_id,
        buvid,
        uuid: uuid2,
        ets: data.ets,
        time: data.time,
        ts: data.ts
      };
      let s = JSON.stringify(newData);
      for (const r of rule) {
        switch (r) {
          case 0:
            s = CryptoJS.HmacMD5(s, key).toString(CryptoJS.enc.Hex);
            break;
          case 1:
            s = CryptoJS.HmacSHA1(s, key).toString(CryptoJS.enc.Hex);
            break;
          case 2:
            s = CryptoJS.HmacSHA256(s, key).toString(CryptoJS.enc.Hex);
            break;
          case 3:
            s = CryptoJS.HmacSHA224(s, key).toString(CryptoJS.enc.Hex);
            break;
          case 4:
            s = CryptoJS.HmacSHA512(s, key).toString(CryptoJS.enc.Hex);
            break;
          case 5:
            s = CryptoJS.HmacSHA384(s, key).toString(CryptoJS.enc.Hex);
            break;
          default:
            s = CryptoJS.HmacMD5(s, key).toString(CryptoJS.enc.Hex);
        }
      }
      return s;
    }
  }
  class WatchTask2 extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "medalTasksConfig", this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks);
      __publicField(this, "config", this.medalTasksConfig.watch);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = s;
    }
    /**
     * 获取粉丝勋章的房间号和主播uid，过滤等级大于等于20或不符合黑白名单要求的粉丝勋章
     * @returns 数组，每个元素都是数组：[房间号，主播uid]
     */
    getRoomidUidList() {
      const biliStore = useBiliStore();
      if (biliStore.filteredFansMedals) {
        return biliStore.filteredFansMedals.filter(
          (medal) => medal.medal.level < 20 && (this.medalTasksConfig.isWhiteList ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id) : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id))
        ).map((medal) => [medal.room_info.room_id, medal.medal.target_id]).slice(0, 100);
      } else {
        return null;
      }
    }
    /**
     * 获取指定直播间的 area_id 和 parent_area_id
     *
     * @param roomid 房间号
     * @returns [area_id, parent_area_id]
     */
    async getAreaInfo(roomid) {
      try {
        const response = await BAPI.live.getInfoByRoom(roomid);
        this.logger.log(`BAPI.live.getInfoByRoom(${roomid}) response`, response);
        if (response.code === 0) {
          const room_info = response.data.room_info;
          return [room_info.area_id, room_info.parent_area_id];
        } else {
          return null;
        }
      } catch (error) {
        this.logger.error(
          `获取指定直播间的 area_id 和 parent_area_id(roomid = ${roomid}) 出错`,
          error
        );
        return null;
      }
    }
    async run() {
      this.logger.log("观看直播模块开始运行");
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          if (!isTimestampToday(this.config._lastWatchTime, 0, 0)) {
            this.config._watchedSecondsToday = 0;
          } else {
            this.config._watchedSecondsToday -= this.config._watchedSecondsToday % 300;
          }
          this.config._lastWatchTime = tsm();
          const idList = this.getRoomidUidList();
          if (idList) {
            if (idList.length === 0) {
              this.status = "done";
              this.config._lastCompleteTime = tsm();
            } else {
              for (let i = 0; i < idList.length; i++) {
                const [roomid, uid] = idList[i];
                const areaInfo = await this.getAreaInfo(roomid);
                if (areaInfo && areaInfo.every((id) => id > 0)) {
                  new RoomHeart(
                    roomid,
                    areaInfo[0],
                    areaInfo[1],
                    uid,
                    this.config._watchedSecondsToday,
                    i === idList.length - 1 ? true : false
                  ).start();
                }
                await sleep(3e3);
              }
            }
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过观看直播任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的观看直播任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离观看直播模块下次运行时间:", diff.str);
    }
  }
  class DanmuTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "medalTasksConfig", this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks);
      __publicField(this, "config", this.medalTasksConfig.danmu);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.danmu = s;
    }
    /**
     * 获取粉丝勋章的房间号，过滤等级大于等于20或不符合黑白名单要求的粉丝勋章
     */
    getRoomidList() {
      const biliStore = useBiliStore();
      if (biliStore.filteredFansMedals) {
        return biliStore.filteredFansMedals.filter(
          (medal) => medal.medal.level < 20 && medal.room_info.room_id != 910884 && (this.medalTasksConfig.isWhiteList ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id) : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id))
        ).map((medal) => medal.room_info.room_id).slice(0, 100);
      } else {
        this.status = "error";
        return null;
      }
    }
    async sendDanmu(danmu, roomid) {
      try {
        const response = await BAPI.live.sendMsg(danmu, roomid);
        this.logger.log(`BAPI.live.sendMsg(${danmu}, ${roomid})`, response);
        if (response.code === 0) {
          this.logger.log(`在直播间 ${roomid} 发送弹幕 ${danmu} 成功`);
        } else {
          this.logger.error(`在直播间 ${roomid} 发送弹幕 ${danmu} 失败`, response.message);
        }
      } catch (error) {
        this.logger.error(`在直播间 ${roomid} 发送弹幕 ${danmu} 出错`, error);
      }
    }
    async run() {
      this.logger.log("发送弹幕模块开始运行");
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          const roomIdList = this.getRoomidList();
          if (roomIdList) {
            const danmuList = this.config.list;
            for (let i = 0; i < roomIdList.length; i++) {
              const danmu = danmuList[i % danmuList.length];
              await this.sendDanmu(danmu, roomIdList[i]);
              await sleep(2e3);
            }
            this.config._lastCompleteTime = tsm();
            this.status = "done";
            this.logger.log("发送弹幕任务已完成");
          }
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过发送弹幕任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的发送弹幕任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      this.moduleStore.emitter.emit("DailyTask_LiveTask_AppUserTask", {
        module: this.moduleName
      });
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离发送弹幕模块下次运行时间:", diff.str);
    }
  }
  class GroupSignTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.OtherTasks.groupSign);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.OtherTasks.groupSign = s;
    }
    /**
     * 获取应援团 id 和拥有者 uid
     * @returns 数组，每个元素都是数组：[应援团 id，拥有者 uid]
     */
    async getGroupidOwneruidList() {
      try {
        const response = await BAPI.vc.myGroups();
        this.logger.log(`BAPI.vc.myGroups response`, response);
        if (response.code === 0) {
          return response.data.list.map((item) => [item.group_id, item.owner_uid]);
        } else {
          this.logger.error(`获取应援团信息失败`, response.message);
          this.status = "error";
        }
      } catch (error) {
        this.logger.error(`获取应援团信息出错`, error);
        this.status = "error";
      }
    }
    async sign(group_id, owner_uid) {
      try {
        const response = await BAPI.vc.signIn(group_id, owner_uid);
        this.logger.log(`BAPI.vc.signIn(${group_id}, ${owner_uid}) response`, response);
        if (response.code === 0) {
          this.logger.log(
            `应援团签到 应援团ID = ${group_id} 拥有者UID = ${owner_uid} 成功, 粉丝勋章亲密度+${response.data.add_num}`
          );
        } else {
          this.logger.error(
            `应援团签到 应援团ID = ${group_id} 拥有者UID = ${owner_uid} 失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(`应援团签到 应援团ID = ${group_id} 拥有者UID = ${owner_uid} 出错`, error);
      }
    }
    async run() {
      this.logger.log("应援团签到模块开始运行");
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime, 8, 5)) {
          this.status = "running";
          const idList = await this.getGroupidOwneruidList();
          if (idList) {
            for (const [group_id, owner_uid] of idList) {
              await this.sign(group_id, owner_uid);
              await sleep(2e3);
            }
            this.config._lastCompleteTime = tsm();
            this.logger.log("应援团签到任务已完成");
            this.status = "done";
          }
        } else {
          if (!isNowIn(0, 0, 8, 5)) {
            this.logger.log("今天已经完成过应援团签到任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的应援团签到任务已经完成过了，等到今天早上八点零五分再次执行");
          }
        }
      }
      const diff = delayToNextMoment(8, 5);
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离应援团签到模块下次运行时间:", diff.str);
    }
  }
  class SilverToCoinTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.OtherTasks.silverToCoin);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.OtherTasks.silverToCoin = s;
    }
    async exchange() {
      try {
        const response = await BAPI.live.silver2coin();
        this.logger.log(`BAPI.live.silver2coin response`, response);
        if (response.code === 0) {
          this.logger.log(`银瓜子换硬币已完成，获得硬币:`, response.data.coin);
          this.config._lastCompleteTime = tsm();
          this.status = "done";
        } else if (response.code === 403) {
          this.logger.log("每天最多只能用银瓜子兑换1个硬币");
          this.config._lastCompleteTime = tsm();
          this.status = "done";
        } else {
          this.logger.error("银瓜子换硬币失败", response.message);
          this.status = "error";
        }
      } catch (err) {
        this.logger.error("银瓜子换硬币出错", err);
        this.status = "error";
      }
    }
    async run() {
      this.logger.log("银瓜子换硬币模块开始运行");
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          await this.exchange();
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过银瓜子换硬币任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的银瓜子换硬币任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("银瓜子换硬币模块下次运行时间:", diff.str);
    }
  }
  class CoinToSilverTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.OtherTasks.coinToSilver);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.OtherTasks.coinToSilver = s;
    }
    async exchange() {
      try {
        const response = await BAPI.live.coin2silver(this.config.num);
        this.logger.log(`BAPI.live.coin2silver{${this.config.num}} response`, response);
        if (response.code === 0) {
          this.logger.log("硬币换银瓜子已完成，获得银瓜子:", response.data.silver);
          this.config._lastCompleteTime = tsm();
          this.status = "done";
        } else {
          this.logger.error("硬币换银瓜子失败", response.message);
          this.status = "error";
        }
      } catch (err) {
        this.logger.error("硬币换银瓜子出错", err);
        this.status = "error";
      }
    }
    async run() {
      this.logger.log("硬币换银瓜子模块开始运行");
      if (this.config.enabled) {
        if (!isTimestampToday(this.config._lastCompleteTime)) {
          this.status = "running";
          await this.exchange();
        } else {
          if (!isNowIn(0, 0, 0, 5)) {
            this.logger.log("今天已经完成过硬币换银瓜子任务了");
            this.status = "done";
          } else {
            this.logger.log("昨天的硬币换银瓜子任务已经完成过了，等到今天的00:05再执行");
          }
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("硬币换银瓜子模块下次运行时间:", diff.str);
    }
  }
  class GetYearVipPrivilegeTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.OtherTasks.getYearVipPrivilege);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.OtherTasks.getYearVipPrivilege = s;
    }
    /**
     * 获取会员权益
     * @returns 会员权益列表
     */
    async myPrivilege() {
      try {
        const response = await BAPI.main.vip.myPrivilege();
        this.logger.log(`BAPI.main.vip.myPrivilege response`, response);
        if (response.code === 0) {
          return response.data.list;
        } else {
          this.logger.error(`获取年度大会员权益信息失败`, response.message);
          this.status = "error";
        }
      } catch (error) {
        this.logger.error(`获取年度大会员权益信息出错`, error);
        this.status = "error";
      }
    }
    /**
     * 领取权益
     * @param type 权益种类
     */
    async receivePrivilege(type) {
      try {
        const response = await BAPI.main.vip.receivePrivilege(type);
        this.logger.log(`BAPI.main.vip.receivePrivilege(${type}) response`, response);
        if (response.code === 0) {
          this.logger.log(`领取年度大会员权益（type = ${type}）成功`);
        } else {
          this.logger.error(`领取年度大会员权益（type = ${type}）失败`, response.message);
        }
      } catch (error) {
        this.logger.error(`领取年度大会员权益（type = ${type}）出错`, error);
      }
    }
    /**
     * 判断当前账号是否是年度大会员
     */
    isYearVip() {
      const biliStore = useBiliStore();
      const userInfo = biliStore.userInfo;
      if (userInfo && userInfo.vip.status === 1 && userInfo.vip.type === 2) {
        return true;
      } else {
        this.logger.log("当前账号不是年度大会员，不领取权益");
        return false;
      }
    }
    async run() {
      this.logger.log("领取年度大会员权益模块开始运行");
      if (this.config.enabled) {
        if (this.isYearVip()) {
          if (ts() >= this.config._nextReceiveTime) {
            this.status = "running";
            const list = await this.myPrivilege();
            if (list) {
              for (const i of list) {
                if (i.vip_type === 2) {
                  if (i.state === 0) {
                    await this.receivePrivilege(i.type);
                  } else {
                    this.logger.log(`该权益（type = ${i.type}）已经领取过了`);
                  }
                } else {
                  this.logger.warn("发现不属于年度大会员的权益", i);
                }
              }
              this.status = "done";
              this.config._nextReceiveTime = Math.max(...list.map((i) => i.period_end_unix));
            }
          } else {
            const diff = this.config._nextReceiveTime - ts();
            if (diff < 86400) {
              this.logger.log(
                "领取年度大会员权益模块下次运行时间:",
                luxon.DateTime.fromSeconds(this.config._nextReceiveTime).toString()
              );
              setTimeout(() => this.run(), diff);
            } else {
              this.logger.log("距离下次领取年度大会员权益的时间超过一天，不计划下次运行");
            }
          }
        }
      } else {
        const diff = delayToNextMoment(0, 0);
        setTimeout(() => this.run(), diff.ms);
        this.logger.log("领取年度大会员权益模块下次运行时间:", diff.str);
      }
    }
  }
  class SwitchLiveStreamQuality extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.EnhanceExperience.switchLiveStreamQuality);
    }
    async waitForPlayer() {
      return new Promise((resolve, reject) => {
        const topWindow = _unsafeWindow.top ? _unsafeWindow.top : _unsafeWindow;
        const findPlayertimer = setInterval(() => {
          if (topWindow.livePlayer && Object.prototype.hasOwnProperty.call(topWindow.livePlayer, "switchQuality") && Object.prototype.hasOwnProperty.call(topWindow.livePlayer, "getPlayerInfo")) {
            clearInterval(findPlayertimer);
            clearTimeout(timeoutTimer);
            resolve(topWindow.livePlayer);
          }
        }, 200);
        const timeoutTimer = setTimeout(() => {
          clearInterval(findPlayertimer);
          clearTimeout(timeoutTimer);
          reject();
        }, 1e4);
      });
    }
    switchQuality(livePlayer) {
      const playerInfo = livePlayer.getPlayerInfo();
      if (playerInfo.liveStatus === 0) {
        this.logger.log("当前直播间未开播");
      } else {
        const targetQuality = playerInfo.qualityCandidates.find(
          ({ desc }) => desc === this.config.qualityDesc
        );
        if (targetQuality && playerInfo.quality !== targetQuality.qn) {
          livePlayer.switchQuality(targetQuality.qn);
          this.logger.log(`已将画质切换为${this.config.qualityDesc}`, targetQuality);
        }
      }
    }
    async run() {
      this.logger.log("自动切换画质模块开始运行");
      if (this.config.enabled) {
        try {
          const livePlayer = await this.waitForPlayer();
          this.switchQuality(livePlayer);
        } catch (e) {
          this.logger.error("等待播放器超时");
        }
      }
    }
  }
  __publicField(SwitchLiveStreamQuality, "runMultiple", true);
  class BanP2P extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.EnhanceExperience.banp2p);
    }
    async banP2P() {
      var _a;
      const RTClist = [
        "RTCPeerConnection",
        "mozRTCPeerConnection",
        "webkitRTCPeerConnection"
      ];
      for (const i of RTClist) {
        if (Object.prototype.hasOwnProperty.call(_unsafeWindow, i) && ((_a = Object.getOwnPropertyDescriptor(_unsafeWindow, i)) == null ? void 0 : _a.configurable)) {
          Object.defineProperty(_unsafeWindow, i, {
            value: function() {
              this.addEventListener = function() {
              };
              this.createDataChannel = function() {
                return { close: function() {
                } };
              };
              this.createOffer = function() {
              };
              this.setLocalDescription = function() {
              };
              this.close = function() {
              };
              this.setRemoteDescription = function() {
              };
              this.createAnswer = function() {
              };
            },
            enumerable: false,
            writable: false,
            configurable: false
          });
        }
      }
    }
    async run() {
      this.logger.log("禁用P2P模块开始运行");
      if (this.config.enabled) {
        try {
          await this.banP2P();
        } catch (e) {
          this.logger.error("禁用P2P失败", e);
        }
      }
    }
  }
  __publicField(BanP2P, "runMultiple", true);
  const otherModules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    DailyTask_LiveTask_AppUserTask: AppUserTask,
    DailyTask_LiveTask_DanmuTask: DanmuTask,
    DailyTask_LiveTask_LikeTask: LikeTask,
    DailyTask_LiveTask_SignTask: SignTask,
    DailyTask_LiveTask_WatchTask: WatchTask2,
    DailyTask_MainSiteTask_CoinTask: CoinTask,
    DailyTask_MainSiteTask_LoginTask: LoginTask,
    DailyTask_MainSiteTask_ShareTask: ShareTask,
    DailyTask_MainSiteTask_WatchTask: WatchTask$1,
    DailyTask_OtherTask_CoinToSilverTask: CoinToSilverTask,
    DailyTask_OtherTask_GetYearVipPrivilegeTask: GetYearVipPrivilegeTask,
    DailyTask_OtherTask_GroupSignTask: GroupSignTask,
    DailyTask_OtherTask_SilverToCoinTask: SilverToCoinTask,
    EnhanceExperience_BanP2P: BanP2P,
    EnhanceExperience_SwitchLiveStreamQuality: SwitchLiveStreamQuality
  }, Symbol.toStringTag, { value: "Module" }));
  function mitt(n) {
    return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    }, off: function(t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    }, emit: function(t, e) {
      var i = n.get(t);
      i && i.slice().map(function(n2) {
        n2(e);
      }), (i = n.get("*")) && i.slice().map(function(n2) {
        n2(t, e);
      });
    } };
  }
  const useCacheStore = pinia.defineStore("cache", () => {
    const cache = vue.reactive(Storage.getCache());
    const isMainBLTHRunning = vue.ref(false);
    function startAliveHeartBeat() {
      cache.lastAliveHeartBeatTime = Date.now();
      const timer = setInterval(() => cache.lastAliveHeartBeatTime = Date.now(), 5e3);
      window.onunload = () => {
        clearInterval(timer);
        cache.lastAliveHeartBeatTime = 0;
      };
    }
    function checkIfMainBLTHRunning() {
      if (cache.lastAliveHeartBeatTime !== 0 && Date.now() - cache.lastAliveHeartBeatTime < 8e3) {
        isMainBLTHRunning.value = true;
      } else {
        isMainBLTHRunning.value = false;
      }
    }
    vue.watch(cache, (newCache) => Storage.setCache(newCache));
    return {
      cache,
      isMainBLTHRunning,
      startAliveHeartBeat,
      checkIfMainBLTHRunning
    };
  });
  const defaultModuleStatus = {
    DailyTasks: {
      MainSiteTasks: {
        login: "",
        watch: "",
        coin: "",
        share: ""
      },
      LiveTasks: {
        sign: "",
        appUser: "",
        medalTasks: {
          danmu: "",
          like: "",
          watch: ""
        }
      },
      OtherTasks: {
        groupSign: "",
        silverToCoin: "",
        coinToSilver: "",
        getYearVipPrivilege: ""
      }
    }
  };
  const useModuleStore = pinia.defineStore("module", () => {
    const moduleConfig = vue.reactive(Storage.getModuleConfig());
    const emitter = mitt();
    const moduleStatus = vue.reactive(defaultModuleStatus);
    async function loadModules() {
      const cacheStore = useCacheStore();
      for (const [name, Module] of Object.entries(defaultModules).sort(
        (a, b) => a[1].sequence - b[1].sequence
      )) {
        try {
          if (Module.runMultiple || !cacheStore.isMainBLTHRunning) {
            await new Module(name).run();
          }
        } catch (err) {
          new Logger("loadModules").error("加载默认模块时发生致命错误，挂机助手停止运行:", err);
          return;
        }
      }
      for (const [name, Module] of Object.entries(otherModules)) {
        if (Module.runMultiple || !cacheStore.isMainBLTHRunning) {
          new Module(name).run();
        }
      }
    }
    vue.watch(
      moduleConfig,
      _.debounce((newModuleConfig) => Storage.setModuleConfig(newModuleConfig), 250, {
        leading: true,
        trailing: true
      })
    );
    (function clearStatus() {
      setTimeout(() => {
        deepestIterate(moduleStatus, (_value, path) => {
          _.set(moduleStatus, path, "");
        });
        clearStatus();
      }, delayToNextMoment(0, 0).ms);
    })();
    return {
      moduleConfig,
      emitter,
      moduleStatus,
      loadModules
    };
  });
  const _hoisted_1$3 = { class: "title" };
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "PanelHeader",
    setup(__props) {
      const uiStore = useUIStore();
      return (_ctx, _cache) => {
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_text = vue.resolveComponent("el-text");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", {
            class: "collapse-btn",
            onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(uiStore).changeCollapse())
          }, [
            vue.unref(uiStore).uiConfig.isCollapse ? (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 0 }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(ElementPlusIconsVue.Expand))
              ]),
              _: 1
            })) : (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 1 }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(ElementPlusIconsVue.Fold))
              ]),
              _: 1
            }))
          ]),
          vue.createElementVNode("div", _hoisted_1$3, [
            vue.createVNode(_component_el_text, {
              tag: "b",
              class: "header-big-text"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("控制面板")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_text, { class: "header-small-text" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(vue.unref(uiStore).activeMenuName), 1)
              ]),
              _: 1
            })
          ])
        ], 64);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const PanelHeader = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-dda95e10"]]);
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "PanelAside",
    setup(__props) {
      const uiStore = useUIStore();
      const items = [
        {
          icon: "Tasks",
          title: "每日任务",
          index: "DailyTasks",
          // 有子菜单，index 无所谓
          subs: [
            {
              title: "主站任务",
              index: "MainSiteTasks"
              // index 是组件名
            },
            {
              title: "直播任务",
              index: "LiveTasks"
            },
            {
              title: "其它任务",
              index: "OtherTasks"
            }
          ]
        },
        {
          icon: "Monitor",
          title: "体验优化",
          index: "EnhanceExperience"
        }
      ];
      return (_ctx, _cache) => {
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_menu_item = vue.resolveComponent("el-menu-item");
        const _component_el_sub_menu = vue.resolveComponent("el-sub-menu");
        const _component_el_menu = vue.resolveComponent("el-menu");
        return vue.openBlock(), vue.createBlock(_component_el_menu, {
          "default-active": vue.unref(uiStore).uiConfig.activeMenuIndex,
          style: vue.normalizeStyle({ "min-height": vue.unref(uiStore).scrollBarHeight }),
          collapse: vue.unref(uiStore).uiConfig.isCollapse,
          "unique-opened": "",
          onSelect: vue.unref(uiStore).setActiveMenuIndex,
          id: "aside-el-menu"
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(items, (item) => {
              return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                item.subs ? (vue.openBlock(), vue.createBlock(_component_el_sub_menu, {
                  index: item.index,
                  key: item.index
                }, {
                  title: vue.withCtx(() => [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(item.icon)))
                      ]),
                      _: 2
                    }, 1024),
                    vue.createElementVNode("span", null, vue.toDisplayString(item.title), 1)
                  ]),
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.subs, (subItem) => {
                      return vue.openBlock(), vue.createBlock(_component_el_menu_item, {
                        key: subItem.index,
                        index: subItem.index
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(subItem.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["index"]);
                    }), 128))
                  ]),
                  _: 2
                }, 1032, ["index"])) : (vue.openBlock(), vue.createBlock(_component_el_menu_item, {
                  index: item.index,
                  key: item.index
                }, {
                  title: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(item.title), 1)
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(item.icon)))
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1032, ["index"]))
              ], 64);
            }), 64))
          ]),
          _: 1
        }, 8, ["default-active", "style", "collapse", "onSelect"]);
      };
    }
  });
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "MainSiteTasks",
    setup(__props) {
      const moduleStore = useModuleStore();
      const config = moduleStore.moduleConfig.DailyTasks.MainSiteTasks;
      const status = moduleStore.moduleStatus.DailyTasks.MainSiteTasks;
      return (_ctx, _cache) => {
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_Info = vue.resolveComponent("Info");
        const _component_TaskStatus = vue.resolveComponent("TaskStatus");
        const _component_el_space = vue.resolveComponent("el-space");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_text = vue.resolveComponent("el-text");
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_link = vue.resolveComponent("el-link");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).login.enabled,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).login.enabled = $event),
                    "active-text": "每日登录"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.MainSiteTasks.login" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).login
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).watch.enabled,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).watch.enabled = $event),
                    "active-text": "每日观看视频"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.MainSiteTasks.watch" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).watch
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).coin.enabled,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).coin.enabled = $event),
                    "active-text": "每日投币"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_select, {
                    modelValue: vue.unref(config).coin.num,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).coin.num = $event),
                    placeholder: "Select",
                    style: { "width": "64px" }
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(5, (i) => {
                        return vue.createVNode(_component_el_option, {
                          key: i,
                          label: i,
                          value: i
                        }, null, 8, ["label", "value"]);
                      }), 64))
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("个")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_Info, { id: "DailyTasks.MainSiteTasks.coin" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).coin
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).share.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).share.enabled = $event),
                    "active-text": "每日分享视频"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.MainSiteTasks.share" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).share
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_divider),
          vue.createElementVNode("div", null, [
            vue.createVNode(_component_el_text, null, {
              default: vue.withCtx(() => [
                vue.createTextVNode("  主站每日任务的完成情况可在")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_link, {
              class: "el-link-va-baseline",
              rel: "noreferrer",
              type: "primary",
              href: "https://account.bilibili.com/account/home",
              target: "_blank"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("个人中心")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_text, null, {
              default: vue.withCtx(() => [
                vue.createTextVNode("查看。数据更新可能有一定的延时。")
              ]),
              _: 1
            })
          ])
        ]);
      };
    }
  });
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-f7944e85"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_2$1 = { class: "avatar-wrap" };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "LiveTasks",
    setup(__props) {
      const moduleStore = useModuleStore();
      const biliStore = useBiliStore();
      const config = moduleStore.moduleConfig.DailyTasks.LiveTasks;
      const status = moduleStore.moduleStatus.DailyTasks.LiveTasks;
      const medalDanmuPanelVisible = vue.ref(false);
      const danmuTableData = vue.computed(
        () => config.medalTasks.danmu.list.map((danmu) => {
          return { content: danmu };
        })
      );
      const handleEditDanmu = (index, row) => {
        ElementPlus.ElMessageBox.prompt("请输入新的弹幕内容", "修改弹幕", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          inputPattern: /^.{1,30}$/,
          inputErrorMessage: "弹幕内容不得为空且长度不能超过30",
          inputValue: row.content,
          lockScroll: false
        }).then(({ value }) => {
          config.medalTasks.danmu.list[index] = value;
        }).catch(() => {
        });
      };
      const handleDeleteDanmu = (index) => {
        if (config.medalTasks.danmu.list.length === 1) {
          ElementPlus.ElMessage.warning({
            message: "至少要有一条弹幕",
            appendTo: ".el-dialog"
          });
          return;
        }
        config.medalTasks.danmu.list.splice(index, 1);
      };
      const handleAddDanmu = () => {
        ElementPlus.ElMessageBox.prompt("请输入新增的弹幕内容", "新增弹幕", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          inputPattern: /^.{1,30}$/,
          inputErrorMessage: "弹幕内容不得为空且长度不能超过30",
          lockScroll: false
        }).then(({ value }) => {
          config.medalTasks.danmu.list.push(value);
        }).catch(() => {
        });
      };
      const medalInfoPanelVisible = vue.ref(false);
      const medalInfoTableData = vue.computed(
        () => {
          var _a;
          return (_a = biliStore.filteredFansMedals) == null ? void 0 : _a.map((medal) => ({
            avatar: medal.anchor_info.avatar,
            nick_name: medal.anchor_info.nick_name,
            medal_name: medal.medal.medal_name,
            medal_level: medal.medal.level,
            roomid: medal.room_info.room_id
          }));
        }
      );
      const medalInfoLoading = vue.ref(false);
      let firstClickEditList = true;
      const handleEditList = () => {
        medalInfoPanelVisible.value = !medalInfoPanelVisible.value;
        if (firstClickEditList) {
          if (!biliStore.fansMedals) {
            medalInfoLoading.value = true;
            const unwatch = vue.watch(medalInfoTableData, (newData) => {
              if (newData) {
                unwatch();
                firstClickEditList = false;
                initSelection(medalInfoTableData.value);
                medalInfoLoading.value = false;
              }
            });
            moduleStore.emitter.emit("BiliInfo", {
              target: "getFansMetals"
            });
          } else {
            initSelection(medalInfoTableData.value);
          }
        }
      };
      const medalInfoTableRef = vue.ref();
      let lockConfig = false;
      const initSelection = (rows) => {
        lockConfig = true;
        if (rows) {
          const unwatch = vue.watch(
            () => medalInfoTableRef.value,
            (newValue) => {
              setTimeout(() => unwatch(), 0);
              if (newValue) {
                config.medalTasks.roomidList.forEach(
                  (roomid) => newValue.toggleRowSelection(
                    rows.find((row) => row.roomid === roomid),
                    true
                  )
                );
              }
            },
            { immediate: true }
          );
        }
        lockConfig = false;
      };
      function handleSelectionChange(selectedRows) {
        if (!lockConfig) {
          config.medalTasks.roomidList = selectedRows.map((row) => row.roomid);
        }
      }
      return (_ctx, _cache) => {
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_Info = vue.resolveComponent("Info");
        const _component_TaskStatus = vue.resolveComponent("TaskStatus");
        const _component_el_space = vue.resolveComponent("el-space");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_SemiSelect = vue.resolveComponent("SemiSelect");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_text = vue.resolveComponent("el-text");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _component_el_image = vue.resolveComponent("el-image");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).sign.enabled,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).sign.enabled = $event),
                    "active-text": "直播签到"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.LiveTasks.sign" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).sign
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).appUser.enabled,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).appUser.enabled = $event),
                    disabled: "",
                    "active-text": "APP用户任务"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.LiveTasks.appUser" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).appUser
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_divider),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.like.enabled,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).medalTasks.like.enabled = $event),
                    "active-text": "给主播点赞"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.LiveTasks.medalTasks.like" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).medalTasks.like
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_icon, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_SemiSelect)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.like.includeHighLevelMedals,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).medalTasks.like.includeHighLevelMedals = $event),
                    "active-text": "包含等级≥20的粉丝勋章"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.danmu.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).medalTasks.danmu.enabled = $event),
                    "active-text": "发送弹幕"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    size: "small",
                    icon: vue.unref(ElementPlusIconsVue.Edit),
                    onClick: _cache[5] || (_cache[5] = ($event) => medalDanmuPanelVisible.value = !medalDanmuPanelVisible.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("编辑弹幕")
                    ]),
                    _: 1
                  }, 8, ["icon"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.LiveTasks.medalTasks.danmu" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).medalTasks.danmu
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.watch.enabled,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(config).medalTasks.watch.enabled = $event),
                    "active-text": "观看直播"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_select, {
                    modelValue: vue.unref(config).medalTasks.watch.time,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(config).medalTasks.watch.time = $event),
                    placeholder: "Select",
                    style: { "width": "64px" }
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(24, (i) => {
                        return vue.createVNode(_component_el_option, {
                          key: i,
                          label: i * 5,
                          value: i * 5
                        }, null, 8, ["label", "value"]);
                      }), 64))
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("分钟")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_Info, { id: "DailyTasks.LiveTasks.medalTasks.watch" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).medalTasks.watch
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.isWhiteList,
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.unref(config).medalTasks.isWhiteList = $event),
                    "active-text": "白名单",
                    "inactive-text": "黑名单"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    size: "small",
                    icon: vue.unref(ElementPlusIconsVue.Edit),
                    onClick: handleEditList
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("编辑名单")
                    ]),
                    _: 1
                  }, 8, ["icon"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.LiveTasks.medalTasks.list" })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_divider),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_text, null, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("直播任务相关信息可在")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_link, {
                class: "el-link-va-baseline",
                rel: "noreferrer",
                type: "primary",
                href: "https://link.bilibili.com/p/help/index#/audience-fans-medal",
                target: "_blank"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("帮助中心")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_text, null, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("查看。")
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          _hoisted_1$2,
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_text, { tag: "b" }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("注意：")
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_text, null, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("  由于每天能通过完成任务获得亲密度的粉丝勋章数量有限，脚本默认仅为最多100个等级小于20的粉丝勋章完成给主播点赞，发送弹幕，观看直播任务。")
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_dialog, {
            modelValue: medalDanmuPanelVisible.value,
            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => medalDanmuPanelVisible.value = $event),
            title: "编辑弹幕内容",
            "lock-scroll": false,
            width: "40%"
          }, {
            footer: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                type: "primary",
                onClick: handleAddDanmu
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("新增弹幕")
                ]),
                _: 1
              })
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(ElementPlus.ElTable), {
                data: danmuTableData.value,
                "max-height": "500"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    type: "index",
                    width: "50"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "content",
                    label: "弹幕内容"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    label: "操作",
                    width: "220",
                    align: "center"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_button, {
                        text: "",
                        icon: vue.unref(ElementPlusIconsVue.Edit),
                        onClick: ($event) => handleEditDanmu(scope.$index, scope.row)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(" 修改 ")
                        ]),
                        _: 2
                      }, 1032, ["icon", "onClick"]),
                      vue.createVNode(_component_el_button, {
                        text: "",
                        icon: vue.unref(ElementPlusIconsVue.Delete),
                        type: "danger",
                        onClick: ($event) => handleDeleteDanmu(scope.$index)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(" 删除 ")
                        ]),
                        _: 2
                      }, 1032, ["icon", "onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["data"])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: medalInfoPanelVisible.value,
            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => medalInfoPanelVisible.value = $event),
            title: "编辑粉丝勋章名单",
            "lock-scroll": false,
            width: "40%"
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElTable), {
                ref_key: "medalInfoTableRef",
                ref: medalInfoTableRef,
                data: medalInfoTableData.value,
                "max-height": "500",
                "empty-text": "没有粉丝勋章",
                onSelectionChange: handleSelectionChange
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    type: "selection",
                    align: "center",
                    width: "55"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "avatar",
                    label: "头像"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createElementVNode("div", _hoisted_2$1, [
                        vue.createVNode(_component_el_image, {
                          src: scope.row.avatar,
                          loading: "lazy",
                          referrerpolicy: "origin",
                          class: "avatar"
                        }, {
                          error: vue.withCtx(() => [
                            vue.createVNode(_component_el_image, {
                              src: "//i0.hdslb.com/bfs/face/member/noface.jpg",
                              referrerpolicy: "origin",
                              class: "avatar"
                            })
                          ]),
                          _: 2
                        }, 1032, ["src"])
                      ])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "nick_name",
                    label: "昵称"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "medal_name",
                    label: "粉丝勋章"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "medal_level",
                    label: "等级",
                    sortable: ""
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "roomid",
                    label: "房间号"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_link, {
                        href: "https://live.bilibili.com/" + scope.row.roomid + "?visit_id=",
                        rel: "noreferrer",
                        type: "primary",
                        target: "_blank"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(scope.row.roomid), 1)
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["data"])), [
                [_directive_loading, medalInfoLoading.value]
              ])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]);
      };
    }
  });
  const LiveTasks = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-f7944e85"]]);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "OtherTasks",
    setup(__props) {
      const moduleStore = useModuleStore();
      const config = moduleStore.moduleConfig.DailyTasks.OtherTasks;
      const status = moduleStore.moduleStatus.DailyTasks.OtherTasks;
      return (_ctx, _cache) => {
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_Info = vue.resolveComponent("Info");
        const _component_TaskStatus = vue.resolveComponent("TaskStatus");
        const _component_el_space = vue.resolveComponent("el-space");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_text = vue.resolveComponent("el-text");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_divider = vue.resolveComponent("el-divider");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).groupSign.enabled,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).groupSign.enabled = $event),
                    "active-text": "应援团签到"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.OtherTasks.groupSign" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).groupSign
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).silverToCoin.enabled,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).silverToCoin.enabled = $event),
                    "active-text": "银瓜子换硬币"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.OtherTasks.silverToCoin" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).silverToCoin
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).coinToSilver.enabled,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).coinToSilver.enabled = $event),
                    "active-text": "硬币换银瓜子"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("花费硬币")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_select, {
                    modelValue: vue.unref(config).coinToSilver.num,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).coinToSilver.num = $event),
                    placeholder: "Select",
                    style: { "width": "64px" }
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(50, (i) => {
                        return vue.createVNode(_component_el_option, {
                          key: i,
                          label: i,
                          value: i
                        }, null, 8, ["label", "value"]);
                      }), 64))
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("个")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_Info, { id: "DailyTasks.OtherTasks.coinToSilver" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).coinToSilver
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).getYearVipPrivilege.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).getYearVipPrivilege.enabled = $event),
                    "active-text": "领取年度大会员权益"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "DailyTasks.OtherTasks.getYearVipPrivilege" }),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).getYearVipPrivilege
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_divider)
        ]);
      };
    }
  });
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "EnhanceExperience",
    setup(__props) {
      const moduleStore = useModuleStore();
      const config = moduleStore.moduleConfig.EnhanceExperience;
      const qualityDescList = ["原画", "蓝光PRO", "蓝光", "超清PRO", "超清", "高清"];
      return (_ctx, _cache) => {
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_Info = vue.resolveComponent("Info");
        const _component_el_space = vue.resolveComponent("el-space");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_divider = vue.resolveComponent("el-divider");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).switchLiveStreamQuality.enabled,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).switchLiveStreamQuality.enabled = $event),
                    "active-text": "自动切换画质"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_select, {
                    modelValue: vue.unref(config).switchLiveStreamQuality.qualityDesc,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).switchLiveStreamQuality.qualityDesc = $event),
                    placeholder: "Select",
                    style: { "width": "110px" }
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(qualityDescList, (i) => {
                        return vue.createVNode(_component_el_option, {
                          key: i,
                          label: i,
                          value: i
                        }, null, 8, ["label", "value"]);
                      }), 64))
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "EnhanceExperience.switchLiveStreamQuality" })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { wrap: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).banp2p.enabled,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).banp2p.enabled = $event),
                    "active-text": "禁用P2P"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, { id: "EnhanceExperience.banp2p" })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_divider)
        ]);
      };
    }
  });
  const __default__ = {
    components: {
      MainSiteTasks: _sfc_main$8,
      LiveTasks,
      OtherTasks: _sfc_main$6,
      EnhanceExperience: _sfc_main$5
    }
  };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    __name: "PanelMain",
    setup(__props) {
      const uiStore = useUIStore();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(uiStore).uiConfig.activeMenuIndex));
      };
    }
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const uiStore = useUIStore();
      const moduleStore = useModuleStore();
      const logger = new Logger("App.vue");
      let isShowPanel = uiStore.uiConfig.isShowPanel;
      uiStore.uiConfig.isShowPanel = false;
      let livePlayer;
      let button;
      function setPanelSize() {
        const rect = livePlayer.getBoundingClientRect();
        uiStore.baseStyleValue.top = rect.top + window.scrollY;
        uiStore.baseStyleValue.left = rect.left + window.scrollX;
        uiStore.baseStyleValue.height = rect.height;
        uiStore.baseStyleValue.width = rect.width * 0.4;
      }
      function buttonOnClick() {
        uiStore.changeShowPanel();
        button.innerText = uiStore.isShowPanelButtonText;
      }
      const throttleButtoOnClick = _.throttle(buttonOnClick, 300);
      moduleStore.loadModules();
      window.onload = () => {
        livePlayer = dq("#live-player-ctnr");
        if (livePlayer) {
          setPanelSize();
          pollingQuery(document, ".left-ctnr.left-header-area", 300, 3e3).then((playerHeaderLeft) => {
            button = dce("button");
            button.setAttribute("class", "blth_btn");
            button.onclick = throttleButtoOnClick;
            button.innerText = uiStore.isShowPanelButtonText;
            playerHeaderLeft.append(button);
            if (!isSelfTopFrame()) {
              hotkeys(
                "alt+b",
                {
                  element: topFrameDocuemnt()
                },
                throttleButtoOnClick
              );
            }
            hotkeys("alt+b", throttleButtoOnClick);
          }).catch(() => logger.error("Can't find playerHeaderLeft in time"));
          window.onresize = setPanelSize;
          const observer = new MutationObserver(() => setPanelSize());
          observer.observe(document.documentElement, { attributes: true });
          observer.observe(document.body, { attributes: true });
          if (isShowPanel) {
            uiStore.uiConfig.isShowPanel = true;
          }
        } else {
          logger.error("livePlayer not found");
        }
      };
      return (_ctx, _cache) => {
        const _component_el_header = vue.resolveComponent("el-header");
        const _component_el_aside = vue.resolveComponent("el-aside");
        const _component_el_main = vue.resolveComponent("el-main");
        const _component_el_container = vue.resolveComponent("el-container");
        const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
        const _component_el_collapse_transition = vue.resolveComponent("el-collapse-transition");
        return vue.openBlock(), vue.createBlock(_component_el_collapse_transition, null, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              style: vue.normalizeStyle(vue.unref(uiStore).baseStyle),
              class: "base"
            }, [
              vue.createVNode(_component_el_container, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_header, { class: "header" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(PanelHeader)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_scrollbar, {
                    height: vue.unref(uiStore).scrollBarHeight
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_container, null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_aside, { class: "aside" }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_sfc_main$9)
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_main, { class: "main" }, {
                            default: vue.withCtx(() => [
                              (vue.openBlock(), vue.createBlock(vue.KeepAlive, null, [
                                vue.createVNode(vue.Transition, {
                                  name: "fade",
                                  mode: "out-in"
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_sfc_main$4)
                                  ]),
                                  _: 1
                                })
                              ], 1024))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["height"])
                ]),
                _: 1
              })
            ], 4), [
              [vue.vShow, vue.unref(uiStore).uiConfig.isShowPanel]
            ])
          ]),
          _: 1
        });
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-4aed17ff"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus/dist/index.css");
  const _sfc_main$2 = {};
  const _hoisted_1$1 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "128",
    height: "128",
    class: "icon",
    viewBox: "0 0 1024 1024"
  };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("path", { d: "M831.825 63.94H191.94c-70.692 0-128 57.308-128 128v639.885c0 70.692 57.308 128 128 128h639.885c70.692 0 128-57.308 128-128V191.94c0-70.692-57.308-128-128-128zM895.885 832a63.835 63.835 0 0 1-63.973 63.886H192.088c-17.112 0-33.27-6.575-45.372-18.676S127.88 849.112 127.88 832V192a64.236 64.236 0 0 1 64.208-64.12h639.824A64.038 64.038 0 0 1 895.885 192v640z" }, null, -1);
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("path", { d: "M791.998 351.852H536a31.97 31.97 0 0 0 0 63.94h256a31.97 31.97 0 0 0 0-63.94zm0 256.121H536a31.97 31.97 0 0 0 0 63.94h256a31.97 31.97 0 0 0 0-63.94zm-447.996-79.975c-61.856 0-111.986 50.144-111.986 111.985S282.16 751.97 344.002 751.97s111.985-50.144 111.985-111.986-50.13-111.985-111.985-111.985zm33.982 145.982a48.045 48.045 0 1 1 14.088-33.982 47.746 47.746 0 0 1-14.088 33.986zm39.412-376.586L311.999 402.787l-41.391-41.395a31.97 31.97 0 1 0-45.213 45.213l63.997 64.002a31.97 31.97 0 0 0 45.214 0l128-128a31.97 31.97 0 0 0-45.21-45.213z" }, null, -1);
  const _hoisted_4 = [
    _hoisted_2,
    _hoisted_3
  ];
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$1, _hoisted_4);
  }
  const TasksIcon = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render]]);
  const help_info = {
    DailyTasks: {
      MainSiteTasks: {
        login: {
          title: "每日登录",
          message: "完成主站的每日登录任务。"
        },
        watch: {
          title: "每日观看视频",
          message: vue.h("p", [
            vue.h("div", "完成主站的每日观看视频任务。"),
            vue.h("div", "从动态中选取视频观看，会产生观看历史记录。")
          ])
        },
        coin: {
          title: "每日投币",
          message: vue.h("p", [
            vue.h("div", "完成主站的每日投币任务。"),
            vue.h("div", "从动态中选取视频投币，会根据你今天已经投过的币的数量计算还要投几个币。")
          ])
        },
        share: {
          title: "每日分享视频",
          message: vue.h("p", [
            vue.h("div", "完成主站的每日分享视频任务。"),
            vue.h("div", "不会真的分享到某处。")
          ])
        }
      },
      LiveTasks: {
        sign: {
          title: "直播签到",
          message: vue.h("p", [
            vue.h("div", "完成直播签到任务。"),
            vue.h("div", "完成后会移除当前直播间右上角签到窗口中的签到按钮。")
          ])
        },
        appUser: {
          title: "APP用户任务",
          message: vue.h("p", [
            vue.h("div", "完成APP用户任务并领取奖励。"),
            vue.h("div", [
              vue.h(
                "strong",
                "由于曾经的APP用户任务下架已久，目前的新任务（观看新主播直播并发弹幕）又没有对全部用户开放，故改功能暂时被禁用。"
              ),
              vue.h("div", [
                vue.h(
                  "span",
                  "在APP中观看直播时右下角可能会有个电池图标，点击即可查看APP用户任务内容。并非所有账号都可以参加该任务。  如果开启了发送弹幕功能，该功能会在发送弹幕功能运行完毕后再运行。如果之前发送的弹幕数量不够，会先在直播间"
                ),
                vue.h(
                  "a",
                  {
                    class: "el-link el-link--primary is-underline el-link-va-baseline",
                    href: "https://live.bilibili.com/22474988",
                    rel: "noreferrer",
                    target: "_blank"
                  },
                  "22474988"
                ),
                vue.h("span", "发送弹幕再领取奖励。")
              ])
            ])
          ])
        },
        medalTasks: {
          list: {
            title: "黑白名单",
            message: vue.h("p", [
              vue.h("div", "为更精细地控制为哪些粉丝勋章执行任务，你可以使用黑名单或白名单模式。"),
              vue.h("div", [
                vue.h("li", [
                  vue.h("span", "黑名单：仅为"),
                  vue.h("strong", "不在"),
                  vue.h("span", "名单中的粉丝勋章执行任务。")
                ]),
                vue.h("li", [
                  vue.h("span", "白名单：仅为"),
                  vue.h("strong", "在"),
                  vue.h("span", "名单中的粉丝勋章执行任务。")
                ])
              ]),
              vue.h("div", "点击编辑名单按钮，然后使用第一列的多选框即可编辑名单中的粉丝勋章。")
            ])
          },
          like: {
            title: "给主播点赞",
            message: vue.h("p", [
              vue.h("div", "在你的每个粉丝勋章对应的直播间给主播点赞。"),
              vue.h("div", "如果你不希望等级≥20的粉丝勋章熄灭，可以勾选下面的“包含等级≥20的粉丝勋章”。"),
              vue.h("div", "部分直播间无法完成该任务，原因未知。")
            ])
          },
          danmu: {
            title: "发送弹幕",
            message: vue.h("p", [
              vue.h("div", "在你的每个粉丝勋章对应的直播间发送一条弹幕。"),
              vue.h("div", [
                vue.h("span", "点击编辑弹幕按钮编辑发送的弹幕，脚本会从中按顺序循环抽取弹幕发送。"),
                vue.h("span", "部分直播间无法完成该任务，可能的原因有:，"),
                vue.h("li", "你被禁言了"),
                vue.h("li", "发言有粉丝勋章等级要求"),
                vue.h("li", [
                  vue.h("span", "特殊直播间（比如"),
                  vue.h(
                    "a",
                    { href: "https://live.bilibili.com/54", rel: "noreferrer", target: "_blank" },
                    "54"
                  ),
                  vue.h("span", "）")
                ])
              ])
            ])
          },
          watch: {
            title: "观看直播",
            message: vue.h("p", [
              vue.h("div", "完成观看持有粉丝勋章对应主播直播的任务。"),
              vue.h(
                "div",
                "部分直播间因为没有设置直播分区导致任务无法完成。主播当前是否开播不会影响该任务的完成。"
              )
            ])
          }
        }
      },
      OtherTasks: {
        groupSign: {
          title: "应援团签到",
          message: "完成应援团签到任务。"
        },
        silverToCoin: {
          title: "银瓜子换硬币",
          message: vue.h("p", [
            vue.h("div", "把银瓜子兑换为硬币。"),
            vue.h("div", "具体兑换规则请点击直播间页面的“立即充值→银瓜子商店”查看。")
          ])
        },
        coinToSilver: {
          title: "硬币换银瓜子",
          message: vue.h("p", [
            vue.h("div", "把硬币兑换为银瓜子。"),
            vue.h("div", "具体兑换规则请点击直播间页面的“立即充值→银瓜子商店”查看。")
          ])
        },
        getYearVipPrivilege: {
          title: "领取年度大会员权益",
          message: vue.h("p", [
            vue.h("div", "自动领取年度大会员权益。"),
            vue.h("div", [
              vue.h("span", "具体权益请前往"),
              vue.h(
                "a",
                {
                  href: "https://account.bilibili.com/account/big/myPackage",
                  rel: "noreferrer",
                  target: "_blank"
                },
                "卡券包"
              ),
              vue.h("span", "查看。")
            ])
          ])
        }
      }
    },
    EnhanceExperience: {
      switchLiveStreamQuality: {
        title: "自动切换画质",
        message: vue.h("p", [
          vue.h("div", "打开直播间后自动把播放器切换到指定画质。"),
          vue.h("div", "如果指定画质不存在，则还是使用B站的默认画质。")
        ])
      },
      banp2p: {
        title: "禁用P2P",
        message: vue.h("p", [
          vue.h("div", "禁用直播流的P2P上传/下载"),
          vue.h(
            "div",
            "B站使用WebRTC技术把许多浏览器点对点（P2P）地连接起来，实现视频流和音频流的传输。这样做是为了减轻B站服务器的压力，但是会占用你一定的上行带宽（大约几百kb每秒）。如果你不想被占用上行带宽，可以开启该功能。若开启后发现观看直播时有明显卡顿，请关闭。"
          )
        ])
      }
    }
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-c1d8df5e"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "128",
    height: "128",
    class: "icon",
    viewBox: "0 0 1024 1024"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      fill: "#276BC0",
      d: "M512.67 959.47c-246.343 0-446.76-200.632-446.76-447.24S266.326 64.98 512.67 64.98s446.76 200.642 446.76 447.25-200.416 447.24-446.76 447.24zm0-829.04c-210.291 0-381.38 171.283-381.38 381.8s171.089 381.79 381.38 381.79 381.381-171.273 381.381-381.79-171.09-381.8-381.38-381.8z"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      fill: "#276BC0",
      d: "M447.29 317.172a63.891 63.959 0 1 0 130.76 0 63.891 63.959 0 1 0-130.76 0Zm64.907 503.047c-30.093 0-54.235-24.416-54.235-54.541V482.062c0-30.126 24.142-54.541 54.235-54.541 30.094 0 54.236 24.416 54.236 54.541v283.616c0 30.125-24.142 54.54-54.236 54.54z"
    })
  ], -1));
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "InfoIcon",
    props: {
      id: {}
    },
    setup(__props) {
      const props = __props;
      const open = () => {
        const { title, message } = _.get(help_info, props.id, {
          title: "无",
          message: "无"
        });
        ElementPlus.ElMessageBox({
          title,
          message,
          lockScroll: false,
          autofocus: true,
          confirmButtonText: "OK"
        });
      };
      return (_ctx, _cache) => {
        const _component_el_icon = vue.resolveComponent("el-icon");
        return vue.openBlock(), vue.createBlock(_component_el_icon, {
          class: "info-icon",
          onClick: open
        }, {
          default: vue.withCtx(() => [
            _hoisted_1
          ]),
          _: 1
        });
      };
    }
  });
  const InfoIcon = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c1d8df5e"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "TaskStatusIcon",
    props: {
      status: {}
    },
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_Select = vue.resolveComponent("Select");
        const _component_CloseBold = vue.resolveComponent("CloseBold");
        return _ctx.status === "running" ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
          key: 0,
          class: "status-icon is-loading"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_Loading)
          ]),
          _: 1
        })) : _ctx.status === "done" ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
          key: 1,
          class: "status-icon",
          style: { "color": "#1ab059" }
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_Select)
          ]),
          _: 1
        })) : _ctx.status === "error" ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
          key: 2,
          class: "status-icon",
          style: { "color": "#ff6464" }
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_CloseBold)
          ]),
          _: 1
        })) : vue.createCommentVNode("", true);
      };
    }
  });
  const TaskStatusIcon = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2f9d6050"]]);
  const MyIconsVue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Info: InfoIcon,
    TaskStatus: TaskStatusIcon,
    Tasks: TasksIcon
  }, Symbol.toStringTag, { value: "Module" }));
  (function() {
    if (isTargetFrame()) {
      const app = vue.createApp(App);
      const pinia$1 = pinia.createPinia();
      app.use(ElementPlus);
      app.use(pinia$1);
      const logger = new Logger("main.ts");
      const cacheStore = useCacheStore();
      cacheStore.checkIfMainBLTHRunning();
      if (!cacheStore.isMainBLTHRunning) {
        logger.log("当前脚本是Main BLTH，开始存活心跳");
        cacheStore.startAliveHeartBeat();
      } else {
        logger.log("其它页面上存在正在运行的Main BLTH");
      }
      for (const [key, component] of Object.entries(ElementPlusIconsVue__namespace)) {
        app.component(key, component);
      }
      for (const [key, component] of Object.entries(MyIconsVue)) {
        app.component(key, component);
      }
      app.mount(
        (() => {
          try {
            const app2 = dce("div");
            app2.id = "BLTH";
            document.body.append(app2);
            return app2;
          } catch (e) {
            logger.error("挂载Vue app时发送错误", e);
            return "Error";
          }
        })()
      );
    }
  })();

})(Vue, Pinia, _, luxon, CryptoJS, ElementPlusIconsVue, ElementPlus, hotkeys);
