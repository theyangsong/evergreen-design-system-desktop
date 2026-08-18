# EgIcon 线稿描边缩放

## 当前方案（Chrome <153 回退）

**CSS calc 补偿 `stroke-width`**，不依赖 `vector-effect: non-scaling-stroke`。

```
stroke_user = stroke_screen × viewBox / displayPx
```

```css
/* Icon.module.css */
.tokenKind :global(.eds-i-s) {
  stroke: currentColor;
  stroke-width: calc(var(--eds-icon-stroke-screen) * 32 / var(--eds-icon-display-px));
}
```

| 变量 | 来源 | 默认 |
|------|------|------|
| `--eds-icon-stroke-screen` | 业务容器可覆写 | `var(--stroke-lg)`（1.4px） |
| `--eds-icon-display-px` | `EgIcon` 按 `size` / `fit` 写入（**取整**） | sm=16, md=20, lg=24 |

| size | displayPx | stroke_user（lg 1.4px） | stroke_user（md 1.1px） |
|------|-----------|-------------------------|-------------------------|
| sm | 16 | 2.8 | 2.2 |
| md | 20 | 2.24 | 1.76 |
| lg | 24 | ~1.867 | ~1.467 |

业务更细描边示例（Detail 行首）：

```css
.itemTitleIcon {
  --eds-icon-stroke-screen: var(--stroke-md);
}
```

### 实现分层

| 层 | 职责 |
|----|------|
| `processSvg` | 剥 token 色值与内联 `stroke-width` / `vector-effect`，打 `eds-i-s` / `eds-i-f` |
| `sizeIconMarkup` | 设 `svg width/height`（`Math.round` 避免子像素） |
| `Icon.module.css` | `.tokenKind` + calc `stroke-width` |
| `Icon.vue` | 写 `--eds-icon-display-px`；`fit` 用 `ResizeObserver`（取整） |

### 明确不使用的手段

| 手段 | 原因 |
|------|------|
| `vector-effect: non-scaling-stroke` | Chrome 回归（见下），153 前禁用 |
| `shape-rendering: geometricPrecision` | 已试验，对 thin stroke 无稳定收益，已移除 |
| user-space 补偿写死在业务 CSS（如 `2.8`） | 应用 token + calc，由 EgIcon 统一算 |

---

## 背景：Chromium `non-scaling-stroke` 回归

主 issue：[Chromium 541684117](https://issues.chromium.org/issues/541684117)（关联 [542023483](https://issues.chromium.org/issues/542023483)）

| Issue | 说明 |
|-------|------|
| [466303347](https://issues.chromium.org/issues/466303347) | Rust XML 解析器重构，**不含** vector-effect 修复 |
| [541684117](https://issues.chromium.org/issues/541684117) | `non-scaling-stroke` 屏上描边异常 / 衰退 |
| 修复窗口 | 预计 **Chrome 153** 稳定版（约 2026-09） |

153 之前社区临时方案：**calc / 媒体查询动态调整 `stroke-width`**，而非依赖 `non-scaling-stroke`。EgIcon 已采用此回退。

---

## Chrome 153 后验证清单（待测）

> 153 稳定版发布后执行；通过后再评估是否切回 `vector-effect` 简化实现。

### 环境

- [ ] Chrome **153+**（macOS + Windows）
- [ ] Safari 当前稳定版（回归）
- [ ] Showcase Detail 预览 + `work-cregis-desktop` 实机

### 用例

| # | 场景 | 期望 |
|---|------|------|
| 1 | EgIcon `size="sm"` 线稿 icon | 屏上描边 **1.4px**（`--stroke-lg`） |
| 2 | Detail `.itemTitleIcon` | 屏上描边 **1.1px**（`--stroke-md`） |
| 3 | EgIcon `fit` 在 16×16 容器 | SVG `width/height` 为整数 16；描边不偏细/偏粗 |
| 4 | `md` / `lg` 尺寸 | 各 size 描边恒为 token 值，不随 viewBox 缩放变线 |
| 5 | NavBar / Button 等含 EgIcon | 无发虚、断线、双倍粗细 |
| 6 | 深色 / 浅色主题 | `currentColor` 正确 |

### 若 153 修复确认

可选迁移（简化，非必须）：

1. `Icon.module.css`：`.eds-i-s` 改回 `stroke-width: var(--stroke-lg)` + `vector-effect: non-scaling-stroke`
2. 移除 `--eds-icon-display-px` 与 calc 公式
3. 业务仍用 `--eds-icon-stroke-screen` 或覆写 `stroke-width: var(--stroke-md)`
4. 统一评估 `Progress` / `Button` / `CryptoCombo` 是否已与 EgIcon 一致

### 若 153 仍有问题

- [ ] 保持当前 calc 回退
- [ ] 在本文档更新 issue 状态与实测结论
- [ ] 考虑 attribute 级补偿（`sizeIconMarkup` 写 `stroke-width`）作为二级回退

---

## 其他组件

`Progress`、`Button` spinner、`CryptoCombo` 等仍可能使用 `vector-effect`；与 EgIcon 管线分离，153 验证后统一评估。
