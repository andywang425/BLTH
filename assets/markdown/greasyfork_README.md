<p><img src="https://cdn.jsdelivr.net/gh/andywang425/BLTH@7d7ca494edd314806460e24c6b59be8ae1bd7dc6/img/script-icon.png"><h1>B站直播间挂机助手</h1></p>
<p><img src="https://img.shields.io/badge/TamperMonkey_4.12-pass-green.svg" alt="TamperMonkey 4.12"> <img src="https://img.shields.io/badge/Violentmonkey_2.12.14-pass-green.svg" alt="Violentmonkey 2.12.14"> <a href="https://github.com/andywang425/BLTH/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a></p>
<p><img src="https://palerock.cn/node-service/images/greasyfork/views-info/406048" alt="Total Views"> <img src="https://palerock.cn/node-service/images/greasyfork/stats/total-installs/406048" alt="Total Installs"> <img src="https://palerock.cn/node-service/images/greasyfork/stats/daily-installs/406048" alt="Daily Installs"> <img src="https://palerock.cn/node-service/images/greasyfork/stats/daily-updates/406048" alt="Daily Updates"> <img src="https://palerock.cn/node-service/images/greasyfork/info/good_ratings/406048?name=%E5%A5%BD%E8%AF%84&amp;rcolor=darkcyan" alt="Good Ratings"> <img src="https://palerock.cn/node-service/images/greasyfork/info/fan_score/406048?name=%E5%BE%97%E5%88%86&amp;rcolor=orange" alt="Rating"></p>
<p><a href="https://jq.qq.com/?_wv=1027&k=fCSfWf1O"><img src="https://img.shields.io/badge/QQ%20Group-1106094437-yellow" alt="QQ Group"></a></p>

