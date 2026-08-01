import vue from '@vitejs/plugin-vue';
import prefixSelector from 'postcss-prefix-selector';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function scopeDesktopTokens() {
  return prefixSelector({
    prefix: '.desktopTokens',
    includeFiles: [/desktop-token-scope\.css$/, /desktop-components-scope\.css$/],
    transform(_prefix, selector, prefixedSelector) {
      if (/^\[data-theme=["']?dark["']?\]\s+/.test(selector)) {
        return selector.replace(
          /^\[data-theme=["']?dark["']?\]/,
          'html[data-theme="dark"] .desktopTokens',
        );
      }

      if (/^\[data-theme=["']?light["']?\]\s+/.test(selector)) {
        return selector.replace(
          /^\[data-theme=["']?light["']?\]/,
          'html[data-theme="light"] .desktopTokens',
        );
      }

      if (selector === '[data-theme="dark"]' || selector === '[data-theme=dark]') {
        return 'html[data-theme="dark"] .desktopTokens';
      }

      if (
        selector === ':root' ||
        selector.startsWith(':root,') ||
        selector.includes('[data-theme="light"]') ||
        selector.includes('[data-theme=light]')
      ) {
        return '.desktopTokens';
      }

      if (selector === 'body') {
        return '.desktopTokens';
      }

      if (selector === 'input' || selector === 'textarea' || selector === 'button') {
        return `.desktopTokens ${selector}`;
      }

      if (selector === '.desktopTokens' || selector.startsWith('.desktopTokens ')) {
        return selector;
      }

      return prefixedSelector;
    },
  });
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Dev/HMR：走组件源码 + 各 SFC 的 CSS Modules，避免 dist/index.css 与 dist JS 哈希不同步
      '@eds/desktop-components': resolve(__dirname, '../../packages/components/src/index.ts'),
    },
  },
  css: {
    postcss: {
      plugins: [scopeDesktopTokens()],
    },
  },
  optimizeDeps: {
    exclude: ['@eds/desktop-components'],
  },
  server: {
    host: true,
    port: 5177,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname), resolve(__dirname, '../../..')],
    },
    watch: {
      ignored: ['**/node_modules/**', '!**/packages/components/**'],
    },
  },
});
