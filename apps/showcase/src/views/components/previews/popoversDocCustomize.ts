import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueOpeningTag } from '@/views/shared/componentDoc/buildUsageSnippet';
import type { PopoverAlign, PopoverPlacement } from '@eds/desktop-components';
import {
  heightModeRows,
  placementRows,
  showcaseTooltipCustomizeFieldLabels,
  triggerRows,
} from '@/data/showcasePropLabels';

export const popoversImportCode = `import {
  EgAnchoredPopover,
  EgAnchoredTooltip,
  EgButton,
  EgPopover,
} from '@eds/desktop-components';`;

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

export const popoversCustomizeDefaults = {
  placement: 'bottom',
  align: 'center',
  trigger: 'hover',
  disabled: false,
  triggerLabel: '悬浮我',
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
} as const;

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

export const popoversCustomizeControls: DocCustomizeControl[] = [
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
    visibleWhen: isPopoverPlacementTop,
  },
  {
    kind: 'text',
    key: 'topToolTitle',
    label: '标题',
    visibleWhen: isPopoverTopToolEnabled,
  },
  {
    kind: 'boolean',
    key: 'topToolClosable',
    label: '可关闭',
    visibleWhen: isPopoverTopToolEnabled,
  },
];

const CUSTOMIZE_ONLY_KEYS = new Set(['triggerLabel']);

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
    props.topTool = Boolean(state.topTool);
    if (props.topTool) {
      props.topToolTitle = String(state.topToolTitle ?? popoversCustomizeDefaults.topToolTitle);
      props.topToolClosable = Boolean(state.topToolClosable);
    }
  }

  return props;
}

export function buildPopoversUsageSnippet(state: Record<string, unknown>): string {
  const anchoredProps: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    trigger: state.trigger,
    disabled: state.disabled,
    'wrap-tooltip': false,
  };

  const openTag = buildVueOpeningTag('EgAnchoredTooltip', anchoredProps, {
    defaults: {
      placement: popoversCustomizeDefaults.placement,
      align: popoversCustomizeDefaults.align,
      trigger: popoversCustomizeDefaults.trigger,
      disabled: popoversCustomizeDefaults.disabled,
    },
    omitKeys: [...CUSTOMIZE_ONLY_KEYS],
  }).replace(/>$/, '\n  :wrap-tooltip="false">');

  const popoverOpen = buildVueOpeningTag('EgPopover', buildPopoverProps(state), {
    defaults: {
      placement: popoversCustomizeDefaults.placement,
      align: popoversCustomizeDefaults.align,
      widthMode: popoversCustomizeDefaults.widthMode,
      heightMode: popoversCustomizeDefaults.heightMode,
      width: Number.parseInt(popoversCustomizeDefaults.width, 10),
      height: Number.parseInt(popoversCustomizeDefaults.height, 10),
    },
  });

  const label = String(state.triggerLabel ?? popoversCustomizeDefaults.triggerLabel);

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

export { buildPopoverProps, isPopoverHeightFixed, isPopoverWidthFixed, isPopoverWidthPreset };
