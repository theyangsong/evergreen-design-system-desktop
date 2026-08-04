import type { ListFieldSceneSlug } from '@/data/scenes';
import {
  chineseOption,
  countSelectOptions,
} from '@/data/showcasePropLabels';
import { buildVueOpeningTag, buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import {
  buildFormSubmissionUsageSnippet,
  formSubmissionCustomizeControls,
  formSubmissionCustomizeDefaults,
  formSubmissionPropRows,
} from '@/views/components/previews/feedbackDocCustomize';
import {
  buildTagStatusUsageSnippet,
  buildTagSystemUsageSnippet,
  tagImportCode,
  tagSystemSmCustomizeControls,
  tagSystemCustomizeDefaults,
  tagSystemPropRows,
  tagStatusCustomizeControls,
  tagStatusPropRows,
} from '@/views/components/previews/tagDocCustomize';
import { resolveCryptoNameFromSymbol } from './listFieldCryptoResolve';
import {
  currencyTagCustomizeDefaults,
} from './listFieldCurrencyTagCustomize';
import {
  buildCurrencySideAddressControls,
  buildCurrencySideAddressData,
  currencySideAddressDefaults,
} from './listFieldCurrencyAddressCustomize';
import {
  LIST_FIELD_MORE_ACTION_COUNT_MAX,
  SAMPLE_ADDRESS,
  SAMPLE_GENERAL_SECONDARY,
  SAMPLE_GENERAL_TITLE,
  SAMPLE_HASH,
  SAMPLE_HASH_SECONDARY,
  SAMPLE_ID,
  SAMPLE_ID_SECONDARY,
  buildListFieldMoreActions,
  listFieldActionCustomizeDefaults,
  parseListFieldMoreActionCount,
} from './listFieldsPreviewData';

const CRYPTO_COMBO_IMPORT = `import { EgCryptoCombo } from '@eds/desktop-components';`;

const LIST_FIELD_IMPORT = `import {
  EgAnchoredTooltip,
  EgCrypto,
  EgCryptoCombo,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
  EgTag,
  formatGroupedNumber,
} from '@eds/desktop-components';`;

const currencyComboOptions = [
  chineseOption('currency-only', '仅币种'),
  chineseOption('single-address', '单地址'),
  chineseOption('double-address', '双地址'),
];

const entryBadgeOptions = [
  chineseOption('none', '不显示'),
  chineseOption('in', '入'),
  chineseOption('out', '出'),
];

const addressTooltipTriggerOptions = [
  chineseOption('hover', '悬浮时'),
  chineseOption('focus', '聚焦时'),
];

const hashLineLayoutOptions = [
  chineseOption('single', '单行'),
  chineseOption('double', '双行'),
];

const timeLineLayoutOptions = [
  chineseOption('single', '单'),
  chineseOption('double', '双'),
];

function buildHashLikeCustomizeControls(
  valueLabel: string,
  samples: { value: string; secondaryValue: string },
  afterCopy?: DocCustomizeControl[],
): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [
    {
      kind: 'select',
      key: 'lineLayout',
      label: '组合',
      options: hashLineLayoutOptions,
      row: 0,
    },
    {
      kind: 'text',
      key: 'value',
      label: valueLabel,
      placeholder: samples.value,
      row: 0,
    },
    {
      kind: 'text',
      key: 'secondaryValue',
      label: '副文本 secondaryValue',
      placeholder: samples.secondaryValue,
      row: 0,
      visibleWhen: (state) => String(state.lineLayout ?? 'single') === 'double',
    },
    { kind: 'text', key: 'minWidth', label: '最小宽度', row: 0 },
    { kind: 'boolean', key: 'copyOnRowHover', label: '复制', row: 0 },
    {
      kind: 'select',
      key: 'tooltipTrigger',
      label: 'Tooltip 交互',
      options: addressTooltipTriggerOptions,
      row: 1,
    },
  ];

  if (afterCopy?.length) {
    const copyIndex = controls.findIndex((control) => control.key === 'copyOnRowHover');
    if (copyIndex >= 0) {
      controls.splice(copyIndex + 1, 0, ...afterCopy);
    } else {
      controls.push(...afterCopy);
    }
  }

  return controls;
}

function listFieldMinWidthControl(row = 0): DocCustomizeControl {
  return { kind: 'text', key: 'minWidth', label: '最小宽度', row };
}

function withCustomizeRow(controls: DocCustomizeControl[], row: number): DocCustomizeControl[] {
  return controls.map((control) => ({ ...control, row }));
}

