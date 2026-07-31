import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';

export const dividerCustomizeDefaults = {
  type: 'module',
  direction: 'horizontal',
  hide: false,
} as const;

export const dividerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '类型 type',
    options: [
      { value: 'module', label: '模块 Module' },
      { value: 'page', label: '页面 Page' },
      { value: 'navigator', label: '导航 Navigator' },
    ],
  },
  {
    kind: 'select',
    key: 'direction',
    label: '方向 direction',
    options: [
      { value: 'horizontal', label: '水平 Horizontal' },
      { value: 'vertical', label: '垂直 Vertical' },
    ],
  },
  { kind: 'boolean', key: 'hide', label: '隐藏 hide' },
];

export function buildDividerUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgDivider', state, {
    defaults: dividerCustomizeDefaults,
  });
}
