declare namespace LiveData {
  namespace FansMedalPanel {
    interface Data {
      list: List[]
      special_list: SpecialList[]
      bottom_bar: any
      page_info: PageInfo
      total_number: number
      has_medal: number
      group_medal: any
    }

    interface List {
      medal: Medal
      anchor_info: AnchorInfo
      superscript: any
      room_info: RoomInfo
      uinfo_medal: UinfoMedal
    }

    interface Medal {
      uid: number
      target_id: number
      target_name: string
      medal_id: number
      level: number
      medal_name: string
      medal_color: number
      intimacy: number
      next_intimacy: number
      day_limit: number
      today_feed: number
      medal_color_start: number
      medal_color_end: number
      medal_color_border: number
      is_lighted: number
      guard_level: number
      wearing_status: number
      medal_icon_id: number
      medal_icon_url: string
      guard_icon: string
      honor_icon: string
      can_delete: boolean
      v2_medal_color_start: string
      v2_medal_color_end: string
      v2_medal_color_border: string
      v2_medal_color_text: string
      v2_medal_color_level: string
      day_limit_extra: any
    }

    interface AnchorInfo {
      nick_name: string
      avatar: string
      verify: number
    }

    interface RoomInfo {
      room_id: number
      living_status: number
      url: string
    }

    interface UinfoMedal {
      name: string
      level: number
      color_start: number
      color_end: number
      color_border: number
      color: number
      id: number
      typ: number
      is_light: number
      ruid: number
      guard_level: number
      score: number
      guard_icon: string
      honor_icon: string
      v2_medal_color_start: string
      v2_medal_color_end: string
      v2_medal_color_border: string
      v2_medal_color_text: string
      v2_medal_color_level: string
      user_receive_count: number
    }

    interface SpecialList {
      medal: Medal
      anchor_info: AnchorInfo
      superscript: any
      room_info: RoomInfo
      uinfo_medal: UinfoMedal
    }

    interface PageInfo {
      number: number
      current_page: number
      has_more: boolean
      next_page: number
      next_light_status: number
      total_page: number
    }
  }

  namespace SendMsg {
    interface Data {
      mode_info: ModeInfo
      dm_v2: any
    }

    interface ModeInfo {
      mode: number
      show_player_type: number
      extra: string
      user: User
    }

    interface User {
      uid: number
      base: Base
      medal: any
      wealth: any
      title: Title
      guard: any
      uhead_frame: any
      guard_leader: GuardLeader
    }

    interface Base {
      name: string
      face: string
      name_color: number
      is_mystery: boolean
      risk_ctrl_info: any
      origin_info: OriginInfo
      official_info: OfficialInfo
      name_color_str: string
    }

    interface OriginInfo {
      name: string
      face: string
    }

    interface OfficialInfo {
      role: number
      title: string
      desc: string
      type: number
    }

    interface Title {
      old_title_css_id: string
      title_css_id: string
    }

    interface GuardLeader {
      is_guard_leader: boolean
    }
  }

