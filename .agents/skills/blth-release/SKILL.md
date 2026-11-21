---
name: blth-release
description: Automates the BLTH release flow. Invoke when the user wants to prepare a release, publish a new version, merge the release PR, or sync master back to dev.
---

# BLTH Release

执行 BLTH 项目的发版流程。如果仓库根目录下存在 `.agents/local/blth-release.md`，开始前先读取其中的本地发版约定。

## 目标

按项目约定完成以下事项：

1. 按默认进位或用户指定的版本更新 `package.json` 和 `package-lock.json`
2. 结合 commit 历史检查变更日志 `CHANGELOG.md` 是否漏项
3. 将 `CHANGELOG.md` 中 `Unreleased` 的内容整理成新版本条目
4. 提交并推送改动
5. 创建并合并目标为 `master` 的 PR
6. 等待 GitHub Actions `Release` 工作流完成
7. 将 `master` 的发布提交同步回 `dev`

## 仓库约定

- 默认开发分支是 `dev`
- 发布分支是 `master`
- `.github/workflows/build.yaml` 中的 `Release` 工作流只会在满足以下条件时触发：
  - PR 目标分支是 `master`
  - PR 已被合并
  - PR 的源仓库是当前仓库，源分支是 `dev`
- `CHANGELOG.md` 的版本标题格式必须保持为：

```md
## [7.2.9] - 2026-5-24
```

注意：

- 月和日不要补零
- 不要改动旧版本内容的顺序和层级
- 仅把 `Unreleased` 下已有内容转移为新版本标题，不要凭空编造功能点

## 版本号规则

只处理三段式版本号 `major.minor.patch`。

用户明确指定新版本（如 `8.0.0`）时采用该值。三个分量须为无前导零的非负整数，按 major、minor、patch 依次进行数值比较，目标版本必须高于 `origin/master` 的项目版本。

未指定版本时使用默认规则：

1. 默认将最后一位 `patch + 1`
2. 如果最后一位加一后 >= `10`，则：
   - `patch = 0`
   - `minor = minor + 1`
3. `major` 保持不变

示例：

- `7.2.9` -> `7.3.0`
- `7.2.8` -> `7.2.9`

## 执行步骤

### 1. 收集上下文

先确认以下内容：

- 当前分支是否为 `dev`
- 工作区是否干净；若存在与发版无关的未提交改动，先暂停并询问用户
- 本地 `dev` 是否与远端同步
- 本地是否已安装并登录 `gh`
- 用户是否主动提及要关闭 issue；如果没有，默认不要关闭任何 issue
- 如用户希望 agent 帮忙判断，可在合并 PR 前检索当前 open issues，整理出可能相关的候选项，再交由用户确认

以下命令彼此独立，应在一次工具调用中并行执行：

```bash
git branch --show-current
git status --short
gh auth status
```

先 fetch，再识别本次发布的进度：

```bash
git fetch origin --tags
git rev-list --left-right --count dev...origin/dev
git log --oneline origin/dev..dev
git log --oneline origin/master..dev
gh pr list --base master --head dev --state all --json number,url,title,state,headRefOid,headRepositoryOwner,isCrossRepository,mergeCommit
gh release list --limit 10 --json tagName,isDraft
```

只匹配本仓库 dev 到 master 的 PR。以本次请求的版本（续跑时）、package 版本、changelog 条目和准备提交识别同一次发布。必要时按版本检索历史 PR，并用 `gh release view v<version>` 查询确切记录。

