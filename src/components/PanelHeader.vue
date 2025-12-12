<script setup lang="ts">
import { useUIStore } from '@/stores'
import { Expand, Fold } from '@element-plus/icons-vue'

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
  display: flex;
  align-items: baseline;
  padding-left: 20px;
}

.header-big-text {
  align-self: unset;
  font-size: var(--big-text-size);
}

.header-small-text {
  align-self: unset;
  margin-left: 10px;
  font-size: var(--small-text-size);

  --small-text-size: 18px;
}

.collapse-btn {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
}
</style>
