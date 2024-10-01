// ==UserScript==
// @name            Bilibili Live Tasks Helper
// @name:en         Bilibili Live Tasks Helper
// @name:zh         Bilibili Live Tasks Helper
// @namespace       https://github.com/andywang425
// @version         7.1.9
// @author          andywang425
// @description     Enhancing the experience of watching Bilibili live streaming.
// @description:en  Enhancing the experience of watching Bilibili live streaming.
// @description:zh  增强Bilibili直播观看体验。
// @license         MIT
// @copyright       2024, andywang425 (https://github.com/andywang425)
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDEuMDY1IiBoZWlnaHQ9IjEyNy43NDciIHZpZXdCb3g9IjAgMCAzNy4zMjQgMzMuOCI+PHBhdGggZmlsbD0iIzIwYjBlMyIgZD0iTTg2Ljk2MiAxMTIuMzMyYTIuNjYxIDIuNjYxIDAgMCAxIDIuMjYyIDAgNS41MzYgNS41MzYgMCAwIDEgMS4zODQgMS4wMTFsNS4zMjMgNC42NThoMy44MDVsNS4zMjMtNC42NThhNS41ODkgNS41ODkgMCAwIDEgMS4zODQtMS4wMTEgMi42NjEgMi42NjEgMCAwIDEgMy41NCAyLjIwOSAyLjY2MSAyLjY2MSAwIDAgMS0uNTg2IDEuNzgzIDE0Ljg3NyAxNC44NzcgMCAwIDEtMS4xNzEgMS4wNjUgNy42OTEgNy42OTEgMCAwIDEtLjc0NS42MTJoMy4zMjZhNS42NDIgNS42NDIgMCAwIDEgMy45MTIgMS43NTYgNS42NjkgNS42NjkgMCAwIDEgMS43ODQgMy45MTJ2MTUuMzAzYTEwLjc3OCAxMC43NzggMCAwIDEtLjEzNCAyLjMxNSA1LjkwOCA1LjkwOCAwIDAgMS0yLjY2IDMuNzI2IDUuNzIyIDUuNzIyIDAgMCAxLTMuMDYxLjg1Mkg4Ni4yMTdhMTEuMjg0IDExLjI4NCAwIDAgMS0yLjM5Ni0uMTMzIDUuODgyIDUuODgyIDAgMCAxLTMuNjcyLTIuNjYyIDUuNjk1IDUuNjk1IDAgMCAxLS45MDUtMy4wNnYtMTUuMTQzYTExLjkyMyAxMS45MjMgMCAwIDEgMC0yLjIwOSA1Ljg1NSA1Ljg1NSAwIDAgMSA1LjMyMy00LjczN2gzLjQ4NmMtLjU1OS0uNC0xLjAzOC0uODc4LTEuNTQ0LTEuMzA0YTIuNjYxIDIuNjYxIDAgMCAxLS44NTEtMi4xODMgMi42NjEgMi42NjEgMCAwIDEgMS4zMDQtMi4xMDJtLS42MTIgMTAuMzI2YTIuNjYxIDIuNjYxIDAgMCAwLTIuMTAzIDEuOTE2IDMuNTkzIDMuNTkzIDAgMCAwIDAgMS4wMTF2MTIuNTg4YTIuNjYxIDIuNjYxIDAgMCAwIDEuODM3IDIuNjYyIDMuNTEzIDMuNTEzIDAgMCAwIDEuMTQ0LjE4NmgyMS42MzdhMi42NjEgMi42NjEgMCAwIDAgMi41MjgtMS41NyAzLjcyNiAzLjcyNiAwIDAgMCAuMjY2LTEuNzU3di0xMS43MWE0LjQ3MSA0LjQ3MSAwIDAgMCAwLTEuMjc3IDIuNjYxIDIuNjYxIDAgMCAwLTEuNzMtMS44MSA0LjI4NSA0LjI4NSAwIDAgMC0xLjY1LS4yMzlIODcuNjAxYTguODg5IDguODg5IDAgMCAwLTEuMjUxIDB6bTAgMCIgc3R5bGU9InN0cm9rZS13aWR0aDouMDMzMDcyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc5LjE5MyAtMTEyLjA4KSIvPjxwYXRoIGQ9Ik04OC45NyAxMjguNjM2Yy4zNjMuMzc3Ljc0NS43NDcgMS4wODggMS4xNDIuNTk3LjY4NyAxLjExOCAxLjE5NyAxLjY2NiAxLjgwOS0uMTI5LTEuMTE3IDEuMzA0LTEuMTk4LjA3NC0xLjc1Ny0uNDA4LjQxNy0uOTQxLjg4NC0xLjM2IDEuMjIzLS4zOTIuMzE2LS44NjMuNjctMS4yMzUuOTUyLTEuOTA3IDEuNDQzLjIyNiA0LjA1MyAyLjEzIDIuNjA3IDAgMCAyLTEuNTM1IDIuODA3LTIuMzAxLjQ0LS40MTcuNjgtLjk1Ni43Mi0xLjU5Mi4wNC0uNjU0LS41MzUtMS4yNC0uNzk0LTEuNDk4LS45Mi0uOTE0LTEuNzQzLTEuOTY4LTIuNTUtMi44MTItMS41NzUtMS44LTQuMTIuNDI4LTIuNTQ2IDIuMjI3ek0xMDYuOTc5IDEyOC42MzZjLS4zNjMuMzc3LS43NDUuNzQ3LTEuMDg4IDEuMTQyLS41OTcuNjg3LTEuMTE4IDEuMTk3LTEuNjY2IDEuODA5LjEyOS0xLjExNy0xLjMwNC0xLjE5OC0uMDc0LTEuNzU3LjQwOC40MTcuOTQxLjg4NCAxLjM2IDEuMjIzLjM5Mi4zMTYuODYzLjY3IDEuMjM1Ljk1MiAxLjkwNyAxLjQ0My0uMjI2IDQuMDUzLTIuMTMgMi42MDcgMCAwLTItMS41MzUtMi44MDctMi4zMDEtLjQ0LS40MTctLjY4LS45NTYtLjcyLTEuNTkyLS4wNC0uNjU0LjUzNS0xLjI0Ljc5NC0xLjQ5OC45Mi0uOTE0IDEuNzQzLTEuOTY4IDIuNTUtMi44MTIgMS41NzUtMS44IDQuMTIuNDI4IDIuNTQ2IDIuMjI3eiIgc3R5bGU9ImZpbGw6IzIwYjBlMztmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6LjUyNDE1OTtzdHJva2UtZGFzaGFycmF5Om5vbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03OS4xOTMgLTExMi4wOCkiLz48L3N2Zz4NCg==
// @homepageURL     https://github.com/andywang425/BLTH
// @supportURL      https://github.com/andywang425/BLTH/issues
// @downloadURL     https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.min.user.js
// @updateURL       https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.meta.js
// @match           *://live.bilibili.com/1*
// @match           *://live.bilibili.com/2*
// @match           *://live.bilibili.com/3*
// @match           *://live.bilibili.com/4*
// @match           *://live.bilibili.com/5*
// @match           *://live.bilibili.com/6*
// @match           *://live.bilibili.com/7*
// @match           *://live.bilibili.com/8*
// @match           *://live.bilibili.com/9*
// @match           *://live.bilibili.com/blanc/1*
// @match           *://live.bilibili.com/blanc/2*
// @match           *://live.bilibili.com/blanc/3*
// @match           *://live.bilibili.com/blanc/4*
// @match           *://live.bilibili.com/blanc/5*
// @match           *://live.bilibili.com/blanc/6*
// @match           *://live.bilibili.com/blanc/7*
// @match           *://live.bilibili.com/blanc/8*
// @match           *://live.bilibili.com/blanc/9*
// @require         https://unpkg.com/vue@3.5.10/dist/vue.global.prod.js
// @require         data:application/javascript,%3Bwindow.Vue%3DVue%3Bwindow.VueDemi%3DVue%3B
// @require         https://unpkg.com/element-plus@2.8.4/dist/index.full.min.js
// @require         https://unpkg.com/@element-plus/icons-vue@2.3.1/dist/index.iife.min.js
// @require         https://unpkg.com/pinia@2.2.3/dist/pinia.iife.prod.js
// @require         https://unpkg.com/vue-draggable-plus@0.5.3/dist/vue-draggable-plus.iife.js
// @require         https://unpkg.com/lodash@4.17.21/lodash.min.js
// @require         https://unpkg.com/hotkeys-js@3.13.7/dist/hotkeys.min.js
// @require         https://unpkg.com/luxon@3.5.0/build/global/luxon.min.js
// @require         https://unpkg.com/crypto-js@4.2.0/crypto-js.js
// @resource        element-plus/dist/index.css  https://unpkg.com/element-plus@2.8.4/dist/index.css
// @connect         api.bilibili.com
// @connect         api.live.bilibili.com
// @connect         api.vc.bilibili.com
// @connect         passport.bilibili.com
// @connect         live.bilibili.com
// @connect         live-trace.bilibili.com
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @run-at          document-start
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .title[data-v-f383a843]{padding-left:20px;align-items:baseline;display:flex}.header-big-text[data-v-f383a843]{font-size:var(--big-text-size);align-self:unset}.header-small-text[data-v-f383a843]{font-size:var(--small-text-size);align-self:unset;margin-left:10px;--small-text-size: 18px}.collapse-btn[data-v-f383a843]{display:flex;justify-content:center;align-items:center;height:100%;float:left;cursor:pointer}#aside-el-menu[data-v-8ecf0b13]{height:100%}.avatar-wrap[data-v-584fbcd9]{width:80px;height:80px}.avatar[data-v-584fbcd9]{display:flex;justify-content:center;align-items:center;border-radius:50%}.radio-group[data-v-584fbcd9]{display:block;font-size:inherit}.label-text[data-v-1cb0d081]{color:var(--el-text-color-primary);line-height:32px}.base[data-v-24895187]{z-index:1003;position:absolute;background-color:#fff;border-bottom:1px solid #e3e5e7;border-left:1px solid #e3e5e7;border-right:1px solid #e3e5e7}.header[data-v-24895187]{position:relative;box-sizing:border-box;width:100%;font-size:var(--big-text-size);align-items:center;display:flex;border-bottom:1px solid #e3e5e7;height:60px;--big-text-size: 25px}.aside[data-v-24895187]{width:auto}.aside #aside-el-menu[data-v-24895187]:not(.el-menu--collapse){width:150px}.main[data-v-24895187]{--main-top-botton-padding: calc(var(--el-main-padding) * .625);padding-top:var(--main-top-botton-padding);padding-bottom:var(--main-top-botton-padding)}.fade-enter-active[data-v-24895187]{animation:fade-in linear .2s}.info-icon[data-v-38289ed3]{font-size:var(--el-font-size-base);cursor:pointer}.status-icon[data-v-b4254e0f]{font-size:var(--el-font-size-base)}.blth_btn{background-color:#23ade5;font-size:small;margin-inline-start:5px;color:#fff;border-radius:4px;border:none;padding:5px;cursor:pointer;box-shadow:0 0 2px #00000075;line-height:10px;margin-left:15px}.blth_btn:hover{background-color:#1097cc}.blth_btn:hover:active{background-color:#0e86b6;position:relative;top:1px}.el-message-box li{list-style:initial}@media screen and (min-width: 1930px){html[lab-style*=adaptive] .base{zoom:.9375}}@media screen and (min-width: 2058px){html[lab-style*=adaptive] .base{zoom:.75}}@media screen and (min-width: 2570px){html[lab-style*=adaptive] .base{zoom:calc(2 / 3)}}@media screen and (min-width: 3210px){html[lab-style*=adaptive] .base{zoom:.5}}@media screen and (min-width: 3850px){html[lab-style*=adaptive] .base{zoom:.46875}} ");