1. 本地与远端分叉时展示双向提交并停止。仅落后时 fast-forward；仅领先时逐个核对提交。已准备且尚未推送的版本提交进入步骤 5，推送前核对提交范围；其他本地独有提交交维护者决定。
2. 已有匹配的合并 PR 时记录其源 SHA、merge commit SHA，进入步骤 9。若发布已核验且 `git merge-base --is-ancestor <mergeCommit> origin/dev` 成功，报告该版本已完成。开始新的发布时，上一版已完成且有新的待发布改动才进入准备流程。
3. 续跑时先核对本次指定的版本与已准备的版本或打开的发布 PR；不一致时报告双方版本，等待维护者决定。已有打开的发布 PR 时复用其编号和版本，从步骤 7 核对正文、审阅和等待检查。已有准备提交（包括旧格式的准备提交）时核对 package、锁文件、changelog 与准备提交中的版本选择（默认进位或显式 trailer），再从步骤 5 继续。仅缺 PR 时创建一次。
4. 若工作区中已有未提交的升版改动，先比对 HEAD、锁文件和 changelog，确认属于本次准备后用已有目标版本补齐剩余步骤。发现矛盾（例如同一版本另一份发布记录、已关闭未合并的 PR）时列出详情。
5. 只有确认正在开始新版本且没有本次准备记录时才执行步骤 2。对空的 Unreleased 先按步骤 3、4 处理，再修改版本文件。

### 2. 计算新版本号

读取 `git show origin/master:package.json` 中的版本，按“版本号规则”确定目标版本。

使用 `npm version` 一次性更新 `package.json` 和 `package-lock.json`，避免漏改 `package-lock.json` 中的多处 `version` 字段：

```bash
npm version <newVersion> --no-git-tag-version
```

`--no-git-tag-version` 用于阻止 npm 自动 commit / tag，发版流程后续会自己处理提交。

### 3. 用 commit 历史补查漏写项

在动手改 `CHANGELOG.md` 之前，先对照最近的 commit 记录，确认 `## [Unreleased]` 段落是否漏写了重要变更。重点关注：

- 用户可见的新功能
- bug 修复
- 行为变更
- 删除或弃用
- 值得记录的开发向改动

定位上一版本与比对范围：

1. 先用 `gh release list --limit 1 --json tagName` 拿到最近一次 release 的 tag；若 `gh` 取不到，再从 `CHANGELOG.md` 解析最近一个已发布版本号作为兜底
2. `git fetch --tags` 确保本地 tag 是新的
3. 查看上一版本到 HEAD 的提交：

```bash
git log --oneline <previousTag>..HEAD
```

处理原则：

- 此步骤默认只做比对和整理候选项，不要直接修改 `CHANGELOG.md`
- 如果判断 `Unreleased` 存在漏项，必须先把候选项列给用户，明确征得同意后再补写
- 补写位置是 `## [Unreleased]` 段落本身，不要凭空新建版本块（移动到新版本块是下一步的事）
- 如果用户未同意，直接保留现状并继续发版
- 只把值得进入 changelog 的内容补进去；不要逐条照抄 commit message
- 保持现有分类风格，如 `新增`、`修复`、`调整`、`删除`

### 4. 更新 CHANGELOG

把上一步整理好的 `Unreleased` 内容固化成新版本条目。规则：

1. 找到 `## [Unreleased]`
2. 如果 `Unreleased` 下为空，停下来告知用户并询问是否继续发版
3. 保留顶部的 `## [Unreleased]` 标题，供后续开发继续累计未发布变更
4. 将 `Unreleased` 下方现有内容（含步骤 3 已补写进去的条目）原样移动到一个新的版本条目，紧跟在 `## [Unreleased]` 下方
5. 新版本标题格式为：

   ```md
   ## [<newVersion>] - <YYYY-M-D>
   ```

   处理后的顶部结构示例：

   ```md
   ## [Unreleased]

   ## [7.3.0] - 2026-5-24

   ### 新增

   - 某个新功能
   ```

6. 日期使用当前本地日期，月份和日期不要补零
7. 保留文件其他历史条目不变

### 5. 本地校验

在仓库根目录核对当前 Node 版本与 `.nvmrc` 完全一致。版本不符时先切换，再按锁文件安装依赖，依次运行与 CI 相同的代码检查、格式检查、Markdown 检查和构建。

