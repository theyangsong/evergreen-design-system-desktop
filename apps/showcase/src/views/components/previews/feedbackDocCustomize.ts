import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  propLabelRows,
  showcaseFeedbackMessageTypeLabels,
  showcaseFeedbackToastTypeLabels,
  showcaseFormSubmissionTypeLabels,
} from '@/data/showcasePropLabels';

export const endFeedbackCardImportCode = `import { EgEndFeedbackCard } from '@eds/desktop-components';`;
export const toastImportCode = `import { EgToast } from '@eds/desktop-components';`;
export const messageImportCode = `import { EgMessage } from '@eds/desktop-components';`;
export const reddotImportCode = `import { EgReddot } from '@eds/desktop-components';`;
export const formSubmissionImportCode = `import { EgFormSubmission } from '@eds/desktop-components';`;

export const endFeedbackCardPropRows: DocPropRow[] = [
  { name: 'text', type: 'string', defaultValue: "'I am Text'", description: '卡片正文。' },
];

export const toastPropRows: DocPropRow[] = [
  { name: 'type', type: "'result' | 'danger'", defaultValue: "'result'", description: 'Toast 类型。' },
  { name: 'text', type: 'string', defaultValue: "'Connect to EDS'", description: '文案。' },
];

export const messagePropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'subtle' | 'brand' | 'danger'",
    defaultValue: "'subtle'",
    description:
      'Subtle：--material-card-moderate + --text-base-primary；Brand：--material-brand-primary + 白字；Danger：--status-danger + 白字。',
  },
  { name: 'text', type: 'string', defaultValue: "'0'", description: '文案或计数（Bar 11px / line-height 14px）。' },
  {
    name: 'focused',
    type: 'boolean',
    defaultValue: 'false',
    description:
      '行聚焦态；Module Menu item 聚焦时由父级 provide，亦可受控。聚焦时文案 --text-same-black-primary。',
  },
  {
    name: 'focusBackground',
    type: "'inherit' | 'same-white'",
    defaultValue: "'inherit'",
    description:
      '聚焦背景：inherit 保持 type 原色；same-white 为 --material-same-white-primary。Module Menu item 用 message-focus-background prop；#accessory 嵌套时写在 EgMessage 上。',
  },
];

export const reddotPropRows: DocPropRow[] = [
  {
    name: '—',
    type: '—',
    defaultValue: '—',
    description: 'Reddot 无 props，为 8px 危险色圆点。',
  },
];

export const formSubmissionPropRows: DocPropRow[] = [
  { name: 'type', type: "'notes' | 'danger' | 'success'", defaultValue: "'notes'", description: '表单反馈类型。' },
  { name: 'text', type: 'string', defaultValue: "'Connect to EDS'", description: '说明文案。' },
  {
    name: 'linkLabel',
    type: 'string',
    defaultValue: "'Button'",
    description: 'Notes 态链接文案（嵌套 EgLink size=sm）；Danger / Success 无链接。',
  },
  { name: 'href', type: 'string', defaultValue: "'#'", description: 'Notes 态链接地址。' },
  {
    name: 'showLink',
    type: 'boolean',
    defaultValue: 'true',
    description: '是否显示链接；仅 Notes 生效。',
  },
];

export const endFeedbackCardCustomizeDefaults = { text: 'I am Text' };
export const endFeedbackCardCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'text', label: '文案' },
];

export const toastCustomizeDefaults = { type: 'result', text: 'Connect to EDS' };
export const toastCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '类型',
    options: propLabelRows(['result', 'danger'] as const, showcaseFeedbackToastTypeLabels).map((row) => ({
      value: row.key,
      label: row.label,
    })),
  },
  { kind: 'text', key: 'text', label: '文案' },
];

export const messageCustomizeDefaults = {
  type: 'subtle',
  text: '0',
};
export const messageCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '类型',
    options: propLabelRows(['subtle', 'brand', 'danger'] as const, showcaseFeedbackMessageTypeLabels).map(
      (row) => ({ value: row.key, label: row.label }),
    ),
  },
  { kind: 'text', key: 'text', label: '文案' },
];

export const reddotCustomizeDefaults = {};
export const reddotCustomizeControls: DocCustomizeControl[] = [];

export const formSubmissionCustomizeDefaults = {
  type: 'notes',
  text: 'Connect to EDS',
  linkLabel: 'Button',
  showLink: true,
};
export const formSubmissionCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '类型',
    options: propLabelRows(['notes', 'danger', 'success'] as const, showcaseFormSubmissionTypeLabels).map(
      (row) => ({ value: row.key, label: row.label }),
    ),
  },
  { kind: 'text', key: 'text', label: '文案' },
  {
    kind: 'text',
    key: 'linkLabel',
    label: '链接文案',
    visibleWhen: (s) => s.type === 'notes',
  },
  {
    kind: 'boolean',
    key: 'showLink',
    label: '显示链接',
    visibleWhen: (s) => s.type === 'notes',
  },
];

export function buildFormSubmissionUsageSnippet(state: Record<string, unknown>): string {
  const type = String(state.type ?? formSubmissionCustomizeDefaults.type);
  const props: Record<string, unknown> = {
    type,
    text: String(state.text ?? formSubmissionCustomizeDefaults.text),
  };
  if (type === 'notes') {
    props.linkLabel = String(state.linkLabel ?? formSubmissionCustomizeDefaults.linkLabel);
    props.showLink = state.showLink !== false;
    props.href = String(state.href ?? '#');
  }
  return buildVueSelfClosingSnippet('EgFormSubmission', props, {
    defaults: formSubmissionCustomizeDefaults,
  });
}
