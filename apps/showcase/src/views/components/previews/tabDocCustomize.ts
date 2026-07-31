import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';

export const segmentedControlImportCode = `import { EgSegmentedControl } from '@eds/desktop-components';`;
export const tabsImportCode = `import { EgTabs } from '@eds/desktop-components';`;

export const segmentedControlPropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'number', defaultValue: '0', description: '当前选中项索引。' },
  { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '尺寸。' },
  { name: 'shape', type: "'circle' | 'square'", defaultValue: "'circle'", description: '圆角 / 方角容器。' },
  { name: 'labels', type: 'string[]', defaultValue: "['Tab','Tab','Tab']", description: '分段标签文案。' },
];

export const tabsPropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'number', defaultValue: '0', description: '当前选中 Tab 索引。' },
  { name: 'labels', type: 'string[]', defaultValue: "['Tab','Tab','Tab','Tab','Tab']", description: 'Tab 文案列表。' },
];

const countOptions = [
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
];

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

export const segmentedControlCustomizeDefaults = {
  size: 'md',
  shape: 'circle',
  count: '3',
  labels: 'Tab Tab Tab',
};

export const segmentedControlCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸 size',
    options: [
      { value: 'lg', label: 'Lg' },
      { value: 'md', label: 'Md' },
      { value: 'sm', label: 'Sm' },
    ],
  },
  {
    kind: 'select',
    key: 'shape',
    label: '类型 shape',
    options: [
      { value: 'circle', label: 'Circle' },
      { value: 'square', label: 'Square' },
    ],
  },
  {
    kind: 'select',
    key: 'count',
    label: '数量 count',
    options: countOptions,
  },
  {
    kind: 'text',
    key: 'labels',
    label: '名称 labels',
    placeholder: '用空格分隔，如 Tab Home Settings',
  },
];

export const tabsCustomizeDefaults = {
  count: '5',
  labels: 'Tab Tab Tab Tab Tab',
};

export const tabsCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'count',
    label: '数量 count',
    options: countOptions,
  },
  {
    kind: 'text',
    key: 'labels',
    label: '名称 labels',
    placeholder: '用空格分隔，如 Overview Assets History',
  },
];

function formatLabelsLiteral(labels: string[]): string {
  return `[${labels.map((label) => `'${label.replace(/'/g, "\\'")}'`).join(', ')}]`;
}

export function buildSegmentedControlUsageSnippet(state: Record<string, unknown>): string {
  const labels = resolveTabLabels(state.labels, state.count);
  const parts = [`v-model="selected"`];
  if (state.size !== 'md') parts.push(`size="${String(state.size)}"`);
  if (state.shape !== 'circle') parts.push(`shape="${String(state.shape)}"`);
  parts.push(`:labels="${formatLabelsLiteral(labels)}"`);
  return `<EgSegmentedControl\n  ${parts.join('\n  ')}\n/>`;
}

export function buildTabsUsageSnippet(state: Record<string, unknown>): string {
  const labels = resolveTabLabels(state.labels, state.count);
  return `<EgTabs\n  v-model="selected"\n  :labels="${formatLabelsLiteral(labels)}"\n/>`;
}
