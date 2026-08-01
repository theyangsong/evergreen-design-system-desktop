import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { cryptoNames, getProcessedCrypto } from '@eds/desktop-components';
import {
  buildVueOpeningTag,
  buildVueSelfClosingSnippet,
} from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  alignStartEndRows,
  buttonSizeRows,
  countSelectOptions,
  flotationBoxTypeRows,
  flotationTriggerStyleRows,
  heightModeRows,
  placementRows,
  propLabelRows,
  showcaseFlotationBoxTypeLabels,
  showcaseFlotationBoxKindLabels,
  showcaseFlotationBoxSelectionModeLabels,
  showcaseFormSubmissionTypeLabels,
  showcaseInputCustomizeFieldLabels,
  showcaseMessageTypeLabels,
  showcaseTagStatusLabels,
  widthModeTriggerFixedAdaptiveRows,
  tokenLabel,
} from '@/data/showcasePropLabels';
import { formSubmissionCustomizeDefaults } from './feedbackDocCustomize';

export const flotationImportCode = `import {
  EgFlotation,
  EgFlotationTrigger,
  EgFlotationMenu,
  EgFlotationMenuItem,
} from '@eds/desktop-components';`;

export const flotationTriggerImportCode = `import {
  EgComboInputItem,
  EgFlotationTrigger,
  EgFormSubmission,
} from '@eds/desktop-components';`;

export const flotationBoxImportCode = `import {
  EgFlotationMenu,
  EgFlotationMenuItem,
} from '@eds/desktop-components';`;

export const flotationItemImportCode = `import { EgFlotationMenuItem } from '@eds/desktop-components';`;

/* ── Overview：触发器 Trigger / Menu / Box ── */

export const flotationTagStatusOptions = propLabelRows(
  ['danger', 'warning', 'success', 'ready', 'invalid'] as const,
  showcaseTagStatusLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const flotationMessageTypeOptions = propLabelRows(
  ['subtle', 'brand', 'danger'] as const,
  showcaseMessageTypeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const flotationItemCountOptions = countSelectOptions(20);

const flotationBoxTypeOptions = propLabelRows(
  ['text', 'symbol-text', 'image-text'] as const,
  showcaseFlotationBoxTypeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const flotationDefaultCryptoAsset = 'eds-aave-aave';

const flotationCryptoOptions = cryptoNames
  .filter((name) => Boolean(getProcessedCrypto(name)))
  .map((name) => ({ value: name, label: name }));

export function flotationBoxItemLeadingDefault(
  boxType: 'text' | 'symbol-text' | 'image-text',
): string {
  return boxType === 'image-text' ? flotationDefaultCryptoAsset : 'eds-add';
}

/** Per-row Box 字段 key（与 Box 页可调项对齐） */
export function flotationBoxItemKey(
  field:
    | 'Label'
    | 'BoxType'
    | 'Disabled'
    | 'Focused'
    | 'ShowCheckbox'
    | 'Checked'
    | 'ShowTag'
    | 'TagText'
    | 'TagStatus'
    | 'ShowReddot'
    | 'ShowCascader'
    | 'ShowMessage'
    | 'MessageText'
    | 'MessageType'
    | 'SymbolIcon',
  index: number,
): string {
  return `item${field}${index}`;
}

export function createFlotationBoxItemDefaults(): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let n = 1; n <= 20; n += 1) {
    out[flotationBoxItemKey('Label', n)] = `Label ${n}`;
    out[flotationBoxItemKey('Disabled', n)] = false;
    out[flotationBoxItemKey('Focused', n)] = false;
    out[flotationBoxItemKey('Checked', n)] = false;
    out[flotationBoxItemKey('ShowTag', n)] = false;
    out[flotationBoxItemKey('TagText', n)] = 'Tag';
    out[flotationBoxItemKey('TagStatus', n)] = 'danger';
    out[flotationBoxItemKey('ShowReddot', n)] = false;
    out[flotationBoxItemKey('ShowCascader', n)] = false;
    out[flotationBoxItemKey('ShowMessage', n)] = false;
    out[flotationBoxItemKey('MessageText', n)] = '0';
    out[flotationBoxItemKey('MessageType', n)] = 'subtle';
    out[flotationBoxItemKey('SymbolIcon', n)] = 'eds-add';
  }
  return out;
}

export function parseFlotationItemCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.itemCount ?? '8'), 10);
  return Number.isFinite(parsed) ? Math.min(20, Math.max(1, parsed)) : 8;
}

export function parseFlotationEditBoxIndex(state: Record<string, unknown>): number {
  const count = parseFlotationItemCount(state);
  const parsed = Number.parseInt(String(state.editBoxIndex ?? '1'), 10);
  const index = Number.isFinite(parsed) ? parsed : 1;
  return Math.min(count, Math.max(1, index));
}

