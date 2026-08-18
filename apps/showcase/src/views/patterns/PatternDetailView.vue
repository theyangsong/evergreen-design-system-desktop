<script setup lang="ts">
import { computed } from 'vue';
import { findPatternCatalogItem } from '@/data/patterns';
import { isListFieldSceneSlug } from '@/data/scenes';
import DetailPreview from '@/views/components/previews/DetailPreview.vue';
import ListFieldScenePreview from '@/views/scenes/previews/ListFieldScenePreview.vue';
import shared from '@/views/shared/showcase.module.css';

const props = defineProps<{
  slug: string;
}>();

const location = computed(() => findPatternCatalogItem(props.slug));

const listFieldSlug = computed(() =>
  isListFieldSceneSlug(props.slug) ? props.slug : null,
);

const isDetail = computed(() => props.slug === 'detail');
</script>

<template>
  <ListFieldScenePreview
    v-if="listFieldSlug"
    :key="listFieldSlug"
    :slug="listFieldSlug"
  />
  <DetailPreview v-else-if="isDetail" />
  <section v-else-if="location" :class="shared.section">
    <p :class="shared.bodyText">Preview coming soon.</p>
  </section>
</template>
