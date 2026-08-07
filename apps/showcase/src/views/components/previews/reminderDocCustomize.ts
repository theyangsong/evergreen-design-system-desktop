import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import {
  buttonToneRows,
  propLabelSelectOptions,
  showcaseComboPopupCountLabels,
  showcaseReminderTypeLabels,
} from '@/data/showcasePropLabels';

export const reminderFigmaNode = '2769:8357';

export type ReminderSymbolBackground = 'default' | 'danger' | 'success';

export function buildReminderSymbolStyle(
  symbolBackground: ReminderSymbolBackground | string,
): Record<string, string> | undefined {
  if (symbolBackground === 'danger') {
    return {
      '--eds-reminder-symbol-bg': 'var(--status-danger)',
      '--eds-reminder-symbol-color': 'var(--stroke-same-white-primary)',
    };
  }

  if (symbolBackground === 'success') {
    return {
      '--eds-reminder-symbol-bg': 'var(--status-success)',
      '--eds-reminder-symbol-color': 'var(--stroke-same-white-primary)',
    };
  }

  return undefined;
}

export const reminderCustomizeDefaults = {
  type: 'info' as 'info' | 'echo',
  title: 'Title',
  secondaryText: 'I am text',
  symbolIcon: 'eds-warning-lonely',
  symbolBackground: 'default' as 'default' | 'danger' | 'success',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  actionCount: '2',
  showClear: false,
  clearLabel: 'Clear',
  toolbarTone: 'decor',
  echoSlotText: 'Echo slot content\n\nScroll to preview frosted toolbar blur.',
};

export const reminderCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '类型',
    options: propLabelSelectOptions(['info', 'echo'] as const, showcaseReminderTypeLabels),
  },
  { kind: 'text', key: 'title', label: '标题' },
  { kind: 'text', key: 'secondaryText', label: '副文案' },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: '符号',
    placeholder: 'eds-warning-lonely',
    visibleWhen: (state) => state.type === 'info',
  },
  {
    kind: 'select',
    key: 'symbolBackground',
    label: '背景色',
    options: [
      { value: 'default', label: '默认' },
      { value: 'danger', label: '危险' },
      { value: 'success', label: '成功' },
    ],
    visibleWhen: (state) => state.type === 'info',
  },
  {
    kind: 'text',
    key: 'echoSlotText',
    label: 'Echo 槽文案',
    visibleWhen: (state) => state.type === 'echo',
  },
];

export const reminderInfoActionCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'confirmLabel', label: '确认文案' },
  { kind: 'text', key: 'cancelLabel', label: '取消文案' },
  {
    kind: 'select',
    key: 'actionCount',
    label: '按钮数',
    options: [
      { value: '2', label: showcaseComboPopupCountLabels['2'] },
      { value: '1', label: showcaseComboPopupCountLabels['1'] },
    ],
  },
  {
    kind: 'select',
    key: 'toolbarTone',
    label: '按钮 Tone',
    options: buttonToneRows.map((row) => ({ value: row.key, label: row.label })),
  },
];

export const reminderEchoToolbarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'confirmLabel', label: '确认文案' },
  { kind: 'text', key: 'cancelLabel', label: '取消文案' },
  { kind: 'boolean', key: 'showClear', label: '显示 Clear' },
  {
    kind: 'text',
    key: 'clearLabel',
    label: 'Clear 文案',
    visibleWhen: (state) => Boolean(state.showClear),
  },
  {
    kind: 'select',
    key: 'toolbarTone',
    label: '按钮 Tone',
    options: buttonToneRows.map((row) => ({ value: row.key, label: row.label })),
  },
];

export const reminderPropRows = [
  { name: 'type', type: "'info' | 'echo'", defaultValue: "'info'", description: 'Info：图标 + 居中文案 + PopupWindow；Echo：Title/Bar + 槽 + Flotation 工具栏。' },
  { name: 'title', type: 'string', defaultValue: "'Title'", description: 'Info：Body Large Strong；Echo：Title 角色。' },
  { name: 'secondaryText', type: 'string', defaultValue: "'I am text'", description: 'Info：Body Small；Echo：Bar 角色。' },
  { name: 'showSecondaryText', type: 'boolean', defaultValue: 'true', description: '是否展示副文案。' },
  { name: 'confirmLabel', type: 'string', defaultValue: "'Confirm'", description: '确认按钮文案。' },
  { name: 'cancelLabel', type: 'string', defaultValue: "'Cancel'", description: '取消按钮文案（Echo / 双按钮 Info）。' },
  { name: 'actionCount', type: '1 | 2', defaultValue: '2', description: 'Info · EgComboActionPopupWindow 按钮数。' },
  { name: 'showClear', type: 'boolean', defaultValue: 'false', description: 'Echo · 工具栏左侧 Clear。' },
  { name: 'clearLabel', type: 'string', defaultValue: "'Clear'", description: 'Echo · Clear 文案。' },
  { name: 'toolbarTone', type: "'brand' | 'decor'", defaultValue: "'decor'", description: '操作区按钮 Tone。' },
];
