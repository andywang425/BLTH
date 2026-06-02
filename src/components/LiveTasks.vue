<script setup lang="ts">
import { ref } from 'vue'
import { useModuleStore, useBiliStore } from '@/stores'
import helpInfo from '@/library/help-info'
import GlobalMedalDashboard from './GlobalMedalDashboard.vue'

const globalDashboardVisible = ref<boolean>(false)

const moduleStore = useModuleStore()
const biliStore = useBiliStore()

const config = moduleStore.moduleConfig.DailyTasks.LiveTasks
const status = moduleStore.moduleStatus.DailyTasks.LiveTasks
const reset = moduleStore.moduleReset.DailyTasks.LiveTasks
</script>

<template>
  <div>
    <el-row style="margin-bottom: 25px">
      <el-button type="success" @click="globalDashboardVisible = true">
        灯牌管理 (当前共 {{ biliStore.filteredFansMedals.length }} 个灯牌)
      </el-button>
    </el-row>

    <el-row class="task-row">
      <el-space wrap :size="[12, 0]">
        <el-switch v-model="config.medalTasks.light.enabled" active-text="点亮熄灭勋章" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.light" />
        <TaskStatus :status="status.medalTasks.light" @click="reset.medalTasks.light" />
      </el-space>
    </el-row>

    <el-divider />

    <el-row class="task-row">
      <el-space wrap :size="[12, 0]">
        <el-switch v-model="config.medalTasks.like.enabled" active-text="每日点赞" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.like" />
        <TaskStatus :status="status.medalTasks.like" @click="reset.medalTasks.like" />
      </el-space>
    </el-row>

    <el-divider />

    <el-row class="task-row">
      <el-space wrap :size="[12, 0]">
        <el-switch v-model="config.medalTasks.danmu.enabled" active-text="每日发弹幕" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.danmu" />
        <TaskStatus :status="status.medalTasks.danmu" @click="reset.medalTasks.danmu" />
      </el-space>
    </el-row>
    <el-row style="margin-top: 8px; margin-left: 24px">
      <el-switch
        v-model="config.medalTasks.danmu.onlyWhenNotLiving"
        size="small"
        active-text="仅在未开播的直播间发弹幕"
      />
    </el-row>

    <el-divider />

    <el-row class="task-row">
      <el-space wrap :size="[12, 0]">
        <el-switch v-model="config.medalTasks.watch.enabled" active-text="观看直播" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.watch" />
        <TaskStatus :status="status.medalTasks.watch" @click="reset.medalTasks.watch" />
      </el-space>
    </el-row>

    <el-divider />

    <el-row style="margin-top: 15px">
      <el-text size="small" type="info"> 黑白名单功能已统一移至顶部灯牌管理 </el-text>
    </el-row>
    <el-row style="margin-top: 5px">
      <el-text size="small">粉丝团任务相关规则详见：</el-text>
      <el-link
        rel="noreferrer"
        type="primary"
        style="font-size: 12px"
        href="https://link.bilibili.com/p/help/index#/audience-fans-medal"
        target="_blank"
      >
        B站帮助中心
      </el-link>
    </el-row>

    <GlobalMedalDashboard v-model="globalDashboardVisible" />
  </div>
</template>

<style scoped>
.task-row {
  display: flex;
  align-items: center;
  height: 32px;
}
:deep(.el-divider--horizontal) {
  margin: 16px 0;
}
</style>