  namespace GetInfoByRoom {
    interface Data {
      room_info: RoomInfo
      anchor_info: AnchorInfo
      news_info: NewsInfo
      rankdb_info: RankdbInfo
      area_rank_info: AreaRankInfo
      battle_rank_entry_info: any
      tab_info: TabInfo
      voice_join_info: VoiceJoinInfo
      ad_banner_info: AdBannerInfo
      skin_info: SkinInfo
      lol_info: any
      pk_info: any
      battle_info: any
      silent_room_info: SilentRoomInfo
      switch_info: SwitchInfo
      record_switch_info: any
      room_config_info: RoomConfigInfo
      gift_memory_info: any
      new_switch_info: NewSwitchInfo
      super_chat_info: SuperChatInfo
      online_gold_rank_info_v2: any
      dm_brush_info: DmBrushInfo
      dm_emoticon_info: DmEmoticonInfo
      dm_tag_info: DmTagInfo
      topic_info: TopicInfo
      game_info: GameInfo
      watched_show: WatchedShow
      topic_room_info: TopicRoomInfo
      show_reserve_status: boolean
      second_create_info: any
      play_together_info: any
      cloud_game_info: CloudGameInfo
      like_info_v3: LikeInfoV3
      live_play_info: LivePlayInfo
      multi_voice: MultiVoice
      popular_rank_info: PopularRankInfo
      new_area_rank_info: NewAreaRankInfo
      gift_star: GiftStar
      progress_for_widget: ProgressForWidget
      revenue_demotion: RevenueDemotion
      revenue_material_md5: any
      block_info: BlockInfo
      danmu_extra: DanmuExtra
      video_connection_info: any
      player_throttle_info: PlayerThrottleInfo
      guard_info: GuardInfo
      hot_rank_info: any
      room_rank_info: RoomRankInfo
      dm_reply: DmReply
      dm_combo: any
      dm_vote: any
      location: any
      interactive_game_tag: InteractiveGameTag
      video_enhancement: VideoEnhancement
      guard_leader: GuardLeader
      room_anonymous: RoomAnonymous
      tab_switches: TabSwitches
      universal_interact_info: any
      pk_info_v2: any
      area_mask_info: AreaMaskInfo
      xtemplate_config: XtemplateConfig
      dm_activity: DmActivity
      dm_interaction_ab: DmInteractionAb
      guard_intimacy_rank_status: GuardIntimacyRankStatus
      hot_rank_entrance_info: any
      area_rank_info_v2: any
      transfer_flow_info: any
      universal_interact_info_v2: any
      play_together_voiceroom_dispatch: PlayTogetherVoiceroomDispatch
      cny: any
      reenter_room_info: any
      cny_quiz_guide: boolean
      fake_device: FakeDevice
      pure_room_info: any
      hot_rank_info_v3: HotRankInfoV3
      charm_chat_rank: any
      program_info: any
      module_control_infos: ModuleControlInfos
    }

    interface RoomInfo {
      uid: number
      room_id: number
      short_id: number
      title: string
      cover: string
      tags: string
      background: string
      description: string
      live_status: number
      live_start_time: number
      live_screen_type: number
      lock_status: number
      lock_time: number
      hidden_status: number
      hidden_time: number
      area_id: number
      area_name: string
      parent_area_id: number
      parent_area_name: string
      keyframe: string
      special_type: number
      up_session: string
      pk_status: number
      is_studio: boolean
      pendants: Pendants
      on_voice_join: number
      online: number
      room_type: RoomType
      sub_session_key: string
      live_id: number
      live_id_str: string
      official_room_id: number
      official_room_info: any
      voice_background: string
      live_model: number
      live_platform: string
      radio_background_type: number
    }

    interface Pendants {
      frame: Frame
    }

    interface Frame {
      name: string
      value: string
      desc: string
    }

    interface RoomType {
      '2-3': number
      '3-19': number
      '3-21': number
      '3-31': number
      '3-41': number
      '3-50': number
    }

    interface AnchorInfo {
      base_info: BaseInfo
      live_info: LiveInfo
      relation_info: RelationInfo
      medal_info: MedalInfo
      gift_info: GiftInfo
    }

    interface BaseInfo {
      uname: string
      face: string
      gender: string
      official_info: OfficialInfo
    }

    interface OfficialInfo {
      role: number
      title: string
      desc: string
      is_nft: number
      nft_dmark: string
    }

    interface LiveInfo {
      level: number
      level_color: number
      score: number
      upgrade_score: number
      current: number[]
      next: any
      rank: string
    }

    interface RelationInfo {
      attention: number
    }

    interface MedalInfo {
      medal_name: string
      medal_id: number
      fansclub: number
    }

    interface GiftInfo {
      price: number
      price_update_time: number
    }

    interface NewsInfo {
      uid: number
      ctime: string
      content: string
    }

