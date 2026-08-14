<script setup lang="ts">
import { computed } from 'vue';
import {
  MOTION_HOVER_ENTER_ONLY,
  MOTION_HOVER_ENTER_SUPPRESSED,
} from './motionHoverEnterOnly';

const props = withDefaults(
  defineProps<{
    /** 根节点标签；默认 div。 */
    as?: string;
    /** 为 true 时禁用 hover 入场过渡（如 Module Menu 聚焦态）。 */
    suppressHoverMotion?: boolean;
  }>(),
  {
    as: 'div',
    suppressHoverMotion: false,
  },
);

const rootClass = computed(() => [
  MOTION_HOVER_ENTER_ONLY,
  props.suppressHoverMotion && MOTION_HOVER_ENTER_SUPPRESSED,
]);
</script>

<template>
  <component :is="as" class="eds-motion-hover-enter" :class="rootClass">
    <slot />
  </component>
</template>
