<script setup lang="ts">
import styles from './PaginationItem.module.css';

export type PaginationItemKind = 'number' | 'symbol' | 'button';
export type PaginationItemTone = 'brand' | 'decor';

const props = withDefaults(
  defineProps<{
    kind?: PaginationItemKind;
    tone?: PaginationItemTone;
    label?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    kind: 'number',
    tone: 'decor',
    label: '0',
    disabled: false,
    type: 'button',
  },
);
</script>

<template>
  <button
    :class="[
      'eds-pagination-item',
      styles.item,
      styles[props.kind],
      styles[props.tone],
    ]"
    :disabled="disabled"
    :type="type"
    :aria-label="kind === 'number' ? label : undefined"
  >
    <span v-if="kind === 'number'" :class="styles.label">{{ label }}</span>
    <span v-else :class="styles.icon">
      <slot />
    </span>
  </button>
</template>
