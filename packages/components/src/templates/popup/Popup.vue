<script setup lang="ts">
import styles from './Popup.module.css';

export type PopupUses = 'detail' | 'reminder' | 'verify';

withDefaults(
  defineProps<{
    uses?: PopupUses;
  }>(),
  {
    uses: 'reminder',
  },
);
</script>

<template>
  <div class="eds-popup" :class="styles.root" role="presentation">
    <div :class="styles.backdrop" aria-hidden="true" />
    <div :class="styles.panel" role="dialog" aria-modal="true" :data-uses="uses">
      <slot />
    </div>
  </div>
</template>
