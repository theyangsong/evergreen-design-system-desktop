<script setup lang="ts">
import { computed, reactive } from 'vue';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import shared from '@/views/shared/showcase.module.css';
import styles from './InputPreview.module.css';
import previewStyles from './DataListPreview.module.css';
import DataListPagePreview from './DataListPagePreview.vue';
import {
  buildDataListPageUsageSnippet,
} from './dataListPagePreviewData';
import {
  ORGANISM_IMPORT,
  dataListColumnPropRows,
  dataListColumnSettingControls,
  dataListCustomizeControls,
  dataListCustomizeDefaults,
  dataListPaginationCustomizeControls,
  dataListPropRows,
  dataListSlotRows,
  dataListToolbarCustomizeControls,
  paginerStatisticsCustomizeControls,
} from './organismTemplateDocData';
import {
  iconButtonProNestedRowColumns,
  paginerPaginationNestedRowColumns,
} from './buttonDocCustomize';
import { useDataListPagePreview } from './useDataListPagePreview';

const customize = reactive({ ...dataListCustomizeDefaults });

const { showStatistics } = useDataListPagePreview(computed(() => customize));

const usageSnippet = computed(() => buildDataListPageUsageSnippet(customize));

const eventRows = [
  {
    name: 'update:select-mode',
    type: '(enabled: boolean) => void',
    defaultValue: '-',
    description: '多选模式开关；Batch Bar 关闭时同步为 false。',
  },
  { name: 'row-click', type: '(row) => void', defaultValue: '-', description: '非多选时点击行。' },
  {
    name: 'update:selected-list',
    type: '(rows) => void',
    defaultValue: '-',
    description: '多选列表变更（含 _index）。',
  },
  {
    name: 'selected-change',
    type: '(rows) => void',
    defaultValue: '-',
    description: '同 update:selected-list。',
  },
];
</script>

<template>
  <div :class="[styles.previewPage, previewStyles.docPreviewHeight]">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Data List"
      :show-doc-title="false"
      component-tag="EgDataList"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="dataListCustomizeControls"
      :customize-defaults="dataListCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="dataListPropRows"
      :event-rows="eventRows"
      :slot-rows="dataListSlotRows"
      props-section-id="data-list-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            previewStyles.pageShell,
            String(customize.pageHeightMode) === 'adaptive'
              ? previewStyles.pageShellAdaptive
              : previewStyles.pageShellFixed,
          ]"
        >
          <DataListPagePreview :customize="customize" :use-page-shell="false" />
        </div>
      </template>

      <template #customize-after>
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          :row-columns="iconButtonProNestedRowColumns"
          title="工具栏 · EgIconButtonPro"
          :controls="dataListToolbarCustomizeControls"
        />
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          :row-columns="3"
          title="列设置"
          :controls="dataListColumnSettingControls"
        />
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          :row-columns="paginerPaginationNestedRowColumns"
          title="分页 · EgPaginationItem"
          :controls="dataListPaginationCustomizeControls"
        />
        <CustomizePanel
          v-if="showStatistics"
          v-model="customize"
          nested
          sequential
          title="数据统计"
          :controls="paginerStatisticsCustomizeControls"
        />
      </template>

      <section :class="shared.section">
        <h2 :class="shared.sectionTitle">EgDataListColumn</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="dataListColumnPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
