<script setup lang="ts">
import styles from './ModuleMenu.module.css';

withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: 'Title',
  },
);
</script>

<template>
  <div class="eds-module-menu-section-title" :class="styles.sectionTitleRow">
    <span :class="styles.sectionTitle">{{ title }}</span>
  </div>
</template>
