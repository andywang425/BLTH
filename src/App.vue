<script setup lang="ts">
import { useUIStore } from './stores/useUIStore'
import { useModuleStore } from './stores/useModuleStore'
import PanelHeader from './components/PanelHeader.vue'
import PanelAside from './components/PanelAside.vue'
import PanelMain from './components/PanelMain.vue'
import { dce, dq, pollingQuery } from './library/dom'
import hotkeys from 'hotkeys-js'
import _ from 'lodash'
import { isSelfTopFrame, topFrameDocuemnt } from './library/dom'

const uiStore = useUIStore()
const moduleStore = useModuleStore()
// 临时存储一下是否显示控制面板
let isShowPanel = uiStore.uiConfig.isShowPanel
// 先设置为不显示，等准备工作完成了再显示（如果原来的配置是显示的话）
// 太早显示会导致几个字悬浮在屏幕左上角的问题
uiStore.uiConfig.isShowPanel = false
// B站的播放器
let livePlayer: Element | null
// 显示/隐藏控制面板按钮
let button: HTMLButtonElement
/**
 * 设置控制面板的大小和位置
 */
function setPanelSize() {
  const rect: DOMRect = (livePlayer as Element).getBoundingClientRect()

  uiStore.baseStyleValue.top = rect.top + window.scrollY
  uiStore.baseStyleValue.left = rect.left + window.scrollX
  uiStore.baseStyleValue.height = rect.height
  uiStore.baseStyleValue.width = rect.width * 0.4
}
/**
 * 显示/隐藏控制面板按钮被点击
 */
function buttonOnClick() {
  uiStore.changeShowPanel()
  button.innerText = uiStore.isShowPanelButtonText
}
// 节流，防止点击过快，减小渲染压力
const throttleButtoOnClick = _.throttle(buttonOnClick, 300)
// 加载模组，可以放在 window.onload 之前
moduleStore.loadModules()

window.onload = () => {
  livePlayer = dq('#live-player-ctnr')
  if (livePlayer) {
    setPanelSize()
    // 查找播放器上面的 header
    pollingQuery(document, '.left-ctnr.left-header-area', 300, 3000)
      .then((playerHeaderLeft) => {
        // 创建显示/隐藏控制面板按钮
        button = dce('button')
        button.setAttribute('class', 'blth_btn')
        button.onclick = throttleButtoOnClick
        button.innerText = uiStore.isShowPanelButtonText
        playerHeaderLeft.append(button)
        if (!isSelfTopFrame()) {
          // 在特殊直播间，脚本所在的 TargetFrame 只占屏幕中间一块地方
          // 如果焦点不在里面，快捷键会失效
          // 所以这里额外把 hotkeys 注入到顶层 frame 确保快捷键总是可用
          hotkeys(
            'alt+b',
            {
              element: topFrameDocuemnt() as any
            },
            throttleButtoOnClick
          )
        }
        hotkeys('alt+b', throttleButtoOnClick)
      })
      .catch(() => console.error("Can't find playerHeaderLeft in time"))
    // 监听页面缩放，调整控制面板大小
    // 因为这个操作频率不高就不节流或防抖了
    window.onresize = setPanelSize
    // 监听 html 根节点个 body 节点
    // 主要是为了适配滚动条的显示/隐藏和实验室中的功能
    const observer = new MutationObserver(() => setPanelSize())
    observer.observe(document.documentElement, { attributes: true })
    observer.observe(document.body, { attributes: true })

    // 准备完毕，显示控制面板
    if (isShowPanel) {
      uiStore.uiConfig.isShowPanel = true
    }
  } else {
    console.error('livePlayer not found')
  }
}
</script>

<template>
  <el-collapse-transition>
    <div :style="uiStore.baseStyle" class="base" v-show="uiStore.uiConfig.isShowPanel">
      <el-container>
        <el-header class="header">
          <PanelHeader />
        </el-header>
        <el-scrollbar :height="uiStore.scrollBarHeight">
          <el-container>
            <el-aside class="aside">
              <PanelAside />
            </el-aside>
            <el-main class="main">
              <KeepAlive>
                <Transition name="fade" mode="out-in">
                  <PanelMain />
                </Transition>
              </KeepAlive>
            </el-main>
          </el-container>
        </el-scrollbar>
      </el-container>
    </div>
  </el-collapse-transition>
</template>

<style scoped>
.base {
  z-index: 1003;
  position: absolute;
  background-color: white;
  border-bottom: 1px solid #e3e5e7;
  border-left: 1px solid #e3e5e7;
  border-right: 1px solid #e3e5e7;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  font-size: var(--big-text-size);
  align-items: center;
  display: flex;
  border-bottom: 1px solid #e3e5e7;
  height: 60px;
  --big-text-size: 25px;
}

.aside {
  width: auto;
}

.aside #aside-el-menu:not(.el-menu--collapse) {
  width: 150px;
}

.main {
  --main-top-botton-padding: calc(var(--el-main-padding) * 0.625);
  padding-top: var(--main-top-botton-padding);
  padding-bottom: var(--main-top-botton-padding);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
