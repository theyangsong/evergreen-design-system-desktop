import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import {
  buildVueOpeningTag,
  buildVueSelfClosingSnippet,
} from '@/views/shared/componentDoc/buildUsageSnippet';

export const flotationImportCode = `import {
  EgFlotation,
  EgFlotationTrigger,
  EgFlotationMenu,
  EgFlotationMenuItem,
} from '@eds/desktop-components';`;

export const flotationTriggerImportCode = `import { EgFlotationTrigger } from '@eds/desktop-components';`;

export const flotationBoxImportCode = `import { EgFlotationMenuItem } from '@eds/desktop-components';`;

/* ── Overview：触发器 Trigger / Menu / Box ── */

export const flotationTagStatusOptions = [
  { value: 'danger', label: 'Danger' },
  { value: 'warning', label: 'Warning' },
  { value: 'success', label: 'Success' },
  { value: 'ready', label: 'Ready' },
  { value: 'invalid', label: 'Invalid' },
] as const;

export const flotationMessageTypeOptions = [
  { value: 'subtle', label: 'Subtle' },
  { value: 'brand', label: 'Brand' },
  { value: 'danger', label: 'Danger' },
] as const;

export const flotationItemCountOptions = Array.from({ length: 20 }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

const flotationBoxTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'symbol-text', label: 'Symbol+Text' },
  { value: 'image-text', label: 'Image+Text+Tag+Message' },
];

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
    out[flotationBoxItemKey('BoxType', n)] = 'text';
    out[flotationBoxItemKey('Disabled', n)] = false;
    out[flotationBoxItemKey('Focused', n)] = false;
    out[flotationBoxItemKey('ShowCheckbox', n)] = false;
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

export const flotationCustomizeDefaults = {
  placement: 'bottom',
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
  itemCount: '8',
  editBoxIndex: '1',
  ...createFlotationBoxItemDefaults(),
};

/** 触发器 Trigger — 对齐 /components/flotation-trigger（不含 Expanded，由开合态驱动） */
export const flotationTriggerPanelControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerStyle',
    label: 'Style',
    row: 0,
    options: [
      { value: 'subtle', label: 'Subtle' },
      { value: 'outline', label: 'Outline' },
      { value: 'text', label: 'Text' },
    ],
  },
  {
    kind: 'select',
    key: 'triggerSize',
    label: 'Size',
    row: 0,
    options: [
      { value: 'lg', label: 'Lg' },
      { value: 'md', label: 'Md' },
      { value: 'sm', label: 'Sm' },
      { value: 'xs', label: 'Xs' },
    ],
  },
  { kind: 'text', key: 'triggerLabel', label: '文案', row: 1 },
  { kind: 'boolean', key: 'disabled', label: 'Disable', row: 1 },
  { kind: 'boolean', key: 'showSymbol', label: 'Show Symbol', row: 2 },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: 'Symbol icon',
    row: 2,
    visibleWhen: (s) => Boolean(s.showSymbol),
  },
  { kind: 'boolean', key: 'showTag', label: 'Show Tag', row: 3 },
  {
    kind: 'text',
    key: 'tagText',
    label: 'Tag 文案',
    row: 3,
    visibleWhen: (s) => Boolean(s.showTag),
  },
  {
    kind: 'select',
    key: 'tagStatus',
    label: 'Tag status',
    row: 3,
    options: [...flotationTagStatusOptions],
    visibleWhen: (s) => Boolean(s.showTag),
  },
  { kind: 'boolean', key: 'showMessage', label: 'Show Message', row: 4 },
  {
    kind: 'text',
    key: 'messageText',
    label: 'Message',
    row: 4,
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: 'Message type',
    row: 4,
    options: [...flotationMessageTypeOptions],
    visibleWhen: (s) => Boolean(s.showMessage),
  },
];

