import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  inputSizeRows,
  propLabelRows,
  propLabelSelectOptions,
  showcaseTagColorfulStyleLabels,
  showcaseTagStatusLabels,
  showcaseTagSystemTypeLabels,
} from '@/data/showcasePropLabels';

export const tagImportCode = `import { EgTag } from '@eds/desktop-components';`;

const tagSizeProp: DocPropRow = {
  name: 'size',
  type: "'lg' | 'md' | 'sm'",
  defaultValue: "'md'",
  description: '尺寸；Sm 使用 Bar 字阶，Md/Lg 使用 Body Small Strong。',
};

export const tagSystemPropRows: DocPropRow[] = [
  tagSizeProp,
  {
    name: 'family',
    type: "'system'",
    defaultValue: "'system'",
    description: 'System 族 Tag。',
  },
  {
    name: 'systemType',
    type: "'subtle' | 'solid-brand' | 'solid-red' | 'gray' | 'stroke-subtle' | 'stroke-solid'",
    defaultValue: "'subtle'",
    description: 'System 类型变体。',
  },
];

export const tagStatusPropRows: DocPropRow[] = [
  tagSizeProp,
  {
    name: 'family',
    type: "'status'",
    defaultValue: "'status'",
    description: 'Status 族 Tag。',
  },
  {
    name: 'status',
    type: "'danger' | 'warning' | 'success' | 'ready' | 'invalid'",
    defaultValue: "'danger'",
    description: '语义色；来自 spec/color/tag-palette.json（display-p3）。',
  },
];

export const tagColorfulPropRows: DocPropRow[] = [
  tagSizeProp,
  {
    name: 'family',
    type: "'colorful'",
    defaultValue: "'colorful'",
    description: 'Colorful 族 Tag。',
  },
  {
    name: 'colorfulStyle',
    type: 'TagColorfulStyle',
    defaultValue: "'apricot'",
    description: '样式名；色板见 spec/color/tag-palette.json（Figma Status/Colorful）。',
  },
];

export const tagSystemCustomizeDefaults = {
  size: 'md',
  family: 'system',
  systemType: 'subtle',
  label: 'Tag',
} as const;

const tagColorfulStyleOptions = propLabelSelectOptions(
  [
    'apricot',
    'khaki',
    'grass',
    'sage',
    'cyan',
    'ice-blue',
    'periwinkle',
    'lilac',
    'orchid',
    'mallow',
    'rose',
    'coral',
    'mauve',
    'moss',
    'steel',
    'grape',
    'samewhite',
    'lime',
  ] as const,
  showcaseTagColorfulStyleLabels,
);

export const tagSystemCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'systemType',
    label: '类型',
    options: propLabelRows(
      [
        'subtle',
        'solid-brand',
        'solid-red',
        'gray',
        'stroke-subtle',
        'stroke-solid',
      ] as const,
      showcaseTagSystemTypeLabels,
    ).map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'label', label: '文案' },
];

export const tagStatusCustomizeDefaults = {
  size: 'md',
  family: 'status',
  status: 'danger',
  label: 'Tag',
} as const;

export const tagStatusCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'status',
    label: '状态',
    options: propLabelRows(
      ['danger', 'warning', 'success', 'ready', 'invalid'] as const,
      showcaseTagStatusLabels,
    ).map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'label', label: '文案' },
];

export const tagColorfulCustomizeDefaults = {
  size: 'sm',
  family: 'colorful',
  colorfulStyle: 'apricot',
  label: 'Tag',
} as const;

export const tagColorfulCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'colorfulStyle',
    label: '样式',
    options: tagColorfulStyleOptions,
  },
  { kind: 'text', key: 'label', label: '文案' },
];

function buildTagSnippet(state: Record<string, unknown>, defaults: Record<string, unknown>): string {
  const props: Record<string, unknown> = {
    size: state.size,
    family: state.family,
  };
  if (state.family === 'system') props.systemType = state.systemType;
  if (state.family === 'status') props.status = state.status;
  if (state.family === 'colorful') props.colorfulStyle = state.colorfulStyle;
  const label = String(state.label ?? 'Tag');
  const open = buildVueSelfClosingSnippet('EgTag', props, { defaults });
  return open.replace('/>', `>${label}</EgTag>`);
}

export function buildTagSystemUsageSnippet(state: Record<string, unknown>): string {
  return buildTagSnippet({ ...state, family: 'system' }, tagSystemCustomizeDefaults);
}

export function buildTagStatusUsageSnippet(state: Record<string, unknown>): string {
  return buildTagSnippet({ ...state, family: 'status' }, tagStatusCustomizeDefaults);
}

export function buildTagColorfulUsageSnippet(state: Record<string, unknown>): string {
  return buildTagSnippet({ ...state, family: 'colorful' }, tagColorfulCustomizeDefaults);
}