    interface RankdbInfo {
      roomid: number
      rank_desc: string
      color: string
      h5_url: string
      web_url: string
      timestamp: number
    }

    interface AreaRankInfo {
      areaRank: AreaRank
      liveRank: LiveRank
    }

    interface AreaRank {
      index: number
      rank: string
    }

    interface LiveRank {
      rank: string
    }

    interface TabInfo {
      list: List[]
    }

    interface List {
      type: string
      desc: string
      isFirst: number
      isEvent: number
      eventType: string
      listType: string
      apiPrefix: string
      rank_name: string
    }

    interface VoiceJoinInfo {
      status: any
      icons: any
      web_share_link: string
    }

    interface AdBannerInfo {
      data: any[]
    }

    interface SkinInfo {
      id: number
      skin_name: string
      skin_config: string
      show_text: string
      skin_url: string
      start_time: number
      end_time: number
      current_time: number
    }

    interface SilentRoomInfo {
      type: string
      level: number
      second: number
      expire_time: number
    }

    interface SwitchInfo {
      close_guard: boolean
      close_gift: boolean
      close_online: boolean
      close_danmaku: boolean
    }

    interface RoomConfigInfo {
      dm_text: string
    }

    interface NewSwitchInfo {
      'room-socket': number
      'room-prop-send': number
      'room-sailing': number
      'room-info-popularity': number
      'room-danmaku-editor': number
      'room-effect': number
      'room-fans_medal': number
      'room-report': number
      'room-feedback': number
      'room-player-watermark': number
      'room-recommend-live_off': number
      'room-activity': number
      'room-web_banner': number
      'room-silver_seeds-box': number
      'room-wishing_bottle': number
      'room-board': number
      'room-supplication': number
      'room-hour_rank': number
      'room-week_rank': number
      'room-anchor_rank': number
      'room-info-integral': number
      'room-super-chat': number
      'room-tab': number
      'room-hot-rank': number
      'fans-medal-progress': number
      'gift-bay-screen': number
      'room-enter': number
      'room-my-idol': number
      'room-topic': number
      'fans-club': number
      'room-popular-rank': number
      mic_user_gift: number
      'new-room-area-rank': number
      wealth_medal: number
      bubble: number
      title: number
      room_rank_rearrange: number
      'web-gift-batter-bar': number
      popular_rank_anchor_ab: number
      h5_pop_up: number
      'brand-user-card-web-switch': number
      'brand-follow-switch': number
      danmu_click_switch: number
      danmu_setting_show_switch: number
      room_hot_rank_v3: number
    }

    interface SuperChatInfo {
      status: number
      jump_url: string
      icon: string
      ranked_mark: number
      message_list: any[]
      sc_manager: boolean
    }

    interface DmBrushInfo {
      min_time: number
      brush_count: number
      slice_count: number
      storage_time: number
    }

    interface DmEmoticonInfo {
      is_open_emoticon: number
      is_shield_emoticon: number
    }

    interface DmTagInfo {
      dm_tag: number
      platform: any
      extra: string
      dm_chronos_extra: string
      dm_mode: any
      dm_setting_switch: number
      material_conf: any
    }

    interface TopicInfo {
      topic_id: number
      topic_name: string
    }

    interface GameInfo {
      game_status: number
    }

    interface WatchedShow {
      switch: boolean
      num: number
      text_small: string
      text_large: string
      icon: string
      icon_location: number
      icon_web: string
    }

    interface TopicRoomInfo {
      interactive_h5_url: string
      watermark: number
    }

    interface CloudGameInfo {
      is_gaming: number
    }

    interface LikeInfoV3 {
      total_likes: number
      click_block: boolean
      count_block: boolean
      guild_emo_text: string
      guild_dm_text: string
      like_dm_text: string
      hand_icons: string[]
      dm_icons: string[]
      eggshells_icon: string
      count_show_time: number
      process_icon: string
      process_color: string
      report_click_limit: number
      report_time_min: number
      report_time_max: number
      icon: string
      cooldown: number
      hand_use_face: boolean
      guide_icon_urls: string[]
      guide_icon_ratio: number
    }

