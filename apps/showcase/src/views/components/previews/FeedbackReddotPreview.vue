<script setup lang="ts">
import { EgReddot } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  reddotCustomizeControls,
  reddotCustomizeDefaults,
  reddotImportCode,
  reddotPropRows,
} from './feedbackDocCustomize';
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      title="Reddot"
      :show-doc-title="false"
      component-tag="EgReddot"
      :import-code="reddotImportCode"
      :customize-controls="reddotCustomizeControls"
      :customize-defaults="reddotCustomizeDefaults"
      :prop-rows="reddotPropRows"
      props-section-id="feedback-reddot-props"
      :show-customize="false"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgReddot />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
