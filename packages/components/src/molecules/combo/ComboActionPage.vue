<script setup lang="ts">
import { EgButton } from '../button';
import { EgDivider } from '../../atoms/divider';
import styles from './ComboAction.module.css';

export type ComboActionPageTone = 'brand' | 'decor';

withDefaults(
  defineProps<{
    tone?: ComboActionPageTone;
    divider?: boolean;
    direction?: 'left' | 'right';
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    tone: 'brand',
    divider: false,
    direction: 'right',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <div
    :class="[
      styles.pageRoot,
      direction === 'left' ? styles.pageRootAlignStart : styles.pageRootAlignEnd,
    ]"
  >
    <EgDivider
      :class="[
        styles.divider,
        styles.dividerAnimated,
        !divider && styles.dividerAnimatedHidden,
      ]"
      type="module"
      direction="horizontal"
      :hide="!divider"
    />
    <div
      :class="[
        styles.pageActions,
        direction === 'left' ? styles.pageActionsLeft : styles.pageActionsRight,
      ]"
    >
      <EgButton :tone="tone" variant="text" size="md" @click="emit('cancel')">
        {{ cancelLabel }}
      </EgButton>
      <EgButton :tone="tone" variant="solid" size="md" @click="emit('confirm')">
        {{ confirmLabel }}
      </EgButton>
    </div>
  </div>
</template>
