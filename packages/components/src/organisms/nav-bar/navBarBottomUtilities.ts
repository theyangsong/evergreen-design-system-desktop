export type NavBarBottomUtilityPreset = {
  label: string;
  icon: string;
  focusIcon: string;
};

/** Nav Bar 底部工具区默认 icon（声明式 / Showcase 预览一致）。 */
export const navBarDefaultBottomUtilities: NavBarBottomUtilityPreset[] = [
  { label: 'Notice', icon: 'eds-notice', focusIcon: 'eds-notice-fill' },
  { label: 'Earphone', icon: 'eds-earphone', focusIcon: 'eds-earphone-fill' },
  { label: 'Lock', icon: 'eds-interface-lock', focusIcon: 'eds-interface-lock-fill' },
];
