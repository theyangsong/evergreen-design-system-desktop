<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { componentAnchorItems } from '@/data/components';
import { anchorItemsForFamily } from '@/data/components/anchorItemsForFamily';
import { findComponentsSidebarFamilyId } from '@/layout/buildComponentsSidebarSections';
import {
  findCatalogChildPage,
  findCatalogItem,
  getCatalogChildAnchorIds,
  getComponentRouteSlug,
  moleculeUsesChildPages,
} from '@/data/components/navigation';
import { useScrollSpy } from '@/composables/useScrollSpy';
import styles from './PageAnchors.module.css';

const route = useRoute();

const activeSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const activeFamilySlug = computed(() => findComponentsSidebarFamilyId(activeSlug.value));

const scopedAnchorItems = computed(() =>
  anchorItemsForFamily(activeFamilySlug.value, componentAnchorItems),
);

const childPage = computed(() => findCatalogChildPage(activeSlug.value));

const scrollSpyMoleculeSlug = computed(() => {
  if (childPage.value) return '';
  const entry = findCatalogItem(activeSlug.value);
  if (entry && moleculeUsesChildPages(entry.item)) return '';
  return activeSlug.value;
});

const childAnchorIds = computed(() =>
  scrollSpyMoleculeSlug.value ? getCatalogChildAnchorIds(scrollSpyMoleculeSlug.value) : [],
);

const { activeId: scrollActiveId, refresh: refreshScrollSpy } = useScrollSpy(childAnchorIds);

const activeNavId = computed(() => {
  if (childPage.value) {
    const { parent, child } = childPage.value;
    if (child.hideSidebarBody) {
      return parent.item.slug;
    }
    return `${parent.item.slug}:${child.id}`;
  }

  if (childAnchorIds.value.length && scrollActiveId.value) {
    return `${activeSlug.value}:${scrollActiveId.value}`;
  }

  return activeSlug.value;
});

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

function isHiddenSidebarBody(item: (typeof componentAnchorItems)[number]) {
  return Boolean(item.hideSidebarBody);
}

function isLinkActive(item: (typeof scopedAnchorItems.value)[number]) {
  if (item.depth && item.depth >= 2 && item.depth <= 5 && item.standalonePage) {
    return activeNavId.value === item.id;
  }

  if (childAnchorIds.value.length) {
    return false;
  }

  return activeNavId.value === item.id;
}

function isNavLabel(item: (typeof scopedAnchorItems.value)[number]) {
  return item.kind === 'navGroup' || item.kind === 'navSection' || item.kind === 'navSubgroup';
}

function anchorNavLabel(item: (typeof scopedAnchorItems.value)[number]) {
  if (item.kind === 'navSection') return '场景化';
  return item.label;
}

watch(activeNavId, (_nextId, previousId) => {
  nextTick(() => {
    syncIndicatorWithAnimation(previousId);
  });
});

watch(activeSlug, () => {
  nextTick(() => {
    void refreshScrollSpy();
  });
});

onMounted(() => {
  nextTick(() => {
    void refreshScrollSpy();
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
  <aside :class="[styles.anchors, styles.componentsAnchors]" aria-label="Components navigation">
    <span :class="styles.anchorsHeading">本体</span>
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

      <template v-for="item in scopedAnchorItems" :key="item.id">
        <span
          v-if="isNavLabel(item)"
          :class="[
            styles.navLabel,
            item.kind === 'navSection' && styles.navSectionLabel,
          ]"
        >
          {{ anchorNavLabel(item) }}
        </span>

        <RouterLink
          v-else-if="
            item.standalonePage &&
            item.pageSlug &&
            !isHiddenSidebarBody(item)
          "
          :ref="(element) => setLinkRef(item.id, element)"
          :to="`/components/${item.pageSlug}`"
          :class="[
            styles.link,
            isLinkActive(item) && styles.linkActive,
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>
  </aside>
</template>
