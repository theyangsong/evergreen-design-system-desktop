<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { EgFlotation } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import tooltipStyles from './TooltipPreview.module.css';
import {
  buildFlotationBoxPanelControls,
  buildFlotationMenuPanelControls,
  buildFlotationPresetItems,
  buildFlotationUsageSnippet,
  flotationCustomizeDefaults,
  flotationImportCode,
  flotationPropRows,
  flotationSlotRows,
  flotationTriggerPanelControls,
  parseFlotationEditBoxIndex,
  parseFlotationItemCount,
} from './flotationDocCustomize';

const customize = reactive({
  ...flotationCustomizeDefaults,
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
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="flotation"
      title="Flotation"
      :show-doc-title="false"
      component-tag="EgFlotation"
      :import-code="flotationImportCode"
      :customize-controls="[]"
      :customize-defaults="{ ...flotationCustomizeDefaults }"
      :show-customize="true"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationPropRows"
      :slot-rows="flotationSlotRows"
      props-section-id="flotation-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.subPreviewWidth, tooltipStyles.previewHost, tooltipStyles.anchoredScene]"
        >
          <EgFlotation
            :placement="customize.placement"
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
            :items="presetItems"
          />
        </div>
      </template>

      <template #customize-after>
        <CustomizePanel
          v-model="customize"
          title="触发器 Trigger"
          nested
          sequential
          :controls="flotationTriggerPanelControls"
        />
        <CustomizePanel
          v-model="customize"
          title="菜单 Menu"
          nested
          sequential
          :controls="menuPanelControls"
        />
        <CustomizePanel
          v-model="customize"
          title="盒子 Box"
          nested
          sequential
          :controls="boxPanelControls"
        />
      </template>
    </ComponentDocLayout>
  </div>
</template>
