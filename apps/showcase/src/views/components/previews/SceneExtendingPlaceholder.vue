<script setup lang="ts">
import { catalogSceneExtendingLabel } from '@/data/catalogHelpers';
import shared from '@/views/shared/showcase.module.css';
</script>

<template>
  <section :class="shared.section">
    <p :class="shared.bodyText">{{ catalogSceneExtendingLabel }}</p>
  </section>
</template>
