<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import PageHeader from '@/components/shared/PageHeader.vue';
import CatalogPageAnchors from '@/components/shared/CatalogPageAnchors.vue';
import { findPatternCatalogItem, patternAnchorItems } from '@/data/patterns';
import styles from '../components/ComponentsView.module.css';
import shared from '@/views/shared/showcase.module.css';

const route = useRoute();

const activeSlug = computed(() => {
  const param = route.params.slug;
  return typeof param === 'string' ? param : '';
});

const catalogLocation = computed(() => findPatternCatalogItem(activeSlug.value));

const headerTitle = computed(() => catalogLocation.value?.item.name ?? 'Patterns');

const headerLead = computed(
  () => catalogLocation.value?.item.description ?? '可复用页面与数据组合。',
);

watch(activeSlug, () => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div :class="styles.pageWithAnchors">
    <div :class="[shared.page, styles.componentPage]">
      <PageHeader :title="headerTitle" :lead="headerLead" />

      <RouterView :key="activeSlug" />
    </div>

    <CatalogPageAnchors
      route-prefix="patterns"
      aria-label="Patterns navigation"
      :items="patternAnchorItems"
    />
  </div>
</template>
