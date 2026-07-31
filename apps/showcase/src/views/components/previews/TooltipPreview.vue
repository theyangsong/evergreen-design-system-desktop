<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgTooltip, EgAnchoredTooltip, EgButton } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import shared from '@/views/shared/showcase.module.css';
import styles from './InputPreview.module.css';
import tooltipStyles from './TooltipPreview.module.css';
import {
  anchoredTooltipPropRows,
  buildTooltipUsageSnippet,
  tooltipCustomizeControls,
  tooltipCustomizeDefaults,
  tooltipImportCode,
  tooltipPanelPropsForPreview,
  tooltipPropRows,
  tooltipSlotRows,
} from './tooltipDocCustomize';

const customize = reactive({
  ...tooltipCustomizeDefaults,
  previewMode: tooltipCustomizeDefaults.previewMode as 'anchored' | 'panel',
  panelKind: tooltipCustomizeDefaults.panelKind as 'flotation' | 'popup',
  widthMode: tooltipCustomizeDefaults.widthMode as 'fixed' | 'adaptive',
  placement: tooltipCustomizeDefaults.placement as 'top' | 'bottom' | 'left' | 'right',
  trigger: tooltipCustomizeDefaults.trigger as 'click' | 'hover',
});

const usageSnippet = computed(() => buildTooltipUsageSnippet(customize));

const docComponentTag = computed(() =>
  customize.previewMode === 'panel' ? 'EgTooltip' : 'EgAnchoredTooltip',
);

const panelProps = computed(() => tooltipPanelPropsForPreview(customize));

const previewHostClass = computed(() => [
  docStyles.subPreviewWidth,
  tooltipStyles.previewHost,
  customize.previewMode === 'anchored' ? tooltipStyles.anchoredScene : tooltipStyles.panelScene,
]);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="tooltip"
      title="Tooltip"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="tooltipImportCode"
      :customize-controls="tooltipCustomizeControls"
      :customize-defaults="{ ...tooltipCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tooltipPropRows"
      :slot-rows="tooltipSlotRows"
      props-section-id="tooltip-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="previewHostClass">
          <EgAnchoredTooltip
            v-if="customize.previewMode === 'anchored'"
            :placement="customize.placement"
            :trigger="customize.trigger"
            :disabled="Boolean(customize.disabled)"
            v-bind="panelProps"
          >
            <EgButton tone="sameWhite" size="lg">{{ customize.triggerLabel }}</EgButton>
            <template #content>
              <div :class="tooltipStyles.slotDemo">面板内容 #content</div>
            </template>
          </EgAnchoredTooltip>
          <EgTooltip v-else v-bind="panelProps">
            <div :class="tooltipStyles.slotDemo">面板 default slot</div>
          </EgTooltip>
        </div>
      </template>

      <section :class="shared.section">
        <h2 :class="shared.sectionTitle">EgAnchoredTooltip</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="anchoredTooltipPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
