# Bilibili-SGTH  
**Bilibili Spicy Gluten and Task Helper**  

![ECMAScript 6](https://img.shields.io/badge/ECMAScript_6-pass-green.svg) ![ECMAScript 5](https://img.shields.io/badge/ECMAScript_5-unsupport-red.svg) ![TamperMonkey 4.10](https://img.shields.io/badge/TamperMonkey_4.10-pass-green.svg) ![Chromium 83](https://img.shields.io/badge/Chromium_83-pass-green.svg) ![Firefox 77](https://img.shields.io/badge/Firefox_77-pass-green.svg)  

### 点击以下任一链接安装脚本
### 1.github源：[Bilibili-SGTH_1](https://github.com/andywang425/Bilibili-SGTH/raw/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)  
### 2.githubusercontent源：[Bilibili-SGTH_2](https://raw.githubusercontent.com/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)  
### 3.cnpmjs源：[Bilibili-SGTH_3](https://github.com.cnpmjs.org/andywang425/Bilibili-SGTH/raw/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)  
### 4.gitcdn源：[Bilibili-SGTH_4](https://gitcdn.xyz/repo/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)  
### 5.jsdelivr源：[Bilibili-SGTH_5](https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)    
_(3，4，5访问快但可能不是最新版)_  
<details>
<summary>展开查看旧版链接</summary>  

### v3.3 —— 最后一个不使用GM函数的版本  
#### github源：[Bilibili-SGTH_old_1](https://github.com/andywang425/Bilibili-SGTH/raw/v1.2.1/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)  
#### jsdelivr源：[Bilibili-SGTH_old_2](https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH@1.2.1/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)  
</details>

>感谢SeaLoong的BilibiliAPI v1.4.6。本脚本使用的BilibiliAPI_Mod为在此基础上的修改版。  

#### 使用方法 
在油猴中启用脚本，登陆bilibili后打开任意b站直播间。  
#### 一些建议
不建议24小时挂着脚本，容易进小黑屋。勾选低调设置可以降低进小黑屋概率。  
启用脚本后不要去抢小时榜房间和广播的礼物，重复抢次数多了会进小黑屋。  
_注：这里的小黑屋并非主站的小黑屋，是指被b站风控限制抽奖，领银瓜子宝箱等，与主站无关。_  
如果开启抽奖附加延迟，可能出现领不到礼物的情况，请降低或取消延迟。  
**部分设置更改后需要刷新页面才能生效。**  
**使用前建议先关闭广告拦截插件，并确认相关浏览器设置(如cookie权限，脚本拦截)否则该脚本可能无法正常运行。**  
#### 其它信息
这个项目的部分代码来源于以下几个项目:
+ [B站直播自动抢辣条二代by十六夜](https://greasyfork.org/en/scripts/381907-b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1%E4%BA%8C%E4%BB%A3by%E5%8D%81%E5%85%AD%E5%A4%9C) by [十六夜](https://greasyfork.org/en/users/289469-%E5%8D%81%E5%85%AD%E5%A4%9C)
+ [Bilibili-LRHH](https://github.com/SeaLoong/Bilibili-LRHH) by [SeaLoong](https://github.com/SeaLoong)  
+ [Bilibili-LRHH](https://github.com/pjy612/Bilibili-LRHH) by [pjy612](https://github.com/pjy612)
+ [TampermonkeyJS](https://github.com/lzghzr/TampermonkeyJS) by [lzghzr](https://github.com/lzghzr)  

本脚本使用的库：
+ [BilibiliAPI_Mod](https://github.com/andywang425/Bilibili-SGTH/blob/master/BilibiliAPI_Mod.js)：B站API及常用函数。  
+ [OCRAD](https://github.com/antimatter15/ocrad.js)：用于识别领银瓜子宝箱验证码。  
+ [libBilibiliToken](https://github.com/lzghzr/TampermonkeyJS/blob/master/BiliveClientHeart/BiliveClientHeart.user.js)：获取移动端token。  

我的b站id:[Andy425](https://space.bilibili.com/358483030)  
辣条交流群:[1106094437](https://jq.qq.com/?_wv=1027&k=fCSfWf1O)，欢迎进来聊天或者提点建议~  
_如果有什么建议可以给我提Issues或在b站私信我，我会试着改进~_  
## 功能细节 

_脚本窗口可以上下滚动！部分设置可能需要滚动后才能看到。_  
+ 抽奖前随机延迟  
+ 特定时段不参与抽奖  
+ 随机跳过抽奖  
+ 能设置当天最多抢辣条数量  
+ 抽奖前模拟进入目标房间  
+ 抽奖前概率发送活跃弹幕（防检测）  
+ 点击**直播画面上方**按钮隐藏/显示脚本窗口和抽奖信息  
+ 进入小黑屋后强制重复抽奖直到成功，最多尝试5次  
+ 屏蔽不必要的页面元素防止遮挡界面或按钮（目前有2233模型，端午活动入口）  
+ 定时刷新直播间  
+ 自动完成每日任务  
   1.登陆主站  
   2.观看视频  
   3.自动投币  
   4.分享视频  
   5.银瓜子换硬币  
   6.直播区签到  
   7.应援团签到  
   8.自动领银瓜子宝箱   
   9.自动送礼  
   10.模拟移动端心跳，领双端观看直播奖励  

以上功能涉及参数可自定义，所有输入的数据必须为数字或数组。  
## 说明
**关于脚本代码格式**  
默认安装的[B站直播自动抢辣条.user.js](https://github.com/andywang425/Bilibili-SGTH/blob/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js)是压缩后的脚本。  
原格式的脚本为[B站直播自动抢辣条.js](https://github.com/andywang425/Bilibili-SGTH/blob/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.js)。  
**关于输入数据格式**  
+ 浮点数(小数)或整数: 抽奖前附加随机延迟，随机跳过礼物，抽奖时概率发送活跃弹幕。  
+ 数组(或单个整数): 优先送礼房间。  
+ 其余只支持整数。  

**关于自动送礼**  
+ 自动送礼目前只会送出辣条和亿圆。  
+ 如果要填写多个优先送礼房间，每个房间号之间需用半角逗号,隔开。如 666,777,888 (其实就是数组的格式)。为0则不送。若不勾选送礼优先高等级粉丝牌则优先送低等级粉丝牌。  
+ 礼物到期时间: 将要在这个时间段里过期的礼物会被送出(勾选送满全部勋章时无论是否将要过期都会被送出)。  
+ 送礼设置优先级:  
  优先送礼房间>优先高等级粉丝牌>送满全部勋章。  
+ 送礼设置逻辑规则:  
  无论【优先高等级粉丝牌】如何设置，会根据【送满全部勋章】（勾选则无视是否到期补满亲密度，否则只送到期的）条件去按优先送礼房间先后顺序送礼。  
  之后根据【优先高等级粉丝牌】决定先送高级还是低级（勾选先高级，不勾选先低级）。  
  1. 如果勾选了送满全部勋章且指定优先送礼房间，会先按顺序依次给优先送礼房间送礼（前提是你得有优先房间的粉丝勋章），无视礼物过期时间。之后若勾选了优先高等级粉丝牌，则按等级由高到低给剩余粉丝牌送礼。否则按等级由低到等高给剩余粉丝牌送礼。
  2. 如果未勾选送满全部勋章但指定了优先送礼房间，那么会先给优先送礼房间送出即将过期礼物（前提是你得有优先房间的粉丝勋章）。然后若勾选了优先高等级粉丝牌，则给剩下粉丝勋章中等级由高到低的牌子送出即将过期礼物。否则按等级由低到高给剩余粉丝牌送出即将过期礼物。  
+ 【剩余礼物】指送完了所有粉丝牌，但仍有剩余的将在1天内过期的礼物。会在指定送礼时间被送出。  
+ 【剩余礼物送礼直播间】和【剩余礼物送礼直播间拥有者UID】必须对应。任意一项填0则不送剩余礼物。  

**关于任务执行时间**  
+ 初次启用某一项任务时立刻执行。  
+ 登陆主站，观看视频，自动投币，分享视频，银瓜子换硬币，领银瓜子宝箱，直播区签到每日凌晨0点1分时时执行。  
+ 应援团签到在你上一次使用脚本签到的24小时后执行。  

**关于节奏风暴**  
+ 仅会参加被广播的节奏风暴。  
+ 这个功能目前处于实验阶段，且风险较大。如有问题可以进行反馈。  

**其它设置说明**  
+ 定时重载直播间是为了防止脚本因长时间运行出现bug。  
+ 重置所有为默认：指将设置和任务执行时间缓存重置为默认。  
+ 再次执行每日任务会使相关缓存重置为默认，会影响下次应援团签到时间。若脚本运行正常则无需点击此按钮。  
+ 抽奖前随机延时能把抽奖分散开来，避免短时间内抽奖次数过多被风控。  
+ 成功领取双端观看直播奖励后，移动端心跳会停止。  

**关于运行日志**  
脚本默认开启运行日志，打开控制台在Filter中输入`IGIFTMSG`即可过滤出本脚本的日志。若想关闭日志可以在脚本头部加入`console.log = () => {}`。  
如果使用脚本过程中遇到问题，可以在控制台中寻找相关错误信息。若无法解决可以提issue，并给出错误信息和问题描述。  

**关于反馈**  
反馈前请先阅读[bug_report.md](https://github.com/andywang425/Bilibili-SGTH/blob/master/bug_report.md)。不符合规范的反馈可能会被关闭。  
## 许可证  
![MIT License](https://img.shields.io/badge/license-MIT-green)  

## 更新日志
>### 3.5.3
>修复火狐特有的一个关于正则表达式的bug。现在支持火狐啦~  
>### 3.5.2
>现在可以检查所有分区的小时榜，能参与的抽奖数量大幅增加。  
>### 3.5.1
>修复读取统计错误的bug；修复开启不抽奖时段不刷新直播间后导致的不会刷新页面的bug；尝试修复多次调用info接口导致大会员被封的问题；不再使用GM_getValue和GM_setValue两个GM函数。  
>### 3.5
>新增节奏风暴抽奖功能；由于设置太多，现在界面可以上下滚动。重置统计时间更精准，误差在1秒内。  
>### 3.4
>支持模拟移动端心跳，领双端观看直播奖励。  
>### 3.3
>增加剩余礼物送礼功能。修复了包裹内无可送礼物时送礼导致的bug。聊天区提示及控制台日志优化。  
>### 3.2.1
>活跃弹幕池修改；领银瓜子宝箱初始化时间滞后；部分输入支持浮点数  
>### 3.2  
>运行日志优化，显示时间；定时送礼模块算法优化，更加精确，增加手动立刻送礼功能；再次执行每日任务，重置统计，不会刷新页面；bug fix  
>### 3.1.1  
>bug fix  
>### 3.1  
>支持自定义送礼时间，取消送礼检查间隔选项。脚本会在指定的一分钟内集中送礼。  
>### 3.0.1  
>补充脚本内说明;界面调整;更新源换为jsdelivr。 
>### 3.0  
>增加自动送礼功能;界面调整，增加脚本内简要说明。
>### 2.6.1  
>修复检查小时榜的bug
>### 2.6  
>银瓜子宝箱验证码识别模块优化，提高验证码识别准确率；修复点击显示/隐藏按钮后聊天信息滚动问题；脚本内置检查更新源换为github;支持自定义检查小时榜间隔
>### 2.5.7  
>移除不必要的页面元素，防止遮挡按钮;细节调整
>### 2.5.6  
>日常修bug，解决了动态中无视频时分享视频引起的错误；界面微调。
>### 2.5.5  
>修复一些bug；运行日志更加详细；优化了重复运行检测，减少性能消耗。  
>### 2.5.4  
>考虑到有时候油猴检查更新功能会失效，增加检查脚本更新的按钮  
>### 2.5.3  
>解决了禁止重复运行方面的bug；转移脚本到GitHub  
>### 2.5.2  
>界面调整：保存按钮变为全局，重新加入重置统计按钮  
>### 2.5.1  
>增加银瓜子换硬币功能;界面细节优化。  
_中间一段日志丢失_  
>### 2.2  
>加入选项：进黑屋后强制重复抽奖直到成功，最多重试5次(危险)；CACHE优化  
>### 2.1.3  
>重复运行检测，在一个直播间启用脚本后打开其它直播间不会运行此脚本。  
>### 2.1.2  
>播放器为flash时不自动切换为html播放器  
>### 2.1.1  
>应援团签到细节优化  
>### 2.1  
>增加自动应援团签到功能;修复了SC会遮挡弹幕区上方按钮的bug;活跃弹幕池修改,去除无意义的句号和空格改为表情;限制活跃弹幕发送概率必须小于5%  
>### 2.0.2  
>API源调整,为之后更新做准备  
>### 2.0  
>新功能:抽奖前有概率在目标房间发送一条活跃弹幕(概率别调太高，b站限制每秒只能发一条弹幕);jQuery换源，用BilibiliAPI_Mod(自制API，已压缩)代替原SeaLoogn大佬的BilibiliAPI,包含更多B站API及函数(已压缩，加载更快);本脚本也已压缩，提高载入速度;修复部分时段不抽奖输入框写入非常规时间段时脚本无法正确执行的bug，并增加分钟选项，更加精确(3分钟一检测，所以实际会有一点误差);细节上的改进;  
>### 1.8  
>每次抽奖前抽奖模拟一次进入直播间的动作，防检测(所以会产生很多观看历史记录);重新加入亲密度统计(暂时没用);加入银瓜子统计;优化辣条上限检测方法。  
>### 1.7.2  
>现在上船奖励变为辣条，不再统计亲密度;再次优化了抽奖信息滚动。  
>### 1.7.1  
>解决了弹幕聊天记录和抽奖信息滚动异常的问题;修复了一个按钮的css样式;添加一个脚本图标(辣条)。  
>### 1.7  
>礼物信息保存到浏览器缓存，出现重复领取的现象大大降低。修复了开启延时会无法抽奖的bug。  
>### 1.6  
>更新css样式,窗口更好看了。  
>### 1.5.3  
>随机延迟算法优化：随机延时包括最大和最小值;最大最小值相同时延时固定。  
>### 1.5.2  
>增加选项:不抽奖时不重载直播间；左下角显示版本号。  
_更早的日志就不显示了~_
