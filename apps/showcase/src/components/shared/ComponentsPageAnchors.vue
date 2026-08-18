<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { componentAnchorItems } from '@/data/components';
import { buildCatalogNavSegments } from '@/data/buildCatalogNavSegments';
import {
  findCatalogChildPage,
  findCatalogItem,
  getCatalogChildAnchorIds,
  getComponentRouteSlug,
  getMoleculeLandingPageSlug,
  moleculeUsesChildPages,
} from '@/data/components/navigation';
import { useScrollSpy } from '@/composables/useScrollSpy';
import { useNavScrollFade } from '@/composables/useNavScrollFade';
import styles from './ComponentsPageAnchors.module.css';

const route = useRoute();

const activeSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

const navSegments = computed(() => buildCatalogNavSegments(componentAnchorItems));

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

function moleculeNavTo(slug: string) {
  const entry = findCatalogItem(slug);
  if (entry && moleculeUsesChildPages(entry.item)) {
    return `/components/${getMoleculeLandingPageSlug(entry.item)}`;
  }
  return { name: 'component-detail', params: { slug } };
}

function isFamilyNavItem(item: (typeof componentAnchorItems)[number]) {
  return (
    !item.kind &&
    !item.standalonePage &&
    (item.depth === 2 || item.depth === 3)
  );
}

function isHiddenSidebarBody(item: (typeof componentAnchorItems)[number]) {
  return Boolean(item.hideSidebarBody);
}

function isLinkActive(item: (typeof componentAnchorItems)[number]) {
  if (item.depth && item.depth >= 2 && item.depth <= 5 && item.standalonePage) {
    return activeNavId.value === item.id;
  }

  if (isFamilyNavItem(item)) {
    if (childPage.value) {
      const bodySlug = getMoleculeLandingPageSlug(childPage.value.parent.item);
      if (activeSlug.value !== bodySlug) {
        return false;
      }
      return childPage.value.parent.item.slug === item.id;
    }
    if (childAnchorIds.value.length) {
      return false;
    }
    return activeNavId.value === item.id;
  }

  if (childAnchorIds.value.length) {
    return false;
  }

  return activeNavId.value === item.id;
}

watch(activeNavId, (_nextId, previousId) => {
  nextTick(() => {
    syncIndicatorWithAnimation(previousId);
  });
}, { flush: 'post' });

watch(activeSlug, () => {
  nextTick(() => {
    void refreshScrollSpy();
    syncIndicatorWithAnimation('');
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
    aria-label="Components navigation"
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

      <template v-for="segment in navSegments" :key="segment.type === 'item' ? segment.item.id : `scene-branch-${segment.items[0]?.id}`">
        <template v-if="segment.type === 'item'">
          <span
            v-if="segment.item.depth === 1"
            :class="styles.sectionLabel"
          >
            {{ segment.item.label }}
          </span>

          <RouterLink
            v-else-if="isFamilyNavItem(segment.item)"
            :ref="(element) => setLinkRef(segment.item.id, element)"
            :to="moleculeNavTo(segment.item.id)"
            :class="[
              styles.link,
              styles.linkNested,
              isLinkActive(segment.item) && styles.linkActive,
            ]"
          >
            {{ segment.item.label }}
          </RouterLink>

          <span
            v-else-if="segment.item.kind === 'navGroup'"
            :class="[
              styles.navGroupLabel,
              segment.item.depth === 2 && styles.organGroupLabel,
            ]"
          >
            {{ segment.item.label }}
          </span>

          <span
            v-else-if="segment.item.kind === 'navSection' || segment.item.kind === 'navSubgroup'"
            :class="[
              styles.link,
              styles.linkNested,
              styles.linkNestedDeep,
              styles.navSectionLabel,
              segment.item.kind === 'navSubgroup' && styles.navSubgroupLabel,
            ]"
          >
            {{ segment.item.label }}
          </span>

          <RouterLink
            v-else-if="
              segment.item.standalonePage &&
              segment.item.pageSlug &&
              !isHiddenSidebarBody(segment.item)
            "
            :ref="(element) => setLinkRef(segment.item.id, element)"
            :to="`/components/${segment.item.pageSlug}`"
            :class="[
              styles.link,
              styles.linkNested,
              styles.linkNestedDeep,
              isLinkActive(segment.item) && styles.linkActive,
            ]"
          >
            {{ segment.item.label }}
          </RouterLink>
        </template>

        <div v-else :class="styles.sceneBranch">
          <RouterLink
            v-for="item in segment.items"
            :key="item.id"
            :ref="(element) => setLinkRef(item.id, element)"
            :to="`/components/${item.pageSlug}`"
            :class="[
              styles.link,
              styles.linkNested,
              isLinkActive(item) && styles.linkActive,
            ]"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </template>
      </nav>
    </div>
  </aside>
</template>
