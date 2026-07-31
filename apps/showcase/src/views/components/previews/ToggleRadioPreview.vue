<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgRadio } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  isRadioInteractiveMode,
  radioCustomizeControls,
  radioCustomizeDefaults,
  radioImportCode,
  radioPropRows,
} from './toggleDocCustomize';

const customize = reactive({ ...radioCustomizeDefaults });
const interactive = computed(() => isRadioInteractiveMode(customize.mode));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Radio"
      :show-doc-title="false"
      component-tag="EgRadio"
      :import-code="radioImportCode"
      :customize-controls="radioCustomizeControls"
      :customize-defaults="radioCustomizeDefaults"
      :prop-rows="radioPropRows"
      props-section-id="toggle-radio-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgRadio
            v-if="interactive"
            :model-value="Boolean(customize.checked)"
            @update:model-value="(v) => { customize.checked = v; }"
          />
          <EgRadio v-else :model-value="false" disabled />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
