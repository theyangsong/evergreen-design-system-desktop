import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    if (process.env.VITE_BASE_PATH) {
      config.base = process.env.VITE_BASE_PATH;
    }
    return config;
  },
};

export default config;