export function parseFlotationBoxItemType(
  state: Record<string, unknown>,
): 'text' | 'symbol-text' | 'image-text' {
  const raw = String(state.boxItemType ?? 'text');
  if (raw === 'symbol-text' || raw === 'image-text') return raw;
  return 'text';
}

export type FlotationBoxSelectionMode = 'single' | 'multiple';

export function parseFlotationBoxSelectionMode(
  state: Record<string, unknown>,
): FlotationBoxSelectionMode {
  return String(state.boxSelectionMode ?? 'single') === 'multiple' ? 'multiple' : 'single';
}

export function enforceFlotationSingleSelection(state: Record<string, unknown>): void {
  if (parseFlotationBoxSelectionMode(state) !== 'single') return;
  const count = parseFlotationItemCount(state);
  let selected = 0;
  for (let n = 1; n <= count; n += 1) {
    if (Boolean(state[flotationBoxItemKey('Checked', n)])) selected = n;
  }
  if (selected === 0) return;
  for (let n = 1; n <= count; n += 1) {
    state[flotationBoxItemKey('Checked', n)] = n === selected;
  }
}

const flotationBoxSelectionModeOptions = propLabelRows(
  ['single', 'multiple'] as const,
  showcaseFlotationBoxSelectionModeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export function parseFlotationCrossAxisOffset(
  state: Record<string, unknown>,
): number | undefined {
  const raw = String(state.crossAxisOffset ?? '').trim();
  if (raw === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFlotationMaxHeight(
  state: Record<string, unknown>,
): number | undefined {
  const raw = String(state.maxHeight ?? '').trim();
  if (raw === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const flotationCustomizeDefaults = {
  triggerKind: 'standard-dropdown',
  placement: 'bottom',
  crossAxisOffset: '',
  triggerLabel: 'Trigger',
  triggerStyle: 'subtle',
  triggerSize: 'lg',
  disabled: false,
  showSymbol: false,
  symbolIcon: 'eds-coin-btc',
  showTag: false,
  tagText: 'Tag',
  tagStatus: 'danger',
  showMessage: false,
  messageText: '0',
  messageType: 'brand',
  showAdd: true,
  addLabel: 'Add',
  widthMode: 'fixed',
  width: '280',
  align: 'start',
  heightMode: 'adaptive',
  height: '306',
  maxHeight: '',
  boxItemType: 'text',
  boxSelectionMode: 'single',
  itemCount: '8',
  editBoxIndex: '1',
  ...createFlotationBoxItemDefaults(),
};

/** 触发器 Trigger — 对齐 /components/flotation-trigger（纵览页 EgFlotation 状态键） */
/** 纵览页 EgFlotation — 标准下拉框（row0 水平；显示类 boolean 逐行垂直） */
export const flotationTriggerOverviewBodyControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerStyle',
    label: '样式',
    row: 0,
    options: flotationTriggerStyleRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'triggerSize',
    label: '尺寸',
    row: 0,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'triggerLabel', label: '文案', row: 0 },
  { kind: 'boolean', key: 'disabled', label: '禁用', row: 0 },
  { kind: 'boolean', key: 'showSymbol', label: '显示图标', row: 1 },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: '图标名',
    row: 2,
    visibleWhen: (s) => Boolean(s.showSymbol),
  },
];

export const flotationTriggerOverviewDropdownControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showTag', label: '显示标签', row: 3 },
  {
    kind: 'text',
    key: 'tagText',
    label: '标签文案',
    row: 4,
    visibleWhen: (s) => Boolean(s.showTag),
  },
  {
    kind: 'select',
    key: 'tagStatus',
    label: '标签状态',
    row: 4,
    options: [...flotationTagStatusOptions],
    visibleWhen: (s) => Boolean(s.showTag),
  },
  { kind: 'boolean', key: 'showMessage', label: '显示消息', row: 5 },
  {
    kind: 'text',
    key: 'messageText',
    label: '消息文案',
    row: 6,
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: '消息类型',
    row: 6,
    options: [...flotationMessageTypeOptions],
    visibleWhen: (s) => Boolean(s.showMessage),
  },
];

/** @deprecated 使用 flotationTriggerOverviewBodyControls + flotationTriggerOverviewDropdownControls */
export const flotationTriggerPanelControls: DocCustomizeControl[] = [
  ...flotationTriggerOverviewBodyControls,
  ...flotationTriggerOverviewDropdownControls,
];

/** Menu — 宽/高；自定义宽度时可选对齐；主轴固定 spacing-025；crossAxisOffset 可定制 */
export function buildFlotationMenuPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const placement = String(state.placement ?? 'bottom');
  const sidePlacement = placement === 'left' || placement === 'right';
  const widthMode = String(state.widthMode ?? 'fixed');
  const showCustomAlign = widthMode === 'fixed' || widthMode === 'adaptive';

  return [
    {
      kind: 'select',
      key: 'placement',
      label: '弹出方向',
      row: 0,
      options: placementRows.map((row) => ({ value: row.key, label: row.label })),
    },
    { kind: 'text', key: 'crossAxisOffset', label: '交叉轴偏移', row: 0 },
    {
      kind: 'select',
      key: 'widthMode',
      label: '宽度',
      row: 1,
      options: widthModeTriggerFixedAdaptiveRows.map((row) => ({ value: row.key, label: row.label })),
    },
    {
      kind: 'text',
      key: 'width',
      label: '宽度',
      row: 1,
      visibleWhen: (s) => String(s.widthMode ?? 'fixed') === 'fixed',
    },
    {
      kind: 'select',
      key: 'align',
      label: '对齐',
      row: 1,
      options: alignStartEndRows.map((row) => ({ value: row.key, label: row.label })),
      visibleWhen: () => showCustomAlign,
    },
    {
      kind: 'select',
      key: 'heightMode',
      label: '高度',
      row: 2,
      options: heightModeRows.map((row) => ({ value: row.key, label: row.label })),
    },
    {
      kind: 'text',
      key: 'height',
      label: '高度值',
      row: 2,
      visibleWhen: (s) => String(s.heightMode ?? 'adaptive') === 'fixed',
    },
    {
      kind: 'text',
      key: 'maxHeight',
      label: '最大高度',
      placeholder: '可选',
      row: 2,
      visibleWhen: (s) => String(s.heightMode ?? 'adaptive') === 'adaptive',
    },
  ];
}

