<script setup lang="ts">
import type { ModuleStatusTypes } from '@/types'

defineProps<{
  status: ModuleStatusTypes
}>()
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
    <el-icon class="status-icon" style="color: #1ab059">
      <Select />
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
</style>
