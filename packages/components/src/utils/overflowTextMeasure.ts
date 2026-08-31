export const OVERFLOW_EPSILON = 1;

export function measureTextContentWidth(el: HTMLElement): number {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
}

export function isMeasuredWidthOverflowing(
  contentWidth: number,
  ...containerWidths: number[]
): boolean {
  return containerWidths.some((width) => contentWidth > width + OVERFLOW_EPSILON);
}

/** 标准省略号检测：scrollWidth 与文本自然宽度对比元素自身可见宽度。 */
export function isElementTextOverflowing(el: HTMLElement): boolean {
  const scrollWidth = el.scrollWidth;
  const textWidth = measureTextContentWidth(el);
  const visibleWidth = el.getBoundingClientRect().width;
  return (
    isMeasuredWidthOverflowing(scrollWidth, el.clientWidth, visibleWidth)
    || isMeasuredWidthOverflowing(textWidth, el.clientWidth, visibleWidth)
  );
}

/** 文本自然宽度超出给定容器的 client / rect 宽度。 */
export function isTextWiderThanContainers(
  el: HTMLElement,
  containers: Array<HTMLElement | null | undefined>,
): boolean {
  const textWidth = measureTextContentWidth(el);
  return containers
    .filter((node): node is HTMLElement => node != null)
    .some((box) =>
      isMeasuredWidthOverflowing(
        textWidth,
        box.clientWidth,
        box.getBoundingClientRect().width,
      ),
    );
}

/**
 * 子段按内容占位时，文本可能被 `overflow: hidden` 的中间层横向裁切。
 * 仅在 boundary 内回溯，避免页面级裁切层误判。
 */
export function isClippedInsideBoundary(
  probe: HTMLElement,
  boundary: HTMLElement | null,
): boolean {
  if (!boundary) return false;

  const probeRect = probe.getBoundingClientRect();
  let ancestor: HTMLElement | null = probe.parentElement;

  while (ancestor) {
    const overflowX = getComputedStyle(ancestor).overflowX;
    if (overflowX !== 'visible' && overflowX !== 'clip') {
      const clipRect = ancestor.getBoundingClientRect();
      if (
        probeRect.right > clipRect.right + OVERFLOW_EPSILON
        || probeRect.left < clipRect.left - OVERFLOW_EPSILON
      ) {
        return true;
      }
    }
    if (ancestor === boundary) break;
    ancestor = ancestor.parentElement;
  }

  return false;
}
