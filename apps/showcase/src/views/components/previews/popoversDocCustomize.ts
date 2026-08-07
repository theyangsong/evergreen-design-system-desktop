import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueOpeningTag } from '@/views/shared/componentDoc/buildUsageSnippet';
import type { PopoverAlign, PopoverPlacement } from '@eds/desktop-components';
import {
  heightModeRows,
  placementRows,
  showcaseTooltipCustomizeFieldLabels,
  triggerRows,
  widthModeAdaptiveFixedRows,
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
  heightMode: 'adaptive',
  width: '336',
  height: '490',
  maxWidth: '',
  maxHeight: '',
} as const;

const L = showcaseTooltipCustomizeFieldLabels;

function isPopoverWidthFixed(state: Record<string, unknown>): boolean {
  return String(state.widthMode ?? popoversCustomizeDefaults.widthMode) === 'fixed';
}

function isPopoverHeightFixed(state: Record<string, unknown>): boolean {
  return String(state.heightMode ?? popoversCustomizeDefaults.heightMode) === 'fixed';
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
    options: widthModeAdaptiveFixedRows.map((row) => ({ value: row.key, label: row.label })),
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
    visibleWhen: (state) => !isPopoverWidthFixed(state),
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
    key: 'disabled',
    label: L.disabled,
  },
  {
    kind: 'text',
    key: 'triggerLabel',
    label: L.triggerLabel,
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

function buildPopoverProps(state: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    widthMode: state.widthMode,
    heightMode: state.heightMode,
  };

  const width = parseOptionalPx(state.width);
  const height = parseOptionalPx(state.height);
  const maxWidth = parseOptionalPx(state.maxWidth);
  const maxHeight = parseOptionalPx(state.maxHeight);

  if (isPopoverWidthFixed(state) && width != null) {
    props.width = width;
  }
  if (!isPopoverWidthFixed(state) && maxWidth != null) {
    props.maxWidth = maxWidth;
  }
  if (isPopoverHeightFixed(state) && height != null) {
    props.height = height;
  }
  if (!isPopoverHeightFixed(state) && maxHeight != null) {
    props.maxHeight = maxHeight;
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
      <div style="padding: var(--spacing-1)">
        <!-- 插槽内容：与 Popover 面板同容器，adaptive 时随内容撑开 -->
      </div>
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
    description: '面板宽度模式：fixed 使用 width（默认 336）；adaptive 随 slot 内容（受 maxWidth 约束）。',
  },
  {
    name: 'width',
    type: 'number',
    defaultValue: '336',
    description: 'widthMode=fixed 时面板区宽度（px，不含箭头）。',
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
    description: '弹出层内容；渲染在 `.eds-popover-content` 插槽框内（与 shell 同层），padding/布局由 slot 根节点自定。',
  },
];

export const POPOVER_PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const satisfies readonly PopoverPlacement[];

export const POPOVER_ALIGNS = ['start', 'center', 'end'] as const satisfies readonly PopoverAlign[];

export { buildPopoverProps, isPopoverHeightFixed, isPopoverWidthFixed };
