<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { EgFlotationMenu, EgFlotationMenuItem } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildFlotationBoxKindPanelControls,
  buildFlotationBoxUsageSnippet,
  buildFlotationPresetItems,
  enforceFlotationSingleSelection,
  flotationBoxImportCode,
  flotationBoxKindCustomizeControls,
  flotationBoxDocPropRows,
  flotationBoxDocSlotRows,
  flotationBoxPageCustomizeDefaults,
  getFlotationBoxKindPanelTitle,
  parseFlotationEditBoxIndex,
  parseFlotationItemCount,
  parseFlotationMaxHeight,
  parseFlotationMenuWidth,
  parseFlotationMenuMaxWidth,
  parseFlotationBoxSelectionMode,
  flotationBoxItemKey,
  flotationDefaultCryptoAsset,
} from './flotationDocCustomize';

const customize = reactive({
  ...flotationBoxPageCustomizeDefaults,
  boxKind: flotationBoxPageCustomizeDefaults.boxKind as 'standard-menu' | 'standard-cascade-menu',
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
  () => customize.boxKind,
  (kind) => {
    if (kind !== 'standard-cascade-menu') return;
    const editIndex = parseFlotationEditBoxIndex(customize);
    customize[flotationBoxItemKey('ShowCascader', editIndex)] = true;
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

const usageSnippet = computed(() => buildFlotationBoxUsageSnippet(customize));

const boxPanelTitle = computed(() => getFlotationBoxKindPanelTitle(customize.boxKind));

const boxPanelControls = computed(() => buildFlotationBoxKindPanelControls(customize));

const presetItems = computed(() => {
  const count = parseFlotationItemCount(customize);
  return buildFlotationPresetItems(count, customize);
});

const menuMaxHeight = computed(() => parseFlotationMaxHeight(customize));
const menuWidth = computed(() => parseFlotationMenuWidth(customize));
const menuMaxWidth = computed(() => parseFlotationMenuMaxWidth(customize));

const menuWidthMode = computed(() => (menuWidth.value != null ? 'fixed' : 'adaptive'));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="flotation-box"
      title="Box"
      :show-doc-title="false"
      component-tag="EgFlotationMenu"
      :import-code="flotationBoxImportCode"
      :customize-controls="flotationBoxKindCustomizeControls"
      :customize-defaults="{ ...flotationBoxPageCustomizeDefaults }"
      :usage-snippet-override="usageSnippet"
      :prop-rows="flotationBoxDocPropRows"
      :slot-rows="flotationBoxDocSlotRows"
      props-section-id="flotation-box-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[docStyles.subPreviewWidth, docStyles.previewEffectPanelHost]"
        >
          <EgFlotationMenu
            :width-mode="menuWidthMode"
            :width="menuWidth"
            :max-width="menuMaxWidth"
            height-mode="adaptive"
            :max-height="menuMaxHeight"
            :show-add="Boolean(customize.showAdd)"
            :add-label="String(customize.addLabel)"
          >
            <EgFlotationMenuItem
              v-for="(item, index) in presetItems"
              :key="`${item.label}-${index}`"
              :box-type="item.boxType ?? 'text'"
              :label="item.label"
              :disabled="item.disabled"
              :focused="item.focused"
              :show-checkbox="item.showCheckbox"
              :checked="item.checked"
              :show-tag="Boolean(item.showTag)"
              :tag-text="item.tag ?? 'Tag'"
              :tag-status="item.tagStatus ?? 'danger'"
              :show-reddot="item.showReddot"
              :show-cascader="item.showCascader"
              :show-message="item.showMessage"
              :message-text="item.messageText ?? '0'"
              :message-type="item.messageType ?? 'subtle'"
              :symbol-icon="item.symbolIcon ?? 'eds-add'"
            />
          </EgFlotationMenu>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            :title="boxPanelTitle"
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
