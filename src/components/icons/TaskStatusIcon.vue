<script setup lang="ts">
import { ref } from 'vue'
import type { ModuleStatusTypes } from '@/types'
import { Loading, Select, CloseBold, Refresh } from '@element-plus/icons-vue'

defineProps<{
  status: ModuleStatusTypes
}>()

defineEmits<{
  click: []
}>()

const isHovered = ref(false)
</script>

<template>
  <template v-if="status === 'running'">
    <!-- 正在运行中 -->
    <el-icon class="status-icon is-loading">
      <Loading />
    </el-icon>
  </template>
  <template v-else-if="status === 'done'">
    <!-- 该任务已完成 -->
    <el-icon
      class="status-icon done-icon"
      :class="{ 'is-hovered': isHovered }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="$emit('click')"
    >
      <Transition name="icon-fade" mode="out-in">
        <component :is="isHovered ? Refresh : Select" />
      </Transition>
    </el-icon>
  </template>
  <template v-else-if="status === 'error'">
    <!-- 发生导致任务彻底无法完成的错误 -->
    <el-icon class="status-icon" style="color: #ff6464">
      <CloseBold />
    </el-icon>
  </template>
  <!-- 如果 status 是空字符串，不显示图标 -->
  <!-- 说明此时该任务未完成且该模块正在等待下一次运行，也可能是该模块刚刚开始运行，还没获得一个状态 -->
</template>

<style scoped>
.status-icon {
  font-size: var(--el-font-size-base);
}

.done-icon {
  color: #1ab059;
}

.done-icon.is-hovered {
  color: #409eff;
  cursor: pointer;
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
