<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgFlotationTrigger } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationTriggerUsageSnippet,
  flotationTriggerCustomizeControls,
  flotationTriggerCustomizeDefaults,
  flotationTriggerImportCode,
  flotationTriggerPropRows,
  flotationTriggerSlotRows,
} from './flotationDocCustomize';

const customize = reactive({
  ...flotationTriggerCustomizeDefaults,
  triggerStyle: flotationTriggerCustomizeDefaults.triggerStyle as 'subtle' | 'outline' | 'text',
  widthMode: flotationTriggerCustomizeDefaults.widthMode as 'trigger' | 'adaptive' | 'fixed',
  size: flotationTriggerCustomizeDefaults.size as 'lg' | 'md' | 'sm' | 'xs',
  tagStatus: flotationTriggerCustomizeDefaults.tagStatus as
    | 'danger'
    | 'warning'
    | 'success'
    | 'ready'
    | 'invalid',
  messageType: flotationTriggerCustomizeDefaults.messageType as 'subtle' | 'brand' | 'danger',
});

const usageSnippet = computed(() => buildFlotationTriggerUsageSnippet(customize));

const previewHostStyle = computed(() => ({
  width: '100%',
  maxWidth: 'var(--scale-50)',
}));

const triggerFixedWidth = computed(() => {
  if (customize.widthMode !== 'fixed') return undefined;
  const parsed = Number.parseInt(String(customize.width ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="flotation-trigger"
      title="Trigger"
      :show-doc-title="false"
      component-tag="EgFlotationTrigger"
      :import-code="flotationTriggerImportCode"
      :customize-controls="flotationTriggerCustomizeControls"
      :customize-defaults="{ ...flotationTriggerCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationTriggerPropRows"
      :slot-rows="flotationTriggerSlotRows"
      props-section-id="flotation-trigger-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <div :style="previewHostStyle">
            <EgFlotationTrigger
              :trigger-style="customize.triggerStyle"
              :size="customize.size"
              :width-mode="customize.widthMode"
              :width="triggerFixedWidth"
              :label="String(customize.label)"
              :disabled="Boolean(customize.disabled)"
              :show-symbol="Boolean(customize.showSymbol)"
              :symbol-icon="String(customize.symbolIcon)"
              :show-tag="Boolean(customize.showTag)"
              :tag-text="String(customize.tagText)"
              :tag-status="customize.tagStatus"
              :show-message="Boolean(customize.showMessage)"
              :message-text="String(customize.messageText)"
              :message-type="customize.messageType"
              :expanded="Boolean(customize.expanded)"
            />
          </div>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