/** @deprecated 使用 buildFlotationMenuPanelControls */
export const flotationMenuPanelControls: DocCustomizeControl[] =
  buildFlotationMenuPanelControls(flotationCustomizeDefaults);

/**
 * 当前编辑行的 Item 字段（原 Item 小类；与 boxItemType / boxSelectionMode 配合）
 */
export function buildFlotationItemRowControls(editIndex: number): DocCustomizeControl[] {
  const showTagKey = flotationBoxItemKey('ShowTag', editIndex);
  const showMessageKey = flotationBoxItemKey('ShowMessage', editIndex);

  return [
    {
      kind: 'text',
      key: flotationBoxItemKey('Label', editIndex),
      label: '文案',
      row: 1,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('Disabled', editIndex),
      label: '禁用',
      row: 2,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('Checked', editIndex),
      label: '选中',
      row: 3,
    },
    {
      kind: 'boolean',
      key: showTagKey,
      label: '显示标签',
      row: 4,
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('TagText', editIndex),
      label: '标签文案',
      row: 4,
      visibleWhen: (s) => Boolean(s[showTagKey]),
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('TagStatus', editIndex),
      label: '标签状态',
      options: [...flotationTagStatusOptions],
      row: 4,
      visibleWhen: (s) => Boolean(s[showTagKey]),
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('ShowReddot', editIndex),
      label: '红点',
      row: 5,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('ShowCascader', editIndex),
      label: '级联箭头',
      row: 5,
    },
    {
      kind: 'boolean',
      key: showMessageKey,
      label: '显示消息',
      row: 6,
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('MessageText', editIndex),
      label: '消息文案',
      row: 6,
      visibleWhen: (s) => Boolean(s[showMessageKey]),
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('MessageType', editIndex),
      label: '消息类型',
      row: 6,
      options: [...flotationMessageTypeOptions],
      visibleWhen: (s) => Boolean(s[showMessageKey]),
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('SymbolIcon', editIndex),
      label: '图标名',
      row: 7,
      visibleWhen: (s) => parseFlotationBoxItemType(s) === 'symbol-text',
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('SymbolIcon', editIndex),
      label: '图片',
      row: 7,
      options: flotationCryptoOptions,
      visibleWhen: (s) => parseFlotationBoxItemType(s) === 'image-text',
    },
  ];
}

/**
 * Box — row0：行数 + 选择模式 + 类型 + Add + 编辑行（水平）；row1+：当前行 Item 字段
 */
export function buildFlotationBoxPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const count = parseFlotationItemCount(state);
  const editIndex = parseFlotationEditBoxIndex(state);

  return [
    {
      kind: 'select',
      key: 'itemCount',
      label: '行数',
      options: flotationItemCountOptions,
      row: 0,
    },
    {
      kind: 'select',
      key: 'boxSelectionMode',
      label: '选择模式',
      options: flotationBoxSelectionModeOptions,
      row: 0,
    },
    {
      kind: 'select',
      key: 'boxItemType',
      label: '类型',
      options: flotationBoxTypeOptions,
      row: 0,
    },
    { kind: 'boolean', key: 'showAdd', label: '显示 Add', row: 0 },
    {
      kind: 'text',
      key: 'addLabel',
      label: 'Add 文案',
      row: 0,
      visibleWhen: (s) => Boolean(s.showAdd),
    },
    {
      kind: 'select',
      key: 'editBoxIndex',
      label: '编辑行',
      options: Array.from({ length: count }, (_, index) => {
        const n = index + 1;
        return { value: String(n), label: `第 ${n} 行` };
      }),
      row: 0,
    },
    ...buildFlotationItemRowControls(editIndex),
  ];
}

