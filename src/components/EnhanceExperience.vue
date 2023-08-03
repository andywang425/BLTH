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
        <el-switch v-model="config.switchLiveStreamQuality.enabled" active-text="自动选择画质" />
        <el-select v-model="config.switchLiveStreamQuality.qualityDesc" placeholder="Select" style="width: 120px">
          <el-option v-for="i in qualityDescList" :key="i" :label="i" :value="i" />
        </el-select>
        <Info id="EnhanceExperience.switchLiveStreamQuality" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 说明 -->
    <!-- <div>
      <el-text>&emsp;&emsp;主站每日任务的完成情况可在</el-text>
      <el-link class="el-link-va-baseline" rel="noreferrer" type="primary"
        href="https://account.bilibili.com/account/home" target="_blank">个人中心</el-link>
      <el-text>查看。数据更新可能有一定的延时。</el-text>
    </div> -->
  </div>
</template>
