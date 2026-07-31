<script setup lang="ts">
import { reactive } from 'vue';
import { EgSkid } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  skidCustomizeControls,
  skidCustomizeDefaults,
  skidPropRows,
  skidSlotRows,
} from './organismTemplateDocData';

const customize = reactive({ ...skidCustomizeDefaults });

const skidActionCustomize = reactive({
  confirmLabel: 'Confirm',
});
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
      props-section-id="skid-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="[docStyles.subPreviewWidth, organismStyles.previewOrganismPanelHost]">
          <EgSkid
            :title="String(customize.title)"
            :show-button="Boolean(customize.showButton)"
            :split="Boolean(customize.split)"
            :confirm-label="String(skidActionCustomize.confirmLabel)"
          >
            <div
              :style="{
                minHeight: 'var(--scale-20)',
                margin: 'var(--spacing-4)',
                background: 'var(--material-card-shallow)',
                borderRadius: 'var(--radius-sm)',
              }"
            />
          </EgSkid>
        </div>
      </template>

      <CustomizePanel
        v-if="customize.showButton"
        v-model="skidActionCustomize"
        nested
        title="EgComboActionSkid"
        :controls="[{ kind: 'text', key: 'confirmLabel', label: '确认 confirm' }]"
      />
    </ComponentDocLayout>
  </div>
</template>
