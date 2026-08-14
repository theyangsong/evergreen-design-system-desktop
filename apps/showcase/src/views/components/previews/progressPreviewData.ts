import type { DocPropRow } from '@/views/shared/componentDoc/types';

export const progressImportCode = `import { EgProgress } from '@eds/desktop-components';`;

export const progressPropRows: DocPropRow[] = [
  {
    name: 'value',
    type: 'number',
    defaultValue: '0',
    description: '进度 0–100。',
  },
  {
    name: 'showTooltip',
    type: 'boolean',
    defaultValue: 'true',
    description: '是否在进度末端显示百分比气泡（eds-popover-fill）。',
  },
  {
    name: 'ariaLabel',
    type: 'string',
    defaultValue: "'进度'",
    description: 'progressbar 无障碍标签。',
  },
];
