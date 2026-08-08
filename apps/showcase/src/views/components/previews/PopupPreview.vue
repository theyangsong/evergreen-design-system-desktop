<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  EgDetail,
  EgPopup,
  EgReminder,
  EgVerify,
  type VerifyType,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  ORGANISM_IMPORT,
  popupCustomizeControls,
  popupCustomizeDefaults,
  popupPropRows,
} from './organismTemplateDocData';

type PopupUses = 'detail' | 'reminder' | 'verify' | 'custom';

const customize = reactive({
  ...popupCustomizeDefaults,
  uses: popupCustomizeDefaults.uses as PopupUses,
  alertVerticalAlign: popupCustomizeDefaults.alertVerticalAlign as 'center' | 'padding-top-md',
  reminderType: popupCustomizeDefaults.reminderType as 'info' | 'echo',
  verifyType: popupCustomizeDefaults.verifyType as VerifyType,
});

const popupOpen = ref(true);

watch(
  () => customize.uses,
  (uses) => {
    if (uses === 'reminder' || uses === 'verify') {
      customize.alertVerticalAlign = 'padding-top-md';
    }
  },
);

const verifyType = computed(() => customize.verifyType as VerifyType);

const customBoxWidth = computed(() => {
  const parsed = Number.parseInt(String(customize.boxWidth), 10);
  return Number.isFinite(parsed) ? parsed : 328;
});

const customBoxHeight = computed(() => {
  const parsed = Number.parseInt(String(customize.boxHeight), 10);
  return Number.isFinite(parsed) ? parsed : 436;
});

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
            :uses="customize.uses as PopupUses"
            :alert-vertical-align="customize.alertVerticalAlign as 'center' | 'padding-top-md'"
            :reminder-type="customize.reminderType as 'info' | 'echo'"
            :verify-type="verifyType"
            :box-width="customBoxWidth"
            :box-height="customBoxHeight"
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
            <EgVerify
              v-else-if="customize.uses === 'verify'"
              :type="verifyType"
              @switch="closePopup"
            />
            <div
              v-else
              :class="organismStyles.previewOrganismPopupBoxPlaceholder"
            >
              Popup Box 默认插槽
            </div>
          </EgPopup>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
