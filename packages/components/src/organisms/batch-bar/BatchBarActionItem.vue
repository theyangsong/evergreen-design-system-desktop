<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
import styles from './BatchBar.module.css';

export type BatchBarActionType = 'text' | 'symbol' | 'statistics';

const props = withDefaults(
  defineProps<{
    type?: BatchBarActionType;
    label?: string;
    count?: string | number;
    countSuffix?: string;
    disabled?: boolean;
    /** Text 选中态（Figma Active）。Focus 由 :focus-visible 驱动。 */
    active?: boolean;
    /** Text 加载态：展示 eds-load 旋转图标（同 DataList loading）。 */
    loading?: boolean;
    /** Text 危险态：--text-danger-primary。 */
    danger?: boolean;
  }>(),
  {
    type: 'text',
    label: 'Label',
    count: '0',
    countSuffix: 'Selectd',
    disabled: false,
    active: false,
    loading: false,
    danger: false,
  },
);

const isDisabled = computed(() => props.disabled || props.loading);
const formattedCount = computed(() => formatGroupedNumber(props.count));

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function onClick(event: MouseEvent) {
  event.stopPropagation();
  emit('click', event);
}

const countRef = ref<HTMLElement | null>(null);
const countWidthPx = ref<number | null>(null);
let countObserver: ResizeObserver | undefined;

function syncCountWidth() {
  const el = countRef.value;
  if (!el) return;
  const nextWidth = Math.ceil(el.scrollWidth);
  if (countWidthPx.value === nextWidth) return;
  countWidthPx.value = nextWidth;
}

const countWrapStyle = computed(() => {
  if (countWidthPx.value == null) return undefined;
  return { width: `${countWidthPx.value}px` };
});

function bindCountObserver() {
  countObserver?.disconnect();
  countObserver = undefined;
  if (props.type !== 'statistics') return;

  syncCountWidth();
  const el = countRef.value;
  if (!el || typeof ResizeObserver === 'undefined') return;

  countObserver = new ResizeObserver(syncCountWidth);
  countObserver.observe(el);
}

onMounted(async () => {
  await nextTick();
  bindCountObserver();
});

watch(
  () => [props.type, props.count] as const,
  async () => {
    await nextTick();
    bindCountObserver();
  },
);

onBeforeUnmount(() => {
  countObserver?.disconnect();
});
</script>

<template>
  <button
    type="button"
    class="eds-batch-bar-action-item"
    data-no-corner-smoothing
    :class="[
      styles.action,
      type === 'text' && styles.actionText,
      type === 'symbol' && styles.actionSymbol,
      type === 'statistics' && styles.actionStatistics,
      type === 'text' && active && styles.actionTextActive,
      type === 'text' && loading && styles.actionTextLoading,
      type === 'text' && danger && styles.actionTextDanger,
    ]"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    :aria-label="type === 'symbol' ? 'Close selection' : undefined"
    @click="onClick"
  >
    <template v-if="type === 'symbol'">
      <slot name="icon">
        <EgIcon name="eds-close" size="sm" />
      </slot>
    </template>
    <template v-else-if="type === 'statistics'">
      <span :class="styles.statCountWrap" :style="countWrapStyle">
        <span ref="countRef" :class="styles.statPrimary">{{ formattedCount }}</span>
      </span>
      <span :class="styles.statSecondary">{{ countSuffix }}</span>
    </template>
    <template v-else>
      <span :class="[styles.actionTextBody, loading && styles.actionTextBodyLoading]">
        <span :class="styles.actionTextLabel">{{ label }}</span>
        <EgIcon
          v-if="loading"
          name="eds-load"
          size="sm"
          :class="styles.actionLoadingSpin"
          aria-hidden="true"
        />
      </span>
    </template>
  </button>
</template>
