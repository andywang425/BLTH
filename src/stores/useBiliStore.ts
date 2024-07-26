import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LiveData, MainData } from '../library/bili-api/data'
import type { BiliCookies } from '../types'

export const useBiliStore = defineStore('bili', () => {
  // window.BilibiliLive 包含当前直播间的一些基本信息
  const BilibiliLive = ref<Window['BilibiliLive'] | null>(null)
  // 脚本要用到的 Cookies
  const cookies = ref<BiliCookies | null>(null)
  // 用户基本信息
  const userInfo = ref<MainData.Nav.Data | null>(null)
  // 礼物配置信息
  const giftConfig = ref<LiveData.RoomGiftConfig.Data | null>(null)
  // 主站每日任务完成情况
  const dailyRewardInfo = ref<MainData.Reward.Data | null>(null)
  // 动态中一页视频的信息
  const dynamicVideos = ref<MainData.DynamicAll.Item[] | null>(null)
  // 粉丝勋章列表
  const fansMedals = ref<LiveData.FansMedalPanel.List[] | null>(null)
  // 过滤了不存在直播间的粉丝勋章
  const filteredFansMedals = computed<LiveData.FansMedalPanel.List[] | null>(
    () => fansMedals.value?.filter((m) => m.room_info.room_id !== 0) ?? null
  )

  return {
    BilibiliLive,
    userInfo,
    giftConfig,
    cookies,
    dailyRewardInfo,
    dynamicVideos,
    fansMedals,
    filteredFansMedals
  }
})
