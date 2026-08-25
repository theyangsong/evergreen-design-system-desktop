<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { EgSegmented } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildSegmentedUsageSnippet,
  resolveTabLabels,
  segmentedCustomizeControls,
  segmentedCustomizeDefaults,
  segmentedImportCode,
  segmentedPropRows,
} from './tabDocCustomize';

const customize = reactive({
  ...segmentedCustomizeDefaults,
  size: segmentedCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  shape: segmentedCustomizeDefaults.shape as 'circle' | 'square',
  itemWidthMode: segmentedCustomizeDefaults.itemWidthMode as 'adaptive' | 'fixed',
});

const selectedIndex = ref(0);
const labels = computed(() => resolveTabLabels(customize.labels, customize.count));
const usageSnippet = computed(() => buildSegmentedUsageSnippet(customize));

const isFixedItemWidth = computed(() => customize.itemWidthMode === 'fixed');

const panelWidth = computed(() => {
  if (!isFixedItemWidth.value) return undefined;
  const width = Number.parseInt(String(customize.width), 10);
  return Number.isFinite(width) && width > 0 ? `${width}px` : '100%';
});

watch(
  labels,
  (next) => {
    if (selectedIndex.value >= next.length) {
      selectedIndex.value = Math.max(0, next.length - 1);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Segmented"
      :show-doc-title="false"
      component-tag="EgSegmented"
      :import-code="segmentedImportCode"
      :customize-controls="segmentedCustomizeControls"
      :customize-defaults="segmentedCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="segmentedPropRows"
      props-section-id="tab-segmented-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <div :style="isFixedItemWidth && panelWidth ? { width: panelWidth } : undefined">
            <EgSegmented
              v-model="selectedIndex"
              :size="customize.size"
              :shape="customize.shape"
              :item-width-mode="customize.itemWidthMode"
              :width="
                isFixedItemWidth && panelWidth && panelWidth.endsWith('px')
                  ? Number.parseInt(panelWidth, 10)
                  : undefined
              "
              :labels="labels"
            />
          </div>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
