<script setup lang="ts">
import { computed, ref } from 'vue'
import { useModuleStore } from '../stores/useModuleStore'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const moduleStore = useModuleStore()

const config = moduleStore.moduleConfig.DailyTasks.LiveTasks

const status = moduleStore.moduleStatus.DailyTasks.LiveTasks

const medalDanmuPanelVisible = ref<boolean>(false)

const danmuTableData = computed(() =>
  config.medalTasks.danmu.list.map((danmu) => {
    return { content: danmu }
  })
)

const handleEdit = (index: number, row: { content: string }) => {
  ElMessageBox.prompt('请输入新的弹幕内容', '修改弹幕', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.{1,30}$/,
    inputErrorMessage: '弹幕内容不得为空且长度不能超过30',
    inputValue: row.content,
    lockScroll: false
  })
    .then(({ value }) => {
      config.medalTasks.danmu.list[index] = value
    })
    .catch(() => { })
}

const handleDelete = (index: number) => {
  if (config.medalTasks.danmu.list.length === 1) {
    ElMessage.warning({
      message: '至少要有一条弹幕',
      appendTo: '.el-dialog'
    })
    return
  }
  config.medalTasks.danmu.list.splice(index, 1)
}

const handleAdd = () => {
  ElMessageBox.prompt('请输入新增的弹幕内容', '新增弹幕', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.{1,30}$/,
    inputErrorMessage: '弹幕内容不得为空且长度不能超过30',
    lockScroll: false
  })
    .then(({ value }) => {
      config.medalTasks.danmu.list.push(value)
    })
    .catch(() => { })
}
</script>

<template>
  <div>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.sign.enabled" active-text="直播签到" />
        <Info id="DailyTasks.LiveTasks.sign" />
        <TaskStatus :status="status.sign" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.appUser.enabled" active-text="APP用户任务" />
        <Info id="DailyTasks.LiveTasks.appUser" />
        <TaskStatus :status="status.appUser" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 粉丝勋章相关任务 -->
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.medalTasks.like.enabled" active-text="给主播点赞" />
        <Info id="DailyTasks.LiveTasks.like" />
        <TaskStatus :status="status.medalTasks.like" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.medalTasks.danmu.enabled" active-text="发送弹幕" />
        <el-button type="primary" size="small" :icon="Edit"
          @click="medalDanmuPanelVisible = !medalDanmuPanelVisible">编辑弹幕</el-button>
        <Info id="DailyTasks.LiveTasks.danmu" />
        <TaskStatus :status="status.medalTasks.danmu" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.medalTasks.watch.enabled" active-text="观看直播" />
        <el-select v-model="config.medalTasks.watch.time" placeholder="Select" style="width: 64px">
          <el-option v-for="i in 24" :key="i" :label="i * 5" :value="i * 5" />
        </el-select>
        <el-text>分钟</el-text>
        <Info id="DailyTasks.LiveTasks.watch" />
        <TaskStatus :status="status.medalTasks.watch" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.medalTasks.isWhiteList" active-text="白名单" inactive-text="黑名单" />
        <el-button type="primary" size="small" :icon="Edit"
          @click="medalDanmuPanelVisible = !medalDanmuPanelVisible">编辑名单</el-button>
        <Info id="DailyTasks.LiveTasks.appUser" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 说明 -->
    <el-row>
      <el-text>直播任务相关信息可在</el-text>
      <el-link class="el-link-va-baseline" rel="noreferrer" type="primary"
        href="https://link.bilibili.com/p/help/index#/audience-fans-medal" target="_blank">帮助中心</el-link>
      <el-text>查看。</el-text>
    </el-row>
    <br />
    <el-row>
      <el-text tag="b">注意：</el-text>
    </el-row>
    <el-row>
      <el-text>&emsp;&emsp;由于每天能通过完成任务获得亲密度的粉丝勋章数量有限，目前脚本仅尝试为前100个等级小于20的粉丝勋章完成给主播点赞，发送弹幕，观看直播任务。</el-text>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog v-model="medalDanmuPanelVisible" title="编辑弹幕内容" :lock-scroll="false" width="40%">
      <el-table ref="singleTableRef" :data="danmuTableData" max-height="500">
        <el-table-column type="index" width="50" />
        <el-table-column prop="content" label="弹幕内容" />
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
              修改
            </el-button>
            <el-button text :icon="Delete" type="danger" @click="handleDelete(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" @click="handleAdd">新增弹幕</el-button>
      </template>
    </el-dialog>
  </div>
</template>
