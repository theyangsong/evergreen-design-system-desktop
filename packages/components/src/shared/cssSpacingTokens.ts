type TooltipAlign = 'start' | 'center' | 'end';

/** 主轴间距：tooltip --spacing-025；popover（wrap-tooltip=false）--spacing-05；交叉轴 inset：--spacing-2 */
export const SPACING_MAIN_AXIS = '--spacing-025';
export const SPACING_MAIN_AXIS_POPOVER = '--spacing-05';
export const SPACING_EDGE_INSET = '--spacing-2';
export const FALLBACK_MAIN_AXIS_PX = 1;
export const FALLBACK_MAIN_AXIS_POPOVER_PX = 2;
export const FALLBACK_EDGE_INSET_PX = 8;

export function readCssTokenLength(
  el: HTMLElement,
  tokenName: string,
  fallback: number,
): number {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;padding-top:var(' +
    tokenName +
    ')';
  el.appendChild(probe);
  const px = Number.parseFloat(getComputedStyle(probe).paddingTop);
  el.removeChild(probe);
  return Number.isFinite(px) && px > 0 ? px : fallback;
}

/** start 向左扩 spacing-2；end 向右扩 spacing-2；center 不偏移。 */
export function resolveCrossAxisOffsetFromAlign(
  align: TooltipAlign,
  edgeInsetPx: number,
): number {
  if (align === 'end') {
    return edgeInsetPx;
  }
  if (align === 'center') {
    return 0;
  }
  return -edgeInsetPx;
}
