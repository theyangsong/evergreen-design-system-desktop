import { createApp } from 'vue';
import { applyTheme } from '@eds/website-components';
import { rescanCornerSmoothing } from '@eds/desktop-components';
import App from './App.vue';
import { router } from './router';
import { installGlobalWheelScrollContainment } from './composables/scrollContainment';
import './styles/global.css';
import './styles/desktop-motion-global.css';
import './styles/desktop-token-scope.css';

installGlobalWheelScrollContainment();

applyTheme('light');

const app = createApp(App).use(router);

app.mount('#app');

router.afterEach(() => {
  requestAnimationFrame(() => {
    rescanCornerSmoothing();
  });
});
