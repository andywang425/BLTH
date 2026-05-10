# CLAUDE.md

本文件为 AI 助手在本仓库中工作时提供指引。

## 项目概述

BLTH（Bilibili Live Tasks Helper）是一个基于 Vue 3 + Vite 的浏览器用户脚本，运行在 Bilibili 直播页面（如 `live.bilibili.com/直播间号`），通过 Tampermonkey/Violentmonkey 实现自动完成每日任务、观看体验优化和页面元素清理。

## 常用命令

```sh
npm run dev          # 启动 Vite 开发服务器（watch 模式生成用户脚本）
npm run build        # 类型检查 + 构建并压缩（并行）
npm run build-only   # 仅构建，不做类型检查和压缩
npm run type-check   # 仅 Vue TypeScript 类型检查
npm run lint         # ESLint + Stylelint 自动修复
npm run format       # 使用 Prettier 格式化 src/
```

本项目没有自动化测试。

## 架构

### 模块系统

所有功能以模块形式实现，继承自 `src/modules/BaseModule.ts`。由 `useModuleStore` 管理生命周期。

模块分类：

- `default/` — 默认模块，负责获取用户信息、Cookie、粉丝勋章等基础数据；多数业务模块依赖其结果，但部分体验优化模块会更早运行
- `dailyTasks/` — 每日任务（主站任务、直播任务、其他任务）
- `enhanceExperience/` — 体验优化
- `removeElement/` — 移除页面元素

模块通过各级 `index.ts` 桶文件导出；其中 `src/modules/index.ts` 只导出非默认模块。

### 新增模块流程

1. 在 `src/modules/` 对应子目录下创建继承 `BaseModule` 的模块类
2. 在 `src/types/storage.d.ts` 的 `ModuleConfig` 中添加类型定义
3. 在 `src/library/storage/defaultValues.ts` 中添加默认配置
4. 如需调用新的 B 站 API，在 `src/library/bili-api/` 中补充实现，以及请求/响应类型定义
5. 完成模块类后，在对应的 `index.ts` 桶文件中导出
6. 在 `src/components/` 对应组件中添加 UI
7. 每日任务通常还需在 `useModuleStore` 中添加状态和重置逻辑
8. 如模块需要尽早执行、跨页面执行或限定 frame，检查并设置 `BaseModule` 的静态属性（如 `runAt`、`onFrame`、`runAfterDefault`、`runOnMultiplePages`）

### 状态管理（Pinia Stores）

- `useBiliStore` — B 站用户数据（uid、硬币、勋章、动态视频等）
- `useCacheStore` — 脚本运行时状态，检测主/副脚本类型以防多标签页重复执行
- `useModuleStore` — 模块注册、生命周期、配置持久化、状态跟踪与重置
- `useUIStore` — 控制面板 UI 状态
- `usePlayerStore` — 直播播放器状态

### 存储

通过 `GM_getValue`/`GM_setValue` 持久化 `ui`、`modules` 和 `cache` 数据（`src/library/storage/`）。

### 构建

`vite.config.ts` 使用 `vite-plugin-monkey` 生成 `.user.js` 用户脚本。外部依赖通过 CDN `@require` 引入而非打包。新增第三方库必须加到 `vite.config.ts` 的 `externalGlobals` 或 `externalResource` 中。

### 路径别名

`@/` 映射到 `src/`。

## 分支策略

- `master`：发布分支；合并来自 `dev` 的 PR 后由 GitHub Actions 构建并创建 Release
- `dev`：开发分支，所有 PR 以 `dev` 为目标

## 代码规范

- Vue 3 Composition API + `<script setup>` 语法
- TypeScript strict 模式；`any` 允许使用但应尽量避免
- CSS 类名遵循 BEM 命名（Stylelint 强制）
- 未使用的变量以 `_` 前缀命名
- `src/library/bili-api/` 中的 API 必须编写详细的请求/响应类型定义
- Commit message 使用约定式提交格式
