import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { evergreenTokensDevPlugin } from './plugins/evergreen-tokens-dev';

const repoRoot = resolve(__dirname, '../..');
const tokensRoot = resolve(repoRoot, 'packages/tokens');

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [vue(), ...(mode === 'development' ? [evergreenTokensDevPlugin()] : [])],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@blocksuite/icons/lit': resolve(__dirname, 'src/shims/blocksuite-icons-lit.ts'),
      ...(mode === 'development'
        ? {
            '@evergreen/tokens/liquid-glass': resolve(tokensRoot, 'src/liquid-glass.js'),
            '@evergreen/tokens/corner-smoothing': resolve(tokensRoot, 'src/corner-smoothing.js'),
          }
        : {}),
    },
  },
  optimizeDeps: {
    exclude: ['@evergreen/tokens'],
    include: [
      '@blocksuite/presets',
      '@blocksuite/blocks',
      '@blocksuite/store',
      '@blocksuite/block-std',
    ],
    esbuildOptions: {
      alias: {
        '@blocksuite/icons/lit': resolve(__dirname, 'src/shims/blocksuite-icons-lit.ts'),
      },
    },
  },
  build: {
    target: 'es2022',
  },
  css: {
    devSourcemap: true,
    modules: {
      generateScopedName:
        mode === 'production' ? '[name]__[local]___[hash:base64:5]' : '[name]__[local]',
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: [repoRoot],
    },
    watch: {
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/packages/tokens/dist/**',
      ],
    },
  },
}));
