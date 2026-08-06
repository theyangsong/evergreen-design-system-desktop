<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { EgAnchoredTooltip, EgButton } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import shared from '@/views/shared/showcase.module.css';
import styles from './InputPreview.module.css';
import tooltipStyles from './TooltipPreview.module.css';
import { getComponentRouteSlug } from '@/data/components/navigation';
import {
  anchoredTooltipPropRows,
  buildTooltipPanelKindPageUsageSnippet,
  buildTooltipSectionCustomizeDefaults,
  findTooltipPanelKindSection,
  tooltipCustomizeControls,
  tooltipImportCode,
  tooltipPanelPropsForPreview,
  tooltipPropRows,
  tooltipSlotRows,
  type TooltipPanelKindValue,
} from './tooltipDocCustomize';
import TooltipFlotationTextOverflowPreview from './TooltipFlotationTextOverflowPreview.vue';
import TooltipFlotationParagraphOverflowPreview from './TooltipFlotationParagraphOverflowPreview.vue';
import TooltipFlotationMultiAddressPreview from './TooltipFlotationMultiAddressPreview.vue';

const route = useRoute();

const pageSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const section = computed(() => findTooltipPanelKindSection(pageSlug.value));

const panelKind = computed(
  () => (section.value?.panelKind ?? 'container') as TooltipPanelKindValue,
);

const customize = reactive(buildTooltipSectionCustomizeDefaults('container'));

watch(
  panelKind,
  (kind) => {
    Object.assign(customize, buildTooltipSectionCustomizeDefaults(kind));
  },
  { immediate: true },
);

const usageSnippet = computed(() =>
  buildTooltipPanelKindPageUsageSnippet(panelKind.value, customize),
);

const panelProps = computed(() =>
  tooltipPanelPropsForPreview({ ...customize, panelKind: panelKind.value }),
);

const customizeDefaults = computed(() => buildTooltipSectionCustomizeDefaults(panelKind.value));

const isTextOverflowScenario = computed(
  () =>
    panelKind.value === 'flotation' &&
    String(customize.scenario ?? 'component') === 'text-overflow',
);

const isParagraphOverflowInfoScenario = computed(
  () =>
    panelKind.value === 'flotation' &&
    String(customize.scenario ?? 'component') === 'paragraph-overflow-info',
);

const isMultiAddressScenario = computed(
  () =>
    panelKind.value === 'flotation' &&
    String(customize.scenario ?? 'component') === 'multi-address',
);

const isFlotationPresetScenario = computed(
  () =>
    isTextOverflowScenario.value ||
    isParagraphOverflowInfoScenario.value ||
    isMultiAddressScenario.value,
);

const propsSectionId = computed(() => `${pageSlug.value}-props`);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-if="section"
      v-model:customize-state="customize"
      :anchor-id="section.id"
      :title="section.label"
      :show-doc-title="false"
      component-tag="EgAnchoredTooltip"
      :import-code="tooltipImportCode"
      :customize-controls="tooltipCustomizeControls"
      :customize-defaults="customizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tooltipPropRows"
      :slot-rows="tooltipSlotRows"
      :props-section-id="propsSectionId"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.subPreviewWidth,
            docStyles.previewEffectPanelHost,
            panelKind === 'molde' && tooltipStyles.moldeScene,
            isTextOverflowScenario && tooltipStyles.textOverflowScene,
            isParagraphOverflowInfoScenario && tooltipStyles.paragraphOverflowScene,
            isMultiAddressScenario && tooltipStyles.multiAddressScene,
          ]"
        >
          <TooltipFlotationTextOverflowPreview
            v-if="isTextOverflowScenario"
            :tooltip-trigger="String(customize.tooltipTrigger ?? 'hover') as 'hover' | 'focus'"
          />
          <TooltipFlotationParagraphOverflowPreview v-else-if="isParagraphOverflowInfoScenario" />
          <TooltipFlotationMultiAddressPreview
            v-else-if="isMultiAddressScenario"
            :tooltip-trigger="String(customize.tooltipTrigger ?? 'hover') as 'hover' | 'focus'"
          />
          <EgAnchoredTooltip
            v-else-if="!isFlotationPresetScenario"
            :placement="customize.placement as 'top' | 'bottom' | 'left' | 'right'"
            :trigger="customize.trigger as 'click' | 'hover'"
            :disabled="Boolean(customize.disabled)"
            v-bind="panelProps"
          >
            <EgButton variant="outline">{{ customize.triggerLabel }}</EgButton>
            <template #content>
              <div :class="tooltipStyles.slotDemo">{{ section.label }}</div>
            </template>
          </EgAnchoredTooltip>
        </div>
      </template>

      <section :class="shared.section">
        <h2 :class="shared.sectionTitle">EgAnchoredTooltip</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="anchoredTooltipPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
