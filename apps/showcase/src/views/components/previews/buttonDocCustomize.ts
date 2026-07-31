import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import {
  buildVueDefaultSlotSnippet,
  buildVueSelfClosingSnippet,
} from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  buttonSizeRows,
  buttonToneRows,
  buttonVariantRows,
  iconShapeRows,
  linkSizeRows,
  linkToneRows,
  paginationKindRows,
  paginationToneRows,
  showcaseButtonCustomizeFieldLabels,
} from '@/data/showcasePropLabels';
import {
  showcaseArrowIconSnippet,
  showcaseChevronIconSnippet,
  showcaseDefaultIconName,
  showcasePlusIconSnippet,
} from '@/views/shared/showcaseIcons';

export const buttonTextImportCode = `import { EgButton, EgIcon } from '@eds/desktop-components';`;

export const iconButtonImportCode = `import { EgIcon, EgIconButton } from '@eds/desktop-components';`;

export const iconButtonProImportCode = `import { EgIcon, EgIconButtonPro } from '@eds/desktop-components';`;

export const linkImportCode = `import { EgLink } from '@eds/desktop-components';`;

export const paginationImportCode = `import { EgIcon, EgPaginationItem } from '@eds/desktop-components';`;

export const comboActionImportCode = `import {
  EgComboActionSkid,
  EgComboActionPopupWindow,
  EgComboActionFlotation,
  EgComboActionPage,
} from '@eds/desktop-components';`;

export const comboActionSkidImportCode = `import { EgComboActionSkid } from '@eds/desktop-components';`;

export const comboActionPopupImportCode = `import { EgComboActionPopupWindow } from '@eds/desktop-components';`;

export const comboActionFlotationImportCode = `import { EgComboActionFlotation } from '@eds/desktop-components';`;

export const comboActionPageImportCode = `import { EgComboActionPage } from '@eds/desktop-components';`;

export const buttonCustomizeDefaults = {
  tone: 'brand',
  variant: 'solid',
  size: 'lg',
  disabled: false,
  loading: false,
  label: 'Button',
  showIcon: false,
} as const;

export const buttonCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: buttonToneRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'variant',
    label: showcaseButtonCustomizeFieldLabels.variant,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseButtonCustomizeFieldLabels.size,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'loading', label: showcaseButtonCustomizeFieldLabels.loading },
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label },
  { kind: 'boolean', key: 'showIcon', label: showcaseButtonCustomizeFieldLabels.showIcon },
];

export function buildButtonUsageSnippet(state: Record<string, unknown>): string {
  const label = String(state.label ?? buttonCustomizeDefaults.label);
  const omitKeys = ['label', 'showIcon', 'type'];
  const props = { ...state };

  if (state.showIcon) {
    const open = buildVueSelfClosingSnippet('EgButton', props, {
      defaults: buttonCustomizeDefaults,
      omitKeys,
    })
      .replace(/\s*\/>$/, '')
      .trim();
    const iconBlock = `  <template #icon>\n    ${showcasePlusIconSnippet.replace(/\n/g, '\n    ')}\n  </template>`;
    return `${open}>\n${iconBlock}\n  ${label}\n</EgButton>`;
  }

  return buildVueDefaultSlotSnippet('EgButton', props, label, {
    defaults: buttonCustomizeDefaults,
    omitKeys,
  });
}

export const iconButtonCustomizeDefaults = {
  shape: 'rectangular',
  size: 'lg',
  label: 'Add',
  disabled: false,
} as const;

export const iconButtonCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'shape',
    label: showcaseButtonCustomizeFieldLabels.shape,
    options: iconShapeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseButtonCustomizeFieldLabels.size,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
];

export function buildIconButtonUsageSnippet(state: Record<string, unknown>): string {
  const openTag = buildVueSelfClosingSnippet('EgIconButton', state, {
    defaults: iconButtonCustomizeDefaults,
    omitKeys: ['type'],
  })
    .replace(/\s*\/>$/, '')
    .trim();
  return `${openTag}>\n  <EgIcon name="${showcaseDefaultIconName}" fit />\n</EgIconButton>`;
}

export const iconButtonProCustomizeDefaults = {
  label: 'Label',
  badge: '0',
  showBadge: false,
  showReddot: false,
  disabled: false,
} as const;

export const iconButtonProCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label },
  { kind: 'boolean', key: 'showBadge', label: showcaseButtonCustomizeFieldLabels.showBadge },
  {
    kind: 'text',
    key: 'badge',
    label: showcaseButtonCustomizeFieldLabels.badge,
    visibleWhen: (s) => Boolean(s.showBadge),
  },
  { kind: 'boolean', key: 'showReddot', label: showcaseButtonCustomizeFieldLabels.showReddot },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
];

export function buildIconButtonProUsageSnippet(state: Record<string, unknown>): string {
  const openTag = buildVueSelfClosingSnippet('EgIconButtonPro', state, {
    defaults: iconButtonProCustomizeDefaults,
    omitKeys: ['type'],
  })
    .replace(/\s*\/>$/, '')
    .trim();
  return `${openTag}>\n  <EgIcon name="${showcaseDefaultIconName}" fit />\n</EgIconButtonPro>`;
}