/** @deprecated Overview 已拆为三面板；保留空数组以免旧引用报错 */
export const flotationCustomizeControls: DocCustomizeControl[] = [];

export function buildFlotationUsageSnippet(state: Record<string, unknown>): string {
  const widthMode = String(state.widthMode ?? 'fixed');
  const heightMode = String(state.heightMode ?? 'adaptive');
  const props: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    triggerLabel: state.triggerLabel,
    triggerStyle: state.triggerStyle,
    triggerSize: state.triggerSize,
    disabled: state.disabled,
    showSymbol: state.showSymbol,
    symbolIcon: state.symbolIcon,
    showTag: state.showTag,
    tagText: state.tagText,
    tagStatus: state.tagStatus,
    showMessage: state.showMessage,
    messageText: state.messageText,
    messageType: state.messageType,
    showAdd: state.showAdd,
    addLabel: state.addLabel,
    widthMode,
    heightMode,
  };

  if (widthMode === 'fixed') {
    props.width = Number.parseInt(String(state.width ?? ''), 10) || 280;
  }
  if (heightMode === 'fixed') {
    props.height = Number.parseInt(String(state.height ?? ''), 10) || 306;
  } else {
    const maxHeight = parseFlotationMaxHeight(state);
    if (maxHeight != null) props.maxHeight = maxHeight;
  }

  const crossAxisOffset = parseFlotationCrossAxisOffset(state);
  if (crossAxisOffset != null) {
    props.crossAxisOffset = crossAxisOffset;
  }

  const openTag = buildVueOpeningTag('EgFlotation', props, {
    defaults: {
      placement: flotationCustomizeDefaults.placement,
      align: flotationCustomizeDefaults.align,
      triggerLabel: flotationCustomizeDefaults.triggerLabel,
      triggerStyle: flotationCustomizeDefaults.triggerStyle,
      triggerSize: flotationCustomizeDefaults.triggerSize,
      disabled: flotationCustomizeDefaults.disabled,
      showSymbol: flotationCustomizeDefaults.showSymbol,
      symbolIcon: flotationCustomizeDefaults.symbolIcon,
      showTag: flotationCustomizeDefaults.showTag,
      tagText: flotationCustomizeDefaults.tagText,
      tagStatus: flotationCustomizeDefaults.tagStatus,
      showMessage: flotationCustomizeDefaults.showMessage,
      messageType: flotationCustomizeDefaults.messageType,
      showAdd: flotationCustomizeDefaults.showAdd,
      widthMode: flotationCustomizeDefaults.widthMode,
      width: Number.parseInt(flotationCustomizeDefaults.width, 10),
      heightMode: flotationCustomizeDefaults.heightMode,
      height: Number.parseInt(flotationCustomizeDefaults.height, 10),
    },
    omitKeys: ['itemCount', 'editBoxIndex'],
  });
  return `${openTag}\n  <!-- #trigger / #content 可替换预置 EgFlotationTrigger / EgFlotationMenu -->\n</EgFlotation>`;
}

export const flotationPropRows: DocPropRow[] = [
  {
    name: 'placement / disabled',
    type: 'TooltipPlacement / boolean',
    defaultValue: "'bottom' / false",
    description: '透传 EgAnchoredTooltip。主轴间距固定为 --spacing-025。',
  },
  {
    name: 'crossAxisOffset',
    type: 'number',
    defaultValue: '-spacing-2 (-8px)',
    description: '交叉轴偏移（px）；未传时默认 -spacing-2。',
  },
  {
    name: 'triggerLabel / triggerStyle / triggerSize / showSymbol / showTag / showMessage',
    type: '…',
    defaultValue: 'Trigger / subtle / lg / false…',
    description: '无 #trigger 时的 EgFlotationTrigger 预置（见「触发器 Trigger」定制）。',
  },
  {
    name: 'widthMode / width / align / heightMode / height / maxHeight',
    type: 'trigger|fixed|adaptive / number / start|end / …',
    defaultValue: 'fixed / 280 / start / adaptive / 306 / —',
    description:
      'trigger：宽=触发器+2×spacing-2，左右各扩 spacing-2。fixed/adaptive：宽自定义或自适应；align=start 时交叉轴 -spacing-2，align=end 时 +spacing-2。heightMode=adaptive 时可传 maxHeight（px，可选）。主轴间距固定 spacing-025。',
  },
  {
    name: 'items / showAdd / addLabel',
    type: 'FlotationMenuItemPreset[] / boolean / string',
    defaultValue: 'Label 1–8 / true / Add',
    description:
      '无 #content 时的 Box 行与底部 Add。Showcase「Box」面板配置类型、Add 文案及按编辑行的 Label/Tag 等；点击行关闭菜单并回显 Trigger。',
  },
];

