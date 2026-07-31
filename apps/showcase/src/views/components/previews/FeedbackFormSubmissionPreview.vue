<script setup lang="ts">
import { reactive } from 'vue';
import { EgFormSubmission } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  formSubmissionCustomizeControls,
  formSubmissionCustomizeDefaults,
  formSubmissionImportCode,
  formSubmissionPropRows,
} from './feedbackDocCustomize';

const customize = reactive({
  ...formSubmissionCustomizeDefaults,
  type: formSubmissionCustomizeDefaults.type as 'notes' | 'danger' | 'success',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Form Submission"
      :show-doc-title="false"
      component-tag="EgFormSubmission"
      :import-code="formSubmissionImportCode"
      :customize-controls="formSubmissionCustomizeControls"
      :customize-defaults="formSubmissionCustomizeDefaults"
      :prop-rows="formSubmissionPropRows"
      props-section-id="feedback-form-submission-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgFormSubmission
            :type="customize.type"
            :text="String(customize.text)"
            :link-label="String(customize.linkLabel)"
            :show-link="Boolean(customize.showLink)"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
