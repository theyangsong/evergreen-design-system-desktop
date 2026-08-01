<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgComboInputItem, EgFlotationTrigger, EgFormSubmission } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationTriggerUsageSnippet,
  flotationTriggerCustomizeControls,
  flotationTriggerCustomizeDefaults,
  flotationTriggerImportCode,
  flotationTriggerKindCustomizeControls,
  flotationTriggerPropRows,
  flotationTriggerSlotRows,
  usesFlotationTriggerComboShell,
} from './flotationDocCustomize';

const customize = reactive({
  ...flotationTriggerCustomizeDefaults,
  triggerKind: flotationTriggerCustomizeDefaults.triggerKind as 'standard-dropdown',
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
  type: flotationTriggerCustomizeDefaults.type as 'notes' | 'danger' | 'success',
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

const triggerProps = computed(() => ({
  triggerStyle: customize.triggerStyle,
  size: customize.size,
  widthMode: customize.widthMode,
  width: triggerFixedWidth.value,
  label: String(customize.label),
  disabled: Boolean(customize.disabled),
  showSymbol: Boolean(customize.showSymbol),
  symbolIcon: String(customize.symbolIcon),
  showTag: Boolean(customize.showTag),
  tagText: String(customize.tagText),
  tagStatus: customize.tagStatus,
  showMessage: Boolean(customize.showMessage),
  messageText: String(customize.messageText),
  messageType: customize.messageType,
  expanded: Boolean(customize.expanded),
}));

const usesComboShell = computed(() => usesFlotationTriggerComboShell(customize));
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
      :customize-controls="flotationTriggerKindCustomizeControls"
      :customize-defaults="{ ...flotationTriggerCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationTriggerPropRows"
      :slot-rows="flotationTriggerSlotRows"
      props-section-id="flotation-trigger-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <div :style="previewHostStyle">
            <EgComboInputItem
              v-if="usesComboShell"
              :label="customize.showFieldLabel ? String(customize.fieldLabel) : ''"
              :feedback="Boolean(customize.feedback)"
            >
              <EgFlotationTrigger v-bind="triggerProps" />
              <template v-if="customize.feedback" #feedback>
                <EgFormSubmission
                  :type="customize.type"
                  :text="String(customize.text)"
                  :link-label="String(customize.linkLabel)"
                  :show-link="Boolean(customize.showLink)"
                />
              </template>
            </EgComboInputItem>
            <EgFlotationTrigger v-else v-bind="triggerProps" />
          </div>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            title="标准下拉框"
            nested
            embedded
            sequential
            :row-columns="5"
            :controls="flotationTriggerCustomizeControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
