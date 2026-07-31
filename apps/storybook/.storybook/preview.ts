import type { Preview } from '@storybook/vue3';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { initEdsDesktopRuntime } from '@eds/desktop-components';
import { initLiquidGlass } from '@eds/desktop-tokens/liquid-glass';
import '@eds/desktop-tokens';
import '@eds/desktop-components/style.css';

initLiquidGlass();
initEdsDesktopRuntime();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    layout: 'padded',
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
