<script setup lang="ts">
import { computed, reactive } from 'vue';
import {
  EgComboActionFlotation,
  EgComboActionPage,
  EgComboActionPopupWindow,
  EgComboActionSkid,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import shared from '@/views/shared/showcase.module.css';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import group from '@/views/shared/previewGroup.module.css';
import styles from './InputPreview.module.css';
import {
  comboEventRows,
  comboPropRows,
  comboSlotRows,
} from './comboPreviewData';
import {
  buildComboActionFlotationUsageSnippet,
  buildComboActionPageUsageSnippet,
  buildComboActionPopupUsageSnippet,
  buildComboActionSkidUsageSnippet,
  comboActionFlotationCustomizeControls,
  comboActionFlotationCustomizeDefaults,
  comboActionFlotationImportCode,
  comboActionPageCustomizeControls,
  comboActionPageCustomizeDefaults,
  comboActionPageImportCode,
  comboActionPopupCustomizeControls,
  comboActionPopupCustomizeDefaults,
  comboActionPopupImportCode,
  comboActionSkidCustomizeControls,
  comboActionSkidCustomizeDefaults,
  comboActionSkidImportCode,
} from './buttonDocCustomize';

const comboSkidCustomize = reactive({
  ...comboActionSkidCustomizeDefaults,
  tone: comboActionSkidCustomizeDefaults.tone as 'brand' | 'decor' | 'danger',
});

const comboPopupCustomize = reactive({
  ...comboActionPopupCustomizeDefaults,
  tone: comboActionPopupCustomizeDefaults.tone as 'brand' | 'decor',
  count: comboActionPopupCustomizeDefaults.count as 1 | 2,
});

const comboFlotationCustomize = reactive({
  ...comboActionFlotationCustomizeDefaults,
  tone: comboActionFlotationCustomizeDefaults.tone as 'brand' | 'decor',
});

const comboPageCustomize = reactive({
  ...comboActionPageCustomizeDefaults,
  tone: comboActionPageCustomizeDefaults.tone as 'brand' | 'decor',
  direction: comboActionPageCustomizeDefaults.direction as 'left' | 'right',
});

const comboSkidUsageSnippet = computed(() => buildComboActionSkidUsageSnippet(comboSkidCustomize));
const comboPopupUsageSnippet = computed(() =>
  buildComboActionPopupUsageSnippet(comboPopupCustomize),
);
const comboFlotationUsageSnippet = computed(() =>
  buildComboActionFlotationUsageSnippet(comboFlotationCustomize),
);
const comboPageUsageSnippet = computed(() => buildComboActionPageUsageSnippet(comboPageCustomize));
</script>

<template>
  <div :class="styles.previewPage">
    <div :class="group.previewGroupSegment">
      <ComponentDocLayout
        v-model:customize-state="comboSkidCustomize"
        anchor-id="button-combo-action-skid"
        title="Combo/Action-Skid"
        :show-doc-title="false"
        component-tag="EgComboActionSkid"
        :import-code="comboActionSkidImportCode"
        :customize-controls="comboActionSkidCustomizeControls"
        :customize-defaults="comboActionSkidCustomizeDefaults"
        :usage-snippet-override="comboSkidUsageSnippet"
        :prop-rows="comboPropRows"
        :event-rows="comboEventRows"
        :slot-rows="comboSlotRows"
        :show-props="false"
      >
        <template #preview>
          <div class="desktopTokens" :class="docStyles.comboActionSkidHost">
            <EgComboActionSkid
              :tone="comboSkidCustomize.tone"
              :divider="Boolean(comboSkidCustomize.divider)"
              :confirm-label="String(comboSkidCustomize.confirmLabel)"
            />
          </div>
        </template>
      </ComponentDocLayout>
    </div>

    <div :class="group.previewGroupSegment">
      <ComponentDocLayout
        v-model:customize-state="comboPopupCustomize"
        anchor-id="button-combo-action-popup-window"
        title="Combo/Action-Popup Window"
        :show-doc-title="false"
        component-tag="EgComboActionPopupWindow"
        :import-code="comboActionPopupImportCode"
        :customize-controls="comboActionPopupCustomizeControls"
        :customize-defaults="comboActionPopupCustomizeDefaults"
        :usage-snippet-override="comboPopupUsageSnippet"
        :prop-rows="comboPropRows"
        :event-rows="comboEventRows"
        :slot-rows="comboSlotRows"
        :show-props="false"
      >
        <template #preview>
          <div class="desktopTokens" :class="docStyles.comboActionPopupHost">
            <EgComboActionPopupWindow
              :tone="comboPopupCustomize.tone"
              :count="comboPopupCustomize.count"
              :confirm-label="String(comboPopupCustomize.confirmLabel)"
              :cancel-label="String(comboPopupCustomize.cancelLabel)"
            />
          </div>
        </template>
      </ComponentDocLayout>
    </div>

    <div :class="group.previewGroupSegment">
      <ComponentDocLayout
        v-model:customize-state="comboFlotationCustomize"
        anchor-id="button-combo-action-flotation"
        title="Combo/Action-Flotation"
        :show-doc-title="false"
        component-tag="EgComboActionFlotation"
        :import-code="comboActionFlotationImportCode"
        :customize-controls="comboActionFlotationCustomizeControls"
        :customize-defaults="comboActionFlotationCustomizeDefaults"
        :usage-snippet-override="comboFlotationUsageSnippet"
        :prop-rows="comboPropRows"
        :event-rows="comboEventRows"
        :slot-rows="comboSlotRows"
        :show-props="false"
      >
        <template #preview>
          <div class="desktopTokens" :class="docStyles.comboActionFlotationHost">
            <EgComboActionFlotation
              :tone="comboFlotationCustomize.tone"
              :divider="Boolean(comboFlotationCustomize.divider)"
              :clear="Boolean(comboFlotationCustomize.clear)"
              :confirm-label="String(comboFlotationCustomize.confirmLabel)"
              :cancel-label="String(comboFlotationCustomize.cancelLabel)"
            />
          </div>
        </template>
      </ComponentDocLayout>
    </div>

    <div :class="group.previewGroupSegment">
      <ComponentDocLayout
        v-model:customize-state="comboPageCustomize"
        anchor-id="button-combo-action-page"
        title="Combo/Action-Page"
        :show-doc-title="false"
        component-tag="EgComboActionPage"
        :import-code="comboActionPageImportCode"
        :customize-controls="comboActionPageCustomizeControls"
        :customize-defaults="comboActionPageCustomizeDefaults"
        :usage-snippet-override="comboPageUsageSnippet"
        :prop-rows="comboPropRows"
        :event-rows="comboEventRows"
        :slot-rows="comboSlotRows"
        :show-props="false"
      >
        <template #preview>
          <div class="desktopTokens" :class="docStyles.comboActionPageHost">
            <EgComboActionPage
              :tone="comboPageCustomize.tone"
              :divider="Boolean(comboPageCustomize.divider)"
              :direction="comboPageCustomize.direction"
              :confirm-label="String(comboPageCustomize.confirmLabel)"
              :cancel-label="String(comboPageCustomize.cancelLabel)"
            />
          </div>
        </template>
      </ComponentDocLayout>
    </div>

    <section id="button-combo-props" :class="[shared.section, group.previewGroupSegment]">
      <h2 :class="shared.sectionTitle">Props</h2>
      <PropsDocTables
        bare
        :show-title="false"
        :prop-rows="comboPropRows"
        :event-rows="comboEventRows"
        :slot-rows="comboSlotRows"
      />
      <p :class="docStyles.comboFeedbackNote">
        设计参考
        <a
          href="https://www.figma.com/design/OkYrDmatUWtgw9n1uVHt6v/EverGreen-Design-System--Desktop-?node-id=185-3456"
          target="_blank"
          rel="noopener noreferrer"
        >Figma 185:3456</a>
        （Combo/Action-Skid、Popup Window、Flotation、Page）。
      </p>
    </section>
  </div>
</template>