const listFieldMinWidthProp = sceneProp(
  'minWidth',
  'number',
  '-',
  '单元格最小宽度（px）；不传为自适应。',
);

const addressDisplayOptions = [
  chineseOption('single', '单地址'),
  chineseOption('alias', '别名'),
  chineseOption('double', '双地址'),
  chineseOption('collection', '合集'),
];

const amountTypeOptions = [
  chineseOption('fiat', '法币'),
  chineseOption('crypto', '加密货币'),
  chineseOption('conversion', '折合'),
];

export type ListFieldCustomizePanel = {
  title: string;
  controls: DocCustomizeControl[];
  addressSide?: 'from' | 'to';
  sequential?: boolean;
  rowColumns?: number;
  visibleWhen?: (state: Record<string, unknown>) => boolean;
};

export type ListFieldDocConfig = {
  componentTag: string;
  importCode: string;
  customizeDefaults: Record<string, unknown>;
  customizeControls: DocCustomizeControl[];
  customizePanels?: ListFieldCustomizePanel[];
  propRows: DocPropRow[];
  buildUsageSnippet: (state: Record<string, unknown>) => string;
  propsSectionId: string;
  compactPreview?: boolean;
  customizeSequential?: boolean;
  customizeRowColumns?: number;
};

function sideAddressControls(_prefix: 'from' | 'to'): DocCustomizeControl[] {
  return [];
}

function sceneProp(
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): DocPropRow {
  return { name, type, defaultValue, description };
}

function buildCurrencyUsageSnippet(state: Record<string, unknown>): string {
  const symbol = String(state.symbol ?? 'ZEC');
  const cryptoName =
    resolveCryptoNameFromSymbol(symbol) ?? ('eds-zec-zcash' as const);
  const entryBadge = String(state.entryBadgeMode ?? 'none') as 'none' | 'in' | 'out';
  const addressTooltipTrigger = String(state.addressTooltipTrigger ?? 'hover') as 'hover' | 'focus';

  const props: Record<string, unknown> = {
    cryptoName,
    symbol,
    showChain: state.showNetwork !== false,
    chainLabel: String(state.networkLabel ?? 'Base'),
    networkStyle: 'tag',
    entryBadge,
    contentType: state.comboMode === 'currency-only' ? 'unaddress' : 'address',
  };

  if (state.comboMode !== 'currency-only') {
    props.addressTooltipTrigger = addressTooltipTrigger;
  }

  if (state.comboMode === 'single-address') {
    props.addressMode = 'single';
    const from = buildCurrencySideAddressData('from', state);
    props.fromAddress = from.address;
    props.fromAddressCount = from.count;
    props.fromAddresses = from.addresses;
    if (from.alias) {
      props.fromAlias = from.alias;
    }
  } else if (state.comboMode === 'double-address') {
    props.addressMode = 'double';
    const from = buildCurrencySideAddressData('from', state);
    const to = buildCurrencySideAddressData('to', state);
    props.fromAddress = from.address;
    props.toAddress = to.address;
    props.fromAddressCount = from.count;
    props.toAddressCount = to.count;
    props.fromAddresses = from.addresses;
    props.toAddresses = to.addresses;
    if (from.alias) {
      props.fromAlias = from.alias;
    }
    if (to.alias) {
      props.toAlias = to.alias;
    }
  }

  const minWidthRaw = String(state.minWidth ?? '').trim();
  const minWidth = minWidthRaw ? Number(minWidthRaw) : 0;
  if (minWidth > 0) {
    props.minWidth = minWidth;
  }

  return buildVueSelfClosingSnippet('EgCryptoCombo', props, {
    defaults: {
      cryptoName: 'eds-zec-zcash',
      symbol: 'ZEC',
      showChain: true,
      chainLabel: 'Base',
      networkStyle: 'tag',
      entryBadge: 'none',
      contentType: 'address',
      addressMode: 'double',
    },
  });
}

