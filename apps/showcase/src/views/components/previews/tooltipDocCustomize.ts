import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import {
  buildVueOpeningTag,
  buildVueSelfClosingSnippet,
} from '@/views/shared/componentDoc/buildUsageSnippet';

export const tooltipImportCode = `import {
  EgTooltip,
  EgAnchoredTooltip,
  EgButton,
} from '@eds/desktop-components';`;

export const tooltipCustomizeDefaults = {
  previewMode: 'anchored',
  panelKind: 'flotation',
  widthMode: 'fixed',
  width: '328',
  height: '380',
  maxHeight: '',
  placement: 'bottom',
  trigger: 'click',
  disabled: false,
  triggerLabel: '点击我',
} as const;

const isAnchored = (state: Record<string, unknown>) =>
  String(state.previewMode ?? 'anchored') === 'anchored';

const isFixedWidth = (state: Record<string, unknown>) =>
  String(state.widthMode ?? 'fixed') === 'fixed';

export const tooltipCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'previewMode',
    label: '预览形态',
    options: [
      { value: 'anchored', label: 'EgAnchoredTooltip' },
      { value: 'panel', label: 'EgTooltip 面板' },
    ],
  },
  {
    kind: 'select',
    key: 'panelKind',
    label: 'panelKind',
    options: [
      { value: 'flotation', label: 'Flotation Box' },
      { value: 'popup', label: 'Popup Box' },
    ],
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: 'widthMode',
    options: [
      { value: 'adaptive', label: 'adaptive' },
      { value: 'fixed', label: 'fixed' },
    ],
  },
  {
    kind: 'text',
    key: 'width',
    label: 'width (px)',
    visibleWhen: isFixedWidth,
  },
  { kind: 'text', key: 'height', label: 'height (px)' },
  { kind: 'text', key: 'maxHeight', label: 'maxHeight (px)', placeholder: '可选' },
  {
    kind: 'select',
    key: 'placement',
    label: 'placement',
    options: [
      { value: 'top', label: 'top' },
      { value: 'bottom', label: 'bottom' },
      { value: 'left', label: 'left' },
      { value: 'right', label: 'right' },
    ],
    visibleWhen: isAnchored,
  },
  {
    kind: 'select',
    key: 'trigger',
    label: 'trigger',
    options: [
      { value: 'click', label: 'click' },
      { value: 'hover', label: 'hover' },
    ],
    visibleWhen: isAnchored,
  },
  { kind: 'boolean', key: 'disabled', label: 'disabled', visibleWhen: isAnchored },
  { kind: 'text', key: 'triggerLabel', label: '触发器文案', visibleWhen: isAnchored },
];

const CUSTOMIZE_ONLY_KEYS = new Set(['previewMode', 'triggerLabel']);

function panelPropsFromState(state: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {
    panelKind: state.panelKind,
    widthMode: state.widthMode,
    height: Number.parseInt(String(state.height ?? ''), 10) || 380,
  };

  if (isFixedWidth(state)) {
    const width = Number.parseInt(String(state.width ?? ''), 10);
    if (Number.isFinite(width)) props.width = width;
  }

  const maxHeightRaw = String(state.maxHeight ?? '').trim();
  if (maxHeightRaw !== '') {
    const maxHeight = Number.parseInt(maxHeightRaw, 10);
    if (Number.isFinite(maxHeight)) props.maxHeight = maxHeight;
  }

  return props;
}

export function buildTooltipUsageSnippet(state: Record<string, unknown>): string {
  const panelProps = panelPropsFromState(state);

  if (String(state.previewMode ?? 'anchored') === 'panel') {
    return buildVueSelfClosingSnippet('EgTooltip', panelProps, {
      defaults: {
        panelKind: tooltipCustomizeDefaults.panelKind,
        widthMode: tooltipCustomizeDefaults.widthMode,
        height: Number.parseInt(tooltipCustomizeDefaults.height, 10),
      },
      omitKeys: [...CUSTOMIZE_ONLY_KEYS, 'placement', 'trigger', 'disabled'],
    });
  }

  const anchoredProps: Record<string, unknown> = {
    ...panelProps,
    placement: state.placement,
    trigger: state.trigger,
    disabled: state.disabled,
  };

  const openTag = buildVueOpeningTag('EgAnchoredTooltip', anchoredProps, {
    defaults: {
      placement: tooltipCustomizeDefaults.placement,
      trigger: tooltipCustomizeDefaults.trigger,
      panelKind: tooltipCustomizeDefaults.panelKind,
      widthMode: tooltipCustomizeDefaults.widthMode,
      height: Number.parseInt(tooltipCustomizeDefaults.height, 10),
      disabled: tooltipCustomizeDefaults.disabled,
    },
    omitKeys: [...CUSTOMIZE_ONLY_KEYS],
  });

  const label = String(state.triggerLabel ?? tooltipCustomizeDefaults.triggerLabel);
  return `${openTag}
  <EgButton tone="sameWhite" size="lg">${label}</EgButton>
  <template #content />
</EgAnchoredTooltip>`;
}

export const tooltipPropRows: DocPropRow[] = [
  {
    name: 'panelKind',
    type: "'flotation' | 'popup'",
    defaultValue: "'flotation'",
    description:
      'flotation：`--effect-flotation-box`；popup：`--effect-popup-box`。圆角 / 内边距 / 阴影等为设计 token，不可 prop 覆盖。',
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
    name: 'height',
    type: 'number',
    defaultValue: '380',
    description: '面板高度（px）。',
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
    name: 'panelKind / widthMode / width / height / maxHeight',
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
