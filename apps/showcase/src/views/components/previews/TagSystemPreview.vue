<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildTagSystemUsageSnippet,
  tagImportCode,
  tagSystemCustomizeControls,
  tagSystemCustomizeDefaults,
  tagSystemPropRows,
} from './tagDocCustomize';

const customize = reactive({
  ...tagSystemCustomizeDefaults,
  size: tagSystemCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  systemType: tagSystemCustomizeDefaults.systemType as
    | 'subtle'
    | 'solid-brand'
    | 'solid-red'
    | 'gray'
    | 'stroke-subtle'
    | 'stroke-solid',
});

const usageSnippet = computed(() => buildTagSystemUsageSnippet(customize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="System"
      :show-doc-title="false"
      component-tag="EgTag"
      :import-code="tagImportCode"
      :customize-controls="tagSystemCustomizeControls"
      :customize-defaults="tagSystemCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tagSystemPropRows"
      props-section-id="tag-system-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgTag family="system" :size="customize.size" :system-type="customize.systemType">
            {{ customize.label }}
          </EgTag>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
