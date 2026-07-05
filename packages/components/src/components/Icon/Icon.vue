<script setup lang="ts">
import { computed } from 'vue';
import styles from './Icon.module.css';
import { iconPaths, type IconName } from './icons';

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
  }>(),
  {
    size: 'md',
  },
);

const path = computed(() => iconPaths[props.name]);
</script>

<template>
  <svg
    :class="[styles.icon, styles[size]]"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :aria-label="label || name"
    :aria-hidden="label ? undefined : true"
    role="img"
  >
    <path
      :d="path"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
