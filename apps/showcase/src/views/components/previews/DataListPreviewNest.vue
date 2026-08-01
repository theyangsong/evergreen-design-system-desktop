<script setup lang="ts">
import { reactive } from 'vue';
import { dataListCustomizeDefaults } from './organismTemplateDocData';
import DataListPagePreview from './DataListPagePreview.vue';

defineProps<{
  layoutSkidOpen?: boolean;
}>();

const customize = reactive({ ...dataListCustomizeDefaults });
</script>

<template>
  <DataListPagePreview nested :customize="customize" :layout-skid-open="layoutSkidOpen" />
</template>