    interface LivePlayInfo {
      show_widget_banner: boolean
      show_left_entry: boolean
      widget_version: number
    }

    interface MultiVoice {
      switch_status: number
      members: any
      mv_role: number
      seat_type: number
      invoking_time: number
      version: number
      pk: any
      biz_session_id: string
      mode_details: any
      hat_list: any
      battle_info: any
    }

    interface PopularRankInfo {
      rank: number
      countdown: number
      timestamp: number
      url: string
      on_rank_name: string
      rank_name: string
      rank_by_type: number
      rank_name_by_type: string
      on_rank_name_by_type: string
      url_by_type: string
      default_url: string
    }

    interface NewAreaRankInfo {
      items: any
      rotation_cycle_time_web: number
    }

    interface GiftStar {
      show: boolean
      display_widget_ab_group: number
    }

    interface ProgressForWidget {
      gift_star_process: any
      wish_process: any
      star_knight: any
      collection_praise_process: CollectionPraiseProcess
      wish_process_v2: any
    }

    interface CollectionPraiseProcess {
      id: number
      uid: number
      target_praise: number
      current_praise: number
      start_time: number
      end_time: number
      benefit: string
      isSuccess: boolean
      exist: boolean
      audit_status: number
      jump_url: string
      current_praise_text: string
      icon_url: string
      live_id: string
    }

    interface RevenueDemotion {
      global_gift_config_demotion: boolean
    }

    interface BlockInfo {
      block: boolean
      desc: string
      business: number
    }

    interface DanmuExtra {
      screen_switch_off: boolean
      chronos_kv: string
      danmu_player_config: any
    }

    interface PlayerThrottleInfo {
      status: number
      normal_sleep_time: number
      fullscreen_sleep_time: number
      tab_sleep_time: number
      prompt_time: number
    }

    interface GuardInfo {
      count: number
      anchor_guard_achieve_level: number
    }

    interface RoomRankInfo {
      anchor_rank_entry: any
      user_rank_entry: UserRankEntry
      user_rank_tab_list: UserRankTabList
    }

    interface UserRankEntry {
      user_contribution_rank_entry: UserContributionRankEntry
    }

    interface UserContributionRankEntry {
      item: Item[]
      count: number
      show_max: number
      count_text: string
      non_expandable: boolean
    }

    interface Item {
      uid: number
      name: string
      face: string
      rank: number
      score: number
      medal_info?: MedalInfo2
      guard_level: number
      wealth_level: number
      is_mystery: boolean
      uinfo: Uinfo
      icon_show: boolean
    }

    interface MedalInfo2 {
      guard_level: number
      medal_color_start: number
      medal_color_end: number
      medal_color_border: number
      medal_name: string
      level: number
      target_id: number
      is_light: number
    }

    interface Uinfo {
      uid: number
      base: Base
      medal?: Medal
      wealth: Wealth
      title: Title
      guard: any
      uhead_frame: any
      guard_leader: any
    }

    interface Base {
      name: string
      face: string
      name_color: number
      is_mystery: boolean
      risk_ctrl_info: RiskCtrlInfo
      origin_info: OriginInfo
      official_info: OfficialInfo2
      name_color_str: string
    }

    interface RiskCtrlInfo {
      name: string
      face: string
    }

    interface OriginInfo {
      name: string
      face: string
    }

    interface OfficialInfo2 {
      role: number
      title: string
      desc: string
      type: number
    }

    interface Medal {
      name: string
      level: number
      color_start: number
      color_end: number
      color_border: number
      color: number
      id: number
      typ: number
      is_light: number
      ruid: number
      guard_level: number
      score: number
      guard_icon: string
      honor_icon: string
      v2_medal_color_start: string
      v2_medal_color_end: string
      v2_medal_color_border: string
      v2_medal_color_text: string
      v2_medal_color_level: string
      user_receive_count: number
    }

