<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useModuleStore, useBiliStore, useUIStore } from '@/stores'
import { Edit, Delete, SemiSelect } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElTable, type TableInstance } from 'element-plus'
import helpInfo from '@/library/help-info'
import { VueDraggable } from 'vue-draggable-plus'
import { arrayToMap } from '@/library/utils'

interface MedalInfoRow {
  avatar: string
  nick_name: string
  medal_name: string
  medal_level: number
  roomid: number
}

type MedalTaskKey = 'light' | 'like' | 'danmu' | 'watch'
type DanmuTaskKey = 'light' | 'danmu'

const TASK_LABELS: Record<MedalTaskKey, string> = {
  light: '点亮熄灭勋章',
  like: '点赞',
  danmu: '发弹幕',
  watch: '观看直播',
}

const moduleStore = useModuleStore()
const biliStore = useBiliStore()
const uiStore = useUIStore()

const medalTableMaxHeight = screen.height * 0.55
const danmuTableMaxHeight = screen.height * 0.5

const config = moduleStore.moduleConfig.DailyTasks.LiveTasks
const status = moduleStore.moduleStatus.DailyTasks.LiveTasks
const reset = moduleStore.moduleReset.DailyTasks.LiveTasks

// ───── 编辑弹幕 ─────
const medalDanmuPanelVisible = ref<boolean>(false)
const currentEditingDanmuTask = ref<DanmuTaskKey>('light')
const danmuTableData = computed(() =>
  config.medalTasks[currentEditingDanmuTask.value].danmuList.map((danmu) => {
    return { content: danmu }
  }),
)

const handleOpenDanmuPanel = (key: DanmuTaskKey) => {
  currentEditingDanmuTask.value = key
  medalDanmuPanelVisible.value = true
}

const handleEditDanmu = (index: number, row: { content: string }) => {
  ElMessageBox.prompt('请输入弹幕内容', '修改弹幕', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.{1,30}$/,
    inputErrorMessage: '弹幕内容不得为空且长度不能超过30',
    inputValue: row.content,
    lockScroll: false,
  })
    .then(({ value }) => {
      config.medalTasks[currentEditingDanmuTask.value].danmuList[index] = value
    })
    .catch(() => {})
}

const handleDeleteDanmu = (index: number) => {
  const list = config.medalTasks[currentEditingDanmuTask.value].danmuList
  if (list.length === 1) {
    ElMessage.warning({
      message: '至少要有一条弹幕',
      appendTo: '.el-dialog',
    })
    return
  }
  list.splice(index, 1)
}

const handleAddDanmu = () => {
  ElMessageBox.prompt('请输入新增的弹幕内容', '新增弹幕', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.{1,30}$/,
    inputErrorMessage: '弹幕内容不得为空且长度不能超过30',
    lockScroll: false,
  })
    .then(({ value }) => {
      config.medalTasks[currentEditingDanmuTask.value].danmuList.push(value)
    })
    .catch(() => {})
}

// ───── 编辑名单 ─────
const medalInfoPanelVisible = ref<boolean>(false)
const currentEditingTask = ref<MedalTaskKey>('light')
const currentTaskConfig = computed(() => config.medalTasks[currentEditingTask.value])
const currentTaskLabel = computed(() => TASK_LABELS[currentEditingTask.value])
const currentTaskIsSortMode = computed({
  get() {
    return uiStore.uiConfig.medalInfoPanelIsSortMode[currentEditingTask.value]
  },
  set(newValue: boolean) {
    uiStore.uiConfig.medalInfoPanelIsSortMode[currentEditingTask.value] = newValue
  },
})

const medalInfoTableData = computed({
  get() {
    const medals = biliStore.filteredFansMedals.map((medal) => ({
      avatar: medal.anchor_info.avatar,
      nick_name: medal.anchor_info.nick_name,
      medal_name: medal.medal.medal_name,
      medal_level: medal.medal.level,
      roomid: medal.room_info.room_id,
    }))
    if (currentTaskIsSortMode.value) {
      const taskConf = currentTaskConfig.value
      const filteredMedals = medals.filter((medal) =>
        taskConf.isWhiteList
          ? taskConf.roomidList.includes(medal.roomid)
          : !taskConf.roomidList.includes(medal.roomid),
      )
      const orderMap = arrayToMap(taskConf.roomidList)
      return filteredMedals.sort((a, b) => orderMap.get(a.roomid)! - orderMap.get(b.roomid)!)
    }
    return medals
  },
  set(newValue: MedalInfoRow[]) {
    currentTaskConfig.value.roomidList = newValue.map((row) => row.roomid)
  },
})
/** 是否显示加载中图标 */
const medalInfoLoading = ref<boolean>(false)
/**
 * 编辑名单
 */
