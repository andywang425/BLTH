<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useModuleStore } from '../stores/useModuleStore'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import { useBiliStore } from '../stores/useBiliStore'

interface ImedalInfoRow {
  avatar: string
  nick_name: string
  medal_name: string
  medal_level: number
  roomid: number
}

const moduleStore = useModuleStore()
const biliStore = useBiliStore()

const config = moduleStore.moduleConfig.DailyTasks.LiveTasks
const status = moduleStore.moduleStatus.DailyTasks.LiveTasks

const medalDanmuPanelVisible = ref<boolean>(false)
const danmuTableData = computed(() =>
  config.medalTasks.danmu.list.map((danmu) => {
    return { content: danmu }
  })
)

const handleEditDanmu = (index: number, row: { content: string }) => {
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
    .catch(() => {})
}

const handleDeleteDanmu = (index: number) => {
  if (config.medalTasks.danmu.list.length === 1) {
    ElMessage.warning({
      message: '至少要有一条弹幕',
      appendTo: '.el-dialog'
    })
    return
  }
  config.medalTasks.danmu.list.splice(index, 1)
}

const handleAddDanmu = () => {
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
    .catch(() => {})
}

const medalInfoPanelVisible = ref<boolean>(false)
const medalInfoTableData = computed<ImedalInfoRow[] | undefined>(
  () =>
    biliStore.filteredFansMedals?.map((medal) => ({
      avatar: medal.anchor_info.avatar,
      nick_name: medal.anchor_info.nick_name,
      medal_name: medal.medal.medal_name,
      medal_level: medal.medal.level,
      roomid: medal.room_info.room_id
    }))
)
/** 是否显示加载中图标 */
const medalInfoLoading = ref<boolean>(false)
/** 是否是第一次点击编辑名单按钮 */
let firstClickEditList = true
/**
 * 编辑名单
 */
