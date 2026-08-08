<script setup lang="ts">
import { computed } from 'vue';
import styles from './VerifyRingDots.module.css';

/** 36 点追光 — 尺寸/动效硬编码；颜色走 --verify-ring-dot-color */
const DOT_COUNT = 36;
const dots = Array.from({ length: DOT_COUNT }, (_, index) => index);

const props = withDefaults(
  defineProps<{
    /** 为 true 时点阵追光；false 时 36 点静止（位置不变）。 */
    active?: boolean;
  }>(),
  {
    active: false,
  },
);

const rootClass = computed(() => [styles.root, props.active && styles.rootActive]);
</script>

<template>
  <div :class="['eds-verify-ring-dots', rootClass]" aria-hidden="true">
    <span
      v-for="index in dots"
      :key="index"
      :class="styles.dot"
      :style="{ '--i': index }"
    />
  </div>
</template>
