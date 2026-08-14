import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueOpeningTag } from '@/views/shared/componentDoc/buildUsageSnippet';
import type { PopoverAlign, PopoverPlacement } from '@eds/desktop-components';
import {
  heightModeRows,
  placementRows,
  showcaseTooltipCustomizeFieldLabels,
  triggerRows,
} from '@/data/showcasePropLabels';

export const popoverComponentImportCode = `import {
  EgAnchoredPopover,
  EgAnchoredTooltip,
  EgButton,
  EgPopover,
} from '@eds/desktop-components';`;

export const popoverScensImportCode = `import {
  EgAnchoredTooltip,
  EgButton,
  EgMinerFeeBitcoinPanel,
  EgMinerFeeEthereumPanel,
  EgMinerFeeTonPanel,
  EgMinerFeeTronPanel,
  EgPopover,
  EgRemarkPopover,
} from '@eds/desktop-components';`;

export const popoverMinerFeeNetworkOptions = [
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'ethereum', label: 'Ethereum Mainnet' },
  { value: 'ton', label: 'The Open Network' },
  { value: 'tron', label: 'Tron' },
] as const;

export type PopoverMinerFeeNetwork = (typeof popoverMinerFeeNetworkOptions)[number]['value'];

const MINER_FEE_PANEL_TAG_BY_NETWORK: Record<PopoverMinerFeeNetwork, string> = {
  bitcoin: 'EgMinerFeeBitcoinPanel',
  ethereum: 'EgMinerFeeEthereumPanel',
  ton: 'EgMinerFeeTonPanel',
  tron: 'EgMinerFeeTronPanel',
};

export function resolveMinerFeePanelTag(network: unknown): string {
  const key = String(network ?? popoverComponentCustomizeDefaults.minerFeeNetwork);
  return (
    MINER_FEE_PANEL_TAG_BY_NETWORK[key as PopoverMinerFeeNetwork]
    ?? MINER_FEE_PANEL_TAG_BY_NETWORK.ethereum
  );
}

export const popoverPlacementOptions = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
] as const;

export const popoverAlignOptions = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
] as const;

export const popoverScensScenarioOptions = [
  { value: 'guide', label: '引导' },
  { value: 'remark', label: '备注' },
  { value: 'miner-fee', label: '矿工费' },
] as const;

export type PopoverScensScenario = (typeof popoverScensScenarioOptions)[number]['value'];

export type PopoverScenario = 'component' | PopoverScensScenario;

export const popoverComponentCustomizeDefaults = {
  scenario: 'component',
  placement: 'top',
  align: 'center',
  trigger: 'hover',
  disabled: false,
  triggerLabel: '悬浮我',
  slotContent: 'Popover 内容',
  guideBody: '引导说明文案',
  guideActionLabel: '知道了',
  widthMode: 'fixed',
  presetWidth: '336',
  heightMode: 'adaptive',
  width: '336',
  height: '490',
  maxWidth: '',
  maxHeight: '',
  topTool: true,
  topToolTitle: 'Title',
  topToolClosable: true,
  remarkPlaceholder: 'Please enter',
  remarkFeedback: 'Optional, Max. 256 characters',
  remarkConfirmLabel: 'Confirm',
  minerFeeNetwork: 'ethereum',
} as const;

export const popoverScensCustomizeDefaults = {
  ...popoverComponentCustomizeDefaults,
  scenario: 'guide',
} as const;

/** @deprecated Use popoverComponentCustomizeDefaults or popoverScensCustomizeDefaults */
export const popoversCustomizeDefaults = popoverComponentCustomizeDefaults;

export const popoverWidthModeOptions = [
  { value: 'adaptive', label: '自适应 adaptive' },
  { value: 'fixed', label: '固定 fixed' },
  { value: 'preset', label: '预置宽度 preset' },
] as const;

export const popoverPresetWidthOptions = [
  { value: '256', label: '256（引导）' },
  { value: '336', label: '336（基础业务）' },
  { value: '460', label: '460（复杂业务）' },
] as const;

