<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgDivider } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './DividerPreview.module.css';
import previewPageStyles from './InputPreview.module.css';
import { dividerPropRows, dividerImportCode } from './dividerPreviewData';
import {
  buildDividerUsageSnippet,
  dividerCustomizeControls,
  dividerCustomizeDefaults,
} from './dividerDocCustomize';

const dividerCustomize = reactive({
  ...dividerCustomizeDefaults,
  type: dividerCustomizeDefaults.type as 'module' | 'page' | 'navigator',
  direction: dividerCustomizeDefaults.direction as 'horizontal' | 'vertical',
});

const dividerUsageSnippet = computed(() => buildDividerUsageSnippet(dividerCustomize));

const previewHostClass = computed(() =>
  dividerCustomize.direction === 'vertical'
    ? [docStyles.previewInputHost, styles.verticalHost]
    : [docStyles.previewInputHost, styles.horizontalHost],
);
</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="dividerCustomize"
      title="Divider"
      :show-doc-title="false"
      component-tag="EgDivider"
      :import-code="dividerImportCode"
      :customize-controls="dividerCustomizeControls"
      :customize-defaults="dividerCustomizeDefaults"
      :usage-snippet-override="dividerUsageSnippet"
      :prop-rows="dividerPropRows"
      props-section-id="divider-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="previewHostClass">
          <EgDivider
            :type="dividerCustomize.type"
            :direction="dividerCustomize.direction"
            :hide="Boolean(dividerCustomize.hide)"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