/** Menu — 宽/高；自定义宽度时可选对齐；主轴间距等宽=1、自定义=8；等宽时左右各扩 8 */
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
      label: 'placement',
      row: 0,
      options: [
        { value: 'bottom', label: 'bottom' },
        { value: 'top', label: 'top' },
        { value: 'left', label: 'left' },
        { value: 'right', label: 'right' },
      ],
    },
    { kind: 'boolean', key: 'showAdd', label: 'Add 行', row: 0 },
    {
      kind: 'text',
      key: 'addLabel',
      label: 'Add 文案',
      row: 0,
      visibleWhen: (s) => Boolean(s.showAdd),
    },
    {
      kind: 'select',
      key: 'widthMode',
      label: '宽度',
      row: 1,
      options: [
        { value: 'trigger', label: '等于触发器' },
        { value: 'fixed', label: '自定义' },
        { value: 'adaptive', label: '自适应内容' },
      ],
    },
    {
      kind: 'text',
      key: 'width',
      label: 'width (px)',
      row: 1,
      visibleWhen: (s) => String(s.widthMode ?? 'fixed') === 'fixed',
    },
    {
      kind: 'select',
      key: 'align',
      label: '对齐',
      row: 1,
      options: sidePlacement
        ? [
            { value: 'start', label: '上对齐' },
            { value: 'end', label: '下对齐' },
          ]
        : [
            { value: 'start', label: '左对齐' },
            { value: 'end', label: '右对齐' },
          ],
      visibleWhen: () => showCustomAlign,
    },
    {
      kind: 'select',
      key: 'heightMode',
      label: '高度',
      row: 2,
      options: [
        { value: 'adaptive', label: '自适应' },
        { value: 'fixed', label: '固定' },
      ],
    },
    {
      kind: 'text',
      key: 'height',
      label: 'height (px)',
      row: 2,
      visibleWhen: (s) => String(s.heightMode ?? 'adaptive') === 'fixed',
    },
  ];
}

/** @deprecated 使用 buildFlotationMenuPanelControls */
export const flotationMenuPanelControls: DocCustomizeControl[] =
  buildFlotationMenuPanelControls(flotationCustomizeDefaults);

/**
 * Box — 行数 / 编辑行 + 当前行可调项（来自 /components/flotation-box）
 * row0：行选择；row1+：Box 字段
 */
