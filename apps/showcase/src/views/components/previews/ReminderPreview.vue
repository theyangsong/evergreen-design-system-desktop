<script setup lang="ts">
import { reactive } from 'vue';
import { EgReminder } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  reminderCustomizeControls,
  reminderCustomizeDefaults,
  reminderPropRows,
} from './organismTemplateDocData';

const customize = reactive({
  ...reminderCustomizeDefaults,
  type: reminderCustomizeDefaults.type as 'info' | 'echo',
});

const popupActionCustomize = reactive({
  confirmLabel: 'Confirm',
  actionCount: '1',
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Reminder"
      tall-preview
      :show-doc-title="false"
      component-tag="EgReminder"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="reminderCustomizeControls"
      :customize-defaults="reminderCustomizeDefaults"
      :prop-rows="reminderPropRows"
      props-section-id="reminder-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="[docStyles.previewInputHost, organismStyles.previewOrganismPanelHost]">
          <EgReminder
            :type="customize.type"
            :title="String(customize.title)"
            :secondary-text="String(customize.secondaryText)"
            :show-secondary-text="Boolean(customize.showSecondaryText)"
            :confirm-label="String(popupActionCustomize.confirmLabel)"
            :action-count="Number(popupActionCustomize.actionCount) === 2 ? 2 : 1"
          />
        </div>
      </template>

      <CustomizePanel
        v-if="customize.type === 'info'"
        v-model="popupActionCustomize"
        nested
        title="EgComboActionPopupWindow"
        :controls="[
          { kind: 'text', key: 'confirmLabel', label: '确认 confirm' },
          {
            kind: 'select',
            key: 'actionCount',
            label: '按钮数 count',
            options: [
              { value: '1', label: '1' },
              { value: '2', label: '2' },
            ],
          },
        ]"
      />
    </ComponentDocLayout>
  </div>
</template>
