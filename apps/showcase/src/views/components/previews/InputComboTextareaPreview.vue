<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgComboTextareaItem, EgFormSubmission } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
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
  formSubmissionCustomizeControls,
  formSubmissionCustomizeDefaults,
} from './feedbackDocCustomize';

const comboTextareaValue = ref('');
const comboTextareaCustomize = reactive({ ...comboTextareaItemCustomizeDefaults });

const formSubmissionCustomize = reactive({
  ...formSubmissionCustomizeDefaults,
  type: formSubmissionCustomizeDefaults.type as 'notes' | 'danger' | 'success',
});

const comboTextareaUsageSnippet = computed(() => {
  const openTag = buildVueSelfClosingSnippet('EgComboTextareaItem', comboTextareaCustomize, {
    defaults: comboTextareaItemCustomizeDefaults,
    vModel: 'value',
  })
    .replace(/\s*\/>$/, '')
    .trim();

  if (!comboTextareaCustomize.feedback) {
    return `${openTag} />`;
  }

  return `${openTag}>\n  <template #feedback>\n    <EgFormSubmission type="${formSubmissionCustomize.type}" text="${String(formSubmissionCustomize.text)}" />\n  </template>\n</EgComboTextareaItem>`;
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
              <EgFormSubmission
                :type="formSubmissionCustomize.type"
                :text="String(formSubmissionCustomize.text)"
                :link-label="String(formSubmissionCustomize.linkLabel)"
                :show-link="Boolean(formSubmissionCustomize.showLink)"
              />
            </template>
          </EgComboTextareaItem>
        </div>
      </template>

      <CustomizePanel
        v-if="comboTextareaCustomize.feedback"
        v-model="formSubmissionCustomize"
        nested
        title="EgFormSubmission"
        :controls="formSubmissionCustomizeControls"
      />
    </ComponentDocLayout>
  </div>
</template>
