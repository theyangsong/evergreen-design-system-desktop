<script setup lang="ts">
import { reactive, ref } from 'vue';
import { EgDetail, EgPopup, EgReminder } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  popupCustomizeControls,
  popupCustomizeDefaults,
  popupPropRows,
} from './organismTemplateDocData';

const customize = reactive({
  ...popupCustomizeDefaults,
  uses: popupCustomizeDefaults.uses as 'detail' | 'reminder' | 'verify',
  reminderType: popupCustomizeDefaults.reminderType as 'info' | 'echo',
});

const popupOpen = ref(true);

function closePopup() {
  popupOpen.value = false;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Popup"
      :show-doc-title="false"
      component-tag="EgPopup"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="popupCustomizeControls"
      :customize-defaults="popupCustomizeDefaults"
      :prop-rows="popupPropRows"
      props-section-id="popup-props"
      tall-preview
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="organismStyles.previewOrganismPopupHost"
          @click.self="!popupOpen && (popupOpen = true)"
        >
          <EgPopup
            v-model:open="popupOpen"
            :uses="customize.uses as 'detail' | 'reminder' | 'verify'"
            :reminder-type="customize.reminderType as 'info' | 'echo'"
          >
            <EgDetail
              v-if="customize.uses === 'detail'"
              @close="closePopup"
            />
            <EgReminder
              v-else-if="customize.uses === 'reminder'"
              :type="customize.reminderType as 'info' | 'echo'"
              @cancel="closePopup"
              @confirm="closePopup"
            >
              <template v-if="customize.reminderType === 'echo'" #default>
                <div style="white-space: pre-line">
                  Echo slot content

                  Scroll to preview frosted toolbar blur.
                </div>
              </template>
            </EgReminder>
            <EgReminder
              v-else
              type="info"
              :action-count="1"
              @cancel="closePopup"
              @confirm="closePopup"
            />
          </EgPopup>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
