/** Effect semantic 场景 — 对应 packages/tokens/spec/effect/semantic.json */
export type TooltipPanelKind = 'container' | 'flotation' | 'popup' | 'subtle' | 'molde';

/** 仅允许 Scale 语义中的 Radius token（--radius-*）。 */
export const TOOLTIP_PANEL_RADIUS_TOKENS = [
  'radius-0',
  'radius-xs',
  'radius-sm',
  'radius-md',
  'radius-lg',
  'radius-full',
] as const;

export type TooltipPanelRadiusToken = (typeof TOOLTIP_PANEL_RADIUS_TOKENS)[number];

/** 各 panelKind 在 effect semantic 中的默认圆角；molde 无圆角。 */
export const TOOLTIP_PANEL_KIND_DEFAULT_RADIUS: Record<
  TooltipPanelKind,
  TooltipPanelRadiusToken | null
> = {
  container: 'radius-md',
  flotation: 'radius-md',
  popup: 'radius-lg',
  subtle: 'radius-md',
  molde: null,
};

export function resolveTooltipPanelRadius(
  panelKind: TooltipPanelKind,
  panelRadius?: TooltipPanelRadiusToken,
): TooltipPanelRadiusToken | null {
  if (panelRadius) return panelRadius;
  return TOOLTIP_PANEL_KIND_DEFAULT_RADIUS[panelKind] ?? null;
}

export function tooltipPanelRadiusCssVar(token: TooltipPanelRadiusToken): string {
  return `var(--${token})`;
}

export function isTooltipPanelRadiusToken(value: string): value is TooltipPanelRadiusToken {
  return (TOOLTIP_PANEL_RADIUS_TOKENS as readonly string[]).includes(value);
}
