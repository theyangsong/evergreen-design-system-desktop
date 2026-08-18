<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgEndFeedbackCard } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
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

const usageSnippet = computed(() =>
  buildVueSelfClosingSnippet('EgEndFeedbackCard', customize, {
    defaults: endFeedbackCardCustomizeDefaults,
  }),
);

function onResetPreview() {
  previewKey.value += 1;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="EndFeedbackCard"
      :show-doc-title="false"
      component-tag="EgEndFeedbackCard"
      :import-code="endFeedbackCardImportCode"
      :usage-snippet-override="usageSnippet"
      v-model-key=""
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
