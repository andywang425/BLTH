import { defineStore } from 'pinia'
import { reactive, computed, type CSSProperties, watch } from 'vue'
import Storage from '@/library/storage'
import _ from 'lodash'
import type { UiConfig, MenuIndex } from '@/types'

interface LivePlayerRect {
  top: number
  left: number
  height: number
  width: number
}

// 菜单index到名称的映射
const index2name: Record<MenuIndex, string> = {
  MainSiteTasks: '主站任务',
  LiveTasks: '直播任务',
  OtherTasks: '其它任务',
  EnhanceExperience: '体验优化',
  RemoveElement: '移除元素',
  ScriptSettings: '设置'
}

export const useUIStore = defineStore('ui', () => {
  // 控制面板 UI 相关的设置
  const uiConfig = reactive<UiConfig>(Storage.getUiConfig())
  // 被激活的菜单项的名称，用于在 Header 里显示子标题
  const activeMenuName = computed<string>(() => index2name[uiConfig.activeMenuIndex])
  // 播放器长、宽、位置信息
  const livePlayerRect = reactive<LivePlayerRect>({
    top: 0,
    left: 0,
    height: 0,
    width: 0
  })
  // 缓存的窗口滚动条位置
  const windowScrollPosition = reactive({ x: 0, y: 0 })
  // 控制面板 css（长、宽、位置信息）
  const panelStyle = computed<CSSProperties>(() => ({
    // 此处若使用最新的滚动条位置（window.scrollX/Y），用户在调整控制面板宽度时可能导致面板在垂直方向上错位
    top: `${livePlayerRect.top + windowScrollPosition.y}px`,
    left: `${livePlayerRect.left + windowScrollPosition.x}px`,
    height: `${livePlayerRect.height}px`,
    width: `${(livePlayerRect.width * uiConfig.panelWidthPercent) / 100}px`
  }))
  // 开关控制面板按钮的文字
  const isShowPanelButtonText = computed<string>(() =>
    uiConfig.isShowPanel ? '隐藏控制面板' : '显示控制面板'
  )
  // 控制面板主体的滚动条窗口高度
  // 因为 header 的高度是固定的 60px，所以用控制面板高度 - 60px
  const scrollBarHeight = computed<string>(() => `${livePlayerRect.height - 60}px`)

  /**
   * 切换侧边栏的展开/收起状态
   */
  function changeCollapse() {
    uiConfig.isCollapse = !uiConfig.isCollapse
  }

  /**
   * 切换控制面板的打开/关闭状态
   */
  function changeShowPanel() {
    uiConfig.isShowPanel = !uiConfig.isShowPanel
  }

  /**
   *设置被激活菜单项的名称，配合 el-menu 的 `@select` 使用
   * @param index 被激活菜单项
   */
  function setActiveMenuIndex(index: MenuIndex) {
    uiConfig.activeMenuIndex = index
  }

  // 监听UI配置信息的变化，使用防抖降低油猴写配置信息频率
  watch(
    uiConfig,
    _.debounce((newUiConfig: UiConfig) => Storage.setUiConfig(newUiConfig), 350)
  )

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
  }
})
