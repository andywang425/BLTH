<script setup lang="ts">
import { useModuleStore } from '@/stores/useModuleStore'
import helpInfo from '@/library/help-info'

const moduleStore = useModuleStore()

const config = moduleStore.moduleConfig.DailyTasks.OtherTasks

const status = moduleStore.moduleStatus.DailyTasks.OtherTasks
</script>

<template>
  <div>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.groupSign.enabled" active-text="应援团签到" />
        <Info :item="helpInfo.DailyTasks.OtherTasks.groupSign" />
        <TaskStatus :status="status.groupSign" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.silverToCoin.enabled" active-text="银瓜子换硬币" />
        <Info :item="helpInfo.DailyTasks.OtherTasks.silverToCoin" />
        <TaskStatus :status="status.silverToCoin" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.coinToSilver.enabled" active-text="硬币换银瓜子" />
        <el-text>花费硬币</el-text>
        <el-select v-model="config.coinToSilver.num" placeholder="Select" style="width: 64px">
          <el-option v-for="i in 50" :key="i" :label="i" :value="i" />
        </el-select>
        <el-text>个</el-text>
        <Info :item="helpInfo.DailyTasks.OtherTasks.coinToSilver" />
        <TaskStatus :status="status.coinToSilver" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.getYearVipPrivilege.enabled" active-text="领取年度大会员权益" />
        <Info :item="helpInfo.DailyTasks.OtherTasks.getYearVipPrivilege" />
        <TaskStatus :status="status.getYearVipPrivilege" />
      </el-space>
    </el-row>
    <el-divider />
  </div>
</template>
