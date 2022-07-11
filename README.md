<p align ="center"><img src="https://fastly.jsdelivr.net/gh/andywang425/BLTH@7d7ca494edd314806460e24c6b59be8ae1bd7dc6/img/script-icon.png"></p>
<p align="center"><img src="https://img.shields.io/badge/TamperMonkey_4.12-pass-green.svg" alt="TamperMonkey 4.12"> <img src="https://img.shields.io/badge/Violentmonkey_2.12.14-pass-green.svg" alt="Violentmonkey 2.12.14"> <a href="https://github.com/andywang425/BLTH/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"> <a href="https://jq.qq.com/?_wv=1027&k=fCSfWf1O"> <a href="https://github.com/andywang425/BLTH/stargazers"><img src="https://img.shields.io/github/stars/andywang425/BLTH?style=flat" alt="Stars"></a> <a href="https://github.com/andywang425/BLTH/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/andywang425/BLTH"></a></p>
<p align="center"><a href="https://jq.qq.com/?_wv=1027&k=9refOc8c"><img src="https://img.shields.io/badge/QQ%20Group-657763329-yellow" alt="QQ Group"></a></p>
<h1 align="center">B站直播间挂机助手</h1>

### 安装方法

### 1. 点击 [BLTH_github](https://raw.githubusercontent.com/andywang425/BLTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js) 从 github 安装脚本

### 2. 点击 [BLTH_greasyfork](https://greasyfork.org/zh-CN/scripts/406048-b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B) 前往 [greasyfork](https://greasyfork.org) 安装脚本

### 3. 点击 [BLTH_openuserjs](https://openuserjs.org/scripts/andywang425/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B) 前往 [openuserjs](https://openuserjs.org) 安装脚本

---

## 使用方法

