import type { Meta, StoryObj } from '@storybook/vue3';
import { EgIcon, iconNames } from '@evergreen/components';

const meta = {
  title: 'Components/Icon',
  component: EgIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    name: 'check',
    size: 'md',
  },
} satisfies Meta<typeof EgIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllIcons: Story = {
  render: () => ({
    components: { EgIcon },
    setup() {
      return { iconNames };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <div
          v-for="name in iconNames"
          :key="name"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 72px;"
        >
          <EgIcon :name="name" size="lg" :label="name" />
          <span style="font-size: 12px; color: var(--text-base-secondary);">{{ name }}</span>
        </div>
      </div>
    `,
  }),
};
