<script setup lang="ts">
import { reactive } from 'vue';
import { EgToast } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  toastCustomizeControls,
  toastCustomizeDefaults,
  toastImportCode,
  toastPropRows,
} from './feedbackDocCustomize';

const customize = reactive({
  ...toastCustomizeDefaults,
  type: toastCustomizeDefaults.type as 'result' | 'danger',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Toast"
      :show-doc-title="false"
      component-tag="EgToast"
      :import-code="toastImportCode"
      :customize-controls="toastCustomizeControls"
      :customize-defaults="toastCustomizeDefaults"
      :prop-rows="toastPropRows"
      props-section-id="feedback-toast-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgToast :type="customize.type" :text="String(customize.text)" />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