export const flotationSlotRows: DocPropRow[] = [
  {
    name: 'trigger',
    type: '—',
    defaultValue: '—',
    description: '触发器插槽。默认 EgFlotationTrigger；可完全自定义。',
  },
  {
    name: 'content',
    type: '—',
    defaultValue: '—',
    description: '浮层内容插槽。默认 EgFlotationMenu（内嵌 EgTooltip）；可完全自定义。',
  },
];

export function buildFlotationPresetItems(
  count: number,
  state?: Record<string, unknown>,
) {
  const safe = Math.min(20, Math.max(1, Math.floor(count)));
  return Array.from({ length: safe }, (_, index) => {
    const n = index + 1;
    const labelKey = flotationBoxItemKey('Label', n);
    const rawLabel = state?.[labelKey];
    const label =
      rawLabel != null && String(rawLabel).trim() !== ''
        ? String(rawLabel)
        : `Label ${n}`;

    const boxType = parseFlotationBoxItemType(state ?? {});
    const leadingDefault = flotationBoxItemLeadingDefault(boxType);
    const leadingRaw = state?.[flotationBoxItemKey('SymbolIcon', n)];
    const leadingAsset =
      leadingRaw != null && String(leadingRaw).trim() !== ''
        ? String(leadingRaw)
        : leadingDefault;

    const tagStatusRaw = String(state?.[flotationBoxItemKey('TagStatus', n)] ?? 'danger');
    const tagStatuses = ['danger', 'warning', 'success', 'ready', 'invalid'] as const;
    const tagStatus = (tagStatuses as readonly string[]).includes(tagStatusRaw)
      ? (tagStatusRaw as (typeof tagStatuses)[number])
      : 'danger';

    const selectionMode = parseFlotationBoxSelectionMode(state ?? {});
    const isSelected = Boolean(state?.[flotationBoxItemKey('Checked', n)]);
    const isMultiple = selectionMode === 'multiple';

    return {
      label,
      boxType: boxType as 'text' | 'symbol-text' | 'image-text',
      disabled: Boolean(state?.[flotationBoxItemKey('Disabled', n)]),
      focused: isMultiple
        ? Boolean(state?.[flotationBoxItemKey('Focused', n)])
        : isSelected,
      showCheckbox: isMultiple,
      checked: isMultiple ? isSelected : false,
      showTag: Boolean(state?.[flotationBoxItemKey('ShowTag', n)]),
      tag: String(state?.[flotationBoxItemKey('TagText', n)] ?? 'Tag'),
      tagStatus,
      showReddot: Boolean(state?.[flotationBoxItemKey('ShowReddot', n)]),
      showCascader: Boolean(state?.[flotationBoxItemKey('ShowCascader', n)]),
      showMessage: Boolean(state?.[flotationBoxItemKey('ShowMessage', n)]),
      messageText: String(state?.[flotationBoxItemKey('MessageText', n)] ?? '0'),
      messageType: (['subtle', 'brand', 'danger'].includes(
        String(state?.[flotationBoxItemKey('MessageType', n)] ?? 'subtle'),
      )
        ? String(state?.[flotationBoxItemKey('MessageType', n)] ?? 'subtle')
        : 'subtle') as 'subtle' | 'brand' | 'danger',
      symbolIcon: leadingAsset,
    };
  });
}

/* ── Trigger 小类 ── */

export const flotationTriggerCustomizeDefaults = {
  triggerKind: 'standard-dropdown',
  showFieldLabel: false,
  fieldLabel: 'Label',
  feedback: false,
  ...formSubmissionCustomizeDefaults,
  triggerStyle: 'subtle',
  size: 'lg',
  widthMode: 'adaptive',
  width: '280',
  label: 'Trigger',
  disabled: false,
  showSymbol: false,
  symbolIcon: 'eds-coin-btc',
  showTag: false,
  tagText: 'Tag',
  tagStatus: 'danger',
  showMessage: false,
  messageText: '0',
  messageType: 'brand',
  expanded: false,
} as const;

/** Showcase：触发器类型（当前仅标准下拉框） */
export const flotationTriggerKindCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerKind',
    label: '触发器',
    options: [{ value: 'standard-dropdown', label: '标准下拉框' }],
  },
];