function buildAddressUsageSnippet(state: Record<string, unknown>): string {
  const mode = String(state.displayMode ?? 'single');
  const address = String(state.address ?? SAMPLE_ADDRESS);

  if (mode === 'alias') {
    return [
      '<div class="list-field-address">',
      `  ${buildVueSelfClosingSnippet('EgTag', { family: 'system', systemType: 'subtle', size: 'sm' }).replace('/>', '>Treasury</EgTag>')}`,
      `  <span class="mono">${address.slice(0, 6)}...${address.slice(-6)}</span>`,
      '</div>',
    ].join('\n');
  }

  if (mode === 'double') {
    return [
      '<div class="list-field-address">',
      `  <span class="mono">${address.slice(0, 6)}...${address.slice(-6)}</span>`,
      `  ${buildVueSelfClosingSnippet('EgIcon', { name: 'eds-arrow-right' })}`,
      `  <span class="mono">${address.slice(0, 5)}...${address.slice(-5)}</span>`,
      '</div>',
    ].join('\n');
  }

  if (mode === 'collection') {
    return [
      buildVueOpeningTag('EgAnchoredTooltip', { content: '3 linked addresses', placement: 'top' }),
      '  <span class="mono">(3)</span>',
      '</EgAnchoredTooltip>',
    ].join('\n');
  }

  return [
    buildVueOpeningTag('EgAnchoredTooltip', { content: address, placement: 'top' }),
    `  <span class="mono">${address.slice(0, 8)}...${address.slice(-8)}</span>`,
    '</EgAnchoredTooltip>',
  ].join('\n');
}

function buildHashLikeUsageSnippet(
  tag: string,
  state: Record<string, unknown>,
  sample: string,
): string {
  const value = String(state.value ?? sample);
  const secondaryValue = String(
    state.secondaryValue ??
      (tag === 'ListFieldGeneralStructure'
        ? SAMPLE_GENERAL_SECONDARY
        : tag === 'ListFieldIdentifier'
          ? SAMPLE_HASH
          : SAMPLE_ID),
  );
  const lineLayout = String(state.lineLayout ?? 'single');
  const minWidthRaw = String(state.minWidth ?? '').trim();
  const minWidth = minWidthRaw ? Number(minWidthRaw) : 0;
  const displayValue =
    minWidth > 0 && value.length > 22 ? `${value.slice(0, 22)}...` : value;
  const tooltipTrigger = String(state.tooltipTrigger ?? 'hover');
  const focusClass = tooltipTrigger === 'focus' ? ' eds-hover-tooltip-trigger--focus' : '';
  const tabindex = tooltipTrigger === 'focus' ? ' tabindex="0"' : '';

  const triggerBody =
    lineLayout === 'double'
      ? [
          '      <span class="hash-like-combo">',
          `        <span class="hash-like-primary">${displayValue}</span>`,
          `        <span class="hash-like-secondary">${secondaryValue}</span>`,
          '      </span>',
        ].join('\n')
      : `      <span class="eds-hover-tooltip-trigger__target"${tabindex}>${displayValue}</span>`;

  return [
    buildVueOpeningTag('EgFlotation', {
      placement: 'bottom',
      align: 'start',
      trigger: tooltipTrigger,
      'open-delay': 120,
      'close-delay': 80,
      'show-add': false,
      'show-menu-divider': false,
    }),
    '  <template #trigger>',
    `    <span class="eds-hover-tooltip-trigger${focusClass}">`,
    triggerBody,
    '    </span>',
    '  </template>',
    '  <template #content>',
    '    <EgFlotationMenu',
    '      class="eds-crypto-address-tooltip-menu eds-flotation-menu--box-doc"',
    '      height-mode="adaptive"',
    '      :max-height="280"',
    '      width-mode="adaptive"',
    '      :max-width="480"',
    '      :show-add="false"',
    '      list-scroll',
    '    >',
    '      <EgFlotationMenuItem box-type="text" label-wrap :show-tag="false">',
    `        <!-- ${value} + copy -->`,
    '      </EgFlotationMenuItem>',
    '    </EgFlotationMenu>',
    '  </template>',
    '</EgFlotation>',
  ].join('\n');
}

function buildAmountUsageSnippet(state: Record<string, unknown>): string {
  const amountType = String(state.amountType ?? 'conversion');

  if (amountType === 'fiat') {
    return `<span class="typography-body-medium">${String(state.fiatValue ?? '$10')}</span>`;
  }

  if (amountType === 'crypto') {
    return `<span class="typography-body-medium">${String(state.cryptoValue ?? '66,666.6666')} BTC</span>`;
  }

  return [
    '<div class="list-field-amount">',
    `  <span class="typography-body-medium">${String(state.cryptoValue ?? '12,500.000001')} USDT</span>`,
    `  <span class="typography-footnote">≈ ${String(state.fiatValue ?? '$12,500.01')}</span>`,
    '</div>',
  ].join('\n');
}

