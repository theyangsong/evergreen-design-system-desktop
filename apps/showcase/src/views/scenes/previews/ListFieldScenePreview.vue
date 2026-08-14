<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { findSceneCatalogItem } from '@/data/scenes';
import type { ListFieldSceneSlug } from '@/data/scenes';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from '@/views/components/previews/InputPreview.module.css';
import { getListFieldDocConfig, type ListFieldCustomizePanel } from './listFieldDocCustomize';
import {
  buildCurrencySideAddressControls,
  buildCurrencyAddressTagOnlyControls,
  syncCurrencyAddressesForSymbol,
} from './listFieldCurrencyAddressCustomize';
import { syncCurrencyMinWidthForComboMode } from './listFieldCurrencyShared';
import { syncCurrencyTagCustomize } from './listFieldCurrencyTagCustomize';
import ListFieldPreviewPanel from './ListFieldPreviewPanel.vue';

const props = defineProps<{
  slug: ListFieldSceneSlug;
}>();

const docConfig = computed(() => getListFieldDocConfig(props.slug));

const catalogItem = computed(() => findSceneCatalogItem(props.slug)?.item);

const customize = reactive({ ...docConfig.value.customizeDefaults });

watch(
  () => props.slug,
  (slug) => {
    const defaults = getListFieldDocConfig(slug).customizeDefaults;
    for (const key of Object.keys(customize)) {
      delete customize[key];
    }
    Object.assign(customize, defaults);
  },
);

watch(
  () => {
    if (props.slug === 'list-field-currency') {
      return String(customize.symbol ?? 'ZEC');
    }
    if (
      props.slug === 'list-field-address' &&
      String(customize.displayMode ?? 'single') === 'double'
    ) {
      return String(customize.symbol ?? 'ZEC');
    }
    return '';
  },
  (symbol) => {
    if (!symbol) return;
    syncCurrencyAddressesForSymbol(customize, symbol);
  },
);

watch(
  () =>
    props.slug === 'list-field-currency'
      ? `${String(customize.comboMode ?? '')}:${String(customize.minWidth ?? '')}`
      : '',
  () => {
    if (props.slug === 'list-field-currency') {
      syncCurrencyMinWidthForComboMode(customize);
    }
  },
  { immediate: true },
);

watch(
  customize,
  () => {
    if (props.slug === 'list-field-currency') {
      syncCurrencyTagCustomize(customize);
      return;
    }
    if (props.slug === 'list-field-address') {
      syncCurrencyTagCustomize(customize);
    }
  },
  { immediate: true, deep: true },
);

const usageSnippet = computed(() => docConfig.value.buildUsageSnippet(customize));

function addressPanelControls(side: 'from' | 'to') {
  return buildCurrencySideAddressControls(side, customize);
}

function customizePanelControls(panel: ListFieldCustomizePanel) {
  if (panel.addressTagOnly && panel.addressSide) {
    return buildCurrencyAddressTagOnlyControls(panel.addressSide, 1, customize);
  }
  if (panel.addressSide) {
    return addressPanelControls(panel.addressSide);
  }
  return panel.controls;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      :title="catalogItem?.name ?? 'List Field'"
      :show-doc-title="false"
      :component-tag="docConfig.componentTag"
      :import-code="docConfig.importCode"
      :customize-controls="docConfig.customizeControls"
      :customize-defaults="docConfig.customizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="docConfig.propRows"
      :props-section-id="docConfig.propsSectionId"
      :compact-preview="docConfig.compactPreview"
      :customize-sequential="docConfig.customizeSequential"
      :customize-row-columns="docConfig.customizeRowColumns"
    >
      <template #preview>
        <ListFieldPreviewPanel :slug="slug" :customize="customize" />
      </template>

      <template v-if="docConfig.customizePanels?.length" #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-for="(panel, index) in docConfig.customizePanels"
            v-show="!panel.visibleWhen || panel.visibleWhen(customize)"
            :key="`${panel.title}-${index}`"
            v-model="customize"
            nested
            embedded
            :sequential="panel.sequential"
            :row-columns="panel.rowColumns"
            :title="panel.title"
            :controls="customizePanelControls(panel)"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
