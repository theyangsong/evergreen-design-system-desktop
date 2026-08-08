/** DataList 根节点在 select 列宽动画期间挂载，溢出测量须冻结直至 settle。 */
export const DATA_LIST_LAYOUT_ANIMATING_SELECTOR = '[data-eds-data-list-layout-animating]';

/** 与 DataList SELECT_COLUMN_ANIM_MS（300）+ 缓冲对齐。 */
export const DATA_LIST_LAYOUT_SETTLE_MS = 320;

export type LayoutSettleTimerRef = {
  timer?: ReturnType<typeof setTimeout>;
};

export function isInsideDataListLayoutAnimation(
  anchor: HTMLElement | null | undefined,
): boolean {
  if (!anchor?.closest) return false;
  return anchor.closest(DATA_LIST_LAYOUT_ANIMATING_SELECTOR) != null;
}

export function clearLayoutSettleTimer(ref: LayoutSettleTimerRef): void {
  if (ref.timer !== undefined) {
    clearTimeout(ref.timer);
    ref.timer = undefined;
  }
}

/**
 * 布局动画期间不逐帧改 overflowing（避免 class 抖动）；
 * 动画结束后一次性 measure。非动画区域立即 measure。
 */
export function scheduleOverflowMeasureAfterLayoutSettle(
  anchor: HTMLElement | null | undefined,
  measure: () => void,
  ref: LayoutSettleTimerRef,
): void {
  if (!isInsideDataListLayoutAnimation(anchor)) {
    clearLayoutSettleTimer(ref);
    measure();
    return;
  }

  if (ref.timer !== undefined) return;

  ref.timer = setTimeout(() => {
    ref.timer = undefined;
    measure();
  }, DATA_LIST_LAYOUT_SETTLE_MS);
}
