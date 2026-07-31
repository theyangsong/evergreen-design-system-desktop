<script setup lang="ts">
import { computed } from 'vue';
import { EgButton } from '../button';
import styles from './ComboAction.module.css';

export type ComboActionPopupTone = 'brand' | 'decor';

const props = withDefaults(
  defineProps<{
    tone?: ComboActionPopupTone;
    count?: 1 | 2 | '1' | '2';
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    tone: 'brand',
    count: 2,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const resolvedCount = computed(() => (Number(props.count) === 1 ? 1 : 2));
</script>

<template>
  <div :class="styles.popupRoot">
    <EgButton
      :class="styles.fullWidth"
      :tone="tone"
      variant="solid"
      size="md"
      @click="emit('confirm')"
    >
      {{ confirmLabel }}
    </EgButton>
    <EgButton
      v-if="resolvedCount === 2"
      :class="styles.fullWidth"
      :tone="tone"
      variant="text"
      size="md"
      @click="emit('cancel')"
    >
      {{ cancelLabel }}
    </EgButton>
  </div>
</template>
