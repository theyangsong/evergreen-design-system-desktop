<script setup lang="ts">
import { computed } from 'vue';
import ListFieldPreviewPanel from '@/views/scenes/previews/ListFieldPreviewPanel.vue';
import type { DataListColumnDataSource } from './dataListPagePreviewData';
import {
  columnMinWidthForListFieldCustomize,
  getListFieldPreviewCustomize,
  isDataListListFieldDataSource,
} from './dataListPagePreviewData';
import previewStyles from './DataListPreview.module.css';

const props = withDefaults(
  defineProps<{
    dataSource: DataListColumnDataSource;
    columnMinWidth?: string;
    variant?: 'combo' | 'cell';
  }>(),
  {
    columnMinWidth: '',
    variant: 'cell',
  },
);

const listFieldSlug = computed(() =>
  isDataListListFieldDataSource(props.dataSource) ? props.dataSource : null,
);

const listFieldCustomize = computed(() => {
  if (!listFieldSlug.value) return null;
  const base = { ...getListFieldPreviewCustomize(listFieldSlug.value) };
  if (listFieldSlug.value !== 'list-field-currency') {
    const minWidth = columnMinWidthForListFieldCustomize(props.columnMinWidth);
    if (minWidth) {
      base.minWidth = minWidth;
    }
  }
  return base;
});
</script>

<template>
  <div v-if="listFieldSlug && listFieldCustomize" :class="previewStyles.listFieldCell">
    <ListFieldPreviewPanel :slug="listFieldSlug" :customize="listFieldCustomize" />
  </div>
  <div v-else-if="variant === 'combo'" :class="previewStyles.fieldItem">
    <span :class="previewStyles.fieldBarPrimary" aria-hidden="true" />
    <span :class="previewStyles.fieldBarSecondary" aria-hidden="true" />
  </div>
  <span v-else :class="previewStyles.cellBar" aria-hidden="true" />
</template>
