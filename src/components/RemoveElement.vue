<script setup lang="ts">
import { useModuleStore } from '@/stores/useModuleStore'
import helpInfo from '@/library/help-info'

const moduleStore = useModuleStore()
const config = moduleStore.moduleConfig.RemoveElement
</script>

<template>
  <div>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removePKBox.enabled" active-text="移除大乱斗元素" />
        <Info :item="helpInfo.RemoveElement.removePKBox" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeLiveWaterMark.enabled" active-text="移除直播间水印" />
        <Info :item="helpInfo.RemoveElement.removeLiveWaterMark" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeShopPopover.enabled" active-text="移除直播间小橙车弹窗" />
        <Info :item="helpInfo.RemoveElement.removeShopPopover" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeGameParty.enabled" active-text="移除直播间幻星派对标志" />
        <Info :item="helpInfo.RemoveElement.removeGameParty" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeGiftPopover.enabled" active-text="移除礼物赠送提示弹窗" />
        <Info :item="helpInfo.RemoveElement.removeGiftPopover" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeMicPopover.enabled" active-text="移除连麦状态提示" />
        <Info :item="helpInfo.RemoveElement.removeMicPopover" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch
          v-model="config.removeComboCard.enabled"
          active-text="移除直播间相同弹幕连续提示"
        />
        <Info :item="helpInfo.RemoveElement.removeComboCard" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeRank.enabled" active-text="移除排行榜" />
        <Info :item="helpInfo.RemoveElement.removeRank" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeHeaderStuff.enabled" active-text="移除直播画面上方杂项" />
        <Info :item="helpInfo.RemoveElement.removeHeaderStuff" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeFlipView.enabled" active-text="移除礼物栏下方广告" />
        <Info :item="helpInfo.RemoveElement.removeFlipView" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap:size="[8, 0]">
        <el-switch
          v-model="config.removeRecommendRoom.enabled"
          active-text="移除礼物栏下方推荐直播间"
        />
        <Info :item="helpInfo.RemoveElement.removeRecommendRoom" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap :size="[8, 0]">
        <el-switch v-model="config.removeLiveMosaic.enabled" active-text="移除直播间马赛克" />
        <Info :item="helpInfo.RemoveElement.removeLiveMosaic" />
      </el-space>
    </el-row>
    <el-divider />
  </div>
</template>
