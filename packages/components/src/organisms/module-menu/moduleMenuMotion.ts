/**
 * EgModuleMenuItem 交互动效契约（锁死，勿随 NavBar / 全局 Ease 默认漂移）。
 *
 * **语义**（由 `.motion-ease.is-asym` + `ModuleMenu.module.css` hover-only 覆盖实现）
 * - 悬浮：入场 600ms（`--motion-duration-hover-asym` / `eds-motion-5`），离场无过渡
 * - 点击、聚焦、选中：无过渡（CSS `transition: none`，非 motion-none）
 *
 * 禁止改为 `.motion-ease.is-hover` 或 `.motion-ease.is-focus`。
 */
export const MODULE_MENU_ITEM_MOTION = 'motion-ease is-asym' as const;
