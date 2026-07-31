<script setup lang="ts">
import { computed } from 'vue';
import styles from './Typography.module.css';

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'code';

export type TypographyTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'code';

const props = withDefaults(
  defineProps<{
    variant?: TypographyVariant;
    as?: TypographyTag;
    muted?: boolean;
  }>(),
  {
    variant: 'body',
    as: undefined,
    muted: false,
  },
);

const tag = computed(() => {
  if (props.as) return props.as;

  const map: Record<TypographyVariant, TypographyTag> = {
    display: 'h1',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    body: 'p',
    'body-sm': 'p',
    caption: 'span',
    code: 'code',
  };

  return map[props.variant];
});
</script>

<template>
  <component
    :is="tag"
    :class="[styles.typography, styles[variant], muted && styles.muted]"
  >
    <slot />
  </component>
</template>
