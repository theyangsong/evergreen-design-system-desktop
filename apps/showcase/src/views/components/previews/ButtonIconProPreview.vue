<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgIcon, EgIconButtonPro } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildIconButtonProUsageSnippet,
  iconButtonProCustomizeControls,
  iconButtonProCustomizeDefaults,
  iconButtonProImportCode,
  iconButtonProNestedRowColumns,
} from './buttonDocCustomize';
import { iconButtonProPropRows, iconButtonProSlotRows } from './buttonSubPreviewData';

const iconButtonProCustomize = reactive({ ...iconButtonProCustomizeDefaults });

const iconButtonProUsageSnippet = computed(() =>
  buildIconButtonProUsageSnippet(iconButtonProCustomize),
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="iconButtonProCustomize"
      title="IconContainerPro"
      :show-doc-title="false"
      component-tag="EgIconButtonPro"
      :import-code="iconButtonProImportCode"
      :customize-controls="iconButtonProCustomizeControls"
      :customize-defaults="iconButtonProCustomizeDefaults"
      :customize-sequential="true"
      :customize-row-columns="iconButtonProNestedRowColumns"
      :usage-snippet-override="iconButtonProUsageSnippet"
      :prop-rows="iconButtonProPropRows"
      :slot-rows="iconButtonProSlotRows"
      props-section-id="button-icon-pro-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewButtonHost">
          <EgIconButtonPro
            :label="String(iconButtonProCustomize.label)"
            :badge="iconButtonProCustomize.badge"
            :show-badge="Boolean(iconButtonProCustomize.showBadge)"
            :show-reddot="Boolean(iconButtonProCustomize.showReddot)"
            :disabled="Boolean(iconButtonProCustomize.disabled)"
          >
            <EgIcon :name="String(iconButtonProCustomize.symbol)" fit />
          </EgIconButtonPro>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
