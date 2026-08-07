<script setup lang="ts">
import { computed, reactive } from 'vue';
import {
  EgIcon,
  EgReminder,
  EgTooltip,
  resolveReminderPanelWidthPx,
  type IconName,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  reminderCustomizeControls,
  reminderCustomizeDefaults,
  reminderEchoToolbarCustomizeControls,
  reminderInfoActionCustomizeControls,
  reminderPropRows,
  buildReminderSymbolStyle,
} from './reminderDocCustomize';

const customize = reactive({ ...reminderCustomizeDefaults });

const panelWidthPx = computed(() =>
  resolveReminderPanelWidthPx(customize.type as 'info' | 'echo'),
);

const reminderSymbolStyle = computed(() =>
  buildReminderSymbolStyle(String(customize.symbolBackground)),
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Reminder"
      tall-preview
      :show-doc-title="false"
      component-tag="EgReminder"
      import-code="import { EgReminder, EgPopup } from '@eds/desktop-components';"
      :customize-controls="reminderCustomizeControls"
      :customize-defaults="reminderCustomizeDefaults"
      :prop-rows="reminderPropRows"
      props-section-id="reminder-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="organismStyles.previewOrganismReminderBoxHost"
        >
          <EgTooltip
            panel-kind="popup"
            panel-radius="radius-lg"
            width-mode="fixed"
            :width="panelWidthPx"
            height-mode="adaptive"
            :scrollable="false"
            panel-flush
          >
            <EgReminder
              :type="customize.type as 'info' | 'echo'"
              :title="String(customize.title)"
              :secondary-text="String(customize.secondaryText)"
              :confirm-label="String(customize.confirmLabel)"
              :cancel-label="String(customize.cancelLabel)"
              :action-count="Number(customize.actionCount) === 2 ? 2 : 1"
              :show-clear="Boolean(customize.showClear)"
              :clear-label="String(customize.clearLabel)"
              :toolbar-tone="customize.toolbarTone as 'brand' | 'decor'"
              :style="reminderSymbolStyle"
            >
              <template v-if="customize.type === 'info'" #symbol>
                <EgIcon :name="String(customize.symbolIcon) as IconName" size="lg" />
              </template>
              <template v-if="customize.type === 'echo'" #default>
                <div style="white-space: pre-line">{{ customize.echoSlotText }}</div>
              </template>
            </EgReminder>
          </EgTooltip>
        </div>
      </template>

      <template #customize-extra>
        <CustomizePanel
          v-if="customize.type === 'info'"
          v-model="customize"
          title="EgComboActionPopupWindow"
          nested
          embedded
          :controls="reminderInfoActionCustomizeControls"
        />
        <CustomizePanel
          v-else
          v-model="customize"
          title="工具栏 · EgComboActionFlotation"
          nested
          embedded
          :controls="reminderEchoToolbarCustomizeControls"
        />
      </template>
    </ComponentDocLayout>
  </div>
</template>