    interface Wealth {
      level: number
      dm_icon_key: string
    }

    interface Title {
      old_title_css_id: string
      title_css_id: string
    }

    interface UserRankTabList {
      tab: Tab[]
    }

    interface Tab {
      type: string
      title: string
      status: number
      default: number
      comment: string
      desc_url: string
      switch: any
      sub_tab?: SubTab[]
    }

    interface SubTab {
      type: string
      title: string
      status: number
      default: number
      comment: string
      desc_url: string
      switch?: Switch[]
      sub_tab: any
    }

    interface Switch {
      text: string
      switch: string
      ui_type: UiType
      comment: string
    }

    interface UiType {
      hide_rank_without_score?: number
      op_button_text: number
      rank_prefix: number
      refresh_entry?: number
      show_score: number
    }

    interface DmReply {
      show_reply: boolean
      show_reply_esports: boolean
    }

    interface InteractiveGameTag {
      action: number
      game_id: string
      game_name: string
    }

    interface VideoEnhancement {
      title: string
      desc: string
      default_switch_status: number
      highest_quality: number
      is_enabled: boolean
    }

    interface GuardLeader {
      uid: number
      name: string
      face: string
      jump_url: string
      text: string
      rank_top_icon1: string
      rank_top_icon2: string
      rank_top_background_url1: string
      rank_top_background_url2: string
      background_url: string
      anchor_background_url: string
      input_background_url: string
      newly: number
      entry_effect_id: number
      show: number
      rank_top_background_light_url1: string
      rank_top_background_light_url2: string
      display_src: string
      avatar_src: string
      icon_src: string
    }

    interface RoomAnonymous {
      open_anonymous: boolean
    }

    interface TabSwitches {
      subtitle: number
      realtime_data: RealtimeData
      lol_player_grade: LolPlayerGrade
    }

    interface RealtimeData {
      req_time: number
    }

    interface LolPlayerGrade {
      is_enabled: boolean
      name: string
      jump_url: string
      is_dm_entry_visible: boolean
      dm_jump_url: string
    }

    interface AreaMaskInfo {
      area_masks: AreaMasks
    }

    interface AreaMasks {
      horizontal_masks: any
      vertical_masks: any
      full_mask: any
    }

    interface XtemplateConfig {
      dm_brush_info: DmBrushInfo2
      dm_speed_info: DmSpeedInfo
      dm_pool_info: DmPoolInfo
    }

    interface DmBrushInfo2 {
      landScape: any
      verticalscreen: Verticalscreen
    }

    interface Verticalscreen {
      min_time: number
      brush_count: number
      slice_count: number
      storage_time: number
      is_hide_anti_brush: number
    }

    interface DmSpeedInfo {
      landScape: any
      verticalscreen: Verticalscreen2
    }

    interface Verticalscreen2 {
      valley: Valley
      peak: Peak
      proportion: number
      interval: number
    }

    interface Valley {
      consumetime: number
      consumecount: number
      animationtime: number
    }

    interface Peak {
      consumetime: number
      consumecount: number
      animationtime: number
    }

    interface DmPoolInfo {
      landScape: any
      verticalscreen: Verticalscreen3
    }

    interface Verticalscreen3 {
      master_ceiling: number
      master_count: number
      guest_config: GuestConfig[]
      timeout: number
      unusual_score: number
    }

    interface GuestConfig {
      score_floor: number
      score_ceiling: number
      dm_max: number
      consume: number
    }

    interface DmActivity {
      activity_list: any
      ts: number
      material_list: any
    }

    interface DmInteractionAb {
      '102': number
      '103': number
      '104': number
      '105': number
      '106': number
    }