const L = showcaseTooltipCustomizeFieldLabels;

function isPopoverWidthPreset(state: Record<string, unknown>): boolean {
  return String(state.widthMode ?? popoversCustomizeDefaults.widthMode) === 'preset';
}

function isPopoverWidthFixed(state: Record<string, unknown>): boolean {
  return String(state.widthMode ?? popoversCustomizeDefaults.widthMode) === 'fixed';
}

function isPopoverWidthFixedOrPreset(state: Record<string, unknown>): boolean {
  return isPopoverWidthFixed(state) || isPopoverWidthPreset(state);
}

function isPopoverHeightFixed(state: Record<string, unknown>): boolean {
  return String(state.heightMode ?? popoversCustomizeDefaults.heightMode) === 'fixed';
}

function isPopoverPlacementTop(state: Record<string, unknown>): boolean {
  return String(state.placement ?? popoversCustomizeDefaults.placement) === 'top';
}

function isPopoverTopToolEnabled(state: Record<string, unknown>): boolean {
  return isPopoverPlacementTop(state) && Boolean(state.topTool);
}

function isPopoverGuideScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? popoversCustomizeDefaults.scenario) === 'guide';
}

function isPopoverRemarkScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? popoversCustomizeDefaults.scenario) === 'remark';
}

function isPopoverMinerFeeScenario(state: Record<string, unknown>): boolean {
  return String(state.scenario ?? popoversCustomizeDefaults.scenario) === 'miner-fee';
}

function isPopoverComponentScenario(state: Record<string, unknown>): boolean {
  const scenario = String(state.scenario ?? popoversCustomizeDefaults.scenario);
  return scenario !== 'guide' && scenario !== 'remark' && scenario !== 'miner-fee';
}

const POPOVER_SCENARIO_PRESETS: Record<
  PopoverScenario,
  Partial<typeof popoversCustomizeDefaults>
> = {
  component: {
    placement: 'top',
    align: 'center',
    trigger: 'hover',
    widthMode: 'fixed',
    width: '336',
    presetWidth: '336',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Title',
    topToolClosable: true,
    triggerLabel: '悬浮我',
    slotContent: 'Popover 内容',
  },
  guide: {
    placement: 'top',
    align: 'center',
    trigger: 'hover',
    widthMode: 'preset',
    presetWidth: '256',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Title',
    topToolClosable: false,
    triggerLabel: '悬浮我',
    guideBody: '引导说明文案',
    guideActionLabel: '知道了',
  },
  remark: {
    placement: 'top',
    align: 'center',
    trigger: 'click',
    widthMode: 'fixed',
    width: '336',
    presetWidth: '336',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Remark',
    topToolClosable: true,
    triggerLabel: '备注',
    remarkPlaceholder: 'Please enter',
    remarkFeedback: 'Optional, Max. 256 characters',
    remarkConfirmLabel: 'Confirm',
  },
  'miner-fee': {
    placement: 'top',
    align: 'center',
    trigger: 'click',
    widthMode: 'fixed',
    width: '336',
    presetWidth: '336',
    heightMode: 'adaptive',
    topTool: true,
    topToolTitle: 'Gas fee',
    topToolClosable: true,
    triggerLabel: '矿工费',
    minerFeeNetwork: 'ethereum',
  },
};

export function applyPopoverScenarioPreset(
  target: Record<string, unknown>,
  scenario: PopoverScenario,
): void {
  Object.assign(target, POPOVER_SCENARIO_PRESETS[scenario]);
}

function isPopoverTopToolClosableVisible(state: Record<string, unknown>): boolean {
  return (
    isPopoverTopToolEnabled(state)
    || isPopoverRemarkScenario(state)
    || isPopoverMinerFeeScenario(state)
    || (isPopoverComponentScenario(state) && isPopoverPlacementTop(state))
  );
}

const popoverLayoutCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'placement',
    label: L.placement,
    options: placementRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'align',
    label: '对齐',
    options: popoverAlignOptions.map((row) => ({ value: row.value, label: row.label })),
  },
  {
    kind: 'select',
    key: 'trigger',
    label: L.trigger,
    options: triggerRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'boolean',
    key: 'topToolClosable',
    label: '显示关闭',
    visibleWhen: isPopoverTopToolClosableVisible,
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: L.widthMode,
    options: popoverWidthModeOptions.map((row) => ({ value: row.value, label: row.label })),
  },
  {
    kind: 'select',
    key: 'presetWidth',
    label: '预置宽度',
    options: popoverPresetWidthOptions.map((row) => ({ value: row.value, label: row.label })),
    visibleWhen: isPopoverWidthPreset,
  },
  {
    kind: 'text',
    key: 'width',
    label: L.width,
    visibleWhen: isPopoverWidthFixed,
  },
  {
    kind: 'text',
    key: 'maxWidth',
    label: '最大宽度',
    visibleWhen: (state) => !isPopoverWidthFixedOrPreset(state),
  },
  {
    kind: 'select',
    key: 'heightMode',
    label: L.heightMode,
    options: heightModeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'text',
    key: 'height',
    label: L.height,
    visibleWhen: isPopoverHeightFixed,
  },
  {
    kind: 'text',
    key: 'maxHeight',
    label: L.maxHeight,
    visibleWhen: (state) => !isPopoverHeightFixed(state),
  },
  {
    kind: 'boolean',
    key: 'topTool',
    label: 'TopTool',
    visibleWhen: (state) => isPopoverPlacementTop(state) && isPopoverComponentScenario(state),
  },
];

export const popoverComponentCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'text',
    key: 'triggerLabel',
    label: L.triggerLabel,
  },
  {
    kind: 'text',
    key: 'slotContent',
    label: '插槽内容',
  },
  {
    kind: 'text',
    key: 'topToolTitle',
    label: '标题',
    visibleWhen: isPopoverTopToolEnabled,
  },
  ...popoverLayoutCustomizeControls,
];

export const popoverScensCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'scenario',
    label: '场景',
    options: popoverScensScenarioOptions.map((row) => ({ value: row.value, label: row.label })),
  },
  {
    kind: 'text',
    key: 'triggerLabel',
    label: L.triggerLabel,
  },
  {
    kind: 'text',
    key: 'guideBody',
    label: '引导正文',
    visibleWhen: isPopoverGuideScenario,
  },
  {
    kind: 'text',
    key: 'guideActionLabel',
    label: '按钮文案',
    visibleWhen: isPopoverGuideScenario,
  },
  {
    kind: 'text',
    key: 'remarkPlaceholder',
    label: '占位符',
    visibleWhen: isPopoverRemarkScenario,
  },
  {
    kind: 'text',
    key: 'remarkFeedback',
    label: '辅助说明',
    visibleWhen: isPopoverRemarkScenario,
  },
  {
    kind: 'text',
    key: 'remarkConfirmLabel',
    label: '确认按钮',
    visibleWhen: isPopoverRemarkScenario,
  },
  {
    kind: 'select',
    key: 'minerFeeNetwork',
    label: '矿工费网络',
    options: popoverMinerFeeNetworkOptions.map((row) => ({ value: row.value, label: row.label })),
    visibleWhen: isPopoverMinerFeeScenario,
  },
  {
    kind: 'text',
    key: 'topToolTitle',
    label: '标题',
    visibleWhen: (state) =>
      isPopoverTopToolEnabled(state)
      || isPopoverRemarkScenario(state)
      || isPopoverMinerFeeScenario(state),
  },
  ...popoverLayoutCustomizeControls,
];

/** @deprecated Use popoverComponentCustomizeControls or popoverScensCustomizeControls */
export const popoversCustomizeControls = popoverComponentCustomizeControls;

const CUSTOMIZE_ONLY_KEYS = new Set([
  'triggerLabel',
  'scenario',
  'slotContent',
  'guideBody',
  'guideActionLabel',
  'remarkPlaceholder',
  'remarkFeedback',
  'remarkConfirmLabel',
  'minerFeeNetwork',
]);