在 [Tampermonkey](https://www.tampermonkey.net) / [Violentmonkey](https://violentmonkey.github.io) 中启用脚本，登陆 bilibili 后打开任意 b 站直播间。

- 点击**直播画面上方**按钮或者按快捷键`alt + b`隐藏/显示脚本窗口。显示日志窗口的按钮位于**右侧聊天栏上方**。
- 在 Tampermonkey 脚本设置中需要将此脚本的设置 “仅在顶层页面（框架）运行” 设置为否(默认为否)才使脚本在特殊直播间运行。
- 不保证能通过其它油猴插件(如 Greasemonkey)运行。

---

## 一些建议

- 请确保能正常访问 `fastly.jsdelivr.net` 这个网站，脚本每次安装后初次运行时会从该网站获取依赖。[可以点我](https://fastly.jsdelivr.net/npm/lodash@4.17.10/core.min.js)测试你能否正常访问。若不能，请在脚本每次安装后初次运行时想办法让依赖被获取到，之后即可正常使用。
- 初次使用时若出现看不到控制面板的情况，请等待一会或尝试刷新(`ctrl+F5`)页面。
- 部分设置更改后需要刷新页面才能生效。
- 使用前建议先关闭广告拦截插件，并确认相关浏览器设置(如 cookie 权限，脚本拦截)否则该脚本可能无法正常运行。
- 修改脚本设置前，如果该设置后面有蓝色小问号，请点击小问号查看说明再修改。
- **如果因使用脚本而产生了某些问题，请向本项目的开发者反馈，而不是去打扰 B 站客服，谢谢。**

---

# 功能细节

<li>快捷购买粉丝勋章</li>
<li>发弹幕前自动佩戴当前直播间的粉丝勋章</li>
<li>隐身入场</li><br>
以及其他能优化直播观看体验的功能。

---

# 说明

### 脚本代码格式

本脚本在三个平台上的代码格式有所不同

<table>
    <tr>
        <td align ="center">平台 / 格式</td>
        <td align ="center">原格式</td>
        <td align ="center">压缩</td>
    </tr>
    <tr>
        <td align ="center">github</td>
        <td align ="center">✔</td>
        <td align ="center">✔</td>
    </tr>
    <tr>
        <td align ="center">greasyfork</td>
        <td align ="center">✔</td>
        <td align ="center">/</td>
    </tr>
    <tr>
        <td align ="center">openuserjs</td>
        <td align ="center">✔</td>
        <td align ="center">/</td>
    </tr>
</table>

### 脚本内置说明

运行脚本后点击控制面板上带下划线的小问号查看各项功能的具体说明。

### 运行日志

运行日志分普通日志和控制台日志两种。

#### 普通日志

- 可以点击聊天区上方，大航海右侧的【日志】查看普通日志。部分日志上会有可点击的蓝色链接文字，方便完成某些操作。

#### 控制台日志

- 打开控制台(Chrome 可以按`F12`或`ctrl + shift + i`，再点击`Console`)在 Filter 中输入`BLTH`即可过滤出本脚本的控制台日志。  
  _注：某些意料之外的报错不会带有`BLTH`字样，反馈 bug 时请多加注意。_
- 脚本默认关闭控制台日志。勾选控制面板上的`其他设置 - 控制台日志`即可开启。

### 关于反馈

- 如果使用脚本过程中遇到问题，可以先按上述步骤[开启控制台日志](#控制台日志)，然后关掉无关功能再次运行脚本并在控制台中寻找相关错误信息。若能找到请在反馈 bug 时附上这些控制台日志。
- 反馈 bug 请点击[bug_report](https://github.com/andywang425/BLTH/issues/new?assignees=dong-jpg&labels=bug&template=bug_report.yaml)。
- 交流 qq 群：[657763329](https://jq.qq.com/?_wv=1027&k=9refOc8c)。欢迎进来聊天或者提点建议~

---

## 已知问题

1. [#12](https://github.com/andywang425/BLTH/issues/12)  
   本脚本可能与[Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)存在兼容性问题导致脚本窗口无法正确加载。若出现此问题，请尝试在 Bilibili-Evolved 设置-其它中，将`加载模式`设置为延后。  
   开启`简化直播间`功能后聊天栏顶部的日志文字无法正确地被隐藏/显示成黄色，不过不影响使用。
2. 脚本每次更新后第一次运行可能会不工作，`shift+F5`刷新一下页面即可。
3. 可能和[SteamWebIntegration](https://github.com/Revadike/SteamWebIntegration)存在冲突导致同时运行时页面无响应。可以在 SteamWebIntegration 的设置中把 B 站直播间添加到黑名单。
4. 如果无论怎么刷新页面脚本都不工作，可以先关闭油猴，刷新页面，然后再打开油猴，再等一小段时间看看脚本能否加载出来。也可以试试直接重启电脑。

---

## 参与开发

如果你想参与到本项目的开发中来，请阅读[开发规范](https://github.com/andywang425/BLTH/blob/master/CONTRIBUTING.md)。

---

# 许可证

本项目以`MIT`许可证开源。

<a href="https://github.com/andywang425/BLTH/blob/master/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/andywang425/BLTH?style=for-the-badge"></a>

---

# 其它信息

这个项目的部分代码来源于以下几个项目:

- [B 站直播签到助手](https://wwa.lanzoui.com/iLjOmkfuvxe) (MIT) by [十六夜](https://space.bilibili.com/4317450)
- [BLRHH](https://github.com/SeaLoong/BLRHH) (MIT) by [SeaLoong](https://github.com/SeaLoong)
- [Bilibili-LRHH](https://github.com/pjy612/Bilibili-LRHH) (MIT, _forked from SeaLoong/BLRHH_) by [pjy612](https://github.com/pjy612)
- [TampermonkeyJS](https://github.com/lzghzr/TampermonkeyJS) (MIT) by [lzghzr](https://github.com/lzghzr)
- [layer](https://github.com/sentsin/layer) (MIT) by [sentsin](https://github.com/sentsin)
- [Ajax-hook](https://github.com/wendux/Ajax-hook) (MIT) by [wendux](https://github.com/wendux)
- [bliveproxy](https://github.com/xfgryujk/bliveproxy) (MIT) by [xfgryujk](https://github.com/xfgryujk)
- [brotli](https://github.com/google/brotli) (MIT) by [google](https://github.com/google)
- [哔哩猫](https://greasyfork.org/zh-CN/scripts/422731) (MIT) by [荒年](https://gitee.com/java_cn)

本脚本使用的库：

- [jQuery](https://github.com/jquery/jquery) (MIT)
- [BilibiliAPI_Mod](https://github.com/andywang425/BLTH/blob/master/assets/js/library/BilibiliAPI_Mod.js) (MIT)：各种 B 站 API。
- [crypto-js](https://github.com/brix/crypto-js) (MIT)：crypto 标准的 JavaScript 库。
- [layer](https://github.com/sentsin/layer/blob/master/dist/layer.js) (MIT)：web 弹层组件。
- [Ajax-hook](https://github.com/wendux/Ajax-hook) (MIT)：用于拦截浏览器 XMLHttpRequest 的库。
- [bliveproxy](https://github.com/xfgryujk/bliveproxy/blob/master/bliveproxy.user.js) (MIT)：B 站直播 websocket hook 框架。
- [pako](https://github.com/nodeca/pako) (MIT)：javascript 压缩/解压缩库。
- [decode](https://github.com/google/brotli/blob/master/js/decode.js) (MIT)：brotli 项目中的 javascript 解码库。
- [hotkeys](https://github.com/jaywcjlove/hotkeys) (MIT)：一个强健的 Javascript 库，用于捕获键盘输入和输入的组合键。
- [emitter](https://github.com/component/emitter) (MIT): 事件触发器组件。
- [DanmuWebSocket](https://github.com/andywang425/BLTH/blob/master/assets/js/library/DanmuWebSocket.js) (MIT)：B 站直播 Websocket 弹幕库。
- [BiliveHeart](https://github.com/lzghzr/TampermonkeyJS/blob/master/BiliveHeart/BiliveHeart.user.js) (MIT)：B 站直播心跳库。

本脚本引用的外部资源：

- [layer.css](https://github.com/sentsin/layer/blob/master/dist/theme/default/layer.css)：layer.js 的内置样式。
- [myCss.css](https://github.com/andywang425/BLTH/blob/master/assets/css/myCss.css)：脚本样式。
- [main.html](https://github.com/andywang425/BLTH/blob/master/assets/html/main.html)：脚本控制面板的 html。
- [eula.html](https://github.com/andywang425/BLTH/blob/master/assets/html/eula.html)：最终用户许可协议。

---

## 鸣谢

- [十六夜](https://greasyfork.org/en/users/289469-%E5%8D%81%E5%85%AD%E5%A4%9C)：本脚本初期大部分代码都来自于十六夜。
- [SeaLoong](https://github.com/SeaLoong)：参考了部分功能实现；B 站 API 库的原作者。
- [pjy612](https://github.com/pjy612)：参考了部分功能实现。
- [lzghzr](https://github.com/lzghzr)：提供了油猴脚本的小心心 heartbeat 解决方案。
- [sentsin](https://github.com/sentsin)：弹出层组件库作者。
- [wendux](https://github.com/wendux)：ajax 拦截库作者。
- [风绫丨钰袖](https://space.bilibili.com/20842051)：参考了部分功能实现。
- [Server 酱](https://sct.ftqq.com)，[推送加](https://pushplus.plus)：本脚本使用的微信推送平台。
- [酷推](https://cp.xuthus.cc)：本脚本曾经使用的 qq 推送平台。
- [无尾玦的小尾巴](https://space.bilibili.com/234368216)：贡献了一个舰长账号。
- [冰冰羊](https://space.bilibili.com/261593393)：q 群内新手使用教程和屏蔽词库的作者。
- [xfgryujk](https://github.com/xfgryujk)：B 站直播 websocket hook 框架作者。
- [spiritLHL](https://github.com/spiritLHL)：协助搭建本脚本的私有化 qq 推送平台。
- [荒年](https://gitee.com/java_cn)：参考了部分功能实现；提供了本脚本运行所需的部分数据。
- [dong-jpg](https://github.com/dong-jpg)：帮忙回答 issue；BLTH-server 的运维。

以及所有参与本项目开发的朋友和提出过建议的用户。

---

# 更新日志

完整更新日志见[update-log.md](https://github.com/andywang425/BLTH/blob/master/assets/markdown/update-log.md)。

---

# 相关推荐

### Bilibili 一键已读

作者：[CKylinMC](https://github.com/CKylinMC)

- [Github](https://github.com/CKylinMC/UserJS/blob/main/scripts/ckylin-script-bilibili-mark-as-read.user.js)
- [GreasyFork](https://greasyfork.org/zh-CN/scripts/429152-bilibili-markasread)

一键标记所有哔哩哔哩私信会话已读！

### Bilibili-Evolved

作者：[the1812](https://github.com/the1812)

- [Github](https://github.com/the1812/Bilibili-Evolved)

强大的哔哩哔哩增强脚本: 下载视频, 音乐, 封面, 弹幕 / 简化直播间, 评论区, 首页 / 自定义顶栏, 删除广告, 夜间模式 / 触屏设备支持。

### bilibili 直播净化

作者：[lzghzr](https://github.com/lzghzr)

- [Github](https://github.com/lzghzr/TampermonkeyJS/blob/master/BiLiveNoVIP/BiLiveNoVIP.user.js)
- [GreasyFork](https://greasyfork.org/zh-CN/scripts/21416-bilibili%E7%9B%B4%E6%92%AD%E5%87%80%E5%8C%96)

屏蔽聊天室礼物以及关键字，净化聊天室环境。

### 新 B 站粉丝牌助手

作者：[一心向晚](https://github.com/XiaoMiku01)

- [Github](https://github.com/XiaoMiku01/fansMedalHelper)

Python 项目：自动完成直播区签到，点赞 ，分享，弹幕打卡，观看 30 分钟等任务。
