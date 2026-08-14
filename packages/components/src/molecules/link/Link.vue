<script setup lang="ts">
import styles from './Link.module.css';

export type LinkTone = 'brand' | 'theme' | 'decor';
export type LinkSize = 'lg' | 'md' | 'sm';

const props = withDefaults(
  defineProps<{
    tone?: LinkTone;
    size?: LinkSize;
    href?: string;
    disabled?: boolean;
  }>(),
  {
    tone: 'brand',
    size: 'lg',
    href: '#',
    disabled: false,
  },
);
</script>

<template>
  <a
    :class="[
      'eds-link',
      styles.link,
      styles[props.tone],
      styles[props.size],
    ]"
    :href="disabled ? undefined : href"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="disabled && $event.preventDefault()"
  >
    <slot />
  </a>
</template>
