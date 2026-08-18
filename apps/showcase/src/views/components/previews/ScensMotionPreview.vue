<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue';
import { EgDoneTick, EgIcon, EgMnemonicVerify, EgMotionProcessing, EgRipplePulse, EgVerifyRingDots } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import previewPageStyles from './InputPreview.module.css';
import styles from './ScensMotionPreview.module.css';
import {
  buildScensMotionCustomizeControls,
  scensMotionCustomizeDefaults,
  scensMotionDoneTickImportCode,
  scensMotionDoneTickPropRows,
  scensMotionMotionProcessingImportCode,
  scensMotionMotionProcessingPropRows,
  scensMotionMnemonicVerifyImportCode,
  scensMotionMnemonicVerifyPropRows,
  scensMotionRipplePulseImportCode,
  scensMotionRipplePulsePropRows,
  scensMotionRingDotsImportCode,
  scensMotionRingDotsPropRows,
} from './scensMotionDocCustomize';
import type { ScensMotionInteraction, ScensMotionScenario } from './scensMotionDocCustomize';

const props = withDefaults(
  defineProps<{
    initialScenario?: ScensMotionScenario;
    pageTitle?: string;
  }>(),
  {},
);

type RingPreviewState = 'idle' | 'verifying' | 'success' | 'error';

const FULL_CYCLE_SEQUENCE: RingPreviewState[] = ['idle', 'verifying', 'success'];
const FULL_CYCLE_STEP_MS = 1400;

const customize = reactive({
  ...scensMotionCustomizeDefaults,
  ...(props.initialScenario ? { scenario: props.initialScenario } : {}),
});

const isVerifyRingDots = computed(() => customize.scenario === 'verify-ring-dots');
const isDoneTick = computed(() => customize.scenario === 'done-tick');
const isMotionProcessing = computed(() => customize.scenario === 'motion-processing');
const isRipplePulse = computed(() => customize.scenario === 'ripple-pulse');
const isMnemonicVerify = computed(() => customize.scenario === 'mnemonic-verify');

const motionCustomizeControls = computed(() =>
  buildScensMotionCustomizeControls({
    lockScenario: Boolean(props.initialScenario),
    scenario: customize.scenario as ScensMotionScenario,
  }),
);

const docComponentTag = computed(() => {
  if (isDoneTick.value) {
    return 'EgDoneTick';
  }
  if (isMotionProcessing.value) {
    return 'EgMotionProcessing';
  }
  if (isRipplePulse.value) {
    return 'EgRipplePulse';
  }
  if (isMnemonicVerify.value) {
    return 'EgMnemonicVerify';
  }
  return 'EgVerifyRingDots';
});

const docImportCode = computed(() => {
  if (isDoneTick.value) {
    return scensMotionDoneTickImportCode;
  }
  if (isMotionProcessing.value) {
    return scensMotionMotionProcessingImportCode;
  }
  if (isRipplePulse.value) {
    return scensMotionRipplePulseImportCode;
  }
  if (isMnemonicVerify.value) {
    return scensMotionMnemonicVerifyImportCode;
  }
  return scensMotionRingDotsImportCode;
});

const docPropRows = computed(() => {
  if (isDoneTick.value) {
    return scensMotionDoneTickPropRows;
  }
  if (isMotionProcessing.value) {
    return scensMotionMotionProcessingPropRows;
  }
  if (isRipplePulse.value) {
    return scensMotionRipplePulsePropRows;
  }
  if (isMnemonicVerify.value) {
    return scensMotionMnemonicVerifyPropRows;
  }
  return scensMotionRingDotsPropRows;
});

const cycleState = ref<RingPreviewState>('idle');
let cycleTimer: ReturnType<typeof setInterval> | undefined;

function clearCycleTimer() {
  if (cycleTimer !== undefined) {
    clearInterval(cycleTimer);
    cycleTimer = undefined;
  }
}

function startFullCycle() {
  clearCycleTimer();
  let index = 0;
  cycleState.value = FULL_CYCLE_SEQUENCE[index] ?? 'idle';
  cycleTimer = setInterval(() => {
    index = (index + 1) % FULL_CYCLE_SEQUENCE.length;
    cycleState.value = FULL_CYCLE_SEQUENCE[index] ?? 'idle';
  }, FULL_CYCLE_STEP_MS);
}

