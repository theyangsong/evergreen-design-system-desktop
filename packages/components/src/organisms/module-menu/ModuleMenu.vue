<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useSlots } from 'vue';
import { provideModuleMenuItemFocus } from './moduleMenuItemFocus';
import { EgDivider } from '../../atoms/divider';
import ModuleMenuTitle from './ModuleMenuTitle.vue';
import styles from './ModuleMenu.module.css';
import '../../styles/scrollAreaHiddenScrollbar.css';

withDefaults(
  defineProps<{
    title?: string;
    /** text → 纯文案；trigger → #title 插槽嵌 EgFlotationTrigger trigger-style="text"。 */
    titleMode?: 'text' | 'trigger';
    showEdgeDivider?: boolean;
    /** false → 240px（scale-50 + scale-10）；true → 280px（scale-50 + scale-20）。 */
    wide?: boolean;
  }>(),
  {
    title: 'Module',
    titleMode: 'text',
    showEdgeDivider: true,
    wide: false,
  },
);

const slots = useSlots();
const hasMenuBody = computed(() => Boolean(slots.default));

provideModuleMenuItemFocus();

const scrollRef = ref<HTMLElement | null>(null);
const titleScrollDividerReserved = ref(false);
const titleScrollDividerVisible = ref(false);

const SCROLL_EDGE_EPSILON = 2;

let resizeObserver: ResizeObserver | undefined;
const observedElements = new Set<Element>();

function updateTitleScrollDivider() {
  const region = scrollRef.value;

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

  const region = scrollRef.value;
  if (!region || observedElements.has(region)) return;
  resizeObserver.observe(region);
  observedElements.add(region);
}

function onPanelScroll() {
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
  <aside
    class="eds-module-menu"
    :class="[styles.root, wide && styles.rootWide, !hasMenuBody && styles.rootTitleOnly]"
    aria-label="Module menu"
  >
    <div :class="styles.body">
      <div
        ref="scrollRef"
        :class="['eds-scroll-area-hidden-scrollbar', styles.scrollPanel]"
        @scroll="onPanelScroll"
      >
        <ModuleMenuTitle
          :title="title"
          :title-mode="titleMode"
          :scroll-divider-reserved="titleScrollDividerReserved"
          :show-scroll-divider="titleScrollDividerVisible"
        >
          <slot name="title">{{ title }}</slot>
        </ModuleMenuTitle>
        <div v-if="hasMenuBody" :class="styles.crumb">
          <slot />
        </div>
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