function parseOptionalPx(value: unknown): number | undefined {
  if (value == null || value === '') {
    return undefined;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolvePopoverWidthPx(state: Record<string, unknown>): number | undefined {
  if (isPopoverWidthPreset(state)) {
    return parseOptionalPx(state.presetWidth ?? popoversCustomizeDefaults.presetWidth);
  }
  if (isPopoverWidthFixed(state)) {
    return parseOptionalPx(state.width);
  }
  return undefined;
}

function buildPopoverProps(state: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    widthMode: isPopoverWidthFixedOrPreset(state) ? 'fixed' : state.widthMode,
    heightMode: state.heightMode,
  };

  const width = resolvePopoverWidthPx(state);
  const height = parseOptionalPx(state.height);
  const maxWidth = parseOptionalPx(state.maxWidth);
  const maxHeight = parseOptionalPx(state.maxHeight);

  if (isPopoverWidthFixedOrPreset(state) && width != null) {
    props.width = width;
  }
  if (!isPopoverWidthFixedOrPreset(state) && maxWidth != null) {
    props.maxWidth = maxWidth;
  }
  if (isPopoverHeightFixed(state) && height != null) {
    props.height = height;
  }
  if (!isPopoverHeightFixed(state) && maxHeight != null) {
    props.maxHeight = maxHeight;
  }

  if (String(state.placement) === 'top') {
    const isGuide = String(state.scenario ?? popoversCustomizeDefaults.scenario) === 'guide';
    props.topTool = isGuide ? true : Boolean(state.topTool);
    if (props.topTool) {
      props.topToolTitle = String(state.topToolTitle ?? popoversCustomizeDefaults.topToolTitle);
      props.topToolClosable = Boolean(state.topToolClosable);
    }
  }

  return props;
}

export function buildRemarkPopoverProps(state: Record<string, unknown>): Record<string, unknown> {
  const popoverProps = buildPopoverProps(state);

  const props: Record<string, unknown> = {
    placement: popoverProps.placement,
    align: popoverProps.align,
    widthMode: popoverProps.widthMode,
    heightMode: popoverProps.heightMode,
    topToolClosable: Boolean(state.topToolClosable),
  };

  if (popoverProps.width != null) {
    props.width = popoverProps.width;
  }
  if (popoverProps.maxWidth != null) {
    props.maxWidth = popoverProps.maxWidth;
  }
  if (popoverProps.height != null) {
    props.height = popoverProps.height;
  }
  if (popoverProps.maxHeight != null) {
    props.maxHeight = popoverProps.maxHeight;
  }

  return props;
}

function buildAnchoredPopoverScensSnippet(
  state: Record<string, unknown>,
  slotInner: string,
): string {
  const anchoredProps: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    trigger: state.trigger,
    disabled: state.disabled,
    'wrap-tooltip': false,
  };

  const openTag = buildVueOpeningTag('EgAnchoredTooltip', anchoredProps, {
    defaults: {
      placement: popoverComponentCustomizeDefaults.placement,
      align: popoverComponentCustomizeDefaults.align,
      trigger: popoverComponentCustomizeDefaults.trigger,
      disabled: popoverComponentCustomizeDefaults.disabled,
    },
    omitKeys: [...CUSTOMIZE_ONLY_KEYS],
  }).replace(/>$/, '\n  :wrap-tooltip="false">');

  const popoverOpen = buildVueOpeningTag('EgPopover', buildPopoverProps(state), {
    defaults: {
      placement: popoverComponentCustomizeDefaults.placement,
      align: popoverComponentCustomizeDefaults.align,
      widthMode: popoverComponentCustomizeDefaults.widthMode,
      heightMode: popoverComponentCustomizeDefaults.heightMode,
      width: Number.parseInt(popoverComponentCustomizeDefaults.width, 10),
      height: Number.parseInt(popoverComponentCustomizeDefaults.height, 10),
    },
  });

  const label = String(state.triggerLabel ?? popoverComponentCustomizeDefaults.triggerLabel);

  return `${openTag}
  <EgButton variant="outline">${label}</EgButton>
  <template #content>
    ${popoverOpen}
      ${slotInner}
    </EgPopover>
  </template>
</EgAnchoredTooltip>`;
}

