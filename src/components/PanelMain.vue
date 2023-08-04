<script lang="ts">
import MainSiteTasks from './MainSiteTasks.vue'
import LiveTasks from './LiveTasks.vue'
import OtherTasks from './OtherTasks.vue'
import EnhanceExperience from './EnhanceExperience.vue'

// 注册对当前组件实例可用的组件
export default {
  components: {
    MainSiteTasks,
    LiveTasks,
    OtherTasks,
    EnhanceExperience
  }
}
</script>

<script setup lang="ts">
import { useUIStore } from '../stores/useUIStore'
const uiStore = useUIStore()
</script>

<template>
  <component :is="uiStore.uiConfig.activeMenuIndex"></component>
</template>
