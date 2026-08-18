<script setup lang="ts">
import { computed } from 'vue';
import { findAnimationMeta } from '@/data/animations';
import ScensMotionPreview from '@/views/components/previews/ScensMotionPreview.vue';

const props = defineProps<{
  slug: string;
}>();

const meta = computed(() => findAnimationMeta(props.slug));
</script>

<template>
  <ScensMotionPreview
    v-if="meta"
    :key="meta.scenario"
    :initial-scenario="meta.scenario"
    :page-title="meta.name"
  />
</template>
