# BLTH  
**Bilibili Live Tasks Helper**  

![TamperMonkey 4.10](https://img.shields.io/badge/TamperMonkey_4.10-pass-green.svg) ![Chromium 83](https://img.shields.io/badge/Chromium_83-pass-green.svg) ![Firefox 77](https://img.shields.io/badge/Firefox_77-pass-green.svg)  

+ 在 Tampermonkey 脚本设置中需要将此脚本的设置 “仅在顶层页面（框架）运行” 设置为否(默认为否)才使脚本在特殊直播间运行。  
+ 不保证能通过其它油猴插件(Greasemonkey/Violentmonkey等)运行。  

-------------------------------

### 点击以下任一链接安装脚本
### 1.githubusercontent源：[BLTH_raw](https://raw.githubusercontent.com/andywang425/BLTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js)  
### 2.greasyfork源： [BLTH_Origin_greasyfork](https://greasyfork.org/scripts/406048-b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B/code/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js)  
### 3.openuserjs源：[BLTH_Origin_openuserjs](https://openuserjs.org/install/andywang425/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js)  

_(带有Origin字样的为原格式脚本)_

-------------------------------

### 使用方法 
在Tampermonkey中启用脚本，登陆bilibili后打开任意b站直播间。  
### 一些建议
**本脚本加载的库文件较多，初次使用时若出现看不到控制面板的情况，请尝试刷新页面。**  
启用脚本后不要参与小时榜和广播礼物的抽奖，重复抢次数多了会进小黑屋。  
_注：这里的小黑屋并非主站的小黑屋，是指被b站风控限制抽奖，领银瓜子宝箱等，与主站无关。_  
如果开启抽奖附加延迟，可能出现领不到礼物的情况，请降低或取消延迟。  
**部分设置更改后需要刷新页面才能生效。**  
**使用前建议先关闭广告拦截插件，并确认相关浏览器设置(如cookie权限，脚本拦截)否则该脚本可能无法正常运行。**  

辣条交流群:[1106094437](https://jq.qq.com/?_wv=1027&k=fCSfWf1O)，欢迎进来聊天或者提点建议~    
## 功能细节 

脚本窗口可以上下滚动！部分设置可能需要滚动后才能看到。
点击**直播画面上方**按钮隐藏/显示脚本窗口和提示信息。    

<details>
<summary>自动抽奖</summary>

+ 抽奖前随机延迟  
+ 特定时段不参与抽奖  
+ 随机跳过抽奖  
+ 能设置当天最多抢辣条数量  
+ 抽奖前模拟进入目标房间  
+ 抽奖前发送活跃弹幕（防检测）  
+ 进入小黑屋后强制重复抽奖直到成功，最多尝试5次  
</details>
<details>
<summary>自动完成每日任务</summary>  

    1.登陆主站  
    2.观看视频  
    3.自动投币，可指定给某用户的视频投币  
    4.分享视频  
    5.银瓜子换硬币  
    6.直播区签到  
    7.应援团签到  
    8.自动领银瓜子宝箱  
    9.模拟移动端心跳（现在没用，暂时保留）  
</details>

+ 自动获取小心心  
+ 自动点亮勋章  
+ 自动送礼  
+ 快捷购买粉丝勋章  
+ 屏蔽不必要的内容  

以上功能涉及参数可自定义。  
## 说明
**关于脚本代码格式**  
本脚本在三个平台上的代码格式有所不同
+ github: 压缩和原格式都有，默认安装压缩格式
+ openuserjs: 第一次安装为原格式，若用tampermonkey更新则会变为压缩格式
+ greasyfork: 原格式

注：项目文件中的[B站直播间挂机助手.user.js](https://github.com/andywang425/BLTH/blob/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js)是压缩后的脚本。  
原格式的脚本为[B站直播间挂机助手.js](https://github.com/andywang425/BLTH/blob/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.js)。  

**关于输入数据格式**  
+ 浮点数(小数)或整数: 抽奖前附加随机延迟，随机跳过礼物。  
+ 数组(或单个整数): 优先送礼房间，不送礼房间, 自动点亮勋章房间号。  
+ 其余只支持整数。  

**关于自动送礼**  
+ 自动送礼只会送出辣条，亿圆和小心心。  
+ 如果要填写多个优先送礼房间或不送礼房间，每个房间号之间需用半角逗号,隔开。如 666,777,888 (其实就是数组的格式)。若不勾选送礼优先高等级粉丝牌则优先送低等级粉丝牌。  
+ 礼物到期时间: 将要在这个时间段里过期的礼物会被送出(勾选送满全部勋章时无论是否将要过期都会被送出)。  
+ 送礼设置优先级:  
  不送礼房间>优先送礼房间>优先高等级粉丝牌>送满全部勋章。  
+ 送礼设置逻辑规则:  
  无论【优先高等级粉丝牌】如何设置，会根据【送满全部勋章】（勾选则无视是否到期补满亲密度，否则只送到期的）条件去按优先送礼房间先后顺序送礼。  
  之后根据【优先高等级粉丝牌】决定先送高级还是低级（勾选先高级，不勾选先低级）。  
+ 不会送出永久礼物。  
+ 【剩余礼物】指送完了所有粉丝牌，但仍有剩余的将在1天内过期的礼物。会在指定送礼时间被送出。  
+ 【剩余礼物送礼直播间】和【剩余礼物送礼直播间拥有者UID】必须对应。任意一项填0则不送剩余礼物。  

**关于自动投币**
+ 脚本会根据今日你已获得的投币经验值判断你已经投了多少个币，然后自动投剩余没投的币。  

  >如今日已获得投币经验20，脚本投币数量设置为4，则会投2个币。  

+ 【给用户(UID:___)的视频投币】若填0则给动态中的视频依次投币(不存在UID为0的用户)。  

**关于任务执行时间**  
+ 初次启用某一项任务时立刻执行。  
+ 登陆主站，观看视频，自动投币，分享视频，银瓜子换硬币，领银瓜子宝箱，直播区签到每日凌晨0点1分时时执行。  
+ 应援团签到在第二天早上8点执行。  

**关于节奏风暴**  
+ 仅会参加被广播的节奏风暴。若无法参加请尝试实名后再参加。  
+ 这个功能目前处于实验阶段，且风险较大。  

**关于内容屏蔽**  
+ 【拦截直播流并静音】若勾选了此选项，会拦截为了获取小心心打开的隐形窗口的直播流。勾选后需刷新网页才能生效。建议与【自动获取小心心】搭配使用。  

**关于小心心**  
+ 使用本功能前请先禁用flash插件。  
+ 因为技术上的原因，目前通过打开隐形窗口的方式来获取小心心。若出现卡顿，浏览器崩溃等情况，请把【打开窗口数量上限】的值调小。  
+ 检测到包裹内有一组24个7天的小心心后会停止，并关闭之前打开的隐形窗口。  
+ 在获取完所有小心心之前直播间不刷新。  
+ 关闭（或刷新）运行脚本的网页后会关闭所有由脚本打开的隐形窗口。  
+ 点亮勋章指送出一个小心心；点亮勋章会在自动送礼之前进行。    
+ 若不勾选【点亮勋章时忽略亲密度上限】，则仅会点亮当日剩余亲密度大于等于小心心亲密度的勋章。   
+ 勋章点亮模式说明
  + 白名单：点亮【自动点亮勋章房间号】所对应的粉丝勋章。
  + 黑名单：点亮所有粉丝勋章中除了【自动点亮勋章房间号】所对应勋章的粉丝勋章。  
  _提示：如果想点亮所有勋章，选黑名单然后不填写拥有勋章的房间号即可。_  

**关于购买粉丝勋章**  
调用官方api（`api.vc.bilibili.com/link_group/v1/member/buy_medal`），消耗20硬币购买某位UP的粉丝勋章。  
默认值为当前房间号。点击购买按钮后有确认界面，无需担心误触。  

**其它设置说明**  
+ 定时重载直播间是为了防止脚本因长时间运行出现bug。  
+ 重置所有为默认：指将设置和任务执行时间缓存重置为默认。  
+ 再次执行每日任务会使相关缓存重置为默认，可以在勾选了新的任务设置后使用。  
+ 支持输入框回车保存。  

**关于运行日志**  
脚本默认开启运行日志，打开控制台在Filter中输入`IGIFTMSG`即可过滤出本脚本的日志。若想关闭日志可以在脚本头部加入`console.log = () => {}`。  
如果使用脚本过程中遇到问题，可以在控制台中寻找相关错误信息。若无法解决可以进行反馈，并给出错误信息和问题描述。  

**关于反馈**  
反馈bug前请先阅读[bug_report.md](https://github.com/andywang425/BLTH/blob/master/.github/ISSUE_TEMPLATE/bug_report.md)。不符合规范的反馈可能会被关闭。

## 已知问题
1. [#12](https://github.com/andywang425/BLTH/issues/12)  
本脚本可能与[Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)存在兼容性问题导致脚本窗口无法正确加载。若出现此问题，请尝试在Bilibili-Evolved设置-其它中，将`加载模式`设置为延后，打开`启用Ajax Hook API`。  
2. 【拦截直播流】功能可能仅在Tampermonkey上可用。  
3. 如果使用firefox浏览器，脚本窗口的布局会调整为单列模式（若在火狐上强制使用双列排版，窗口布局会变得很奇怪，原因不明）。  
## 许可证  
![MIT License](https://img.shields.io/badge/license-MIT-green)  
## 其它信息  
这个项目的部分代码来源于以下几个项目:  
+ [b站直播心心助手](https://greasyfork.org/zh-CN/scripts/381907-b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BF%83%E5%BF%83%E5%8A%A9%E6%89%8B) (MIT) by [十六夜](https://greasyfork.org/en/users/289469-%E5%8D%81%E5%85%AD%E5%A4%9C)
+ [BLRHH](https://github.com/SeaLoong/BLRHH) (MIT) by [SeaLoong](https://github.com/SeaLoong)  
+ [Bilibili-LRHH](https://github.com/pjy612/Bilibili-LRHH) (MIT, _forked from SeaLoong/BLRHH_) by [pjy612](https://github.com/pjy612)
+ [TampermonkeyJS](https://github.com/lzghzr/TampermonkeyJS) (MIT) by [lzghzr](https://github.com/lzghzr)  
+ [layer](https://github.com/sentsin/layer) (MIT) by [sentsin](https://github.com/sentsin)  

本脚本使用的库：  
+ [BilibiliAPI_Mod.js](https://github.com/andywang425/BLTH/blob/master/BilibiliAPI_Mod.js)：B站API及常用函数。  
+ [OCRAD.js](https://github.com/antimatter15/ocrad.js)：识别领银瓜子宝箱验证码。  
+ [libBilibiliToken.js](https://github.com/lzghzr/TampermonkeyJS/blob/master/BiliveClientHeart/BiliveClientHeart.user.js)：获取移动端token。  
+ [layer.js](https://github.com/sentsin/layer)：创建弹窗，信息框等  

本脚本引用的外部资源：
+ [layer.css](https://cdn.jsdelivr.net/gh/sentsin/layer@v3.1.1/dist/theme/default/layer.css)：layer.js的内置样式  

感谢以上这些项目的作者~  

## 更新日志
>### 4.2
>控制面板美化；对火狐做了些兼容性调整；运行效率优化；修复挂小心心失效的问题；通过更加规范的方式引入库文件（jsDelivr GitHub commit-specific references）。  

完整更新日志见[update-log.md](https://github.com/andywang425/BLTH/blob/master/update-log.md)。  