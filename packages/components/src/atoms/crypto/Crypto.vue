<script setup lang="ts">
import { computed } from 'vue';
import styles from './Crypto.module.css';
import { getProcessedCrypto, type CryptoName } from './cryptoRegistry';

const props = withDefaults(
  defineProps<{
    name: CryptoName;
    size?: 'sm' | 'md' | 'lg';
    fit?: boolean;
    label?: string;
  }>(),
  {
    size: 'md',
    fit: false,
  },
);

const processed = computed(() => getProcessedCrypto(String(props.name)));

const hostClass = computed(() => [
  styles.root,
  props.fit ? styles.fill : styles[props.size],
]);

const ariaLabel = computed(() => props.label || String(props.name));
</script>

<template>
  <span
    v-if="processed"
    :class="hostClass"
    role="img"
    :aria-label="label ? ariaLabel : undefined"
    :aria-hidden="label ? undefined : true"
  >
    <span class="eds-crypto" :class="styles.svgHost" v-html="processed.markup" />
  </span>
</template>
