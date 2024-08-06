<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { useUIStore } from '@/stores/useUIStore'

const uiStore = useUIStore()
</script>

<template>
  <div class="collapse-btn" @click="uiStore.changeCollapse">
    <el-icon v-if="uiStore.uiConfig.isCollapse">
      <Expand />
    </el-icon>
    <el-icon v-else>
      <Fold />
    </el-icon>
  </div>
  <div class="title">
    <el-text tag="b" class="header-big-text">控制面板</el-text>
    <el-text class="header-small-text">{{ uiStore.activeMenuName }}</el-text>
  </div>
</template>

<style scoped>
.title {
  padding-left: 20px;
  align-items: baseline;
  display: flex;
}

.header-big-text {
  font-size: var(--big-text-size);
  align-self: unset;
}

.header-small-text {
  font-size: var(--small-text-size);
  align-self: unset;
  margin-left: 10px;
  --small-text-size: 18px;
}

.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  float: left;
  cursor: pointer;
}
</style>
