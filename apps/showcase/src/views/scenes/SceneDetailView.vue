<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  findSceneCatalogItem,
  getSceneRouteSlug,
  isListFieldSceneSlug,
} from '@/data/scenes';
import ListFieldScenePreview from './previews/ListFieldScenePreview.vue';
import shared from '@/views/shared/showcase.module.css';

const props = defineProps<{
  slug: string;
}>();

const route = useRoute();

const pageSlug = computed(() => getSceneRouteSlug(route.path, props.slug));

const location = computed(() => findSceneCatalogItem(pageSlug.value));

const listFieldSlug = computed(() =>
  isListFieldSceneSlug(pageSlug.value) ? pageSlug.value : null,
);
</script>

<template>
  <ListFieldScenePreview
    v-if="listFieldSlug"
    :key="listFieldSlug"
    :slug="listFieldSlug"
  />
  <section v-else-if="location" :class="shared.section">
    <p :class="shared.bodyText">Preview coming soon.</p>
  </section>
</template>