export function buildPopoverScensUsageSnippet(state: Record<string, unknown>): string {
  if (isPopoverRemarkScenario(state)) {
    const label = String(state.triggerLabel ?? popoverComponentCustomizeDefaults.triggerLabel);
    const remarkOpen = buildVueOpeningTag(
      'EgRemarkPopover',
      {
        ...buildRemarkPopoverProps(state),
        title: String(state.topToolTitle ?? 'Remark'),
        placeholder: String(
          state.remarkPlaceholder ?? popoverComponentCustomizeDefaults.remarkPlaceholder,
        ),
        'feedback-text': String(
          state.remarkFeedback ?? popoverComponentCustomizeDefaults.remarkFeedback,
        ),
        'confirm-label': String(
          state.remarkConfirmLabel ?? popoverComponentCustomizeDefaults.remarkConfirmLabel,
        ),
      },
      {
        defaults: {
          placement: popoverComponentCustomizeDefaults.placement,
          align: popoverComponentCustomizeDefaults.align,
          widthMode: popoverComponentCustomizeDefaults.widthMode,
          width: Number.parseInt(popoverComponentCustomizeDefaults.width, 10),
          topToolClosable: popoverComponentCustomizeDefaults.topToolClosable,
        },
      },
    ).replace(/>$/, '\n  v-model="remark"\n  @confirm="onRemarkConfirm">');

    return `${remarkOpen}
  <template #trigger="{ active, onClick }">
    <EgButton variant="outline" :class="{ 'is-active': active }" @click="onClick">
      ${label}
    </EgButton>
  </template>
</EgRemarkPopover>`;
  }

  if (isPopoverMinerFeeScenario(state)) {
    const panelTag = resolveMinerFeePanelTag(state.minerFeeNetwork);
    return buildAnchoredPopoverScensSnippet(
      state,
      `<${panelTag}\n  :translate="ui"\n  @confirm="onMinerFeeConfirm"\n/>`,
    );
  }

  return buildAnchoredPopoverScensSnippet(
    state,
    `<!-- 引导场景：match-primary 填充 + TopTool -->
      <div><!-- … --></div>`,
  );
}

export function buildPopoverComponentUsageSnippet(state: Record<string, unknown>): string {
  const anchoredProps: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    trigger: state.trigger,
    disabled: state.disabled,
    'wrap-tooltip': false,
  };

  const openTag = buildVueOpeningTag('EgAnchoredTooltip', anchoredProps, {
    defaults: {
      placement: popoverComponentCustomizeDefaults.placement,
      align: popoverComponentCustomizeDefaults.align,
      trigger: popoverComponentCustomizeDefaults.trigger,
      disabled: popoverComponentCustomizeDefaults.disabled,
    },
    omitKeys: [...CUSTOMIZE_ONLY_KEYS],
  }).replace(/>$/, '\n  :wrap-tooltip="false">');

  const popoverOpen = buildVueOpeningTag('EgPopover', buildPopoverProps(state), {
    defaults: {
      placement: popoverComponentCustomizeDefaults.placement,
      align: popoverComponentCustomizeDefaults.align,
      widthMode: popoverComponentCustomizeDefaults.widthMode,
      heightMode: popoverComponentCustomizeDefaults.heightMode,
      width: Number.parseInt(popoverComponentCustomizeDefaults.width, 10),
      height: Number.parseInt(popoverComponentCustomizeDefaults.height, 10),
    },
  });

  const label = String(state.triggerLabel ?? popoverComponentCustomizeDefaults.triggerLabel);

  return `${openTag}
  <EgButton variant="outline">${label}</EgButton>
  <template #content>
    ${popoverOpen}
      <!-- 插槽内容：bottom/left/right 默认四周 spacing-4；top 默认上 0、左右/下 spacing-4 -->
      <div><!-- … --></div>
    </EgPopover>
  </template>
</EgAnchoredTooltip>`;
}

