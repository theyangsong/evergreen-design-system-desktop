<script setup lang="ts">
import shared from '@/views/shared/showcase.module.css';

defineProps<{
  title?: string;
}>();
</script>

<template>
  <section :class="shared.section">
    <p :class="shared.bodyText">Preview coming soon.</p>
  </section>
</template>
