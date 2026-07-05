# EverGreen Design System (Desktop)

Vue 3 design system with CSS Modules, Figma-synced design tokens, and Storybook documentation.

## Requirements

- Node.js 20+
- pnpm 9+

## Quick start

```bash
pnpm install
pnpm build:tokens
pnpm build:components
pnpm dev                # 文档站 → http://localhost:5173
pnpm dev:storybook      # Storybook → http://localhost:6006
```

## Project structure

```
evergreen-design-system-desktop/
├── packages/
│   ├── tokens/          # Design tokens (spec → CSS)
│   └── components/      # Vue 3 components (CSS Modules)
├── apps/
│   ├── storybook/       # 组件文档 + 设计规范（Storybook）
│   └── website/         # 设计系统文档站（面向设计/产品/开发）
└── figma.config.json    # Figma file configuration
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Storybook |
| `pnpm build` | Build all packages |
| `pnpm build:tokens` | Build CSS variables from tokens |
| `pnpm build:components` | Build Vue component library |
| `pnpm sync:tokens` | Figma token sync helper |

## Figma integration

Linked file: [EverGreen Design System (Desktop)](https://www.figma.com/design/OkYrDmatUWtgw9n1uVHt6v/EverGreen-Design-System--Desktop-)

| Field | Value |
|-------|-------|
| fileKey | `OkYrDmatUWtgw9n1uVHt6v` |
| Variable collections | Color System, Scale System |

1. Open the Figma file above
2. Compare Figma variables with `packages/tokens/spec/*.json`
3. Update the relevant spec files
4. Run `pnpm build:tokens` to regenerate CSS variables

Check sync status: `pnpm sync:tokens`

## License

MIT
