<script setup lang="ts">
import './ripplePulseOnly.css';

/** 波纹脉冲 — 三环同心扩散（ring-1 参考） */
withDefaults(
  defineProps<{
    /** 为 true 时播放脉冲；false 时静止隐藏。 */
    active?: boolean;
  }>(),
  {
    active: true,
  },
);
</script>

<template>
  <div
    class="eds-ripple-pulse"
    :class="{ 'is-idle': !active }"
    role="img"
    :aria-label="active ? '加载中' : '加载'"
    :aria-busy="active || undefined"
  >
    <div
      v-for="index in 3"
      :key="index"
      class="eds-ripple-pulse-wave"
      :class="`eds-ripple-pulse-wave-${index}`"
      aria-hidden="true"
    />
  </div>
</template>
