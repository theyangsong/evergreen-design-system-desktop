<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import styles from './CryptoCombo.module.css';

const props = withDefaults(
  defineProps<{
    /** Figma CryptoItem · type=In | Out */
    type?: 'in' | 'out';
  }>(),
  {
    type: 'in',
  },
);

const iconName = computed(() =>
  props.type === 'out' ? 'eds-arrow-outflow' : 'eds-arrow-entry',
);

const coreClass = computed(() => [
  styles.cryptoItemCore,
  props.type === 'out' && styles.cryptoItemOut,
]);
</script>

<template>
  <span :class="styles.cryptoItemRing" aria-hidden="true">
    <span :class="coreClass">
      <span :class="styles.cryptoItemIconWrap">
        <EgIcon :name="iconName" fit />
      </span>
    </span>
  </span>
</template>