function buildTimeUsageSnippet(state: Record<string, unknown>): string {
  const lineLayout = String(state.lineLayout ?? 'single');
  const datetime = String(state.datetime ?? '2026-07-19 14:30:00');
  const lines = [
    lineLayout === 'double'
      ? `<span class="typography-body-small">${datetime}</span>`
      : `<span class="typography-body-medium">${datetime}</span>`,
  ];

  if (lineLayout === 'double') {
    lines.push(
      `<span class="typography-body-small">${String(state.secondaryDatetime ?? '2026-07-19 08:30:00')}</span>`,
    );
  }

  return lines.join('\n');
}

function buildStatusUsageSnippet(state: Record<string, unknown>): string {
  const tag = buildTagStatusUsageSnippet({
    ...state,
    family: 'status',
    size: state.size ?? 'lg',
  });

  if (!state.showFeedback) return tag;

  const feedback = buildFormSubmissionUsageSnippet(state);
  return ['<div class="list-field-status">', tag, feedback, '</div>'].join('\n');
}

function buildMoreActionCustomizeControls(): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [];

  for (let n = 1; n <= LIST_FIELD_MORE_ACTION_COUNT_MAX; n += 1) {
    controls.push(
      {
        kind: 'text',
        key: `moreAction${n}Label`,
        label: `更多 ${n} label`,
        row: n + 1,
        visibleWhen: (customize) => parseListFieldMoreActionCount(customize) >= n,
      },
      {
        kind: 'boolean',
        key: `moreAction${n}Danger`,
        label: `更多 ${n} danger`,
        row: n + 1,
        visibleWhen: (customize) => parseListFieldMoreActionCount(customize) >= n,
      },
    );
  }

  return controls;
}

function buildActionUsageSnippet(state: Record<string, unknown>): string {
  const primaryLabel = String(state.primaryLabel ?? 'Action');
  const moreActions = buildListFieldMoreActions(state);

  const lines = [
    '<EgDataList',
    '  :data="rows"',
    `  :primary-action="{ label: '${primaryLabel}' }"`,
  ];

  if (moreActions.length > 0) {
    lines.push(`  :more-actions="${JSON.stringify(moreActions)}"`);
  }

  lines.push('>', '  <EgDataListColumn prop="actions" label="Header" align="right" is-action />', '</EgDataList>');

  return lines.join('\n');
}

