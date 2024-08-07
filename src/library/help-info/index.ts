import { h } from 'vue'
import type { HelpInfo } from '@/types'

const helpInfo: HelpInfo = {
  DailyTasks: {
    MainSiteTasks: {
      login: {
        title: '每日登录',
        message: '完成主站的每日登录任务。'
      },
      watch: {
        title: '每日观看视频',
        message: h('p', [
          h('div', '完成主站的每日观看视频任务。'),
          h('div', '从动态中选取视频观看，会产生观看历史记录。')
        ])
      },
      coin: {
        title: '每日投币',
        message: h('p', [
          h('div', '完成主站的每日投币任务。'),
          h('div', '从动态中选取视频投币，会根据你今天已经投过的币的数量计算还要投几个币。')
        ])
      },
      share: {
        title: '每日分享视频',
        message: h('p', [
          h('div', '完成主站的每日分享视频任务。'),
          h('div', '不会真的分享到某处。')
        ])
      }
    },
    LiveTasks: {
      sign: {
        title: '直播签到',
        message: h('p', [h('div', '完成直播签到任务。')])
      },
      medalTasks: {
        list: {
          title: '黑白名单',
          message: h('p', [
            h(
              'div',
              '为了更精细地控制为哪些粉丝勋章执行点亮熄灭勋章和观看直播任务，你可以使用黑名单或白名单模式。'
            ),
            h('div', [
              h('li', [
                h('span', '黑名单：仅为'),
                h('strong', '不在'),
                h('span', '名单中的粉丝勋章执行任务。')
              ]),
              h('li', [
                h('span', '白名单：仅为'),
                h('strong', '在'),
                h('span', '名单中的粉丝勋章执行任务。')
              ])
            ]),
            h('div', '点击编辑名单按钮，然后使用第一列的多选框即可编辑名单中的粉丝勋章。')
          ])
        },
        light: {
          main: {
            title: '点亮熄灭勋章',
            message: h('p', [
              h('div', '在你的每个已熄灭的粉丝勋章对应的直播间完成点亮任务，从而点亮粉丝勋章。'),
              h('div', '支持两种点亮方式，可自由选择：'),
              h('div', [
                h('li', [h('span', '点赞（不推荐）：点赞30次')]),
                h('li', [h('strong', '发送弹幕（推荐）：'), h('span', '发送弹幕1条')])
              ])
            ])
          },
          like: {
            title: '点赞',
            message: h('p', [
              h('div', '在已熄灭粉丝勋章对应的直播间给主播点赞，点亮粉丝勋章。'),
              h('div', [
                h('li', [h('span', '点赞次数为略微超过任务要求的随机值。')]),
                h('li', [h('span', '部分直播间无法完成该任务，原因未知。')])
              ]),
              h('div', [
                h('strong', '注意：'),
                h('span', '点赞只能点亮正在直播的直播间对应的粉丝勋章。')
              ])
            ])
          },
          danmu: {
            title: '发送弹幕',
            message: h('p', [
              h('div', '在已熄灭粉丝勋章对应的直播间发送一条弹幕，点亮粉丝勋章。'),
              h('div', [
                h('span', '点击编辑弹幕按钮编辑发送的弹幕，脚本会从中按顺序循环抽取弹幕发送。'),
                h('span', '部分直播间无法完成该任务，可能的原因有:'),
                h('div', [
                  h('li', '你被禁言了'),
                  h('li', '发言有粉丝勋章等级要求'),
                  h('li', [
                    h('span', '特殊直播间（比如'),
                    h(
                      'a',
                      { href: 'https://live.bilibili.com/54', rel: 'noreferrer', target: '_blank' },
                      '54'
                    ),
                    h('span', '）')
                  ])
                ])
              ])
            ])
          }
        },
        watch: {
          title: '观看直播',
          message: h('p', [
            h('div', '完成粉丝勋章的观看直播任务。'),
            h('div', [
              h('li', '部分直播间因为没有设置直播分区导致任务无法完成。'),
              h('li', '主播当前是否开播不会影响该任务的完成。'),
              h('li', '脚本会按粉丝勋章的默认顺序逐个完成观看指定时长直播的任务。')
            ]),
            h('div', [
              h('strong', '注意：'),
              h(
                'span',
                '如果当前所处的直播间正在直播，可能无法获得任何亲密度。请在未开播的直播间使用本功能，后续会优化这一点。'
              )
            ])
          ])
        }
      }
    },
    OtherTasks: {
      groupSign: {
        title: '应援团签到',
        message: '完成应援团签到任务。'
      },
      silverToCoin: {
        title: '银瓜子换硬币',
        message: h('p', [
          h('div', '把银瓜子兑换为硬币。'),
          h('div', '具体兑换规则请点击直播间页面的“立即充值→银瓜子商店”查看。')
        ])
      },
      coinToSilver: {
        title: '硬币换银瓜子',
        message: h('p', [
          h('div', '把硬币兑换为银瓜子。'),
          h('div', '具体兑换规则请点击直播间页面的“立即充值→银瓜子商店”查看。')
        ])
      },
      getYearVipPrivilege: {
        title: '领取年度大会员权益',
        message: h('p', [
          h('div', '自动领取年度大会员权益。'),
          h('div', [
            h('span', '具体权益请前往'),
            h(
              'a',
              {
                href: 'https://account.bilibili.com/account/big/myPackage',
                rel: 'noreferrer',
                target: '_blank'
              },
              '卡券包'
            ),
            h('span', '查看。')
          ])
        ])
      }
    }
  },
  EnhanceExperience: {
    switchLiveStreamQuality: {
      title: '自动切换画质',
      message: h('p', [
        h('div', '打开直播间后自动把播放器切换到指定画质。'),
        h('div', '如果指定画质不存在，则还是使用B站的默认画质。')
      ])
    },
    banp2p: {
      title: '禁用P2P',
      message: h('p', [
        h('div', '禁用直播流的P2P上传/下载'),
        h(
          'div',
          'B站使用WebRTC技术把许多浏览器点对点（P2P）地连接起来，实现视频流和音频流的传输。这样做是为了减轻B站服务器的压力，但是会占用你一定的上行带宽（大约几百kb每秒）。如果你不想被占用上行带宽，可以开启该功能。若开启后发现观看直播时有明显卡顿，请关闭。'
        )
      ])
    },
    noReport: {
      title: '拦截日志数据上报',
      message: h('p', [
        h('div', '禁止B站上报日志数据。'),
        h('div', [
          h(
            'span',
            'B站会实时地上报大量日志信息，比如直播观看情况、代码报错等等。开启本功能后绝大多数日志上报都会被拦截并返回一个成功的响应。如果追求更好的效果和性能表现建议使用带有广告拦截功能的浏览器拓展，比如'
          ),
          h(
            'a',
            {
              href: 'https://github.com/gorhill/uBlock',
              rel: 'noreferrer',
              target: '_blank'
            },
            'uBlock Origin'
          ),
          h('span', '。')
        ])
      ])
    },
    noSleep: {
      title: '屏蔽挂机检测',
      message: h('p', [
        h('div', '屏蔽B站直播间的挂机检测。'),
        h(
          'div',
          '如果长时间没有操作，会提示“检测到您已离开当前屏幕，倒计时后即将暂停播放”。开启本功能后即可避免这种情况。'
        )
      ])
    },
    invisibility: {
      title: '隐身入场',
      message: h('p', [h('div', '进入直播间时其他人不会收到提示，但还是会出现在高能用户榜单上。')])
    },
    showContributionUserNum: {
      title: '显示高能用户数量',
      message: h('p', [
        h('div', '在高能用户标签上显示当前直播间的高能用户数量，每分钟更新一次数据。')
      ])
    }
  },
  RemoveElement: {
    removePKBox: {
      title: '移除大乱斗元素',
      message: '移除直播间的大乱斗元素（进度条，弹出的提示等）。'
    },
    removeLiveWaterMark: {
      title: '移除直播间水印',
      message: '移除直播画面左上角的水印。'
    },
    removeShopPopover: {
      title: '移除直播间小黄车弹窗',
      message: '移除直播间左上角的小黄车弹窗。'
    },
    removeGameParty: {
      title: '移除直播间幻星派对标志',
      message: '移除直播间右下角的幻星派对标志。'
    },
    removeGiftPopover: {
      title: '移除礼物赠送提示弹窗',
      message: '移除直播间右下角的礼物赠送提示弹窗（赠送一个牛蛙牛蛙支持主播）。'
    },
    removeMicPopover: {
      title: '移除连麦状态提示',
      message: '移除直播间左上角的连麦提示弹窗（连线功能只能在手机端使用，快使用手机登录吧～）。'
    },
    removeComboCard: {
      title: '移除直播间相同弹幕连续提示',
      message: '移除直播间相同弹幕连续提示。'
    },
    removeRank: {
      title: '移除排行榜',
      message: '移除直播画面上方的人气榜/航海榜，赠送人气票的入口也在这里。'
    },
    removeGiftPlanet: {
      title: '移除礼物星球',
      message: '移除直播画面上方的礼物星球。'
    },
    removeActivityBanner: {
      title: '移除活动入口',
      message: '移除直播画面上方的活动入口，当前活动内容会滚动切换。'
    },
    removePKBanner: {
      title: '移除大乱斗入口',
      message:
        '移除直播画面上方的大乱斗入口，这里在有BLS的时候也会成为BLS的入口，和大乱斗的入口滚动切换。'
    },
    removeFlipView: {
      title: '移除礼物栏下方广告',
      message: '移除礼物栏下方广告。'
    },
    removeRecommendRoom: {
      title: '移除礼物栏下方推荐直播间',
      message: '移除礼物栏下方推荐直播间。'
    },
    removeLiveMosaic: {
      title: '移除直播间马赛克',
      message: '移除部分直播间特有的马赛克。'
    }
  }
}

export default helpInfo
