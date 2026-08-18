# @eds-evergreen/desktop

EverGreen Design System (Desktop) — **one npm package**, five pillars:

| Subpath | Contents |
|---------|----------|
| `@eds-evergreen/desktop/tokens` | Design tokens (CSS variables, fonts, motion) |
| `@eds-evergreen/desktop/animations` | Scene animations (`EgVerifyRingDots`, `EgDoneTick`, …) |
| `@eds-evergreen/desktop/components` | Vue 3 UI components |
| `@eds-evergreen/desktop/patterns` | Page-level compositions (expanding) |
| `@eds-evergreen/desktop/workflows` | Business workflows (expanding) |

**Docs:** [Consumer guide](https://github.com/theyangsong/evergreen-design-system-desktop/blob/main/docs/npm-desktop.md) · [Showcase](https://theyangsong.github.io/evergreen-design-system-desktop/)

## Changelog

### 0.1.1

- **Fix:** `EgIcon` stroke icons — `processSvg` injects `vector-effect="non-scaling-stroke"` on each stroke shape (stable at 16/20/24px display; no consumer CSS workaround needed).
- Animations extracted to `@eds/desktop-animations` inside the unified tarball.

### 0.1.0

- Initial public release (tokens, animations, components, patterns/workflows stubs).

## Install

```bash
pnpm add @eds-evergreen/desktop vue
# or
npm install @eds-evergreen/desktop vue
```

## Quick start

```ts
// app entry
import '@eds-evergreen/desktop/tokens';
import '@eds-evergreen/desktop/components/style.css';
import '@eds-evergreen/desktop/animations/style.css';
```

```vue
<script setup lang="ts">
import { EgButton, EgInput } from '@eds-evergreen/desktop/components';
import { EgVerifyRingDots } from '@eds-evergreen/desktop/animations';
</script>
```

## Tokens (granular imports)

```ts
import '@eds-evergreen/desktop/tokens/color/light';
import '@eds-evergreen/desktop/tokens/motion';
import { initCornerSmoothing } from '@eds-evergreen/desktop/tokens/corner-smoothing';
```

## Monorepo note

Inside `eds-desktop`, workspace packages (`@eds/desktop-tokens`, `@eds/desktop-components`, …) are **private** build inputs. Only `@eds-evergreen/desktop` is published to npm.

Build the unified tarball:

```bash
pnpm build:desktop
pnpm --filter @eds-evergreen/desktop publish --access public --no-git-checks
```
