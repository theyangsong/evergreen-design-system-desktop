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
  showcaseComboPopupCountLabels,
  directionLeftRightRows,
} from '@/data/showcasePropLabels';
import {
  showcaseArrowIconSnippet,
  showcaseBorderArrowIconSnippet,
  showcaseChevronIconSnippet,
  showcaseDefaultIconName,
  showcaseEgIconSnippet,
} from '@/views/shared/showcaseIcons';
import { iconButtonEventRows } from './iconButtonDocPreview';
import { readBorderArrowDocEvent, type BorderArrowDocEvent } from './borderArrowDocPreview';

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
  iconName: showcaseDefaultIconName,
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
  {
    kind: 'text',
    key: 'iconName',
    label: showcaseButtonCustomizeFieldLabels.iconName,
    visibleWhen: (state) => Boolean(state.showIcon),
  },
];

export function buildButtonUsageSnippet(state: Record<string, unknown>): string {
  const label = String(state.label ?? buttonCustomizeDefaults.label);
  const omitKeys = ['label', 'showIcon', 'iconName', 'type'];
  const props = { ...state };

  if (state.showIcon) {
    const iconName = String(state.iconName ?? buttonCustomizeDefaults.iconName);
    const open = buildVueSelfClosingSnippet('EgButton', props, {
      defaults: buttonCustomizeDefaults,
      omitKeys,
    })
      .replace(/\s*\/>$/, '')
      .trim();
    const iconBlock = `  <template #icon>\n    ${showcaseEgIconSnippet(iconName, { fit: true, size: 'md' }).replace(/\n/g, '\n    ')}\n  </template>`;
    return `${open}>\n${iconBlock}\n  ${label}\n</EgButton>`;
  }

  return buildVueDefaultSlotSnippet('EgButton', props, label, {
    defaults: buttonCustomizeDefaults,
    omitKeys,
  });
}

export const iconButtonCustomizeDefaults = {
  shape: 'rectangular',
  event: 'full' as 'full' | 'default' | 'hover' | 'active' | 'focus',
  size: 'lg',
  label: 'Add',
  symbol: showcaseDefaultIconName,
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
    key: 'event',
    label: showcaseButtonCustomizeFieldLabels.event,
    options: iconButtonEventRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseButtonCustomizeFieldLabels.size,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'symbol', label: showcaseButtonCustomizeFieldLabels.symbol },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
];

export function buildIconButtonUsageSnippet(state: Record<string, unknown>): string {
  const symbol = String(state.symbol ?? iconButtonCustomizeDefaults.symbol);
  const openTag = buildVueSelfClosingSnippet('EgIconButton', state, {
    defaults: iconButtonCustomizeDefaults,
    omitKeys: ['type', 'symbol', 'event'],
  })
    .replace(/\s*\/>$/, '')
    .trim();
  return `${openTag}>\n  <EgIcon name="${symbol}" fit />\n</EgIconButton>`;
}

export const iconButtonProCustomizeDefaults = {
  label: 'Label',
  symbol: showcaseDefaultIconName,
  badge: '0',
  showBadge: false,
  showReddot: false,
  disabled: false,
} as const;

export const iconButtonProCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label, row: 1 },
  { kind: 'text', key: 'symbol', label: showcaseButtonCustomizeFieldLabels.symbol, row: 1 },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled, row: 1 },
  {
    kind: 'boolean',
    key: 'showReddot',
    label: showcaseButtonCustomizeFieldLabels.showReddot,
    row: 1,
    exclusiveKey: 'showBadge',
  },
  {
    kind: 'boolean',
    key: 'showBadge',
    label: showcaseButtonCustomizeFieldLabels.showBadge,
    row: 1,
    exclusiveKey: 'showReddot',
  },
  {
    kind: 'text',
    key: 'badge',
    label: showcaseButtonCustomizeFieldLabels.badge,
    row: 1,
    visibleWhen: (s) => Boolean(s.showBadge),
  },
];

