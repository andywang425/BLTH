<script setup lang="ts">
import { useUIStore } from '@/stores/useUIStore'
import type { MenuIndex } from '@/types'

const uiStore = useUIStore()

interface MenuItem {
  icon: string
  title: string
  index: string
  subs?: SubMenuItem[]
}

interface SubMenuItem {
  title: string
  index: string
}

const items: MenuItem[] = [
  {
    icon: 'Tasks',
    title: '每日任务',
    index: 'DailyTasks', // 有子菜单，index 无所谓
    subs: [
      {
        title: '主站任务',
        index: 'MainSiteTasks' // index 是组件名
      },
      {
        title: '直播任务',
        index: 'LiveTasks'
      },
      {
        title: '其它任务',
        index: 'OtherTasks'
      }
    ]
  },
  {
    icon: 'Monitor',
    title: '体验优化',
    index: 'EnhanceExperience'
  },
  {
    icon: 'Scissor',
    title: '移除元素',
    index: 'RemoveElement'
  },
  {
    icon: 'Setting',
    title: '设置',
    index: 'ScriptSettings'
  }
]
</script>

<template>
  <el-menu
    :default-active="uiStore.uiConfig.activeMenuIndex"
    :style="{ 'min-height': uiStore.scrollBarHeight }"
    :collapse="uiStore.uiConfig.isCollapse"
    unique-opened
    @select="(index: string) => uiStore.setActiveMenuIndex(index as MenuIndex)"
    id="aside-el-menu"
  >
    <template v-for="item in items">
      <template v-if="item.subs">
        <el-sub-menu :index="item.index" :key="item.index">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="subItem in item.subs" :index="subItem.index" :key="subItem.index">
            {{ subItem.title }}
          </el-menu-item>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="item.index" :key="item.index">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <template #title>
            {{ item.title }}
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<style scoped>
#aside-el-menu {
  height: 100%;
}
</style>
