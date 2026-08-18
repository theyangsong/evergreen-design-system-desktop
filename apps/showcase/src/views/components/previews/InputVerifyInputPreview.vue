<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgVerifyInput } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { verifyInputEventRows, verifyInputPropRows } from './inputSubPreviewData';
import {
  searchImportCode,
  verifyInputCustomizeControls,
  verifyInputCustomizeDefaults,
} from './inputDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
} from './inputPreviewWidth';

const verifyInputValue = ref('');
const verifyInputCustomize = reactive({
  ...verifyInputCustomizeDefaults,
  widthMode: verifyInputCustomizeDefaults.widthMode as 'fixed' | 'full',
});

const verifyInputPreviewStyle = computed(() =>
  previewFixedWidthStyle(verifyInputCustomize.widthMode, verifyInputCustomize.fixedWidth),
);

const verifyInputUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgVerifyInput',
    verifyInputCustomize,
    { defaults: verifyInputCustomizeDefaults, vModel: 'code' },
    buildVueSelfClosingSnippet,
  ),
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="verifyInputCustomize"
      title="Verify Input"
      doc-tier="scenes"
      :show-doc-title="false"
      component-tag="EgVerifyInput"
      :import-code="searchImportCode"
      :customize-controls="verifyInputCustomizeControls"
      :customize-defaults="verifyInputCustomizeDefaults"
      :usage-snippet-override="verifyInputUsageSnippet"
      :prop-rows="verifyInputPropRows"
      :event-rows="verifyInputEventRows"
      props-section-id="input-verify-input-props"
      @reset-preview="verifyInputValue = ''"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgVerifyInput
            v-if="!verifyInputCustomize.disabled"
            v-model="verifyInputValue"
            :style="verifyInputPreviewStyle"
            :width-mode="verifyInputCustomize.widthMode as 'fixed' | 'full'"
            :readonly="Boolean(verifyInputCustomize.readonly)"
          />
          <EgVerifyInput
            v-else
            model-value=""
            :style="verifyInputPreviewStyle"
            :width-mode="verifyInputCustomize.widthMode as 'fixed' | 'full'"
            disabled
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
