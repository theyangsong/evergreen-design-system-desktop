<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
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
  flotationTriggerModuleMenuCustomizeControls,
  flotationTriggerModuleMenuDefaults,
  flotationTriggerPropRows,
  flotationTriggerSlotRows,
  isFlotationTriggerModuleMenuKind,
  usesFlotationTriggerComboShell,
  type FlotationTriggerKind,
} from './flotationDocCustomize';

const customize = reactive({
  ...flotationTriggerCustomizeDefaults,
  triggerKind: flotationTriggerCustomizeDefaults.triggerKind as FlotationTriggerKind,
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
  symbolPosition: flotationTriggerCustomizeDefaults.symbolPosition as 'leading' | 'trailing',
});

watch(
  () => customize.triggerKind,
  (kind) => {
    if (kind !== 'module-menu') return;
    customize.label = String(flotationTriggerModuleMenuDefaults.label);
    customize.showReddot = Boolean(flotationTriggerModuleMenuDefaults.showReddot);
    customize.triggerStyle = 'text';
    customize.widthMode = 'trigger';
  },
);

const isModuleMenuKind = computed(() => isFlotationTriggerModuleMenuKind(customize));

const triggerKindPanelTitle = computed(() =>
  isModuleMenuKind.value ? '模块菜单' : '标准下拉框',
);

const triggerKindPanelControls = computed(() =>
  isModuleMenuKind.value
    ? flotationTriggerModuleMenuCustomizeControls
    : flotationTriggerCustomizeControls,
);

const triggerKindRowColumns = computed(() => (isModuleMenuKind.value ? 4 : 5));

const usageSnippet = computed(() => buildFlotationTriggerUsageSnippet(customize));

const previewHostStyle = computed(() => ({
  width: '100%',
  maxWidth: isModuleMenuKind.value ? 'none' : 'var(--scale-50)',
}));

const triggerFixedWidth = computed(() => {
  if (customize.widthMode !== 'fixed') return undefined;
  const parsed = Number.parseInt(String(customize.width ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
});

const triggerProps = computed(() => {
  if (isModuleMenuKind.value) {
    return {
      moduleMenuTitle: true,
      triggerStyle: 'text' as const,
      widthMode: 'trigger' as const,
      label: String(customize.label),
      showReddot: Boolean(customize.showReddot),
      disabled: Boolean(customize.disabled),
      expanded: Boolean(customize.expanded),
    };
  }

  return {
    triggerStyle: customize.triggerStyle,
    size: customize.size,
    widthMode: customize.widthMode,
    width: triggerFixedWidth.value,
    label: String(customize.label),
    disabled: Boolean(customize.disabled),
    showSymbol: Boolean(customize.showSymbol),
    symbolIcon: String(customize.symbolIcon),
    symbolPosition:
      customize.symbolPosition === 'trailing' ? ('trailing' as const) : ('leading' as const),
    showTag: Boolean(customize.showTag),
    tagText: String(customize.tagText),
    tagStatus: customize.tagStatus,
    showMessage: Boolean(customize.showMessage),
    messageText: String(customize.messageText),
    messageType: customize.messageType,
    expanded: Boolean(customize.expanded),
  };
});

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
            :title="triggerKindPanelTitle"
            nested
            embedded
            sequential
            :row-columns="triggerKindRowColumns"
            :controls="triggerKindPanelControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
