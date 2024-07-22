# 代码贡献指南

## 欢迎

很高兴能有更多人参与到本项目的开发中，无论是添加新功能，修复 Bug 还是改进文案都是可以的。由于B站的改动很频繁，脚本需要被不断地修改以适应B站的变化。如果你想为本项目贡献一份力量，请认真阅读以下指南。

## 技术栈

BLTH 是一个基于 [Vue3](https://cn.vuejs.org), [Element Plus](https://element-plus.org/), [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) 和 Typescript 的用户脚本。如果想要贡献代码，你至少需要有 [Vue3](https://cn.vuejs.org) 和 Typescript 基础。

## 环境搭建

- 安装 [Node.js](https://nodejs.org/), [Visual Studio Code](https://code.visualstudio.com/)。
- Fork 本项目（取消勾选 Copy the `master` branch only），然后 Clone 至本地。
- 切换到项目根目录，安装依赖 `npm install`。
- 安装以下几个 vscode 拓展（使用 vscode 打开项目时会提示你安装）：[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)。

## 开始

首先切换到`dev`分支：

```sh
git checkout dev
```

接着使用以下命令在浏览器中安装脚本并启动 [Vite](https://cn.vitejs.dev)，然后你就可以开始写代码啦。

```sh
npm run dev
```

得益于 Vite 的模块热更新（HMR）功能，如果仅修改了 UI 相关代码，可以直接在浏览器中看到结果。其余情况下通常 Vite 会自动帮你刷新页面，但是在部分情况下仍需手动刷新。

脚本运行过程中会调用B站API，过于频繁地刷新页面从而让脚本反复调用API可能导致你的B站账号被风控。如果你写代码的时候经常保存请注意这一点。

## 项目概览

### 分支

- **master**: `master`分支是主分支，主仓库在发布新版本前会把`dev`分支合并到`master`分支。最终供用户安装的用户脚本由 Github Actions 自动编译并推送到主分支。

- **dev**: `dev`分支是开发用分支，开发时请使用该分支，发起PR时也以主仓库的dev分支为合并的目标。

### 目录结构

```
BLTH
├─.vscode
├─dist                     仅存在于master分支，存放Github Actions编译得到的用户脚本
├─node_modules
├─notes                    用来记录些东西，提交时会被忽略
├─scripts                  一些npm scripts，通过 npm run ... 调用
└─src
    ├─assets               资源文件
    │  └─css
    ├─components           vue组件
    │  └─icons             图标组件
    ├─library              库文件
    │  ├─...               每个文件夹代表一个库，此处省略
    ├─modules              功能模块
    │  ├─...               这里有很多模块，此处省略
    │  └─default           默认模块，性质较特殊
    ├─stores               Pinia store
    └─types                typescript 类型定义
```

## 示例

如果你还是不太清楚怎么做，下面是新增一个功能模块的简单流程。

假设现在B站给主站每日任务新添加了一个任务：给视频点赞。

首先打开 modules 文件夹，你会发现已经有了 dailyTasks/mainSiteTasks 这个文件夹，那么你只需在这个文件夹下新建一个 ts 文件即可。内容大概如下：

```ts
import BaseModule from '../../BaseModule'
// import ...

class LikeTask extends BaseModule {
  // ...
}

export default LikeTask
```

可以参考已经写好的模块，尤其是 dailyTasks/mainSiteTasks 中的那几个，注释写得很详细。

你写的这个模块肯定会有相关的配置项（至少得有一个开启/关闭的选项吧），打开 types/storage.d.ts，加上该模块配置信息的类型声明。

接着打开 library/storage/defaultValue.ts，加上该模块配置信息的默认值。

点赞涉及到对B站API的请求。在 library/bili-api 中找找看有没有给视频点赞的API，如果没有得自己添加。参考已有的API即可。

点赞的视频从哪来？如果仔细阅读代码你会发现 useBiliStore 的 dynamicVideos 里已经存储了许多动态视频，你可以直接用。如果有特殊需求，自己获取视频当然也是可以的。

完成模块的编写后，记得在 dailyTasks/mainSiteTasks/index.ts 中添加新模块的导出。

## 代码风格

编写的代码需要能够通过 ESlint 检查。在你编写代码的过程中 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 拓展会实时地检查打开的代码文件。

你也可以使用以下命令检查所有文件：

```sh
npm run lint
```

在你完成代码编写后，请运行以下命令格式化所有代码：

```sh
npm run format
```

## 编码准则

### 强制性

- 对于`src/library/bili-api`中的每个 API，必须为其请求参数和响应内容编写详细的类型定义。[transform](https://github.com/ritz078/transform) 和 [quicktype](https://github.com/quicktype/quicktype) 或许会有帮助。
- 如果添加了新的第三方库或资源文件，请修改`vite.config.ts`使其通过`@require`或`@resource`引入。

### 建议性

- 尽可能详细地写类型定义，必要时才使用`any`/`unknown`。
- 为逻辑复杂的代码编写注释。

## 编译

开发完成后记得编译并测试一下最终的成品。使用以下命令编译脚本：

```sh
npm run build
```

这会在`build`文件夹下生成一个后缀为`.user.js`的文件和一个后缀为`.min.user.js`的文件，分别是未压缩的和压缩后的用户脚本。

最后输入以下命令把编译后的脚本安装到浏览器：

```sh
npm run preview
```

然后浏览器会打开一个页面，页面上有两个脚本的安装链接（未压缩的和压缩后的），选择一个安装即可。

## 已知问题

如果要开发或调试运行时机很早的模块，建议先编译脚本（npm run build）然后运行编译后的脚本。在 dev 状态下调试这类功能可能会因为脚本被注入得太晚从而无法很好地进行测试。

## commit 规范

请在 commit message 中简单阐述一下改动内容，建议使用类似[约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0)的格式。

## 发起 PR

把你的分支合并到主仓库的`dev`分支即可。
