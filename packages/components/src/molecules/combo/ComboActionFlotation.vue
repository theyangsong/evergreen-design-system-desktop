<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import { EgButton } from '../button';
import styles from './ComboAction.module.css';

export type ComboActionFlotationTone = 'brand' | 'decor';

withDefaults(
  defineProps<{
    tone?: ComboActionFlotationTone;
    divider?: boolean;
    clear?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    tone: 'brand',
    divider: false,
    clear: false,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  clear: [];
}>();
</script>

<template>
  <div :class="styles.flotationRoot">
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
    <div :class="[styles.flotationBar, !clear && styles.flotationBarEnd]">
      <EgButton
        v-if="clear"
        :tone="tone"
        variant="text"
        size="md"
        @click="emit('clear')"
      >
        Clear
      </EgButton>
      <div :class="styles.flotationActions">
        <EgButton :tone="tone" variant="text" size="md" @click="emit('cancel')">
          {{ cancelLabel }}
        </EgButton>
        <EgButton :tone="tone" variant="solid" size="md" @click="emit('confirm')">
          {{ confirmLabel }}
        </EgButton>
      </div>
    </div>
  </div>
</template>
