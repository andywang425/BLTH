<script setup lang="ts">
import { useModuleStore } from '../stores/useModuleStore'

const moduleStore = useModuleStore()
const config = moduleStore.moduleConfig.RemoveElement
</script>

<template>
  <div>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removePKBox.enabled" active-text="移除大乱斗元素" />
        <Info id="RemoveElement.removePKBox" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeLiveWaterMark.enabled" active-text="移除直播间水印" />
        <Info id="RemoveElement.removeLiveWaterMark" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeShopPopover.enabled" active-text="移除直播间小黄车弹窗" />
        <Info id="RemoveElement.removeShopPopover" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeGameParty.enabled" active-text="移除直播间幻星派对标志" />
        <Info id="RemoveElement.removeGameParty" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeGiftPopover.enabled" active-text="移除礼物赠送提示弹窗" />
        <Info id="RemoveElement.removeGiftPopover" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeMicPopover.enabled" active-text="移除连麦状态提示" />
        <Info id="RemoveElement.removeMicPopover" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch
          v-model="config.removeComboCard.enabled"
          active-text="移除直播间相同弹幕连续提示"
        />
        <Info id="RemoveElement.removeComboCard" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeRank.enabled" active-text="移除排行榜" />
        <Info id="RemoveElement.removeRank" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeGiftPlanet.enabled" active-text="移除礼物星球" />
        <Info id="RemoveElement.removeGiftPlanet" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeActivityBanner.enabled" active-text="移除活动入口" />
        <Info id="RemoveElement.removeActivityBanner" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removePKBanner.enabled" active-text="移除大乱斗入口" />
        <Info id="RemoveElement.removePKBanner" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch v-model="config.removeFlipView.enabled" active-text="移除礼物栏下方广告" />
        <Info id="RemoveElement.removeFlipView" />
      </el-space>
    </el-row>
    <el-row>
      <el-space wrap>
        <el-switch
          v-model="config.removeRecommendRoom.enabled"
          active-text="移除礼物栏下方推荐直播间"
        />
        <Info id="RemoveElement.removeRecommendRoom" />
      </el-space>
    </el-row>
    <el-divider />
  </div>
</template>
