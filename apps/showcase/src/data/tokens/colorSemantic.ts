/**
 * Color semantic group order on /tokens (first segment of token name, except data-table-* → data).
 *
 * Spec source: packages/tokens/spec/color/semantic.json
 * Renamed/removed vs legacy: event-hover/focus *-primary|secondary|tertiary → event-* set;
 * text-match/success/warning/danger-* → status-* + text-hide; stroke-color-*-active/table-hover removed.
 */
export function colorSemanticGroupKey(name: string): string {
  if (name.startsWith('data-table-')) return 'data-table';
  if (name.startsWith('eds-')) return 'eds';
  return name.split('-')[0];
}

export const colorSemanticGroupOrder = [
  'box',
  'event',
  'status',
  'stroke',
  'text',
  'material',
  'data-table',
  'eds',
] as const;

export const colorSemanticGroupLabels: Record<string, string> = {
  box: 'Box',
  event: 'Event',
  status: 'Status',
  stroke: 'Stroke',
  text: 'Text',
  material: 'Material',
  'data-table': 'Data Table',
  eds: 'EDS Effect',
};

/** Figma Color System → Box variable order. */
export const boxColorTokenOrder = [
  'box-container',
  'box-menu',
  'box-page',
  'box-flotation',
] as const;

/** Figma Color System → Event variable order. */
export const eventColorTokenOrder = [
  'event-hover',
  'event-hover-light',
  'event-hover-brand',
  'event-hover-brand-weaken',
  'event-hover-danger',
  'event-hover-base',
  'event-hover-face',
  'event-hover-same-black',
  'event-hover-same-white',
  'event-active-dark',
  'event-active-brand',
  'event-active-danger',
  'event-active-base',
  'event-active-face',
  'event-active-same-black',
  'event-active-same-white',
  'event-focus',
  'event-focus-brand',
  'event-focus-brand-weaken',
] as const;

/** Figma Color System → Text variable order. */
export const textColorTokenOrder = [
  'text-hide',
  'text-base-primary',
  'text-base-secondary',
  'text-base-tertiary',
  'text-base-quaternary',
  'text-brand-primary',
  'text-brand-secondary',
  'text-brand-tertiary',
  'text-brand-quaternary',
  'text-same-black-primary',
  'text-same-black-secondary',
  'text-same-white-primary',
  'text-same-white-secondary',
  'text-face-primary',
  'text-face-secondary',
  'text-face-tertiary',
  'text-face-quaternary',
] as const;

/** Figma Color System → Material variable order. */
export const materialColorTokenOrder = [
  'material-hide',
  'material-base-primary',
  'material-base-secondary',
  'material-base-tertiary',
  'material-base-quaternary',
  'material-card-shallow',
  'material-card-moderate',
  'material-card-subtle',
  'material-card-deep',
  'material-same-black',
  'material-same-white-primary',
  'material-same-white-secondary',
  'material-same-white-tertiary',
  'material-same-white-quaternary',
  'material-brand-primary',
  'material-brand-tertiary',
  'material-brand-quaternary',
  'material-brand-quinary',
  'material-match-primary',
  'material-match-quaternary',
  'material-decor-primary',
  'material-decor-quaternary',
  'material-face-primary',
  'material-face-secondary',
  'material-face-tertiary',
  'material-face-quaternary',
] as const;

/** Figma Color System → Status variable order. */
export const statusColorTokenOrder = [
  'status-disable-base',
  'status-disable-base-weaken',
  'status-disable-brand',
  'status-disable-brand-weaken',
  'status-disable-same-white',
  'status-success',
  'status-success-weaken',
  'status-danger',
  'status-danger-weaken',
  'status-warning',
  'status-warning-weaken',
] as const;

/** Figma Color System → Data Table variable order. */
export const dataTableColorTokenOrder = [
  'data-table-head',
  'data-table-scroll-bar-background',
  'data-table-scroll-bar-indicator',
  'data-table-scroll-bar-indicator-hover',
] as const;

/** Figma Color System → Effect variable order. */
export const effectColorTokenOrder = [
  'eds-vulvar-shadow',
  'eds-vulvar-shadow-subtle',
  'eds-shadow-shallow',
  'eds-vulvar-shadow-glow',
  'eds-inner-shadow',
  'eds-inner-shadow-glow',
  'eds-popup-background',
  'eds-popup-box',
  'eds-flotation-box',
  'eds-mask',
  'eds-prompt',
] as const;

/** Figma Color System → Stroke variable order. */
export const strokeColorTokenOrder = [
  'stroke-hide',
  'stroke-base-primary',
  'stroke-base-secondary',
  'stroke-base-tertiary',
  'stroke-base-quaternary',
  'stroke-face-primary',
  'stroke-face-secondary',
  'stroke-divider-module',
  'stroke-divider-page',
  'stroke-divider-table',
  'stroke-outline-shallow',
  'stroke-outline-deep',
  'stroke-outline-subtle',
  'stroke-color-brand',
  'stroke-color-success',
  'stroke-color-decor',
  'stroke-color-danger',
  'stroke-same-white-primary',
  'stroke-same-white-secondary',
  'stroke-same-black-primary',
  'stroke-same-black-secondary',
] as const;

const colorTokenOrderByGroup: Record<string, readonly string[]> = {
  box: boxColorTokenOrder,
  event: eventColorTokenOrder,
  status: statusColorTokenOrder,
  stroke: strokeColorTokenOrder,
  text: textColorTokenOrder,
  material: materialColorTokenOrder,
  'data-table': dataTableColorTokenOrder,
  eds: effectColorTokenOrder,
};

export function sortColorSemanticItems<T extends { name: string }>(
  groupKey: string,
  items: T[],
): T[] {
  const order = colorTokenOrderByGroup[groupKey];
  if (!order) {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }

  const rank = new Map(order.map((name, index) => [name, index]));
  return [...items].sort(
    (a, b) => (rank.get(a.name) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.name) ?? Number.MAX_SAFE_INTEGER),
  );
}