export type IconButtonProZoneKeyPrefix =
  | 'functional'
  | 'section'
  | 'batch'
  | 'filter'
  | 'refresh'
  | 'export';

type IconButtonProZoneSeed = {
  label?: string;
  icon?: string;
  showBadge?: boolean;
  badge?: string;
  showReddot?: boolean;
  disabled?: boolean;
};

function iconButtonProZoneSeed(
  seed: IconButtonProZoneSeed = {},
): Required<IconButtonProZoneSeed> {
  return {
    label: seed.label ?? iconButtonProCustomizeDefaults.label,
    icon: seed.icon ?? iconButtonProCustomizeDefaults.symbol,
    showBadge: seed.showBadge ?? iconButtonProCustomizeDefaults.showBadge,
    badge: seed.badge ?? iconButtonProCustomizeDefaults.badge,
    showReddot: seed.showReddot ?? iconButtonProCustomizeDefaults.showReddot,
    disabled: seed.disabled ?? iconButtonProCustomizeDefaults.disabled,
  };
}

export function iconButtonProZoneItemDefaultsForRange(
  prefix: IconButtonProZoneKeyPrefix,
  maxIndex: number,
  seed: IconButtonProZoneSeed = {},
): Record<string, string | boolean> {
  const defaults = iconButtonProZoneSeed(seed);
  const entries: Record<string, string | boolean> = {};

  for (let index = 1; index <= maxIndex; index += 1) {
    entries[`${prefix}Label${index}`] = defaults.label;
    entries[`${prefix}Icon${index}`] = defaults.icon;
    entries[`${prefix}ShowBadge${index}`] = defaults.showBadge;
    entries[`${prefix}Badge${index}`] = defaults.badge;
    entries[`${prefix}ShowReddot${index}`] = defaults.showReddot;
    entries[`${prefix}Disabled${index}`] = defaults.disabled;
  }

  return entries;
}

export function iconButtonProSingleItemDefaults(
  prefix: IconButtonProZoneKeyPrefix,
  seed: IconButtonProZoneSeed = {},
): Record<string, string | boolean> {
  const defaults = iconButtonProZoneSeed(seed);
  return {
    [`${prefix}Label`]: defaults.label,
    [`${prefix}Icon`]: defaults.icon,
    [`${prefix}ShowBadge`]: defaults.showBadge,
    [`${prefix}Badge`]: defaults.badge,
    [`${prefix}ShowReddot`]: defaults.showReddot,
    [`${prefix}Disabled`]: defaults.disabled,
  };
}

export const iconButtonProNestedRowColumns = 6;

