# EgIcon 线稿描边缩放

## 方案（现行）

EgIcon 将 **32×32 viewBox** 缩放到 16/20/24px。线稿描边对应 `--stroke-lg`（1.4px）。

### 实现

1. **`processSvg`**：path 打 `class="eds-i-s"`，**保留** `stroke-width="1.4"` 等结构属性，只移除 `#020304` 等 token 色值
2. **`Icon.module.css`**：

```css
.tokenKind :global(.eds-i-s) {
  stroke: currentColor;
  stroke-width: var(--stroke-lg, 1.4px);
  vector-effect: non-scaling-stroke;
}
```

3. **`Icon.vue`**：无运行时 JS

### Pages fallback

Showcase 的 Desktop token 经 postcss 挂在 `.desktopTokens` 下。极少数生产构建场景 `--stroke-lg` 未继承到 v-html 内 path 时，`1.4px` fallback 保证描边仍精准，**不加粗**。

## 不要做的事

| 已证伪 | 原因 |
|--------|------|
| ResizeObserver 反算 `--eds-icon-stroke-user` | 运行时补丁，非正统 SVG 方案 |
| 去掉 inline `stroke-width` 只靠 CSS | 本地 Chrome 回归变细 |
| 全 attribute `vector-effect` 替代 CSS | 未解决 Chrome，还引入双源歧义 |

## 本地 consumer

`work-cregis-desktop` 通过 `link:` + Vite alias 读源码，token 全局可用，无需 npm 版本。
