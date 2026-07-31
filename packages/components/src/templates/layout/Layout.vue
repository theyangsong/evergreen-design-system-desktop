<script setup lang="ts">
import styles from './Layout.module.css';

export type LayoutType = 'empty' | 'navigation' | 'module-menu';

withDefaults(
  defineProps<{
    type?: LayoutType;
    showToolbar?: boolean;
    showPaginer?: boolean;
    showSkid?: boolean;
  }>(),
  {
    type: 'navigation',
    showToolbar: false,
    showPaginer: false,
    showSkid: false,
  },
);
</script>

<template>
  <div class="eds-layout" :class="styles.root">
    <div v-if="type !== 'empty' && $slots.nav" :class="styles.nav">
      <slot name="nav" />
    </div>
    <div v-if="type === 'module-menu' && $slots.moduleMenu" :class="styles.moduleMenu">
      <slot name="moduleMenu" />
    </div>
    <div :class="styles.main">
      <div v-if="showToolbar && $slots.toolbar" :class="styles.toolbar">
        <slot name="toolbar" />
      </div>
      <div :class="styles.body">
        <slot />
      </div>
      <div v-if="showPaginer && $slots.paginer" :class="styles.paginer">
        <slot name="paginer" />
      </div>
    </div>
    <div v-if="showSkid && $slots.skid" :class="styles.skid">
      <slot name="skid" />
    </div>
  </div>
</template>
