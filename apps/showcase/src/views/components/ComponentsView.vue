<script setup lang="ts">
import '@/styles/desktop-components-scope.css';
import { computed, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import PageHeader from '@/components/shared/PageHeader.vue';
import ComponentsPageAnchors from '@/components/shared/ComponentsPageAnchors.vue';
import { findCatalogChildPage, findCatalogItem, getComponentRouteSlug } from '@/data/components/navigation';
import { componentPreviewBySlug } from '@/views/components/previews';
import shared from '@/views/shared/showcase.module.css';
import styles from './ComponentsView.module.css';

const route = useRoute();

const activeSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const childPage = computed(() => findCatalogChildPage(activeSlug.value));

const moleculeLocation = computed(() => {
  if (childPage.value) return childPage.value.parent;
  return findCatalogItem(activeSlug.value);
});

const previewEntry = computed(() => componentPreviewBySlug[activeSlug.value]);

const headerTitle = computed(() => {
  if (previewEntry.value?.title) return previewEntry.value.title;
  if (childPage.value) return childPage.value.child.label;
  return moleculeLocation.value?.item.name ?? 'Components';
});

const headerLead = computed(() => moleculeLocation.value?.item.description ?? '');

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

    <ComponentsPageAnchors />
  </div>
</template>
