<script setup lang="ts">
import type { DocMetaField } from '@/config/navigation';
import styles from './DocMetaPanel.module.css';

defineProps<{
  fields: DocMetaField[];
}>();
</script>

<template>
  <section :class="styles.panel" aria-label="Document metadata">
    <div :class="styles.labels">
      <div v-for="field in fields" :key="field.label" :class="styles.label">
        {{ field.label }}
      </div>
    </div>

    <div :class="styles.values">
      <div v-for="field in fields" :key="`${field.label}-value`" :class="styles.value">
        {{ field.value }}
      </div>
    </div>
  </section>
</template>