    interface GuardIntimacyRankStatus {
      guard_rank_new_ab: number
      guard_rank_new_total_status: number
      guard_rank_new_month_status: number
      guard_rank_new_week_status: number
    }

    interface PlayTogetherVoiceroomDispatch {
      mode: number
      game_name: string
      gender: number
      min_price: number
      max_price: number
      end_ts: number
      ts: number
      remark: string
      dispatch_id: number
      notify_num: number
      jump_url: string
      icon_url: string
      game_icon: string
    }

    interface FakeDevice {
      is_fake: boolean
      delay: number
    }

    interface HotRankInfoV3 {
      item: any
      room_hot_rank_v3_ab: number
    }

    interface ModuleControlInfos {
      display_right_interaction_modules: boolean
      anchor_module: AnchorModule
      audience_module: any
      danmu_module: any
      like_module: boolean
      interactive_animation_module: boolean
      super_chat_module: boolean
      danmu_setting_module: boolean
      cmd_list: string[]
    }

    interface AnchorModule {
      allow_click_face: boolean
      allow_follow: boolean
      heat_index: any
    }
  }

  namespace Silver2coin {
    interface Data {
      coin: number
      gold: number
      silver: number
      tid: string
    }
  }
}

declare namespace LiveTraceData {
  namespace E {
    interface Data {
      timestamp: number
      heartbeat_interval: number
      secret_key: string
      secret_rule: number[]
      patch_status: number
    }
  }

  namespace X {
    interface Data {
      heartbeat_interval: number
      timestamp: number
      secret_rule: number[]
      secret_key: string
    }
  }
}

declare namespace MainData {
  namespace Nav {
    interface Data {
      isLogin: boolean
      email_verified: number
      face: string
      face_nft: number
      face_nft_type: number
      level_info: LevelInfo
      mid: number
      mobile_verified: number
      money: number
      moral: number
      official: Official
      officialVerify: OfficialVerify
      pendant: Pendant
      scores: number
      uname: string
      vipDueDate: number
      vipStatus: number
      vipType: number
      vip_pay_type: number
      vip_theme_type: number
      vip_label: VipLabel
      vip_avatar_subscript: number
      vip_nickname_color: string
      vip: Vip
      wallet: Wallet
      has_shop: boolean
      shop_url: string
      answer_status: number
      is_senior_member: number
      wbi_img: WbiImg
      is_jury: boolean
      name_render: any
    }

    interface LevelInfo {
      current_level: number
      current_min: number
      current_exp: number
      next_exp: string
    }

    interface Official {
      role: number
      title: string
      desc: string
      type: number
    }

    interface OfficialVerify {
      type: number
      desc: string
    }

    interface Pendant {
      pid: number
      name: string
      image: string
      expire: number
      image_enhance: string
      image_enhance_frame: string
      n_pid: number
    }

    interface VipLabel {
      path: string
      text: string
      label_theme: string
      text_color: string
      bg_style: number
      bg_color: string
      border_color: string
      use_img_label: boolean
      img_label_uri_hans: string
      img_label_uri_hant: string
      img_label_uri_hans_static: string
      img_label_uri_hant_static: string
      label_id: number
      label_goto: LabelGoto
    }

    interface LabelGoto {
      mobile: string
      pc_web: string
    }

    interface Vip {
      type: number
      status: number
      due_date: number
      vip_pay_type: number
      theme_type: number
      label: Label
      avatar_subscript: number
      nickname_color: string
      role: number
      avatar_subscript_url: string
      tv_vip_status: number
      tv_vip_pay_type: number
      tv_due_date: number
      avatar_icon: AvatarIcon
    }

    interface Label {
      path: string
      text: string
      label_theme: string
      text_color: string
      bg_style: number
      bg_color: string
      border_color: string
      use_img_label: boolean
      img_label_uri_hans: string
      img_label_uri_hant: string
      img_label_uri_hans_static: string
      img_label_uri_hant_static: string
      label_id: number
      label_goto: LabelGoto
    }