export const linkCustomizeDefaults = {
  tone: 'brand',
  size: 'lg',
  href: '#',
  disabled: false,
  label: 'Connect to EDS',
} as const;

export const linkCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: linkToneRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseButtonCustomizeFieldLabels.size,
    options: linkSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'href', label: showcaseButtonCustomizeFieldLabels.href },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label },
];

export function buildLinkUsageSnippet(state: Record<string, unknown>): string {
  const label = String(state.label ?? linkCustomizeDefaults.label);
  return buildVueDefaultSlotSnippet('EgLink', state, label, {
    defaults: linkCustomizeDefaults,
    omitKeys: ['label'],
  });
}

export const paginationCustomizeDefaults = {
  kind: 'button',
  tone: 'brand',
  label: '0',
  disabled: false,
} as const;

export const paginationCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'kind',
    label: showcaseButtonCustomizeFieldLabels.kind,
    options: paginationKindRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: paginationToneRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'text',
    key: 'label',
    label: showcaseButtonCustomizeFieldLabels.label,
    visibleWhen: (s) => s.kind === 'number',
  },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
];

export function buildPaginationUsageSnippet(state: Record<string, unknown>): string {
  if (state.kind === 'number') {
    return buildVueSelfClosingSnippet('EgPaginationItem', state, {
      defaults: paginationCustomizeDefaults,
      omitKeys: ['type'],
    });
  }

  const icon =
    state.kind === 'symbol' ? showcaseChevronIconSnippet : showcaseArrowIconSnippet;
  const iconLines = icon.replace(/\n/g, '\n  ');
  return buildVueDefaultSlotSnippet('EgPaginationItem', state, iconLines, {
    defaults: paginationCustomizeDefaults,
    omitKeys: ['label', 'type'],
  });
}

export const comboActionSkidCustomizeDefaults = {
  tone: 'brand',
  divider: false,
  confirmLabel: 'Confirm',
} as const;

export const comboActionSkidCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: [
      { value: 'brand', label: '品牌 Brand' },
      { value: 'decor', label: '装饰 Decor' },
      { value: 'danger', label: '危险 Danger' },
    ],
  },
  { kind: 'boolean', key: 'divider', label: showcaseButtonCustomizeFieldLabels.divider },
  { kind: 'text', key: 'confirmLabel', label: showcaseButtonCustomizeFieldLabels.confirmLabel },
];

export function buildComboActionSkidUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboActionSkid', state, {
    defaults: comboActionSkidCustomizeDefaults,
  });
}

export const comboActionPopupCustomizeDefaults = {
  tone: 'brand',
  count: 2,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
} as const;

export const comboActionPopupCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: [
      { value: 'brand', label: '品牌 Brand' },
      { value: 'decor', label: '装饰 Decor' },
    ],
  },
  {
    kind: 'select',
    key: 'count',
    label: showcaseButtonCustomizeFieldLabels.count,
    options: [
      { value: '2', label: '2（Confirm + Cancel）' },
      { value: '1', label: '1（仅 Confirm）' },
    ],
  },
  { kind: 'text', key: 'confirmLabel', label: showcaseButtonCustomizeFieldLabels.confirmLabel },
  { kind: 'text', key: 'cancelLabel', label: showcaseButtonCustomizeFieldLabels.cancelLabel },
];

export function buildComboActionPopupUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboActionPopupWindow', state, {
    defaults: comboActionPopupCustomizeDefaults,
  });
}

export const comboActionFlotationCustomizeDefaults = {
  tone: 'brand',
  divider: false,
  clear: false,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
} as const;

export const comboActionFlotationCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: [
      { value: 'brand', label: '品牌 Brand' },
      { value: 'decor', label: '装饰 Decor' },
    ],
  },
  { kind: 'boolean', key: 'divider', label: showcaseButtonCustomizeFieldLabels.divider },
  { kind: 'boolean', key: 'clear', label: showcaseButtonCustomizeFieldLabels.clear },
  { kind: 'text', key: 'confirmLabel', label: showcaseButtonCustomizeFieldLabels.confirmLabel },
  { kind: 'text', key: 'cancelLabel', label: showcaseButtonCustomizeFieldLabels.cancelLabel },
];

export function buildComboActionFlotationUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboActionFlotation', state, {
    defaults: comboActionFlotationCustomizeDefaults,
  });
}

export const comboActionPageCustomizeDefaults = {
  tone: 'brand',
  divider: false,
  direction: 'right',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
} as const;

export const comboActionPageCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: [
      { value: 'brand', label: '品牌 Brand' },
      { value: 'decor', label: '装饰 Decor' },
    ],
  },
  { kind: 'boolean', key: 'divider', label: showcaseButtonCustomizeFieldLabels.divider },
  {
    kind: 'select',
    key: 'direction',
    label: showcaseButtonCustomizeFieldLabels.direction,
    options: [
      { value: 'right', label: '右 Right' },
      { value: 'left', label: '左 Left' },
    ],
  },
  { kind: 'text', key: 'confirmLabel', label: showcaseButtonCustomizeFieldLabels.confirmLabel },
  { kind: 'text', key: 'cancelLabel', label: showcaseButtonCustomizeFieldLabels.cancelLabel },
];

export function buildComboActionPageUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboActionPage', state, {
    defaults: comboActionPageCustomizeDefaults,
  });
}
