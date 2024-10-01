<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useModuleStore } from '@/stores/useModuleStore'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import { useBiliStore } from '@/stores/useBiliStore'
import helpInfo from '@/library/help-info'
import { VueDraggable } from 'vue-draggable-plus'
import { useUIStore } from '@/stores/useUIStore'
import { arrayToMap } from '@/library/utils'

interface MedalInfoRow {
  avatar: string
  nick_name: string
  medal_name: string
  medal_level: number
  roomid: number
}

const moduleStore = useModuleStore()
const biliStore = useBiliStore()
const uiStore = useUIStore()

const medalTableMaxHeight = screen.height * 0.55
const danmuTableMaxHeight = screen.height * 0.5

const config = moduleStore.moduleConfig.DailyTasks.LiveTasks
const status = moduleStore.moduleStatus.DailyTasks.LiveTasks

const medalDanmuPanelVisible = ref<boolean>(false)
const danmuTableData = computed(() =>
  config.medalTasks.light.danmuList.map((danmu) => {
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
      config.medalTasks.light.danmuList[index] = value
    })
    .catch(() => {})
}

const handleDeleteDanmu = (index: number) => {
  if (config.medalTasks.light.danmuList.length === 1) {
    ElMessage.warning({
      message: '至少要有一条弹幕',
      appendTo: '.el-dialog'
    })
    return
  }
  config.medalTasks.light.danmuList.splice(index, 1)
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
      config.medalTasks.light.danmuList.push(value)
    })
    .catch(() => {})
}

const medalInfoPanelVisible = ref<boolean>(false)
const medalInfoTableData = computed({
  get() {
    const medals = biliStore.filteredFansMedals.map((medal) => ({
      avatar: medal.anchor_info.avatar,
      nick_name: medal.anchor_info.nick_name,
      medal_name: medal.medal.medal_name,
      medal_level: medal.medal.level,
      roomid: medal.room_info.room_id
    }))
    if (uiStore.uiConfig.medalInfoPanelSortMode) {
      const filteredMedals = medals.filter((medal) =>
        config.medalTasks.isWhiteList
          ? config.medalTasks.roomidList.includes(medal.roomid)
          : !config.medalTasks.roomidList.includes(medal.roomid)
      )
      const orderMap = arrayToMap(config.medalTasks.roomidList)
      return filteredMedals.sort((a, b) => orderMap.get(a.roomid)! - orderMap.get(b.roomid)!)
    }
    return medals
  },
  set(newValue: MedalInfoRow[]) {
    config.medalTasks.roomidList = newValue.map((row) => row.roomid)
  }
})
/** 是否显示加载中图标 */
const medalInfoLoading = ref<boolean>(false)
/** 是否是第一次点击编辑名单按钮 */
let firstClickEditList = true
/**
 * 编辑名单
 */
const handleEditList = async () => {
  medalInfoPanelVisible.value = true

  if (firstClickEditList) {
    // 第一次点击编辑名单按钮时需要初始化多选框状态
    firstClickEditList = false
    // 等对话框加载好后再对表格进行操作
    await nextTick()
    // 如果没有粉丝勋章信息，先获取
    if (!biliStore.fansMedals) {
      medalInfoLoading.value = true
      // 等待数据被获取到
      watch(
        medalInfoTableData,
        (newData) => {
          nextTick(() => {
            initSelection(newData)
            medalInfoLoading.value = false
          })
        },
        { once: true }
      )
      // 利用 emitter 通知 FansMedals 模块去获取数据
      moduleStore.emitter.emit('Default_FansMedals', {
        module: 'LiveTasks'
      })
    } else {
      initSelection(medalInfoTableData.value)
    }
  }
}
/** 用来管理多选框状态的表格Ref */
const medalInfoTableRef = ref<InstanceType<typeof ElTable>>()

