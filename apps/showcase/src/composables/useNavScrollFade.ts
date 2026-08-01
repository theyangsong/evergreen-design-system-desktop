import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { SCROLL_EDGE_EPSILON } from './scrollContainment';

export function useNavScrollFade(scrollRef: Ref<HTMLElement | null>) {
  const fadeTop = ref(false);
  const fadeBottom = ref(false);
  let resizeObserver: ResizeObserver | undefined;

  function updateFade() {
    const element = scrollRef.value;

    if (!element) {
      fadeTop.value = false;
      fadeBottom.value = false;
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = element;
    const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;

    fadeTop.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
    fadeBottom.value =
      canScroll && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;
  }

  onMounted(() => {
    updateFade();

    resizeObserver = new ResizeObserver(() => {
      updateFade();
    });

    if (scrollRef.value) {
      resizeObserver.observe(scrollRef.value);
    }
  });

  watch(scrollRef, (nextElement, previousElement) => {
    if (previousElement) {
      resizeObserver?.unobserve(previousElement);
    }

    if (nextElement) {
      resizeObserver?.observe(nextElement);
      updateFade();
    }
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  return { fadeTop, fadeBottom, updateFade };
}
