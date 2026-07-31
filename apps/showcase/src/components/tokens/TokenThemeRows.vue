<script setup lang="ts">
import type { ThemeTokenRow } from '@/views/tokens/tokensDisplay';
import shared from '@/views/shared/showcase.module.css';
import styles from './TokenRows.module.css';

defineProps<{
  rows: ThemeTokenRow[];
}>();
</script>

<template>
  <div :class="styles.list">
    <div v-for="row in rows" :key="row.name" :class="styles.themeRow">
      <span :class="[shared.bodyText, styles.name]">{{ row.name }}</span>
      <span :class="[shared.codeText, styles.value]">{{ row.light }}</span>
      <span :class="[shared.codeText, styles.value]">{{ row.dark }}</span>
    </div>
  </div>
</template>
