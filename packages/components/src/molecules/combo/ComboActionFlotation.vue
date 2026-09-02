<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import { EgButton } from '../button';
import styles from './ComboAction.module.css';

import type { ButtonSize, ButtonVariant } from '../button/Button.vue';

export type ComboActionFlotationTone = 'brand' | 'decor';

export type ComboActionFlotationBarPadding = 'default' | 'inset-5';

withDefaults(
  defineProps<{
    tone?: ComboActionFlotationTone;
    variant?: ButtonVariant;
    divider?: boolean;
    clear?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    barPadding?: ComboActionFlotationBarPadding;
    buttonSize?: ButtonSize;
  }>(),
  {
    tone: 'brand',
    variant: 'solid',
    divider: false,
    clear: false,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    barPadding: 'default',
    buttonSize: 'md',
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
    <div
      :class="[
        styles.flotationBar,
        !clear && styles.flotationBarEnd,
        barPadding === 'inset-5' && styles.flotationBarInset5,
      ]"
    >
      <EgButton
        v-if="clear"
        :tone="tone"
        variant="text"
        :size="buttonSize"
        @click="emit('clear')"
      >
        Clear
      </EgButton>
      <div :class="styles.flotationActions">
        <EgButton tone="subtle" variant="text" :size="buttonSize" @click="emit('cancel')">
          {{ cancelLabel }}
        </EgButton>
        <EgButton :tone="tone" :variant="variant" :size="buttonSize" @click="emit('confirm')">
          {{ confirmLabel }}
        </EgButton>
      </div>
    </div>
  </div>
</template>