/** @deprecated Use buildPopoverComponentUsageSnippet or buildPopoverScensUsageSnippet */
export function buildPopoversUsageSnippet(state: Record<string, unknown>): string {
  if (isPopoverRemarkScenario(state) || isPopoverGuideScenario(state)) {
    return buildPopoverScensUsageSnippet(state);
  }
  return buildPopoverComponentUsageSnippet(state);
}

export const popoverPropRows: DocPropRow[] = [
  {
    name: 'placement',
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'bottom'",
    description: '相对锚点的弹出方向；箭头落在朝向锚点的一侧。',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    defaultValue: "'center'",
    description: '交叉轴对齐：top/bottom 控制水平位置；left/right 控制垂直位置。',
  },
  {
    name: 'widthMode',
    type: "'fixed' | 'adaptive'",
    defaultValue: "'fixed'",
    description:
      '面板宽度模式：fixed 使用 width（默认 336）；adaptive 随 slot 内容（受 maxWidth 约束）。Showcase 另有 preset（256/336/460 预置宽，映射为 fixed + width）。',
  },
  {
    name: 'width',
    type: 'number',
    defaultValue: '336',
    description: 'widthMode=fixed 时面板区宽度（px，不含箭头）。预置宽见 Showcase presetWidth。',
  },
  {
    name: 'maxWidth',
    type: 'number',
    defaultValue: '-',
    description: 'widthMode=adaptive 时面板区最大宽度（px）。',
  },
  {
    name: 'heightMode',
    type: "'fixed' | 'adaptive'",
    defaultValue: "'adaptive'",
    description: '面板高度模式：fixed 使用 height；adaptive 随 slot 内容（受 maxHeight 约束）。',
  },
  {
    name: 'height',
    type: 'number',
    defaultValue: '490',
    description: 'heightMode=fixed 时面板区高度（px，不含箭头）。',
  },
  {
    name: 'maxHeight',
    type: 'number',
    defaultValue: '-',
    description: 'heightMode=adaptive 时面板区最大高度（px）。',
  },
  {
    name: 'topTool',
    type: 'boolean',
    defaultValue: 'false',
    description: 'placement=top 时顶部工具条（标题 + 可选关闭）。',
  },
  {
    name: 'topToolTitle',
    type: 'string',
    defaultValue: "'Title'",
    description: 'topTool 标题文案。',
  },
  {
    name: 'topToolClosable',
    type: 'boolean',
    defaultValue: 'true',
    description: 'topTool 显示关闭按钮；点击 emit topToolClose。',
  },
  {
    name: 'contentPaddingTop',
    type: 'number',
    defaultValue: 'placement 默认',
    description: '插槽区内边距上（px）。未传：placement=top 为 0；bottom/left/right 为 spacing-4。',
  },
  {
    name: 'contentPaddingInline',
    type: 'number',
    defaultValue: 'spacing-4',
    description: '插槽区内边距左右（px）；未传时使用 spacing-4。',
  },
  {
    name: 'contentPaddingBottom',
    type: 'number',
    defaultValue: 'spacing-4',
    description: '插槽区内边距下（px）；未传时使用 spacing-4。',
  },
  {
    name: 'microFloat',
    type: 'boolean',
    defaultValue: 'true',
    description: '启用微浮动进出场（semantic `.motion-flotation` + spring）。',
  },
];

export const popoverSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: '-',
    description:
      '弹出层内容；默认内边距：placement=top 为上 0 / 左右下 spacing-4；bottom/left/right 为四周 spacing-4。可用 contentPadding* props 覆盖。',
  },
];

export const POPOVER_PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const satisfies readonly PopoverPlacement[];

export const POPOVER_ALIGNS = ['start', 'center', 'end'] as const satisfies readonly PopoverAlign[];

export { buildPopoverProps, isPopoverHeightFixed, isPopoverRemarkScenario, isPopoverWidthFixed, isPopoverWidthPreset };
