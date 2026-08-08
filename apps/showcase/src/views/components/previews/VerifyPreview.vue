<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import {
  EgTooltip,
  EgVerify,
  resolveVerifyPanelHeightPx,
  resolveVerifyPanelWidthPx,
  type VerifyType,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import {
  applyVerifyTypePresetToState,
  verifyCustomizeControls,
  verifyCustomizeDefaults,
  verifyPropRows,
} from './verifyDocCustomize';

const customize = reactive({ ...verifyCustomizeDefaults });

const verifyType = computed(() => customize.type as VerifyType);

const panelWidthPx = computed(() => resolveVerifyPanelWidthPx(verifyType.value));
const panelHeightPx = computed(() => resolveVerifyPanelHeightPx(verifyType.value));

const verifyState = computed(
  () => customize.state as 'idle' | 'verifying' | 'success' | 'error',
);

const countdownSeconds = computed(() => {
  if (
    verifyType.value === 'locked'
    || verifyType.value === 'single-trade-password'
    || verifyType.value === 'single-login-password'
  ) {
    return null;
  }
  const parsed = Number.parseInt(String(customize.countdownSeconds), 10);
  return Number.isFinite(parsed) ? parsed : null;
});

const usesCodeInput = computed(
  () =>
    verifyType.value !== 'single-trade-password'
    && verifyType.value !== 'single-login-password'
    && verifyType.value !== 'locked',
);

const demoCode = computed({
  get() {
    if (
      usesCodeInput.value
      && (customize.state === 'verifying' || customize.state === 'success')
      && !customize.demoCode
    ) {
      return '852777';
    }
    return String(customize.demoCode);
  },
  set(value: string) {
    customize.demoCode = value;
  },
});

function onRecover() {
  if (customize.state === 'error') {
    customize.state = 'idle';
    customize.switchDisabled = false;
  }
}

watch(
  () => customize.type,
  (type) => {
    applyVerifyTypePresetToState(customize, type as VerifyType);
  },
);

watch(
  () => customize.state,
  (state) => {
    if (state === 'error' && customize.type !== 'locked') {
      customize.switchDisabled = true;
    }
  },
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Verify"
      tall-preview
      :show-doc-title="false"
      component-tag="EgVerify"
      import-code="import { EgVerify, EgPopup } from '@eds/desktop-components';"
      :customize-controls="verifyCustomizeControls"
      :customize-defaults="verifyCustomizeDefaults"
      :prop-rows="verifyPropRows"
      props-section-id="verify-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="organismStyles.previewOrganismVerifyBoxHost"
        >
          <EgTooltip
            panel-kind="popup"
            panel-radius="radius-lg"
            width-mode="fixed"
            :width="panelWidthPx"
            height-mode="fixed"
            :height="panelHeightPx"
            :scrollable="false"
            panel-flush
          >
            <EgVerify
              v-model="demoCode"
              :type="verifyType"
              :state="verifyState"
              :title="String(customize.title)"
              :secondary-text="String(customize.secondaryText)"
              :countdown-seconds="verifyState === 'error' ? null : countdownSeconds"
              :switch-label="String(customize.switchLabel)"
              :switch-disabled="Boolean(customize.switchDisabled)"
              :confirm-label="String(customize.confirmLabel)"
              :cancel-label="String(customize.cancelLabel)"
              :action-tone="customize.actionTone as 'brand' | 'decor'"
              @recover="onRecover"
            />
          </EgTooltip>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
