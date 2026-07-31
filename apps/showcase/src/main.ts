import { createApp } from 'vue';
import { applyTheme } from '@eds/website-components';
import { rescanCornerSmoothing } from '@eds/desktop-components';
import App from './App.vue';
import { router } from './router';
import './styles/global.css';
import './styles/desktop-token-scope.css';

applyTheme('light');

const app = createApp(App).use(router);

app.mount('#app');

router.afterEach(() => {
  requestAnimationFrame(() => {
    rescanCornerSmoothing();
  });
});
