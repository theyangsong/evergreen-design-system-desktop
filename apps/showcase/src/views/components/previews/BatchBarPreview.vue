<script setup lang="ts">
import { reactive } from 'vue';
import { EgBatchBar } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  batchBarActionPropRows,
  batchBarCustomizeControls,
  batchBarCustomizeDefaults,
  batchBarPropRows,
} from './organismTemplateDocData';

const customize = reactive({ ...batchBarCustomizeDefaults });

const actionCustomize = reactive({
  actionLabel: 'Label',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Batch Bar"
      tall-preview
      :show-doc-title="false"
      component-tag="EgBatchBar"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="batchBarCustomizeControls"
      :customize-defaults="batchBarCustomizeDefaults"
      :prop-rows="batchBarPropRows"
      props-section-id="batch-bar-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="[docStyles.previewInputHost, organismStyles.previewOrganismPanelHost]">
          <EgBatchBar
            :selected-count="customize.selectedCount"
            :count-suffix="String(customize.countSuffix)"
            :action-label="String(actionCustomize.actionLabel)"
          />
        </div>
      </template>

      <CustomizePanel
        v-model="actionCustomize"
        nested
        title="EgBatchBarActionItem"
        :controls="[{ kind: 'text', key: 'actionLabel', label: 'Text 文案 label' }]"
      />
    </ComponentDocLayout>
  </div>
</template>
