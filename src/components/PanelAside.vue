<script setup lang="ts">
import { useUIStore } from '../stores/useUIStore'

const uiStore = useUIStore()

interface menuItem {
  icon: string
  title: string
  index: string
  subs?: subMenuItem[]
}

interface subMenuItem {
  title: string
  index: string
}

const items: menuItem[] = [
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
  }
]
</script>

<template>
  <el-menu
    :default-active="uiStore.uiConfig.activeMenuIndex"
    :style="{ 'min-height': uiStore.scrollBarHeight }"
    :collapse="uiStore.uiConfig.isCollapse"
    unique-opened
    @select="uiStore.setActiveMenuIndex"
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
          <template v-for="subItem in item.subs" :key="subItem.index">
            <el-menu-item :index="subItem.index">
              {{ subItem.title }}
            </el-menu-item>
          </template>
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
