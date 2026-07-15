# EverGreen Design System 会话记录

更新时间：2026-07-15

## 仓库布局

| 仓库 | 路径 | 职责 |
|------|------|------|
| **Desktop** | `evergreen-design-system-desktop` | Desktop tokens + components + 原 docs（未删） |
| **Website** | `evergreen-design-system-website` | Website tokens + components + scenes |
| **Doc** | `evergreen-design-system-doc` | 独立文档站，消费 Website tokens |

```
Projects/
  evergreen-design-system-desktop/   ← 本仓库
  evergreen-design-system-website/   ← @evergreen/tokens（Website）
  evergreen-design-system-doc/       ← 文档站（Vue，已独立）
```

## 架构结论（2026-07-12 核查）

### packages 三层目标

```
tokens/        ← 全局变量（基数 → 语义）
components/    ← 通用 DS 组件
scenes/        ← 场景化业务组件（website 仓库已有，desktop 仅文档占位）
```

### Desktop tokens（本仓库）

- `packages/tokens/spec/` — color / scale / typography / text / effect
- 基数 → 语义引用，light/dark 主题
- Figma：EverGreen Design System (Desktop)，4px 网格

### 文档站独立（已完成）

- 从 `apps/website` 抽出 → `evergreen-design-system-doc`
- **未删除** desktop 内 `apps/website`
- Doc 依赖：`link:../evergreen-design-system-website/packages/tokens`
- 自带：motion、markdown 规则、personAvatar、壳层背景、主题 composable
- 排版兼容：`src/styles/token-aliases.css`（Desktop 命名 → Website 语义）
- 开发端口：**5174**（`pnpm dev`）
- Cursor 规则：`.cursor/rules/` + `website-token-dependency.mdc`

## 已完成并提交（Desktop main）

最新提交：`0dca9c1` — shell colors, markdown rules, page enter 1800ms

### 页面入场动效（仍在 desktop apps/website）

- `DocPageView` → `pageShell` → `eds-motion-page-enter`
- 时长 **1800ms**；文件 `apps/website/src/motion/`

### 文档 Markdown 冻结

- `.cursor/rules/doc-markdown.mdc`
- 列表 `spacing-4`；表格 38px / `stroke-outline-deep` / `th` shallow；无行号

### 浅色壳层背景

- content `#fcfbf8`；nav/section-nav `#f4f3f0`（P3）
- `apps/website/src/styles/global.css`

## 工作约定

- 「存档」→ 本地 `git commit`
- 「存档并更新到 GitHub」→ commit + push
- 未明确要求不 commit
- P3：hex fallback + `color(display-p3 ...)`

## 待实现

- Desktop 组件目录分层（atoms/molecules/organisms）
- `packages/scenes`（desktop 仓库）
- Doc 内 Desktop 组件预览：`data-platform="desktop"`
- Website shell 颜色迁入 token 包
