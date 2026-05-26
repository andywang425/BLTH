<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useModuleStore, useBiliStore } from '@/stores'
import { Edit, Delete, Sort, Top, Bottom } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'
import { arrayToMap } from '@/library/utils'

// ─── 属性与事件定义 ───
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// ─── 基础类型定义 ───
interface MatrixMedalRow {
  userid: number
  roomid: number
  avatar: string
  nick_name: string
  medal_name: string
  medal_level: number
  light: boolean
  like: boolean
  danmu: boolean
  watch: boolean
}

type MedalTaskKey = 'light' | 'like' | 'danmu' | 'watch'
type DanmuTaskKey = 'light' | 'danmu'

const TASK_LABELS: Record<MedalTaskKey, string> = {
  light: '点亮熄灭勋章',
  like: '点赞',
  danmu: '发弹幕',
  watch: '观看直播',
}

// ─── 状态与仓库 ───
const moduleStore = useModuleStore()
const biliStore = useBiliStore()

const config = moduleStore.moduleConfig.DailyTasks.LiveTasks

const medalTableMaxHeight = screen.height * 0.6
const danmuTableMaxHeight = screen.height * 0.5

const searchQuery = ref<string>('') // 主播搜索框
const medalInfoLoading = ref<boolean>(false)
const displayTableData = ref<MatrixMedalRow[]>([])

// ─── 弹窗联动控制 ───
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// ─── 编辑全局弹幕池逻辑 ───
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
    ElMessage.warning({ message: '至少要有一条弹幕', appendTo: '.el-dialog' })
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

const getTaskStatus = (roomid: number, taskKey: MedalTaskKey): boolean => {
  const taskConf = config.medalTasks[taskKey]
  const inList = taskConf.roomidList.includes(roomid)
  return taskConf.isWhiteList ? inList : !inList
}

const initMatrixData = () => {
  let medals = biliStore.filteredFansMedals.map((medal) => {
    const roomid = medal.room_info.room_id
    return {
      userid: medal.uinfo_medal.ruid,
      roomid,
      avatar: medal.anchor_info.avatar,
      nick_name: medal.anchor_info.nick_name,
      medal_name: medal.medal.medal_name,
      medal_level: medal.medal.level,
      light: getTaskStatus(roomid, 'light'),
      like: getTaskStatus(roomid, 'like'),
      danmu: getTaskStatus(roomid, 'danmu'),
      watch: getTaskStatus(roomid, 'watch'),
    }
  })

  const orderMap = arrayToMap(config.medalTasks.light.roomidList)
  medals.sort((a, b) => {
    const indexA = orderMap.has(a.roomid) ? orderMap.get(a.roomid)! : 9999
    const indexB = orderMap.has(b.roomid) ? orderMap.get(b.roomid)! : 9999
    return indexA - indexB
  })

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    medals = medals.filter(
      (m) =>
        m.nick_name.toLowerCase().includes(query) ||
        m.medal_name.toLowerCase().includes(query) ||
        m.roomid.toString().includes(query),
    )
  }

  displayTableData.value = medals
}

// 搜索框防抖
let debounceTimer: number | null = null

watch(
  [searchQuery, () => biliStore.filteredFansMedals],
  () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      initMatrixData()
    }, 180)
  },
  { deep: true },
)

// ─── 当拖拽松手或一键置顶/置底触发的最终同步 ───
const handleSyncStoreOrder = (quiet = false) => {
  const newRoomids = displayTableData.value.map((row) => row.roomid)

  ;(Object.keys(config.medalTasks) as MedalTaskKey[]).forEach((key) => {
    if (config.medalTasks[key].isWhiteList) {
      const currentList = config.medalTasks[key].roomidList
      config.medalTasks[key].roomidList = newRoomids.filter((id) => currentList.includes(id))
    }
  })
  if (!quiet) {
    ElMessage.success({ message: '自定义任务队列优先级更新成功', duration: 1200 })
  }
}

