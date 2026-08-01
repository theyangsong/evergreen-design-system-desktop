import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue';
import {
  clampElementScroll,
  getElementScrollMetrics,
  shouldPreventWheelChain,
} from './scrollContainment';

export function usePreventScrollChaining(
  elementRef: Ref<HTMLElement | null | undefined>,
) {
  let element: HTMLElement | null = null;

  function onWheel(event: WheelEvent) {
    if (!element) {
      return;
    }

    const { scrollTop, maxScrollTop } = getElementScrollMetrics(element);

    if (shouldPreventWheelChain(scrollTop, maxScrollTop, event.deltaY)) {
      event.preventDefault();
    }
  }

  function onScroll() {
    if (element) {
      clampElementScroll(element);
    }
  }

  function bind(nextElement: HTMLElement | null | undefined) {
    element?.removeEventListener('wheel', onWheel);
    element?.removeEventListener('scroll', onScroll);
    element = nextElement ?? null;
    element?.addEventListener('wheel', onWheel, { passive: false });
    element?.addEventListener('scroll', onScroll, { passive: true });
  }

  onMounted(() => {
    bind(elementRef.value);
  });

  watch(elementRef, (nextElement) => {
    bind(nextElement);
  });

  onBeforeUnmount(() => {
    bind(null);
  });
}