export function buildFlotationBoxPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const count = parseFlotationItemCount(state);
  const editIndex = parseFlotationEditBoxIndex(state);
  const boxTypeKey = flotationBoxItemKey('BoxType', editIndex);
  const showCheckboxKey = flotationBoxItemKey('ShowCheckbox', editIndex);
  const showTagKey = flotationBoxItemKey('ShowTag', editIndex);
  const showMessageKey = flotationBoxItemKey('ShowMessage', editIndex);

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
      key: 'editBoxIndex',
      label: '编辑行',
      options: Array.from({ length: count }, (_, index) => {
        const n = index + 1;
        return { value: String(n), label: `Box ${n}` };
      }),
      row: 0,
    },
    {
      kind: 'select',
      key: boxTypeKey,
      label: 'Type',
      options: flotationBoxTypeOptions,
      row: 1,
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('Label', editIndex),
      label: 'Label',
      row: 1,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('Disabled', editIndex),
      label: 'Disable',
      row: 2,
    },
    {
      kind: 'boolean',
      key: showCheckboxKey,
      label: 'Checkbox',
      row: 3,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('Checked', editIndex),
      label: 'Checked',
      row: 3,
      visibleWhen: (s) => Boolean(s[showCheckboxKey]),
    },
    {
      kind: 'boolean',
      key: showTagKey,
      label: 'Show Tag',
      row: 4,
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('TagText', editIndex),
      label: 'Tag 文案',
      row: 4,
      visibleWhen: (s) => Boolean(s[showTagKey]),
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('TagStatus', editIndex),
      label: 'Tag status',
      options: [...flotationTagStatusOptions],
      row: 4,
      visibleWhen: (s) => Boolean(s[showTagKey]),
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('ShowReddot', editIndex),
      label: 'Reddot',
      row: 5,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('ShowCascader', editIndex),
      label: 'Cascader 箭头',
      row: 5,
    },
    {
      kind: 'boolean',
      key: showMessageKey,
      label: 'Show Message',
      row: 6,
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('MessageText', editIndex),
      label: 'Message',
      row: 6,
      visibleWhen: (s) => Boolean(s[showMessageKey]),
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('MessageType', editIndex),
      label: 'Message type',
      row: 6,
      options: [...flotationMessageTypeOptions],
      visibleWhen: (s) => Boolean(s[showMessageKey]),
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('SymbolIcon', editIndex),
      label: 'Symbol icon',
      row: 7,
      visibleWhen: (s) => String(s[boxTypeKey] ?? 'text') === 'symbol-text',
    },
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
    name: 'placement / disabled / offset',
    type: 'TooltipPlacement / boolean / number',
    defaultValue: "'bottom' / false / 等宽 1 · 自定义 8",
    description:
      '透传 EgAnchoredTooltip。offset 未传时：widthMode=trigger → 1；fixed/adaptive → 8。',
  },
  {
    name: 'triggerLabel / triggerStyle / triggerSize / showSymbol / showTag / showMessage',
    type: '…',
    defaultValue: 'Trigger / subtle / lg / false…',
    description: '无 #trigger 时的 EgFlotationTrigger 预置（见「触发器 Trigger」定制）。',
  },
  {
    name: 'widthMode / width / align / heightMode / height',
    type: 'trigger|fixed|adaptive / number / start|end / …',
    defaultValue: 'fixed / 280 / start / adaptive / 306',
    description:
      'trigger：宽=触发器+16，左右各偏出 8，主轴间距 1。fixed/adaptive：可左/右（或上/下）对齐，主轴间距 8。',
  },
  {
    name: 'items / showAdd',
    type: 'FlotationMenuItemPreset[] / boolean',
    defaultValue: 'Label 1–8 / true',
    description:
      '无 #content 时的 Box 行。Showcase「Box」面板按编辑行配置 Type/Label/Tag 等；点击行关闭菜单并回显 Trigger。',
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

    const boxTypeRaw = String(state?.[flotationBoxItemKey('BoxType', n)] ?? 'text');
    const boxType =
      boxTypeRaw === 'symbol-text' || boxTypeRaw === 'image-text'
        ? boxTypeRaw
        : ('text' as const);

    const tagStatusRaw = String(state?.[flotationBoxItemKey('TagStatus', n)] ?? 'danger');
    const tagStatuses = ['danger', 'warning', 'success', 'ready', 'invalid'] as const;
    const tagStatus = (tagStatuses as readonly string[]).includes(tagStatusRaw)
      ? (tagStatusRaw as (typeof tagStatuses)[number])
      : 'danger';

    return {
      label,
      boxType: boxType as 'text' | 'symbol-text' | 'image-text',
      disabled: Boolean(state?.[flotationBoxItemKey('Disabled', n)]),
      focused: Boolean(state?.[flotationBoxItemKey('Focused', n)]),
      showCheckbox: Boolean(state?.[flotationBoxItemKey('ShowCheckbox', n)]),
      checked: Boolean(state?.[flotationBoxItemKey('Checked', n)]),
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
      symbolIcon: String(state?.[flotationBoxItemKey('SymbolIcon', n)] ?? 'eds-add'),
    };
  });
}

/* ── Trigger 小类 ── */

