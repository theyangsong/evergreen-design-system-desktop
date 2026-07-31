<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgIcon, EgIconButton } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildIconButtonUsageSnippet,
  iconButtonCustomizeControls,
  iconButtonCustomizeDefaults,
  iconButtonImportCode,
} from './buttonDocCustomize';
import { iconButtonDocSymbolName } from './iconButtonDocPreview';
import { iconButtonPropRows, iconButtonSlotRows } from './buttonSubPreviewData';

const iconButtonCustomize = reactive({ ...iconButtonCustomizeDefaults });

const iconButtonUsageSnippet = computed(() => buildIconButtonUsageSnippet(iconButtonCustomize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="iconButtonCustomize"
      title="iCons Container Simple"
      :show-doc-title="false"
      component-tag="EgIconButton"
      :import-code="iconButtonImportCode"
      :customize-controls="iconButtonCustomizeControls"
      :customize-defaults="iconButtonCustomizeDefaults"
      :usage-snippet-override="iconButtonUsageSnippet"
      :prop-rows="iconButtonPropRows"
      :slot-rows="iconButtonSlotRows"
      props-section-id="button-icon-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewButtonHost">
          <EgIconButton
            :shape="iconButtonCustomize.shape as 'rectangular' | 'square' | 'round'"
            :size="iconButtonCustomize.size as 'lg' | 'md' | 'sm' | 'xs'"
            :label="String(iconButtonCustomize.label)"
            :disabled="Boolean(iconButtonCustomize.disabled)"
          >
            <EgIcon :name="iconButtonDocSymbolName" fit />
          </EgIconButton>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
