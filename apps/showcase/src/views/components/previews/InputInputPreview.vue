<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgInput } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { inputEventRows, inputPropRows, inputSlotRows } from './inputPreviewData';
import {
  inputCustomizeControls,
  inputCustomizeDefaults,
  inputImportCode,
} from './inputDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
} from './inputPreviewWidth';

const heroValue = ref('');

const inputCustomize = reactive({
  ...inputCustomizeDefaults,
  type: inputCustomizeDefaults.type as 'standard' | 'amount',
  size: inputCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  widthMode: inputCustomizeDefaults.widthMode as 'fixed' | 'full',
});

const inputPreviewStyle = computed(() =>
  previewFixedWidthStyle(inputCustomize.widthMode, inputCustomize.fixedWidth),
);

const inputUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgInput',
    inputCustomize,
    { defaults: inputCustomizeDefaults, vModel: 'value' },
    buildVueSelfClosingSnippet,
  ),
);

function onInputMax() {
  heroValue.value = '100';
}

const inputPreviewUnit = computed(() => {
  const unit = String(inputCustomize.unit ?? '');
  if (unit) return unit;
  return inputCustomize.type === 'amount' ? 'ETH' : undefined;
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="inputCustomize"
      title="Input"
      :show-doc-title="false"
      component-tag="EgInput"
      :import-code="inputImportCode"
      :customize-controls="inputCustomizeControls"
      :customize-defaults="inputCustomizeDefaults"
      :usage-snippet-override="inputUsageSnippet"
      :prop-rows="inputPropRows"
      :event-rows="inputEventRows"
      :slot-rows="inputSlotRows"
      props-section-id="input-props"
      @reset-preview="heroValue = ''"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgInput
            v-if="!inputCustomize.disabled"
            v-model="heroValue"
            :style="inputPreviewStyle"
            :type="inputCustomize.type as 'standard' | 'amount'"
            :size="inputCustomize.size as 'lg' | 'md' | 'sm'"
            :width-mode="inputCustomize.widthMode as 'fixed' | 'full'"
            :placeholder="String(inputCustomize.placeholder)"
            :readonly="Boolean(inputCustomize.readonly)"
            :unit="inputPreviewUnit"
            :clearable="Boolean(inputCustomize.clearable)"
            :show-max="Boolean(inputCustomize.showMax)"
            :max-label="String(inputCustomize.maxLabel)"
            @max="onInputMax"
          />
          <EgInput
            v-else
            model-value="请输入"
            :style="inputPreviewStyle"
            :type="inputCustomize.type as 'standard' | 'amount'"
            :size="inputCustomize.size as 'lg' | 'md' | 'sm'"
            :width-mode="inputCustomize.widthMode as 'fixed' | 'full'"
            :placeholder="String(inputCustomize.placeholder)"
            disabled
            :readonly="Boolean(inputCustomize.readonly)"
            :unit="inputPreviewUnit"
            :clearable="Boolean(inputCustomize.clearable)"
            :show-max="Boolean(inputCustomize.showMax)"
            :max-label="String(inputCustomize.maxLabel)"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
