<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { EgFlotation } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationBoxPanelControls,
  buildFlotationMenuPanelControls,
  buildFlotationPresetItems,
  buildFlotationUsageSnippet,
  flotationCustomizeDefaults,
  flotationImportCode,
  flotationPropRows,
  flotationSlotRows,
  flotationTriggerKindCustomizeControls,
  flotationTriggerOverviewControls,
  parseFlotationCrossAxisOffset,
  parseFlotationEditBoxIndex,
  parseFlotationItemCount,
  parseFlotationMaxHeight,
  parseFlotationBoxSelectionMode,
  enforceFlotationSingleSelection,
  flotationBoxItemKey,
  flotationDefaultCryptoAsset,
} from './flotationDocCustomize';

const customize = reactive({
  ...flotationCustomizeDefaults,
  triggerKind: flotationCustomizeDefaults.triggerKind as 'standard-dropdown',
  placement: flotationCustomizeDefaults.placement as 'top' | 'bottom' | 'left' | 'right',
  triggerStyle: flotationCustomizeDefaults.triggerStyle as 'subtle' | 'outline' | 'text',
  triggerSize: flotationCustomizeDefaults.triggerSize as 'lg' | 'md' | 'sm' | 'xs',
  widthMode: flotationCustomizeDefaults.widthMode as 'trigger' | 'adaptive' | 'fixed',
  heightMode: flotationCustomizeDefaults.heightMode as 'adaptive' | 'fixed',
  align: flotationCustomizeDefaults.align as 'start' | 'end' | 'center',
  tagStatus: flotationCustomizeDefaults.tagStatus as
    | 'danger'
    | 'warning'
    | 'success'
    | 'ready'
    | 'invalid',
  messageType: flotationCustomizeDefaults.messageType as 'subtle' | 'brand' | 'danger',
});

watch(
  () => customize.itemCount,
  () => {
    customize.editBoxIndex = String(parseFlotationEditBoxIndex(customize));
  },
);

watch(
  () => customize.boxItemType,
  (type) => {
    if (type !== 'image-text') return;
    const count = parseFlotationItemCount(customize);
    for (let n = 1; n <= count; n += 1) {
      customize[flotationBoxItemKey('SymbolIcon', n)] = flotationDefaultCryptoAsset;
    }
  },
);

watch(
  () => {
    const count = parseFlotationItemCount(customize);
    const keys = Array.from({ length: count }, (_, index) =>
      Boolean(customize[flotationBoxItemKey('Checked', index + 1)]),
    );
    return [parseFlotationBoxSelectionMode(customize), ...keys] as const;
  },
  () => enforceFlotationSingleSelection(customize),
);

const usageSnippet = computed(() => buildFlotationUsageSnippet(customize));

const menuPanelControls = computed(() => buildFlotationMenuPanelControls(customize));

const boxPanelControls = computed(() => buildFlotationBoxPanelControls(customize));

const presetItems = computed(() => {
  const count = parseFlotationItemCount(customize);
  return buildFlotationPresetItems(count, customize);
});

const panelWidth = computed(() => {
  if (customize.widthMode !== 'fixed') return undefined;
  return Number.parseInt(String(customize.width), 10) || 280;
});

const panelHeight = computed(() => {
  if (customize.heightMode !== 'fixed') return undefined;
  return Number.parseInt(String(customize.height), 10) || 306;
});

const panelMaxHeight = computed(() => {
  if (customize.heightMode !== 'adaptive') return undefined;
  return parseFlotationMaxHeight(customize);
});

const panelCrossAxisOffset = computed(() => parseFlotationCrossAxisOffset(customize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="flotation"
      title="Combo"
      :show-doc-title="false"
      component-tag="EgFlotation"
      :import-code="flotationImportCode"
      :customize-controls="flotationTriggerKindCustomizeControls"
      :customize-defaults="{ ...flotationCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationPropRows"
      :slot-rows="flotationSlotRows"
      props-section-id="flotation-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.subPreviewWidth, docStyles.previewEffectPanelHost]"
        >
          <EgFlotation
            :placement="customize.placement"
            :cross-axis-offset="panelCrossAxisOffset"
            :trigger-label="String(customize.triggerLabel)"
            :trigger-style="customize.triggerStyle"
            :trigger-size="customize.triggerSize"
            :disabled="Boolean(customize.disabled)"
            :show-symbol="Boolean(customize.showSymbol)"
            :symbol-icon="String(customize.symbolIcon)"
            :show-tag="Boolean(customize.showTag)"
            :tag-text="String(customize.tagText)"
            :tag-status="customize.tagStatus"
            :show-message="Boolean(customize.showMessage)"
            :message-text="String(customize.messageText)"
            :message-type="customize.messageType"
            :show-add="Boolean(customize.showAdd)"
            :add-label="String(customize.addLabel)"
            :width-mode="customize.widthMode"
            :width="panelWidth"
            :align="customize.align"
            :height-mode="customize.heightMode"
            :height="panelHeight"
            :max-height="panelMaxHeight"
            :items="presetItems"
          />
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
            :controls="flotationTriggerOverviewControls"
          />
          <CustomizePanel
            v-model="customize"
            title="菜单 Menu"
            nested
            embedded
            sequential
            :controls="menuPanelControls"
          />
          <CustomizePanel
            v-model="customize"
            title="盒子 Box"
            nested
            embedded
            sequential
            :row-columns="5"
            :controls="boxPanelControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
