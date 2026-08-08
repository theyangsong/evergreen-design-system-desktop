<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  EgComboInputItem,
  EgComboTextareaItem,
  EgFormSubmission,
  EgInput,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import shared from '@/views/shared/showcase.module.css';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import group from '@/views/shared/previewGroup.module.css';
import styles from './InputPreview.module.css';
import {
  comboInputItemPropRows,
  comboInputItemSlotRows,
  comboTextareaItemPropRows,
  comboTextareaItemSlotRows,
} from './inputSubPreviewData';
import {
  comboImportCode,
  comboInputItemCustomizeControls,
  comboInputItemCustomizeDefaults,
  comboInputItemShellProps,
  comboNestedInputProps,
  comboTextareaItemCustomizeControls,
  comboTextareaItemCustomizeDefaults,
  inputCustomizeDefaults,
} from './inputDocCustomize';
import {
  formSubmissionCustomizeControls,
  formSubmissionCustomizeDefaults,
} from './feedbackDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
} from './inputPreviewWidth';

const comboInputValue = ref('');
const comboTextareaValue = ref('');

const comboInputCustomize = reactive({
  ...comboInputItemCustomizeDefaults,
  type: comboInputItemCustomizeDefaults.type as 'standard' | 'amount',
  size: comboInputItemCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  widthMode: comboInputItemCustomizeDefaults.widthMode as 'fixed' | 'full',
});

const comboTextareaCustomize = reactive({ ...comboTextareaItemCustomizeDefaults });

const formSubmissionCustomize = reactive({
  ...formSubmissionCustomizeDefaults,
  type: formSubmissionCustomizeDefaults.type as 'notes' | 'danger' | 'success',
});

const comboInputPreviewStyle = computed(() =>
  previewFixedWidthStyle(comboInputCustomize.widthMode, comboInputCustomize.fixedWidth),
);

const comboInputPreviewHostClass = computed(() =>
  comboInputCustomize.widthMode === 'full'
    ? docStyles.previewInputHost
    : docStyles.subPreviewWidth,
);

const comboInputPreviewUnit = computed(() => {
  const unit = String(comboInputCustomize.unit ?? '');
  if (unit) return unit;
  return comboInputCustomize.type === 'amount' ? 'ETH' : undefined;
});

function onComboInputMax() {
  comboInputValue.value = '100';
}