function resolveInteractionState(interaction: ScensMotionInteraction): RingPreviewState {
  if (interaction === 'full') {
    return cycleState.value;
  }
  if (interaction === 'idle') {
    return 'idle';
  }
  if (interaction === 'verifying') {
    return 'verifying';
  }
  if (interaction === 'success') {
    return 'success';
  }
  return 'error';
}

const ringState = computed(() =>
  resolveInteractionState(customize.interaction as ScensMotionInteraction),
);

const ringDotsActive = computed(() => ringState.value === 'verifying');
const showSuccessTick = computed(() => ringState.value === 'success');
const showTypeIcon = computed(() => !showSuccessTick.value);

const doneTickToneClass = computed(() =>
  customize.tone === 'brand' ? styles.doneTickToneBrand : styles.doneTickToneSuccess,
);

const motionProcessingToneClass = computed(() =>
  customize.tone === 'brand'
    ? styles.motionProcessingToneBrand
    : styles.motionProcessingToneWarning,
);

const ripplePulseToneClass = computed(() =>
  customize.tone === 'success' ? styles.ripplePulseToneSuccess : styles.ripplePulseToneBrand,
);

const mnemonicVerifyToneClass = computed(() =>
  customize.tone === 'success'
    ? styles.mnemonicVerifyToneSuccess
    : styles.mnemonicVerifyToneBrand,
);

const verifyRingToneClass = computed(() =>
  customize.tone === 'success' ? styles.verifyRingToneSuccess : styles.verifyRingToneBrand,
);

watch(
  () => customize.scenario,
  (scenario) => {
    if (scenario === 'motion-processing' && customize.tone === 'success') {
      customize.tone = 'warning';
    } else if (
      scenario !== 'motion-processing' &&
      customize.tone === 'warning'
    ) {
      customize.tone = 'brand';
    }
  },
  { immediate: true },
);

watch(
  () => [customize.scenario, customize.interaction] as const,
  ([scenario, interaction]) => {
    if (scenario !== 'verify-ring-dots' || interaction !== 'full') {
      clearCycleTimer();
      return;
    }
    startFullCycle();
  },
  { immediate: true },
);

onUnmounted(() => {
  clearCycleTimer();
});
</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      :title="pageTitle ?? 'ScensMotion'"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="motionCustomizeControls"
      :customize-defaults="scensMotionCustomizeDefaults"
      :prop-rows="docPropRows"
      props-section-id="scens-motion-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="styles.stage">
          <div v-if="isVerifyRingDots" :class="styles.symbolHost">
            <div :class="styles.symbolRing">
              <EgVerifyRingDots
                :class="[
                  styles.symbolRingDots,
                  ringDotsActive && styles.symbolRingDotsActive,
                  ringDotsActive && verifyRingToneClass,
                ]"
                :active="ringDotsActive"
              />
              <div :class="[styles.symbolInner, verifyRingToneClass]">
                <EgDoneTick
                  v-if="showSuccessTick"
                  :class="[
                    customize.tone === 'success'
                      ? styles.doneTickToneSuccess
                      : styles.doneTickToneBrand,
                  ]"
                />
                <EgIcon v-else-if="showTypeIcon" name="eds-key-fill" fit />
              </div>
            </div>
          </div>

          <div v-else-if="isDoneTick" :class="styles.doneTickHost">
            <EgDoneTick :key="customize.scenario" :class="doneTickToneClass" />
          </div>

          <div v-else-if="isMotionProcessing" :class="styles.motionProcessingHost">
            <EgMotionProcessing :key="customize.scenario" :class="motionProcessingToneClass" />
          </div>

          <div v-else-if="isRipplePulse" :class="styles.ripplePulseHost">
            <EgRipplePulse :key="`${customize.scenario}-${customize.tone}`" :class="ripplePulseToneClass" />
          </div>

          <div v-else-if="isMnemonicVerify" :class="styles.mnemonicVerifyHost">
            <EgMnemonicVerify
              :key="`${customize.scenario}-${customize.tone}`"
              :class="mnemonicVerifyToneClass"
            />
          </div>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
