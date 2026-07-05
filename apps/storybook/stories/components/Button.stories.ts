import type { Meta, StoryObj } from '@storybook/vue3';
import { EgButton } from '@evergreen/components';

const meta = {
  title: 'Components/Button',
  component: EgButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    default: 'Button',
  },
} satisfies Meta<typeof EgButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { EgButton },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <EgButton size="sm">Small</EgButton>
        <EgButton size="md">Medium</EgButton>
        <EgButton size="lg">Large</EgButton>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
