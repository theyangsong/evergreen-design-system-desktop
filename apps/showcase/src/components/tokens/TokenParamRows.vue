<script setup lang="ts">
import type { TokenRow } from '@/views/tokens/tokensDisplay';
import shared from '@/views/shared/showcase.module.css';
import styles from './TokenRows.module.css';

defineProps<{
  rows: TokenRow[];
}>();
</script>

<template>
  <div :class="styles.list">
    <div v-for="row in rows" :key="row.name" :class="styles.row">
      <span :class="[shared.bodyText, styles.name]">{{ row.name }}</span>
      <span :class="[shared.codeText, styles.value]">{{ row.value }}</span>
    </div>
  </div>
</template>
