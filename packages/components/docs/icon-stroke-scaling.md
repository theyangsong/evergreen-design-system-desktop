# EgIcon 线稿描边缩放（Chrome 兼容）

## 背景

EgIcon 将 **32×32 viewBox** 的 SVG 用 CSS 缩放到 token 尺寸（16 / 20 / 24px）。线稿 path 源稿 `stroke-width="1.4"` 对应设计 token `--stroke-lg`（1.4px）。

若不做补偿，显示 16px 时描边约为 `1.4 × 16/32 = 0.7px`，Chrome / Safari 都会偏细。

## 曾尝试且失败的方案

| 方案 | 问题 |
|------|------|
| CSS `stroke-width: var(--stroke-lg)` + `vector-effect: non-scaling-stroke` 打在 `.eds-i-s` | Showcase 的 `.desktopTokens` scope 下，Chrome 对 **v-html 注入的 SVG** 应用 CSS 变量不稳定 |
| path 上写 `stroke-width="1.4"` + `vector-effect="non-scaling-stroke"` attribute | Chrome 在 **CSS 缩放 SVG** 时对 `non-scaling-stroke` 仍渲染偏细；Safari 正常 |
| 去掉 inline `stroke-width`，仅 CSS 控制 | 同上，Chrome 更不可靠 |

**结论：** EgIcon 不能依赖 `non-scaling-stroke`，也不能依赖 scoped 的 `var(--stroke-lg)` 作用到 v-html 内 path。

## 现行方案（已验证 Chrome + Safari）

**按实际显示像素反算 SVG user-space 描边宽度**，使屏上恒为 **1.4px**（不改 token 值、不加粗）。

### 公式

```
stroke_user = 1.4 × 32 / displayPx
```

| 显示尺寸 | displayPx | stroke_user |
|----------|-----------|-------------|
| sm (`--icon-md`) | 16 | 2.8 |
| md (`--icon-lg`) | 20 | 2.24 |
| lg (`--icon-xl`) | 24 | ~1.87 |
| `fit`（随父容器） | 实测 | 动态 |

### 实现分工

1. **`processSvg.ts`**（token 线稿）
   - path 打 `class="eds-i-s"`
   - 写 `stroke="currentColor"`、`fill="none"`
   - **不写** `stroke-width`、`vector-effect`

2. **`Icon.vue`**
   - `ResizeObserver` 量宿主宽度（支持 `fit`）
   - 内联 style：`--eds-icon-stroke-user: <computed>`

3. **`Icon.module.css`**
   ```css
   .svgHost :global(.eds-i-s) {
     fill: none;
     stroke: currentColor;
     stroke-width: var(--eds-icon-stroke-user, 2.24);
   }
   ```

4. **`iconRegistry.ts`**
   - `PROCESSED_ICON_CACHE_VERSION` 在 `processSvg` 输出变更时 bump，避免 dev 长会话缓存旧 markup

### DevTools 验收

Chrome 点开线稿 path（如 `eds-add`）：

- 父级 `span` 有 `--eds-icon-stroke-user`
- Computed `stroke-width` 为上述 user 值（非 1.4）
- **无** `vector-effect`

## 适用范围

- **EgIcon token 单色线稿**（`eds-*` stroke 图标）
- **不适用**：fill 实心图标、fixed 多色图标（保留源稿 stroke-width）

## Showcase 手写 SVG

Showcase 内非 EgIcon 的示例 SVG 仍可用 CSS：

```css
stroke-width: var(--stroke-lg);
vector-effect: non-scaling-stroke;
```

需在 **每个 path/line** 上单独设置（`vector-effect` 不继承）。

## Consumer 清理

业务侧若曾为补偿 DS 在 `global.css` 等处 duplicate `.eds-i-s` 规则，DS 修复确认后可删除，只保留 EgIcon 内置逻辑。

本地 consumer（如 `work-cregis-desktop`）通过 `link:` + Vite alias 读 `../eds-desktop/packages/components/src`，**无需 npm 版本**即可生效。