/** Combo 字段壳：标题 / 反馈区（两行垂直；每行内勾选后水平展开） */
export function buildFlotationTriggerFeedbackCustomizeControls(): DocCustomizeControl[] {
  return [
    {
      kind: 'select',
      key: 'type',
      label: '类型',
      row: 1,
      options: propLabelRows(['notes', 'danger', 'success'] as const, showcaseFormSubmissionTypeLabels).map(
        (row) => ({ value: row.key, label: row.label }),
      ),
      visibleWhen: (s) => Boolean(s.feedback),
    },
    {
      kind: 'text',
      key: 'text',
      label: '文案',
      row: 1,
      visibleWhen: (s) => Boolean(s.feedback),
    },
    {
      kind: 'text',
      key: 'linkLabel',
      label: '链接文案',
      row: 1,
      visibleWhen: (s) => Boolean(s.feedback) && s.type === 'notes',
    },
    {
      kind: 'boolean',
      key: 'showLink',
      label: '显示链接',
      row: 1,
      visibleWhen: (s) => Boolean(s.feedback) && s.type === 'notes',
    },
  ];
}

export const flotationTriggerShellCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'boolean',
    key: 'showFieldLabel',
    label: showcaseInputCustomizeFieldLabels.label,
    row: 0,
  },
  {
    kind: 'text',
    key: 'fieldLabel',
    label: '标题文案',
    row: 0,
    visibleWhen: (s) => Boolean(s.showFieldLabel),
  },
  {
    kind: 'boolean',
    key: 'feedback',
    label: showcaseInputCustomizeFieldLabels.feedback,
    row: 1,
  },
  ...buildFlotationTriggerFeedbackCustomizeControls(),
];

/** 触发器本体：Style / Size / 文案 / Symbol */
export const flotationTriggerBodyCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerStyle',
    label: '样式',
    row: 2,
    options: flotationTriggerStyleRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: '宽度',
    row: 2,
    options: widthModeTriggerFixedAdaptiveRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'text',
    key: 'width',
    label: '宽度值',
    row: 2,
    visibleWhen: (s) => String(s.widthMode ?? 'adaptive') === 'fixed',
  },
  {
    kind: 'select',
    key: 'size',
    label: '尺寸',
    row: 2,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'label', label: '文案', row: 2 },
  { kind: 'boolean', key: 'disabled', label: '禁用', row: 3 },
  { kind: 'boolean', key: 'showSymbol', label: '显示图标', row: 4 },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: '图标名',
    row: 4,
    visibleWhen: (s) => Boolean(s.showSymbol),
  },
];

/** 下拉选项 · 标准下拉框：Tag / Message / 展开箭头 */
export const flotationTriggerDropdownCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showTag', label: '显示标签', row: 5 },
  {
    kind: 'text',
    key: 'tagText',
    label: '标签文案',
    row: 5,
    visibleWhen: (s) => Boolean(s.showTag),
  },
  {
    kind: 'select',
    key: 'tagStatus',
    label: '标签状态',
    row: 5,
    options: [...flotationTagStatusOptions],
    visibleWhen: (s) => Boolean(s.showTag),
  },
  { kind: 'boolean', key: 'showMessage', label: '显示消息', row: 6 },
  {
    kind: 'text',
    key: 'messageText',
    label: '消息文案',
    row: 6,
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: '消息类型',
    row: 6,
    options: [...flotationMessageTypeOptions],
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  { kind: 'boolean', key: 'expanded', label: '展开态', row: 7 },
];

export const flotationTriggerCustomizeControls: DocCustomizeControl[] = [
  ...flotationTriggerShellCustomizeControls,
  ...flotationTriggerBodyCustomizeControls,
  ...flotationTriggerDropdownCustomizeControls,
];

/** 纵览页 EgFlotation：触发器预置（标准下拉框） */
export const flotationTriggerOverviewControls: DocCustomizeControl[] = [
  ...flotationTriggerOverviewBodyControls,
  ...flotationTriggerOverviewDropdownControls,
];

const flotationTriggerShellKeys = [
  'showFieldLabel',
  'fieldLabel',
  'feedback',
  'type',
  'text',
  'linkLabel',
  'showLink',
] as const;

/** Props for EgComboInputItem from merged Trigger customize state. */
export function flotationTriggerShellProps(state: Record<string, unknown>): Record<string, unknown> {
  return {
    label: state.fieldLabel,
    feedback: state.feedback,
  };
}

export function usesFlotationTriggerComboShell(state: Record<string, unknown>): boolean {
  return Boolean(state.showFieldLabel) || Boolean(state.feedback);
}

export function buildFlotationTriggerInnerSnippet(state: Record<string, unknown>): string {
  const widthMode = String(state.widthMode ?? 'adaptive');
  const props: Record<string, unknown> = { ...state };
  for (const key of flotationTriggerShellKeys) {
    delete props[key];
  }
  if (widthMode === 'fixed') {
    const parsed = Number.parseInt(String(state.width ?? ''), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      props.width = parsed;
    }
  } else {
    delete props.width;
  }

  return buildVueSelfClosingSnippet('EgFlotationTrigger', props, {
    defaults: { ...flotationTriggerCustomizeDefaults },
    omitKeys:
      widthMode === 'fixed'
        ? ['triggerKind', ...flotationTriggerShellKeys]
        : ['width', 'triggerKind', ...flotationTriggerShellKeys],
  });
}

