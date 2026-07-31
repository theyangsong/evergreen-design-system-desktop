<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgCheckbox } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildCheckboxUsageSnippet,
  checkboxCustomizeControls,
  checkboxCustomizeDefaults,
  checkboxImportCode,
  checkboxPropRows,
  isCheckboxInteractiveMode,
  mapCheckboxFixedPreviewProps,
} from './toggleDocCustomize';

const customize = reactive({ ...checkboxCustomizeDefaults });
const usageSnippet = computed(() => buildCheckboxUsageSnippet(customize));

const fixedProps = computed(() => mapCheckboxFixedPreviewProps(customize.mode));
const interactive = computed(() => isCheckboxInteractiveMode(customize.mode));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Checkbox"
      :show-doc-title="false"
      component-tag="EgCheckbox"
      :import-code="checkboxImportCode"
      :customize-controls="checkboxCustomizeControls"
      :customize-defaults="checkboxCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="checkboxPropRows"
      props-section-id="toggle-checkbox-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgCheckbox
            v-if="interactive"
            :model-value="Boolean(customize.checked)"
            @update:model-value="(v) => { customize.checked = v; }"
          />
          <EgCheckbox
            v-else
            :model-value="fixedProps!.modelValue"
            :indeterminate="fixedProps!.indeterminate"
            :disabled="fixedProps!.disabled"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