const handleEditList = async (key: MedalTaskKey) => {
  currentEditingTask.value = key
  medalInfoPanelVisible.value = true
  await nextTick()
  // 如果没有粉丝勋章信息，先获取
  if (!biliStore.fansMedals) {
    medalInfoLoading.value = true
    watch(
      medalInfoTableData,
      (newData) => {
        nextTick(() => {
          refreshSelection(newData)
          medalInfoLoading.value = false
        })
      },
      { once: true },
    )
    if (!biliStore.fansMedalsStatus) {
      moduleStore.rerunModule('Default_FansMedals', true)
    }
  } else {
    refreshSelection(medalInfoTableData.value)
  }
}
/** 用来管理多选框状态的表格Ref */
const medalInfoTableRef = ref<TableInstance>()

/** 根据当前任务的 roomidList 刷新多选框选择状态 */
const refreshSelection = (rows?: MedalInfoRow[]) => {
  // 排序模式下不更新多选框选择状态
  if (!rows || currentTaskIsSortMode.value) return

  medalInfoTableRef.value?.clearSelection()
  const taskConf = currentTaskConfig.value
  taskConf.roomidList.forEach((roomid, index) => {
    const row = rows.find((row) => row.roomid === roomid)
    if (row) {
      medalInfoTableRef.value?.toggleRowSelection(row, true)
    } else {
      // 没有找到直播间号为 roomid 的粉丝勋章，可能是因为该粉丝勋章已被删除或是过滤
      // 从名单中去掉这个 roomid
      taskConf.roomidList.splice(index, 1)
    }
  })
}

function handleSelect(selection: MedalInfoRow[]) {
  currentTaskConfig.value.roomidList = selection.map((row) => row.roomid)
}

function handleRowClick(row: MedalInfoRow) {
  // 排序模式下不切换选择状态
  if (currentTaskIsSortMode.value) return

  medalInfoTableRef.value?.toggleRowSelection(row)
  const selection: MedalInfoRow[] = medalInfoTableRef.value?.getSelectionRows() ?? []
  currentTaskConfig.value.roomidList = selection.map((row) => row.roomid)
}
</script>

