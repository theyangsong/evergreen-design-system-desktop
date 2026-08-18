<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import TagPreviewGallery from './TagPreviewGallery.vue';
import type { TagSystemType } from '@eds/desktop-components';
import {
  buildTagSystemUsageSnippet,
  tagImportCode,
  tagSystemCustomizeControls,
  tagSystemCustomizeDefaults,
  tagSystemPropRows,
  tagSystemStyleOptions,
} from './tagDocCustomize';

const customize = reactive({
  ...tagSystemCustomizeDefaults,
  size: tagSystemCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  systemType: tagSystemCustomizeDefaults.systemType as TagSystemType,
});

const usageSnippet = computed(() => buildTagSystemUsageSnippet(customize));

function selectSystemType(value: string) {
  customize.systemType = value as TagSystemType;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Standard"
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
        <TagPreviewGallery
          :options="tagSystemStyleOptions"
          :selected="customize.systemType"
          gallery-label="类型"
          @select="selectSystemType"
        >
          <template #main>
            <EgTag family="system" :size="customize.size" :system-type="customize.systemType">
              {{ customize.label }}
            </EgTag>
          </template>
          <template #item="{ value }">
            <EgTag family="system" :size="customize.size" :system-type="value">
              {{ customize.label }}
            </EgTag>
          </template>
        </TagPreviewGallery>
      </template>
    </ComponentDocLayout>
  </div>
</template>
