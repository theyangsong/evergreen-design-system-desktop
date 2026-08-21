<script setup lang="ts">
import { computed, provide, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { findCatalogChildPage, findCatalogItem, getComponentRouteSlug } from '@/data/components/navigation';
import { componentPreviewBySlug, usesAvatarComponentPreview, usesCompactComponentPreview, usesTagComponentPreview } from './previews';
import ShowcasePlaceholderPreview from './previews/ShowcasePlaceholderPreview.vue';
import shared from '@/views/shared/showcase.module.css';

const props = defineProps<{
  slug: string;
}>();

const route = useRoute();

const pageSlug = computed(() => getComponentRouteSlug(route.path, props.slug));

const childLocation = computed(() => findCatalogChildPage(pageSlug.value));
const familyLocation = computed(() => {
  if (childLocation.value) return childLocation.value.parent;
  return findCatalogItem(pageSlug.value);
});
const preview = computed(() => componentPreviewBySlug[pageSlug.value]);

const compactPreview = computed(() => usesCompactComponentPreview(pageSlug.value));
const tagPreview = computed(() => usesTagComponentPreview(pageSlug.value));
const avatarPreview = computed(() => usesAvatarComponentPreview(pageSlug.value));

provide('componentDocCompactPreview', compactPreview);
provide('componentDocTagPreview', tagPreview);
provide('componentDocAvatarPreview', avatarPreview);

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
  <template v-else-if="childLocation?.child.emptyScenesPlaceholder" />
  <ShowcasePlaceholderPreview
    v-else-if="childLocation"
    :key="pageSlug"
    :title="childLocation.child.label"
  />
  <section v-else-if="familyLocation" :class="shared.section">
    <p :class="shared.bodyText">Preview coming soon.</p>
  </section>
</template>