const handleEditList = () => {
  medalInfoPanelVisible.value = !medalInfoPanelVisible.value
  // 如果没有粉丝勋章信息，先获取
  if (firstClickEditList) {
    if (!biliStore.fansMedals) {
      medalInfoLoading.value = true
      // 等待数据被获取到
      const unwatch = watch(medalInfoTableData, (newData) => {
        if (newData) {
          unwatch()
          firstClickEditList = false
          initSelection(medalInfoTableData.value)
          medalInfoLoading.value = false
        }
      })
      // 利用 emitter 通知 BiliInfo 模块去获取数据
      moduleStore.emitter.emit('BiliInfo', {
        target: 'getFansMetals'
      })
    } else {
      initSelection(medalInfoTableData.value)
    }
  }
}
/** 用来管理多选框状态的表格Ref */
const medalInfoTableRef = ref<InstanceType<typeof ElTable>>()
/** 是否锁住配置 */
let lockConfig = false
/** 初始化多选框选择状态 */
const initSelection = (rows?: ImedalInfoRow[]) => {
  lockConfig = true
  if (rows) {
    // 如果直接使用 medalInfoTableRef.value，medalInfoTableRef.value 可能为 undefined
    const unwatch = watch(
      () => medalInfoTableRef.value,
      (newValue) => {
        // unwatch 可能还未初始化，延迟到下一个空闲时间点执行
        setTimeout(() => unwatch(), 0)
        if (newValue) {
          config.medalTasks.roomidList.forEach((roomid) =>
            newValue.toggleRowSelection(
              rows.find((row) => row.roomid === roomid),
              true
            )
          )
        }
      },
      { immediate: true }
    )
  }
  lockConfig = false
}
function handleSelectionChange(selectedRows: ImedalInfoRow[]) {
  if (!lockConfig) {
    config.medalTasks.roomidList = selectedRows.map((row) => row.roomid)
  }
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
        <el-switch v-model="config.appUser.enabled" disabled active-text="APP用户任务" />
        <Info id="DailyTasks.LiveTasks.appUser" />
        <TaskStatus :status="status.appUser" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 粉丝勋章相关任务 -->
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.medalTasks.like.enabled" active-text="给主播点赞" />
        <Info id="DailyTasks.LiveTasks.medalTasks.like" />
        <TaskStatus :status="status.medalTasks.like" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-icon>
          <SemiSelect />
        </el-icon>
        <el-switch
          v-model="config.medalTasks.like.includeHighLevelMedals"
          active-text="包含等级≥20的粉丝勋章"
        />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.medalTasks.danmu.enabled" active-text="发送弹幕" />
        <el-button
          type="primary"
          size="small"
          :icon="Edit"
          @click="medalDanmuPanelVisible = !medalDanmuPanelVisible"
          >编辑弹幕</el-button
        >
        <Info id="DailyTasks.LiveTasks.medalTasks.danmu" />
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
        <Info id="DailyTasks.LiveTasks.medalTasks.watch" />
        <TaskStatus :status="status.medalTasks.watch" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch
          v-model="config.medalTasks.isWhiteList"
          active-text="白名单"
          inactive-text="黑名单"
        />
        <el-button type="primary" size="small" :icon="Edit" @click="handleEditList"
          >编辑名单</el-button
        >
        <Info id="DailyTasks.LiveTasks.medalTasks.list" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 说明 -->
    <el-row>
      <el-text>直播任务相关信息可在</el-text>
      <el-link
        class="el-link-va-baseline"
        rel="noreferrer"
        type="primary"
        href="https://link.bilibili.com/p/help/index#/audience-fans-medal"
        target="_blank"
        >帮助中心</el-link
      >
      <el-text>查看。</el-text>
    </el-row>
    <br />
    <el-row>
      <el-text tag="b">注意：</el-text>
    </el-row>
    <el-row>
      <el-text
        >&emsp;&emsp;由于每天能通过完成任务获得亲密度的粉丝勋章数量有限，脚本默认仅为最多100个等级小于20的粉丝勋章完成给主播点赞，发送弹幕，观看直播任务。</el-text
      >
    </el-row>
    <!-- 弹窗 -->
    <el-dialog
      v-model="medalDanmuPanelVisible"
      title="编辑弹幕内容"
      :lock-scroll="false"
      width="40%"
    >
      <el-table :data="danmuTableData" max-height="500">
        <el-table-column type="index" width="50" />
        <el-table-column prop="content" label="弹幕内容" />
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEditDanmu(scope.$index, scope.row)">
              修改
            </el-button>
            <el-button text :icon="Delete" type="danger" @click="handleDeleteDanmu(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" @click="handleAddDanmu">新增弹幕</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="medalInfoPanelVisible"
      title="编辑粉丝勋章名单"
      :lock-scroll="false"
      width="40%"
    >
      <el-table
        ref="medalInfoTableRef"
        v-loading="medalInfoLoading"
        :data="medalInfoTableData"
        max-height="500"
        empty-text="没有粉丝勋章"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="avatar" label="头像" width="100">
          <template v-slot:default="scope">
            <div class="avatar-wrap">
              <el-image
                :src="scope.row.avatar"
                loading="lazy"
                referrerpolicy="origin"
                class="avatar"
              >
                <template #error>
                  <el-image
                    src="//i0.hdslb.com/bfs/face/member/noface.jpg"
                    referrerpolicy="origin"
                    class="avatar"
                  />
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nick_name" label="昵称" />
        <el-table-column prop="medal_name" label="粉丝勋章" />
        <el-table-column prop="medal_level" label="等级" width="80" sortable />
        <el-table-column prop="roomid" label="房间号">
          <template v-slot:default="scope">
            <el-link
              :href="'https://live.bilibili.com/' + scope.row.roomid + '?visit_id='"
              rel="noreferrer"
              type="primary"
              target="_blank"
            >
              {{ scope.row.roomid }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped>
.avatar-wrap {
  width: 80px;
  height: 80px;
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>
