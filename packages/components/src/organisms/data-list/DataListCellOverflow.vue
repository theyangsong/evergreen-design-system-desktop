<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue';
import { EgAnchoredTooltip, type TooltipPlacement } from '../../molecules/tooltip';
import styles from './DataList.module.css';

const props = withDefaults(
  defineProps<{
    text?: string;
    disabled?: boolean;
    contentClass?: string;
    placement?: TooltipPlacement;
    boundarySelector?: string;
    maxWidth?: number;
    /** 表头 overflow tooltip 使用更窄面板与内边距。 */
    context?: 'cell' | 'header';
  }>(),
  {
    text: '',
    disabled: false,
    boundarySelector: '.eds-data-list',
    context: 'cell',
  },
);

const wrapRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const tooltipText = ref('');
let resizeObserver: ResizeObserver | null = null;

const resolvedContentClass = computed(() => props.contentClass ?? styles.cellText);

const resolvedPlacement = computed(
  () => props.placement ?? (props.context === 'header' ? 'bottom' : 'top'),
);

const resolvedMaxWidth = computed(() => {
  if (props.maxWidth != null) return props.maxWidth;
  return props.context === 'header' ? 240 : 480;
});

const resolvedTokenScopeClass = computed(() =>
  props.context === 'header'
    ? `desktopTokens eds-overflow-text-tooltip ${styles.headerOverflowTooltip}`
    : 'desktopTokens eds-overflow-text-tooltip',
);

const resolvedHeightMode = computed(() =>
  props.context === 'header' ? 'adaptive' : 'fixed',
);

const resolvedScrollable = computed(() => props.context !== 'header');

const showHeaderHoverTrigger = computed(
  () => props.context === 'header' && overflowing.value,
);

function measureOverflow() {
  const el = contentRef.value;
  if (!el) {
    overflowing.value = false;
    tooltipText.value = '';
    return;
  }
  const text = el.textContent?.trim() || String(props.text ?? '').trim();
  tooltipText.value = text;
  if (!text) {
    overflowing.value = false;
    return;
  }

  const scrollWidth = el.scrollWidth;
  const clientWidth = el.clientWidth;
  if (scrollWidth > clientWidth + 1) {
    overflowing.value = true;
    return;
  }

  /** Combo 表头：文本节点未收缩但 host 已收缩（列宽钳制）时仍视为溢出。 */
  if (props.context === 'header') {
    const host = wrapRef.value;
    if (host && scrollWidth > host.clientWidth + 1) {
      overflowing.value = true;
      return;
    }
  }

  overflowing.value = false;
}

watch(
  () => props.text,
  () => {
    nextTick(measureOverflow);
  },
);

function bindResizeObserver() {
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(() => measureOverflow());
  if (contentRef.value) {
    resizeObserver.observe(contentRef.value);
  }
  if (props.context === 'header' && wrapRef.value) {
    resizeObserver.observe(wrapRef.value);
  }
}

onMounted(() => {
  nextTick(() => {
    bindResizeObserver();
    requestAnimationFrame(() => {
      measureOverflow();
      requestAnimationFrame(measureOverflow);
    });
  });
});

onUpdated(() => {
  nextTick(measureOverflow);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <component
    :is="context === 'header' ? 'div' : 'span'"
    ref="wrapRef"
    :class="context === 'header' ? styles.headerOverflowHost : styles.cellOverflowHost"
  >
    <EgAnchoredTooltip
      :content="tooltipText"
      :disabled="disabled || !overflowing || !tooltipText"
      :placement="resolvedPlacement"
      trigger="hover"
      width-mode="adaptive"
      :max-width="resolvedMaxWidth"
      :height-mode="resolvedHeightMode"
      :scrollable="resolvedScrollable"
      :token-scope-class="resolvedTokenScopeClass"
      :boundary-selector="boundarySelector"
      :flip="context !== 'header'"
    >
      <span
        :class="[
          styles.overflowTriggerWrap,
          context === 'header' && styles.overflowTriggerWrapHeader,
          showHeaderHoverTrigger && 'eds-hover-tooltip-trigger',
        ]"
      >
        <span
          ref="contentRef"
          :class="[
            showHeaderHoverTrigger && 'eds-hover-tooltip-trigger__target',
            context === 'header' && styles.headerOverflowTrigger,
            resolvedContentClass,
          ]"
        >
          <slot>{{ text }}</slot>
        </span>
      </span>
    </EgAnchoredTooltip>
  </component>
</template>