```bash
node -e "if (process.versions.node !== require('node:fs').readFileSync('.nvmrc', 'utf8').trim()) process.exit(1)"
npm ci
npm run lint:check
npm run format:check
npm run docs:check
npm run build
```

即使只改了文档和版本号，也执行完整校验。任一步失败时，先定位原因，修复后重新校验。若为仓库已有问题，向维护者说明失败的命令和原因，由维护者决定是否继续发版。

### 6. 提交并推送

提交内容仅包含本次发版准备涉及的文件。

推荐提交信息：

```text
chore: 准备发布 <newVersion>
```

用 `git add package.json package-lock.json CHANGELOG.md` 暂存准备文件，按版本来源选择提交命令。

- 默认进位时执行 `git commit -m "chore: 准备发布 <newVersion>"`。
- 用户明确指定版本时执行 `git commit -m "chore: 准备发布 <newVersion>" --trailer "Release-Version-Override: <newVersion>"`，将唯一的 trailer 写入设置该版本的提交。

复用已有准备提交时直接执行下面的校验。校验通过后推送：

```bash
node scripts/check-release-version.mjs origin/master HEAD
git push origin dev
```

如果还有本次为修复构建或补充发版说明而做的必要改动，也一并纳入提交，但要确认都是本次发版相关内容。

### 7. 创建发布 PR

创建一个从 `dev` 到 `master` 的 PR。

要求：

- 标题：新版本号，例如 `7.3.0`
- Base：`master`
- Head：`dev`
- Body：`CHANGELOG.md` 中从新版本标题开始，到下一个版本标题之前的整段内容

在系统临时目录创建本次专用文件（PowerShell 可用 `New-TemporaryFile`），由 Node 直接写入 UTF-8 正文：

```bash
node scripts/extract-changelog.mjs <newVersion> <tempBodyFile>
gh pr create --base master --head dev --title "<newVersion>" --body-file <tempBodyFile>
```

已有 PR 时跳过创建。用 `gh pr view <prNumber> --json body` 解析正文，统一 CRLF 为 LF 后与文件逐字核对；若有差异，列出差异交维护者决定。合并前对最终审阅的源提交再做一次核对。

创建后记录：

- PR 编号
- PR URL

### 8. 合并发布 PR

合并前再次确认：

- 用 `gh pr view <prNumber> --json headRefOid` 记录源提交 SHA，审阅该提交的 PR 内容。源提交变化时重新审阅。
- 用 `gh pr checks <prNumber> --required --json name,state,link` 查找 `Check code and build userscript`。检查尚未出现、排队或运行中时每 15 秒重查。只有状态为 `SUCCESS` 才继续；失败时从检查链接的 `/actions/runs/<runID>/` 取得 run ID，用 `gh run view <runID> --log-failed` 展示失败日志。修复后重新审阅并检查新提交。
- 是否需要填写 issue 关闭语句

关于 issue 关闭的处理规则：

- 如果用户没有提及 issue，默认不关闭任何 issue，也不要主动在 merge message 中填写关闭语句
- 如果用户明确表示希望 agent 帮忙找候选 issue，可以检索当前 open issues，并结合本次 changelog、PR 标题、PR 内容和最近相关提交，整理出"可能应关闭"的 issue 列表
- agent 只能提供候选项或列出 open issues 供用户选择，不能替用户决定关闭哪些 issue
- 只有在用户明确确认后，才能在 merge message 中填写 `close #123`、`fix #123` 等关闭语句

合并要求：

- title 使用默认值
- merge message 可以写：

```text
close #123
```

或：

```text
fix #123
```

如果需要关闭多个 issue，可以一行一个，或按 GitHub 支持的关键字写在同一消息中。

推荐命令示例：

```bash
gh pr merge <prNumber> --merge --match-head-commit <reviewedHeadSha> --body "close #123"
```

