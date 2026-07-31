import type { DocPropRow } from '@/views/shared/componentDoc/types';

export const dividerImportCode = `import { EgDivider } from '@eds/desktop-components';`;

export const dividerPropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'module' | 'page' | 'navigator'",
    defaultValue: "'module'",
    description:
      '分割线语义：Module（stroke-sm + stroke-divider-module）、Page（stroke-xs + stroke-divider-page）、Navigator（stroke-xs + stroke-base-quaternary）。',
  },
  {
    name: 'direction',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'",
    description: '方向；水平为通栏线，垂直为通高线（容器需有高度）。粗细随 type 而定（Module 为 sm，Page / Navigator 为 xs）。',
  },
  {
    name: 'hide',
    type: 'boolean',
    defaultValue: 'false',
    description: '为 true 时使用 stroke-hide，保留占位不显示线条（如 Combo 可选顶部分隔）。',
  },
];
