<script setup lang="ts">
import { computed } from 'vue';
import styles from './Divider.module.css';

export type DividerType = 'module' | 'page' | 'navigator';
export type DividerDirection = 'horizontal' | 'vertical';

const props = withDefaults(
  defineProps<{
    type?: DividerType;
    direction?: DividerDirection;
    hide?: boolean;
  }>(),
  {
    type: 'module',
    direction: 'horizontal',
    hide: false,
  },
);

const typeClass = computed(() => {
  switch (props.type) {
    case 'page':
      return styles.typePage;
    case 'navigator':
      return styles.typeNavigator;
    default:
      return styles.typeModule;
  }
});
</script>

<template>
  <div
    role="separator"
    :class="[
      'eds-divider',
      styles.root,
      direction === 'vertical' ? styles.vertical : styles.horizontal,
      typeClass,
      hide && styles.hide,
    ]"
    :aria-orientation="direction === 'vertical' ? 'vertical' : 'horizontal'"
    :aria-hidden="hide || undefined"
  />
</template>
