<script setup lang="ts">
import { computed } from 'vue';
import { EgCrypto, type CryptoName } from '../../atoms/crypto';
import CryptoItem from './CryptoItem.vue';
import styles from './CryptoCombo.module.css';

export type CryptoSymbolEntryBadge = 'none' | 'in' | 'out';

const props = withDefaults(
  defineProps<{
    name: CryptoName;
    label?: string;
    /** Figma subscript=Yes → 36×32 + entry badge */
    entryBadge?: CryptoSymbolEntryBadge;
    /** @deprecated 使用 entryBadge */
    showEntryBadge?: boolean;
  }>(),
  {
    entryBadge: 'none',
    showEntryBadge: false,
  },
);

const resolvedEntryBadge = computed((): CryptoSymbolEntryBadge => {
  if (props.entryBadge !== 'none') return props.entryBadge;
  return props.showEntryBadge ? 'in' : 'none';
});

const rootClass = computed(() => [
  styles.cryptoSymbol,
  resolvedEntryBadge.value !== 'none'
    ? styles.cryptoSymbolWithBadge
    : styles.cryptoSymbolPlain,
]);
</script>

<template>
  <span :class="rootClass">
    <EgCrypto :name="name" :label="label" fit :class="styles.cryptoSymbolIcon" />
    <CryptoItem
      v-if="resolvedEntryBadge !== 'none'"
      :type="resolvedEntryBadge === 'out' ? 'out' : 'in'"
      :class="styles.cryptoSymbolBadge"
    />
  </span>
</template>
