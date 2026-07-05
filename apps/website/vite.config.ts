import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@blocksuite/icons/lit': resolve(__dirname, 'src/shims/blocksuite-icons-lit.ts'),
    },
  },
  optimizeDeps: {
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
    modules: {
      // Dev: readable names like AppRail__rail (no hash).
      // Prod: keep hash to avoid cross-file collisions.
      generateScopedName:
        mode === 'production' ? '[name]__[local]___[hash:base64:5]' : '[name]__[local]',
    },
  },
  server: {
    port: 5173,
  },
}));
