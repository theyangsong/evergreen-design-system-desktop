<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  EgButton,
  EgDetail,
  EgPopup,
  EgReminder,
  EgVerify,
  useVerifySubmit,
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

type PopupUses = 'detail' | 'reminder' | 'verify' | 'custom';

const customize = reactive({
  ...popupCustomizeDefaults,
  uses: popupCustomizeDefaults.uses as PopupUses,
  alertVerticalAlign: popupCustomizeDefaults.alertVerticalAlign as 'center' | 'offset-top',
  reminderType: popupCustomizeDefaults.reminderType as 'info' | 'echo',
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
              v-model="verify.code"
              :type="verifyType"
              :state="verify.state"
              @complete="onComplete"
              @recover="onRecover"
              @switch="closePopup"
            />
            <PopupCustomSlotChromePreview
              v-else
              :show-system-bar-close="popupCustomSystemBarProps.showSystemBarClose"
              :show-toolbar="popupCustomToolbarProps.showToolbar"
              :show-toolbar-buttons="popupCustomToolbarProps.showToolbarButtons"
              :show-toolbar-cancel="popupCustomToolbarProps.showToolbarCancel"
              :show-scroll-body="popupCustomToolbarProps.showScrollBody"
              :toolbar-tone="popupCustomToolbarProps.toolbarTone"
              :toolbar-variant="popupCustomToolbarProps.toolbarVariant"
              :toolbar-cancel-tone="popupCustomToolbarProps.toolbarCancelTone"
              :toolbar-cancel-variant="popupCustomToolbarProps.toolbarCancelVariant"
              :toolbar-confirm-label="popupCustomToolbarProps.toolbarConfirmLabel"
              :toolbar-cancel-label="popupCustomToolbarProps.toolbarCancelLabel"
              :toolbar-direction="popupCustomToolbarProps.toolbarDirection"
              :toolbar-divider-pinned="popupCustomToolbarProps.toolbarDividerPinned"
              :content-inset-preset="popupCustomContentInsetPreset"
              @close="closePopup"
            >
              <template v-if="popupCustomToolbarProps.useToolbarSlot" #toolbar>
                <div :class="[organismStyles.previewOrganismPopupBoxPlaceholder, chromePreviewStyles.toolbarSlotFull]">
                  toolbar 插槽内容
                </div>
              </template>
            </PopupCustomSlotChromePreview>
          </EgPopup>
        </div>
      </template>

      <template #customize-extra>
        <div
          v-if="customize.uses === 'custom'"
          :class="docStyles.customizeExtraStack"
        >
          <CustomizePanel
            v-model="customize"
            title="系统条 · systemBarClose"
            nested
            embedded
            :controls="popupCustomSystemBarCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            title="内容区插槽"
            nested
            embedded
            :controls="popupCustomContentCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            title="工具栏 · toolbarBar"
            nested
            embedded
            sequential
            :row-columns="4"
            :controls="popupCustomToolbarCustomizeControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
