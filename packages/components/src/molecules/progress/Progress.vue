<script setup lang="ts">
import { computed } from 'vue';
import {
  PROGRESS_POPOVER_FILL_PATH,
  PROGRESS_POPOVER_FILL_VIEWBOX,
} from './progressPopoverShape';
import styles from './Progress.module.css';

const props = withDefaults(
  defineProps<{
    /** 0–100 */
    value?: number;
    /** 无障碍标签 */
    ariaLabel?: string;
    showTooltip?: boolean;
  }>(),
  {
    value: 0,
    ariaLabel: '进度',
    showTooltip: true,
  },
);

const clamped = computed(() => Math.min(100, Math.max(0, props.value)));
const percentLabel = computed(() => `${Math.round(clamped.value)}%`);
const showPercent = computed(() => props.showTooltip !== false);

const indicatorStyle = computed(() => {
  const value = clamped.value;

  if (value <= 0) {
    return { left: '0%', transform: 'translateX(0)' };
  }

  if (value >= 100) {
    return { left: '100%', transform: 'translateX(-100%)' };
  }

  return { left: `${value}%`, transform: 'translateX(-50%)' };
});
</script>

<template>
  <div class="eds-progress" :class="styles.root">
    <div :class="styles.trackArea">
      <div
        :class="styles.track"
        role="progressbar"
        :aria-valuenow="clamped"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="ariaLabel"
      >
        <div :class="styles.fill" :style="{ width: `${clamped}%` }" />
      </div>
      <div
        v-if="showPercent"
        :class="styles.indicator"
        :style="indicatorStyle"
      >
        <div :class="styles.bubble">
          <svg
            :class="styles.bubbleSvg"
            :viewBox="PROGRESS_POPOVER_FILL_VIEWBOX"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path :class="styles.bubblePath" :d="PROGRESS_POPOVER_FILL_PATH" />
          </svg>
          <span :class="styles.percent">{{ percentLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
