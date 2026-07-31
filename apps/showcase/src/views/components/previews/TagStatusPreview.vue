<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildTagStatusUsageSnippet,
  tagImportCode,
  tagStatusCustomizeControls,
  tagStatusCustomizeDefaults,
  tagStatusPropRows,
} from './tagDocCustomize';

const customize = reactive({
  ...tagStatusCustomizeDefaults,
  size: tagStatusCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  status: tagStatusCustomizeDefaults.status as
    | 'danger'
    | 'warning'
    | 'success'
    | 'ready'
    | 'invalid',
});

const usageSnippet = computed(() => buildTagStatusUsageSnippet(customize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Status"
      :show-doc-title="false"
      component-tag="EgTag"
      :import-code="tagImportCode"
      :customize-controls="tagStatusCustomizeControls"
      :customize-defaults="tagStatusCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tagStatusPropRows"
      props-section-id="tag-status-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgTag family="status" :size="customize.size" :status="customize.status">
            {{ customize.label }}
          </EgTag>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
