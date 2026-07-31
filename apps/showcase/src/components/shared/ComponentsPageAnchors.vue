<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { componentAnchorItems } from '@/data/components';
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
import { usePreventScrollChaining } from '@/composables/usePreventScrollChaining';
import styles from './ComponentsPageAnchors.module.css';

const route = useRoute();
const router = useRouter();

const activeSlug = computed(() => getComponentRouteSlug(route.path, route.params.slug));

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
const indicatorHeight = ref(0);
const indicatorVisible = ref(false);
const indicatorMoveTransition = ref(true);
let resizeObserver: ResizeObserver | undefined;

const { fadeTop, fadeBottom, updateFade } = useNavScrollFade(scrollRef);

usePreventScrollChaining(scrollRef);

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

async function scrollToAnchor(anchorId: string, behavior: ScrollBehavior = 'smooth') {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await nextTick();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior, block: 'start' });
      return true;
    }
  }

  return false;
}

async function scrollToChildSection(event: MouseEvent, parentSlug: string, anchorId: string) {
  event.preventDefault();

  if (activeSlug.value !== parentSlug) {
    await router.push({
      name: 'component-detail',
      params: { slug: parentSlug },
      hash: `#${anchorId}`,
    });
    return;
  }

  await router.replace({ hash: `#${anchorId}` });
  await scrollToAnchor(anchorId);
}

function moleculeNavTo(slug: string) {
  const entry = findCatalogItem(slug);
  if (entry && moleculeUsesChildPages(entry.item)) {
    return `/components/${getMoleculeLandingPageSlug(entry.item)}`;
  }
  return { name: 'component-detail', params: { slug } };
}

function isLinkActive(item: (typeof componentAnchorItems)[number]) {
  if (item.depth === 3) {
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
          transform: `translateY(${indicatorTop}px)`,
          height: `${indicatorHeight}px`,
        }"
        aria-hidden="true"
      />

      <template v-for="item in componentAnchorItems" :key="item.id">
        <span
          v-if="item.depth === 1"
          :class="styles.sectionLabel"
        >
          {{ item.label }}
        </span>

        <RouterLink
          v-else-if="item.depth === 2"
          :ref="(element) => setLinkRef(item.id, element)"
          :to="moleculeNavTo(item.id)"
          :class="[
            styles.link,
            styles.linkNested,
            isLinkActive(item) && styles.linkActive,
          ]"
        >
          {{ item.label }}
        </RouterLink>

        <RouterLink
          v-else-if="item.depth === 3 && item.standalonePage && item.pageSlug"
          :ref="(element) => setLinkRef(item.id, element)"
          :to="`/components/${item.pageSlug}`"
          :class="[
            styles.link,
            styles.linkNested,
            styles.linkNestedDeep,
            isLinkActive(item) && styles.linkActive,
          ]"
        >
          {{ item.label }}
        </RouterLink>

        <a
          v-else-if="item.depth === 3 && item.parentSlug && item.anchorId"
          :ref="(element) => setLinkRef(item.id, element as Element | null)"
          :href="`/components/${item.parentSlug}#${item.anchorId}`"
          :class="[
            styles.link,
            styles.linkNested,
            styles.linkNestedDeep,
            isLinkActive(item) && styles.linkActive,
          ]"
          @click="scrollToChildSection($event, item.parentSlug, item.anchorId)"
        >
          {{ item.label }}
        </a>
      </template>
      </nav>
    </div>
  </aside>
</template>
