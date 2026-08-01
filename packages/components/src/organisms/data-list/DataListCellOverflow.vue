<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgAnchoredTooltip } from '../../molecules/tooltip';
import styles from './DataList.module.css';

const props = withDefaults(
  defineProps<{
    text?: string;
    disabled?: boolean;
  }>(),
  {
    text: '',
    disabled: false,
  },
);

const contentRef = ref<HTMLElement | null>(null);
const overflowing = ref(false);
let resizeObserver: ResizeObserver | null = null;

const tooltipText = computed(() => String(props.text ?? '').trim());

function measureOverflow() {
  const el = contentRef.value;
  if (!el) {
    overflowing.value = false;
    return;
  }
  overflowing.value = el.scrollWidth > el.clientWidth + 1;
}

watch(
  () => props.text,
  () => {
    nextTick(measureOverflow);
  },
);

onMounted(() => {
  measureOverflow();
  if (!contentRef.value) return;
  resizeObserver = new ResizeObserver(() => measureOverflow());
  resizeObserver.observe(contentRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <EgAnchoredTooltip
    :content="tooltipText"
    :disabled="disabled || !overflowing || !tooltipText"
    placement="top"
    align="start"
    trigger="hover"
    width-mode="adaptive"
    :max-width="480"
  >
    <div ref="contentRef" :class="styles.cellText">
      <slot>{{ text }}</slot>
    </div>
  </EgAnchoredTooltip>
</template>
