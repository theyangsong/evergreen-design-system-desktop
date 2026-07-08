# Liquid Glass Bubbles Homepage (2026-07-07)

首页液态玻璃气泡动画快照。

## 文件

| 文件 | 说明 |
|------|------|
| `useLiquidGlassBubbles.ts` | Three.js metaball 气泡 + Canvas 背景文字折射 |
| `HomeView.vue` | 首页布局（Logo、按钮、页脚） |
| `HomeView.module.css` | 首页样式 |

## 当时配置摘要

- 背景色 `#106B45`
- 主标题 `EDS.`（EDS Text / 900）
- 副标题 `EverGreen Ecosystem Builder`（56px / Space Grotesk）
- 主副标题 Gap `0`，垂直位置 `38%`
- 鼠标跟随大气泡
- Logo 顶部居中 `48×48`，`eds-logo-white.svg`（`#00E687`）
- 按钮 `Get Started` / `Version 1.0`
- 页脚链接 `EDS Mobile`、`EDS WebSite`

## 依赖

- `three@0.160.1`
- `@types/three`（dev）
- `index.html` 中 Space Grotesk 字体

## 恢复方式

将本目录文件复制回：

- `useLiquidGlassBubbles.ts` → `src/composables/`
- `HomeView.vue` / `HomeView.module.css` → `src/views/`
