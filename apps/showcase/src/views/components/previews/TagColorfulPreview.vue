<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildTagColorfulUsageSnippet,
  tagImportCode,
  tagColorfulCustomizeControls,
  tagColorfulCustomizeDefaults,
  tagColorfulPropRows,
} from './tagDocCustomize';

import type { TagColorfulStyle } from '@eds/desktop-components';

const customize = reactive({
  ...tagColorfulCustomizeDefaults,
  size: tagColorfulCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  colorfulStyle: tagColorfulCustomizeDefaults.colorfulStyle as TagColorfulStyle,
});

const usageSnippet = computed(() => buildTagColorfulUsageSnippet(customize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Colorful"
      :show-doc-title="false"
      component-tag="EgTag"
      :import-code="tagImportCode"
      :customize-controls="tagColorfulCustomizeControls"
      :customize-defaults="tagColorfulCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tagColorfulPropRows"
      props-section-id="tag-colorful-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgTag
            family="colorful"
            :size="customize.size"
            :colorful-style="customize.colorfulStyle"
          >
            {{ customize.label }}
          </EgTag>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
