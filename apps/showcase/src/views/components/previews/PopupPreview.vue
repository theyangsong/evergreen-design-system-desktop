<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  EgButton,
  EgDetail,
  EgDialog,
  EgPopup,
  EgVerify,
  useVerifySubmit,
  type DialogType,
  type VerifyType,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import PopupCustomSlotChromePreview from './PopupCustomSlotChromePreview.vue';
import chromePreviewStyles from './PopupCustomSlotChromePreview.module.css';
import {
  popupCustomChromeSlotRows,
  popupCustomContentCustomizeControls,
  popupCustomSystemBarCustomizeControls,
  popupCustomToolbarCustomizeControls,
  resolvePopupCustomBoxSize,
  resolvePopupCustomSystemBarProps,
  resolvePopupCustomToolbarProps,
  resolvePopupCustomContentInsetPreset,
} from './popupDocCustomize';
import {
  ORGANISM_IMPORT,
  popupCustomizeControls,
  popupCustomizeDefaults,
  popupPropRows,
} from './organismTemplateDocData';

type PopupUses = 'detail' | 'dialog' | 'verify' | 'custom';

const customize = reactive({
  ...popupCustomizeDefaults,
  uses: popupCustomizeDefaults.uses as PopupUses,
  alertVerticalAlign: popupCustomizeDefaults.alertVerticalAlign as 'center' | 'offset-top',
  dialogType: popupCustomizeDefaults.dialogType as DialogType,
  verifyType: popupCustomizeDefaults.verifyType as VerifyType,
});

const popupCustomSystemBarProps = computed(() => resolvePopupCustomSystemBarProps(customize));
const popupCustomToolbarProps = computed(() => resolvePopupCustomToolbarProps(customize));
const popupCustomContentInsetPreset = computed(() => resolvePopupCustomContentInsetPreset(customize));

const popupDocSlotRows = computed(() =>
  customize.uses === 'custom' ? popupCustomChromeSlotRows : undefined,
);

const popupOpen = ref(true);

const { verify, onComplete, onRecover, reset: resetVerifySubmit } = useVerifySubmit({
  submit: () => true,
  requestClose: () => {
    closePopup();
  },
});

const verifyType = computed(() => customize.verifyType as VerifyType);

watch(
  () => customize.uses,
  (uses) => {
    if (uses === 'detail') {
      return;
    }
    customize.alertVerticalAlign = uses === 'custom' ? 'center' : 'offset-top';
    if (uses === 'verify') {
      resetVerifySubmit();
    }
  },
);

watch(popupOpen, (open) => {
  if (open) {
    resetVerifySubmit();
  }
});

watch(verifyType, () => {
  resetVerifySubmit();
});

const customBoxWidth = computed(() => {
  if (customize.uses !== 'custom') {
    return 328;
  }
  return resolvePopupCustomBoxSize(customize).width;
});

const customBoxHeight = computed(() => {
  if (customize.uses !== 'custom') {
    return 436;
  }
  return resolvePopupCustomBoxSize(customize).height;
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
      doc-tier="template"
      :show-doc-title="false"
      component-tag="EgPopup"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="popupCustomizeControls"
      :customize-defaults="popupCustomizeDefaults"
      :prop-rows="popupPropRows"
      :slot-rows="popupDocSlotRows"
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
            :alert-vertical-align="customize.alertVerticalAlign as 'center' | 'offset-top'"
            :dialog-type="customize.dialogType as DialogType"
            :verify-type="verifyType"
            :box-width="customBoxWidth"
            :box-height="customBoxHeight"
          >
            <EgDetail
              v-if="customize.uses === 'detail'"
              @close="closePopup"
            />
            <EgDialog
              v-else-if="customize.uses === 'dialog'"
              :type="customize.dialogType as DialogType"
              @cancel="closePopup"
              @confirm="closePopup"
            >
              <template v-if="customize.dialogType === 'compose'" #default>
                <div style="white-space: pre-line">
                  Compose content

                  Scroll to preview frosted toolbar blur.
                </div>
              </template>
            </EgDialog>
            <EgVerify
              v-else-if="customize.uses === 'verify'"
              v-model="verify.code"
              :type="verifyType"
              :state="verify.state"
              @complete="onComplete"
              @recover="onRecover"
            />
            <PopupCustomSlotChromePreview
              v-else
              :class="chromePreviewStyles.root"
              :system-bar-props="popupCustomSystemBarProps"
              :toolbar-props="popupCustomToolbarProps"
              :content-inset-preset="popupCustomContentInsetPreset"
            />
          </EgPopup>
        </div>
      </template>

      <template #customize-after>
        <CustomizePanel
          v-if="customize.uses === 'custom'"
          v-model="customize"
          title="System Bar"
          nested
          embedded
          :controls="popupCustomSystemBarCustomizeControls"
        />
        <CustomizePanel
          v-if="customize.uses === 'custom'"
          v-model="customize"
          title="Toolbar"
          nested
          embedded
          :controls="popupCustomToolbarCustomizeControls"
        />
        <CustomizePanel
          v-if="customize.uses === 'custom'"
          v-model="customize"
          title="Content"
          nested
          embedded
          :controls="popupCustomContentCustomizeControls"
        />
      </template>

      <template #customize-extra>
        <div v-if="!popupOpen" :class="docStyles.previewReopenHint">
          <EgButton size="md" tone="brand" @click="popupOpen = true">重新打开 Popup</EgButton>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
