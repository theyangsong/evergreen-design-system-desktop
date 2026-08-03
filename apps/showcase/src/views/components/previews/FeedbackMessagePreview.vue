<script setup lang="ts">
import { reactive } from 'vue';
import { EgMessage } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  messageCustomizeControls,
  messageCustomizeDefaults,
  messageImportCode,
  messagePropRows,
} from './feedbackDocCustomize';

const customize = reactive({
  ...messageCustomizeDefaults,
  type: messageCustomizeDefaults.type as 'subtle' | 'brand' | 'danger',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Message"
      :show-doc-title="false"
      component-tag="EgMessage"
      :import-code="messageImportCode"
      :customize-controls="messageCustomizeControls"
      :customize-defaults="messageCustomizeDefaults"
      :prop-rows="messagePropRows"
      props-section-id="feedback-message-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgMessage
            :type="customize.type"
            :text="String(customize.text)"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
