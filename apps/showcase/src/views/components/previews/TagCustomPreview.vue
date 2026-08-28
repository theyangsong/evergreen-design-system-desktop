<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import TagPreviewGallery from './TagPreviewGallery.vue';
import type { TagCustomStyle } from '@eds/desktop-components';
import {
  buildTagCustomUsageSnippet,
  tagImportCode,
  tagCustomCustomizeControls,
  tagCustomCustomizeDefaults,
  tagCustomGalleryOptions,
  tagCustomPropRows,
} from './tagDocCustomize';

const customize = reactive({
  ...tagCustomCustomizeDefaults,
  size: tagCustomCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  customStyle: tagCustomCustomizeDefaults.customStyle as TagCustomStyle,
});

const usageSnippet = computed(() => buildTagCustomUsageSnippet(customize));

function selectCustomStyle(value: string) {
  customize.customStyle = value as TagCustomStyle;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Palette"
      :show-doc-title="false"
      component-tag="EgTag"
      :import-code="tagImportCode"
      :customize-controls="tagCustomCustomizeControls"
      :customize-defaults="tagCustomCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tagCustomPropRows"
      props-section-id="tag-palette-props"
    >
      <template #preview>
        <TagPreviewGallery
          :options="tagCustomGalleryOptions"
          :selected="customize.customStyle"
          gallery-label="竖线色"
          @select="selectCustomStyle"
        >
          <template #main>
            <EgTag family="custom" :size="customize.size" :custom-style="customize.customStyle">
              {{ customize.label }}
            </EgTag>
          </template>
          <template #item="{ value }">
            <EgTag family="custom" :size="customize.size" :custom-style="value">
              {{ customize.label }}
            </EgTag>
          </template>
        </TagPreviewGallery>
      </template>
    </ComponentDocLayout>
  </div>
</template>
