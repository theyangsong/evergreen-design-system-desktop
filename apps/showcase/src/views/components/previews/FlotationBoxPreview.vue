<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgFlotationMenuItem } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationBoxUsageSnippet,
  flotationBoxCustomizeControls,
  flotationBoxCustomizeDefaults,
  flotationBoxImportCode,
  flotationBoxPropRows,
  flotationBoxSlotRows,
} from './flotationDocCustomize';

const customize = reactive({
  ...flotationBoxCustomizeDefaults,
  boxType: flotationBoxCustomizeDefaults.boxType as 'text' | 'symbol-text' | 'image-text',
  tagStatus: flotationBoxCustomizeDefaults.tagStatus as
    | 'danger'
    | 'warning'
    | 'success'
    | 'ready'
    | 'invalid',
  messageType: flotationBoxCustomizeDefaults.messageType as 'subtle' | 'brand' | 'danger',
});

const usageSnippet = computed(() => buildFlotationBoxUsageSnippet(customize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="flotation-box"
      title="Box"
      :show-doc-title="false"
      component-tag="EgFlotationMenuItem"
      :import-code="flotationBoxImportCode"
      :customize-controls="flotationBoxCustomizeControls"
      :customize-defaults="{ ...flotationBoxCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationBoxPropRows"
      :slot-rows="flotationBoxSlotRows"
      props-section-id="flotation-box-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <div :style="{ width: '100%', maxWidth: 'var(--scale-50)' }">
            <EgFlotationMenuItem
              :box-type="customize.boxType"
              :label="String(customize.label)"
              :disabled="Boolean(customize.disabled)"
              :show-checkbox="Boolean(customize.showCheckbox)"
              :checked="Boolean(customize.checked)"
              :show-tag="Boolean(customize.showTag)"
              :tag-text="String(customize.tagText)"
              :tag-status="customize.tagStatus"
              :show-reddot="Boolean(customize.showReddot)"
              :show-cascader="Boolean(customize.showCascader)"
              :show-message="Boolean(customize.showMessage)"
              :message-text="String(customize.messageText)"
              :message-type="customize.messageType"
              :symbol-icon="String(customize.symbolIcon)"
              @update:checked="customize.checked = $event"
            />
          </div>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
