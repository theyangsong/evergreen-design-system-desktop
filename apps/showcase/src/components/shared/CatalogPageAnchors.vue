<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import type { AnchorItem } from '@/data/types';
import styles from './PageAnchors.module.css';

const props = withDefaults(
  defineProps<{
    items: AnchorItem[];
    routePrefix: string;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: 'Page navigation',
  },
);

const route = useRoute();

const activeSlug = computed(() => {
  const match = route.path.match(new RegExp(`^\\/${props.routePrefix}\\/([^/#?]+)`));
  return match?.[1] ?? '';
});

const activeNavId = computed(() => activeSlug.value);

const listRef = ref<HTMLElement | null>(null);
const linkRefs = new Map<string, HTMLElement>();
const indicatorTop = ref(0);
const indicatorHeight = ref(0);
const indicatorVisible = ref(false);
const indicatorMoveTransition = ref(true);
let resizeObserver: ResizeObserver | undefined;

function setLinkRef(navId: string, element: Element | ComponentPublicInstance | null) {
  const node =
    element instanceof HTMLElement
      ? element
      : (element as ComponentPublicInstance | null)?.$el;

  if (node instanceof HTMLElement) {
    linkRefs.set(navId, node);
    return;
  }

  linkRefs.delete(navId);
}

function syncIndicatorPosition() {
  const list = listRef.value;
  const link = activeNavId.value ? linkRefs.get(activeNavId.value) : undefined;

  if (!list || !link) {
    indicatorVisible.value = false;
    return;
  }

  indicatorTop.value = link.offsetTop;
  indicatorHeight.value = link.offsetHeight;
  indicatorVisible.value = true;
}

function syncIndicatorWithAnimation(previousNavId = '') {
  if (!activeNavId.value) {
    indicatorMoveTransition.value = false;
    indicatorVisible.value = false;
    return;
  }

  indicatorMoveTransition.value = Boolean(previousNavId);
  syncIndicatorPosition();
  indicatorVisible.value = true;
}

function sceneNavTo(slug: string) {
  return `/${props.routePrefix}/${slug}`;
}

function isLinkActive(item: AnchorItem) {
  return item.depth === 2 && activeNavId.value === item.id;
}

function isNavLabel(item: AnchorItem) {
  return item.depth === 1 || item.kind === 'navGroup' || item.kind === 'navSection' || item.kind === 'navSubgroup';
}

watch(activeNavId, (_nextId, previousId) => {
  nextTick(() => {
    syncIndicatorWithAnimation(previousId);
  });
});

onMounted(() => {
  nextTick(() => {
    syncIndicatorWithAnimation('');
  });

  resizeObserver = new ResizeObserver(() => {
    syncIndicatorPosition();
  });

  if (listRef.value) {
    resizeObserver.observe(listRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <aside :class="styles.anchors" :aria-label="ariaLabel">
    <nav ref="listRef" :class="styles.nav">
      <div
        :class="[
          styles.activeIndicator,
          indicatorVisible && styles.activeIndicatorVisible,
          indicatorMoveTransition && styles.activeIndicatorMove,
        ]"
        :style="{
          transform: `translateY(${indicatorTop}px)`,
          height: `${indicatorHeight}px`,
        }"
        aria-hidden="true"
      />

      <template v-for="item in items" :key="item.id">
        <span
          v-if="isNavLabel(item)"
          :class="styles.navLabel"
        >
          {{ item.label }}
        </span>

        <RouterLink
          v-else-if="item.depth === 2"
          :ref="(element) => setLinkRef(item.id, element)"
          :to="sceneNavTo(item.id)"
          :class="[
            styles.link,
            styles.linkNested,
            isLinkActive(item) && styles.linkActive,
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>
  </aside>
</template>
