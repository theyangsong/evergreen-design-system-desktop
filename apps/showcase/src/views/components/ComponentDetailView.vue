<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { findCatalogItem, getComponentRouteSlug } from '@/data/components/navigation';
import { componentPreviewBySlug } from './previews';
import shared from '@/views/shared/showcase.module.css';

const props = defineProps<{
  slug: string;
}>();

const route = useRoute();

const pageSlug = computed(() => getComponentRouteSlug(route.path, props.slug));

const location = computed(() => findCatalogItem(pageSlug.value));
const preview = computed(() => componentPreviewBySlug[pageSlug.value]);

async function scrollToHash(hash: string) {
  if (!hash.startsWith('#')) {
    return;
  }

  const anchorId = hash.slice(1);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    await nextTick();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
}

watch(
  pageSlug,
  () => {
    if (!route.hash) {
      window.scrollTo(0, 0);
    }
  },
);

watch(
  () => route.hash,
  (hash) => {
    if (hash) {
      void scrollToHash(hash);
    }
  },
  { immediate: true },
);
</script>

<template>
  <component :is="preview.component" v-if="preview" :key="pageSlug" />
  <section v-else-if="location" :class="shared.section">
    <p :class="shared.bodyText">Preview coming soon.</p>
  </section>
</template>
