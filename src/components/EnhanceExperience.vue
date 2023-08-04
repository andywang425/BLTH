<script setup lang="ts">
import { useModuleStore } from '../stores/useModuleStore'

const moduleStore = useModuleStore()
const config = moduleStore.moduleConfig.EnhanceExperience

const qualityDescList = ['原画', '蓝光PRO', '蓝光', '超清PRO', '超清', '高清']

</script>

<template>
  <div>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.switchLiveStreamQuality.enabled" active-text="自动切换画质" />
        <el-select v-model="config.switchLiveStreamQuality.qualityDesc" placeholder="Select" style="width: 110px">
          <el-option v-for="i in qualityDescList" :key="i" :label="i" :value="i" />
        </el-select>
        <Info id="EnhanceExperience.switchLiveStreamQuality" />
      </el-space>
    </el-row>
    <el-divider />
  </div>
</template>
