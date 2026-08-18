# EgIcon 线稿描边缩放

## 现行方案（2026-08-14 稳定版）

EgIcon 将 **32×32 viewBox** 缩放到 16/20/24px。线稿 path 源稿保留 **`stroke-width="1.4"`**（inline attribute）。

### 实现

1. **`processSvg`**：path 打 `eds-i-s`，保留 inline `stroke-width`，只剥 token 色值
2. **`Icon.module.css`**：

```css
.tokenKind :global(.eds-i-s) {
  stroke: currentColor;
  vector-effect: non-scaling-stroke;
}
```

**不要**在 CSS 里再写 `stroke-width: var(--stroke-lg)`——会与 inline 1.4 双源，Chrome 下易偏细。

3. **`Icon.vue`**：无运行时 JS

### 与 8/18 实验的区别

8/18 晚间多次改动（CSS var、attribute-only、ResizeObserver）均已回退。以 **eb3b0c3（8/14）** 为准。

## 业务侧

- 勿在 `.eds-i-s` 上写 `stroke:`（会重置 stroke-width）
- 改色用父级 `color`
- Detail 行首 1.1px：仅覆写 `stroke-width: var(--stroke-md)`
