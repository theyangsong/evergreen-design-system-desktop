<script setup lang="ts">
import { reactive } from 'vue';
import { EgPopup, EgReminder } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  popupCustomizeControls,
  popupCustomizeDefaults,
  popupPropRows,
} from './organismTemplateDocData';

const customize = reactive({
  ...popupCustomizeDefaults,
  uses: popupCustomizeDefaults.uses as 'detail' | 'reminder' | 'verify',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Popup"
      :show-doc-title="false"
      component-tag="EgPopup"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="popupCustomizeControls"
      :customize-defaults="popupCustomizeDefaults"
      :prop-rows="popupPropRows"
      props-section-id="popup-props"
      tall-preview
    >
      <template #preview>
        <div class="desktopTokens" :class="organismStyles.previewOrganismPopupHost">
          <EgPopup :uses="customize.uses">
            <EgReminder v-if="customize.uses === 'reminder'" type="info" />
            <div
              v-else
              :style="{
                minHeight: 'var(--scale-30)',
                padding: 'var(--spacing-4)',
                color: 'var(--text-base-secondary)',
                fontSize: 'var(--eds-body-small-size)',
              }"
            >
              {{ customize.uses }} 内容槽
            </div>
          </EgPopup>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
