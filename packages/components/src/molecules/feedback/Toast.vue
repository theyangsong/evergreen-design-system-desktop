<script setup lang="ts">
import { computed } from 'vue';
import styles from './Feedback.module.css';

export type ToastType = 'result' | 'danger';

const props = withDefaults(
  defineProps<{
    type?: ToastType;
    text?: string;
  }>(),
  {
    type: 'result',
    text: 'Connect to EDS',
  },
);

const typeClass = computed(() =>
  props.type === 'danger' ? styles.toastDanger : styles.toastResult,
);
</script>

<template>
  <div class="eds-toast" :class="[styles.toast, typeClass]" role="status">
    {{ text }}
  </div>
</template>
