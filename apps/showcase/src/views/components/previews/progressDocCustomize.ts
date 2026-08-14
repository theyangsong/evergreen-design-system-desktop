import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';

export const progressCustomizeDefaults = {
  value: '39',
  showTooltip: true,
} as const;

export const progressCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'value',
    label: '进度',
    options: ['0', '10', '25', '39', '50', '75', '100'].map((value) => ({
      value,
      label: `${value}%`,
    })),
  },
  { kind: 'boolean', key: 'showTooltip', label: '显示气泡' },
];

export function buildProgressUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgProgress', state, {
    defaults: progressCustomizeDefaults,
  });
}