// 加入置顶和置底逻辑，粉丝牌过多时拖拽简直是灾难
const handleMoveToTop = (index: number) => {
  if (index === 0) return
  const targetItem = displayTableData.value.splice(index, 1)[0]
  displayTableData.value.unshift(targetItem)
  handleSyncStoreOrder() // 直接借用拖拽回写逻辑
}

const handleMoveToBottom = (index: number) => {
  if (index === displayTableData.value.length - 1) return
  const targetItem = displayTableData.value.splice(index, 1)[0]
  displayTableData.value.push(targetItem)
  handleSyncStoreOrder()
}

// ─── 单开关数据状态反向同步 ───
const syncSingleTaskStore = (roomid: number, taskKey: MedalTaskKey, isEnabled: boolean) => {
  const taskConf = config.medalTasks[taskKey]
  const index = taskConf.roomidList.indexOf(roomid)

  if (taskConf.isWhiteList) {
    if (isEnabled && index === -1) taskConf.roomidList.push(roomid)
    else if (!isEnabled && index !== -1) taskConf.roomidList.splice(index, 1)
  } else {
    if (isEnabled && index !== -1) taskConf.roomidList.splice(index, 1)
    else if (!isEnabled && index === -1) taskConf.roomidList.push(roomid)
  }
}

const handleMatrixSwitchChange = (row: MatrixMedalRow, taskKey: MedalTaskKey) => {
  syncSingleTaskStore(row.roomid, taskKey, row[taskKey])
}

// ─── 批量全选与单行完全清除 ───
const toggleColumnAll = (taskKey: MedalTaskKey) => {
  const isAllEnabled = displayTableData.value.every((row) => row[taskKey])
  const targetState = !isAllEnabled

  displayTableData.value.forEach((row) => {
    row[taskKey] = targetState
    syncSingleTaskStore(row.roomid, taskKey, targetState)
  })

  ElMessage.success(
    `已一键将当前列表所有主播的【${TASK_LABELS[taskKey]}】任务调整为: ${targetState ? '开启' : '关闭'}`,
  )
}

const handleFullyRemoveAnchor = (row: MatrixMedalRow) => {
  ElMessageBox.confirm(
    `确定要完全停用主播【${row.nick_name}】的所有自动化运行任务吗？`,
    '完全停用提示',
    {
      confirmButtonText: '确定停用',
      cancelButtonText: '取消',
      type: 'warning',
      lockScroll: false,
    },
  )
    .then(() => {
      ;(Object.keys(config.medalTasks) as MedalTaskKey[]).forEach((key) => {
        row[key] = false
        syncSingleTaskStore(row.roomid, key, false)
      })
      ElMessage.success(`已完全停用主播 ${row.nick_name} 的全部粉丝团任务`)
    })
    .catch(() => {})
}

// B站会遍历整个 DOM 把所有直播间链接加上 vistId , 因此这里用 js 打开
const handleOpenLiveroom = (row: MatrixMedalRow) => {
  window.open(`https://live.bilibili.com/${row.roomid}`)
}

let unwatchFansMedals: () => void = () => {}

watch(visible, (newVal) => {
  if (newVal) {
    if (!biliStore.fansMedals) {
      medalInfoLoading.value = true
      unwatchFansMedals = watch(
        () => biliStore.fansMedals,
        () => {
          medalInfoLoading.value = false
          nextTick(() => initMatrixData())
        },
        { once: true },
      )
      if (!biliStore.fansMedalsStatus) {
        moduleStore.rerunModule('Default_FansMedals', true)
      }
    } else {
      initMatrixData()
    }
  } else {
    unwatchFansMedals()
    searchQuery.value = ''
    displayTableData.value = []
  }
})
</script>

