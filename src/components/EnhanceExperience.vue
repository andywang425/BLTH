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
        <el-select
          v-model="config.switchLiveStreamQuality.qualityDesc"
          placeholder="Select"
          style="width: 110px"
        >
          <el-option v-for="i in qualityDescList" :key="i" :label="i" :value="i" />
        </el-select>
        <Info id="EnhanceExperience.switchLiveStreamQuality" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.banp2p.enabled" active-text="禁用P2P" />
        <Info id="EnhanceExperience.banp2p" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.noReport.enabled" active-text="拦截日志数据上报" />
        <Info id="EnhanceExperience.noReport" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.noSleep.enabled" active-text="屏蔽挂机检测" />
        <Info id="EnhanceExperience.noSleep" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.invisibility.enabled" active-text="隐身入场" />
        <Info id="EnhanceExperience.invisibility" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.wearFansMedal.enabled" active-text="发弹幕自动佩戴粉丝勋章" />
        <Info id="EnhanceExperience.wearFansMedal" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.contributionRank.enabled" active-text="显示高能用户数量" />
        <Info id="EnhanceExperience.contributionRank" />
      </el-space>
    </el-row>
    <el-divider />
  </div>
</template>
