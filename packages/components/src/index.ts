import './styles/global.css';

export { EgButton } from './components/Button';
export type { ButtonVariant, ButtonSize } from './components/Button';

export { EgTypography } from './components/Typography';
export type { TypographyVariant, TypographyTag } from './components/Typography';

export { EgIcon, iconNames } from './components/Icon';
export type { IconName } from './components/Icon';

export {
  applyTheme,
  getPreferredTheme,
  toggleTheme,
  type ThemeMode,
} from './composables/useTheme';

export { initThemeProvider, useThemeProvider } from './composables/useThemeProvider';
