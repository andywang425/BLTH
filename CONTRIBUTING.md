# 代码贡献指南

## 欢迎

很高兴能有更多人参与到本项目的开发中，无论是添加新功能，修复 Bug 还是改进文案都是可以的。由于本项目涉及的范围比较广，再加上 B 站经常做出各方面的改动，脚本需要被不断地修改以适应 B 站的变化。如果你想为本项目贡献一份力量，请认真阅读以下指南。

## 环境搭建

- 安装 [Chrome](https://www.google.cn/chrome/)，[Tampermonkey](https://www.tampermonkey.net/)，[Node.js](http://nodejs.cn/) (version >= 16), [Visual Studio Code](https://code.visualstudio.com/)。
- Fork 本项目，然后 Clone 至本地。
- 安装依赖 `npm install -D`。
- 安装 vscode 插件 [MinifyAll](https://marketplace.visualstudio.com/items?itemName=josee9988.minifyall)。

## 脚本调试方式

### 传统方式

对脚本做出修改后，把代码复制到 Tampermonkey 中，刷新网页。
这样做的缺点就是太麻烦，每修改一点东西就要复制一次代码，所以推荐用以下方法：

### 推荐方式

把脚本头部复制到 Tampermonkey 中，在元数据的最后加上一行`// @require file:///<B站直播间挂机助手.js的路径>`，这样每次修改完代码后只需刷新网页即可生效。如果你需要修改其它`@require`或`@resource`中的文件，也可以用这种方法。

## 项目概览

### 分支

`master`分支是主分支，贡献代码时不需要使用。主仓库最终合并分支时会把`dev`分支合并到`master`分支。

`dev`分支是开发用分支，开发时以此分支为基础。`dev`分支永远都不会落后于`master`分支。

### 目录结构

```
BLTH
│  B站直播间挂机助手.js          原格式脚本，开发用，也是从greasyfork和openuserjs安装的脚本
│  B站直播间挂机助手.user.js     压缩后脚本，从github安装的脚本
│  README.md                    README
│
├─.github                       github文件夹
│  └─ISSUE_TEMPLATE             issue模板
├─.vscode                       vscode文件夹，存放配置文件和调试登录信息
└─assets                        资源文件夹
   ├─css                        CSS
   ├─html                       HTML
   ├─img                        图片
   ├─js                         JS
   │  ├─development             用于方便开发的JS文件
   │  └─library                 脚本需要的JS库文件
   ├─json                       脚本需要的JSON文件
   └─markdown                   MARKDOWN文件，存放非github平台的脚本介绍和更新日志
```

## 挂机助手代码浅析

### 代码结构

由于一些历史原因，代码结构和风格略显凌乱，以下对代码结构做一个简单的总结：

```js
// ==UserScript==
// @name           B站直播间挂机助手
// ...
// ==/UserScript==
(function () {
    localstorage2gm();
    const NAME = 'BLTH',
    // 声明各种常用的变量，简单函数...
    // 处理一些需要尽早处理的事务，比如拦截直播流...
    // DOM加载完成后运行
    $(function () {
        // 初始化脚本...
        init();
    });
    // 初始化函数
    function init() {
        // 由于历史原因，这个函数特别大
        // 里面有设置项，有各项功能的具体实现
        const MY_API = {
            // ...
        }
        // ...
    };
    // 主函数
    async function main(API) {
        checkUpdate(GM_info.script.version);
        // 调用 MY_API 里的各项功能等...
    };
    // 一些相对独立的功能性函数...
})();
```

### 代码风格

缩进请用`2`个空格（遵循`/.vscode`目录下的`settings.json`中的`prettier.tabWidth`字段）。如果你不是用 vscode 开发的话请注意这一点。

### JS 特性

不建议使用特别新的语言特性，ES6 及之前的特性可以随意使用。可以上 [caniuse.com](https://caniuse.com/) 这个网站查一下你想要使用的特性的支持情况。很多用户还在使用国产浏览器，这些浏览器的 chromium 内核版本普遍不是很高，尽可能地兼容一下。

## 收尾工作

完成代码编写后仍有一些工作要做，请务必认真对待，漏掉一项可能就意味着需要再更新一个版本来迭代掉有问题的版本：

- 删除在代码中临时添加的日志输出语句 (`console.log`等)。
- 如果你调试了 [BLTH-server](https://github.com/andywang425/BLTH-server) 相关的功能，记得删除元数据中的`// @connect localhost`。
- 如果你更新了`@require`或`@resource`中的文件，记得先将这些文件的修改提交到仓库，然后把文件地址`file:///<...>`替换为 cdn 链接`https://gcore.jsdelivr.net/gh/<你的github用户名>/BLTH@<...>`。请不要删除你 fork 的仓库，这可能会导致用户无法正常获取这些依赖。
- 更新脚本元数据中的版本号`// @version`。通常来说在最后一位+1 即可，满 10 则向前进位。
- 更新位于`/assets/json/`目录下的`notice.json`中的版本号，然后压缩该 json 文件得到`notice.min.json`。
- 攥写更新日志`update-log.md`，格式仿照先前的日志写即可。写完后复制更新内容，之后会用到。
- 更新脚本内置的更新说明（每次更新后第一次运行时弹窗的内容）。运行`/assets/js/development/`目录下的`updateLog2ArrayString.js`，粘贴你刚刚写的更新内容，回车，将剪切板的内容复制到脚本内置更新说明的位置（在代码中搜索`${version}更新提示`可快速定位，数组`clientMliList`是储存更新说明的）。
- （本步骤可忽略。部分情况下添加 md5 会导致 Tampermonkey 无法正常获取依赖，原因未知。）给资源文件添加用于校验子资源完整性的 md5 值。运行`/assets/js/development/`目录下的`addRequireMd5.js`得到新的脚本元数据，结果会被保存到剪切板。用剪切板中的内容覆盖脚本的头部元数据即可。注意，如果部分 md5 计算失败而你想要手动加上 md5 的话，需计算从 cdn 获取到的内容的 md5，不能直接计算本地文件的 md5，因为上传到 cdn 之后文件的 md5 可能会变化（但是内容不会变，可能是换行符之类的导致的）。
- 压缩脚本，得到`B站直播间挂机助手.user.js`。如果你使用的是[MinifyAll](https://marketplace.visualstudio.com/items?itemName=josee9988.minifyall)插件，元数据会被保留下来（详见`/.vscode/settings.json/`的`MinifyAll.terserMinifyOptions`字段）。如果你用的是其它压缩手段，记得把脚本头部的元数据补上。
- 发起 PR(你的仓库的 dev 分支 -> 主仓库的 dev 分支)。标题写版本号，描述写更新内容。复制你之前在`update-log.md`里写的更新内容，运行`/assets/js/development/`目录下的`updateLogAddLineBreaks.js`，粘贴，即可快速添加换行符。由项目成员进行最后的检查和修改后，主仓库的 dev 分支会被合并到 master 分支，之后用户便可以通过各种途径更新最新版的脚本了。
