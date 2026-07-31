<script setup lang="ts">
import { reactive, ref } from 'vue';
import { EgEndFeedbackCard } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  endFeedbackCardCustomizeControls,
  endFeedbackCardCustomizeDefaults,
  endFeedbackCardImportCode,
  endFeedbackCardPropRows,
} from './feedbackDocCustomize';

const customize = reactive({ ...endFeedbackCardCustomizeDefaults });
const previewKey = ref(0);

function onResetPreview() {
  previewKey.value += 1;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="End Feedback Card"
      :show-doc-title="false"
      component-tag="EgEndFeedbackCard"
      :import-code="endFeedbackCardImportCode"
      :customize-controls="endFeedbackCardCustomizeControls"
      :customize-defaults="endFeedbackCardCustomizeDefaults"
      :prop-rows="endFeedbackCardPropRows"
      props-section-id="feedback-end-feedback-card-props"
      @reset-preview="onResetPreview"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgEndFeedbackCard :key="previewKey" :text="String(customize.text)" />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
