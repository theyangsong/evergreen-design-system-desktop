<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { EgSegmentedControl } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildSegmentedControlUsageSnippet,
  resolveTabLabels,
  segmentedControlCustomizeControls,
  segmentedControlCustomizeDefaults,
  segmentedControlImportCode,
  segmentedControlPropRows,
} from './tabDocCustomize';

const customize = reactive({
  ...segmentedControlCustomizeDefaults,
  size: segmentedControlCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  shape: segmentedControlCustomizeDefaults.shape as 'circle' | 'square',
});

const selectedIndex = ref(0);
const labels = computed(() => resolveTabLabels(customize.labels, customize.count));
const usageSnippet = computed(() => buildSegmentedControlUsageSnippet(customize));

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
      title="Segmented Control"
      :show-doc-title="false"
      component-tag="EgSegmentedControl"
      :import-code="segmentedControlImportCode"
      :customize-controls="segmentedControlCustomizeControls"
      :customize-defaults="segmentedControlCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="segmentedControlPropRows"
      props-section-id="tab-segmented-control-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgSegmentedControl
            v-model="selectedIndex"
            :size="customize.size"
            :shape="customize.shape"
            :labels="labels"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
