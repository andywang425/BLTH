import { defineStore } from 'pinia'
import { reactive, computed, type CSSProperties, watch } from 'vue'
import Storage from '../library/storage'
import _ from 'lodash'
import type { UiConfig, MenuIndex } from '../types'

interface BaseStyleValue {
  top: number
  left: number
  height: number
  width: number
}

export const useUIStore = defineStore('ui', () => {
  // 控制面板 UI 相关的设置
  const uiConfig: UiConfig = reactive(Storage.getUiConfig())
  // 被激活的菜单项的名称，用于在 Header 里显示子标题
  const activeMenuName = computed<string>(() => {
    const index2name: { [index in MenuIndex]: string } = {
      MainSiteTasks: '主站任务',
      LiveTasks: '直播任务',
      OtherTasks: '其它任务',
      EnhanceExperience: '体验优化',
      RemoveElement: '移除元素'
    }
    return index2name[uiConfig.activeMenuIndex]
  })
  // 控制面板长、宽、位置信息
  const baseStyleValue: BaseStyleValue = reactive({
    top: 0,
    left: 0,
    height: 0,
    width: 0
  })
  // 把 number 转换为 css 的值
  const baseStyle = computed<CSSProperties>(() => ({
    top: baseStyleValue.top.toString() + 'px',
    left: baseStyleValue.left.toString() + 'px',
    height: baseStyleValue.height.toString() + 'px',
    width: baseStyleValue.width.toString() + 'px'
  }))
  // 开关控制面板按钮的文字
  const isShowPanelButtonText = computed<string>(() => {
    if (uiConfig.isShowPanel) {
      return '隐藏控制面板'
    } else {
      return '显示控制面板'
    }
  })
  // 控制面板主体的滚动条窗口高度
  // 因为 header 的高度是固定的 60px，所以用控制面板高度 - 60px
  const scrollBarHeight = computed<string>(() => (baseStyleValue.height - 60).toString() + 'px')
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
    baseStyleValue,
    baseStyle,
    scrollBarHeight,
    uiConfig,
    changeCollapse,
    changeShowPanel,
    setActiveMenuIndex
  }
})