<template>
  <el-dialog
    v-model="visible"
    title="粉丝灯牌管理"
    :lock-scroll="false"
    width="85%"
    top="5vh"
    append-to-body
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      "
    >
      <div style="display: flex; align-items: center; gap: 12px">
        <el-input
          v-model="searchQuery"
          placeholder="输入昵称 / 勋章名 / 房间号 快速查找..."
          clearable
          style="width: 280px"
        />
        <el-button
          type="primary"
          plain
          size="small"
          :icon="Edit"
          @click="handleOpenDanmuPanel('light')"
        >
          配置点亮任务弹幕
        </el-button>
        <el-button
          type="success"
          plain
          size="small"
          :icon="Edit"
          @click="handleOpenDanmuPanel('danmu')"
        >
          配置每日任务弹幕
        </el-button>
      </div>

      <div style="display: flex; align-items: center; gap: 10px">
        <el-text type="warning" v-if="searchQuery.trim()">
          当前处于搜索过滤状态，已禁用排序与置顶。清空搜索框后即可调整。
        </el-text>
        <el-text type="info" v-else>
          拖动
          <el-icon color="var(--el-color-primary)">
            <Sort></Sort>
          </el-icon>
          可调整顺序,点击上下箭头可进行置顶 / 置底操作
        </el-text>
      </div>
    </div>

    <VueDraggable
      v-model="displayTableData"
      target="#matrix-fans-medal-table table tbody"
      :disabled="!!searchQuery.trim()"
      :animation="150"
      handle=".drag-handle"
      @end="() => handleSyncStoreOrder()"
    >
      <el-table
        id="matrix-fans-medal-table"
        v-loading="medalInfoLoading"
        :data="displayTableData"
        :max-height="medalTableMaxHeight"
        empty-text="没有找到对应的粉丝勋章"
        :row-key="(row: MatrixMedalRow) => row.roomid.toString()"
        style="width: 100%; font-size: 13px"
      >
        <el-table-column width="100" align="center" label="排序">
          <template #default="scope">
            <div style="display: flex; align-items: center; justify-content: center; gap: 6px">
              <el-icon
                class="drag-handle"
                :style="{
                  cursor: searchQuery.trim() ? 'not-allowed' : 'move',
                  color: searchQuery.trim() ? '#c0c4cc' : '#409eff',
                  fontSize: '14px',
                }"
              >
                <Sort />
              </el-icon>

              <el-link
                :disabled="!!searchQuery.trim() || scope.$index === 0"
                type="primary"
                :icon="Top"
                style="padding: 0; margin: 0; font-size: 14px"
                @click="handleMoveToTop(scope.$index)"
              ></el-link>

              <el-link
                :disabled="!!searchQuery.trim() || scope.$index === displayTableData.length - 1"
                type="warning"
                :icon="Bottom"
                style="padding: 0; margin: 0; font-size: 14px"
                @click="handleMoveToBottom(scope.$index)"
              ></el-link>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="avatar" label="头像" width="65" align="center">
          <template #default="scope">
            <el-avatar :size="34" :src="scope.row.avatar">
              <template #error>
                <el-avatar :size="34" src="//i0.hdslb.com/bfs/face/member/noface.jpg" />
              </template>
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="nick_name" label="主播" min-width="180">
          <template #default="scope">
            <div style="display: flex; flex-direction: column; gap: 4px">
              <span style="font-weight: 600; color: #303133; font-size: 14px">
                {{ scope.row.nick_name }}
              </span>
              <el-space size="small" style="font-size: 12px" separator="|">
                <el-link
                  type="primary"
                  :underlined="false"
                  style="font-size: 12px"
                  @click="handleOpenLiveroom(scope.row)"
                >
                  直播间
                </el-link>
                <el-link
                  type="info"
                  :underlined="false"
                  style="font-size: 12px"
                  :href="`https://space.bilibili.com/${scope.row.userid}`"
                  target="_blank"
                >
                  个人空间
                </el-link>
              </el-space>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="medal_name" label="勋章" width="120" align="center">
          <template #default="scope">
            <el-tag size="default" type="success" effect="light">
              {{ scope.row.medal_name }}
              <span>
                {{ scope.row.medal_level }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="medal_level" label="等级" width="60" align="center">
          <template #default="scope">
            <span style="font-weight: bold; color: #e6a23c">{{ scope.row.medal_level }}</span>
          </template>
        </el-table-column> -->

        <el-table-column width="115" align="center">
          <template #header>
            <div class="custom-header">
              <span>点亮勋章</span>
              <el-button
                type="primary"
                link
                size="small"
                style="font-size: 11px"
                @click="toggleColumnAll('light')"
                >[全选]</el-button
              >
            </div>
          </template>
          <template #default="scope">
            <el-switch
              v-model="scope.row.light"
              size="small"
              @change="handleMatrixSwitchChange(scope.row, 'light')"
            />
          </template>
        </el-table-column>

        <el-table-column width="115" align="center">
          <template #header>
            <div class="custom-header">
              <span>每日点赞</span>
              <el-button
                type="primary"
                link
                size="small"
                style="font-size: 11px"
                @click="toggleColumnAll('like')"
                >[全选]</el-button
              >
            </div>
          </template>
          <template #default="scope">
            <el-switch
              v-model="scope.row.like"
              size="small"
              @change="handleMatrixSwitchChange(scope.row, 'like')"
            />
          </template>
        </el-table-column>

        <el-table-column width="115" align="center">
          <template #header>
            <div class="custom-header">
              <span>每日弹幕</span>
              <el-button
                type="primary"
                link
                size="small"
                style="font-size: 11px"
                @click="toggleColumnAll('danmu')"
                >[全选]</el-button
              >
            </div>
          </template>
          <template #default="scope">
            <el-switch
              v-model="scope.row.danmu"
              size="small"
              @change="handleMatrixSwitchChange(scope.row, 'danmu')"
            />
          </template>
        </el-table-column>

        <el-table-column width="115" align="center">
          <template #header>
            <div class="custom-header">
              <span>观看直播</span>
              <el-button
                type="primary"
                link
                size="small"
                style="font-size: 11px"
                @click="toggleColumnAll('watch')"
                >[全选]</el-button
              >
            </div>
          </template>
          <template #default="scope">
            <el-switch
              v-model="scope.row.watch"
              size="small"
              @change="handleMatrixSwitchChange(scope.row, 'watch')"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <div style="display: flex; align-items: center; justify-content: center">
              <el-link
                type="warning"
                underline="never"
                :href="`https://live.bilibili.com/p/html/live-app-fanspanel/index.html?roomId=${scope.row.roomid}&anchorId=${scope.row.userid}`"
                target="_blank"
              >
                任务进度
              </el-link>

              <el-divider direction="vertical" style="margin: 0 8px" />

              <el-link
                type="danger"
                underline="never"
                style="font-weight: 500"
                @click="handleFullyRemoveAnchor(scope.row)"
              >
                停用全部
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </VueDraggable>
  </el-dialog>

  <el-dialog
    v-model="medalDanmuPanelVisible"
    :title="`编辑弹幕内容 - ${TASK_LABELS[currentEditingDanmuTask]}`"
    :lock-scroll="false"
    width="40%"
    append-to-body
  >
    <el-table :data="danmuTableData" :max-height="danmuTableMaxHeight">
      <el-table-column type="index" width="80" />
      <el-table-column prop="content" label="弹幕内容" />
      <el-table-column label="操作" width="220" align="center">
        <template #default="scope">
          <el-button text :icon="Edit" @click="handleEditDanmu(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button text :icon="Delete" type="danger" @click="handleDeleteDanmu(scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button type="primary" @click="handleAddDanmu">新增弹幕</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-table__row) {
  height: 54px;
}
.custom-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
  gap: 2px;
}
</style>