没有 issue ID 时省略 `--body`，保留 `--match-head-commit`。

### 9. 等待 Release 工作流

用 `gh pr view <prNumber> --json headRefOid,mergeCommit,mergedAt` 记录已合并 PR 的两个 SHA。每 15 秒执行一次下列查询，最多等待 5 分钟；确认事件、源 SHA 和合并时间与该 PR 一致。记录 run URL 后等待其结论。

```bash
gh run list --workflow build.yaml --event pull_request --commit <headSha> --json databaseId,url,headSha,createdAt,status,conclusion
gh run watch <runID> --exit-status
```

超时则报告 PR、源 SHA 和查询时间；下次从此处继续。失败时读取 `gh run view <runID> --log-failed`。发布任务在 merge commit 上用同一份提取正文、三个构建产物和远端 tag 检查发布状态：

- tag 指向其他提交时展示期望和实际 SHA；正文、名称、附件大小或 SHA-256 不符时展示差异，交维护者决定。
- 网络或上传中断后，使用 `gh run rerun <runID> --failed` 重跑原提交的任务并重新 watch。若已成功的发布随后缺少附件，重跑该 run。工作流会检查现有内容、只补缺少的文件，核验通过后完成发布。
- 完整成功的 run 应包含 `Verify release tag, notes and assets` 步骤的成功记录。续跑时同时读取远端 tag（注解 tag 取 peeled SHA）、PR 和 Release 正文及附件。用原 run 构建结果核对附件（成功日志中的文件大小与 SHA-256）；缺项时按上条处理。已完成版本可直接进入回同步核对。

### 10. 将 master 同步回 dev

发布 PR 合并后，`master` 会比 `dev` 多一个合并提交；需要把它同步回 `dev`，避免 `dev` 落后。

该合并 commit 的一个父提交正是 `dev` 当前的 HEAD，因此 `dev` 可以 **fast-forward** 到 `master`，不会产生反向 merge commit，保持 `dev` 历史线性。

```bash
git fetch origin
git status                         # 确认当前分支是 dev
git pull --ff-only origin dev      # 确认本地 dev 与远端一致
git merge --ff-only <mergeCommit>  # 仅 fast-forward，不允许产生新的 merge commit
git push origin dev
```

如果 `git merge --ff-only` 失败（说明本地 `dev` 在 PR 合并期间有了额外的新提交，无法 fast-forward），先停下来告知用户，由用户决定如何处理，不要自行 rebase 或强制覆盖。

若目标 merge commit 已在 origin/dev 中，直接报告回同步完成。分叉时用 `git log --left-right --oneline origin/dev...<mergeCommit>` 报告双方独有提交。同步完成后 fetch 并执行 `git merge-base --is-ancestor <mergeCommit> origin/dev`，退出码应为 0。确认：

- `dev` 已包含 `master` 的发布合并提交
- 本次发布 PR 的 merge commit 已实际进入 `dev`
- 两个分支不存在意外分叉

可选检查：

```bash
git fetch origin
git log --oneline origin/dev..origin/master
git log --oneline origin/master..origin/dev
```

## 与用户确认的关键点

执行过程中，以下情况需要先问用户：

- 工作区存在无关改动
- `Unreleased` 为空或内容不足以支撑一次发布
- changelog 与 commit 记录存在不确定映射
- agent 检索到了可能相关的 issue 候选项，需要用户确认是否关闭
- 用户希望从当前 open issues 中选择需要关闭的 issue
- 合并 PR 时需要填写哪些 issue 关闭语句
- 工作流失败后是否继续修复

## 输出要求

完成后向用户汇报：

- 新版本号
- 已更新文件
- 发布 PR 和 Release 的链接
- GitHub Actions 结果
- 是否已关闭相关 issue
- 是否还有人工后续动作

如果流程中断，也要明确停在第几步、原因是什么、下一步建议是什么。