    interface AvatarIcon {
      icon_type: number
      icon_resource: IconResource
    }

    interface IconResource {}

    interface Wallet {
      mid: number
      bcoin_balance: number
      coupon_balance: number
      coupon_due_time: number
    }

    interface WbiImg {
      img_url: string
      sub_url: string
    }
  }

  namespace Reward {
    interface Data {
      login: boolean
      watch: boolean
      coins: number
      share: boolean
      email: boolean
      tel: boolean
      safe_question: boolean
      identify_card: boolean
    }
  }

  namespace DynamicAll {
    interface Data {
      has_more: boolean
      items: Item[]
      offset: string
      update_baseline: string
      update_num: number
    }

    interface Item {
      basic: Basic
      id_str: string
      modules: Modules
      type: string
      visible: boolean
    }

    interface Basic {
      comment_id_str: string
      comment_type: number
      like_icon: LikeIcon
      rid_str: string
    }

    interface LikeIcon {
      action_url: string
      end_url: string
      id: number
      start_url: string
    }

    interface Modules {
      module_author: ModuleAuthor
      module_dynamic: ModuleDynamic
      module_more: ModuleMore
      module_stat: ModuleStat
    }

    interface ModuleAuthor {
      avatar: Avatar
      face: string
      face_nft: boolean
      following: boolean
      jump_url: string
      label: string
      mid: number
      name: string
      official_verify: OfficialVerify
      pendant: Pendant
      pub_action: string
      pub_location_text: string
      pub_time: string
      pub_ts: number
      type: string
      vip: Vip
      decoration_card?: DecorationCard
    }

    interface Avatar {
      container_size: ContainerSize
      fallback_layers: FallbackLayers
      mid: string
    }

    interface ContainerSize {
      height: number
      width: number
    }

    interface FallbackLayers {
      is_critical_group: boolean
      layers: Layer[]
    }

    interface Layer {
      general_spec: GeneralSpec
      layer_config: LayerConfig
      resource: Resource
      visible: boolean
    }

    interface GeneralSpec {
      pos_spec: PosSpec
      render_spec: RenderSpec
      size_spec: SizeSpec
    }

    interface PosSpec {
      axis_x: number
      axis_y: number
      coordinate_pos: number
    }

    interface RenderSpec {
      opacity: number
    }

    interface SizeSpec {
      height: number
      width: number
    }

    interface LayerConfig {
      is_critical?: boolean
      tags: Tags
    }

    interface Tags {
      AVATAR_LAYER?: AvatarLayer
      GENERAL_CFG?: GeneralCfg
      ICON_LAYER?: IconLayer
      PENDENT_LAYER?: PendentLayer
    }

    interface AvatarLayer {}

    interface GeneralCfg {
      config_type: number
      general_config: GeneralConfig
    }

    interface GeneralConfig {
      web_css_style: WebCssStyle
    }

    interface WebCssStyle {
      borderRadius: string
      'background-color'?: string
      border?: string
      boxSizing?: string
    }

    interface IconLayer {}

    interface PendentLayer {}

    interface Resource {
      res_image: ResImage
      res_type: number
    }

    interface ResImage {
      image_src: ImageSrc
    }

    interface ImageSrc {
      placeholder?: number
      remote?: Remote
      src_type: number
      local?: number
    }

    interface Remote {
      bfs_style: string
      url: string
    }

    interface OfficialVerify {
      desc: string
      type: number
    }

    interface Pendant {
      expire: number
      image: string
      image_enhance: string
      image_enhance_frame: string
      n_pid: number
      name: string
      pid: number
    }

    interface Vip {
      avatar_subscript: number
      avatar_subscript_url: string
      due_date: number
      label: Label
      nickname_color: string
      status: number
      theme_type: number
      type: number
    }

    interface Label {
      bg_color: string
      bg_style: number
      border_color: string
      img_label_uri_hans: string
      img_label_uri_hans_static: string
      img_label_uri_hant: string
      img_label_uri_hant_static: string
      label_theme: string
      path: string
      text: string
      text_color: string
      use_img_label: boolean
    }

