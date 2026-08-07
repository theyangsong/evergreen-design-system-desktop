type AnchoredTooltipCloseEntry = {
  close: () => void;
  /** false：click Popover 等；Batch Bar pointerenter 时不应关闭。 */
  dismissOnBarInteract: boolean;
};

/** 登记 AnchoredTooltip 实例，便于批处理等场景一次性关闭 hover 浮层。 */
const closeHandlers = new Set<AnchoredTooltipCloseEntry>();

let openClickAnchoredTooltipCount = 0;

export function registerAnchoredTooltipClose(
  handler: () => void,
  options?: { dismissOnBarInteract?: boolean },
): () => void {
  const entry: AnchoredTooltipCloseEntry = {
    close: handler,
    dismissOnBarInteract: options?.dismissOnBarInteract ?? true,
  };
  closeHandlers.add(entry);
  return () => {
    closeHandlers.delete(entry);
  };
}

/** 关闭全部 AnchoredTooltip（含 click Popover）。 */
export function closeAllAnchoredTooltips(): void {
  closeHandlers.forEach((entry) => {
    entry.close();
  });
}

/**
 * 仅关闭会在 Batch Bar 上挡住点击的 hover/focus 浮层；
 * click Popover 须保持至取消 / 空白 / Esc。
 */
export function closeBarBlockingAnchoredTooltips(): void {
  closeHandlers.forEach((entry) => {
    if (entry.dismissOnBarInteract) {
      entry.close();
    }
  });
}

/** 是否有 click 触发的 AnchoredTooltip / Popover 正在打开。 */
export function hasOpenClickAnchoredTooltip(): boolean {
  return openClickAnchoredTooltipCount > 0;
}

export function setClickAnchoredTooltipOpen(open: boolean): void {
  if (open) {
    openClickAnchoredTooltipCount += 1;
    return;
  }
  openClickAnchoredTooltipCount = Math.max(0, openClickAnchoredTooltipCount - 1);
}
