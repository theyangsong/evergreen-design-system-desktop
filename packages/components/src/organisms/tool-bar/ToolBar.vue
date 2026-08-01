<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue';
import { EgDivider } from '../../atoms/divider';
import ToolBarTitle from './ToolBarTitle.vue';
import styles from './ToolBar.module.css';
import '../../styles/frostedPageChrome.css';

const props = withDefaults(
  defineProps<{
    title?: string;
    showBack?: boolean;
    showOperation?: boolean;
    showDivider?: boolean;
    showSection?: boolean;
  }>(),
  {
    title: 'Title',
    showBack: false,
    showOperation: true,
    showDivider: false,
    showSection: false,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const scrollDividerReserved = ref(false);
const scrollDividerVisible = ref(false);

const SCROLL_EDGE_EPSILON = 2;

let scrollRegion: HTMLElement | null = null;
let resizeObserver: ResizeObserver | undefined;
const observedElements = new Set<Element>();

function findScrollParent(element: HTMLElement | null): HTMLElement | null {
  let node = element?.parentElement ?? null;

  while (node) {
    const { overflowY } = getComputedStyle(node);

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }

    node = node.parentElement;
  }

  return null;
}

function bindScrollRegion() {
  const nextRegion = findScrollParent(rootRef.value);

  if (scrollRegion === nextRegion) return;

  scrollRegion?.removeEventListener('scroll', onScrollRegionScroll);
  scrollRegion = nextRegion;
  scrollRegion?.addEventListener('scroll', onScrollRegionScroll, { passive: true });
}

function updateScrollDivider() {
  if (!props.showDivider) {
    scrollDividerReserved.value = false;
    scrollDividerVisible.value = false;
    return;
  }

  if (!scrollRegion) {
    scrollDividerReserved.value = true;
    scrollDividerVisible.value = true;
    return;
  }

  const { scrollTop, clientHeight, scrollHeight } = scrollRegion;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;

  scrollDividerReserved.value = canScroll;
  scrollDividerVisible.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
}

function scheduleScrollDividerCheck() {
  nextTick(() => {
    requestAnimationFrame(updateScrollDivider);
  });
}

function onScrollRegionScroll() {
  updateScrollDivider();
}

function observeScrollRegion() {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      scheduleScrollDividerCheck();
    });
  }

  if (!scrollRegion || observedElements.has(scrollRegion)) return;

  resizeObserver.observe(scrollRegion);
  observedElements.add(scrollRegion);
}

function setupScrollTracking() {
  bindScrollRegion();
  observeScrollRegion();
  scheduleScrollDividerCheck();
}

onMounted(() => {
  setupScrollTracking();
});

onUpdated(() => {
  setupScrollTracking();
});

watch(
  () => props.showDivider,
  () => {
    scheduleScrollDividerCheck();
  },
);

onBeforeUnmount(() => {
  scrollRegion?.removeEventListener('scroll', onScrollRegionScroll);
  resizeObserver?.disconnect();
  observedElements.clear();
});
</script>

<template>
  <header ref="rootRef" class="eds-tool-bar" :class="styles.root">
    <div :class="styles.chrome">
      <div :class="['eds-frosted-page-chrome', styles.raw]">
        <ToolBarTitle :title="title" :show-back="showBack">
          <slot name="title">{{ title }}</slot>
        </ToolBarTitle>
        <div v-if="showOperation" :class="styles.functional">
          <div :class="styles.functionalGroup">
            <slot name="functional" />
          </div>
          <template v-if="showSection">
            <EgDivider
              :class="styles.sectionDivider"
              type="page"
              direction="vertical"
            />
            <div :class="styles.functionalGroup">
              <slot name="section" />
            </div>
          </template>
          <div v-else-if="$slots.operation" :class="styles.operation">
            <slot name="operation" />
          </div>
        </div>
      </div>
      <EgDivider
        v-if="showDivider && scrollDividerReserved"
        :class="styles.divider"
        :hide="!scrollDividerVisible"
      />
    </div>
  </header>
</template>
