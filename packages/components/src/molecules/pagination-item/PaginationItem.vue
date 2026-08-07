<script setup lang="ts">
import { computed } from 'vue';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
import styles from './PaginationItem.module.css';

export type PaginationItemKind = 'number' | 'symbol' | 'button' | 'borderArrow';
export type PaginationItemTone = 'brand' | 'decor';

const props = withDefaults(
  defineProps<{
    kind?: PaginationItemKind;
    tone?: PaginationItemTone;
    label?: string;
    disabled?: boolean;
    /** false 时保持默认视觉，但不响应 hover / active / focus 交互样式。 */
    interactive?: boolean;
    /** 外部驱动 active 视觉（如 Detail 键盘 ←/→），与 :active 一致。 */
    visualActive?: boolean;
    selected?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    kind: 'number',
    tone: 'decor',
    label: '0',
    disabled: false,
    interactive: true,
    visualActive: false,
    selected: false,
    type: 'button',
  },
);

const formattedLabel = computed(() =>
  props.kind === 'number' ? formatGroupedNumber(props.label) : props.label,
);
</script>

<template>
  <button
    :class="[
      'eds-pagination-item',
      styles.item,
      styles[props.kind],
      kind !== 'borderArrow' && styles[props.tone],
      kind === 'number' && selected && styles.selected,
      visualActive && styles.visualActive,
      !interactive && styles.nonInteractive,
    ]"
    :disabled="disabled"
    :tabindex="interactive ? undefined : -1"
    :type="type"
    :aria-label="kind === 'number' ? formattedLabel : label || undefined"
    :aria-disabled="!interactive || undefined"
  >
    <span v-if="kind === 'number'" :class="styles.label">{{ formattedLabel }}</span>
    <span v-else :class="styles.icon">
      <slot />
    </span>
  </button>
</template>