export const flotationTriggerCustomizeDefaults = {
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

export const flotationTriggerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerStyle',
    label: 'Style',
    options: [
      { value: 'subtle', label: 'Subtle' },
      { value: 'outline', label: 'Outline' },
      { value: 'text', label: 'Text' },
    ],
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: '宽度',
    options: [
      { value: 'trigger', label: '等于触发器' },
      { value: 'adaptive', label: '自适应' },
      { value: 'fixed', label: '固定宽度' },
    ],
  },
  {
    kind: 'text',
    key: 'width',
    label: 'width (px)',
    visibleWhen: (s) => String(s.widthMode ?? 'adaptive') === 'fixed',
  },
  {
    kind: 'select',
    key: 'size',
    label: 'Size',
    options: [
      { value: 'lg', label: 'Lg' },
      { value: 'md', label: 'Md' },
      { value: 'sm', label: 'Sm' },
      { value: 'xs', label: 'Xs' },
    ],
  },
  { kind: 'text', key: 'label', label: '文案' },
  { kind: 'boolean', key: 'disabled', label: 'Disable' },
  { kind: 'boolean', key: 'showSymbol', label: 'Show Symbol' },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: 'Symbol icon',
    visibleWhen: (s) => Boolean(s.showSymbol),
  },
  { kind: 'boolean', key: 'showTag', label: 'Show Tag' },
  {
    kind: 'text',
    key: 'tagText',
    label: 'Tag 文案',
    visibleWhen: (s) => Boolean(s.showTag),
  },
  {
    kind: 'select',
    key: 'tagStatus',
    label: 'Tag status',
    options: [...flotationTagStatusOptions],
    visibleWhen: (s) => Boolean(s.showTag),
  },
  { kind: 'boolean', key: 'showMessage', label: 'Show Message' },
  {
    kind: 'text',
    key: 'messageText',
    label: 'Message',
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: 'Message type',
    options: [...flotationMessageTypeOptions],
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  { kind: 'boolean', key: 'expanded', label: 'Expanded（箭头朝上）' },
];

export function buildFlotationTriggerUsageSnippet(state: Record<string, unknown>): string {
  const widthMode = String(state.widthMode ?? 'adaptive');
  const props: Record<string, unknown> = { ...state };
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
    omitKeys: widthMode === 'fixed' ? [] : ['width'],
  });
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

export const flotationBoxCustomizeDefaults = {
  boxType: 'text',
  label: 'Label',
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

export const flotationBoxCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'boxType',
    label: 'Type',
    options: [
      { value: 'text', label: 'Text' },
      { value: 'symbol-text', label: 'Symbol+Text' },
      { value: 'image-text', label: 'Image+Text+Tag+Message' },
    ],
  },
  { kind: 'text', key: 'label', label: 'Label' },
  { kind: 'boolean', key: 'disabled', label: 'Disable' },
  { kind: 'boolean', key: 'showCheckbox', label: 'Checkbox' },
  {
    kind: 'boolean',
    key: 'checked',
    label: 'Checked',
    visibleWhen: (s) => Boolean(s.showCheckbox),
  },
  { kind: 'boolean', key: 'showTag', label: 'Show Tag' },
  {
    kind: 'text',
    key: 'tagText',
    label: 'Tag 文案',
    visibleWhen: (s) => Boolean(s.showTag),
  },
  {
    kind: 'select',
    key: 'tagStatus',
    label: 'Tag status',
    options: [...flotationTagStatusOptions],
    visibleWhen: (s) => Boolean(s.showTag),
  },
  { kind: 'boolean', key: 'showReddot', label: 'Reddot' },
  { kind: 'boolean', key: 'showCascader', label: 'Cascader 箭头' },
  { kind: 'boolean', key: 'showMessage', label: 'Show Message' },
  {
    kind: 'text',
    key: 'messageText',
    label: 'Message',
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: 'Message type',
    options: [...flotationMessageTypeOptions],
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: 'Symbol icon',
    visibleWhen: (s) => String(s.boxType) === 'symbol-text',
  },
];

export function buildFlotationBoxUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgFlotationMenuItem', state, {
    defaults: { ...flotationBoxCustomizeDefaults },
  });
}

export const flotationBoxPropRows: DocPropRow[] = [
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

export const flotationBoxSlotRows: DocPropRow[] = [
  { name: 'default', type: '—', defaultValue: '—', description: 'Label 文案。' },
  { name: 'checkbox', type: '—', defaultValue: '—', description: '左侧选择控件。' },
  { name: 'leading', type: '—', defaultValue: '—', description: 'Symbol / Image。' },
  { name: 'tag', type: '—', defaultValue: '—', description: '标签。' },
  { name: 'message', type: '—', defaultValue: '—', description: '右侧 Message。' },
  { name: 'trailing', type: '—', defaultValue: '—', description: '整块右侧区（覆盖 reddot/cascader/message）。' },
];
