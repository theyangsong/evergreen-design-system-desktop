# EgIcon 线稿描边缩放

## 参考实现：eds-doc

[`eds-doc`](../../../../../eds-doc) 的 `renderIconHtml.ts` 做法：

1. SVG 写显式 `width` / `height`（像素）
2. `stroke` / `stroke-width` 走 **presentation attribute**
3. **不用** `vector-effect: non-scaling-stroke`
4. **不用** CSS `stroke-width`

eds-doc 图标多为 **16×16 viewBox**；Desktop 为 **32×32**，缩到 16/20/24px 时需补偿 user-space 描边宽度。

## EgIcon 实现

| 层 | 职责 |
|----|------|
| `processSvg` | 剥 token 色值，打 `eds-i-s` / `eds-i-f`，保留结构属性 |
| `sizeIconMarkup` | 按显示像素设 `svg width/height`；`stroke="currentColor"`；`stroke-width = 1.4 × 32 / displayPx` |
| `Icon.vue` | `sm/md/lg` 用固定像素；`fit` 用 `ResizeObserver` 量容器 |
| `Icon.module.css` | 仅 fill token；**不写** stroke / vector-effect |

## 公式

```
stroke_user = 1.4 × 32 / displayPx
```

| size | px | stroke_user |
|------|-----|-------------|
| sm | 16 | 2.8 |
| md | 20 | 2.24 |
| lg | 24 | ~1.867 |

## 业务侧

- 勿在 `.eds-i-s` 写 `stroke:` 或 `stroke-width`
- 改色用父级 `color`
- Detail 行首 1.1px 等例外仍可在业务 CSS 覆写 `stroke-width`