<template>
  <div>
    <!-- 点亮熄灭勋章 -->
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.medalTasks.light.enabled" active-text="点亮熄灭勋章" />
        <el-button type="primary" size="small" :icon="Edit" @click="handleOpenDanmuPanel('light')"
          >编辑弹幕
        </el-button>
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.light" />
        <TaskStatus :status="status.medalTasks.light" @click="reset.medalTasks.light" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch
          v-model="config.medalTasks.light.isWhiteList"
          active-text="白名单"
          inactive-text="黑名单"
          @change="(val) => !val && (uiStore.uiConfig.medalInfoPanelIsSortMode.light = false)"
        />
        <el-button type="primary" size="small" :icon="Edit" @click="handleEditList('light')"
          >编辑名单
        </el-button>
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.list" />
      </el-space>
    </el-row>

    <el-divider />

    <!-- 点赞 -->
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.medalTasks.like.enabled" active-text="点赞" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.like" />
        <TaskStatus :status="status.medalTasks.like" @click="reset.medalTasks.like" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch
          v-model="config.medalTasks.like.isWhiteList"
          active-text="白名单"
          inactive-text="黑名单"
          @change="(val) => !val && (uiStore.uiConfig.medalInfoPanelIsSortMode.like = false)"
        />
        <el-button type="primary" size="small" :icon="Edit" @click="handleEditList('like')"
          >编辑名单
        </el-button>
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.list" />
      </el-space>
    </el-row>

    <el-divider />

    <!-- 发弹幕 -->
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.medalTasks.danmu.enabled" active-text="发弹幕" />
        <el-button type="primary" size="small" :icon="Edit" @click="handleOpenDanmuPanel('danmu')"
          >编辑弹幕
        </el-button>
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.danmu" />
        <TaskStatus :status="status.medalTasks.danmu" @click="reset.medalTasks.danmu" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-icon><SemiSelect /></el-icon>
        <el-switch
          v-model="config.medalTasks.danmu.onlyWhenNotLiving"
          active-text="仅在未开播的直播间发弹幕"
        />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch
          v-model="config.medalTasks.danmu.isWhiteList"
          active-text="白名单"
          inactive-text="黑名单"
          @change="(val) => !val && (uiStore.uiConfig.medalInfoPanelIsSortMode.danmu = false)"
        />
        <el-button type="primary" size="small" :icon="Edit" @click="handleEditList('danmu')"
          >编辑名单
        </el-button>
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.list" />
      </el-space>
    </el-row>

    <el-divider />

    <!-- 观看直播 -->
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.medalTasks.watch.enabled" active-text="观看直播" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.watch" />
        <TaskStatus :status="status.medalTasks.watch" @click="reset.medalTasks.watch" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch
          v-model="config.medalTasks.watch.isWhiteList"
          active-text="白名单"
          inactive-text="黑名单"
          @change="(val) => !val && (uiStore.uiConfig.medalInfoPanelIsSortMode.watch = false)"
        />
        <el-button type="primary" size="small" :icon="Edit" @click="handleEditList('watch')"
          >编辑名单
        </el-button>
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.list" />
      </el-space>
    </el-row>

    <el-divider />

    <!-- 说明 -->
    <el-row>
      <el-text>直播任务相关信息可在</el-text>
      <el-link
        rel="noreferrer"
        type="primary"
        href="https://link.bilibili.com/p/help/index#/audience-fans-medal"
        target="_blank"
        >帮助中心
      </el-link>
      <el-text>查看。</el-text>
    </el-row>
    <br />

    <!-- 弹窗：编辑弹幕 -->
    <el-dialog
      v-model="medalDanmuPanelVisible"
      :title="`编辑弹幕内容 - ${TASK_LABELS[currentEditingDanmuTask]}`"
      :lock-scroll="false"
      width="40%"
    >
      <el-table :data="danmuTableData" :max-height="danmuTableMaxHeight">
        <el-table-column type="index" width="80" />
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

    <!-- 弹窗：编辑名单 -->
    <el-dialog
      v-model="medalInfoPanelVisible"
      :title="`编辑粉丝勋章名单 - ${currentTaskLabel}`"
      :lock-scroll="false"
    >
      <VueDraggable
        v-model="medalInfoTableData"
        target="#draggable-fans-medal-table table tbody"
        :disabled="!currentTaskIsSortMode"
        :animation="150"
        :scroll-sensitivity="36"
        :scroll-speed="8"
      >
        <el-table
          id="draggable-fans-medal-table"
          ref="medalInfoTableRef"
          v-loading="medalInfoLoading"
          :data="medalInfoTableData"
          :max-height="medalTableMaxHeight"
          empty-text="没有粉丝勋章"
          :row-key="(row: MedalInfoRow) => row.roomid.toString()"
          @select="handleSelect"
          @select-all="handleSelect"
          @row-click="handleRowClick"
        >
          <template v-if="!currentTaskIsSortMode">
            <el-table-column type="selection" align="center" width="80" />
          </template>
          <template v-else>
            <el-table-column type="index" align="center" width="80" />
          </template>

          <el-table-column prop="avatar" label="头像" width="100">
            <template #default="scope">
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
          <el-table-column prop="medal_level" label="等级" width="80" />
          <el-table-column prop="roomid" label="房间号">
            <template #default="scope">
              <el-link
                :href="'https://live.bilibili.com/' + scope.row.roomid + '?visit_id='"
                rel="noreferrer"
                type="primary"
                target="_blank"
                @click.stop
              >
                {{ scope.row.roomid }}
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </VueDraggable>
      <template #footer>
        <el-switch
          v-model="currentTaskIsSortMode"
          :disabled="!currentTaskConfig.isWhiteList"
          inactive-text="常规模式"
          active-text="排序模式"
          @change="(val) => !val && nextTick(() => refreshSelection(medalInfoTableData))"
        />
      </template>
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
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