/** 初始化多选框选择状态 */
const initSelection = (rows?: MedalInfoRow[]) => {
  if (rows) {
    config.medalTasks.roomidList.forEach((roomid, index) => {
      const row = rows.find((row) => row.roomid === roomid)
      if (row) {
        medalInfoTableRef.value?.toggleRowSelection(row, true)
      } else {
        // 没有找到直播间号为 roomid 的粉丝勋章，可能是因为该粉丝勋章已被删除或是过滤
        // 从黑白名单中去掉这个 roomid
        config.medalTasks.roomidList.splice(index, 1)
      }
    })
  }
}

function handleSelect(selection: MedalInfoRow[]) {
  config.medalTasks.roomidList = selection.map((row) => row.roomid)
}

function handleRowClick(row: MedalInfoRow) {
  // 切换当前行的选择状态
  medalInfoTableRef.value?.toggleRowSelection(row)
  // 更新黑白名单
  const selection: MedalInfoRow[] = medalInfoTableRef.value?.getSelectionRows()
  config.medalTasks.roomidList = selection.map((row) => row.roomid)
}
</script>

<template>
  <div>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.sign.enabled" active-text="直播签到" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.sign" />
        <TaskStatus :status="status.sign" />
      </el-space>
    </el-row>
    <el-divider />
    <!-- 粉丝勋章相关任务 -->
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.medalTasks.light.enabled" active-text="点亮熄灭勋章" />
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.light.main" />
        <TaskStatus :status="status.medalTasks.light" />
      </el-space>
    </el-row>
    <el-row>
      <el-radio-group v-model="config.medalTasks.light.mode" class="radio-group">
        <el-row>
          <el-space wrap :size="[8, 0]">
            <el-icon>
              <SemiSelect />
            </el-icon>
            <el-radio value="like">点赞</el-radio>
            <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.light.like" />
          </el-space>
        </el-row>
        <el-row>
          <el-space wrap :size="[8, 0]">
            <el-icon>
              <SemiSelect />
            </el-icon>
            <el-radio value="danmu">发送弹幕</el-radio>
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="medalDanmuPanelVisible = !medalDanmuPanelVisible"
              >编辑弹幕
            </el-button>
            <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.light.danmu" />
          </el-space>
        </el-row>
      </el-radio-group>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.medalTasks.watch.enabled" active-text="观看直播" />
        <el-select v-model="config.medalTasks.watch.time" placeholder="Select" style="width: 70px">
          <el-option v-for="i in 6" :key="i" :label="i * 5" :value="i * 5" />
        </el-select>
        <el-text>分钟 / 直播间</el-text>
        <Info :item="helpInfo.DailyTasks.LiveTasks.medalTasks.watch" />
        <TaskStatus :status="status.medalTasks.watch" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch
          v-model="config.medalTasks.isWhiteList"
          active-text="白名单"
          inactive-text="黑名单"
          @change="(val: any) => !val && (uiStore.uiConfig.medalInfoPanelSortMode = false)"
        />
        <el-button type="primary" size="small" :icon="Edit" @click="handleEditList"
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
    <!-- 弹窗 -->
    <el-dialog
      v-model="medalDanmuPanelVisible"
      title="编辑弹幕内容"
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
    <el-dialog v-model="medalInfoPanelVisible" title="编辑粉丝勋章名单" :lock-scroll="false">
      <VueDraggable
        v-model="medalInfoTableData"
        target="#draggable-fans-medal-table table tbody"
        :disabled="!uiStore.uiConfig.medalInfoPanelSortMode"
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
          @select="handleSelect"
          @select-all="handleSelect"
          @row-click="handleRowClick"
          :row-key="(row: MedalInfoRow) => row.roomid.toString()"
        >
          <template v-if="!uiStore.uiConfig.medalInfoPanelSortMode">
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
          <el-table-column prop="medal_level" label="等级" width="80" sortable />
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
          :disabled="!config.medalTasks.isWhiteList"
          v-model="uiStore.uiConfig.medalInfoPanelSortMode"
          inactive-text="常规模式"
          active-text="排序模式"
          @change="(val: any) => !val && nextTick(() => initSelection(medalInfoTableData))"
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
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.radio-group {
  display: block;
  font-size: inherit;
}
</style>
