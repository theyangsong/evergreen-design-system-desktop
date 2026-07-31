<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import { provideModuleMenuItemFocus } from './moduleMenuItemFocus';
import { EgDivider } from '../../atoms/divider';
import ModuleMenuTitle from './ModuleMenuTitle.vue';
import styles from './ModuleMenu.module.css';

withDefaults(
  defineProps<{
    title?: string;
    showEdgeDivider?: boolean;
  }>(),
  {
    title: 'Module',
    showEdgeDivider: true,
  },
);

provideModuleMenuItemFocus();

const crumbRef = ref<HTMLElement | null>(null);
const titleScrollDividerReserved = ref(false);
const titleScrollDividerVisible = ref(false);

const SCROLL_EDGE_EPSILON = 2;

let resizeObserver: ResizeObserver | undefined;
const observedElements = new Set<Element>();

function updateTitleScrollDivider() {
  const region = crumbRef.value;

  if (!region) {
    titleScrollDividerReserved.value = false;
    titleScrollDividerVisible.value = false;
    return;
  }

  const { scrollTop, clientHeight, scrollHeight } = region;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;

  titleScrollDividerReserved.value = canScroll;
  titleScrollDividerVisible.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
}

function scheduleScrollDividerCheck() {
  nextTick(() => {
    requestAnimationFrame(updateTitleScrollDivider);
  });
}

function observeCrumbOverflow() {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      scheduleScrollDividerCheck();
    });
  }

  const region = crumbRef.value;
  if (!region || observedElements.has(region)) return;
  resizeObserver.observe(region);
  observedElements.add(region);
}

function onCrumbScroll() {
  updateTitleScrollDivider();
}

onMounted(() => {
  observeCrumbOverflow();
  scheduleScrollDividerCheck();
});

onUpdated(() => {
  observeCrumbOverflow();
  scheduleScrollDividerCheck();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  observedElements.clear();
});
</script>

<template>
  <aside class="eds-module-menu" :class="styles.root" aria-label="Module menu">
    <div :class="styles.body">
      <ModuleMenuTitle
        :title="title"
        :scroll-divider-reserved="titleScrollDividerReserved"
        :show-scroll-divider="titleScrollDividerVisible"
      >
        <slot name="title">{{ title }}</slot>
      </ModuleMenuTitle>
      <div ref="crumbRef" :class="styles.crumb" @scroll="onCrumbScroll">
        <slot />
      </div>
    </div>
    <EgDivider
      v-if="showEdgeDivider"
      :class="styles.verticalDivider"
      type="module"
      direction="vertical"
      :hide="false"
    />
  </aside>
</template>
