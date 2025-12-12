<script setup lang="ts">
import { unsafeWindow } from '$'
import hotkeys from 'hotkeys-js'
import _ from 'lodash'
import PanelAside from './components/PanelAside.vue'
import PanelHeader from './components/PanelHeader.vue'
import PanelMain from './components/PanelMain.vue'
import { dce, dq, isSelfTopFrame, topFrameDocumentElement, waitForElement } from './library/dom'
import Logger from './library/logger'
import { useUIStore } from './stores'

const uiStore = useUIStore()

const logger = new Logger('App.vue')

// 临时存储一下是否显示控制面板
const isShowPanel = uiStore.uiConfig.isShowPanel
// 先设置为不显示，等准备工作完成了再显示（如果原来的配置是显示的话）
// 太早显示会导致几个字悬浮在屏幕左上角的问题
uiStore.uiConfig.isShowPanel = false
// 显示/隐藏控制面板按钮
let button: HTMLButtonElement
/**
 * 更新播放器的大小、位置和滚动条位置
 */
function updatePosition() {
  const rect: DOMRect = livePlayer!.getBoundingClientRect()

  uiStore.livePlayerRect.top = rect.top
  uiStore.livePlayerRect.left = rect.left
  uiStore.livePlayerRect.height = rect.height
  uiStore.livePlayerRect.width = rect.width
  // 窗口滚动条位置需和播放器的大小、位置同步更新
  uiStore.windowScrollPosition.x = unsafeWindow.scrollX
  uiStore.windowScrollPosition.y = unsafeWindow.scrollY
}
/**
 * 显示/隐藏控制面板按钮被点击
 */
function buttonOnClick() {
  uiStore.changeShowPanel()
  button.innerText = uiStore.isShowPanelButtonText
}
// 节流，防止点击过快，减小渲染压力
const throttleButtonOnClick = _.throttle(buttonOnClick, 300)
// 播放器节点出现在最初的html中，可以直接获取
const livePlayer = dq('#live-player-ctnr')
if (livePlayer) {
  updatePosition()
  // 查找播放器上面的 header
  // 节点#player-ctnr在初始html中出现
  waitForElement(dq('#player-ctnr')!, '.left-ctnr.left-header-area', 10e3)
    .then((playerHeaderLeft) => {
      // 创建显示/隐藏控制面板按钮
      button = dce('button')
      button.setAttribute('class', 'blth-btn')
      button.onclick = throttleButtonOnClick
      button.innerText = uiStore.isShowPanelButtonText
      playerHeaderLeft.append(button)
      if (!isSelfTopFrame()) {
        // 在特殊直播间，脚本所在的目标 frame 只占屏幕中间一块地方
        // 如果焦点不在里面，快捷键会失效
        // 所以这里额外把 hotkeys 注入到顶层 frame 确保快捷键总是可用
        hotkeys(
          'alt+b',
          {
            element: topFrameDocumentElement(),
          },
          throttleButtonOnClick,
        )
      }
      hotkeys('alt+b', throttleButtonOnClick)
    })
    .catch((e: Error) => logger.error(e))
  // 监听页面缩放，调整控制面板大小
  // 因为这个操作频率不高就不节流或防抖了
  window.addEventListener('resize', () => updatePosition())
  // 监听 html 根节点和 body 节点
  // 适配播放器网页模式
  const observer = new MutationObserver(() => updatePosition())
  observer.observe(document.body, { attributes: true })
  observer.observe(document.documentElement, { attributes: true })

  // 准备完毕，显示控制面板
  if (isShowPanel) {
    uiStore.uiConfig.isShowPanel = true
  }
} else {
  logger.error('livePlayer not found')
}
</script>

<template>
  <el-collapse-transition>
    <el-container v-show="uiStore.uiConfig.isShowPanel" :style="uiStore.panelStyle" class="base">
      <el-header class="header">
        <PanelHeader />
      </el-header>
      <el-container>
        <el-aside class="aside">
          <PanelAside />
        </el-aside>
        <el-main class="main">
          <el-scrollbar :height="uiStore.scrollBarHeight">
            <KeepAlive>
              <Transition name="fade" mode="out-in">
                <PanelMain class="panel-main" />
              </Transition>
            </KeepAlive>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </el-collapse-transition>
</template>

<style scoped>
.base {
  position: absolute;
  z-index: 1003;
  background-color: var(--el-bg-color);
}

.header {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  font-size: var(--big-text-size);
  border-bottom: 1px solid #e3e5e7;

  --big-text-size: 25px;
}

.aside {
  width: auto;
}

.main {
  padding: 0;
}

.panel-main {
  padding: calc(var(--el-main-padding) * 0.625) var(--el-main-padding);
}

/* PanelMain切换时的动画效果 */
.fade-enter-active {
  animation: fade-in linear 0.2s;
}
</style>
