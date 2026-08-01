<script setup lang="ts">
import { onBeforeUnmount, provide, ref, watch } from 'vue';
import styles from './Layout.module.css';
import { SKID_AFFECTING_MAIN_KEY, SKID_PUSH_TRANSITION_MS } from '../../shared/skidContext';

export type LayoutType = 'empty' | 'navigation' | 'module-menu';

const props = withDefaults(
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

const skidAffectingMain = ref(Boolean(props.showSkid));
provide(SKID_AFFECTING_MAIN_KEY, skidAffectingMain);

let skidReleaseTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.showSkid,
  (open) => {
    if (skidReleaseTimer !== undefined) {
      clearTimeout(skidReleaseTimer);
      skidReleaseTimer = undefined;
    }

    if (open) {
      skidAffectingMain.value = true;
      return;
    }

    skidReleaseTimer = window.setTimeout(() => {
      if (!props.showSkid) {
        skidAffectingMain.value = false;
      }
      skidReleaseTimer = undefined;
    }, SKID_PUSH_TRANSITION_MS);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (skidReleaseTimer !== undefined) clearTimeout(skidReleaseTimer);
});
</script>

<template>
  <div class="eds-layout" :class="styles.root">
    <div v-if="type !== 'empty' && $slots.nav" :class="styles.nav">
      <slot name="nav" />
    </div>
    <div v-if="type === 'module-menu' && $slots.moduleMenu" :class="styles.moduleMenu">
      <slot name="moduleMenu" />
    </div>
    <div :class="[styles.main, showSkid && $slots.skid && styles.mainSkidOpen]">
      <div :class="styles.scrollPanel">
        <div v-if="showToolbar && $slots.toolbar" :class="styles.toolbar">
          <slot name="toolbar" />
        </div>
        <div :class="styles.body">
          <slot />
        </div>
      </div>
      <div v-if="showPaginer && $slots.paginer" :class="styles.paginer">
        <slot name="paginer" />
      </div>
    </div>
    <div
      v-if="$slots.skid"
      :class="[styles.skid, showSkid && styles.skidVisible]"
      :aria-hidden="showSkid ? undefined : true"
    >
      <div :class="styles.skidInner">
        <slot name="skid" />
      </div>
    </div>
  </div>
</template>
