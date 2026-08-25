import vue from '@vitejs/plugin-vue';
import prefixSelector from 'postcss-prefix-selector';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

const repoRoot = resolve(__dirname, '../..');
const tokensSpecDir = resolve(repoRoot, 'packages/tokens/spec');
const tokensDistDir = resolve(repoRoot, 'packages/tokens/dist');
const componentsSrcDir = resolve(repoRoot, 'packages/components/src');
const animationsSrcDir = resolve(repoRoot, 'packages/animations/src');
const tokensBuildScript = resolve(repoRoot, 'packages/tokens/scripts/build.mjs');

/** spec 变更 → 重建 dist → full-reload；dist/css 外部重建 → full-reload；components 走 alias + HMR。 */
function watchDesktopTokens(): Plugin {
  let building = false;
  let queued = false;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let distReloadTimer: ReturnType<typeof setTimeout> | undefined;

  function scheduleFullReload(server: { ws: { send: (payload: unknown) => void } }) {
    clearTimeout(distReloadTimer);
    distReloadTimer = setTimeout(() => {
      server.ws.send({ type: 'full-reload' });
    }, 120);
  }

  function runTokenBuild(server: { ws: { send: (payload: unknown) => void } }) {
    if (building) {
      queued = true;
      return;
    }

    building = true;
    const child = spawn(process.execPath, [tokensBuildScript], {
      cwd: resolve(repoRoot, 'packages/tokens'),
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      building = false;
      if (code === 0) {
        scheduleFullReload(server);
      } else {
        console.error('[watch-desktop-tokens] build failed');
      }
      if (queued) {
        queued = false;
        runTokenBuild(server);
      }
    });
  }

  return {
    name: 'watch-desktop-tokens',
    configureServer(server) {
      server.watcher.add(tokensSpecDir);
      server.watcher.add(tokensDistDir);
      server.watcher.add(componentsSrcDir);
      server.watcher.add(animationsSrcDir);

      server.watcher.on('change', (file) => {
        if (file.startsWith(tokensSpecDir)) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => runTokenBuild(server), 200);
          return;
        }

        if (
          !building &&
          file.startsWith(tokensDistDir) &&
          (file.endsWith('.css') || file.endsWith('.json'))
        ) {
          scheduleFullReload(server);
          return;
        }

        if (file.startsWith(componentsSrcDir) && /\.(vue|css)$/.test(file)) {
          scheduleFullReload(server);
          return;
        }

        if (file.startsWith(animationsSrcDir) && /\.(vue|css)$/.test(file)) {
          scheduleFullReload(server);
        }
      });
    },
  };
}

function scopeDesktopTokens() {
  return prefixSelector({
    prefix: '.desktopTokens',
    includeFiles: [/desktop-token-scope\.css$/, /desktop-components-scope\.css$/],
    transform(_prefix, selector, prefixedSelector) {
      if (/^\[data-theme=["']?dark["']?\]\s+/.test(selector)) {
        return selector.replace(
          /^\[data-theme=["']?dark["']?\]/,
          '[data-theme="dark"] .desktopTokens',
        );
      }

      if (/^\[data-theme=["']?light["']?\]\s+/.test(selector)) {
        return selector.replace(
          /^\[data-theme=["']?light["']?\]/,
          '[data-theme="light"] .desktopTokens',
        );
      }

      if (selector === '[data-theme="dark"]' || selector === '[data-theme=dark]') {
        return '[data-theme="dark"] .desktopTokens';
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
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [vue(), watchDesktopTokens()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Dev/HMR：走组件源码 + 各 SFC 的 CSS Modules，避免 dist/index.css 与 dist JS 哈希不同步
      '@eds/desktop-components': resolve(__dirname, '../../packages/components/src/index.ts'),
      '@eds/desktop-animations': resolve(__dirname, '../../packages/animations/src/index.ts'),
    },
  },
  css: {
    postcss: {
      plugins: [scopeDesktopTokens()],
    },
  },
  optimizeDeps: {
    exclude: ['@eds/desktop-components', '@eds/desktop-animations'],
  },
  server: {
    host: true,
    port: 5177,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname), resolve(__dirname, '../../..')],
    },
    watch: {
      ignored: [
        '**/node_modules/**',
        '!**/packages/components/**',
        '!**/packages/animations/**',
        '!**/packages/tokens/dist/**',
        '!**/packages/tokens/spec/**',
      ],
    },
  },
});
