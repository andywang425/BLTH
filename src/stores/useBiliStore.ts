import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LiveData, MainData } from '@/library/bili-api/data'
import type { BiliCookies, FansMedalsStatus } from '@/types'
import { getFilenameFromUrl } from '@/library/utils'

export const useBiliStore = defineStore('bili', () => {
  // window.BilibiliLive 包含当前直播间的一些基本信息
  const BilibiliLive = ref<Window['BilibiliLive']>()
  // 脚本要用到的 Cookies
  const cookies = ref<BiliCookies>()
  // 用户基本信息
  const userInfo = ref<MainData.Nav.Data>()
  // 礼物配置信息
  const giftConfig = ref<LiveData.RoomGiftConfig.Data>()
  // 主站每日任务完成情况
  const dailyRewardInfo = ref<MainData.Reward.Data>()
  // 动态中一页视频的信息
  const dynamicVideos = ref<MainData.DynamicAll.Item[]>()
  // 粉丝勋章列表
  const fansMedals = ref<LiveData.FansMedalPanel.List[]>()
  // 过滤了不存在直播间的粉丝勋章
  const filteredFansMedals = computed<LiveData.FansMedalPanel.List[]>(
    () => fansMedals.value?.filter((m) => m.room_info.room_id !== 0) ?? []
  )
  // 粉丝勋章获取状态（初始值：undefined，获取中：loading，获取成功：loaded，获取失败：error）
  const fansMedalsStatus = ref<FansMedalsStatus>()
  // wbi 签名所需的盐值
  const wbiSalt = computed<string>(() => {
    if (!userInfo.value) {
      return ''
    }

    const imgKey = getFilenameFromUrl(userInfo.value.wbi_img.img_url)
    const subKey = getFilenameFromUrl(userInfo.value.wbi_img.sub_url)
    // 拼接 imgKey 和 subKey
    const imgAndSubKey = imgKey + subKey
    // 将 imgKey 和 subKey 中的字符按特定顺序重新排列，取前32位
    return [
      46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29,
      28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22,
      25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52
    ]
      .map((n) => imgAndSubKey[n])
      .join('')
      .slice(0, 32)
  })

  return {
    BilibiliLive,
    userInfo,
    giftConfig,
    cookies,
    dailyRewardInfo,
    dynamicVideos,
    fansMedals,
    filteredFansMedals,
    fansMedalsStatus,
    wbiSalt
  }
})
