# 项目概述

BLTH（Bilibili Live Tasks Helper）是基于 Vue 3 + Vite + vite-plugin-monkey + Element Plus + TypeScript 的用户脚本，运行在 Bilibili 直播页面（`live.bilibili.com/直播间号`），实现自动完成每日任务、观看体验优化和页面元素清理。

# 常用命令

```sh
npm run dev          # 启动 Vite 开发服务器（watch模式生成用户脚本）
npm run build        # type-check 与 build+minify 并行
npm run type-check   # 仅 Vue TypeScript 类型检查
npm run lint         # ESLint + Stylelint 自动修复
npm run format       # 使用 Prettier 格式化 src/
npm run preview      # 提供编译产物安装链接的本地预览页
```

无自动化测试。

# 架构

- 所有功能模块继承 `src/modules/BaseModule.ts`，由 `useModuleStore` 管理生命周期
- `main.ts` 分两阶段加载模块：先加载早期模块，再在 `document-body` 后加载默认模块
- 脚本分为三类：Main，SubMain，Other。同时打开多个直播间页面时，`useCacheStore.checkCurrentScriptType()` 会选出唯一 Main，避免部分模块重复执行

# 分支

- `master`：发布分支。合并来自 `dev` 的 PR 后触发 GitHub Actions 自动构建并创建 Release
- `dev`：开发分支。非发布 PR 的目标分支

# 规范

- `src/library/bili-api/` 中的 API 必须有详细的请求/响应类型定义
- 路径别名 `@/` 映射到 `src/`
- Commit message 使用约定式提交格式

# 易踩坑点

- 新增第三方库须在 `vite.config.ts` 的 `externalGlobals` / `externalResource` 中通过 `@require` / `@resource` 引入，不打包进脚本
- 调试 `runAt: 'document-start'` 等早期模块时 dev 模式注入太晚，请用 `npm run build` 的产物测试
