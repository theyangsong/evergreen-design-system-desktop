import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { buildVueOpeningTag } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  placementRows,
  showcaseTooltipCustomizeFieldLabels,
  showcaseTooltipPanelKindLabels,
  showcaseTooltipPanelRadiusLabels,
  triggerRows,
  widthModeAdaptiveFixedRows,
} from '@/data/showcasePropLabels';

export const tooltipPanelRadiusOptions = [
  { value: '', label: showcaseTooltipPanelRadiusLabels[''] },
  { value: 'radius-0', label: showcaseTooltipPanelRadiusLabels['radius-0'] },
  { value: 'radius-xs', label: showcaseTooltipPanelRadiusLabels['radius-xs'] },
  { value: 'radius-sm', label: showcaseTooltipPanelRadiusLabels['radius-sm'] },
  { value: 'radius-md', label: showcaseTooltipPanelRadiusLabels['radius-md'] },
  { value: 'radius-lg', label: showcaseTooltipPanelRadiusLabels['radius-lg'] },
  { value: 'radius-full', label: showcaseTooltipPanelRadiusLabels['radius-full'] },
] as const;

export const tooltipImportCode = `import {
  EgAnchoredTooltip,
  EgButton,
} from '@eds/desktop-components';`;

export const tooltipPanelKindOptions = [
  { value: 'container', label: showcaseTooltipPanelKindLabels.container },
  { value: 'flotation', label: showcaseTooltipPanelKindLabels.flotation },
  { value: 'popup', label: showcaseTooltipPanelKindLabels.popup },
  { value: 'subtle', label: showcaseTooltipPanelKindLabels.subtle },
  { value: 'molde', label: showcaseTooltipPanelKindLabels.molde },
] as const;

export type TooltipPanelKindValue = (typeof tooltipPanelKindOptions)[number]['value'];

export const tooltipPanelKindSections = [
  { id: 'tooltip-container', label: 'Container Box', panelKind: 'container' },
  { id: 'tooltip-flotation', label: 'Flotation Box', panelKind: 'flotation' },
  { id: 'tooltip-popup', label: 'Popup Box', panelKind: 'popup' },
  { id: 'tooltip-subtle', label: 'Subtle Card', panelKind: 'subtle' },
  { id: 'tooltip-molde', label: 'Molde Level', panelKind: 'molde' },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  panelKind: TooltipPanelKindValue;
}>;

export type TooltipPanelKindSection = (typeof tooltipPanelKindSections)[number];

export const tooltipPanelKindDefaultRadiusLabel: Record<TooltipPanelKindValue, string> = {
  container: 'radius-md',
  flotation: 'radius-md',
  popup: 'radius-lg',
  subtle: 'radius-md',
  molde: '—',
};

export const tooltipCustomizeDefaults = {
  panelKind: 'flotation',
  panelRadius: '',
  widthMode: 'fixed',
  width: '328',
  height: '380',
  maxHeight: '',
  placement: 'bottom',
  trigger: 'click',
  disabled: false,
  triggerLabel: '点击我',
} as const;

const isFixedWidth = (state: Record<string, unknown>) =>
  String(state.widthMode ?? 'fixed') === 'fixed';

const L = showcaseTooltipCustomizeFieldLabels;

export const tooltipCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'panelRadius',
    label: L.panelRadius,
    options: tooltipPanelRadiusOptions.map(({ value, label }) => ({ value, label })),
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
    visibleWhen: isFixedWidth,
  },
  { kind: 'text', key: 'height', label: L.height },
  { kind: 'text', key: 'maxHeight', label: L.maxHeight, placeholder: '可选' },
  {
    kind: 'select',
    key: 'placement',
    label: L.placement,
    options: placementRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'trigger',
    label: L.trigger,
    options: triggerRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'boolean', key: 'disabled', label: L.disabled },
  { kind: 'text', key: 'triggerLabel', label: L.triggerLabel },
];

const CUSTOMIZE_ONLY_KEYS = new Set(['triggerLabel']);

function buildAnchoredTooltipUsageSnippet(
  state: Record<string, unknown>,
  panelKind: TooltipPanelKindValue,
): string {
  const anchoredProps: Record<string, unknown> = {
    ...panelPropsFromState({ ...state, panelKind }),
    placement: state.placement,
    trigger: state.trigger,
    disabled: state.disabled,
  };

  const openTag = buildVueOpeningTag('EgAnchoredTooltip', anchoredProps, {
    defaults: {
      placement: tooltipCustomizeDefaults.placement,
      trigger: tooltipCustomizeDefaults.trigger,
      panelKind,
      widthMode: tooltipCustomizeDefaults.widthMode,
      height: Number.parseInt(tooltipCustomizeDefaults.height, 10),
      disabled: tooltipCustomizeDefaults.disabled,
    },
    omitKeys: [...CUSTOMIZE_ONLY_KEYS],
  });

  const label = String(state.triggerLabel ?? tooltipCustomizeDefaults.triggerLabel);
  return `${openTag}
  <EgButton variant="outline">${label}</EgButton>
  <template #content />
</EgAnchoredTooltip>`;
}

export function buildTooltipPanelSectionUsageSnippet(
  panelKind: TooltipPanelKindValue,
  state: Record<string, unknown>,
): string {
  return buildAnchoredTooltipUsageSnippet(state, panelKind);
}

