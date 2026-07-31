<script setup lang="ts">
import { reactive } from 'vue';
import { EgIcon, EgIconButtonPro, EgToolBar } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  toolBarCustomizeControls,
  toolBarCustomizeDefaults,
  toolBarPropRows,
  toolBarSlotRows,
} from './organismTemplateDocData';

const customize = reactive({ ...toolBarCustomizeDefaults });

const iconProCustomize = reactive({
  label: 'Label',
  showReddot: false,
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Tool Bar"
      tall-preview
      :show-doc-title="false"
      component-tag="EgToolBar"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="toolBarCustomizeControls"
      :customize-defaults="toolBarCustomizeDefaults"
      :prop-rows="toolBarPropRows"
      :slot-rows="toolBarSlotRows"
      props-section-id="tool-bar-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="organismStyles.previewOrganismWideHost">
          <EgToolBar
            :title="String(customize.title)"
            :show-back="Boolean(customize.showBack)"
            :show-operation="Boolean(customize.showOperation)"
            :show-divider="Boolean(customize.showDivider)"
            :show-section="Boolean(customize.showSection)"
          >
            <template #functional>
              <EgIconButtonPro
                :label="String(customize.functionalLabel)"
                :show-reddot="Boolean(iconProCustomize.showReddot)"
              >
                <EgIcon name="eds-add" size="sm" />
              </EgIconButtonPro>
            </template>
          </EgToolBar>
        </div>
      </template>

      <CustomizePanel
        v-if="customize.showOperation"
        v-model="iconProCustomize"
        nested
        title="EgIconButtonPro"
        :controls="[
          { kind: 'text', key: 'label', label: '文案 label' },
          { kind: 'boolean', key: 'showReddot', label: '红点 showReddot' },
        ]"
      />
    </ComponentDocLayout>
  </div>
</template>
