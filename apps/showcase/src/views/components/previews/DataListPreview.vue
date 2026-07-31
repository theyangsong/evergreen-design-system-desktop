<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { EgBatchBarActionItem, EgDataList, EgDataListColumn } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import shared from '@/views/shared/showcase.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import previewStyles from './DataListPreview.module.css';
import {
  ORGANISM_IMPORT,
  dataListColumnPropRows,
  dataListCustomizeControls,
  dataListCustomizeDefaults,
  dataListPropRows,
  dataListSlotRows,
} from './organismTemplateDocData';

const customize = reactive({ ...dataListCustomizeDefaults });

const listRef = ref<{ openSelect: () => void; closeSelect: () => void } | null>(null);

const sampleRows = [
  { name: 'Ada Lovelace', role: 'Analyst', status: 'Active', amount: '1,280.00' },
  { name: 'Alan Turing', role: 'Engineer', status: 'Pending', amount: '640.50' },
  { name: 'Grace Hopper', role: 'Lead', status: 'Active', amount: '2,100.00' },
  { name: 'Katherine Johnson', role: 'Scientist', status: 'Review', amount: '980.00' },
  { name: 'Donald Knuth', role: 'Advisor', status: 'Active', amount: '420.00' },
];

const dataList = computed(() => (customize.empty ? [] : sampleRows));

const usageSnippet = computed(
  () => `<EgDataList
  :data-list="rows"
  :header-height="${Number(customize.headerHeight) || 32}"
  :column-height="${Number(customize.columnHeight) || 66}"
  :loading="${Boolean(customize.loading)}"
  :initing="${Boolean(customize.initing)}"
>
  <EgDataListColumn prop="name" label="Name" :width-percent="28" sortable />
  <EgDataListColumn prop="role" label="Role" :width-percent="22" />
  <EgDataListColumn prop="status" label="Status" :width-percent="20" />
  <EgDataListColumn prop="amount" label="Amount" :width-percent="30" align="right" />
</EgDataList>`,
);

watch(
  () => customize.selectMode,
  (enabled) => {
    if (enabled) {
      listRef.value?.openSelect();
    } else {
      listRef.value?.closeSelect();
    }
  },
);

const eventRows = [
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
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Data List"
      tall-preview
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
            docStyles.previewInputHost,
            organismStyles.previewOrganismPanelHost,
            previewStyles.host,
          ]"
        >
          <EgDataList
            ref="listRef"
            :data-list="dataList"
            :header-height="Number(customize.headerHeight) || 32"
            :column-height="Number(customize.columnHeight) || 66"
            :loading="Boolean(customize.loading)"
            :initing="Boolean(customize.initing)"
          >
            <EgDataListColumn prop="name" label="Name" :width-percent="28" sortable />
            <EgDataListColumn prop="role" label="Role" :width-percent="22" />
            <EgDataListColumn prop="status" label="Status" :width-percent="20" />
            <EgDataListColumn prop="amount" label="Amount" :width-percent="30" align="right" />
            <template #operation>
              <EgBatchBarActionItem type="text" label="Archive" />
            </template>
          </EgDataList>
        </div>
      </template>

      <section :class="shared.section">
        <h2 :class="shared.sectionTitle">EgDataListColumn</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="dataListColumnPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
