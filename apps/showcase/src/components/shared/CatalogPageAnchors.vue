<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import type { AnchorItem } from '@/data/types';
import { useNavScrollFade } from '@/composables/useNavScrollFade';
import styles from './ComponentsPageAnchors.module.css';

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
const scrollRef = ref<HTMLElement | null>(null);
const linkRefs = new Map<string, HTMLElement>();
const indicatorTop = ref(0);
const indicatorLeft = ref(0);
const indicatorWidth = ref(0);
const indicatorHeight = ref(0);
const indicatorVisible = ref(false);
const indicatorMoveTransition = ref(true);
let resizeObserver: ResizeObserver | undefined;

const { fadeTop, fadeBottom, updateFade } = useNavScrollFade(scrollRef);

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

  const listRect = list.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  indicatorTop.value = linkRect.top - listRect.top;
  indicatorLeft.value = linkRect.left - listRect.left;
  indicatorWidth.value = linkRect.width;
  indicatorHeight.value = linkRect.height;
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

watch(activeNavId, (_nextId, previousId) => {
  nextTick(() => {
    syncIndicatorWithAnimation(previousId);
  });
}, { flush: 'post' });

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

  updateFade();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <aside
    :class="[
      styles.anchors,
      fadeTop && styles.anchorsFadeTop,
      fadeBottom && styles.anchorsFadeBottom,
    ]"
    :aria-label="ariaLabel"
  >
    <div
      ref="scrollRef"
      :class="styles.navScroll"
      @scroll="updateFade"
    >
      <nav ref="listRef" :class="styles.nav">
        <div
          :class="[
            styles.activeIndicator,
            indicatorVisible && styles.activeIndicatorVisible,
            indicatorMoveTransition && styles.activeIndicatorMove,
          ]"
          :style="{
            transform: `translate(${indicatorLeft}px, ${indicatorTop}px)`,
            width: `${indicatorWidth}px`,
            height: `${indicatorHeight}px`,
          }"
          aria-hidden="true"
        />

        <template v-for="item in items" :key="item.id">
          <span
            v-if="item.depth === 1"
            :class="styles.sectionLabel"
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
    </div>
  </aside>
</template>
