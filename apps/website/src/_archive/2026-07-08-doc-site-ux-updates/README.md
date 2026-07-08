# Doc Site UX Updates (2026-07-08)

文档站交互与占位内容快照。

## 变更摘要

### 悬浮过渡

- 全局 `--eds-hover-transition-duration: 0.35s`
- `a` / `button` / `[role='tab']` / `[role='link']` 统一 hover 过渡
- AppRail、SectionNav、PageToc、BrandSwitcher、HomeView、Button 组件同步

### 开发指南占位

- 开发模式目录与正文预留 **20** 个展位块
- 奇数：`开发定义 N`；偶数：`开发单位 N`
- `developContent` 独立于设计模式 `defaultContent`

### 导航与滚动

- SectionNav 滑动指示器（对齐 PageToc 动画）
- `contentShell` 作为文档滚动容器
- PageToc `position: sticky`

### 其他

- 探索页「正在建设中...」占位样式
- AppRail / SectionNav 激活态 `color-mix` 12% 品牌色

## 文件

| 路径 | 说明 |
|------|------|
| `components/SectionNav/` | 滑动指示器 + hover 过渡 |
| `components/PageToc/` | 目录链接 hover 过渡 |
| `components/AppRail/` | 导航 hover 过渡 |
| `components/BrandSwitcher/` | 菜单 hover 过渡 |
| `config/navigation.ts` | 开发指南 20 展位块 |
| `layouts/DocsLayout.*` | 滚动容器调整 |
| `styles/global.css` | 全局 hover 变量 |
| `views/DocPageView.*` | 文档页滚动与 TOC |
| `views/UnderConstructionView.*` | 建设中页 |
| `views/HomeView.module.css` | 首页入口 hover |
| `packages/Button/` | Button hover 过渡 |

## 恢复方式

将本目录对应文件复制回 `apps/website/src/` 或 `packages/components/src/` 下的原路径。
