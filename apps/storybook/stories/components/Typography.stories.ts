import type { Meta, StoryObj } from '@storybook/vue3';
import { EgTypography } from '@evergreen/components';

const meta = {
  title: 'Components/Typography',
  component: EgTypography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'h3', 'body', 'body-sm', 'caption', 'code'],
    },
    muted: { control: 'boolean' },
  },
} satisfies Meta<typeof EgTypography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    variant: 'display',
    default: 'EverGreen Design System',
  },
};

export const AllVariants: Story = {
  render: () => ({
    components: { EgTypography },
    template: `
      <div style="display: grid; gap: 12px;">
        <EgTypography variant="display">Display</EgTypography>
        <EgTypography variant="h1">Heading 1</EgTypography>
        <EgTypography variant="h2">Heading 2</EgTypography>
        <EgTypography variant="h3">Heading 3</EgTypography>
        <EgTypography variant="body">Body text for paragraphs and general content.</EgTypography>
        <EgTypography variant="body-sm">Small body text for secondary information.</EgTypography>
        <EgTypography variant="caption">Caption text</EgTypography>
        <EgTypography variant="code">const theme = 'evergreen';</EgTypography>
        <EgTypography variant="body" muted>Muted secondary text</EgTypography>
      </div>
    `,
  }),
};
