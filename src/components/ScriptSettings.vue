<script setup lang="ts">
import { useUIStore } from '@/stores/useUIStore'

const uiConfig = useUIStore().uiConfig
</script>

<template>
  <div>
    <el-row align="middle">
      <el-space wrap :size="[16, 0]">
        <el-text class="label-text">控制面板宽度</el-text>
        <el-slider
          style="width: 150px"
          class="slider"
          v-model="uiConfig.panelWidthPercent"
          :min="30"
          :max="60"
        />
      </el-space>
    </el-row>
  </div>
</template>

<style scoped>
.label-text {
  color: var(--el-text-color-primary);
  line-height: 32px;
}
</style>
