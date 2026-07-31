# EverGreen Desktop Showcase

Desktop 设计系统的本地预览站：token 画廊、组件 live preview、场景目录。

## 依赖模型

| 角色 | 来源 | 包 |
|------|------|-----|
| 预览站壳层样式与主题 | `eds-website` | `@eds/website-tokens`、`@eds/website-components` |
| Token 页数据 | `eds-desktop` | `@eds/desktop-tokens` |
| 组件 live preview | `eds-desktop` | `@eds/desktop-components` |
| Desktop 预览 token 作用域 | `eds-desktop` | `@eds/desktop-tokens`（scoped under `.desktopTokens`） |

**核心规则：** 除 **Desktop 组件本身及其 props/事件/插槽** 外，Preview 站其余一切（壳层、布局、导航、标签、间距、颜色、排版）均使用 **Website** token（`@eds/website-tokens`）。仅组件 subtree 包在 `.desktopTokens` 内加载 `@eds/desktop-tokens`。

## 前置条件

同级目录需存在 `eds-website`：

```
Projects/
  eds-desktop/   ← 本项目
  eds-website/   ← Website tokens + components
```

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
| `/scenes` | Website 场景目录 |