-------------------------------
### github项目地址
[github.com/andywang425/BLTH](https://github.com/andywang425/BLTH)
&nbsp;<a href="https://github.com/andywang425/BLTH/stargazers"><img src="https://img.shields.io/github/stars/andywang425/BLTH?style=flat" alt="Github stars"></a> <a href="https://github.com/andywang425/BLTH/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/andywang425/BLTH"></a>

## 使用方法 
在 [Tampermonkey](https://www.tampermonkey.net) / [Violentmonkey](https://violentmonkey.github.io) 中启用脚本，登陆bilibili后打开任意b站直播间。 
+ 在 Tampermonkey 脚本设置中需要将此脚本的设置 “仅在顶层页面（框架）运行” 设置为否(默认为否)才使脚本在特殊直播间运行。  
+ 不保证能通过其它油猴插件(如Greasemonkey)运行。  

-------------------------------

## 一些建议
+ 初次使用时若出现看不到控制面板的情况，请等待一会或尝试刷新(`shift+F5`)页面。  
+ 部分设置更改后需要刷新页面才能生效。  
+ 使用前建议先关闭广告拦截插件，并确认相关浏览器设置(如cookie权限，脚本拦截)否则该脚本可能无法正常运行。  
+ **如果因使用脚本而产生了某些问题，请向本项目的开发者反馈，而不是去打扰B站客服，谢谢。**

-------------------------------

# 功能细节 

脚本窗口可以上下滚动！部分设置可能需要滚动后才能看到。
点击**直播画面上方**按钮隐藏/显示脚本窗口和提示信息。    

<li>快捷购买粉丝勋章</li>
<li>发弹幕前自动佩戴当前直播间的粉丝勋章</li>
<li>隐身入场</li><br>
以及其他能优化直播观看体验的功能。

-------------------------------

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
+ 可以点击聊天区上方，大航海右侧的【日志】查看普通日志。部分日志上会有可点击的蓝色链接文字，方便完成某些操作。

#### 控制台日志
+ 打开控制台(Chrome可以按`F12`或`ctrl + shift + i`，再点击`Console`)在Filter中输入`BLTH`即可过滤出本脚本的控制台日志。  
  *注：某些意料之外的报错不会带有`BLTH`字样，反馈 bug 时请多加注意。*
+ 脚本默认关闭控制台日志。勾选控制面板上的`其他设置 - 控制台日志`即可开启。  


### 关于反馈
+ 如果使用脚本过程中遇到问题，可以先按上述步骤[开启控制台日志](#控制台日志)，然后关掉无关功能再次运行脚本并在控制台中寻找相关错误信息。若能找到请在反馈bug时附上这些控制台日志。
+ 反馈bug前请先阅读[bug_report.md](https://github.com/andywang425/BLTH/blob/master/.github/ISSUE_TEMPLATE/bug_report.md)。
+ 交流qq群：①群：[1106094437](https://jq.qq.com/?_wv=1027&k=fCSfWf1O)。欢迎进来聊天或者提点建议~    

-------------------------------

## 已知问题
1. [#12](https://github.com/andywang425/BLTH/issues/12)  
本脚本可能与[Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)存在兼容性问题导致脚本窗口无法正确加载。若出现此问题，请尝试在Bilibili-Evolved设置-其它中，将`加载模式`设置为延后。  
开启`简化直播间`功能后聊天栏顶部的日志文字无法正确地被隐藏/显示成黄色，不过不影响使用。
2. 脚本每次更新后第一次运行可能会不工作，`shift+F5`刷新一下页面即可。  
3. 可能和[SteamWebIntegration](https://github.com/Revadike/SteamWebIntegration)存在冲突导致同时运行时页面无响应。可以在SteamWebIntegration的设置中把B站直播间添加到黑名单。 
4. 如果无论怎么刷新页面脚本都不工作，可以先关闭油猴，刷新页面，然后再打开油猴，再等一小段时间看看脚本能否加载出来。也可以试试直接重启电脑。

-------------------------------

# 许可证
本项目以`MIT`许可证开源。  

<a href="https://github.com/andywang425/BLTH/blob/master/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/andywang425/BLTH?style=for-the-badge"></a>

-------------------------------

# 其它信息  
这个项目的部分代码来源于以下几个项目:  
+ [B站直播签到助手](https://wwa.lanzous.com/iLjOmkfuvxe) (MIT) by [十六夜](https://space.bilibili.com/4317450)
+ [BLRHH](https://github.com/SeaLoong/BLRHH) (MIT) by [SeaLoong](https://github.com/SeaLoong)
+ [Bilibili-LRHH](https://github.com/pjy612/Bilibili-LRHH) (MIT, _forked from SeaLoong/BLRHH_) by [pjy612](https://github.com/pjy612)
+ [TampermonkeyJS](https://github.com/lzghzr/TampermonkeyJS) (MIT) by [lzghzr](https://github.com/lzghzr)
+ [layer](https://github.com/sentsin/layer) (MIT) by [sentsin](https://github.com/sentsin)
+ [Ajax-hook](https://github.com/wendux/Ajax-hook) (MIT) by [wendux](https://github.com/wendux)
+ [bliveproxy](https://github.com/xfgryujk/bliveproxy) (MIT) by [xfgryujk](https://github.com/xfgryujk)
+ [brotli](https://github.com/google/brotli) (MIT) by [google](https://github.com/google)

本脚本使用的库：  
+ [jQuery](https://github.com/jquery/jquery) (MIT)  
+ [BilibiliAPI_Mod](https://github.com/andywang425/BLTH/blob/master/assets/js/library/BilibiliAPI_Mod.js) (MIT)：各种B站API。
+ [libBilibiliToken](https://github.com/lzghzr/TampermonkeyJS/blob/master/libBilibiliToken/libBilibiliToken.js) (MIT)：获取移动端token。
+ [libWasmHash](https://github.com/lzghzr/TampermonkeyJS/blob/master/libWasmHash/libWasmHash.js) (MIT)：WebAssembly实现的Hash，计算心跳请求参数。
+ [layer](https://github.com/sentsin/layer/blob/master/dist/layer.js) (MIT)：web弹层组件。
+ [Ajax-hook](https://github.com/wendux/Ajax-hook) (MIT)：用于拦截浏览器XMLHttpRequest的库。
+ [bliveproxy](https://github.com/xfgryujk/bliveproxy/blob/master/bliveproxy.user.js) (MIT)：B站直播websocket hook框架。
+ [pako](https://github.com/nodeca/pako) (MIT)：javascript压缩/解压缩库。
+ [decode](https://github.com/google/brotli/blob/master/js/decode.js) (MIT)：brotli项目中的javascript解码库。

本脚本引用的外部资源：  
+ [layer.css](https://github.com/sentsin/layer/blob/master/dist/theme/default/layer.css)：layer.js的内置样式。
+ [myCss.css](https://github.com/andywang425/BLTH/blob/master/assets/css/myCss.css)：脚本样式。
+ [main.html](https://github.com/andywang425/BLTH/blob/master/assets/html/main.html)：脚本控制面板的html。
+ [eula.html](https://github.com/andywang425/BLTH/blob/master/assets/html/eula.html)：最终用户许可协议。

-------------------------------

## 鸣谢
[十六夜](https://greasyfork.org/en/users/289469-%E5%8D%81%E5%85%AD%E5%A4%9C)，[SeaLoong](https://github.com/SeaLoong)，[pjy612](https://github.com/pjy612)，[lzghzr](https://github.com/lzghzr)，[sentsin](https://github.com/sentsin)，[wendux](https://github.com/wendux)，[风绫丨钰袖](https://space.bilibili.com/20842051)，[Server酱](https://sc.ftqq.com)，[无尾玦的小尾巴](https://space.bilibili.com/234368216)，[酷推](https://cp.xuthus.cc)，[冰冰羊](https://space.bilibili.com/261593393)，[xfgryujk](https://github.com/xfgryujk)，[推送加](https://pushplus.plus)，[spiritLHL](https://github.com/spiritLHL)  
以及所有提出过建议的用户。

-------------------------------

# 更新日志

完整更新日志见[update-log.md](https://github.com/andywang425/BLTH/blob/master/assets/markdown/update-log.md)。  

-------------------------------

# 相关推荐

### Bilibili 一键已读
作者：[CKylinMC](https://github.com/CKylinMC)
+ [Github](https://github.com/CKylinMC/UserJS/blob/main/scripts/ckylin-script-bilibili-mark-as-read.user.js)
+ [GreasyFork](https://greasyfork.org/zh-CN/scripts/429152-bilibili-markasread)  

一键标记所有哔哩哔哩私信会话已读！

### Bilibili-Evolved
作者：[the1812](https://github.com/the1812)
+ [Github](https://github.com/the1812/Bilibili-Evolved)  

强大的哔哩哔哩增强脚本: 下载视频, 音乐, 封面, 弹幕 / 简化直播间, 评论区, 首页 / 自定义顶栏, 删除广告, 夜间模式 / 触屏设备支持。

### bilibili直播净化
作者：[lzghzr](https://github.com/lzghzr)
+ [Github](https://github.com/lzghzr/TampermonkeyJS/raw/master/BiLiveNoVIP/BiLiveNoVIP.user.js)
+ [GreasyFork](https://greasyfork.org/zh-CN/scripts/21416-bilibili%E7%9B%B4%E6%92%AD%E5%87%80%E5%8C%96)  

屏蔽聊天室礼物以及关键字，净化聊天室环境。
