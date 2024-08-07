<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import type { HelpInfoItem } from '@/types'

const props = defineProps<{
  item: HelpInfoItem
}>()

/**
 * 显示提示弹窗
 */
const open = () => {
  const { title, message }: HelpInfoItem = props.item

  ElMessageBox({
    title: title,
    message: message,
    lockScroll: false,
    autofocus: true,
    confirmButtonText: 'OK'
  }).catch(() => {})
}
</script>

<template>
  <el-icon class="info-icon" @click="open">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      class="icon"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="#276BC0"
        d="M512.67 959.47c-246.343 0-446.76-200.632-446.76-447.24S266.326 64.98 512.67 64.98s446.76 200.642 446.76 447.25-200.416 447.24-446.76 447.24zm0-829.04c-210.291 0-381.38 171.283-381.38 381.8s171.089 381.79 381.38 381.79 381.381-171.273 381.381-381.79-171.09-381.8-381.38-381.8z"
      />
      <path
        fill="#276BC0"
        d="M447.29 317.172a63.891 63.959 0 1 0 130.76 0 63.891 63.959 0 1 0-130.76 0Zm64.907 503.047c-30.093 0-54.235-24.416-54.235-54.541V482.062c0-30.126 24.142-54.541 54.235-54.541 30.094 0 54.236 24.416 54.236 54.541v283.616c0 30.125-24.142 54.54-54.236 54.54z"
      />
    </svg>
  </el-icon>
</template>

<style scoped>
.info-icon {
  font-size: var(--el-font-size-base);
  cursor: pointer;
}
</style>