function panelPropsFromState(state: Record<string, unknown>): Record<string, unknown> {
  const panelKind = String(state.panelKind ?? tooltipCustomizeDefaults.panelKind);
  const props: Record<string, unknown> = {
    panelKind: state.panelKind,
    widthMode: state.widthMode,
  };

  if (panelKind !== 'container') {
    props.heightMode = 'fixed';
    props.height = Number.parseInt(String(state.height ?? ''), 10) || 380;
  }

  if (isFixedWidth(state)) {
    const width = Number.parseInt(String(state.width ?? ''), 10);
    if (Number.isFinite(width)) props.width = width;
  }

  const maxHeightRaw = String(state.maxHeight ?? '').trim();
  if (maxHeightRaw !== '') {
    const maxHeight = Number.parseInt(maxHeightRaw, 10);
    if (Number.isFinite(maxHeight)) props.maxHeight = maxHeight;
  }

  const panelRadius = String(state.panelRadius ?? '').trim();
  if (panelRadius !== '') {
    props.panelRadius = panelRadius;
  }

  return props;
}

export function buildTooltipSectionCustomizeDefaults(
  panelKind: TooltipPanelKindValue,
): Record<string, unknown> {
  return {
    panelKind,
    panelRadius: tooltipCustomizeDefaults.panelRadius,
    widthMode: tooltipCustomizeDefaults.widthMode,
    width: tooltipCustomizeDefaults.width,
    height: tooltipCustomizeDefaults.height,
    maxHeight: tooltipCustomizeDefaults.maxHeight,
    placement: tooltipCustomizeDefaults.placement,
    trigger: tooltipCustomizeDefaults.trigger,
    disabled: tooltipCustomizeDefaults.disabled,
    triggerLabel: tooltipCustomizeDefaults.triggerLabel,
  };
}

export function buildTooltipUsageSnippet(state: Record<string, unknown>): string {
  const panelKind = String(state.panelKind ?? tooltipCustomizeDefaults.panelKind) as TooltipPanelKindValue;
  return buildAnchoredTooltipUsageSnippet(state, panelKind);
}

export function buildTooltipPanelKindPageUsageSnippet(
  panelKind: TooltipPanelKindValue,
  state: Record<string, unknown>,
): string {
  return buildAnchoredTooltipUsageSnippet({ ...state, panelKind }, panelKind);
}

export function findTooltipPanelKindSection(pageSlug: string): TooltipPanelKindSection | undefined {
  return tooltipPanelKindSections.find((section) => section.id === pageSlug);
}

export const tooltipPropRows: DocPropRow[] = [
  {
    name: 'panelKind',
    type: "'container' | 'flotation' | 'popup' | 'subtle' | 'molde'",
    defaultValue: "'flotation'",
    description:
      'container → effect-container-box；flotation → effect-flotation-box；popup → effect-popup-box；subtle → effect-subtle-card；molde → effect-molde-level。',
  },
  {
    name: 'panelRadius',
    type: "'radius-0' | 'radius-xs' | 'radius-sm' | 'radius-md' | 'radius-lg' | 'radius-full'",
    defaultValue: '按 panelKind（container/flotation/subtle → radius-md；popup → radius-lg；molde → 无）',
    description:
      '面板圆角，仅允许 Scale Radius token（--radius-*）。未传时使用各 panelKind 在 effect semantic 中的默认圆角。',
  },
  {
    name: 'widthMode',
    type: "'adaptive' | 'fixed'",
    defaultValue: "'adaptive'",
    description: 'adaptive：宽度随内容；fixed：使用 width。',
  },
  {
    name: 'width',
    type: 'number',
    defaultValue: '—',
    description: 'fixed 模式下固定宽度（px）。',
  },
  {
    name: 'maxWidth',
    type: 'number',
    defaultValue: '—',
    description: '可选最大宽度（px）。',
  },
  {
    name: 'heightMode',
    type: "'adaptive' | 'fixed'",
    defaultValue: "'adaptive'",
    description: 'adaptive：高度由 effect semantic 或内容决定；fixed：使用 height。',
  },
  {
    name: 'height',
    type: 'number',
    defaultValue: '—',
    description: 'heightMode=fixed 时面板高度（px）。container 场景由 effect-container-box 提供，勿传。',
  },
  {
    name: 'maxHeight',
    type: 'number',
    defaultValue: '—',
    description: '可选最大高度（px）；超出时内容区纵向滚动。',
  },
];

export const anchoredTooltipPropRows: DocPropRow[] = [
  {
    name: 'trigger',
    type: "'click' | 'hover'",
    defaultValue: "'click'",
    description: 'click：点击切换；click 模式下阻止右键菜单。',
  },
  {
    name: 'placement',
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'bottom'",
    description: '相对触发器的弹出方向。',
  },
  {
    name: 'offset',
    type: 'number',
    defaultValue: '8',
    description: '与触发器间距（px）。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '为 true 时不可打开。',
  },
  {
    name: 'panelKind / panelRadius / widthMode / width / height / maxHeight',
    type: '同 EgTooltip',
    defaultValue: '见 EgTooltip',
    description: '透传给内部 EgTooltip。',
  },
  {
    name: 'tokenScopeClass',
    type: 'string',
    defaultValue: "'desktopTokens'",
    description: 'Teleport 外层 class，用于加载 Desktop token。',
  },
];

export const tooltipSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: '—',
    defaultValue: '—',
    description: 'EgAnchoredTooltip：触发器。EgTooltip：面板内容。',
  },
  {
    name: 'content',
    type: '—',
    defaultValue: '—',
    description: 'EgAnchoredTooltip：Teleport 后面板内容（包在 EgTooltip 内）。',
  },
];

export function tooltipPanelPropsForPreview(state: Record<string, unknown>) {
  return panelPropsFromState(state);
}
