<script setup lang="ts">
import { useModuleStore } from '@/stores/useModuleStore'
import helpInfo from '@/library/help-info'

const moduleStore = useModuleStore()

const config = moduleStore.moduleConfig.DailyTasks.MainSiteTasks

const status = moduleStore.moduleStatus.DailyTasks.MainSiteTasks
</script>

<template>
  <div>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.login.enabled" active-text="每日登录" />
        <Info :item="helpInfo.DailyTasks.MainSiteTasks.login" />
        <TaskStatus :status="status.login" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.watch.enabled" active-text="每日观看视频" />
        <Info :item="helpInfo.DailyTasks.MainSiteTasks.watch" />
        <TaskStatus :status="status.watch" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.coin.enabled" active-text="每日投币" />
        <el-select v-model="config.coin.num" placeholder="Select" style="width: 64px">
          <el-option v-for="i in 5" :key="i" :label="i" :value="i" />
        </el-select>
        <el-text>个</el-text>
        <Info :item="helpInfo.DailyTasks.MainSiteTasks.coin" />
        <TaskStatus :status="status.coin" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.share.enabled" active-text="每日分享视频" />
        <Info :item="helpInfo.DailyTasks.MainSiteTasks.share" />
        <TaskStatus :status="status.share" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 说明 -->
    <el-row>
      <el-text>
        <el-text>&emsp;&emsp;主站每日任务的完成情况可在</el-text>
        <el-link
          rel="noreferrer"
          type="primary"
          href="https://account.bilibili.com/account/home"
          target="_blank"
          style="vertical-align: unset"
          >个人中心</el-link
        >
        <el-text>查看。</el-text>
        <el-text>数据更新可能有一定的延时。</el-text>
      </el-text>
    </el-row>
  </div>
</template>