const currencyConfig: ListFieldDocConfig = {
  componentTag: 'EgCryptoCombo',
  importCode: CRYPTO_COMBO_IMPORT,
  propsSectionId: 'list-field-currency-props',
  compactPreview: true,
  customizeDefaults: {
    minWidth: '',
    symbol: 'ZEC',
    showNetwork: true,
    networkLabel: 'Base',
    entryBadgeMode: 'none',
    addressTooltipTrigger: 'hover',
    comboMode: 'double-address',
    ...currencySideAddressDefaults('from', 'ZEC'),
    ...currencySideAddressDefaults('to', 'ZEC'),
    ...currencyTagCustomizeDefaults(),
  },
  customizeControls: [
    { kind: 'text', key: 'minWidth', label: '最小宽度' },
    { kind: 'text', key: 'symbol', label: '币种' },
    { kind: 'boolean', key: 'showNetwork', label: '网络' },
    {
      kind: 'text',
      key: 'networkLabel',
      label: '网络名',
      visibleWhen: (state) => state.showNetwork !== false,
    },
    {
      kind: 'select',
      key: 'comboMode',
      label: '组合',
      options: currencyComboOptions,
    },
    {
      kind: 'select',
      key: 'entryBadgeMode',
      label: '入向角标',
      options: entryBadgeOptions,
    },
    {
      kind: 'select',
      key: 'addressTooltipTrigger',
      label: 'Tooltip 交互',
      options: addressTooltipTriggerOptions,
      visibleWhen: (state) => state.comboMode !== 'currency-only',
    },
  ],
  customizePanels: [
    {
      title: '地址',
      sequential: true,
      rowColumns: 4,
      addressSide: 'from',
      visibleWhen: (state) => state.comboMode === 'single-address',
      controls: sideAddressControls('from'),
    },
    {
      title: '发送方',
      sequential: true,
      rowColumns: 4,
      addressSide: 'from',
      visibleWhen: (state) => state.comboMode === 'double-address',
      controls: sideAddressControls('from'),
    },
    {
      title: '接收方',
      sequential: true,
      rowColumns: 4,
      addressSide: 'to',
      visibleWhen: (state) => state.comboMode === 'double-address',
      controls: sideAddressControls('to'),
    },
  ],
  propRows: [
    sceneProp(
      'minWidth',
      'number',
      '-',
      'Body 最小宽度（px）；不传为自适应。单地址默认 278。',
    ),
    sceneProp('cryptoName', 'CryptoName', '-', 'EgCrypto 图标（CryptoSymbol 32px）。'),
    sceneProp('symbol', 'string', '-', '代币符号 Body Medium。'),
    sceneProp('showChain', 'boolean', 'true', '是否展示网络 Tag（Figma showChain）。'),
    sceneProp('chainLabel', 'string', '-', '网络 Tag 文案（如 Base、Ethereum）。'),
    sceneProp(
      'networkStyle',
      "'none' | 'tag' | 'suffix'",
      "'tag'",
      'tag → System stroke-subtle；suffix → 符号后缀。',
    ),
    sceneProp(
      'entryBadge',
      "'none' | 'in' | 'out'",
      "'none'",
      '入/出角标；in → eds-arrow-entry，out → eds-arrow-outflow。',
    ),
    sceneProp(
      'layoutStyle',
      "'suffix' | 'unsuffix'",
      "'unsuffix'",
      '有角标时为 suffix（36px 图标区）；可由 entryBadge 推导。',
    ),
    sceneProp(
      'contentType',
      "'address' | 'unaddress'",
      "'address'",
      '是否渲染地址子行。',
    ),
    sceneProp(
      'addressMode',
      "'single' | 'double'",
      "'double'",
      '单地址或双地址（含 System / Custom / 99+ Tag）。',
    ),
    sceneProp(
      'addressTooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      '地址 Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。',
    ),
    sceneProp('fromAddress', 'string', '-', '地址或发送方首条；有别名时由 fromAlias 替代展示。'),
    sceneProp('fromAlias', 'string', '-', '地址别名；与地址互斥展示。'),
    sceneProp('fromAddressCount', 'number', '1', '发送方地址数（1–100）；>2 时展示 (N) 并启用 Tooltip。'),
    sceneProp('fromAddresses', 'string[]', '-', '发送方完整地址列表（Tooltip 内容）。'),
    sceneProp('toAddress', 'string', '-', '接收方首条地址；有别名时由 toAlias 替代展示。'),
    sceneProp('toAlias', 'string', '-', '接收方地址别名；与地址互斥展示。'),
    sceneProp('toAddressCount', 'number', '1', '接收方地址数（1–100）；>2 时展示 (N) 并启用 Tooltip。'),
    sceneProp('toAddresses', 'string[]', '-', '接收方完整地址列表（Tooltip 内容）。'),
  ],
  buildUsageSnippet: buildCurrencyUsageSnippet,
};

const addressConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldAddress',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-address-props',
  customizeDefaults: {
    displayMode: 'single',
    address: SAMPLE_ADDRESS,
    alias: 'Treasury',
    collectionCount: '3',
    minWidth: '',
  },
  customizeControls: [
    listFieldMinWidthControl(1),
    {
      kind: 'select',
      key: 'displayMode',
      label: '变体 displayMode',
      options: addressDisplayOptions,
      row: 1,
    },
    {
      kind: 'text',
      key: 'address',
      label: '地址 address',
      row: 2,
      visibleWhen: (state) => state.displayMode !== 'collection',
    },
    {
      kind: 'text',
      key: 'alias',
      label: '别名 alias',
      row: 2,
      visibleWhen: (state) => state.displayMode === 'alias',
    },
    {
      kind: 'text',
      key: 'collectionCount',
      label: '数量 collectionCount',
      row: 2,
      visibleWhen: (state) => state.displayMode === 'collection',
    },
  ],
  propRows: [
    sceneProp(
      'displayMode',
      "'single' | 'alias' | 'double' | 'collection'",
      "'single'",
      '单地址中间省略、别名 Tag、双地址、地址合集 (N)。',
    ),
    sceneProp('address', 'string', '-', '完整链上地址；溢出时中间省略 + Tooltip。'),
    sceneProp('alias', 'string', '-', '别名，配合 System Tag 展示。'),
    sceneProp('collectionCount', 'number', '-', '合集数量，展示为 (N) 并 Tooltip 列出。'),
    listFieldMinWidthProp,
    sceneProp('copyOnRowHover', 'boolean', 'true', '悬浮 Data List 行时显示复制。'),
  ],
  buildUsageSnippet: buildAddressUsageSnippet,
};

const transactionHashConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldTransactionHash',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-transaction-hash-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    value: SAMPLE_HASH,
    secondaryValue: SAMPLE_HASH_SECONDARY,
    lineLayout: 'single',
    minWidth: '',
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
  },
  customizeControls: buildHashLikeCustomizeControls('哈希 value', {
    value: SAMPLE_HASH,
    secondaryValue: SAMPLE_HASH_SECONDARY,
  }),
  propRows: [
    sceneProp('value', 'string', '-', '主文本；单行时唯一展示值，双行时为 Combo Title 首行。'),
    sceneProp(
      'secondaryValue',
      'string',
      '-',
      '副文本；lineLayout=double 时展示为 Footnote 次级行。',
    ),
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      '单行：Body Medium 一行；双行：Combo Title（主文本 + 副文本，spacing-05）。',
    ),
    listFieldMinWidthProp,
    sceneProp(
      'copyOnRowHover',
      'boolean',
      'false',
      '数据列悬浮时显示复制按钮；Tooltip 溢出菜单内复制始终可用，互不冲突。',
    ),
    sceneProp(
      'tooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      'Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。',
    ),
    sceneProp('ellipsis', "'tail'", "'tail'", '设置 minWidth 后超出宽度时尾部省略（CSS ellipsis）。'),
    sceneProp('tooltipWhenTruncated', 'boolean', 'true', '仅文本溢出省略时启用 Tooltip 交互。'),
  ],
  buildUsageSnippet: (state) => buildHashLikeUsageSnippet('ListFieldTransactionHash', state, SAMPLE_HASH),
};

const identifierConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldIdentifier',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-identifier-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    value: SAMPLE_ID,
    secondaryValue: SAMPLE_ID_SECONDARY,
    lineLayout: 'single',
    minWidth: '',
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
  },
  customizeControls: buildHashLikeCustomizeControls('编号 value', {
    value: SAMPLE_ID,
    secondaryValue: SAMPLE_ID_SECONDARY,
  }),
  propRows: [
    sceneProp('value', 'string', '-', '主文本；单行时唯一展示值，双行时为 Combo Title 首行。'),
    sceneProp(
      'secondaryValue',
      'string',
      '-',
      '副文本；lineLayout=double 时展示为 Footnote 次级行。',
    ),
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      '单行：Body Medium 一行；双行：Combo Title（主文本 + 副文本，spacing-05）。',
    ),
    listFieldMinWidthProp,
    sceneProp(
      'copyOnRowHover',
      'boolean',
      'false',
      '数据列悬浮时显示复制按钮；Tooltip 溢出菜单内复制始终可用，互不冲突。',
    ),
    sceneProp(
      'tooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      'Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。',
    ),
    sceneProp('ellipsis', "'tail'", "'tail'", '设置 minWidth 后超出宽度时尾部省略（同交易哈希）。'),
    sceneProp('tooltipWhenTruncated', 'boolean', 'true', '仅文本溢出省略时启用 Tooltip 交互。'),
  ],
  buildUsageSnippet: (state) => buildHashLikeUsageSnippet('ListFieldIdentifier', state, SAMPLE_ID),
};

const generalStructureConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldGeneralStructure',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-general-structure-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    value: SAMPLE_GENERAL_TITLE,
    secondaryValue: SAMPLE_GENERAL_SECONDARY,
    lineLayout: 'single',
    minWidth: '',
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
    showTag: false,
    size: 'sm',
    family: 'system',
    systemType: 'stroke-subtle',
    label: tagSystemCustomizeDefaults.label,
  },
  customizeControls: buildHashLikeCustomizeControls(
    '主文本 value',
    {
      value: SAMPLE_GENERAL_TITLE,
      secondaryValue: SAMPLE_GENERAL_SECONDARY,
    },
    [{ kind: 'boolean', key: 'showTag', label: '显示 Tag', row: 0 }],
  ),
  customizePanels: [
    {
      title: 'EgTag',
      controls: tagSystemSmCustomizeControls,
      visibleWhen: (state) => Boolean(state.showTag),
    },
  ],
  propRows: [
    sceneProp('value', 'string', '-', '主文本；单行时唯一展示值，双行时为 Combo Title 首行。'),
    sceneProp(
      'secondaryValue',
      'string',
      '-',
      '副文本；lineLayout=double 时展示为 Footnote 次级行。',
    ),
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      '单行：Body Medium 一行；双行：Combo Title（主文本 + 副文本，spacing-05）。',
    ),
    listFieldMinWidthProp,
    sceneProp(
      'copyOnRowHover',
      'boolean',
      'false',
      '数据列悬浮时显示复制按钮；Tooltip 溢出菜单内复制始终可用，互不冲突。',
    ),
    sceneProp(
      'tooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      'Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。',
    ),
    sceneProp('ellipsis', "'tail'", "'tail'", '设置 minWidth 后超出宽度时尾部省略（同交易哈希）。'),
    sceneProp('tooltipWhenTruncated', 'boolean', 'true', '仅文本溢出省略时启用 Tooltip 交互。'),
    sceneProp('showTag', 'boolean', 'false', '勾选后在主文本同行展示 EgTag（spacing-1，固定 Sm）。'),
    sceneProp('size', "'sm'", "'sm'", 'General Structure 内嵌 EgTag 固定 Sm，不可配置。'),
    ...tagSystemPropRows
      .filter((row) => row.name !== 'size')
      .map((row) =>
        row.name === 'systemType'
          ? { ...row, defaultValue: "'stroke-subtle'", description: 'System 类型变体；General Structure 默认 stroke-subtle。' }
          : row,
      ),
    sceneProp('family', "'system'", "'system'", 'Customize「EgTag」嵌套 System Tag 属性。'),
  ],
  buildUsageSnippet: (state) => {
    const hashLike = buildHashLikeUsageSnippet(
      'ListFieldGeneralStructure',
      state,
      SAMPLE_GENERAL_TITLE,
    );
    if (!state.showTag) return hashLike;

    const tag = buildTagSystemUsageSnippet({ ...state, size: 'sm', systemType: state.systemType ?? 'stroke-subtle' });
    return ['<div class="list-field-general-structure">', hashLike, tag, '</div>'].join('\n');
  },
};

const amountConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldAmount',
  importCode: `${LIST_FIELD_IMPORT}\n// formatGroupedNumber for grouped digits`,
  propsSectionId: 'list-field-amount-props',
  customizeDefaults: {
    amountType: 'conversion',
    fiatValue: '$12,500.01',
    cryptoValue: '12,500.000001',
    minWidth: '',
  },
  customizeControls: [
    {
      kind: 'select',
      key: 'amountType',
      label: '类型 amountType',
      options: amountTypeOptions,
      row: 1,
    },
    listFieldMinWidthControl(1),
    {
      kind: 'text',
      key: 'fiatValue',
      label: '法币 fiatValue',
      row: 2,
      visibleWhen: (state) => state.amountType !== 'crypto',
    },
    {
      kind: 'text',
      key: 'cryptoValue',
      label: '数量 cryptoValue',
      row: 2,
      visibleWhen: (state) => state.amountType !== 'fiat',
    },
  ],
  propRows: [
    sceneProp(
      'amountType',
      "'fiat' | 'crypto' | 'conversion'",
      "'crypto'",
      '法币、加密货币、或带折合行。',
    ),
    sceneProp('groupSeparator', 'boolean', 'true', '千分位分隔符。'),
    sceneProp('fiatPrecision', 'number', '2', '法币小数精度。'),
    sceneProp('conversionLine', 'string', '-', '折合行：`数量 币种 ≈ 折合法币`。'),
    listFieldMinWidthProp,
  ],
  buildUsageSnippet: buildAmountUsageSnippet,
};

const timeConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldTime',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-time-props',
  customizeDefaults: {
    lineLayout: 'single',
    datetime: '2026-07-19 14:30:00',
    secondaryDatetime: '2026-07-19 08:30:00',
    utcOffset: '+08:00',
    showHeaderHint: true,
    minWidth: '',
  },
  customizeControls: [
    {
      kind: 'select',
      key: 'lineLayout',
      label: '类型 lineLayout',
      options: timeLineLayoutOptions,
      row: 0,
    },
    listFieldMinWidthControl(0),
    { kind: 'text', key: 'datetime', label: '时间 datetime', row: 0 },
    {
      kind: 'text',
      key: 'secondaryDatetime',
      label: '副时间 secondaryDatetime',
      row: 0,
      visibleWhen: (state) => String(state.lineLayout ?? 'single') === 'double',
    },
    { kind: 'text', key: 'utcOffset', label: '时区 utcOffset', row: 1 },
    { kind: 'boolean', key: 'showHeaderHint', label: '表头提示 showHeaderHint', row: 1 },
  ],
  propRows: [
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      '单：仅主时间；双：主时间 + 副时间（Body Small 双行，spacing-05）。',
    ),
    sceneProp('datetime', 'string', '-', '主时间，格式 YYYY-MM-DD HH:MM:SS。'),
    sceneProp(
      'secondaryDatetime',
      'string',
      '-',
      '副时间；lineLayout=double 时展示为第二行。',
    ),
    sceneProp('utcOffset', 'string', '-', '列头 Transaction Time (UTC±…) 提示。'),
    sceneProp('showHeaderHint', 'boolean', 'false', '是否在列头展示 UTC 偏移。'),
    listFieldMinWidthProp,
  ],
  buildUsageSnippet: buildTimeUsageSnippet,
};

const statusConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldStatus',
  importCode: tagImportCode,
  propsSectionId: 'list-field-status-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    minWidth: '',
    size: 'lg',
    family: 'status',
    status: 'success',
    label: 'Success',
    showFeedback: false,
    type: formSubmissionCustomizeDefaults.type,
    text: formSubmissionCustomizeDefaults.text,
    linkLabel: formSubmissionCustomizeDefaults.linkLabel,
    showLink: formSubmissionCustomizeDefaults.showLink,
  },
  customizeControls: [
    listFieldMinWidthControl(0),
    ...withCustomizeRow(tagStatusCustomizeControls, 0),
    { kind: 'boolean', key: 'showFeedback', label: '显示反馈', row: 0 },
  ],
  customizePanels: [
    {
      title: 'EgFormSubmission',
      controls: formSubmissionCustomizeControls,
      visibleWhen: (state) => Boolean(state.showFeedback),
    },
  ],
  propRows: [
    ...tagStatusPropRows.map((row) =>
      row.name === 'size'
        ? { ...row, defaultValue: "'lg'", description: 'Data List 单元格使用 Lg。' }
        : row,
    ),
    listFieldMinWidthProp,
    sceneProp('showFeedback', 'boolean', 'false', '勾选后在 Status Tag 下方展示 Form Submission（spacing-05）。'),
    sceneProp('family', "'status'", "'status'", 'List Field 单元格使用 Status Tag。'),
    ...formSubmissionPropRows.map((row) => ({
      ...row,
      description: `Customize「EgFormSubmission」嵌套 — ${row.description}`,
    })),
  ],
  buildUsageSnippet: buildStatusUsageSnippet,
};

const actionConfig: ListFieldDocConfig = {
  componentTag: 'ListFieldAction',
  importCode: `import { EgDataList, EgDataListColumn } from '@eds/desktop-components';`,
  propsSectionId: 'list-field-action-props',
  compactPreview: true,
  customizeDefaults: listFieldActionCustomizeDefaults(),
  customizeControls: [
    { kind: 'text', key: 'primaryLabel', label: '主按钮 label', row: 0 },
    {
      kind: 'select',
      key: 'moreActionCount',
      label: '更多操作数',
      options: countSelectOptions(LIST_FIELD_MORE_ACTION_COUNT_MAX, 0),
      row: 0,
    },
    { kind: 'text', key: 'minWidth', label: '最小宽度', row: 1 },
    ...buildMoreActionCustomizeControls(),
  ],
  propRows: [
    sceneProp('primaryAction', '{ label: string }', '-', 'Solid 主操作按钮。'),
    sceneProp(
      'moreActions',
      'DataListRowAction[]',
      '[]',
      '0 个：仅主按钮；1 个：主按钮 + 文本次按钮；2+ 个：主按钮 + More 菜单。定制面板可选 0～10 个。',
    ),
    sceneProp('minWidth', 'number', '-', '预览区最小宽度（px）；不传为自适应。'),
    sceneProp('align', "'right'", "'right'", 'Action 列右对齐。'),
    sceneProp('columnMinWidth', '180px', '180px', 'Action 列推荐最小宽度（Data List 列宽）。'),
  ],
  buildUsageSnippet: buildActionUsageSnippet,
};

const listFieldDocConfigBySlug: Record<ListFieldSceneSlug, ListFieldDocConfig> = {
  'list-field-currency': currencyConfig,
  'list-field-address': addressConfig,
  'list-field-transaction-hash': transactionHashConfig,
  'list-field-identifier': identifierConfig,
  'list-field-general-structure': generalStructureConfig,
  'list-field-amount': amountConfig,
  'list-field-time': timeConfig,
  'list-field-status': statusConfig,
  'list-field-action': actionConfig,
};

export function getListFieldDocConfig(slug: ListFieldSceneSlug): ListFieldDocConfig {
  return listFieldDocConfigBySlug[slug];
}
