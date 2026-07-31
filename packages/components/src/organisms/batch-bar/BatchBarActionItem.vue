<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import { EgDivider } from '../../atoms/divider';
import styles from './BatchBar.module.css';

export type BatchBarActionType = 'text' | 'symbol' | 'statistics';

withDefaults(
  defineProps<{
    type?: BatchBarActionType;
    label?: string;
    count?: string | number;
    countSuffix?: string;
    disabled?: boolean;
  }>(),
  {
    type: 'text',
    label: 'Label',
    count: '0',
    countSuffix: 'Selectd',
    disabled: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    type="button"
    class="eds-batch-bar-action-item"
    :class="[
      styles.action,
      type === 'symbol' && styles.actionSymbol,
      type === 'statistics' && styles.actionStatistics,
    ]"
    :disabled="disabled"
    @click="emit('click')"
  >
    <template v-if="type === 'symbol'">
      <slot name="icon">
        <EgIcon name="eds-close" size="sm" />
      </slot>
    </template>
    <template v-else-if="type === 'statistics'">
      <span :class="styles.statPrimary">{{ count }}</span>
      <span :class="styles.statSecondary">{{ countSuffix }}</span>
    </template>
    <template v-else>
      {{ label }}
    </template>
  </button>
</template>
