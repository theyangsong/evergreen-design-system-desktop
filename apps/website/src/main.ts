import { createApp } from 'vue';
import { applyTheme, type ThemeMode } from '@evergreen/components';
import App from './App.vue';
import { router } from './router';
import { initLiquidGlass } from '@evergreen/tokens/liquid-glass';
import './styles/global.css';

function getWebsiteTheme(): ThemeMode {
  const stored = localStorage.getItem('evergreen-theme') as ThemeMode | null;
  return stored === 'dark' ? 'dark' : 'light';
}

applyTheme(getWebsiteTheme());

createApp(App).use(router).mount('#app');
initLiquidGlass();
