import { createApp } from 'vue';
import { applyTheme, rescanCornerSmoothing } from '@eds/desktop-components';
import App from './App.vue';
import { router } from './router';
import { installGlobalWheelScrollContainment } from './composables/scrollContainment';
import './styles/global.css';
import './styles/desktop-motion-global.css';
import './styles/desktop-token-scope.css';
import './styles/desktop-components-scope.css';

installGlobalWheelScrollContainment();

applyTheme('light');

const app = createApp(App).use(router);

app.mount('#app');

router.afterEach(() => {
  requestAnimationFrame(() => {
    rescanCornerSmoothing();
  });
});
