<div align = "center">
    <img alt="BLTH logo" src="https://raw.githubusercontent.com/andywang425/BLTH/master/images/logo.min.svg" width="150">
</div>

<h1 align = "center">Bilibili Live Tasks Helper</h1>

# 环境要求

- 浏览器：推荐使用 Chrome, Edge, Firefox, Safari 或 Opera。
- 用户脚本管理器：推荐使用 [Tampermonkey](https://www.tampermonkey.net) 或 [Violentmonkey](https://violentmonkey.github.io)。

# 安装

请先阅读[最终用户许可协议](https://github.com/andywang425/BLTH/blob/master/EULA.md)。

点击下方表格中的任一链接即可从你喜欢的源安装脚本：

| Github min（推荐）                                                                                            | Github                                                                                                    | GreasyFork                                                                         |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [安装](https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.min.user.js) | [安装](https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.user.js) | [前往安装](https://greasyfork.org/zh-CN/scripts/406048-bilibili-live-tasks-helper) |

- Github min: Github 源，代码经过压缩，运行效率最高。以后脚本也会从 Github 更新（可能存在网络问题）。
- Github: 同上，唯一的区别是代码没经过压缩。而且更新后代码会变成压缩的。

如果你是在 GreasyFork 上看到的这份说明，请忽略以上链接，直接点击 GreasyFork 给出的安装按钮即可。

# 使用

在用户脚本管理器中启用脚本，登陆 bilibili 后打开任意 b 站直播间。如果一切正常你将在直播画面左侧找到一个[控制面板](https://github.com/andywang425/BLTH/blob/master/images/example.png)。

- 隐藏/显示控制面板：点击位于直播画面上方的蓝底白字按钮即可开/关控制面板。你也可以使用键盘快捷键`alt+b`。
- 展开/收起侧边栏：点击控制面板左上角的按钮展开/收起左侧菜单。
- 点击控制面板上带有圆圈的蓝色小`i`图标可以显示各项功能的详细信息。
- 部分功能右侧会显示一个小图标以表示今天该任务的状态：
  - ✔：该任务已完成；将鼠标悬停在上方图标会变为🔄️，点击即可再次运行该任务。
  - ❌：执行过程中发生错误导致该任务彻底无法完成。
  - 一个旋转的加载中图标：该任务正在执行中。
  - 没有图标：该功能不显示任务状态、功能未开启或该任务正在等待即将到来的下一次运行。
- 打开某一项功能后，如果你希望它立刻执行，需要刷新页面。
  但是刷新页面会打断目前正在执行的任务，下次运行时能否根据上次的进度继续执行取决于功能模块的具体实现（目前大部分都不行）。
  建议首次使用时仔细阅读各项功能的说明，然后一次完成所有功能的设置。
- 打开多个直播间页面时，每日任务中的功能仅会在第一个直播间页面生效以防止任务被重复执行。体验优化、移除元素中的功能总是会生效。
- 每日任务中大部分任务的任务周期是从每天半夜00:05到下一个半夜00:05，即只要过了每天的00:05就会自动执行下一轮。有个别任务的周期是每天早上08:05到下一个早上08:05。
- 控制台日志：如果想查看控制台日志，请打开浏览器的开发者工具（快捷键`ctrl+shift+i`或`F12`）并切换到控制台（`Console`）。开头为`BLTH`的日志即为脚本日志。
  部分日志可能只有高级用户才看得懂，大家各取所需看自己想看的即可。善用过滤（`Filter`）和搜索（快捷键`ctrl+f`）功能。

# 兼容性

[BLTH](https://github.com/andywang425/BLTH)在设计上希望与[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)和[bilibili 直播净化](https://greasyfork.org/zh-CN/scripts/21416-bilibili%E7%9B%B4%E6%92%AD%E5%87%80%E5%8C%96)兼容，即三个脚本能同时正常运行。

如果你发现存在兼容性问题可以[新建一个空白issue](https://github.com/andywang425/BLTH/issues/new)来反馈。

# 反馈

如果想反馈 Bug 或者提出建议，请点击[new issue](https://github.com/andywang425/BLTH/issues/new/choose)然后选择对应的 issue 模板。

为了方便管理issue，请在 GreasyFork 安装脚本的用户尽量到 Github 反馈。

# 交流群

- QQ 频道：[点我加入 aw 的频道](https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W7eVLs&businessType=9&from=181074&biz=ka&shareSource=5)。

# 参与开发

如果你想参与到本项目的开发中来，请阅读[代码贡献指南](https://github.com/andywang425/BLTH/blob/master/CONTRIBUTING.md)。

# 许可证

本项目以[MIT](https://github.com/andywang425/BLTH/blob/master/LICENSE)许可证开源。

# 鸣谢

以下开源项目为本项目的开发提供了莫大的帮助：

- [Vue](https://github.com/vuejs/core)
- [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey)
- [element-plus](https://github.com/element-plus/element-plus)
- [pinia](https://github.com/vuejs/pinia)
- [lodash](https://github.com/lodash/lodash)
- [luxon](https://github.com/moment/luxon)
- [hotkeys-js](https://github.com/jaywcjlove/hotkeys-js)
- [crypto-js](https://github.com/brix/crypto-js)
- [ajax-hook](https://github.com/wendux/ajax-hook)
- [TampermonkeyJS](https://github.com/lzghzr/TampermonkeyJS)
- [transform](https://github.com/ritz078/transform)
- [inkscape](https://inkscape.org/)
- [svgo](https://github.com/svg/svgo)
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

此外也感谢所有参与本项目开发的朋友和提出过建议的用户。

# 更新日志

请查看[CHANGELOG](https://github.com/andywang425/BLTH/blob/master/CHANGELOG.md)。

# 相关推荐

## Bilibili Evolved

作者：[the1812](https://github.com/the1812)

- [Github](https://github.com/the1812/Bilibili-Evolved)

## bilibili 直播净化

作者：[lzghzr](https://github.com/lzghzr)

- [Github](https://github.com/lzghzr/TampermonkeyJS/blob/master/BiLiveNoVIP/BiLiveNoVIP.user.js)
- [GreasyFork](https://greasyfork.org/zh-CN/scripts/21416-bilibili%E7%9B%B4%E6%92%AD%E5%87%80%E5%8C%96)

## 新 B 站粉丝牌助手

作者：[一心向晚](https://github.com/XiaoMiku01)

- [Github](https://github.com/XiaoMiku01/fansMedalHelper)
