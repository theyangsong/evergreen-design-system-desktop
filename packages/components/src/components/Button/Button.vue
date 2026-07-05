<script setup lang="ts">
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
);
</script>

<template>
  <button
    :class="[styles.button, styles[variant], styles[size]]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>
