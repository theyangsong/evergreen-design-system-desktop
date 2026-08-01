<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgSkid } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import previewStyles from './SkidPreview.module.css';
import {
  ORGANISM_IMPORT,
  buildSkidUsageSnippet,
  skidActionCustomizeControls,
  skidCustomizeControls,
  skidCustomizeDefaults,
  skidPropRows,
  skidSlotRows,
} from './organismTemplateDocData';

const customize = reactive({
  ...skidCustomizeDefaults,
  tone: skidCustomizeDefaults.tone as 'brand' | 'decor' | 'danger',
});

const usageSnippet = computed(() => buildSkidUsageSnippet(customize));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Skid"
      :show-doc-title="false"
      component-tag="EgSkid"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="skidCustomizeControls"
      :customize-defaults="skidCustomizeDefaults"
      :prop-rows="skidPropRows"
      :slot-rows="skidSlotRows"
      :usage-snippet-override="usageSnippet"
      props-section-id="skid-props"
      tall-preview
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewEffectPanelHost,
            docStyles.previewEffectPanelHostTall,
            previewStyles.previewSkidHost,
          ]"
        >
          <EgSkid
            :title="String(customize.title)"
            :show-button="Boolean(customize.showButton)"
            :action-tone="customize.tone"
            :confirm-label="String(customize.confirmLabel)"
          />
        </div>
      </template>

      <template #customize-after>
        <CustomizePanel
          v-if="customize.showButton"
          v-model="customize"
          title="Action"
          nested
          :controls="skidActionCustomizeControls"
        />
      </template>
    </ComponentDocLayout>
  </div>
</template>
