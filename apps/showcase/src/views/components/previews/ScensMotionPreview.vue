<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue';
import { EgDoneTick, EgIcon, EgVerifyRingDots } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import previewPageStyles from './InputPreview.module.css';
import styles from './ScensMotionPreview.module.css';
import {
  scensMotionCustomizeControls,
  scensMotionCustomizeDefaults,
  scensMotionDoneTickImportCode,
  scensMotionDoneTickPropRows,
  scensMotionRingDotsImportCode,
  scensMotionRingDotsPropRows,
  type ScensMotionInteraction,
} from './scensMotionDocCustomize';

type RingPreviewState = 'idle' | 'verifying' | 'success' | 'error';

const FULL_CYCLE_SEQUENCE: RingPreviewState[] = ['idle', 'verifying', 'success'];
const FULL_CYCLE_STEP_MS = 1400;

const customize = reactive({ ...scensMotionCustomizeDefaults });

const isVerifyRingDots = computed(() => customize.scenario === 'verify-ring-dots');
const isDoneTick = computed(() => customize.scenario === 'done-tick');

const docComponentTag = computed(() =>
  isDoneTick.value ? 'EgDoneTick' : 'EgVerifyRingDots',
);

const docImportCode = computed(() =>
  isDoneTick.value ? scensMotionDoneTickImportCode : scensMotionRingDotsImportCode,
);

const docPropRows = computed(() =>
  isDoneTick.value ? scensMotionDoneTickPropRows : scensMotionRingDotsPropRows,
);

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
      title="ScensMotion"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="docImportCode"
      :customize-controls="scensMotionCustomizeControls"
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
                ]"
                :active="ringDotsActive"
              />
              <div :class="styles.symbolInner">
                <EgDoneTick
                  v-if="showSuccessTick"
                  :class="[styles.doneTickToneBrand]"
                />
                <EgIcon v-else-if="showTypeIcon" name="eds-key-fill" fit />
              </div>
            </div>
          </div>

          <div v-else-if="isDoneTick" :class="styles.doneTickHost">
            <EgDoneTick :key="customize.scenario" :class="doneTickToneClass" />
          </div>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
