<script setup lang="ts">
import { useModuleStore } from '../stores/useModuleStore'

const moduleStore = useModuleStore()

const config = moduleStore.moduleConfig.DailyTasks.MainSiteTasks

const status = moduleStore.moduleStatus.DailyTasks.MainSiteTasks
</script>

<template>
  <div>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.login.enabled" active-text="每日登录" />
        <Info id="DailyTasks.MainSiteTasks.login" />
        <TaskStatus :status="status.login" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.watch.enabled" active-text="每日观看视频" />
        <Info id="DailyTasks.MainSiteTasks.watch" />
        <TaskStatus :status="status.watch" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.coin.enabled" active-text="每日投币" />
        <el-select v-model="config.coin.num" placeholder="Select" style="width: 64px">
          <el-option v-for="i in 5" :key="i" :label="i" :value="i" />
        </el-select>
        <el-text>个</el-text>
        <Info id="DailyTasks.MainSiteTasks.coin" />
        <TaskStatus :status="status.coin" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.share.enabled" active-text="每日分享视频" />
        <Info id="DailyTasks.MainSiteTasks.share" />
        <TaskStatus :status="status.share" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 说明 -->
    <el-row>
      <el-text>&emsp;&emsp;主站每日任务的完成情况可在</el-text>
      <el-link
        class="el-link-va-baseline"
        rel="noreferrer"
        type="primary"
        href="https://account.bilibili.com/account/home"
        target="_blank"
        >个人中心</el-link
      >
      <el-text>查看。数据更新可能有一定的延时。</el-text>
    </el-row>
  </div>
</template>
