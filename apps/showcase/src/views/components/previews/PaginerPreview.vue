<script setup lang="ts">
import { reactive } from 'vue';
import { EgIcon, EgPaginer, EgPaginationItem } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import {
  showcasePaginationSymbolIconName,
} from '@/views/shared/showcaseIcons';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  paginerCustomizeControls,
  paginerCustomizeDefaults,
  paginerPropRows,
} from './organismTemplateDocData';

const customize = reactive({ ...paginerCustomizeDefaults });

const paginationCustomize = reactive({
  label: '1',
  kind: 'number',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Paginer"
      tall-preview
      :show-doc-title="false"
      component-tag="EgPaginer"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="paginerCustomizeControls"
      :customize-defaults="paginerCustomizeDefaults"
      :prop-rows="paginerPropRows"
      props-section-id="paginer-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="organismStyles.previewOrganismWideHost">
          <EgPaginer
            :show-scrollbar="Boolean(customize.showScrollbar)"
            :show-statistics="Boolean(customize.showStatistics)"
            :data-volume="String(customize.dataVolume)"
          >
            <EgPaginationItem kind="symbol" tone="decor">
              <EgIcon :name="showcasePaginationSymbolIconName" fit />
            </EgPaginationItem>
            <EgPaginationItem
              kind="number"
              tone="brand"
              :label="String(paginationCustomize.label)"
            />
            <EgPaginationItem kind="symbol" tone="decor">
              <EgIcon :name="showcasePaginationSymbolIconName" fit />
            </EgPaginationItem>
          </EgPaginer>
        </div>
      </template>

      <CustomizePanel
        v-model="paginationCustomize"
        nested
        title="EgPaginationItem"
        :controls="[
          { kind: 'text', key: 'label', label: '页码 label' },
        ]"
      />
    </ComponentDocLayout>
  </div>
</template>
