<script lang="ts">
import MainSiteTasks from './MainSiteTasks.vue'
import LiveTasks from './LiveTasks.vue'
import OtherTasks from './OtherTasks.vue'
import EnhanceExperience from './EnhanceExperience.vue'
import RemoveElement from './RemoveElement.vue'
import ScriptSettings from './ScriptSettings.vue'
import { defineComponent } from 'vue'

// 注册对当前组件实例可用的组件
export default defineComponent({
  components: {
    MainSiteTasks,
    LiveTasks,
    OtherTasks,
    EnhanceExperience,
    RemoveElement,
    ScriptSettings,
  },
})
</script>

<script setup lang="ts">
import { useUIStore } from '@/stores'
const uiStore = useUIStore()
</script>

<template>
  <Transition mode="out-in">
    <KeepAlive>
      <component :is="uiStore.uiConfig.activeMenuIndex" />
    </KeepAlive>
  </Transition>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
