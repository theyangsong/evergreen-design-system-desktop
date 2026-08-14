<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgProgress } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import previewPageStyles from './InputPreview.module.css';
import progressStyles from './ProgressPreview.module.css';
import { progressImportCode, progressPropRows } from './progressPreviewData';
import {
  buildProgressUsageSnippet,
  progressCustomizeControls,
  progressCustomizeDefaults,
} from './progressDocCustomize';

const customize = reactive({ ...progressCustomizeDefaults });

const usageSnippet = computed(() => buildProgressUsageSnippet(customize));
</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Progress"
      :show-doc-title="false"
      component-tag="EgProgress"
      :import-code="progressImportCode"
      :customize-controls="progressCustomizeControls"
      :customize-defaults="progressCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="progressPropRows"
      props-section-id="progress-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="[docStyles.previewInputHost, progressStyles.host]">
          <EgProgress
            :value="Number(customize.value) || 0"
            :show-tooltip="customize.showTooltip === true"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
