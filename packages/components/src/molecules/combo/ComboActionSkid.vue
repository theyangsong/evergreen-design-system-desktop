<script setup lang="ts">
import { EgButton } from '../button';
import styles from './ComboAction.module.css';

export type ComboActionSkidTone = 'brand' | 'decor' | 'danger';

withDefaults(
  defineProps<{
    tone?: ComboActionSkidTone;
    divider?: boolean;
    confirmLabel?: string;
  }>(),
  {
    tone: 'brand',
    divider: false,
    confirmLabel: 'Confirm',
  },
);

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <div :class="styles.skidRoot">
    <div v-if="divider" :class="styles.divider" role="separator" />
    <div :class="styles.skidActions">
      <EgButton
        :class="styles.fullWidth"
        :tone="tone"
        variant="solid"
        size="md"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </EgButton>
    </div>
  </div>
</template>
