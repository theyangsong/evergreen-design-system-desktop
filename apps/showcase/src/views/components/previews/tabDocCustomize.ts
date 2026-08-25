import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import {
  countSelectOptions,
  inputSizeRows,
  propLabelRows,
  showcaseInputCustomizeFieldLabels,
  showcaseTabShapeLabels,
  widthModeAdaptiveFixedRows,
} from '@/data/showcasePropLabels';

export const segmentedImportCode = `import { EgSegmented } from '@eds/desktop-components';`;
export const tabsImportCode = `import { EgTabs } from '@eds/desktop-components';`;

export const segmentedPropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'number', defaultValue: '0', description: '当前选中项索引。' },
  { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸。' },
  { name: 'shape', type: "'circle' | 'square'", defaultValue: "'circle'", description: '圆角 / 方角容器。' },
  { name: 'labels', type: 'string[]', defaultValue: "['Tab','Tab','Tab']", description: '分段标签文案。' },
  {
    name: 'itemWidthMode',
    type: "'adaptive' | 'fixed'",
    defaultValue: "'adaptive'",
    description: 'Item 宽度：adaptive=内容 hug；fixed=父级定宽后均分。',
  },
  {
    name: 'width',
    type: 'number',
    defaultValue: 'undefined',
    description: 'itemWidthMode=fixed 时可选容器宽度（px）；未传则 100% 跟随父级。',
  },
];

export const tabsPropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'number', defaultValue: '0', description: '当前选中 Tab 索引。' },
  { name: 'labels', type: 'string[]', defaultValue: "['Tab','Tab','Tab','Tab','Tab']", description: 'Tab 文案列表。' },
  {
    name: 'horizontalGap',
    type: "'xl' | 'md' | 'sm' | 'xs'",
    defaultValue: "'xl'",
    description:
      '水平间距：xl → gap var(--spacing-5)；md → var(--spacing-4)；sm → var(--spacing-3)；xs → var(--spacing-2)。',
  },
  {
    name: 'verticalGap',
    type: "'xl' | 'md' | 'sm' | 'xs'",
    defaultValue: "'xl'",
    description:
      '垂直间距（padding-bottom，含指示条 stroke-xl）：xl → spacing-2-5；md → spacing-2；sm → spacing-1-5；xs → spacing-1。',
  },
];

export type TabsSpacingSize = 'xl' | 'md' | 'sm' | 'xs';

export const tabsSpacingSizeOptions = [
  { value: 'xl', label: 'Xl' },
  { value: 'md', label: 'Md' },
  { value: 'sm', label: 'Sm' },
  { value: 'xs', label: 'Xs' },
] as const;

const countOptions = countSelectOptions(10, 2);

/** Parse space-separated labels; pad/trim to `count`. */
export function resolveTabLabels(labelsRaw: unknown, countRaw: unknown, fallback = 'Tab'): string[] {
  const count = Math.max(1, Number(countRaw) || 3);
  const parts = String(labelsRaw ?? '')
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  const labels: string[] = [];
  for (let i = 0; i < count; i += 1) {
    labels.push(parts[i] ?? fallback);
  }
  return labels;
}

export const segmentedCustomizeDefaults = {
  size: 'md',
  shape: 'circle',
  itemWidthMode: 'adaptive' as 'adaptive' | 'fixed',
  width: '222',
  count: '3',
  labels: 'Tab Tab Tab',
};

export const segmentedCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'shape',
    label: '形状',
    options: propLabelRows(['circle', 'square'] as const, showcaseTabShapeLabels).map((row) => ({
      value: row.key,
      label: row.label,
    })),
  },
  {
    kind: 'select',
    key: 'itemWidthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: widthModeAdaptiveFixedRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'text',
    key: 'width',
    label: '容器宽度',
    placeholder: 'px，如 222',
    visibleWhen: (state) => String(state.itemWidthMode) === 'fixed',
  },
  {
    kind: 'select',
    key: 'count',
    label: '数量',
    options: countOptions,
  },
  {
    kind: 'text',
    key: 'labels',
    label: '标签名',
    placeholder: '用空格分隔，如 Tab Home Settings',
  },
];

export const tabsCustomizeDefaults = {
  count: '5',
  labels: 'Tab Tab Tab Tab Tab',
  horizontalGap: 'xl' as TabsSpacingSize,
  verticalGap: 'xl' as TabsSpacingSize,
};

export const tabsCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'count',
    label: '数量',
    options: countOptions,
  },
  {
    kind: 'text',
    key: 'labels',
    label: '标签名',
    placeholder: '用空格分隔，如 Overview Assets History',
  },
  {
    kind: 'select',
    key: 'horizontalGap',
    label: '水平间距',
    options: tabsSpacingSizeOptions.map((option) => ({ ...option })),
  },
  {
    kind: 'select',
    key: 'verticalGap',
    label: '垂直间距',
    options: tabsSpacingSizeOptions.map((option) => ({ ...option })),
  },
];

function formatLabelsLiteral(labels: string[]): string {
  return `[${labels.map((label) => `'${label.replace(/'/g, "\\'")}'`).join(', ')}]`;
}

export function buildSegmentedUsageSnippet(state: Record<string, unknown>): string {
  const labels = resolveTabLabels(state.labels, state.count);
  const parts = [`v-model="selected"`];
  if (state.size !== 'md') parts.push(`size="${String(state.size)}"`);
  if (state.shape !== 'circle') parts.push(`shape="${String(state.shape)}"`);
  if (state.itemWidthMode === 'fixed') {
    parts.push('item-width-mode="fixed"');
    const width = Number.parseInt(String(state.width ?? ''), 10);
    if (Number.isFinite(width) && width > 0) {
      parts.push(`:width="${width}"`);
    }
  }
  parts.push(`:labels="${formatLabelsLiteral(labels)}"`);
  return `<EgSegmented\n  ${parts.join('\n  ')}\n/>`;
}

export function buildTabsUsageSnippet(state: Record<string, unknown>): string {
  const labels = resolveTabLabels(state.labels, state.count);
  const parts = ['v-model="selected"', `:labels="${formatLabelsLiteral(labels)}"`];
  if (state.horizontalGap !== 'xl') {
    parts.push(`horizontal-gap="${String(state.horizontalGap)}"`);
  }
  if (state.verticalGap !== 'xl') {
    parts.push(`vertical-gap="${String(state.verticalGap)}"`);
  }
  return `<EgTabs\n  ${parts.join('\n  ')}\n/>`;
}
