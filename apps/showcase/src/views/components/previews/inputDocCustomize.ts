import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import {
  propLabelSelectOptions,
  showcaseInputCustomizeFieldLabels,
  showcaseInputSizeLabels,
  showcaseInputTypeLabels,
  showcaseSearchScenarioLabels,
  showcaseWidthModeLabels,
} from '@/data/showcasePropLabels';

export const inputImportCode = `import { EgInput } from '@eds/desktop-components';`;

export const textareaImportCode = `import { EgTextarea } from '@eds/desktop-components';`;

export const searchImportCode = `import { EgSearch, EgVerifyInput } from '@eds/desktop-components';`;

export const comboImportCode = `import {
  EgComboInputItem,
  EgComboTextareaItem,
  EgInput,
} from '@eds/desktop-components';`;

export const inputCustomizeDefaults = {
  type: 'standard',
  size: 'md',
  widthMode: 'full',
  fixedWidth: '319',
  placeholder: '请输入',
  disabled: false,
  readonly: false,
  unit: '',
  clearable: true,
  showMax: false,
  maxLabel: 'Max',
} as const;

export const inputCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseInputCustomizeFieldLabels.type,
    options: [
      { value: 'standard', label: showcaseInputTypeLabels.standard },
      { value: 'amount', label: showcaseInputTypeLabels.amount },
    ],
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseInputCustomizeFieldLabels.size,
    options: [
      { value: 'lg', label: showcaseInputSizeLabels.lg },
      { value: 'md', label: showcaseInputSizeLabels.md },
      { value: 'sm', label: showcaseInputSizeLabels.sm },
    ],
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: '319 或 319px',
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'text', key: 'placeholder', label: showcaseInputCustomizeFieldLabels.placeholder },
  { kind: 'boolean', key: 'disabled', label: showcaseInputCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'readonly', label: showcaseInputCustomizeFieldLabels.readonly },
  { kind: 'text', key: 'unit', label: showcaseInputCustomizeFieldLabels.unit },
  { kind: 'boolean', key: 'clearable', label: showcaseInputCustomizeFieldLabels.clearable },
  {
    kind: 'boolean',
    key: 'showMax',
    label: showcaseInputCustomizeFieldLabels.showMax,
    visibleWhen: (s) => s.type === 'amount',
  },
  {
    kind: 'text',
    key: 'maxLabel',
    label: showcaseInputCustomizeFieldLabels.maxLabel,
    visibleWhen: (s) => s.type === 'amount' && s.showMax === true,
  },
];

export const textareaCustomizeDefaults = {
  placeholder: '请输入',
  widthMode: 'full',
  fixedWidth: '319',
  disabled: false,
  readonly: false,
} as const;

export const textareaCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'placeholder', label: showcaseInputCustomizeFieldLabels.placeholder },
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: '319 或 319px',
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'boolean', key: 'disabled', label: showcaseInputCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'readonly', label: showcaseInputCustomizeFieldLabels.readonly },
];

export const searchCustomizeDefaults = {
  scenario: 'search' as 'search' | 'verify-input',
  placeholder: 'Search',
  widthMode: 'full',
  fixedWidth: '319',
  disabled: false,
  readonly: false,
} as const;

export const searchCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'scenario',
    label: showcaseInputCustomizeFieldLabels.scenario,
    options: propLabelSelectOptions(
      ['search', 'verify-input'] as const,
      showcaseSearchScenarioLabels,
    ),
  },
  {
    kind: 'text',
    key: 'placeholder',
    label: showcaseInputCustomizeFieldLabels.placeholder,
    visibleWhen: (state) => state.scenario === 'search',
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: '319 或 319px',
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'boolean', key: 'disabled', label: showcaseInputCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'readonly', label: showcaseInputCustomizeFieldLabels.readonly },
];

export const comboInputItemCustomizeDefaults = {
  label: 'Label',
  feedback: true,
  ...inputCustomizeDefaults,
} as const;

export const comboInputItemCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseInputCustomizeFieldLabels.label },
  { kind: 'boolean', key: 'feedback', label: showcaseInputCustomizeFieldLabels.feedback },
  ...inputCustomizeControls,
];

const comboInputItemShellKeys = ['label', 'feedback'] as const;

/** Props for EgComboInputItem from merged Combo customize state. */
export function comboInputItemShellProps(state: Record<string, unknown>): Record<string, unknown> {
  return {
    label: state.label,
    feedback: state.feedback,
  };
}

/** Props for nested EgInput from merged Combo customize state. */
export function comboNestedInputProps(state: Record<string, unknown>): Record<string, unknown> {
  const inputState = { ...state };
  for (const key of comboInputItemShellKeys) {
    delete inputState[key];
  }
  return inputState;
}

export const comboTextareaItemCustomizeDefaults = {
  label: 'Label',
  feedback: true,
  placeholder: '请输入',
} as const;

export const comboTextareaItemCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseInputCustomizeFieldLabels.label },
  { kind: 'boolean', key: 'feedback', label: showcaseInputCustomizeFieldLabels.feedback },
  { kind: 'text', key: 'placeholder', label: showcaseInputCustomizeFieldLabels.placeholder },
];
