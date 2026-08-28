# EverGreen Desktop Showcase

Desktop 设计系统的本地预览站：token 画廊、组件 live preview、场景目录。

## 依赖模型

| 角色 | 来源 | 包 |
|------|------|-----|
| Token（全站） | `eds-desktop` | `@eds/desktop-tokens` |
| 组件（壳层 + live preview） | `eds-desktop` | `@eds/desktop-components` |
| 动画 | `eds-desktop` | `@eds/desktop-animations` |

**核心规则：** Showcase **完全自包含**，仅依赖本仓 `@eds/desktop-*`；与 `eds-website` **零关联**。组件预览 subtree 包在 `.desktopTokens` 内以锁定排版基线。

## 启动

```bash
pnpm install
pnpm dev:showcase
```

打开 http://localhost:5177/

## 页面

| 路由 | 内容 |
|------|------|
| `/` | 概览 |
| `/tokens` | Desktop 颜色、尺度、排版、语义变量 |
| `/components/:slug` | Desktop 组件 live preview |
| `/scenes` | 场景目录 |
