# Liquid Glass Bubbles Homepage — Dual Grid (2026-07-07)

首页液态玻璃气泡动画快照（双层网格版）。

## 文件

| 文件 | 说明 |
|------|------|
| `useLiquidGlassBubbles.ts` | Three.js metaball 气泡 + Canvas 背景文字折射 |
| `HomeView.vue` | 首页布局（Logo、按钮、页脚） |
| `HomeView.module.css` | 首页样式 |

## 当时配置摘要

### 背景与网格

- 渐变背景 `#0d5a3a` → `#106B45` → `#0a4f34`
- **双层网格**（静态烘焙，`soft-light` 叠加）：
  - **主层**：间距 `380px`，线 `rgba(0, 230, 135, 0.99)`，交点 `rgba(235, 250, 242, 0.45)`，叠加强度 `8%`
  - **副层**：间距 `570px`（1.5×），线/点更淡，半格偏移，叠加强度 `10%`
- 星场粒子层（0.5× 分辨率 overlay，每帧合成）

### 文字与 UI

- 主标题 `EDS.`（EDS Text / 900）
- 副标题 `EverGreen Ecosystem Builder`（56px / Space Grotesk）
- 主副标题 Gap `0`，垂直位置 `38%`
- Logo 顶部居中 `56×56`，`eds-logo-white.svg`
- 按钮 `Get Started` / `Version 1.0`
- 页脚链接 `EDS Mobile`、`EDS WebSite`

### 交互与 Shader

- 鼠标跟随大气泡
- Metaball 玻璃：折射、色散、Fresnel、高光、边缘光
- **无** shader 颗粒 / 暗角（曾试验后移除）
- DPR 上限 `1.5`，离屏/切 tab 暂停

## 依赖

- `three@0.160.1`
- `@types/three`（dev）
- `index.html` 中 Space Grotesk 字体

## 恢复方式

将本目录文件复制回：

- `useLiquidGlassBubbles.ts` → `src/composables/`
- `HomeView.vue` / `HomeView.module.css` → `src/views/`