export function buildIconButtonProZoneItemControls(
  prefix: 'functional' | 'section',
  countKey: 'functionalCount' | 'sectionCount',
  countOptions: { value: string; label: string }[],
  maxIndex: number,
): DocCustomizeControl[] {
  function zoneItemVisible(state: Record<string, unknown>, itemIndex: number): boolean {
    const count = Number.parseInt(String(state[countKey] ?? '1'), 10);
    return Number.isFinite(count) && count >= itemIndex;
  }

  return [
    {
      kind: 'select',
      key: countKey,
      label: '数量',
      options: countOptions,
      row: 0,
    },
    ...Array.from({ length: maxIndex }, (_, index) => {
      const itemIndex = index + 1;
      const visibleWhen = (state: Record<string, unknown>) => zoneItemVisible(state, itemIndex);

      return [
        {
          kind: 'text' as const,
          key: `${prefix}Label${itemIndex}`,
          label: `顺序 ${itemIndex}`,
          row: itemIndex,
          visibleWhen,
        },
        {
          kind: 'text' as const,
          key: `${prefix}Icon${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.iconName,
          placeholder: iconButtonProCustomizeDefaults.symbol,
          row: itemIndex,
          visibleWhen,
        },
        {
          kind: 'boolean' as const,
          key: `${prefix}Disabled${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.disabled,
          row: itemIndex,
          visibleWhen,
        },
        {
          kind: 'boolean' as const,
          key: `${prefix}ShowReddot${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.showReddot,
          row: itemIndex,
          visibleWhen,
          exclusiveKey: `${prefix}ShowBadge${itemIndex}`,
        },
        {
          kind: 'boolean' as const,
          key: `${prefix}ShowBadge${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.showBadge,
          row: itemIndex,
          visibleWhen,
          exclusiveKey: `${prefix}ShowReddot${itemIndex}`,
        },
        {
          kind: 'text' as const,
          key: `${prefix}Badge${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.badge,
          row: itemIndex,
          visibleWhen: (state) => visibleWhen(state) && Boolean(state[`${prefix}ShowBadge${itemIndex}`]),
        },
      ];
    }).flat(),
  ];
}

export const iconButtonProSingleCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label, row: 1 },
  {
    kind: 'text',
    key: 'icon',
    label: showcaseButtonCustomizeFieldLabels.iconName,
    placeholder: iconButtonProCustomizeDefaults.symbol,
    row: 1,
  },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled, row: 1 },
  {
    kind: 'boolean',
    key: 'showReddot',
    label: showcaseButtonCustomizeFieldLabels.showReddot,
    row: 1,
    exclusiveKey: 'showBadge',
  },
  {
    kind: 'boolean',
    key: 'showBadge',
    label: showcaseButtonCustomizeFieldLabels.showBadge,
    row: 1,
    exclusiveKey: 'showReddot',
  },
  {
    kind: 'text',
    key: 'badge',
    label: showcaseButtonCustomizeFieldLabels.badge,
    row: 1,
    visibleWhen: (state) => Boolean(state.showBadge),
  },
];

export function buildIconButtonProSingleCustomizeControls(
  prefix: IconButtonProZoneKeyPrefix,
): DocCustomizeControl[] {
  return iconButtonProSingleCustomizeControls.map((control) => ({
    ...control,
    key: `${prefix}${control.key.charAt(0).toUpperCase()}${control.key.slice(1)}`,
    exclusiveKey:
      control.kind === 'boolean' && control.exclusiveKey
        ? `${prefix}${control.exclusiveKey.charAt(0).toUpperCase()}${control.exclusiveKey.slice(1)}`
        : undefined,
    visibleWhen:
      control.visibleWhen == null
        ? undefined
        : (state: Record<string, unknown>) =>
            control.visibleWhen?.({
              showBadge: state[`${prefix}ShowBadge`],
            } satisfies Record<string, unknown>),
  }));
}

export type IconButtonProZoneItemState = {
  label: string;
  icon: string;
  showBadge: boolean;
  badge: string;
  showReddot: boolean;
  disabled: boolean;
};

export function readIconButtonProZoneItem(
  state: Record<string, unknown>,
  prefix: IconButtonProZoneKeyPrefix,
  index: number,
): IconButtonProZoneItemState {
  const labelKey = `${prefix}Label${index}` as const;
  const iconKey = `${prefix}Icon${index}` as const;
  const label = state[labelKey];
  const icon = state[iconKey];

  return {
    label: label != null && String(label).trim().length > 0
      ? String(label).trim()
      : iconButtonProCustomizeDefaults.label,
    icon: icon != null && String(icon).trim().length > 0
      ? String(icon).trim()
      : iconButtonProCustomizeDefaults.symbol,
    showBadge: Boolean(state[`${prefix}ShowBadge${index}`]),
    badge: String(state[`${prefix}Badge${index}`] ?? iconButtonProCustomizeDefaults.badge),
    showReddot: Boolean(state[`${prefix}ShowReddot${index}`]),
    disabled: Boolean(state[`${prefix}Disabled${index}`]),
  };
}

export function readIconButtonProSingleItem(
  state: Record<string, unknown>,
  prefix: IconButtonProZoneKeyPrefix,
): IconButtonProZoneItemState {
  const label = state[`${prefix}Label`];
  const icon = state[`${prefix}Icon`];

  return {
    label: label != null && String(label).trim().length > 0
      ? String(label).trim()
      : iconButtonProCustomizeDefaults.label,
    icon: icon != null && String(icon).trim().length > 0
      ? String(icon).trim()
      : iconButtonProCustomizeDefaults.symbol,
    showBadge: Boolean(state[`${prefix}ShowBadge`]),
    badge: String(state[`${prefix}Badge`] ?? iconButtonProCustomizeDefaults.badge),
    showReddot: Boolean(state[`${prefix}ShowReddot`]),
    disabled: Boolean(state[`${prefix}Disabled`]),
  };
}

export function buildIconButtonProUsageSnippet(state: Record<string, unknown>): string {
  const symbol = String(state.symbol ?? iconButtonProCustomizeDefaults.symbol);
  const openTag = buildVueSelfClosingSnippet('EgIconButtonPro', state, {
    defaults: iconButtonProCustomizeDefaults,
    omitKeys: ['type', 'symbol'],
  })
    .replace(/\s*\/>$/, '')
    .trim();
  return `${openTag}>\n  <EgIcon name="${symbol}" fit />\n</EgIconButtonPro>`;
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
  event: 'full' as BorderArrowDocEvent,
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
    key: 'event',
    label: '交互',
    options: iconButtonEventRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (s) => s.kind === 'borderArrow',
  },
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: paginationToneRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (s) => s.kind !== 'borderArrow',
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
      omitKeys: ['type', 'event'],
    });
  }

  const icon =
    state.kind === 'borderArrow'
      ? showcaseBorderArrowIconSnippet
      : state.kind === 'symbol'
        ? showcaseChevronIconSnippet
        : showcaseArrowIconSnippet;
  const iconLines = icon.replace(/\n/g, '\n  ');
  return buildVueDefaultSlotSnippet('EgPaginationItem', state, iconLines, {
    defaults: paginationCustomizeDefaults,
    omitKeys: ['label', 'type', 'event'],
  });
}

export type PaginerPaginationSlotKey = 'first' | 'prev' | 'page' | 'next' | 'last';

export const PAGINER_PAGINATION_SLOT_KEYS: PaginerPaginationSlotKey[] = [
  'first',
  'prev',
  'page',
  'next',
  'last',
];

export const paginerPaginationButtonOptions = [
  { value: 'first', label: '首页' },
  { value: 'prev', label: '上一页' },
  { value: 'page', label: '页码' },
  { value: 'next', label: '下一页' },
  { value: 'last', label: '末页' },
];

type PaginerPaginationSeed = {
  kind?: 'number' | 'symbol' | 'button' | 'borderArrow';
  tone?: 'brand' | 'decor';
  label?: string;
  disabled?: boolean;
  event?: BorderArrowDocEvent;
};

function paginerPaginationItemSeed(
  seed: PaginerPaginationSeed = {},
): Required<PaginerPaginationSeed> {
  return {
    kind: seed.kind ?? 'symbol',
    tone: seed.tone ?? 'decor',
    label: seed.label ?? '1',
    disabled: seed.disabled ?? false,
    event: seed.event ?? 'full',
  };
}

export function paginerPaginationItemDefaults(
  prefix: PaginerPaginationSlotKey,
  seed: PaginerPaginationSeed = {},
): Record<string, string | boolean> {
  const defaults = paginerPaginationItemSeed(seed);
  return {
    [`${prefix}Kind`]: defaults.kind,
    [`${prefix}Tone`]: defaults.tone,
    [`${prefix}Label`]: defaults.label,
    [`${prefix}Disabled`]: defaults.disabled,
    [`${prefix}Event`]: defaults.event,
  };
}

export function paginerPaginationCustomizeDefaults(
  customizeKey = 'paginerPaginationKey',
): Record<string, string | boolean> {
  return {
    [customizeKey]: 'first',
    ...paginerPaginationItemDefaults('first', { kind: 'symbol' }),
    ...paginerPaginationItemDefaults('prev', { kind: 'symbol' }),
    ...paginerPaginationItemDefaults('page', { kind: 'number', label: '1' }),
    ...paginerPaginationItemDefaults('next', { kind: 'symbol' }),
    ...paginerPaginationItemDefaults('last', { kind: 'symbol' }),
  };
}

export function buildPaginerPaginationItemCustomizeControls(
  prefix: PaginerPaginationSlotKey,
): DocCustomizeControl[] {
  return paginationCustomizeControls.map((control) => ({
    ...control,
    key: `${prefix}${control.key.charAt(0).toUpperCase()}${control.key.slice(1)}`,
    row: 1,
    visibleWhen:
      control.visibleWhen == null
        ? undefined
        : (state: Record<string, unknown>) =>
            control.visibleWhen?.({
              kind: state[`${prefix}Kind`],
            } satisfies Record<string, unknown>),
  }));
}

export function buildPaginerPaginationCustomizeControls(
  customizeKey = 'paginerPaginationKey',
): DocCustomizeControl[] {
  return [
    {
      kind: 'select',
      key: customizeKey,
      label: '按钮',
      options: paginerPaginationButtonOptions,
      row: 0,
    },
    ...PAGINER_PAGINATION_SLOT_KEYS.flatMap((prefix) =>
      buildPaginerPaginationItemCustomizeControls(prefix).map((control) => ({
        ...control,
        visibleWhen: (state: Record<string, unknown>) => {
          if (String(state[customizeKey] ?? 'first') !== prefix) return false;
          return control.visibleWhen ? control.visibleWhen(state) : true;
        },
      })),
    ),
  ];
}

export type PaginerPaginationItemState = {
  kind: 'number' | 'symbol' | 'button' | 'borderArrow';
  tone: 'brand' | 'decor';
  label: string;
  disabled: boolean;
  event: BorderArrowDocEvent;
};

export function readPaginerPaginationItem(
  state: Record<string, unknown>,
  prefix: PaginerPaginationSlotKey,
): PaginerPaginationItemState {
  const kind = String(state[`${prefix}Kind`] ?? 'symbol');
  const tone = String(state[`${prefix}Tone`] ?? 'decor');

  return {
    kind:
      kind === 'number' ||
      kind === 'button' ||
      kind === 'symbol' ||
      kind === 'borderArrow'
        ? kind
        : 'symbol',
    tone: tone === 'brand' || tone === 'decor' ? tone : 'decor',
    label: String(state[`${prefix}Label`] ?? '1'),
    disabled: Boolean(state[`${prefix}Disabled`]),
    event: readBorderArrowDocEvent(state[`${prefix}Event`]),
  };
}

export const paginerPaginationNestedRowColumns = 4;

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
    options: buttonToneRows
      .filter((row) => ['brand', 'decor', 'danger'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
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
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'count',
    label: showcaseButtonCustomizeFieldLabels.count,
    options: [
      { value: '2', label: showcaseComboPopupCountLabels['2'] },
      { value: '1', label: showcaseComboPopupCountLabels['1'] },
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
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
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
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'boolean', key: 'divider', label: showcaseButtonCustomizeFieldLabels.divider },
  {
    kind: 'select',
    key: 'direction',
    label: showcaseButtonCustomizeFieldLabels.direction,
    options: directionLeftRightRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'confirmLabel', label: showcaseButtonCustomizeFieldLabels.confirmLabel },
  { kind: 'text', key: 'cancelLabel', label: showcaseButtonCustomizeFieldLabels.cancelLabel },
];

export function buildComboActionPageUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboActionPage', state, {
    defaults: comboActionPageCustomizeDefaults,
  });
}