export function buildFlotationTriggerUsageSnippet(state: Record<string, unknown>): string {
  const inner = buildFlotationTriggerInnerSnippet(state);

  if (!usesFlotationTriggerComboShell(state)) {
    return inner;
  }

  const shellDefaults = {
    label: flotationTriggerCustomizeDefaults.fieldLabel,
    feedback: flotationTriggerCustomizeDefaults.feedback,
  };
  const openTag = buildVueSelfClosingSnippet(
    'EgComboInputItem',
    flotationTriggerShellProps(state),
    { defaults: shellDefaults },
  )
    .replace(/\s*\/>$/, '')
    .trim();

  const feedbackSlot = state.feedback
    ? `\n  <template #feedback>\n    <EgFormSubmission type="${String(state.type ?? 'notes')}" text="${String(state.text ?? '')}" />\n  </template>`
    : '';

  return `${openTag}>\n  ${inner}${feedbackSlot}\n</EgComboInputItem>`;
}

export const flotationTriggerPropRows: DocPropRow[] = [
  {
    name: 'triggerStyle',
    type: "'subtle' | 'outline' | 'text'",
    defaultValue: "'subtle'",
    description: 'Figma Style。预置外观；整控件可由 #trigger 替换。',
  },
  {
    name: 'size',
    type: "'lg' | 'md' | 'sm' | 'xs'",
    defaultValue: "'lg'",
    description: 'Figma Size。',
  },
  {
    name: 'widthMode / width',
    type: "'trigger' | 'adaptive' | 'fixed' / number",
    defaultValue: "'adaptive' / —",
    description:
      '等于触发器：内容 hug；自适应：100% 父宽；固定宽度：widthMode=fixed 时 width（px）。',
  },
  {
    name: 'label / disabled / expanded',
    type: 'string / boolean / boolean',
    defaultValue: "'Trigger' / false / false",
    description: '文案、禁用、展开箭头方向。展开态（expanded）背景为 --event-focus；关闭后恢复默认。',
  },
  {
    name: 'showSymbol / symbolIcon / showTag / tagText / tagStatus / showMessage / messageType',
    type: 'boolean / string / … / TagStatus / boolean / MessageType',
    defaultValue: 'false / eds-coin-btc / false / Tag / danger / false / brand',
    description:
      '币种 Icon（#symbol）、EgTag Status sm（#tag）、Message（#message，type：subtle | brand | danger）。',
  },
];

export const flotationTriggerSlotRows: DocPropRow[] = [
  { name: 'default', type: '—', defaultValue: '—', description: '触发器文案。' },
  { name: 'symbol', type: '—', defaultValue: '—', description: '左侧币种 / 头像。' },
  { name: 'tag', type: '—', defaultValue: '—', description: 'EgTag Status sm。' },
  { name: 'message', type: '—', defaultValue: '—', description: '右侧 Message。' },
  { name: 'arrow', type: '—', defaultValue: '—', description: '下拉箭头。' },
];

/* ── Box 小类 ── */

const flotationBoxKindOptions = propLabelRows(
  ['standard-menu', 'standard-cascade-menu'] as const,
  showcaseFlotationBoxKindLabels,
);

/** Showcase：盒子插槽类型 */
export const flotationBoxKindCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'boxKind',
    label: '盒子插槽',
    options: flotationBoxKindOptions.map((row) => ({ value: row.key, label: row.label })),
  },
];

export function getFlotationBoxKindPanelTitle(boxKind: unknown): string {
  const key = String(boxKind ?? 'standard-menu');
  return (
    showcaseFlotationBoxKindLabels[key as keyof typeof showcaseFlotationBoxKindLabels] ??
    showcaseFlotationBoxKindLabels['standard-menu']
  );
}

/** Box 页：行数 / 编辑行 + 当前行 Item 字段（与纵览页「盒子 Box」一致） */
export function buildFlotationBoxKindPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  return buildFlotationBoxPanelControls(state);
}

export const flotationBoxPageCustomizeDefaults = {
  boxKind: 'standard-menu',
  boxItemType: 'text',
  boxSelectionMode: 'single',
  itemCount: '8',
  editBoxIndex: '1',
  showAdd: true,
  addLabel: 'Add',
  ...createFlotationBoxItemDefaults(),
};

export function buildFlotationBoxUsageSnippet(state: Record<string, unknown>): string {
  const count = parseFlotationItemCount(state);
  const openTag = buildVueOpeningTag(
    'EgFlotationMenu',
    {
      showAdd: state.showAdd,
      addLabel: state.addLabel,
    },
    {
      defaults: {
        showAdd: flotationBoxPageCustomizeDefaults.showAdd,
        addLabel: flotationBoxPageCustomizeDefaults.addLabel,
      },
      omitKeys: ['boxKind', 'boxItemType', 'boxSelectionMode', 'itemCount', 'editBoxIndex'],
    },
  );
  return `${openTag}
  <!-- EgFlotationMenuItem × ${count}；行配置见定制 -->
</EgFlotationMenu>`;
}

