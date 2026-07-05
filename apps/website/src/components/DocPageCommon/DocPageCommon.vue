<script setup lang="ts">
import type { DocMetaField } from '@/config/navigation';
import DocMetaPanel from '@/components/DocMetaPanel/DocMetaPanel.vue';
import PageHeader from '@/components/PageHeader/PageHeader.vue';
import styles from './DocPageCommon.module.css';

defineProps<{
  title: string;
  description?: string;
  meta?: DocMetaField[];
}>();
</script>

<template>
  <h1 :class="styles.pageTitle">{{ title }}</h1>

  <div :class="styles.intro">
    <PageHeader v-if="description" :description="description" />
    <DocMetaPanel v-if="meta?.length" :fields="meta" />
  </div>
</template>
