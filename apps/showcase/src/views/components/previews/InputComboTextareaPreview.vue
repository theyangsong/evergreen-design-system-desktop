<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgComboTextareaItem, EgFormSubmission } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { comboTextareaItemPropRows, comboTextareaItemSlotRows } from './inputSubPreviewData';
import {
  comboImportCode,
  comboTextareaItemCustomizeControls,
  comboTextareaItemCustomizeDefaults,
} from './inputDocCustomize';
import {
  buildFormSubmissionUsageSnippet,
  formSubmissionPropsFromCustomizeState,
} from './feedbackDocCustomize';

const comboTextareaValue = ref('');
const comboTextareaCustomize = reactive({
  ...comboTextareaItemCustomizeDefaults,
  type: comboTextareaItemCustomizeDefaults.type as 'notes' | 'danger' | 'success',
});

const formSubmissionPreviewProps = computed(() =>
  formSubmissionPropsFromCustomizeState(comboTextareaCustomize),
);

const comboTextareaUsageSnippet = computed(() => {
  const openTag = buildVueSelfClosingSnippet('EgComboTextareaItem', comboTextareaCustomize, {
    defaults: comboTextareaItemCustomizeDefaults,
    vModel: 'value',
    omitKeys: ['type', 'text', 'linkLabel', 'showLink'],
  })
    .replace(/\s*\/>$/, '')
    .trim();

  if (!comboTextareaCustomize.feedback) {
    return `${openTag} />`;
  }

  const feedbackInner = buildFormSubmissionUsageSnippet(comboTextareaCustomize)
    .replace(/^/gm, '    ')
    .trim();

  return `${openTag}>\n  <template #feedback>\n    ${feedbackInner}\n  </template>\n</EgComboTextareaItem>`;
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="comboTextareaCustomize"
      title="Combo Textarea Item"
      doc-tier="scenes"
      component-tag="EgComboTextareaItem"
      :import-code="comboImportCode"
      :customize-controls="comboTextareaItemCustomizeControls"
      :customize-defaults="comboTextareaItemCustomizeDefaults"
      :customize-sequential="true"
      :customize-row-columns="5"
      :prop-rows="comboTextareaItemPropRows"
      :slot-rows="comboTextareaItemSlotRows"
      :usage-snippet-override="comboTextareaUsageSnippet"
      props-section-id="input-combo-textarea-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgComboTextareaItem
            v-model="comboTextareaValue"
            :label="String(comboTextareaCustomize.label)"
            :feedback="Boolean(comboTextareaCustomize.feedback)"
            :placeholder="String(comboTextareaCustomize.placeholder)"
          >
            <template v-if="comboTextareaCustomize.feedback" #feedback>
              <EgFormSubmission v-bind="formSubmissionPreviewProps" />
            </template>
          </EgComboTextareaItem>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
