<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import { EgButton } from '../button';
import styles from './ComboAction.module.css';

import type { ButtonSize } from '../button/Button.vue';

export type ComboActionFlotationTone = 'brand' | 'decor';

export type ComboActionFlotationBarPadding = 'default' | 'inset-5';

withDefaults(
  defineProps<{
    tone?: ComboActionFlotationTone;
    divider?: boolean;
    clear?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    barPadding?: ComboActionFlotationBarPadding;
    buttonSize?: ButtonSize;
  }>(),
  {
    tone: 'brand',
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
        <EgButton :tone="tone" variant="text" :size="buttonSize" @click="emit('cancel')">
          {{ cancelLabel }}
        </EgButton>
        <EgButton :tone="tone" variant="solid" :size="buttonSize" @click="emit('confirm')">
          {{ confirmLabel }}
        </EgButton>
      </div>
    </div>
  </div>
</template>