const comboInputUsageSnippet = computed(() => {
  const shellDefaults = {
    label: comboInputItemCustomizeDefaults.label,
    feedback: comboInputItemCustomizeDefaults.feedback,
  };
  const openTag = buildVueSelfClosingSnippet(
    'EgComboInputItem',
    comboInputItemShellProps(comboInputCustomize),
    { defaults: shellDefaults },
  )
    .replace(/\s*\/>$/, '')
    .trim();

  const inner = buildWidthModeUsageSnippet(
    'EgInput',
    comboNestedInputProps(comboInputCustomize),
    { defaults: inputCustomizeDefaults, vModel: 'value' },
    buildVueSelfClosingSnippet,
  );

  const feedbackSlot = comboInputCustomize.feedback
    ? `\n  <template #feedback>\n    <EgFormSubmission type="${formSubmissionCustomize.type}" text="${String(formSubmissionCustomize.text)}" />\n  </template>`
    : '';

  return `${openTag}>\n  ${inner}${feedbackSlot}\n</EgComboInputItem>`;
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
    <div :class="group.previewGroupSegment">
      <ComponentDocLayout
        v-model:customize-state="comboInputCustomize"
        title="Combo/Input Item"
        component-tag="EgComboInputItem"
        :import-code="comboImportCode"
        :customize-controls="comboInputItemCustomizeControls"
        :customize-defaults="comboInputItemCustomizeDefaults"
        :prop-rows="comboInputItemPropRows"
        :slot-rows="comboInputItemSlotRows"
        :usage-snippet-override="comboInputUsageSnippet"
        :show-props="false"
        @reset-preview="comboInputValue = ''"
      >
        <template #preview>
          <div class="desktopTokens" :class="comboInputPreviewHostClass">
            <EgComboInputItem
              :label="String(comboInputCustomize.label)"
              :feedback="Boolean(comboInputCustomize.feedback)"
            >
              <EgInput
                v-if="!comboInputCustomize.disabled"
                v-model="comboInputValue"
                :style="comboInputPreviewStyle"
                :type="comboInputCustomize.type as 'standard' | 'amount'"
                :size="comboInputCustomize.size as 'lg' | 'md' | 'sm'"
                :width-mode="comboInputCustomize.widthMode as 'fixed' | 'full'"
                :placeholder="String(comboInputCustomize.placeholder)"
                :readonly="Boolean(comboInputCustomize.readonly)"
                :unit="comboInputPreviewUnit"
                :clearable="Boolean(comboInputCustomize.clearable)"
                :show-max="Boolean(comboInputCustomize.showMax)"
                :max-label="String(comboInputCustomize.maxLabel)"
                @max="onComboInputMax"
              />
              <EgInput
                v-else
                model-value="请输入"
                :style="comboInputPreviewStyle"
                :type="comboInputCustomize.type as 'standard' | 'amount'"
                :size="comboInputCustomize.size as 'lg' | 'md' | 'sm'"
                :width-mode="comboInputCustomize.widthMode as 'fixed' | 'full'"
                :placeholder="String(comboInputCustomize.placeholder)"
                disabled
                :readonly="Boolean(comboInputCustomize.readonly)"
                :unit="comboInputPreviewUnit"
                :clearable="Boolean(comboInputCustomize.clearable)"
                :show-max="Boolean(comboInputCustomize.showMax)"
                :max-label="String(comboInputCustomize.maxLabel)"
              />
              <template v-if="comboInputCustomize.feedback" #feedback>
                <EgFormSubmission
                  :type="formSubmissionCustomize.type"
                  :text="String(formSubmissionCustomize.text)"
                  :link-label="String(formSubmissionCustomize.linkLabel)"
                  :show-link="Boolean(formSubmissionCustomize.showLink)"
                />
              </template>
            </EgComboInputItem>
          </div>
        </template>

        <CustomizePanel
          v-if="comboInputCustomize.feedback"
          v-model="formSubmissionCustomize"
          nested
          title="EgFormSubmission"
          :controls="formSubmissionCustomizeControls"
        />
      </ComponentDocLayout>
    </div>

    <div :class="group.previewGroupSegment">
      <ComponentDocLayout
        v-model:customize-state="comboTextareaCustomize"
        title="Combo/Textarea Input Item"
        component-tag="EgComboTextareaItem"
        :import-code="comboImportCode"
        :customize-controls="comboTextareaItemCustomizeControls"
        :customize-defaults="comboTextareaItemCustomizeDefaults"
        :prop-rows="comboTextareaItemPropRows"
        :slot-rows="comboTextareaItemSlotRows"
        :usage-snippet-override="comboTextareaUsageSnippet"
        :show-props="false"
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

    <section id="input-combo-props" :class="[shared.section, group.previewGroupSegment]">
      <h2 :class="shared.sectionTitle">Props</h2>
      <h3 :class="docStyles.propGroupTitle">Combo/Input Item</h3>
      <PropsDocTables
        bare
        :show-title="false"
        :prop-rows="comboInputItemPropRows"
        :slot-rows="comboInputItemSlotRows"
      />
      <h3 :class="docStyles.propGroupTitle">Combo/Textarea Input Item</h3>
      <PropsDocTables
        bare
        :show-title="false"
        :prop-rows="comboTextareaItemPropRows"
        :slot-rows="comboTextareaItemSlotRows"
      />
      <p :class="docStyles.comboFeedbackNote">
        Feedback 槽可嵌套
        <code>EgFormSubmission</code>
        ；见 Form Submission 文档页。
      </p>
    </section>
  </div>
</template>