    interface DecorationCard {
      big_card_url: string
      card_type: number
      card_type_name: string
      card_url: string
      fan: Fan
      id: number
      image_enhance: string
      item_id: number
      jump_url: string
      name: string
    }

    interface Fan {
      color: string
      color_format: ColorFormat
      is_fan: number
      name: string
      num_desc: string
      number: number
    }

    interface ColorFormat {
      colors: string[]
      end_point: string
      gradients: number[]
      start_point: string
    }

    interface ModuleDynamic {
      additional: any
      desc: any
      major: Major
      topic?: Topic
    }

    interface Major {
      archive: Archive
      type: string
    }

    interface Archive {
      aid: string
      badge: Badge
      bvid: string
      cover: string
      desc: string
      disable_preview: number
      duration_text: string
      jump_url: string
      stat: Stat
      title: string
      type: number
    }

    interface Badge {
      bg_color: string
      color: string
      icon_url: any
      text: string
    }

    interface Stat {
      danmaku: string
      play: string
    }

    interface Topic {
      id: number
      jump_url: string
      name: string
    }

    interface ModuleMore {
      three_point_items: ThreePointItem[]
    }

    interface ThreePointItem {
      label: string
      type: string
    }

    interface ModuleStat {
      comment: Comment
      forward: Forward
      like: Like
    }

    interface Comment {
      count: number
      forbidden: boolean
    }

    interface Forward {
      count: number
      forbidden: boolean
    }

    interface Like {
      count: number
      forbidden: boolean
      status: boolean
    }
  }

  namespace VideoRelation {
    interface Data {
      attention: boolean
      favorite: boolean
      season_fav: boolean
      like: boolean
      dislike: boolean
      coin: number
    }
  }

  namespace Vip {
    namespace MyPrivilege {
      interface Data {
        list: List[]
        is_short_vip: boolean
        is_freight_open: boolean
        level: number
        cur_exp: number
        next_exp: number
        is_vip: boolean
        is_senior_member: number
        format060102: number
        is_overdue_vip: boolean
        vip_status: number
        vip_type: number
        keeptime_end: number
        vip_due_date: number
        vip_is_annual: boolean
        vip_is_month: boolean
        vip_is_new_user: boolean
        bind_phone: string
        taobao_account: any
        is_tv_vip: boolean
      }

      interface List {
        type: number
        state: number
        expire_time: number
        vip_type: number
        next_receive_days: number
        period_end_unix: number
        is_count: boolean
        name: string
        coupon_code: string
        app_describe: string
        recive_state: number
        salary_type: number
        exp_params: ExpParams
        extra_params?: ExtraParams
      }

      interface ExpParams {
        exp_group_tag: string
        hit_value: number
      }

      interface ExtraParams {
        is_allowe_receive: string
        is_show: string
        last_salary_time: string
        now: string
      }
    }

    namespace ReceivePrivilege {
      interface Data {
        privilege: Privilege
      }

      interface Privilege {
        type: number
        state: number
        expire_time: number
        vip_type: number
        next_receive_days: number
        period_end_unix: number
        is_count: boolean
        name: string
        coupon_code: string
        app_describe: string
        recive_state: number
        salary_type: number
        exp_params: any
        extra_params: any
      }
    }

    namespace AddExperience {
      interface Data {
        type: number
        is_grant: boolean
      }
    }
  }
}

declare namespace VcData {
  namespace MyGroups {
    interface Data {
      list: List[]
    }

    interface List {
      group_id: number
      owner_uid: number
      group_cover?: string
      group_name: string
      group_notice: string
      fans_medal_name?: string
    }
  }

  namespace SignIn {
    interface Data {
      add_num: number
      status: number
    }
  }
}

export { LiveData, LiveTraceData, MainData, VcData }
