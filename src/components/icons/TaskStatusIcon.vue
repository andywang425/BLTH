<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ModuleStatusTypes } from '@/types'
import { Loading, Select, CloseBold, Refresh } from '@element-plus/icons-vue'
import _ from 'lodash'

const props = defineProps<{
  status: ModuleStatusTypes
}>()

const emit = defineEmits<{
  click: []
}>()

const throttleClick = _.throttle(() => emit('click'), 1000)

// 鼠标是否悬停在图标上
const isHovered = ref(false)

// 是否运行中
const isRunning = computed(() => props.status === 'running')
// 是否已完成
const isDone = computed(() => props.status === 'done')
// 是否发生错误
const isError = computed(() => props.status === 'error')

// 图标组件
const iconComponent = computed(() => {
  if (isRunning.value) return Loading
  if (isDone.value) return isHovered.value ? Refresh : Select
  if (isError.value) return CloseBold
  return null
})

// 当任务状态改变时，重置悬停状态
watch(
  () => props.status,
  () => (isHovered.value = false),
)
</script>

<template>
  <el-icon
    class="status-icon"
    :class="{
      'is-loading': isRunning,
      done: isDone,
      error: isError,
      'is-hovered': isDone && isHovered,
    }"
    v-show="status"
    @mouseenter="isDone && (isHovered = true)"
    @mouseleave="isDone && (isHovered = false)"
    @click="isDone && throttleClick()"
  >
    <template v-if="isDone">
      <Transition name="icon-fade" mode="out-in">
        <component :is="iconComponent" />
      </Transition>
    </template>
    <template v-else>
      <component :is="iconComponent" />
    </template>
  </el-icon>
</template>

<style scoped>
.status-icon {
  font-size: var(--el-font-size-base);
}

.done {
  color: #1ab059;
}

.done.is-hovered {
  color: #409eff;
  cursor: pointer;
}

.error {
  color: #ff6464;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.15s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(90deg);
}
</style>
