<script setup lang="ts">
import PageHeader from '@/components/shared/PageHeader.vue';
import CatalogInventory from '@/components/shared/CatalogInventory.vue';
import { scenesCatalog } from '@/data/scenes';
import shared from '@/views/shared/showcase.module.css';
</script>

<template>
  <div :class="shared.page">
    <PageHeader title="Scenes" lead="Website scene inventory from @eds/website-scenes." />

    <CatalogInventory :sections="scenesCatalog" />
  </div>
</template>
