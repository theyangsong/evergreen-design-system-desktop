<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgTextarea } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { textareaEventRows, textareaPropRows, textareaSlotRows } from './inputSubPreviewData';
import {
  textareaCustomizeControls,
  textareaCustomizeDefaults,
  textareaImportCode,
} from './inputDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
} from './inputPreviewWidth';

const textareaValue = ref('');
const textareaCustomize = reactive({ ...textareaCustomizeDefaults });

const textareaPreviewStyle = computed(() =>
  previewFixedWidthStyle(textareaCustomize.widthMode, textareaCustomize.fixedWidth),
);

const textareaUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgTextarea',
    textareaCustomize,
    { defaults: textareaCustomizeDefaults, vModel: 'value' },
    buildVueSelfClosingSnippet,
  ),
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="textareaCustomize"
      title="Textarea"
      doc-tier="molecule"
      :show-doc-title="false"
      component-tag="EgTextarea"
      :import-code="textareaImportCode"
      :customize-controls="textareaCustomizeControls"
      :customize-defaults="textareaCustomizeDefaults"
      :usage-snippet-override="textareaUsageSnippet"
      :prop-rows="textareaPropRows"
      :event-rows="textareaEventRows"
      :slot-rows="textareaSlotRows"
      props-section-id="input-textarea-props"
      @reset-preview="textareaValue = ''"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgTextarea
            v-if="!textareaCustomize.disabled"
            v-model="textareaValue"
            :style="textareaPreviewStyle"
            :placeholder="String(textareaCustomize.placeholder)"
            :width-mode="textareaCustomize.widthMode as 'fixed' | 'full'"
            :readonly="Boolean(textareaCustomize.readonly)"
            :paste-label="String(textareaCustomize.pasteLabel)"
            :clear-label="String(textareaCustomize.clearLabel)"
          />
          <EgTextarea
            v-else
            model-value=""
            :style="textareaPreviewStyle"
            :placeholder="String(textareaCustomize.placeholder)"
            :width-mode="textareaCustomize.widthMode as 'fixed' | 'full'"
            :paste-label="String(textareaCustomize.pasteLabel)"
            :clear-label="String(textareaCustomize.clearLabel)"
            disabled
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