export const flotationBoxMenuPropRows: DocPropRow[] = [
  {
    name: 'showAdd / addLabel / showDivider',
    type: 'boolean / string / boolean',
    defaultValue: 'true / Add / true',
    description: '底部 Add 行与分隔线（Figma Menu）。',
  },
  {
    name: 'widthMode / width / heightMode / height / maxHeight',
    type: 'TooltipWidthMode / number / …',
    defaultValue: 'fixed / — / adaptive / — / —',
    description: '透传 EgTooltip 外壳；#default 为 EgFlotationMenuItem 列表。',
  },
];

export const flotationBoxMenuSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: '—',
    defaultValue: '—',
    description: 'EgFlotationMenuItem 行；可用预置 props 或完全自定义。',
  },
];

/* ── Item（已并入 Box 编辑行） ── */

export const flotationItemCustomizeDefaults = {
  boxType: 'text',
  label: '文案',
  disabled: false,
  focused: false,
  showCheckbox: false,
  checked: false,
  showTag: true,
  tagText: 'Tag',
  tagStatus: 'danger',
  showReddot: false,
  showCascader: false,
  showMessage: false,
  messageText: '0',
  messageType: 'subtle',
  symbolIcon: 'eds-add',
};

/** @deprecated 使用 flotationBoxPageCustomizeDefaults 或 flotationItemCustomizeDefaults */
export const flotationBoxCustomizeDefaults = flotationItemCustomizeDefaults;

/** @deprecated Item 已并入 Box 编辑行 */
export const flotationItemCustomizeControls: DocCustomizeControl[] =
  buildFlotationItemRowControls(1);

/** @deprecated 使用 flotationItemCustomizeControls */
export const flotationBoxStandardMenuCustomizeControls = flotationItemCustomizeControls;

/** @deprecated 使用 flotationItemCustomizeControls */
export const flotationBoxCustomizeControls = flotationItemCustomizeControls;

export function buildFlotationItemUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgFlotationMenuItem', state, {
    defaults: { ...flotationItemCustomizeDefaults },
  });
}

export const flotationItemPropRows: DocPropRow[] = [
  {
    name: 'boxType',
    type: "'text' | 'symbol-text' | 'image-text'",
    defaultValue: "'text'",
    description: 'Figma Box Type。预置布局；整行可由 Menu #default 内容替换。',
  },
  {
    name: 'label / disabled / focused',
    type: 'string / boolean / boolean',
    defaultValue: "'Label' / false / false",
    description: '文案与交互态（hover CSS；focused → --event-focus-brand-weaken）。',
  },
  {
    name: 'showCheckbox / checked',
    type: 'boolean',
    defaultValue: 'false',
    description: '嵌套 EgCheckbox。',
  },
  {
    name: 'showTag / tagText / tagStatus',
    type: 'boolean / string / TagStatus',
    defaultValue: 'true / Tag / danger',
    description: '嵌套 EgTag family=status size=sm。',
  },
  {
    name: 'showReddot / showCascader / showMessage / messageType',
    type: 'boolean / … / MessageType',
    defaultValue: 'false / subtle',
    description: 'EgReddot、级联箭头、EgMessage（type：subtle | brand | danger）。',
  },
];

export const flotationItemSlotRows: DocPropRow[] = [
  { name: 'default', type: '—', defaultValue: '—', description: 'Label 文案。' },
  { name: 'checkbox', type: '—', defaultValue: '—', description: '左侧选择控件。' },
  { name: 'leading', type: '—', defaultValue: '—', description: 'Symbol / Image。' },
  { name: 'tag', type: '—', defaultValue: '—', description: '标签。' },
  { name: 'message', type: '—', defaultValue: '—', description: '右侧 Message。' },
  {
    name: 'trailing',
    type: '—',
    defaultValue: '—',
    description: '整块右侧区（覆盖 reddot/cascader/message）。',
  },
];

/** @deprecated 使用 flotationItemPropRows */
export const flotationBoxPropRows = flotationItemPropRows;

/** @deprecated 使用 flotationItemSlotRows */
export const flotationBoxSlotRows = flotationItemSlotRows;

/** Box 页 Props / Slots（Menu + Item 合并） */
export const flotationBoxDocPropRows: DocPropRow[] = [
  ...flotationBoxMenuPropRows,
  ...flotationItemPropRows,
];

export const flotationBoxDocSlotRows: DocPropRow[] = [
  ...flotationBoxMenuSlotRows,
  ...flotationItemSlotRows,
];
