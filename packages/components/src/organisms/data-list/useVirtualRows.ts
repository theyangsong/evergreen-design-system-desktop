import { computed, type Ref } from 'vue';

export const DATA_LIST_VIRTUAL_THRESHOLD = 200;

export const DATA_LIST_VIRTUAL_OVERSCAN = 3;

export function useVirtualRows(options: {
  rowCount: Ref<number>;
  rowHeight: Ref<number>;
  scrollTop: Ref<number>;
  viewportHeight: Ref<number>;
  threshold?: number;
}) {
  const threshold = options.threshold ?? DATA_LIST_VIRTUAL_THRESHOLD;

  const enabled = computed(() => options.rowCount.value > threshold);

  const startIndex = computed(() => {
    if (!enabled.value) return 0;
    const raw = Math.floor(options.scrollTop.value / options.rowHeight.value);
    return Math.max(0, raw - DATA_LIST_VIRTUAL_OVERSCAN);
  });

  const endIndex = computed(() => {
    if (!enabled.value) return options.rowCount.value;
    const visibleCount =
      Math.ceil(options.viewportHeight.value / options.rowHeight.value) +
      DATA_LIST_VIRTUAL_OVERSCAN * 2;
    return Math.min(options.rowCount.value, startIndex.value + visibleCount);
  });

  const topSpacerPx = computed(() =>
    enabled.value ? startIndex.value * options.rowHeight.value : 0,
  );

  const bottomSpacerPx = computed(() =>
    enabled.value
      ? Math.max(0, (options.rowCount.value - endIndex.value) * options.rowHeight.value)
      : 0,
  );

  const visibleRowIndices = computed(() => {
    if (!enabled.value) {
      return Array.from({ length: options.rowCount.value }, (_, index) => index);
    }
    return Array.from(
      { length: endIndex.value - startIndex.value },
      (_, offset) => startIndex.value + offset,
    );
  });

  return {
    enabled,
    startIndex,
    endIndex,
    topSpacerPx,
    bottomSpacerPx,
    visibleRowIndices,
  };
}
