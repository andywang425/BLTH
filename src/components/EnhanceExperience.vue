<script setup lang="ts">
import { useModuleStore } from '@/stores/useModuleStore'
import helpInfo from '@/library/help-info'

const moduleStore = useModuleStore()
const config = moduleStore.moduleConfig.EnhanceExperience

// 画质名称列表
const qualityDescList = ['原画', '蓝光', '超清', '高清']

// 修改画质名称列表后用户配置如果不合法，回退到第一个画质
if (!qualityDescList.includes(config.switchLiveStreamQuality.qualityDesc)) {
  config.switchLiveStreamQuality.qualityDesc = qualityDescList[0]
}
</script>

<template>
  <div>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.switchLiveStreamQuality.enabled" active-text="自动切换画质" />
        <el-select
          v-model="config.switchLiveStreamQuality.qualityDesc"
          placeholder="Select"
          style="width: 100px"
        >
          <el-option v-for="i in qualityDescList" :key="i" :label="i" :value="i" />
        </el-select>
        <Info :item="helpInfo.EnhanceExperience.switchLiveStreamQuality" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.banp2p.enabled" active-text="禁用P2P" />
        <Info :item="helpInfo.EnhanceExperience.banp2p" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.noReport.enabled" active-text="拦截日志数据上报" />
        <Info :item="helpInfo.EnhanceExperience.noReport" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.noSleep.enabled" active-text="屏蔽挂机检测" />
        <Info :item="helpInfo.EnhanceExperience.noSleep" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.invisibility.enabled" active-text="隐身入场" />
        <Info :item="helpInfo.EnhanceExperience.invisibility" />
      </el-space>
    </el-row>
    <el-divider />
  </div>
</template>