(async function (vue, pinia$1, _, ElementPlusIconsVue, CryptoJS, luxon, ElementPlus, vueDraggablePlus, hotkeys) {
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
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const defaultValues = {
    ui: {
      isCollapse: false,
      isShowPanel: true,
      activeMenuIndex: "MainSiteTasks",
      panelWidthPercent: 40,
      medalInfoPanelSortMode: false
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
          medalTasks: {
            light: {
              enabled: false,
              mode: "danmu",
              danmuList: [
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
            watch: {
              enabled: false,
              time: 25,
              _watchingProgress: {},
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
        },
        noReport: {
          enabled: false
        },
        noSleep: {
          enabled: false
        },
        invisibility: {
          enabled: false
        }
      },
      RemoveElement: {
        removePKBox: {
          enabled: false
        },
        removeLiveWaterMark: {
          enabled: false
        },
        removeShopPopover: {
          enabled: false
        },
        removeGameParty: {
          enabled: false
        },
        removeGiftPopover: {
          enabled: false
        },
        removeMicPopover: {
          enabled: false
        },
        removeComboCard: {
          enabled: false
        },
        removeRank: {
          enabled: false
        },
        removeHeaderStuff: {
          enabled: false
        },
        removeFlipView: {
          enabled: false
        },
        removeRecommendRoom: {
          enabled: false
        },
        removeLiveMosaic: {
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
     * 递归合并配置项。删除当前配置中不存在于默认配置的键，补上相对于默认配置缺少的键值，其它键值不变
     *
     * 该方法不会修改当前配置
     *
     * @param currentConfig 当前配置
     * @param defaultConfig 默认配置
     * @returns 修改后的当前配置
     * @example
     *
     * const current_config = { enabled: true, details: { type: 'efg', status: 'ok' }, msg: 'hi' };
     * const default_config = { enabled: false, details: { type: 'abc', num: 1 } };
     *
     * mergeConfigs(current_config, default_config);
     * // => { enabled: true, details: { type: 'efg', num: 1 } }
     */
    static mergeConfigs(currentConfig, defaultConfig) {
      const config = _.pick(currentConfig, _.keys(defaultConfig));
      _.defaults(config, defaultConfig);
      _.forOwn(config, (value, key, object) => {
        if (_.isPlainObject(value) && _.isPlainObject(defaultConfig[key]) && !_.isEmpty(defaultConfig[key])) {
          object[key] = this.mergeConfigs(value, defaultConfig[key]);
        }
      });
      return config;
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
  const index2name = {
    MainSiteTasks: "主站任务",
    LiveTasks: "直播任务",
    OtherTasks: "其它任务",
    EnhanceExperience: "体验优化",
    RemoveElement: "移除元素",
    ScriptSettings: "设置"
  };
  const useUIStore = pinia$1.defineStore("ui", () => {
    const uiConfig = vue.reactive(Storage.getUiConfig());
    const activeMenuName = vue.computed(() => index2name[uiConfig.activeMenuIndex]);
    const livePlayerRect = vue.reactive({
      top: 0,
      left: 0,
      height: 0,
      width: 0
    });
    const windowScrollPosition = vue.reactive({ x: 0, y: 0 });
    const panelStyle = vue.computed(() => ({
      // 此处若使用最新的滚动条位置（window.scrollX/Y），用户在调整控制面板宽度时可能导致面板在垂直方向上错位
      top: `${livePlayerRect.top + windowScrollPosition.y}px`,
      left: `${livePlayerRect.left + windowScrollPosition.x}px`,
      height: `${livePlayerRect.height}px`,
      width: `${livePlayerRect.width * uiConfig.panelWidthPercent / 100}px`
    }));
    const isShowPanelButtonText = vue.computed(
      () => uiConfig.isShowPanel ? "隐藏控制面板" : "显示控制面板"
    );
    const scrollBarHeight = vue.computed(() => `${livePlayerRect.height - 60}px`);
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
      livePlayerRect,
      windowScrollPosition,
      panelStyle,
      scrollBarHeight,
      uiConfig,
      changeCollapse,
      changeShowPanel,
      setActiveMenuIndex
    };
  });
  const _hoisted_1$2 = { class: "title" };
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "PanelHeader",
    setup(__props) {
      const uiStore = useUIStore();
      return (_ctx, _cache) => {
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_text = vue.resolveComponent("el-text");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", {
            class: "collapse-btn",
            onClick: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => vue.unref(uiStore).changeCollapse && vue.unref(uiStore).changeCollapse(...args))
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
          vue.createElementVNode("div", _hoisted_1$2, [
            vue.createVNode(_component_el_text, {
              tag: "b",
              class: "header-big-text"
            }, {
              default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                vue.createTextVNode("控制面板")
              ])),
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
  const PanelHeader = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-f383a843"]]);
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
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
        },
        {
          icon: "Scissor",
          title: "移除元素",
          index: "RemoveElement"
        },
        {
          icon: "Setting",
          title: "设置",
          index: "ScriptSettings"
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
          onSelect: _cache[0] || (_cache[0] = (index) => vue.unref(uiStore).setActiveMenuIndex(index)),
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
                        index: subItem.index,
                        key: subItem.index
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
        }, 8, ["default-active", "style", "collapse"]);
      };
    }
  });
  const PanelAside = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-8ecf0b13"]]);
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
    let end = luxon.DateTime.local(now.year, now.month, now.day, endHour, endMinute);
    if (start > end) {
      end = end.plus({ days: 1 });
    }
    return now >= start && now < end;
  }
  function ts() {
    return Math.round(luxon.DateTime.now().toSeconds());
  }
  function tsm() {
    return luxon.DateTime.now().toMillis();
  }
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(char) {
      const randomInt = 16 * Math.random() | 0;
      return ("x" === char ? randomInt : 3 & randomInt | 8).toString(16);
    });
  }
  function sleep(miliseconds) {
    return new Promise((resolve2) => setTimeout(resolve2, miliseconds));
  }
  function getFilenameFromUrl(url) {
    return url.substring(url.lastIndexOf("/") + 1).split(".")[0];
  }
  function addURLParams(url, params) {
    if (!params) {
      return url;
    }
    if (typeof params === "string") {
      return url + "?" + params;
    } else {
      return url + "?" + new URLSearchParams(params).toString();
    }
  }
  function wbiSign(params) {
    params.wts = ts();
    const query = Object.keys(params).sort().map((key) => {
      const value = params[key].toString().replace(/[!'()*]/g, "");
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join("&");
    const wbiSign2 = CryptoJS.MD5(query + useBiliStore().wbiSalt).toString();
    return query + "&w_rid=" + wbiSign2;
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
  function getUrlFromFetchInput(input) {
    if (typeof input === "string") {
      return input;
    } else if (input instanceof URL) {
      return input.toString();
    } else if (input instanceof Request) {
      return input.url;
    } else {
      return "Incorrect input";
    }
  }
  function waitForMoment(moment) {
    switch (moment) {
      case "document-start": {
        return Promise.resolve();
      }
      case "document-head": {
        return new Promise((resolve2) => {
          if (document.head) {
            resolve2();
          } else {
            const observer = new MutationObserver(() => {
              if (document.head) {
                observer.disconnect();
                resolve2();
              }
            });
            observer.observe(document.documentElement, { childList: true });
          }
        });
      }
      case "document-body": {
        return new Promise((resolve2) => {
          if (document.body) {
            resolve2();
          } else {
            const observer = new MutationObserver(() => {
              if (document.body) {
                observer.disconnect();
                resolve2();
              }
            });
            observer.observe(document.documentElement, { childList: true });
          }
        });
      }
      case "document-end": {
        return new Promise((resolve2) => {
          if (document.readyState !== "loading") {
            resolve2();
          } else {
            document.addEventListener("DOMContentLoaded", () => resolve2());
          }
        });
      }
      case "window-load": {
        return new Promise((resolve2) => {
          if (document.readyState === "complete") {
            resolve2();
          } else {
            window.addEventListener("load", () => resolve2());
          }
        });
      }
      default: {
        return Promise.reject("Illegal moment");
      }
    }
  }
  function arrayToMap(arr) {
    return new Map(arr.map((value, index) => [value, index]));
  }
  const useBiliStore = pinia$1.defineStore("bili", () => {
    const BilibiliLive2 = vue.ref();
    const cookies = vue.ref();
    const userInfo = vue.ref();
    const giftConfig = vue.ref();
    const dailyRewardInfo = vue.ref();
    const dynamicVideos = vue.ref();
    const fansMedals = vue.ref();
    const filteredFansMedals = vue.computed(
      () => {
        var _a;
        return ((_a = fansMedals.value) == null ? void 0 : _a.filter((m) => m.room_info.room_id !== 0)) ?? [];
      }
    );
    const fansMedalsStatus = vue.ref();
    const wbiSalt = vue.computed(() => {
      if (!userInfo.value) {
        return "";
      }
      const imgKey = getFilenameFromUrl(userInfo.value.wbi_img.img_url);
      const subKey = getFilenameFromUrl(userInfo.value.wbi_img.sub_url);
      const imgAndSubKey = imgKey + subKey;
      return [
        46,
        47,
        18,
        2,
        53,
        8,
        23,
        32,
        15,
        50,
        10,
        31,
        58,
        3,
        45,
        35,
        27,
        43,
        5,
        49,
        33,
        9,
        42,
        19,
        29,
        28,
        14,
        39,
        12,
        38,
        41,
        13,
        37,
        48,
        7,
        16,
        24,
        55,
        40,
        61,
        26,
        17,
        0,
        1,
        60,
        51,
        30,
        4,
        22,
        25,
        54,
        21,
        56,
        59,
        6,
        63,
        57,
        62,
        11,
        36,
        20,
        34,
        44,
        52
      ].map((n) => imgAndSubKey[n]).join("").slice(0, 32);
    });
    return {
      BilibiliLive: BilibiliLive2,
      userInfo,
      giftConfig,
      cookies,
      dailyRewardInfo,
      dynamicVideos,
      fansMedals,
      filteredFansMedals,
      fansMedalsStatus,
      wbiSalt
    };
  });
  let Request$1 = class Request2 {
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
     */
    get(url, params, otherDetails) {
      url = addURLParams(this.url_prefix + url, params);
      return new Promise((resolve2, reject2) => {
        const defaultDetails = {
          method: "GET",
          url,
          responseType: "json",
          headers: {
            Accept: "application/json, text/plain, */*",
            Referer: this.origin,
            Origin: this.origin,
            "Sec-Fetch-Site": "same-site"
          },
          onload: function(response) {
            resolve2(response.response);
          },
          onerror: function(err) {
            reject2(new Error(JSON.stringify(err)));
          }
        };
        const details = _.defaultsDeep(otherDetails, defaultDetails);
        _GM_xmlhttpRequest(details);
      });
    }
    /**
     * 发起一个 POST 请求
     * @param url 请求 URL 除去前缀的部分
     * @param data POST data
     * @param otherDetails GM_xmlhttpRequest 的 details 参数（特别的，可以提供 params 属性作为 URL 参数）
     */
    post(url, data, otherDetails) {
      const headers = {
        Accept: "application/json, text/plain, */*",
        Referer: this.origin,
        Origin: this.origin,
        "Sec-Fetch-Site": "same-site",
        "Content-Type": "application/x-www-form-urlencoded"
      };
      if (data instanceof FormData) {
        delete headers["Content-Type"];
      } else if (typeof data === "object") {
        data = new URLSearchParams(data).toString();
      }
      url = addURLParams(this.url_prefix + url, otherDetails == null ? void 0 : otherDetails.params);
      otherDetails == null ? true : delete otherDetails.params;
      return new Promise((resolve2, reject2) => {
        const defaultDetails = {
          method: "POST",
          url,
          data,
          responseType: "json",
          headers,
          onload: function(response) {
            resolve2(response.response);
          },
          onerror: function(err) {
            reject2(new Error(JSON.stringify(err)));
          }
        };
        const details = _.defaultsDeep(otherDetails, defaultDetails);
        _GM_xmlhttpRequest(details);
      });
    }
  };
  const request = {
    live: new Request$1("https://api.live.bilibili.com", "https://live.bilibili.com"),
    liveTrace: new Request$1("https://live-trace.bilibili.com", "https://live.bilibili.com"),
    passport: new Request$1("https://passport.bilibili.com", "https://passport.bilibili.com/"),
    main: new Request$1("https://api.bilibili.com", "https://www.bilibili.com"),
    vc: new Request$1("https://api.vc.bilibili.com", "https://message.bilibili.com/"),
    raw: new Request$1()
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
      /**
       * 网页直播签到功能已不存在，但该API仍可以使用（并且也存在于B站js代码中）
       */
      getSignInfo: () => {
        return request.live.get("/xlive/web-ucenter/v1/sign/WebGetSignInfo");
      },
      fansMedalPanel: (page, page_size = 10) => {
        return request.live.get("/xlive/app-ucenter/v1/fansMedal/panel", {
          page,
          page_size
        });
      },
      sendMsg: (msg, roomid, room_type = 0, mode = 1, jumpfrom = 0, fontsize = 25, color = 16777215, bubble = 0, reply_mid = 0, reply_attr = 0, replay_dmid = "", statistics = '{"appId":100,"platform":5}') => {
        const biliStore = useBiliStore();
        const bili_jct = biliStore.cookies.bili_jct;
        return request.live.post(
          "/msg/send",
          packFormData({
            bubble,
            msg,
            color,
            mode,
            room_type,
            jumpfrom,
            reply_mid,
            reply_attr,
            replay_dmid,
            statistics,
            fontsize,
            rnd: ts(),
            roomid,
            csrf: bili_jct,
            csrf_token: bili_jct
          })
        );
      },
      likeReport: (room_id, anchor_id, click_time = 1, visit_id = "") => {
        const biliStore = useBiliStore();
        const bili_jct = biliStore.cookies.bili_jct;
        const uid = biliStore.BilibiliLive.UID;
        return request.live.post("/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3", {
          click_time,
          room_id,
          uid,
          anchor_id,
          csrf_token: bili_jct,
          csrf: bili_jct,
          visit_id
        });
      },
      /**
       * 该API只在带有多层iframe（背景很好看）的直播间中被使用，但参数填任意直播间均可
       */
      getInfoByRoom: (room_id, web_location = "444.8") => {
        return request.live.get(
          "/xlive/web-room/v1/index/getInfoByRoom",
          wbiSign({
            room_id,
            web_location
          })
        );
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
      },
      wearMedal: (medal_id, visit_id = "") => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.live.post("/xlive/web-room/v1/fansMedal/wear", {
          medal_id,
          csrf_token: bili_jct,
          csrf: bili_jct,
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
      dynamicAll: (type = "video", page = 1, timezone_offset = -480, platform = "web", features = "itemOpusStyle,listOnlyfans,opusBigCover,onlyfansVote,decorationCard,onlyfansAssetsV2,forwardListHidden,ugcDelete", web_location = "333.1365", x_bili_device_req_json = '{"platform":"web","device":"pc"}', x_bili_web_req_json = '{"spm_id":"333.1365"}') => {
        return request.main.get(
          "/x/polymer/web-dynamic/v1/feed/all",
          {
            timezone_offset,
            type,
            platform,
            page,
            features,
            web_location,
            x_bili_device_req_json,
            x_bili_web_req_json
          },
          {
            Origin: "https://t.bilibili.com",
            Referer: "https://t.bilibili.com/"
          }
        );
      },
      videoHeartbeat: (aid, cid = 1e9, type = 3, sub_type = 0, dt = 2, play_type = 1, realtime = 61, played_time = 62, real_played_time = 62, refer_url = "https://t.bilibili.com/?tab=video", quality = 64, video_duration = 180, last_play_progress_time = 62, max_play_progress_time = 62, outer = 0, spmid = "333.788.0.0", from_spmid = "333.1365.list.card_archive.click", session = uuid().replaceAll("-", ""), extra = '{"player_version":"4.8.43"}', web_location = 1315873) => {
        const biliStore = useBiliStore();
        const start_ts = ts();
        const mid = useBiliStore().userInfo.mid;
        return request.main.post(
          "/x/click-interface/web/heartbeat",
          {
            start_ts,
            mid,
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
            outer,
            spmid,
            from_spmid,
            session,
            extra,
            csrf: biliStore.cookies.bili_jct
          },
          {
            params: wbiSign({
              w_start_ts: start_ts,
              w_mid: mid,
              w_aid: aid,
              w_dt: dt,
              w_realtime: realtime,
              w_played_time: played_time,
              w_real_played_time: real_played_time,
              w_video_duration: video_duration,
              w_last_play_progress_time: last_play_progress_time,
              web_location
            })
          }
        );
      },
      share: (aid, source = "pc_client_normal", eab_x = 2, ramval = 0, ga = 1, referer = "") => {
        const bili_jct = useBiliStore().cookies.bili_jct;
        return request.main.post("/x/web-interface/share/add", {
          eab_x,
          ramval,
          referer,
          source,
          aid,
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
        myPrivilege: (web_location = "333.33") => {
          return request.main.get(
            "/x/vip/privilege/my",
            {
              web_location
            },
            {
              headers: {
                Referer: "https://account.bilibili.com/account/big/myPackage",
                Origin: "https://account.bilibili.com"
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
                Origin: "https://account.bilibili.com"
              }
            }
          );
        },
        addExperience: () => {
          const biliStore = useBiliStore();
          const mid = biliStore.BilibiliLive.UID;
          const buvid = biliStore.cookies.buvid3;
          const bili_jct = biliStore.cookies.bili_jct;
          return request.main.post(
            "/x/vip/experience/add",
            {
              mid,
              buvid,
              csrf: bili_jct
            },
            {
              headers: {
                Referer: "https://account.bilibili.com/big",
                Origin: "https://account.bilibili.com"
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
      __publicField(this, "title");
      this.title = title;
      this.prefix_title_str = title.split("_").join("][");
    }
    get prefix() {
      return [
        `%c${this.NAME}%c[${(/* @__PURE__ */ new Date()).toLocaleString()}]%c[${this.prefix_title_str}]%c:`,
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
       * @example config: this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.login
       */
      __publicField(this, "config");
      this.moduleName = moduleName;
      this.logger = new Logger(this.moduleName);
    }
    /**
     * 模块是否启用，默认通过 config.enabled 判断
     *
     * 如果没有 config.enabled 属性，则默认启用（比如默认模块）
     */
    isEnabled() {
      var _a;
      return ((_a = this.config) == null ? void 0 : _a.enabled) ?? true;
    }
    /**
     * 如果需要在控制面板上显示模块状态，推荐添加一个 status setter 用来设置模块状态
     *
     * @example
     * set status(s: moduleStatus) {
     *    this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.login = s
     * }
     */
    set status(_s) {
      throw new Error("Method not implemented.");
    }
    /**
     * 运行模块
     *
     * 默认模块必须返回一个空的Promise，
     * 其它模块若需要使用 await 可以返回一个空的Promise，否则无返回值
     */
    run() {
      throw new Error("Method not implemented.");
    }
  }
  /**
   * 当脚本在多个页面上运行的时候，该模块是否要在每个页面上运行
   *
   * 默认false，即只在Main BLTH运行的页面上运行
   *
   * 该选项为 false 时如果要确保模块不会重复运行，还需将 onFrame 设置为 target 或 top
   */
  __publicField(BaseModule, "runOnMultiplePages", false);
  /**
   * 模块运行时机，默认 document-body
   *
   * `document-start`: 尽可能早，与脚本注入时机相同
   *
   * `document-head`: `document.head`刚刚出现后
   *
   * `document-body`: `document.body`刚刚出现后
   *
   * `document-end`: `document`的`DOMContentLoaded`事件触发后
   *
   * `window-load`: `window`的`load`事件触发后
   *
   * 默认模块的模块运行时机总是为 document-body
   */
  __publicField(BaseModule, "runAt", "document-body");
  /**
   * 模块运行的 frame，默认 target
   *
   * `all`: 所有符合脚本`@match`规则的 frame
   *
   * `target`: window.BilibiliLive 存在的那个 frame
   *
   * `top`: 顶层 frame (`window.top`)
   *
   * 如果设置为 target，那么至少要等到`document-body`时刻才能运行
   *
   * 默认模块运行的 frame 总是为 target
   */
  __publicField(BaseModule, "onFrame", "target");
  /**
   * 是否要等默认模块运行完了再运行，默认 true
   *
   * 如果设置为 true，那么就不能保证该模块被及时地执行
   *
   * 因为默认模块的运行时机总是 document-body，而且默认模块的运行时间是不确定的
   */
  __publicField(BaseModule, "runAfterDefault", true);
  class ModuleError extends Error {
    constructor(moduleName, message) {
      super(message);
      __publicField(this, "name", "ModuleError");
      __publicField(this, "moduleName");
      this.moduleName = moduleName;
    }
  }
  class ModuleCriticalError extends ModuleError {
    constructor(moduleName, message) {
      super(moduleName, message);
      __publicField(this, "name", "ModuleCriticalError");
      __publicField(this, "moduleName");
      this.moduleName = moduleName;
    }
  }
  class UserInfo extends BaseModule {
    /**
     * 通过 BAPI.main.nav 获取用户基本信息
     */
    async getUserInfo() {
      try {
        const response = await BAPI.main.nav();
        this.logger.log("BAPI.main.nav response", response);
        if (response.code === 0) {
          return response.data;
        } else {
          throw new Error(`响应 code 不为 0: ${response.message}`);
        }
      } catch (error) {
        throw new ModuleCriticalError(this.moduleName, `获取用户信息出错: ${error.message}`);
      }
    }
    async run() {
      const biliStore = useBiliStore();
      biliStore.userInfo = await this.getUserInfo();
      setTimeout(
        () => this.run().catch((reason) => this.logger.error(reason)),
        delayToNextMoment(0, 4).ms
      );
    }
  }
  class DailyRewardInfo extends BaseModule {
    /**
     * 获取今日主站每日任务的完成情况
     */
    async getDailyRewardInfo() {
      try {
        const response = await BAPI.main.reward();
        this.logger.log("BAPI.main.reward response", response);
        if (response.code === 0) {
          return response.data;
        } else {
          throw new Error(`响应 code 不为 0: ${response.message}`);
        }
      } catch (error) {
        throw new ModuleError(this.moduleName, `获取主站每日任务完成情况出错: ${error.message}`);
      }
    }
    async run() {
      const biliStore = useBiliStore();
      const mainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks;
      if (Object.values(mainSiteTasks).some(
        (t) => t.enabled && !isTimestampToday(t._lastCompleteTime, 0, 4)
      )) {
        biliStore.dailyRewardInfo = await this.getDailyRewardInfo();
      }
      setTimeout(
        () => this.run().catch((reason) => this.logger.error(reason)),
        delayToNextMoment(0, 4).ms
      );
    }
  }
  class DynamicVideos extends BaseModule {
    /**
     * 从动态中获取一页视频的信息
     *
     * 每日观看视频，每日分享视频，每日投币都会用到
     */
    async getDynamicVideos() {
      try {
        const response = await BAPI.main.dynamicAll("video");
        this.logger.log("BAPI.main.dynamicAll response", response);
        if (response.code === 0) {
          return response.data.items;
        } else {
          throw new Error(`响应 code 不为 0: ${response.message}`);
        }
      } catch (error) {
        throw new ModuleError(this.moduleName, `获取主站每日任务完成情况出错: ${error.message}`);
      }
    }
    async run() {
      const biliStore = useBiliStore();
      const mainSiteTasks = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks;
      const taskValues = [mainSiteTasks.watch, mainSiteTasks.share, mainSiteTasks.coin];
      if (taskValues.some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime, 0, 4))) {
        biliStore.dynamicVideos = await this.getDynamicVideos();
      }
      setTimeout(
        () => this.run().catch((reason) => this.logger.error(reason)),
        delayToNextMoment(0, 4).ms
      );
    }
  }
  class FansMetals extends BaseModule {
    /**
     * 获取粉丝勋章
     *
     * @param pages 获取的页数
     */
    async getFansMetals(pages = Infinity) {
      const fansMetalList = [];
      let total_page = 1;
      try {
        const firstPageResponse = await BAPI.live.fansMedalPanel(1);
        this.logger.log("BAPI.live.fansMedalPanel(1) response", firstPageResponse);
        if (firstPageResponse.code === 0) {
          total_page = firstPageResponse.data.page_info.total_page;
          fansMetalList.push(...firstPageResponse.data.special_list, ...firstPageResponse.data.list);
        } else {
          throw new Error(`获取粉丝勋章列表第1页失败: ${firstPageResponse.message}`);
        }
        for (let page = 2; page <= Math.min(total_page, pages); page++) {
          const response = await BAPI.live.fansMedalPanel(page);
          this.logger.log(`BAPI.live.fansMedalPanel(${page}) response`, response);
          if (firstPageResponse.code === 0) {
            fansMetalList.push(...response.data.list);
          } else {
            this.logger.error(
              `获取粉丝勋章列表第${page}页失败，提前结束获取`,
              firstPageResponse.message
            );
            return fansMetalList;
          }
          await sleep(_.random(300, 500));
        }
        return fansMetalList;
      } catch (error) {
        useBiliStore().fansMedalsStatus = "error";
        throw new ModuleError(this.moduleName, `获取粉丝勋章列表出错: ${error.message}`);
      }
    }
    async run() {
      const biliStore = useBiliStore();
      const emitter = useModuleStore().emitter;
      emitter.off("Default_FansMedals");
      emitter.on("Default_FansMedals", async () => {
        biliStore.fansMedalsStatus = "loading";
        biliStore.fansMedals = await this.getFansMetals(Infinity);
        biliStore.fansMedalsStatus = "loaded";
      });
      const medalTasks = this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks;
      const taskValues = [medalTasks.light, medalTasks.watch];
      if (taskValues.some((t) => t.enabled && !isTimestampToday(t._lastCompleteTime, 0, 4))) {
        biliStore.fansMedalsStatus = "loading";
        biliStore.fansMedals = await this.getFansMetals();
        biliStore.fansMedalsStatus = "loaded";
      }
      setTimeout(
        () => this.run().catch((reason) => this.logger.error(reason)),
        delayToNextMoment(0, 4).ms
      );
    }
  }
  class Cookie {
    /**
     * 获取所有 cookies
     */
    static getAll() {
      if (document.cookie === "") return {};
      const cookies = document.cookie.split("; ");
      const result = {};
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=", 2);
        result[decodeURIComponent(name)] = decodeURIComponent(value);
      }
      return result;
    }
    /**
     * 获取指定名称的一个或多个 cookies
     * @param names cookie 名称或 cookie 名称数组
     * @param defaultValue 当 cookie 不存在时使用的默认值，默认 undefined
     */
    static get(names, defaultValue) {
      const cookies = this.getAll();
      if (Array.isArray(names)) {
        const result = {};
        for (const name of names) {
          result[name] = cookies[name] ? cookies[name] : defaultValue;
        }
        return result;
      } else {
        return cookies[names] ? cookies[names] : defaultValue;
      }
    }
    /**
     * 获取一组 cookies，如果有 cookie 未获取到，会反复获取直到超时为止
     *
     * TODO: 等 cookieStore 普及后使用监听取代轮询
     *
     * @param names 要获取的 cookie 名称数组
     * @param interval 获取间隔，默认 300 毫秒
     * @param timeout 超时时间，若留空则永不超时
     */
    static getAsync(names, interval = 300, timeout) {
      return new Promise((resolve2, reject2) => {
        let remainCookieNames = [...names];
        const cookies = this.get(remainCookieNames);
        remainCookieNames = remainCookieNames.filter((r) => !cookies[r]);
        if (remainCookieNames.length === 0) {
          resolve2(cookies);
          return;
        }
        let timeoutTimer;
        const timer = setInterval(() => {
          Object.assign(cookies, this.get(remainCookieNames));
          remainCookieNames = remainCookieNames.filter((r) => !cookies[r]);
          if (remainCookieNames.length === 0) {
            if (timeout) clearTimeout(timeoutTimer);
            clearInterval(timer);
            resolve2(cookies);
          }
        }, interval);
        if (timeout) {
          timeoutTimer = setTimeout(() => {
            clearInterval(timer);
            reject2(new Error(`获取以下 cookie 超时：${remainCookieNames}`));
          }, timeout);
        }
      });
    }
  }
  class Cookies extends BaseModule {
    /**
     * 获取 Cookies
     *
     * bili_jct: 常作为参数 csrf 在请求中出现
     * LIVE_BUVID: 如果用户以前从来没看过直播，此时可能为 null
     * buvid3: 作为参数 buvid 在请求中出现，目前仅在主站 API 中使用
     */
    getCookies() {
      return Cookie.getAsync(["bili_jct", "LIVE_BUVID", "buvid3"], 300, 1e4);
    }
    async run() {
      try {
        useBiliStore().cookies = await this.getCookies();
      } catch (error) {
        throw new ModuleCriticalError(this.moduleName, error.message);
      }
    }
  }
  class BilibiliLive extends BaseModule {
    /**
     * 获取 window.BilibiliLive
     */
    getBilibiliLive() {
      this.logger.log("unsafeWindow.BilibiliLive", _unsafeWindow.BilibiliLive);
      return new Promise((resolve2, reject2) => {
        if (_unsafeWindow.BilibiliLive.UID !== 0) {
          resolve2(_unsafeWindow.BilibiliLive);
          return;
        }
        _unsafeWindow.BilibiliLive = new Proxy(_unsafeWindow.BilibiliLive, {
          set(target, prop, value) {
            target[prop] = value;
            if (prop === "UID") {
              _unsafeWindow.BilibiliLive = target;
              resolve2(_unsafeWindow.BilibiliLive);
            }
            return true;
          }
        });
        setTimeout(() => reject2(new Error("获取 BilibiliLive 超时")), 1e4);
      });
    }
    async run() {
      try {
        useBiliStore().BilibiliLive = await this.getBilibiliLive();
      } catch (error) {
        throw new ModuleCriticalError(this.moduleName, error.message);
      }
    }
  }
  __publicField(BilibiliLive, "runOnMultiplePages", true);
  const defaultModules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Default_BilibiliLive: BilibiliLive,
    Default_Cookies: Cookies,
    Default_DailyRewardInfo: DailyRewardInfo,
    Default_DynamicVideos: DynamicVideos,
    Default_FansMetals: FansMetals,
    Default_UserInfo: UserInfo
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
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        const biliStore = useBiliStore();
        if (!biliStore.dailyRewardInfo) {
          this.logger.error("主站每日任务完成情况不存在，不执行每日登录任务");
          this.status = "error";
          return;
        }
        this.status = "running";
        if (!biliStore.dailyRewardInfo.login) {
          await this.login();
        } else {
          this.config._lastCompleteTime = tsm();
          this.status = "done";
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log("昨天的每日登录任务已经完成过了，等到今天的00:05再执行");
        } else {
          this.logger.log("今天已经完成过每日登录任务了");
          this.status = "done";
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
    /**
     * 获取第一个视频的 aid
     */
    getAid() {
      return Number(useBiliStore().dynamicVideos[0].modules.module_dynamic.major.archive.aid);
    }
    async watch(aid) {
      try {
        const response = await BAPI.main.videoHeartbeat(aid, _.random(1e9, 2e9));
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
    runCheck() {
      const biliStore = useBiliStore();
      if (!biliStore.dailyRewardInfo) {
        this.logger.error("主站每日任务完成情况不存在，不执行每日观看视频任务");
        this.status = "error";
        return false;
      }
      if (!biliStore.dynamicVideos) {
        this.logger.error("动态视频数据不存在，不执行每日观看视频任务");
        this.status = "error";
        return false;
      }
      return true;
    }
    async run() {
      this.logger.log("每日观看视频模块开始运行");
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        if (!this.runCheck()) {
          return;
        }
        const biliStore = useBiliStore();
        this.status = "running";
        if (!biliStore.dailyRewardInfo.watch) {
          const aid = this.getAid();
          await this.watch(aid);
        } else {
          this.config._lastCompleteTime = tsm();
          this.status = "done";
          this.logger.log("每日观看视频任务已完成");
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log("昨天的每日观看视频任务已经完成过了，等到今天的00:05再执行");
        } else {
          this.logger.log("今天已经完成过每日观看视频任务了");
          this.status = "done";
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
      return biliStore.dynamicVideos[0].modules.module_dynamic.major.archive.aid;
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
    runCheck() {
      const biliStore = useBiliStore();
      if (!biliStore.dailyRewardInfo) {
        this.logger.error("主站每日任务完成情况不存在，不执行每日分享视频任务");
        this.status = "error";
        return false;
      }
      if (!biliStore.dynamicVideos) {
        this.logger.error("动态视频数据不存在，不执行每日分享视频任务");
        this.status = "error";
        return false;
      }
      return true;
    }
    async run() {
      this.logger.log("每日分享视频模块开始运行");
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        if (!this.runCheck()) {
          return;
        }
        const biliStore = useBiliStore();
        this.status = "running";
        if (!biliStore.dailyRewardInfo.share) {
          const aid = this.getAid();
          await this.share(aid);
        } else {
          this.config._lastCompleteTime = tsm();
          this.status = "done";
          this.logger.log("每日分享视频任务已完成");
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log("昨天的每日分享任务已经完成过了，等到今天的00:05再执行");
        } else {
          this.logger.log("今天已经完成过每日分享任务了");
          this.status = "done";
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
      // 不过视频数量足够多，所以干脆直接限制每个视频最多投一个币
      __publicField(this, "MAX_COIN", 1);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.MainSiteTasks.coin = s;
    }
    /**
     * 获取动态视频的 aid 和 bvid
     */
    getDynamicVideoIds() {
      const biliStore = useBiliStore();
      return biliStore.dynamicVideos.map((item) => {
        const archive = item.modules.module_dynamic.major.archive;
        return {
          aid: archive.aid,
          bvid: archive.bvid
        };
      });
    }
    /**
     * 获取一个视频的你的已投硬币数量
     *
     * @returns 你的已投硬币数
     */
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
    /**
     * 给动态中的视频投币
     * @param left_coin_num 还需要投的硬币数
     */
    async coinDynamicVideos(left_coin_num) {
      const ids = this.getDynamicVideoIds();
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
            this.logger.warn("硬币余额不足，每日投币任务终止");
            this.status = "error";
            break;
          }
        }
      }
      if (left_coin_num > 0) {
        this.logger.warn("硬币余额不足，每日投币任务终止");
        this.status = "error";
      }
    }
    /**
     * 投币
     */
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
    /**
     * 运行前检查
     */
    runCheck() {
      const biliStore = useBiliStore();
      if (!biliStore.dailyRewardInfo) {
        this.logger.error("主站每日任务完成情况不存在，不执行每日投币任务");
        this.status = "error";
        return false;
      }
      if (!biliStore.dynamicVideos) {
        this.logger.error("动态视频数据不存在，不执行每日投币任务");
        this.status = "error";
        return false;
      }
      return true;
    }
    async run() {
      this.logger.log("每日投币模块开始运行");
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        if (!this.runCheck()) {
          return;
        }
        const biliStore = useBiliStore();
        this.status = "running";
        const total_coined_num = biliStore.dailyRewardInfo.coins / 10;
        if (total_coined_num < this.config.num) {
          const left_coin_num = this.config.num - total_coined_num;
          const money = biliStore.userInfo.money ?? 5;
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
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log("昨天的每日投币任务已经完成过了，等到今天的00:05再执行");
        } else {
          this.logger.log("今天已经完成过每日投币任务了");
          this.status = "done";
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离每日投币模块下次运行时间:", diff.str);
    }
  }
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
          this.logger.log("直播签到成功，获得奖励:", response.data.text);
          this.config._lastCompleteTime = tsm();
          this.status = "done";
          this.logger.log("直播签到任务已完成");
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
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离直播签到模块下次运行时间:", diff.str);
    }
  }
  class MedalModule extends BaseModule {
    /**
     * 等待粉丝勋章数据获取完毕
     *
     * @returns 是否获取成功
     */
    waitForFansMedals() {
      return new Promise((resolve2) => {
        const { fansMedalsStatus } = pinia$1.storeToRefs(useBiliStore());
        if (fansMedalsStatus.value === "loaded") {
          resolve2(true);
        } else {
          const unwatch = vue.watch(fansMedalsStatus, (newValue) => {
            if (newValue === "loaded") {
              unwatch();
              resolve2(true);
            } else if (newValue === "error") {
              unwatch();
              resolve2(false);
            }
          });
        }
      });
    }
  }
  class LightTask extends MedalModule {
    constructor() {
      super(...arguments);
      __publicField(this, "medalTasksConfig", this.moduleStore.moduleConfig.DailyTasks.LiveTasks.medalTasks);
      __publicField(this, "config", this.medalTasksConfig.light);
    }
    set status(s) {
      this.moduleStore.moduleStatus.DailyTasks.LiveTasks.medalTasks.light = s;
    }
    /**
     * 获取粉丝勋章，过滤不符合黑白名单要求和不需要点亮的粉丝勋章
     * @returns 数组，数组中的每个元素都是数组：[房间号，主播uid]
     */
    getRoomidTargetidList() {
      const filtered = useBiliStore().filteredFansMedals.filter(
        (medal) => medal.medal.level < 20 && (this.medalTasksConfig.isWhiteList ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id) : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id)) && medal.medal.is_lighted === 0
      ).map((medal) => [medal.room_info.room_id, medal.medal.target_id]);
      if (this.medalTasksConfig.isWhiteList) {
        const orderMap = arrayToMap(this.medalTasksConfig.roomidList);
        return filtered.sort((a, b) => orderMap.get(a[0]) - orderMap.get(b[0]));
      }
      return filtered;
    }
    /**
     * 点赞
     * @param roomid 直播间号
     * @param target_id 主播UID
     * @param click_time 点赞次数
     */
    async like(roomid, target_id, click_time) {
      try {
        const response = await BAPI.live.likeReport(roomid, target_id, click_time);
        this.logger.log(`BAPI.live.likeReport(${roomid}, ${target_id}, ${click_time})`, response);
        if (response.code === 0) {
          this.logger.log(
            `点亮熄灭勋章-点赞 房间号 = ${roomid} 主播UID = ${target_id} 点赞次数 = ${click_time} 成功`
          );
        } else {
          this.logger.error(
            `点亮熄灭勋章-点赞 房间号 = ${roomid} 主播UID = ${target_id} 点赞次数 = ${click_time} 失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(
          `点亮熄灭勋章-点赞 房间号 = ${roomid} 主播UID = ${target_id} 点赞次数 = ${click_time} 出错`,
          error
        );
      }
    }
    /**
     * 发弹幕
     * @param danmu 弹幕内容
     * @param roomid 直播间号
     */
    async sendDanmu(danmu, roomid) {
      try {
        const response = await BAPI.live.sendMsg(danmu, roomid);
        this.logger.log(`BAPI.live.sendMsg(${danmu}, ${roomid})`, response);
        if (response.code === 0) {
          if (response.msg === "k") {
            this.logger.warn(
              `点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 异常，弹幕可能包含屏蔽词`
            );
          } else {
            this.logger.log(`点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 成功`);
          }
        } else {
          this.logger.error(
            `点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(`点亮熄灭勋章-发送弹幕 在直播间 ${roomid} 发送弹幕 ${danmu} 出错`, error);
      }
    }
    async run() {
      this.logger.log("点亮熄灭勋章模块开始运行");
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        if (!await this.waitForFansMedals()) {
          this.logger.error("粉丝勋章数据不存在，不执行点亮熄灭勋章任务");
          this.status = "error";
          return;
        }
        this.status = "running";
        const roomidTargetidList = this.getRoomidTargetidList();
        if (roomidTargetidList.length > 0) {
          for (let i = 0; i < roomidTargetidList.length; i++) {
            const [roomid, target_id] = roomidTargetidList[i];
            if (this.config.mode === "like") {
              await this.like(roomid, target_id, _.random(31, 33));
            } else {
              await this.sendDanmu(this.config.danmuList[i % this.config.danmuList.length], roomid);
            }
            await sleep(_.random(3e3, 5e3));
          }
        }
        this.config._lastCompleteTime = tsm();
        this.status = "done";
        this.logger.log("点亮熄灭勋章任务已完成");
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log("昨天的给点亮熄灭勋章任务已经完成过了，等到今天的00:05再执行");
        } else {
          this.logger.log("今天已经完成过点亮熄灭勋章任务了");
          this.status = "done";
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离点亮熄灭勋章模块下次运行时间:", diff.str);
    }
  }
  class RoomHeart {
    constructor(roomID, areaID, parentID, ruid, watchedSeconds) {
      __publicField(this, "logger", new Logger("RoomHeart"));
      __publicField(this, "config");
      /** 今日当前直播间已观看时间（秒） */
      __publicField(this, "watchedSeconds");
      __publicField(this, "timer");
      __publicField(this, "areaID");
      __publicField(this, "parentID");
      __publicField(this, "roomID");
      /** 主播的 UID */
      __publicField(this, "ruid");
      __publicField(this, "seq", 0);
      /** Cookie LIVE_BUVID */
      __publicField(this, "buvid", useBiliStore().cookies.LIVE_BUVID);
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
      this.config = useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks.watch;
    }
    set status(s) {
      useModuleStore().moduleStatus.DailyTasks.LiveTasks.medalTasks.watch = s;
    }
    /** 计算签名和发送请求时均需要 JSON.stringify */
    get id() {
      return [this.parentID, this.areaID, this.seq, this.roomID];
    }
    /** 更新当前直播间的观看任务进度 */
    updateProgress() {
      this.watchedSeconds += this.heartBeatInterval;
      useModuleStore().moduleConfig.DailyTasks.LiveTasks.medalTasks.watch._watchingProgress[this.roomID] = this.watchedSeconds;
    }
    /**
     * 开始心跳
     */
    start() {
      if (!this.buvid) {
        this.logger.error(`缺少buvid，无法为直播间 ${this.roomID} 执行观看直播任务，请尝试刷新页面`);
        return Promise.resolve();
      }
      return this.E();
    }
    /**
     * E心跳，开始时发送一次
     */
    async E() {
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
          await sleep(this.heartBeatInterval * 1e3);
          return this.X();
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
      if (isNowIn(23, 59, 0, 5)) {
        this.logger.log(`即将或刚刚发生跨天，停止直播间 ${this.roomID} 的X心跳`);
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
        const s = this.spyder(JSON.stringify(sypderData), this.secretRule);
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
          this.updateProgress();
          if (this.watchedSeconds >= this.config.time * 60) {
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
          await sleep(this.heartBeatInterval * 1e3);
          return this.X();
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
     * wasm 导出的 spyder 函数的 javascript 实现
     * @param str 一个经过 JSON.stringify 的 json 字符串
     * @param rule secret_rule 数组
     * @returns s
     */
    spyder(str, rule) {
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
  class WatchTask2 extends MedalModule {
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
     * @returns 数组，数组中的每个元素都是数组：[房间号，主播uid]
     */
    getRoomidUidList() {
      const filtered = useBiliStore().filteredFansMedals.filter(
        (medal) => medal.medal.level < 20 && (this.medalTasksConfig.isWhiteList ? this.medalTasksConfig.roomidList.includes(medal.room_info.room_id) : !this.medalTasksConfig.roomidList.includes(medal.room_info.room_id))
      ).map((medal) => [medal.room_info.room_id, medal.medal.target_id]).slice(0, 199);
      if (this.medalTasksConfig.isWhiteList) {
        const orderMap = arrayToMap(this.medalTasksConfig.roomidList);
        return filtered.sort((a, b) => orderMap.get(a[0]) - orderMap.get(b[0]));
      }
      return filtered;
    }
    /**
     * 获取指定直播间的 area_id 和 parent_area_id
     *
     * 出错时返回 [-1, -1]
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
          return [-1, -1];
        }
      } catch (error) {
        this.logger.error(
          `获取指定直播间的 area_id 和 parent_area_id(roomid = ${roomid}) 出错`,
          error
        );
        return [-1, -1];
      }
    }
    async run() {
      this.logger.log("观看直播模块开始运行");
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        if (!await this.waitForFansMedals()) {
          this.logger.error("粉丝勋章数据不存在，不执行观看直播任务");
          this.status = "error";
          return;
        }
        this.status = "running";
        if (!isTimestampToday(this.config._lastWatchTime, 0, 0)) {
          this.config._watchingProgress = {};
        } else {
          _.forOwn(this.config._watchingProgress, (value, key, object) => {
            object[key] -= value % 300;
          });
        }
        this.config._lastWatchTime = tsm();
        const roomidUidList = this.getRoomidUidList();
        if (roomidUidList.length > 0) {
          let i;
          for (i = 0; i < roomidUidList.length; i++) {
            const [roomid, uid] = roomidUidList[i];
            const [area_id, parent_area_id] = await this.getAreaInfo(roomid);
            if (area_id > 0 && parent_area_id > 0) {
              if (!this.config._watchingProgress[roomid] || this.config._watchingProgress[roomid] < this.config.time * 60) {
                if (isNowIn(23, 55, 0, 5)) {
                  this.logger.log("即将或刚刚发生跨天，提早结束本轮观看直播任务");
                  break;
                }
                this.logger.log(`开始直播间${roomid}的观看直播任务`);
                await new RoomHeart(
                  roomid,
                  area_id,
                  parent_area_id,
                  uid,
                  this.config._watchingProgress[roomid] ?? 0
                ).start();
              }
            }
          }
          if (i === roomidUidList.length) {
            this.config._lastCompleteTime = tsm();
            this.logger.log("观看直播任务已完成");
            this.status = "done";
          }
        } else {
          this.status = "done";
          this.config._lastCompleteTime = tsm();
        }
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log("昨天的观看直播任务已经完成过了，等到今天的00:05再执行");
        } else {
          this.logger.log("今天已经完成过观看直播任务了");
          this.status = "done";
        }
      }
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("距离观看直播模块下次运行时间:", diff.str);
    }
  }
  __publicField(WatchTask2, "runAt", "window-load");
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
    run() {
      this.logger.log("银瓜子换硬币模块开始运行");
      if (!isTimestampToday(this.config._lastCompleteTime)) {
        this.status = "running";
        this.exchange();
      } else {
        if (isNowIn(0, 0, 0, 5)) {
          this.logger.log("昨天的银瓜子换硬币任务已经完成过了，等到今天的00:05再执行");
        } else {
          this.logger.log("今天已经完成过银瓜子换硬币任务了");
          this.status = "done";
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
      const diff = delayToNextMoment();
      setTimeout(() => this.run(), diff.ms);
      this.logger.log("硬币换银瓜子模块下次运行时间:", diff.str);
    }
  }
  class GetYearVipPrivilegeTask extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.DailyTasks.OtherTasks.getYearVipPrivilege);
      __publicField(this, "type2Name", {
        1: "年度专享B币赠送",
        2: "年度专享会员购优惠券",
        3: "年度专享漫画礼包 - 漫画福利券",
        4: "大会员专享会员购包邮券",
        5: "年度专享漫画礼包 - 漫画商城优惠券",
        6: "大会员专享会员体验卡",
        7: "大会员专享课堂优惠券",
        15: "年度专享会员购星光宝盒88折券",
        16: "大会员专享会员购10魔晶",
        17: "年度专享游戏优惠券"
      });
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
          this.logger.log(
            `领取年度大会员权益（type = ${type}, ${this.type2Name[type] ?? "未知"}）成功`
          );
        } else {
          this.logger.error(
            `领取年度大会员权益（type = ${type}, ${this.type2Name[type] ?? "未知"}）失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(
          `领取年度大会员权益（type = ${type}, ${this.type2Name[type] ?? "未知"}）出错`,
          error
        );
      }
    }
    /**
     * 领取专属等级加速包（10主站经验）
     */
    async addExperience() {
      try {
        const response = await BAPI.main.vip.addExperience();
        this.logger.log(`BAPI.main.vip.addExperience response`, response);
        if (response.code === 0) {
          this.logger.log(`领取年度大会员权益（type = 9，专属等级加速包（10主站经验））成功`);
        } else {
          this.logger.error(
            `领取年度大会员权益（type = 9，专属等级加速包（10主站经验））失败`,
            response.message
          );
        }
      } catch (error) {
        this.logger.error(`领取年度大会员权益（type = 9，专属等级加速包（10主站经验））出错`, error);
      }
    }
    /**
     * 判断当前账号是否是年度大会员
     */
    isYearVip() {
      const biliStore = useBiliStore();
      const userInfo = biliStore.userInfo;
      if (userInfo.vip.status === 1 && userInfo.vip.type === 2) {
        return true;
      } else {
        this.logger.log("当前账号不是年度大会员，不领取权益");
        return false;
      }
    }
    async run() {
      this.logger.log("领取年度大会员权益模块开始运行");
      if (this.isYearVip()) {
        if (ts() >= this.config._nextReceiveTime) {
          this.status = "running";
          const list = await this.myPrivilege();
          if (list) {
            for (const i of list) {
              if (i.type === 8 || i.type === 14) {
                continue;
              }
              if (i.state === 0) {
                if (i.type === 9) {
                  await this.addExperience();
                } else {
                  await this.receivePrivilege(i.type);
                }
              } else if (i.state === 1) {
                this.logger.log(`该权益（type = ${i.type}）已经领取过了`);
              } else {
                if (i.type === 9) {
                  const watchTaskConfig = this.moduleStore.moduleConfig.DailyTasks.MainSiteTasks.watch;
                  if (watchTaskConfig.enabled) {
                    this.logger.log("等待观看视频任务完成后再领取专属等级加速包（10主站经验）...");
                    vue.watch(
                      () => watchTaskConfig._lastCompleteTime,
                      () => sleep(3e3).then(() => this.addExperience()),
                      { once: true }
                    );
                  } else {
                    this.logger.warn(
                      "领取专属等级加速包（10主站经验）前需要观看任意一个视频，请打开【主站任务】中的【每日观看视频】，或是在运行脚本前手动观看"
                    );
                  }
                }
              }
              await sleep(200);
            }
            this.status = "done";
            this.config._nextReceiveTime = Math.min(...list.map((i) => i.period_end_unix));
          }
        }
        const diff = this.config._nextReceiveTime - ts() + 3e5;
        if (diff < 86400) {
          this.logger.log(
            "领取年度大会员权益模块下次运行时间:",
            luxon.DateTime.fromSeconds(this.config._nextReceiveTime).toJSDate()
          );
          setTimeout(() => this.run(), diff * 1e3);
        } else {
          this.logger.log("距离下次领取年度大会员权益的时间超过一天，不计划下次运行");
        }
      }
    }
  }
  const dq = document.querySelector.bind(document);
  document.querySelectorAll.bind(document);
  const dce = document.createElement.bind(document);
  function waitForElement(parentElement, selector, timeout = 5e3) {
    return new Promise((resolve2, reject2) => {
      const element = parentElement.querySelector(selector);
      if (element) {
        resolve2(element);
        return;
      }
      const observer = new MutationObserver(() => {
        const element2 = parentElement.querySelector(selector);
        if (element2) {
          clearTimeout(timeoutId);
          observer.disconnect();
          resolve2(element2);
        }
      });
      observer.observe(parentElement, {
        childList: true,
        subtree: true
      });
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        reject2(new Error(`无法在${timeout}毫秒内找到${parentElement.localName}的子节点${selector}`));
      }, timeout);
    });
  }
  const isTargetFrame = () => document.head.innerHTML.includes("BilibiliLive");
  const isSelfTopFrame = () => window.self === window.top;
  const topFrameDocumentElement = () => {
    var _a;
    return (_a = window.top) == null ? void 0 : _a.document.documentElement;
  };
  class SwitchLiveStreamQuality extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.EnhanceExperience.switchLiveStreamQuality);
    }
    async waitForPlayer() {
      return new Promise((resolve2, reject2) => {
        const topWindow = _unsafeWindow.top ? _unsafeWindow.top : _unsafeWindow;
        const findPlayertimer = setInterval(() => {
          if (topWindow.livePlayer && Object.hasOwn(topWindow.livePlayer, "switchQuality") && Object.hasOwn(topWindow.livePlayer, "getPlayerInfo")) {
            clearInterval(findPlayertimer);
            clearTimeout(timeoutTimer);
            resolve2(topWindow.livePlayer);
          }
        }, 200);
        const timeoutTimer = setTimeout(() => {
          clearInterval(findPlayertimer);
          clearTimeout(timeoutTimer);
          reject2("等待播放器超时");
        }, 1e4);
      });
    }
    switchQuality(livePlayer) {
      const playerInfo = livePlayer.getPlayerInfo();
      if (playerInfo.liveStatus === 0) {
        this.logger.log("当前直播间未开播，无需切换画质");
      } else {
        setTimeout(
          () => {
            const targetQuality = playerInfo.qualityCandidates.find(
              ({ desc }) => desc === this.config.qualityDesc
            );
            if (targetQuality) {
              if (playerInfo.quality !== targetQuality.qn) {
                livePlayer.switchQuality(targetQuality.qn);
                this.logger.log(`已将画质切换为${this.config.qualityDesc}`, targetQuality);
              } else {
                this.logger.log("当前画质已经是目标画质了，无需切换画质");
              }
            } else {
              this.logger.log("当前直播不支持目标画质，保持默认画质");
            }
          },
          // 这里针对特殊直播间和普通直播间设置了两套超时时间，特殊直播间超时时间更长
          isSelfTopFrame() ? 2500 : 5e3
        );
      }
    }
    async run() {
      this.logger.log("自动切换画质模块开始运行");
      try {
        const livePlayer = await this.waitForPlayer();
        this.switchQuality(livePlayer);
      } catch (e) {
        this.logger.error("自动切换画质模块出错", e);
      }
    }
  }
  __publicField(SwitchLiveStreamQuality, "runOnMultiplePages", true);
  __publicField(SwitchLiveStreamQuality, "runAt", "window-load");
  __publicField(SwitchLiveStreamQuality, "runAfterDefault", false);
  class BanP2P extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.EnhanceExperience.banp2p);
    }
    banP2P() {
      const RTClist = [
        "RTCPeerConnection",
        "mozRTCPeerConnection",
        "webkitRTCPeerConnection"
      ];
      for (const i of RTClist) {
        if (Object.hasOwn(_unsafeWindow, i)) {
          Object.defineProperty(_unsafeWindow, i, {
            value: class {
              constructor() {
              }
              addEventListener() {
              }
              removeEventListener() {
              }
              createDataChannel() {
                return { close: function() {
                } };
              }
              createOffer() {
                return Promise.resolve();
              }
              setLocalDescription() {
                return Promise.resolve();
              }
              close() {
              }
              setRemoteDescription() {
                return Promise.resolve();
              }
              createAnswer() {
              }
            },
            enumerable: false,
            writable: false,
            configurable: false
          });
        }
      }
    }
    run() {
      this.logger.log("禁用P2P模块开始运行");
      try {
        this.banP2P();
      } catch (e) {
        this.logger.error("禁用P2P失败", e);
      }
    }
  }
  __publicField(BanP2P, "runOnMultiplePages", true);
  __publicField(BanP2P, "runAt", "document-start");
  __publicField(BanP2P, "onFrame", "all");
  __publicField(BanP2P, "runAfterDefault", false);
  var events = ["load", "loadend", "timeout", "error", "readystatechange", "abort"];
  var OriginXhr = "__origin_xhr";
  function configEvent(event, xhrProxy) {
    var e = {};
    for (var attr in event) e[attr] = event[attr];
    e.target = e.currentTarget = xhrProxy;
    return e;
  }
  function hook$1(proxy2, win) {
    win = win || window;
    var originXhr = win.XMLHttpRequest;
    var hooking = true;
    var HookXMLHttpRequest = function() {
      var xhr = new originXhr();
      for (var i = 0; i < events.length; ++i) {
        var key = "on" + events[i];
        if (xhr[key] === void 0) xhr[key] = null;
      }
      for (var attr in xhr) {
        var type = "";
        try {
          type = typeof xhr[attr];
        } catch (e) {
        }
        if (type === "function") {
          this[attr] = hookFunction(attr);
        } else if (attr !== OriginXhr) {
          Object.defineProperty(this, attr, {
            get: getterFactory(attr),
            set: setterFactory(attr),
            enumerable: true
          });
        }
      }
      var that = this;
      xhr.getProxy = function() {
        return that;
      };
      this[OriginXhr] = xhr;
    };
    HookXMLHttpRequest.prototype = originXhr.prototype;
    HookXMLHttpRequest.prototype.constructor = HookXMLHttpRequest;
    win.XMLHttpRequest = HookXMLHttpRequest;
    Object.assign(win.XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 });
    function getterFactory(attr) {
      return function() {
        var originValue = this[OriginXhr][attr];
        if (hooking) {
          var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : originValue;
          var attrGetterHook = (proxy2[attr] || {})["getter"];
          return attrGetterHook && attrGetterHook(v, this) || v;
        } else {
          return originValue;
        }
      };
    }
    function setterFactory(attr) {
      return function(v) {
        var xhr = this[OriginXhr];
        if (hooking) {
          var that = this;
          var hook2 = proxy2[attr];
          if (attr.substring(0, 2) === "on") {
            that[attr + "_"] = v;
            xhr[attr] = function(e) {
              e = configEvent(e, that);
              var ret = proxy2[attr] && proxy2[attr].call(that, xhr, e);
              ret || v.call(that, e);
            };
          } else {
            var attrSetterHook = (hook2 || {})["setter"];
            v = attrSetterHook && attrSetterHook(v, that) || v;
            this[attr + "_"] = v;
            try {
              xhr[attr] = v;
            } catch (e) {
            }
          }
        } else {
          xhr[attr] = v;
        }
      };
    }
    function hookFunction(fun) {
      return function() {
        var args = [].slice.call(arguments);
        if (proxy2[fun] && hooking) {
          var ret = proxy2[fun].call(this, args, this[OriginXhr]);
          if (ret) return ret;
        }
        return this[OriginXhr][fun].apply(this[OriginXhr], args);
      };
    }
    function unHook() {
      hooking = false;
      if (win.XMLHttpRequest === HookXMLHttpRequest) {
        win.XMLHttpRequest = originXhr;
        HookXMLHttpRequest.prototype.constructor = originXhr;
        originXhr = void 0;
      }
    }
    return { originXhr, unHook };
  }
  var eventLoad = events[0], eventLoadEnd = events[1], eventTimeout = events[2], eventError = events[3], eventReadyStateChange = events[4], eventAbort = events[5];
  var prototype = "prototype";
  function proxy(proxy2, win) {
    win = win || window;
    return proxyAjax(proxy2, win);
  }
  function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }
  function getEventTarget(xhr) {
    return xhr.watcher || (xhr.watcher = document.createElement("a"));
  }
  function triggerListener(xhr, name) {
    var xhrProxy = xhr.getProxy();
    var callback = "on" + name + "_";
    var event = configEvent({ type: name }, xhrProxy);
    xhrProxy[callback] && xhrProxy[callback](event);
    var evt;
    if (typeof Event === "function") {
      evt = new Event(name, { bubbles: false });
    } else {
      evt = document.createEvent("Event");
      evt.initEvent(name, false, true);
    }
    getEventTarget(xhr).dispatchEvent(evt);
  }
  function Handler(xhr) {
    this.xhr = xhr;
    this.xhrProxy = xhr.getProxy();
  }
  Handler[prototype] = /* @__PURE__ */ Object.create({
    resolve: function resolve(response) {
      var xhrProxy = this.xhrProxy;
      var xhr = this.xhr;
      xhrProxy.readyState = 4;
      xhr.resHeader = response.headers;
      xhrProxy.response = xhrProxy.responseText = response.response;
      xhrProxy.statusText = response.statusText;
      xhrProxy.status = response.status;
      triggerListener(xhr, eventReadyStateChange);
      triggerListener(xhr, eventLoad);
      triggerListener(xhr, eventLoadEnd);
    },
    reject: function reject(error) {
      this.xhrProxy.status = 0;
      triggerListener(this.xhr, error.type);
      triggerListener(this.xhr, eventLoadEnd);
    }
  });
  function makeHandler(next) {
    function sub(xhr) {
      Handler.call(this, xhr);
    }
    sub[prototype] = Object.create(Handler[prototype]);
    sub[prototype].next = next;
    return sub;
  }
  var RequestHandler$1 = makeHandler(function(rq) {
    var xhr = this.xhr;
    rq = rq || xhr.config;
    xhr.withCredentials = rq.withCredentials;
    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
    for (var key in rq.headers) {
      xhr.setRequestHeader(key, rq.headers[key]);
    }
    xhr.send(rq.body);
  });
  var ResponseHandler$1 = makeHandler(function(response) {
    this.resolve(response);
  });
  var ErrorHandler = makeHandler(function(error) {
    this.reject(error);
  });
  function proxyAjax(proxy2, win) {
    var onRequest = proxy2.onRequest, onResponse = proxy2.onResponse, onError = proxy2.onError;
    function getResponseData(xhrProxy) {
      var responseType = xhrProxy.responseType;
      if (!responseType || responseType === "text") {
        return xhrProxy.responseText;
      }
      var response = xhrProxy.response;
      if (responseType === "json" && !response) {
        try {
          return JSON.parse(xhrProxy.responseText);
        } catch (e) {
          console.warn(e);
        }
      }
      return response;
    }
    function handleResponse(xhr, xhrProxy) {
      var handler = new ResponseHandler$1(xhr);
      var ret = {
        response: getResponseData(xhrProxy),
        status: xhrProxy.status,
        statusText: xhrProxy.statusText,
        config: xhr.config,
        headers: xhr.resHeader || xhr.getAllResponseHeaders().split("\r\n").reduce(function(ob, str) {
          if (str === "") return ob;
          var m = str.split(":");
          ob[m.shift()] = trim(m.join(":"));
          return ob;
        }, {})
      };
      if (!onResponse) return handler.resolve(ret);
      onResponse(ret, handler);
    }
    function onerror(xhr, xhrProxy, error, errorType) {
      var handler = new ErrorHandler(xhr);
      error = { config: xhr.config, error, type: errorType };
      if (onError) {
        onError(error, handler);
      } else {
        handler.next(error);
      }
    }
    function preventXhrProxyCallback() {
      return true;
    }
    function errorCallback(errorType) {
      return function(xhr, e) {
        onerror(xhr, this, e, errorType);
        return true;
      };
    }
    function stateChangeCallback(xhr, xhrProxy) {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        handleResponse(xhr, xhrProxy);
      } else if (xhr.readyState !== 4) {
        triggerListener(xhr, eventReadyStateChange);
      }
      return true;
    }
    var { originXhr, unHook } = hook$1({
      onload: preventXhrProxyCallback,
      onloadend: preventXhrProxyCallback,
      onerror: errorCallback(eventError),
      ontimeout: errorCallback(eventTimeout),
      onabort: errorCallback(eventAbort),
      onreadystatechange: function(xhr) {
        return stateChangeCallback(xhr, this);
      },
      open: function open(args, xhr) {
        var _this = this;
        var config = xhr.config = { headers: {} };
        config.method = args[0];
        config.url = args[1];
        config.async = args[2];
        config.user = args[3];
        config.password = args[4];
        config.xhr = xhr;
        var evName = "on" + eventReadyStateChange;
        if (!xhr[evName]) {
          xhr[evName] = function() {
            return stateChangeCallback(xhr, _this);
          };
        }
        if (onRequest) return true;
      },
      send: function(args, xhr) {
        var config = xhr.config;
        config.withCredentials = xhr.withCredentials;
        config.body = args[0];
        if (onRequest) {
          var req = function() {
            onRequest(config, new RequestHandler$1(xhr));
          };
          config.async === false ? req() : setTimeout(req);
          return true;
        }
      },
      setRequestHeader: function(args, xhr) {
        xhr.config.headers[args[0].toLowerCase()] = args[1];
        if (onRequest) return true;
      },
      addEventListener: function(args, xhr) {
        var _this = this;
        if (events.indexOf(args[0]) !== -1) {
          var handler = args[1];
          getEventTarget(xhr).addEventListener(args[0], function(e) {
            var event = configEvent(e, _this);
            event.type = args[0];
            event.isTrusted = true;
            handler.call(_this, event);
          });
          return true;
        }
      },
      getAllResponseHeaders: function(_2, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          var header = "";
          for (var key in headers) {
            header += key + ": " + headers[key] + "\r\n";
          }
          return header;
        }
      },
      getResponseHeader: function(args, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          return headers[(args[0] || "").toLowerCase()];
        }
      }
    }, win);
    return {
      originXhr,
      unProxy: unHook
    };
  }
  const _fetch = window.fetch;
  class RequestHandler {
    constructor() {
      __publicField(this, "_resolve");
      __publicField(this, "_error");
      __publicField(this, "_next", false);
      __publicField(this, "_input");
      __publicField(this, "_init");
    }
    resolve(response) {
      this._resolve = Promise.resolve(response);
    }
    error(error) {
      this._error = error;
    }
    next(config) {
      this._next = true;
      this._input = config.input;
      this._init = config.init;
    }
  }
  class ResponseHandler {
    constructor() {
      __publicField(this, "_resolve");
      __publicField(this, "_error");
      __publicField(this, "_next", false);
      __publicField(this, "_response");
    }
    resolve(response) {
      this._resolve = Promise.resolve(response);
    }
    error(error) {
      this._error = error;
    }
    next(response) {
      this._next = true;
      this._response = response;
    }
  }
  let isHooked = false;
  let onRequestHandlers = [];
  let onResponseHandlers = [];
  const hook = (win) => {
    win.fetch = async (input, init) => {
      for (const handler of onRequestHandlers) {
        const requestHandler = new RequestHandler();
        await handler.apply(_unsafeWindow, [{ input, init }, requestHandler]);
        if (requestHandler._resolve) {
          return requestHandler._resolve;
        }
        if (requestHandler._error) {
          throw requestHandler._error;
        }
        if (!requestHandler._next) {
          break;
        }
        input = requestHandler._input;
        init = requestHandler._init;
      }
      let response = await _fetch.apply(_unsafeWindow, [input, init]);
      for (const handler of onResponseHandlers) {
        const responseHandler = new ResponseHandler();
        await handler.apply(_unsafeWindow, [response, responseHandler]);
        if (responseHandler._resolve) {
          return responseHandler._resolve;
        }
        if (responseHandler._error) {
          throw responseHandler._error;
        }
        if (!responseHandler._next) {
          break;
        }
        response = responseHandler._response;
      }
      return response;
    };
  };
  const fproxy = (proxy2, win = _unsafeWindow) => {
    if (proxy2.onRequest) {
      onRequestHandlers.push(proxy2.onRequest);
    }
    if (proxy2.onResponse) {
      onResponseHandlers.push(proxy2.onResponse);
    }
    if (!isHooked) {
      hook(win);
      isHooked = true;
    }
    return {
      unProxy: () => {
        if (proxy2.onRequest) {
          onRequestHandlers.splice(
            onRequestHandlers.findIndex((handler) => handler === proxy2.onRequest),
            1
          );
        }
        if (proxy2.onResponse) {
          onResponseHandlers.splice(
            onResponseHandlers.findIndex((handler) => handler === proxy2.onResponse),
            1
          );
        }
      },
      unHook: () => {
        win.fetch = _fetch;
        onRequestHandlers = [];
        onResponseHandlers = [];
      },
      originFetch: _fetch
    };
  };
  const _NoReport = class _NoReport extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.EnhanceExperience.noReport);
    }
    /**
     * 判断是否是需要拦截的 URL
     * @param url 需要判断的 URL
     */
    static isTargetURL(url) {
      return url.includes("//data.bilibili.com") || url.includes("//data.bilivideo.com");
    }
    /**
     * 劫持一些能减少日志上报的方法
     * @param win window
     */
    hookProperties(win) {
      Object.defineProperty(win.navigator, "sendBeacon", {
        value: () => {
          return true;
        }
      });
      Object.defineProperties(win, {
        reportObserver: {
          get() {
            return {
              reportCustomData: function() {
              }
            };
          },
          set() {
          }
        },
        reportConfig: {
          get() {
            return {};
          },
          set() {
          }
        }
      });
    }
    /**
     * 劫持 XHR 和 fetch 请求
     */
    ajaxHook() {
      const ajaxHookProxyConfig = {
        onRequest: (config, handler) => {
          if (_NoReport.isTargetURL(config.url)) {
            handler.resolve({
              config,
              status: 200,
              headers: {
                "Content-Type": "text/plain; charset=utf-8"
              },
              response: "ok"
            });
          } else {
            handler.next(config);
          }
        }
      };
      const fetchHookConfig = {
        onRequest(config, handler) {
          const url = getUrlFromFetchInput(config.input);
          if (_NoReport.isTargetURL(url)) {
            handler.resolve(new Response("ok"));
          } else {
            handler.next(config);
          }
        },
        onResponse(response, handler) {
          handler.next(response);
        }
      };
      proxy(ajaxHookProxyConfig, _unsafeWindow);
      fproxy(fetchHookConfig, _unsafeWindow);
    }
    run() {
      this.logger.log("拦截日志数据上报模块开始运行");
      try {
        this.hookProperties(_unsafeWindow);
        this.ajaxHook();
      } catch (e) {
        this.logger.error("拦截日志数据上报失败", e);
      }
    }
  };
  __publicField(_NoReport, "runOnMultiplePages", true);
  __publicField(_NoReport, "runAt", "document-start");
  __publicField(_NoReport, "onFrame", "all");
  __publicField(_NoReport, "runAfterDefault", false);
  let NoReport = _NoReport;
  class NoSleep extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.EnhanceExperience.noSleep);
    }
    run() {
      this.logger.log("屏蔽挂机检测模块开始运行");
      setInterval(() => {
        document.dispatchEvent(new MouseEvent("mousemove"));
      }, 3e5);
    }
  }
  __publicField(NoSleep, "runOnMultiplePages", true);
  __publicField(NoSleep, "runAt", "window-load");
  __publicField(NoSleep, "runAfterDefault", false);
  class Invisibility extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.EnhanceExperience.invisibility);
    }
    run() {
      this.logger.log("隐身入场模块开始运行");
      proxy(
        {
          onRequest: (config, handler) => {
            if (config.url.includes("//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser")) {
              config.url = config.url.replace("not_mock_enter_effect=0", "not_mock_enter_effect=1");
            }
            handler.next(config);
          }
        },
        _unsafeWindow
      );
    }
  }
  __publicField(Invisibility, "runOnMultiplePages", true);
  __publicField(Invisibility, "runAt", "document-start");
  __publicField(Invisibility, "runAfterDefault", false);
  __publicField(Invisibility, "onFrame", "all");
  class RemovePKBox extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removePKBox);
    }
    removePKNode() {
      _GM_addStyle("#awesome-pk-vm { display: none !important }");
    }
    removePKToast() {
      const blackWordList = ["主播即将结束PK", "连线断开中"];
      const pkOB = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode instanceof HTMLElement && addedNode.classList.contains("link-toast") && blackWordList.some((word) => {
              var _a;
              return (_a = addedNode.textContent) == null ? void 0 : _a.includes(word);
            })) {
              addedNode.style.display = "none";
            }
          });
        }
      });
      pkOB.observe(document.body, { childList: true });
    }
    async run() {
      this.logger.log("移除大乱斗元素模块开始运行");
      this.removePKNode();
      this.removePKToast();
    }
  }
  __publicField(RemovePKBox, "runOnMultiplePages", true);
  class RemoveLiveWaterMark extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeLiveWaterMark);
    }
    async run() {
      this.logger.log("移除直播间水印模块开始运行");
      _GM_addStyle(".web-player-icon-roomStatus { display: none !important }");
    }
  }
  __publicField(RemoveLiveWaterMark, "runOnMultiplePages", true);
  class RemoveShopPopover extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeShopPopover);
    }
    async run() {
      this.logger.log("移除直播间小橙车弹窗模块开始运行");
      _GM_addStyle(".shop-popover { display: none !important }");
    }
  }
  __publicField(RemoveShopPopover, "runOnMultiplePages", true);
  class RemoveGameParty extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeGameParty);
    }
    async run() {
      this.logger.log("移除直播间幻星派对标志模块开始运行");
      _GM_addStyle("#game-id { display: none !important }");
    }
  }
  __publicField(RemoveGameParty, "runMultiple", true);
  class removeGiftPopover extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeGiftPopover);
    }
    async run() {
      this.logger.log("移除礼物赠送提示弹窗模块开始运行");
      _GM_addStyle(".function-card { display: none !important }");
    }
  }
  __publicField(removeGiftPopover, "runOnMultiplePages", true);
  class removeMicPopover extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeMicPopover);
    }
    async run() {
      this.logger.log("移除连麦状态提示模块开始运行");
      _GM_addStyle(".lin-mic-cntr { display: none !important }");
    }
  }
  __publicField(removeMicPopover, "runOnMultiplePages", true);
  class RemoveComboCard extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeComboCard);
    }
    async run() {
      this.logger.log("移除直播间相同弹幕连续提示模块开始运行");
      _GM_addStyle("#combo-card { display: none !important }");
    }
  }
  __publicField(RemoveComboCard, "runOnMultiplePages", true);
  class RemoveRank extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeRank);
    }
    async run() {
      this.logger.log("移除排行榜模块开始运行");
      _GM_addStyle(".popular-and-hot-rank { display: none !important }");
    }
  }
  __publicField(RemoveRank, "runOnMultiplePages", true);
  class RemoveHeaderStuff extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeHeaderStuff);
    }
    async run() {
      this.logger.log("移除活动入口模块开始运行");
      _GM_addStyle(".header-info-ctnr .rows-ctnr .lower-row .right-ctnr { display: none !important }");
    }
  }
  __publicField(RemoveHeaderStuff, "runOnMultiplePages", true);
  class RemoveFlipView extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeFlipView);
    }
    async run() {
      this.logger.log("移除礼物栏下方广告模块开始运行");
      _GM_addStyle(".flip-view { display: none !important }");
    }
  }
  __publicField(RemoveFlipView, "runOnMultiplePages", true);
  class RemoveRecommendRoom extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeRecommendRoom);
    }
    async run() {
      this.logger.log("移除礼物栏下方推荐直播间模块开始运行");
      _GM_addStyle(".room-info-ctnr { display: none !important }");
    }
  }
  __publicField(RemoveRecommendRoom, "runOnMultiplePages", true);
  class RemoveLiveMosaic extends BaseModule {
    constructor() {
      super(...arguments);
      __publicField(this, "config", this.moduleStore.moduleConfig.RemoveElement.removeLiveMosaic);
    }
    async run() {
      this.logger.log("移除直播间马赛克模块开始运行");
      _GM_addStyle("#web-player-module-area-mask-panel { opacity: 0 !important }");
    }
  }
  __publicField(RemoveLiveMosaic, "runOnMultiplePages", true);
  const otherModules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    DailyTask_LiveTask_LightTask: LightTask,
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
    EnhanceExperience_Invisibility: Invisibility,
    EnhanceExperience_NoReport: NoReport,
    EnhanceExperience_NoSleep: NoSleep,
    EnhanceExperience_SwitchLiveStreamQuality: SwitchLiveStreamQuality,
    RemoveElement_RemoveComboCard: RemoveComboCard,
    RemoveElement_RemoveFlipView: RemoveFlipView,
    RemoveElement_RemoveGameParty: RemoveGameParty,
    RemoveElement_RemoveGiftPopover: removeGiftPopover,
    RemoveElement_RemoveHeaderStuff: RemoveHeaderStuff,
    RemoveElement_RemoveLiveMosaic: RemoveLiveMosaic,
    RemoveElement_RemoveLiveWaterMark: RemoveLiveWaterMark,
    RemoveElement_RemoveMicPopover: removeMicPopover,
    RemoveElement_RemovePKBox: RemovePKBox,
    RemoveElement_RemoveRank: RemoveRank,
    RemoveElement_RemoveRecommendRoom: RemoveRecommendRoom,
    RemoveElement_RemoveShopPopover: RemoveShopPopover
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
  function mittOnce(all) {
    const emitter = mitt(all);
    return {
      // 继承原生 mitt 的方法
      ...emitter,
      once(type, handler) {
        emitter.on(type, function fn(evt) {
          emitter.off(type, fn);
          handler(evt);
        });
      }
    };
  }
  const useCacheStore = pinia$1.defineStore("cache", () => {
    const cache = vue.reactive(Storage.getCache());
    const currentScriptType = vue.ref("Main");
    function startMainBLTHAliveHeartBeat() {
      cache.lastAliveHeartBeatTime = Date.now();
      const timer = setInterval(() => cache.lastAliveHeartBeatTime = Date.now(), 5e3);
      window.addEventListener("unload", () => {
        clearInterval(timer);
        cache.lastAliveHeartBeatTime = 0;
      });
    }
    function checkCurrentScriptType() {
      if (cache.lastAliveHeartBeatTime !== 0 && Date.now() - cache.lastAliveHeartBeatTime < 8e3) {
        if (sessionStorage.getItem("main_blth_flag") === null) {
          currentScriptType.value = "Other";
        } else {
          currentScriptType.value = "SubMain";
        }
      } else {
        currentScriptType.value = "Main";
        sessionStorage.setItem("main_blth_flag", "🚩");
      }
    }
    vue.watch(cache, (newCache) => Storage.setCache(newCache));
    return {
      cache,
      currentScriptType,
      startMainBLTHAliveHeartBeat,
      checkCurrentScriptType
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
        medalTasks: {
          light: "",
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
  const allAndTopFrameModuleNames = [];
  function loadDefaultModules() {
    const cacheStore2 = useCacheStore();
    const promiseArray = [];
    for (const [name, module] of Object.entries(defaultModules)) {
      if (module.runOnMultiplePages || cacheStore2.currentScriptType !== "Other") {
        promiseArray.push(runModule(module, name));
      }
    }
    return Promise.allSettled(promiseArray);
  }
  function runModule(module, name) {
    const moduleInstance = new module(name);
    if (moduleInstance.isEnabled()) {
      return moduleInstance.run();
    }
  }
  const useModuleStore = pinia$1.defineStore("module", () => {
    const moduleConfig = vue.reactive(Storage.getModuleConfig());
    const emitter = mittOnce();
    const moduleStatus = vue.reactive(defaultModuleStatus);
    function loadModules(isOnTargetFrame) {
      const cacheStore2 = useCacheStore();
      if (isOnTargetFrame === "unknown") {
        for (const [name, module] of Object.entries(otherModules)) {
          if (module.onFrame === "all" || module.onFrame === "top" && isSelfTopFrame()) {
            if (module.runOnMultiplePages || cacheStore2.currentScriptType !== "Other") {
              if (!module.runAfterDefault) {
                waitForMoment(module.runAt).then(() => runModule(module, name));
                allAndTopFrameModuleNames.push(name);
              }
            }
          }
        }
      } else {
        const moduleAfterDefault = {};
        const defaultModulesLoadingResult = loadDefaultModules();
        for (const [name, module] of Object.entries(otherModules)) {
          if (module.onFrame === "target" || module.onFrame === "top" && isSelfTopFrame() && !allAndTopFrameModuleNames.includes(name) || module.onFrame === "all" && !allAndTopFrameModuleNames.includes(name)) {
            if (module.runOnMultiplePages || cacheStore2.currentScriptType !== "Other") {
              if (module.runAfterDefault) {
                moduleAfterDefault[name] = module;
              } else {
                waitForMoment(module.runAt).then(() => runModule(module, name));
              }
            }
          }
        }
        defaultModulesLoadingResult.then((results) => {
          for (const result of results) {
            if (result.status === "rejected") {
              const error = result.reason;
              if (error instanceof ModuleCriticalError) {
                new Logger(error.moduleName).error(error.message);
                return;
              } else if (error instanceof ModuleError) {
                new Logger(error.moduleName).error(error.message);
              } else {
                new Logger("ModuleStore").error(`意外错误: ${error.message}`);
                return;
              }
            }
          }
          for (const [name, module] of Object.entries(moduleAfterDefault)) {
            waitForMoment(module.runAt).then(() => runModule(module, name));
          }
        });
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
  const helpInfo = {
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
          message: vue.h("p", [vue.h("div", "完成直播签到任务。")])
        },
        medalTasks: {
          list: {
            title: "黑白名单 / 排序模式",
            message: vue.h("p", [
              vue.h(
                "div",
                "为了更精细地控制为哪些粉丝勋章执行点亮熄灭勋章和观看直播任务，你可以使用黑名单或白名单模式。"
              ),
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
              vue.h("div", "点击编辑名单按钮，然后使用第一列的多选框即可编辑名单中的粉丝勋章。"),
              vue.h(
                "div",
                "使用白名单模式时，可点击【编辑名单】窗口右下角的按钮即可从【常规模式】切换到【排序模式】。"
              ),
              vue.h("div", "在排序模式下，你可以调整脚本执行观看任务的粉丝勋章顺序。"),
              vue.h("div", [
                vue.h("li", "使用鼠标拖拽表格中的行来调整顺序。"),
                vue.h("li", "拖拽行至表格的顶部和底部可以触发滚动。")
              ])
            ])
          },
          light: {
            main: {
              title: "点亮熄灭勋章",
              message: vue.h("p", [
                vue.h("div", "在你的每个已熄灭的粉丝勋章对应的直播间完成点亮任务，从而点亮粉丝勋章。"),
                vue.h("div", "支持两种点亮方式，可自由选择："),
                vue.h("div", [
                  vue.h("li", [vue.h("span", "点赞（不推荐）：点赞30次")]),
                  vue.h("li", [vue.h("strong", "发送弹幕（推荐）："), vue.h("span", "发送弹幕1条")])
                ])
              ])
            },
            like: {
              title: "点赞",
              message: vue.h("p", [
                vue.h("div", "在已熄灭粉丝勋章对应的直播间给主播点赞，点亮粉丝勋章。"),
                vue.h("div", [
                  vue.h("li", [vue.h("span", "点赞次数为略微超过任务要求的随机值。")]),
                  vue.h("li", [vue.h("span", "部分直播间无法完成该任务，原因未知。")])
                ]),
                vue.h("div", [
                  vue.h("strong", "注意："),
                  vue.h("span", "点赞只能点亮正在直播的直播间对应的粉丝勋章。")
                ])
              ])
            },
            danmu: {
              title: "发送弹幕",
              message: vue.h("p", [
                vue.h("div", "在已熄灭粉丝勋章对应的直播间发送一条弹幕，点亮粉丝勋章。"),
                vue.h("div", [
                  vue.h("span", "点击编辑弹幕按钮编辑发送的弹幕，脚本会从中按顺序循环抽取弹幕发送。"),
                  vue.h("span", "部分直播间无法完成该任务，可能的原因有:"),
                  vue.h("div", [
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
              ])
            }
          },
          watch: {
            title: "观看直播",
            message: vue.h("p", [
              vue.h("div", "完成粉丝勋章的观看直播任务。"),
              vue.h("div", [
                vue.h("li", "部分直播间因为没有设置直播分区导致任务无法完成。"),
                vue.h("li", "主播当前是否开播不会影响该任务的完成。"),
                vue.h(
                  "li",
                  "根据目前的亲密度规则，将每个直播间的观看时长设置为25分钟即可获得全部亲密度。"
                )
              ]),
              vue.h("div", [
                vue.h("strong", "注意："),
                vue.h(
                  "span",
                  "使用本功能时不能以任何方式观看直播（网页、APP、电视），否则可能无法获得任何亲密度。"
                )
              ])
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
      },
      noReport: {
        title: "拦截日志数据上报",
        message: vue.h("p", [
          vue.h("div", "禁止B站上报日志数据。"),
          vue.h("div", [
            vue.h(
              "span",
              "B站会实时地上报大量日志信息，比如直播观看情况、代码报错等等。开启本功能后绝大多数日志上报都会被劫持或拦截并返回一个成功的响应。相比于带有广告拦截功能的浏览器拓展，比如"
            ),
            vue.h(
              "a",
              {
                href: "https://github.com/gorhill/uBlock",
                rel: "noreferrer",
                target: "_blank"
              },
              "uBlock Origin"
            ),
            vue.h(
              "span",
              "，本功能会通过劫持的方式从根源上阻止部分日志上报，并模拟成功的响应来尽可能地减少B站代码的报错。理论上来说这样做会有更好的性能表现。"
            )
          ])
        ])
      },
      noSleep: {
        title: "屏蔽挂机检测",
        message: vue.h("p", [
          vue.h("div", "屏蔽B站直播间的挂机检测。"),
          vue.h(
            "div",
            "如果长时间没有操作，会提示“检测到您已离开当前屏幕，倒计时后即将暂停播放”。开启本功能后即可避免这种情况。"
          )
        ])
      },
      invisibility: {
        title: "隐身入场",
        message: vue.h("p", [vue.h("div", "进入直播间时其他人不会收到提示，但还是会出现在高能用户榜单上。")])
      }
    },
    RemoveElement: {
      removePKBox: {
        title: "移除大乱斗元素",
        message: "移除直播间的大乱斗元素（进度条，弹出的提示等）。"
      },
      removeLiveWaterMark: {
        title: "移除直播间水印",
        message: "移除直播画面左上角的水印。"
      },
      removeShopPopover: {
        title: "移除直播间小橙车弹窗",
        message: "移除直播间左上角的小橙车弹窗。"
      },
      removeGameParty: {
        title: "移除直播间幻星派对标志",
        message: "移除直播间右下角的幻星派对标志。"
      },
      removeGiftPopover: {
        title: "移除礼物赠送提示弹窗",
        message: "移除直播间右下角的礼物赠送提示弹窗（赠送一个牛蛙牛蛙支持主播）。"
      },
      removeMicPopover: {
        title: "移除连麦状态提示",
        message: "移除直播间左上角的连麦提示弹窗（连线功能只能在手机端使用，快使用手机登录吧～）。"
      },
      removeComboCard: {
        title: "移除直播间相同弹幕连续提示",
        message: "移除直播间相同弹幕连续提示。"
      },
      removeRank: {
        title: "移除排行榜",
        message: "移除直播画面上方的人气榜/航海榜，赠送人气票的入口也在这里。"
      },
      removeHeaderStuff: {
        title: "移除直播画面上方杂项",
        message: "移除直播画面上方各种杂七杂八的东西，比如排行榜、活动轮播图等。"
      },
      removeFlipView: {
        title: "移除礼物栏下方广告",
        message: "移除礼物栏下方广告。"
      },
      removeRecommendRoom: {
        title: "移除礼物栏下方推荐直播间",
        message: "移除礼物栏下方推荐直播间。"
      },
      removeLiveMosaic: {
        title: "移除直播间马赛克",
        message: "移除部分直播间特有的马赛克。"
      }
    }
  };
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "MainSiteTasks",
    setup(__props) {
      const moduleStore2 = useModuleStore();
      const config = moduleStore2.moduleConfig.DailyTasks.MainSiteTasks;
      const status = moduleStore2.moduleStatus.DailyTasks.MainSiteTasks;
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).login.enabled,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).login.enabled = $event),
                    "active-text": "每日登录"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.MainSiteTasks.login
                  }, null, 8, ["item"]),
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).watch.enabled,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).watch.enabled = $event),
                    "active-text": "每日观看视频"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.MainSiteTasks.watch
                  }, null, 8, ["item"]),
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
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
                    default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                      vue.createTextVNode("个")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.MainSiteTasks.coin
                  }, null, 8, ["item"]),
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).share.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).share.enabled = $event),
                    "active-text": "每日分享视频"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.MainSiteTasks.share
                  }, null, 8, ["item"]),
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
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_text, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                      vue.createTextVNode("  主站每日任务的完成情况可在")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(_component_el_link, {
                    rel: "noreferrer",
                    type: "primary",
                    href: "https://account.bilibili.com/account/home",
                    target: "_blank",
                    style: { "vertical-align": "unset" }
                  }, {
                    default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                      vue.createTextVNode("个人中心")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => _cache[8] || (_cache[8] = [
                      vue.createTextVNode("查看。")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => _cache[9] || (_cache[9] = [
                      vue.createTextVNode("数据更新可能有一定的延时。")
                    ])),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const _hoisted_1$1 = { class: "avatar-wrap" };
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "LiveTasks",
    setup(__props) {
      const moduleStore2 = useModuleStore();
      const biliStore = useBiliStore();
      const uiStore = useUIStore();
      const medalTableMaxHeight = screen.height * 0.55;
      const danmuTableMaxHeight = screen.height * 0.5;
      const config = moduleStore2.moduleConfig.DailyTasks.LiveTasks;
      const status = moduleStore2.moduleStatus.DailyTasks.LiveTasks;
      const medalDanmuPanelVisible = vue.ref(false);
      const danmuTableData = vue.computed(
        () => config.medalTasks.light.danmuList.map((danmu) => {
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
          config.medalTasks.light.danmuList[index] = value;
        }).catch(() => {
        });
      };
      const handleDeleteDanmu = (index) => {
        if (config.medalTasks.light.danmuList.length === 1) {
          ElementPlus.ElMessage.warning({
            message: "至少要有一条弹幕",
            appendTo: ".el-dialog"
          });
          return;
        }
        config.medalTasks.light.danmuList.splice(index, 1);
      };
      const handleAddDanmu = () => {
        ElementPlus.ElMessageBox.prompt("请输入新增的弹幕内容", "新增弹幕", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          inputPattern: /^.{1,30}$/,
          inputErrorMessage: "弹幕内容不得为空且长度不能超过30",
          lockScroll: false
        }).then(({ value }) => {
          config.medalTasks.light.danmuList.push(value);
        }).catch(() => {
        });
      };
      const medalInfoPanelVisible = vue.ref(false);
      const medalInfoTableData = vue.computed({
        get() {
          const medals = biliStore.filteredFansMedals.map((medal) => ({
            avatar: medal.anchor_info.avatar,
            nick_name: medal.anchor_info.nick_name,
            medal_name: medal.medal.medal_name,
            medal_level: medal.medal.level,
            roomid: medal.room_info.room_id
          }));
          if (uiStore.uiConfig.medalInfoPanelSortMode) {
            const filteredMedals = medals.filter(
              (medal) => config.medalTasks.isWhiteList ? config.medalTasks.roomidList.includes(medal.roomid) : !config.medalTasks.roomidList.includes(medal.roomid)
            );
            const orderMap = arrayToMap(config.medalTasks.roomidList);
            return filteredMedals.sort((a, b) => orderMap.get(a.roomid) - orderMap.get(b.roomid));
          }
          return medals;
        },
        set(newValue) {
          config.medalTasks.roomidList = newValue.map((row) => row.roomid);
        }
      });
      const medalInfoLoading = vue.ref(false);
      let firstClickEditList = true;
      const handleEditList = async () => {
        medalInfoPanelVisible.value = true;
        if (firstClickEditList) {
          firstClickEditList = false;
          await vue.nextTick();
          if (!biliStore.fansMedals) {
            medalInfoLoading.value = true;
            vue.watch(
              medalInfoTableData,
              (newData) => {
                vue.nextTick(() => {
                  initSelection(newData);
                  medalInfoLoading.value = false;
                });
              },
              { once: true }
            );
            moduleStore2.emitter.emit("Default_FansMedals", {
              module: "LiveTasks"
            });
          } else {
            initSelection(medalInfoTableData.value);
          }
        }
      };
      const medalInfoTableRef = vue.ref();
      const initSelection = (rows) => {
        if (rows) {
          config.medalTasks.roomidList.forEach((roomid, index) => {
            var _a;
            const row = rows.find((row2) => row2.roomid === roomid);
            if (row) {
              (_a = medalInfoTableRef.value) == null ? void 0 : _a.toggleRowSelection(row, true);
            } else {
              config.medalTasks.roomidList.splice(index, 1);
            }
          });
        }
      };
      function handleSelect(selection) {
        config.medalTasks.roomidList = selection.map((row) => row.roomid);
      }
      function handleRowClick(row) {
        var _a, _b;
        (_a = medalInfoTableRef.value) == null ? void 0 : _a.toggleRowSelection(row);
        const selection = (_b = medalInfoTableRef.value) == null ? void 0 : _b.getSelectionRows();
        config.medalTasks.roomidList = selection.map((row2) => row2.roomid);
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
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_radio_group = vue.resolveComponent("el-radio-group");
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).sign.enabled,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).sign.enabled = $event),
                    "active-text": "直播签到"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.LiveTasks.sign
                  }, null, 8, ["item"]),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).sign
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.light.enabled,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).medalTasks.light.enabled = $event),
                    "active-text": "点亮熄灭勋章"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.LiveTasks.medalTasks.light.main
                  }, null, 8, ["item"]),
                  vue.createVNode(_component_TaskStatus, {
                    status: vue.unref(status).medalTasks.light
                  }, null, 8, ["status"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_radio_group, {
                modelValue: vue.unref(config).medalTasks.light.mode,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).medalTasks.light.mode = $event),
                class: "radio-group"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_space, {
                        wrap: "",
                        size: [8, 0]
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_icon, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_SemiSelect)
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_radio, { value: "like" }, {
                            default: vue.withCtx(() => _cache[14] || (_cache[14] = [
                              vue.createTextVNode("点赞")
                            ])),
                            _: 1
                          }),
                          vue.createVNode(_component_Info, {
                            item: vue.unref(helpInfo).DailyTasks.LiveTasks.medalTasks.light.like
                          }, null, 8, ["item"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_space, {
                        wrap: "",
                        size: [8, 0]
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_icon, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_SemiSelect)
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_radio, { value: "danmu" }, {
                            default: vue.withCtx(() => _cache[15] || (_cache[15] = [
                              vue.createTextVNode("发送弹幕")
                            ])),
                            _: 1
                          }),
                          vue.createVNode(_component_el_button, {
                            type: "primary",
                            size: "small",
                            icon: vue.unref(ElementPlusIconsVue.Edit),
                            onClick: _cache[2] || (_cache[2] = ($event) => medalDanmuPanelVisible.value = !medalDanmuPanelVisible.value)
                          }, {
                            default: vue.withCtx(() => _cache[16] || (_cache[16] = [
                              vue.createTextVNode("编辑弹幕 ")
                            ])),
                            _: 1
                          }, 8, ["icon"]),
                          vue.createVNode(_component_Info, {
                            item: vue.unref(helpInfo).DailyTasks.LiveTasks.medalTasks.light.danmu
                          }, null, 8, ["item"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.watch.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).medalTasks.watch.enabled = $event),
                    "active-text": "观看直播"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_select, {
                    modelValue: vue.unref(config).medalTasks.watch.time,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(config).medalTasks.watch.time = $event),
                    placeholder: "Select",
                    style: { "width": "70px" }
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(6, (i) => {
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
                    default: vue.withCtx(() => _cache[17] || (_cache[17] = [
                      vue.createTextVNode("分钟 / 直播间")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.LiveTasks.medalTasks.watch
                  }, null, 8, ["item"]),
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).medalTasks.isWhiteList,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(config).medalTasks.isWhiteList = $event),
                    "active-text": "白名单",
                    "inactive-text": "黑名单",
                    onChange: _cache[7] || (_cache[7] = (val) => !val && (vue.unref(uiStore).uiConfig.medalInfoPanelSortMode = false))
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    size: "small",
                    icon: vue.unref(ElementPlusIconsVue.Edit),
                    onClick: handleEditList
                  }, {
                    default: vue.withCtx(() => _cache[18] || (_cache[18] = [
                      vue.createTextVNode("编辑名单 ")
                    ])),
                    _: 1
                  }, 8, ["icon"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.LiveTasks.medalTasks.list
                  }, null, 8, ["item"])
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
                default: vue.withCtx(() => _cache[19] || (_cache[19] = [
                  vue.createTextVNode("直播任务相关信息可在")
                ])),
                _: 1
              }),
              vue.createVNode(_component_el_link, {
                rel: "noreferrer",
                type: "primary",
                href: "https://link.bilibili.com/p/help/index#/audience-fans-medal",
                target: "_blank"
              }, {
                default: vue.withCtx(() => _cache[20] || (_cache[20] = [
                  vue.createTextVNode("帮助中心 ")
                ])),
                _: 1
              }),
              vue.createVNode(_component_el_text, null, {
                default: vue.withCtx(() => _cache[21] || (_cache[21] = [
                  vue.createTextVNode("查看。")
                ])),
                _: 1
              })
            ]),
            _: 1
          }),
          _cache[25] || (_cache[25] = vue.createElementVNode("br", null, null, -1)),
          vue.createVNode(_component_el_dialog, {
            modelValue: medalDanmuPanelVisible.value,
            "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => medalDanmuPanelVisible.value = $event),
            title: "编辑弹幕内容",
            "lock-scroll": false,
            width: "40%"
          }, {
            footer: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                type: "primary",
                onClick: handleAddDanmu
              }, {
                default: vue.withCtx(() => _cache[24] || (_cache[24] = [
                  vue.createTextVNode("新增弹幕")
                ])),
                _: 1
              })
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(ElementPlus.ElTable), {
                data: danmuTableData.value,
                "max-height": danmuTableMaxHeight
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    type: "index",
                    width: "80"
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
                        default: vue.withCtx(() => _cache[22] || (_cache[22] = [
                          vue.createTextVNode(" 修改 ")
                        ])),
                        _: 2
                      }, 1032, ["icon", "onClick"]),
                      vue.createVNode(_component_el_button, {
                        text: "",
                        icon: vue.unref(ElementPlusIconsVue.Delete),
                        type: "danger",
                        onClick: ($event) => handleDeleteDanmu(scope.$index)
                      }, {
                        default: vue.withCtx(() => _cache[23] || (_cache[23] = [
                          vue.createTextVNode(" 删除 ")
                        ])),
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
            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => medalInfoPanelVisible.value = $event),
            title: "编辑粉丝勋章名单",
            "lock-scroll": false
          }, {
            footer: vue.withCtx(() => [
              vue.createVNode(_component_el_switch, {
                disabled: !vue.unref(config).medalTasks.isWhiteList,
                modelValue: vue.unref(uiStore).uiConfig.medalInfoPanelSortMode,
                "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => vue.unref(uiStore).uiConfig.medalInfoPanelSortMode = $event),
                "inactive-text": "常规模式",
                "active-text": "排序模式",
                onChange: _cache[12] || (_cache[12] = (val) => !val && vue.nextTick(() => initSelection(medalInfoTableData.value)))
              }, null, 8, ["disabled", "modelValue"])
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(vueDraggablePlus.VueDraggable), {
                modelValue: medalInfoTableData.value,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => medalInfoTableData.value = $event),
                target: "#draggable-fans-medal-table table tbody",
                disabled: !vue.unref(uiStore).uiConfig.medalInfoPanelSortMode,
                animation: 150,
                "scroll-sensitivity": 36,
                "scroll-speed": 8
              }, {
                default: vue.withCtx(() => [
                  vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElTable), {
                    id: "draggable-fans-medal-table",
                    ref_key: "medalInfoTableRef",
                    ref: medalInfoTableRef,
                    data: medalInfoTableData.value,
                    "max-height": medalTableMaxHeight,
                    "empty-text": "没有粉丝勋章",
                    onSelect: handleSelect,
                    onSelectAll: handleSelect,
                    onRowClick: handleRowClick,
                    "row-key": (row) => row.roomid.toString()
                  }, {
                    default: vue.withCtx(() => [
                      !vue.unref(uiStore).uiConfig.medalInfoPanelSortMode ? (vue.openBlock(), vue.createBlock(_component_el_table_column, {
                        key: 0,
                        type: "selection",
                        align: "center",
                        width: "80"
                      })) : (vue.openBlock(), vue.createBlock(_component_el_table_column, {
                        key: 1,
                        type: "index",
                        align: "center",
                        width: "80"
                      })),
                      vue.createVNode(_component_el_table_column, {
                        prop: "avatar",
                        label: "头像",
                        width: "100"
                      }, {
                        default: vue.withCtx((scope) => [
                          vue.createElementVNode("div", _hoisted_1$1, [
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
                        width: "80",
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
                            target: "_blank",
                            onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
                            }, ["stop"]))
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
                  }, 8, ["data", "row-key"])), [
                    [_directive_loading, medalInfoLoading.value]
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]);
      };
    }
  });
  const LiveTasks = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-584fbcd9"]]);
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "OtherTasks",
    setup(__props) {
      const moduleStore2 = useModuleStore();
      const config = moduleStore2.moduleConfig.DailyTasks.OtherTasks;
      const status = moduleStore2.moduleStatus.DailyTasks.OtherTasks;
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
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.OtherTasks.groupSign
                  }, null, 8, ["item"]),
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
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.OtherTasks.silverToCoin
                  }, null, 8, ["item"]),
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).coinToSilver.enabled,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).coinToSilver.enabled = $event),
                    "active-text": "硬币换银瓜子"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_text, null, {
                    default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                      vue.createTextVNode("花费硬币")
                    ])),
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
                    default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                      vue.createTextVNode("个")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.OtherTasks.coinToSilver
                  }, null, 8, ["item"]),
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).getYearVipPrivilege.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).getYearVipPrivilege.enabled = $event),
                    "active-text": "领取年度大会员权益"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).DailyTasks.OtherTasks.getYearVipPrivilege
                  }, null, 8, ["item"]),
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
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "EnhanceExperience",
    setup(__props) {
      const moduleStore2 = useModuleStore();
      const config = moduleStore2.moduleConfig.EnhanceExperience;
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
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
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
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).EnhanceExperience.switchLiveStreamQuality
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).banp2p.enabled,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).banp2p.enabled = $event),
                    "active-text": "禁用P2P"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).EnhanceExperience.banp2p
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).noReport.enabled,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).noReport.enabled = $event),
                    "active-text": "拦截日志数据上报"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).EnhanceExperience.noReport
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).noSleep.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).noSleep.enabled = $event),
                    "active-text": "屏蔽挂机检测"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).EnhanceExperience.noSleep
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).invisibility.enabled,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(config).invisibility.enabled = $event),
                    "active-text": "隐身入场"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).EnhanceExperience.invisibility
                  }, null, 8, ["item"])
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
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "RemoveElement",
    setup(__props) {
      const moduleStore2 = useModuleStore();
      const config = moduleStore2.moduleConfig.RemoveElement;
      return (_ctx, _cache) => {
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_Info = vue.resolveComponent("Info");
        const _component_el_space = vue.resolveComponent("el-space");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_divider = vue.resolveComponent("el-divider");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removePKBox.enabled,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).removePKBox.enabled = $event),
                    "active-text": "移除大乱斗元素"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removePKBox
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeLiveWaterMark.enabled,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).removeLiveWaterMark.enabled = $event),
                    "active-text": "移除直播间水印"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeLiveWaterMark
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeShopPopover.enabled,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).removeShopPopover.enabled = $event),
                    "active-text": "移除直播间小橙车弹窗"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeShopPopover
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeGameParty.enabled,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).removeGameParty.enabled = $event),
                    "active-text": "移除直播间幻星派对标志"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeGameParty
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeGiftPopover.enabled,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).removeGiftPopover.enabled = $event),
                    "active-text": "移除礼物赠送提示弹窗"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeGiftPopover
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeMicPopover.enabled,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(config).removeMicPopover.enabled = $event),
                    "active-text": "移除连麦状态提示"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeMicPopover
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeComboCard.enabled,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(config).removeComboCard.enabled = $event),
                    "active-text": "移除直播间相同弹幕连续提示"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeComboCard
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeRank.enabled,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(config).removeRank.enabled = $event),
                    "active-text": "移除排行榜"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeRank
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeHeaderStuff.enabled,
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.unref(config).removeHeaderStuff.enabled = $event),
                    "active-text": "移除直播画面上方杂项"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeHeaderStuff
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeFlipView.enabled,
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => vue.unref(config).removeFlipView.enabled = $event),
                    "active-text": "移除礼物栏下方广告"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeFlipView
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, { "wrap:size": "[8, 0]" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeRecommendRoom.enabled,
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => vue.unref(config).removeRecommendRoom.enabled = $event),
                    "active-text": "移除礼物栏下方推荐直播间"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeRecommendRoom
                  }, null, 8, ["item"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [8, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_switch, {
                    modelValue: vue.unref(config).removeLiveMosaic.enabled,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => vue.unref(config).removeLiveMosaic.enabled = $event),
                    "active-text": "移除直播间马赛克"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_Info, {
                    item: vue.unref(helpInfo).RemoveElement.removeLiveMosaic
                  }, null, 8, ["item"])
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
    __name: "ScriptSettings",
    setup(__props) {
      const uiConfig = useUIStore().uiConfig;
      return (_ctx, _cache) => {
        const _component_el_text = vue.resolveComponent("el-text");
        const _component_el_slider = vue.resolveComponent("el-slider");
        const _component_el_space = vue.resolveComponent("el-space");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_row, { align: "middle" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_space, {
                wrap: "",
                size: [16, 0]
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_text, { class: "label-text" }, {
                    default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                      vue.createTextVNode("控制面板宽度")
                    ])),
                    _: 1
                  }),
                  vue.createVNode(_component_el_slider, {
                    style: { "width": "150px" },
                    class: "slider",
                    modelValue: vue.unref(uiConfig).panelWidthPercent,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(uiConfig).panelWidthPercent = $event),
                    min: 30,
                    max: 60
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const ScriptSettings = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-1cb0d081"]]);
  const __default__ = vue.defineComponent({
    components: {
      MainSiteTasks: _sfc_main$a,
      LiveTasks,
      OtherTasks: _sfc_main$8,
      EnhanceExperience: _sfc_main$7,
      RemoveElement: _sfc_main$6,
      ScriptSettings
    }
  });
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
      const logger2 = new Logger("App.vue");
      let isShowPanel = uiStore.uiConfig.isShowPanel;
      uiStore.uiConfig.isShowPanel = false;
      let livePlayer;
      let button;
      function updatePosition() {
        const rect = livePlayer.getBoundingClientRect();
        uiStore.livePlayerRect.top = rect.top;
        uiStore.livePlayerRect.left = rect.left;
        uiStore.livePlayerRect.height = rect.height;
        uiStore.livePlayerRect.width = rect.width;
        uiStore.windowScrollPosition.x = _unsafeWindow.scrollX;
        uiStore.windowScrollPosition.y = _unsafeWindow.scrollY;
      }
      function buttonOnClick() {
        uiStore.changeShowPanel();
        button.innerText = uiStore.isShowPanelButtonText;
      }
      const throttleButtonOnClick = _.throttle(buttonOnClick, 300);
      livePlayer = dq("#live-player-ctnr");
      if (livePlayer) {
        updatePosition();
        waitForElement(dq("#player-ctnr"), ".left-ctnr.left-header-area", 1e4).then((playerHeaderLeft) => {
          button = dce("button");
          button.setAttribute("class", "blth_btn");
          button.onclick = throttleButtonOnClick;
          button.innerText = uiStore.isShowPanelButtonText;
          playerHeaderLeft.append(button);
          if (!isSelfTopFrame()) {
            hotkeys(
              "alt+b",
              {
                element: topFrameDocumentElement()
              },
              throttleButtonOnClick
            );
          }
          hotkeys("alt+b", throttleButtonOnClick);
        }).catch((e) => logger2.error(e));
        window.addEventListener("resize", () => updatePosition());
        const observer = new MutationObserver(() => updatePosition());
        observer.observe(document.body, { attributes: true });
        observer.observe(document.documentElement, { attributes: true });
        if (isShowPanel) {
          uiStore.uiConfig.isShowPanel = true;
        }
      } else {
        logger2.error("livePlayer not found");
      }
      return (_ctx, _cache) => {
        const _component_el_header = vue.resolveComponent("el-header");
        const _component_el_aside = vue.resolveComponent("el-aside");
        const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
        const _component_el_main = vue.resolveComponent("el-main");
        const _component_el_container = vue.resolveComponent("el-container");
        const _component_el_collapse_transition = vue.resolveComponent("el-collapse-transition");
        return vue.openBlock(), vue.createBlock(_component_el_collapse_transition, null, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createVNode(_component_el_container, {
              style: vue.normalizeStyle(vue.unref(uiStore).panelStyle),
              class: "base"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_header, { class: "header" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(PanelHeader)
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_container, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_aside, { class: "aside" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(PanelAside)
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_main, { class: "main" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_scrollbar, {
                          height: vue.unref(uiStore).scrollBarHeight
                        }, {
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
                        }, 8, ["height"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["style"]), [
              [vue.vShow, vue.unref(uiStore).uiConfig.isShowPanel]
            ])
          ]),
          _: 1
        });
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-24895187"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const _sfc_main$2 = {};
  const _hoisted_1 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "128",
    height: "128",
    class: "icon",
    viewBox: "0 0 1024 1024"
  };
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
      vue.createElementVNode("path", { d: "M831.825 63.94H191.94c-70.692 0-128 57.308-128 128v639.885c0 70.692 57.308 128 128 128h639.885c70.692 0 128-57.308 128-128V191.94c0-70.692-57.308-128-128-128zM895.885 832a63.835 63.835 0 0 1-63.973 63.886H192.088c-17.112 0-33.27-6.575-45.372-18.676S127.88 849.112 127.88 832V192a64.236 64.236 0 0 1 64.208-64.12h639.824A64.038 64.038 0 0 1 895.885 192v640z" }, null, -1),
      vue.createElementVNode("path", { d: "M791.998 351.852H536a31.97 31.97 0 0 0 0 63.94h256a31.97 31.97 0 0 0 0-63.94zm0 256.121H536a31.97 31.97 0 0 0 0 63.94h256a31.97 31.97 0 0 0 0-63.94zm-447.996-79.975c-61.856 0-111.986 50.144-111.986 111.985S282.16 751.97 344.002 751.97s111.985-50.144 111.985-111.986-50.13-111.985-111.985-111.985zm33.982 145.982a48.045 48.045 0 1 1 14.088-33.982 47.746 47.746 0 0 1-14.088 33.986zm39.412-376.586L311.999 402.787l-41.391-41.395a31.97 31.97 0 1 0-45.213 45.213l63.997 64.002a31.97 31.97 0 0 0 45.214 0l128-128a31.97 31.97 0 0 0-45.21-45.213z" }, null, -1)
    ]));
  }
  const TasksIcon = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "InfoIcon",
    props: {
      item: {}
    },
    setup(__props) {
      const props = __props;
      const open = () => {
        const { title, message } = props.item;
        ElementPlus.ElMessageBox({
          title,
          message,
          lockScroll: false,
          autofocus: true,
          confirmButtonText: "OK"
        }).catch(() => {
        });
      };
      return (_ctx, _cache) => {
        const _component_el_icon = vue.resolveComponent("el-icon");
        return vue.openBlock(), vue.createBlock(_component_el_icon, {
          class: "info-icon",
          onClick: open
        }, {
          default: vue.withCtx(() => _cache[0] || (_cache[0] = [
            vue.createElementVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "128",
              height: "128",
              class: "icon",
              viewBox: "0 0 1024 1024"
            }, [
              vue.createElementVNode("path", {
                fill: "#276BC0",
                d: "M512.67 959.47c-246.343 0-446.76-200.632-446.76-447.24S266.326 64.98 512.67 64.98s446.76 200.642 446.76 447.25-200.416 447.24-446.76 447.24zm0-829.04c-210.291 0-381.38 171.283-381.38 381.8s171.089 381.79 381.38 381.79 381.381-171.273 381.381-381.79-171.09-381.8-381.38-381.8z"
              }),
              vue.createElementVNode("path", {
                fill: "#276BC0",
                d: "M447.29 317.172a63.891 63.959 0 1 0 130.76 0 63.891 63.959 0 1 0-130.76 0Zm64.907 503.047c-30.093 0-54.235-24.416-54.235-54.541V482.062c0-30.126 24.142-54.541 54.235-54.541 30.094 0 54.236 24.416 54.236 54.541v283.616c0 30.125-24.142 54.54-54.236 54.54z"
              })
            ], -1)
          ])),
          _: 1
        });
      };
    }
  });
  const InfoIcon = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-38289ed3"]]);
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
  const TaskStatusIcon = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b4254e0f"]]);
  const MyIconsVue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Info: InfoIcon,
    TaskStatus: TaskStatusIcon,
    Tasks: TasksIcon
  }, Symbol.toStringTag, { value: "Module" }));
  const logger = new Logger("Main");
  logger.log("document.readyState", document.readyState);
  const pinia = pinia$1.createPinia();
  const cacheStore = useCacheStore(pinia);
  const moduleStore = useModuleStore(pinia);
  cacheStore.checkCurrentScriptType();
  logger.log("当前脚本的类型为", cacheStore.currentScriptType);
  if (cacheStore.currentScriptType === "Main") {
    cacheStore.startMainBLTHAliveHeartBeat();
  }
  moduleStore.loadModules("unknown");
  await( waitForMoment("document-body"));
  if (isTargetFrame()) {
    const app = vue.createApp(App);
    app.use(ElementPlus);
    app.use(pinia);
    for (const [key, component] of Object.entries(ElementPlusIconsVue__namespace)) {
      app.component(key, component);
    }
    for (const [key, component] of Object.entries(MyIconsVue)) {
      app.component(key, component);
    }
    moduleStore.loadModules("yes");
    await( waitForMoment("document-end"));
    const div = dce("div");
    div.id = "BLTH";
    document.body.append(div);
    app.mount(div);
  }

})(Vue, Pinia, _, ElementPlusIconsVue, CryptoJS, luxon, ElementPlus, VueDraggablePlus, hotkeys);