<script setup lang="ts">
import './motionProcessingOnly.css';

/** Processing — --motion-processing-size 缩放图形；--motion-processing-stroke 线宽（默认 2px） */
withDefaults(
  defineProps<{
    /** 为 true 时双轴旋转；false 时停在初始角度。 */
    active?: boolean;
  }>(),
  {
    active: true,
  },
);
</script>

<template>
  <div
    class="eds-motion-processing"
    :class="{ 'is-idle': !active }"
    role="img"
    :aria-label="active ? '处理中' : '处理'"
    :aria-busy="active || undefined"
  >
    <div class="eds-motion-processing-hand eds-motion-processing-hand-long" aria-hidden="true" />
    <div class="eds-motion-processing-hand eds-motion-processing-hand-short" aria-hidden="true" />
  </div>
</template>
