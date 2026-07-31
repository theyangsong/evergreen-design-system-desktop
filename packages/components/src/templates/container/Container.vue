<script setup lang="ts">
import styles from './Container.module.css';

export type ContainerPageBgLocation = 'right' | 'center' | 'none';

withDefaults(
  defineProps<{
    pageBg?: ContainerPageBgLocation;
  }>(),
  {
    pageBg: 'none',
  },
);
</script>

<template>
  <div class="eds-container" :class="styles.root">
    <div
      v-if="pageBg === 'right'"
      :class="styles.pageBg"
      aria-hidden="true"
    />
    <div :class="styles.content">
      <slot />
    </div>
    <div
      v-if="pageBg === 'center'"
      :class="[styles.pageBg, styles.pageBgCenter]"
      aria-hidden="true"
    />
  </div>
</template>
