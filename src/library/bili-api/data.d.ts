declare namespace LiveData {
  namespace RoomGiftConfig {
    interface Data {
      list: List[]
      combo_resources: ComboResource[]
      guard_resources: GuardResource[]
      naming_gift: NamingGift
      send_disable_msg: SendDisableMsg
    }

    interface List {
      id: number
      name: string
      price: number
      type: number
      coin_type: string
      bag_gift: number
      effect: number
      corner_mark: string
      corner_background: string
      broadcast: number
      draw: number
      stay_time: number
      animation_frame_num: number
      desc: string
      rule: string
      rights: string
      privilege_required: number
      count_map: CountMap[]
      img_basic: string
      img_dynamic: string
      frame_animation: string
      gif: string
      webp: string
      full_sc_web: string
      full_sc_horizontal: string
      full_sc_vertical: string
      full_sc_horizontal_svga: string
      full_sc_vertical_svga: string
      bullet_head: string
      bullet_tail: string
      limit_interval: number
      bind_ruid: number
      bind_roomid: number
      gift_type: number
      combo_resources_id: number
      max_send_limit: number
      weight: number
      goods_id: number
      has_imaged_gift: number
      left_corner_text: string
      left_corner_background: string
      gift_banner?: GiftBanner
      diy_count_map: number
      effect_id: number
      first_tips: string
      gift_attrs: number[]
      corner_mark_color: string
      corner_color_bg: string
    }

    interface CountMap {
      num: number
      text: string
      desc: string
      web_svga: string
      vertical_svga: string
      horizontal_svga: string
      special_color: string
      effect_id: number
    }

    interface GiftBanner {
      app_pic: string
      web_pic: string
      left_text: string
      left_color: string
      button_text: string
      button_color: string
      button_pic_color: string
      jump_url: string
      jump_to: number
      web_pic_url: string
      web_jump_url: string
    }

    interface ComboResource {
      combo_resources_id: number
      img_one: string
      img_two: string
      img_three: string
      img_four: string
      color_one: string
      color_two: string
    }

    interface GuardResource {
      level: number
      img: string
      name: string
    }

    interface NamingGift {
      text: Text
    }

    interface Text {
      app_user: string
      app_user_selected: string
      web_user: string
      web_user_selected: string
      combo_user: string
      combo_anchor: string
      vtr: string
    }

    interface SendDisableMsg {
      gift_for_owner: string
      no_send_obj: string
      no_fans_incr: string
      jump_fans_url: string
      web_no_fans_incr: string
    }
  }

  namespace DoSign {
    interface Data {
      text: string
      specialText: string
      allDays: number
      hadSignDays: number
      isBonusDay: number
    }
  }

  namespace GetSignInfo {
    interface Data {
      text: string
      specialText: string
      status: number
      allDays: number
      curMonth: number
      curYear: number
      curDay: number
      curDate: string
      hadSignDays: number
      newTask: number
      signDaysList: number[]
      signBonusDaysList: any[]
    }
  }

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
      activity_init_info: ActivityInitInfo
      voice_join_info: VoiceJoinInfo
      ad_banner_info: AdBannerInfo
      skin_info: SkinInfo
      web_banner_info: WebBannerInfo
      lol_info: any
      pk_info: any
      battle_info: any
      silent_room_info: SilentRoomInfo
      switch_info: SwitchInfo
      record_switch_info: any
      room_config_info: RoomConfigInfo
      gift_memory_info: GiftMemoryInfo
      new_switch_info: NewSwitchInfo
      super_chat_info: SuperChatInfo
      online_gold_rank_info_v2: OnlineGoldRankInfoV2
      dm_brush_info: DmBrushInfo
      dm_emoticon_info: DmEmoticonInfo
      dm_tag_info: DmTagInfo
      topic_info: TopicInfo
      game_info: GameInfo
      watched_show: WatchedShow
      topic_room_info: TopicRoomInfo
      show_reserve_status: boolean
      second_create_info: SecondCreateInfo
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
      video_connection_info: any
      player_throttle_info: PlayerThrottleInfo
      guard_info: GuardInfo
      hot_rank_info: any
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
      '3-21': number
      '3-31': number
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
      next: number[]
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

    interface ActivityInitInfo {
      eventList: any[]
      weekInfo: WeekInfo
      giftName: any
      lego: Lego
    }

    interface WeekInfo {
      bannerInfo: any
      giftName: any
    }

    interface Lego {
      timestamp: number
      config: string
    }

    interface VoiceJoinInfo {
      status: Status
      icons: Icons
      web_share_link: string
    }

    interface Status {
      open: number
      anchor_open: number
      status: number
      uid: number
      user_name: string
      head_pic: string
      guard: number
      start_at: number
      current_time: number
    }

    interface Icons {
      icon_close: string
      icon_open: string
      icon_wait: string
      icon_starting: string
    }

    interface AdBannerInfo {
      data: Daum[]
    }

    interface Daum {
      id: number
      title: string
      location: string
      position: number
      pic: string
      link: string
      weight: number
      room_id: number
      up_id: number
      parent_area_id: number
      area_id: number
      live_status: number
      av_id: number
      is_ad: boolean
      ad_transparent_content: any
      show_ad_icon: boolean
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

    interface WebBannerInfo {
      id: number
      title: string
      left: string
      right: string
      jump_url: string
      bg_color: string
      hover_color: string
      text_bg_color: string
      text_hover_color: string
      link_text: string
      link_color: string
      input_color: string
      input_text_color: string
      input_hover_color: string
      input_border_color: string
      input_search_color: string
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

    interface GiftMemoryInfo {
      list: any
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
    }

    interface SuperChatInfo {
      status: number
      jump_url: string
      icon: string
      ranked_mark: number
      message_list: any[]
    }

    interface OnlineGoldRankInfoV2 {
      list: List2[]
    }

    interface List2 {
      uid: number
      face: string
      uname: string
      score: string
      rank: number
      guard_level: number
      wealth_level: number
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
      platform: any[]
      extra: string
      dm_chronos_extra: string
      dm_mode: any[]
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

    interface SecondCreateInfo {
      click_permission: number
      common_permission: number
      icon_name: string
      icon_url: string
      url: string
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
    }

    interface LivePlayInfo {
      show_widget_banner: boolean
      show_left_entry: boolean
    }

    interface MultiVoice {
      switch_status: number
      members: any[]
      mv_role: number
      seat_type: number
      invoking_time: number
      version: number
      pk: any
      biz_session_id: string
      mode_details: any
      hat_list: any
    }

    interface PopularRankInfo {
      rank: number
      countdown: number
      timestamp: number
      url: string
      on_rank_name: string
      rank_name: string
    }

    interface NewAreaRankInfo {
      items: Item[]
      rotation_cycle_time_web: number
    }

    interface Item {
      conf_id: number
      rank_name: string
      uid: number
      rank: number
      icon_url_blue: string
      icon_url_pink: string
      icon_url_grey: string
      jump_url_link: string
      jump_url_pc: string
      jump_url_pink: string
      jump_url_web: string
    }

    interface GiftStar {
      show: boolean
      display_widget_ab_group: number
    }

    interface ProgressForWidget {
      gift_star_process: GiftStarProcess
      wish_process: any
    }

    interface GiftStarProcess {
      task_info: TaskInfo
      preload_timestamp: number
      preload: boolean
      preload_task_info: any
      widget_bg: string
      jump_schema: string
      ab_group: number
    }

    interface TaskInfo {
      start_date: number
      process_list: any
      finished: boolean
      ddl_timestamp: number
      version: number
      reward_gift: number
      reward_gift_img: string
      reward_gift_name: string
    }

    interface RevenueDemotion {
      global_gift_config_demotion: boolean
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
  }

  namespace GetUserTaskProgress {
    interface Data {
      is_surplus: number
      status: number
      progress: number
      target: number
      wallet: Wallet
      linked_actions_progress: any
      week_task: any
      week_total: number
      week_group: number
      day_task: DayTask
      anchor_task: any
      task_list: any
      task_id: number
      count_down: number
    }

    interface Wallet {
      gold: number
      silver: number
    }

    interface DayTask {
      status: number
      progress: number
      target: number
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
      allowance_count: number
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
      next_exp: number | string
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
    }

    interface AvatarIcon {
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
      module_interaction?: ModuleInteraction
    }

    interface ModuleAuthor {
      avatar: Avatar
      decoration_card?: DecorationCard
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
      PENDENT_LAYER?: PendentLayer
      ICON_LAYER?: IconLayer
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

    interface PendentLayer {}

    interface IconLayer {}

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
      color?: string
      color_format?: ColorFormat
      is_fan?: number
      name?: string
      num_desc?: string
      number?: number
    }

    interface ColorFormat {
      colors: string[]
      end_point: string
      gradients: number[]
      start_point: string
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

    interface ModuleDynamic {
      additional?: Additional
      desc?: Desc
      major: Major
      topic?: Topic
    }

    interface Additional {
      common: Common
      type: string
    }

    interface Common {
      button: Button
      cover: string
      desc1: string
      desc2: string
      head_text: string
      id_str: string
      jump_url: string
      style: number
      sub_type: string
      title: string
    }

    interface Button {
      jump_style: JumpStyle
      jump_url: string
      type: number
    }

    interface JumpStyle {
      icon_url: string
      text: string
    }

    interface Desc {
      rich_text_nodes: RichTextNode[]
      text: string
    }

    interface RichTextNode {
      orig_text: string
      text: string
      type: string
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

    interface ModuleInteraction {
      items: Item2[]
    }

    interface Item2 {
      desc: Desc2
      type: number
    }

    interface Desc2 {
      rich_text_nodes: RichTextNode2[]
      text: string
    }

    interface RichTextNode2 {
      orig_text: string
      rid?: string
      text: string
      type: string
      emoji?: Emoji
    }

    interface Emoji {
      icon_url: string
      size: number
      text: string
      type: number
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
        exp_params?: ExpParams
      }

      interface ExpParams {
        exp_group_tag: string
        hit_value: number
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
      fans_medal_name: string
    }
  }

  namespace SignIn {
    interface Data {
      add_num: number
      status: number
      _gt_: number
    }
  }
}

export { LiveData, LiveTraceData, MainData, VcData }
