import './styles/global.css';
import { initEdsDesktopRuntime } from './setup/initEdsDesktopRuntime';

initEdsDesktopRuntime();

export * from './atoms';
export * from './text';
export * from './molecules';
export * from './organisms';
export * from './templates';
export * from './pages';

export {
  applyTheme,
  getPreferredTheme,
  toggleTheme,
  type ThemeMode,
} from './composables/useTheme';

export { initThemeProvider, useThemeProvider } from './composables/useThemeProvider';

export {
  initEdsDesktopRuntime,
  initCornerSmoothing,
  rescanCornerSmoothing,
} from './setup/initEdsDesktopRuntime';
