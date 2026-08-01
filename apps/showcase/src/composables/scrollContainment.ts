export const SCROLL_EDGE_EPSILON = 2;

export function isScrollableElement(element: HTMLElement): boolean {
  const { overflowY } = getComputedStyle(element);

  if (overflowY !== 'auto' && overflowY !== 'scroll' && overflowY !== 'overlay') {
    return false;
  }

  return element.scrollHeight > element.clientHeight + SCROLL_EDGE_EPSILON;
}

export function findScrollableAncestor(start: EventTarget | null): HTMLElement | null {
  let node = start instanceof Element ? start : null;

  while (node) {
    if (node instanceof HTMLElement && isScrollableElement(node)) {
      return node;
    }

    node = node.parentElement;
  }

  return null;
}

export function getElementScrollMetrics(element: HTMLElement) {
  const scrollTop = element.scrollTop;
  const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);

  return { scrollTop, maxScrollTop };
}

export function getPageScrollMetrics() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight;
  const maxScrollTop = Math.max(0, scrollHeight - window.innerHeight);

  return { scrollTop, maxScrollTop };
}

export function clampElementScroll(element: HTMLElement) {
  const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);

  if (element.scrollTop < 0) {
    element.scrollTop = 0;
  } else if (element.scrollTop > maxScrollTop) {
    element.scrollTop = maxScrollTop;
  }
}

export function clampPageScroll() {
  const { scrollTop, maxScrollTop } = getPageScrollMetrics();

  if (scrollTop < 0) {
    window.scrollTo(0, 0);
  } else if (scrollTop > maxScrollTop) {
    window.scrollTo(0, maxScrollTop);
  }
}

export function shouldPreventWheelChain(
  scrollTop: number,
  maxScrollTop: number,
  deltaY: number,
): boolean {
  const canScroll = maxScrollTop > SCROLL_EDGE_EPSILON;

  if (!canScroll) {
    return true;
  }

  const atTop = scrollTop <= SCROLL_EDGE_EPSILON;
  const atBottom = scrollTop >= maxScrollTop - SCROLL_EDGE_EPSILON;

  return (deltaY < 0 && atTop) || (deltaY > 0 && atBottom);
}

function onWheel(event: WheelEvent) {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  const scrollElement = findScrollableAncestor(target);

  if (scrollElement) {
    const { scrollTop, maxScrollTop } = getElementScrollMetrics(scrollElement);

    if (shouldPreventWheelChain(scrollTop, maxScrollTop, event.deltaY)) {
      event.preventDefault();
    }

    return;
  }

  const { scrollTop, maxScrollTop } = getPageScrollMetrics();

  if (shouldPreventWheelChain(scrollTop, maxScrollTop, event.deltaY)) {
    event.preventDefault();
  }
}

function onScroll(event: Event) {
  const target = event.target;

  if (target === document || target === document.documentElement) {
    clampPageScroll();
    return;
  }

  if (target instanceof HTMLElement) {
    clampElementScroll(target);
  }
}

export function installGlobalWheelScrollContainment() {
  document.addEventListener('wheel', onWheel, { passive: false, capture: true });
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
}
