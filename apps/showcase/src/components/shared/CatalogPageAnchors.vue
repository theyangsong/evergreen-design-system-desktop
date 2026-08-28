<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { AnchorItem } from '@/data/types';
import PageAnchorLinkNav from './PageAnchorLinkNav.vue';
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

type CatalogNavSection = {
  id: string;
  heading: string;
  items: AnchorItem[];
};

function isNavLabel(item: AnchorItem) {
  return item.kind === 'navGroup' || item.kind === 'navSection' || item.kind === 'navSubgroup';
}

/** Flat catalog 页（Animations / Patterns）：depth-2 家族行即路由项。 */
function normalizeCatalogLinkItem(item: AnchorItem): AnchorItem {
  if (item.standalonePage && item.pageSlug) {
    return item;
  }

  if (!item.kind && item.depth === 2) {
    return {
      ...item,
      standalonePage: true,
      pageSlug: item.pageSlug ?? item.id,
    };
  }

  return item;
}

function buildCatalogNavSections(items: AnchorItem[]): CatalogNavSection[] {
  const sections: CatalogNavSection[] = [];
  let current: CatalogNavSection | null = null;

  for (const item of items) {
    if (item.depth === 1 && !item.kind) {
      current = { id: item.id, heading: item.label, items: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      continue;
    }

    current.items.push(isNavLabel(item) ? item : normalizeCatalogLinkItem(item));
  }

  return sections;
}

const navSections = computed(() => buildCatalogNavSections(props.items));

function isLinkActive(item: AnchorItem) {
  return activeNavId.value === item.id;
}

function isHiddenSidebarBody(item: AnchorItem) {
  return Boolean(item.hideSidebarBody);
}

function anchorNavLabel(item: AnchorItem) {
  return item.label;
}
</script>

<template>
  <aside :class="[styles.anchors, styles.componentsAnchors]" :aria-label="ariaLabel">
    <div
      v-for="section in navSections"
      :key="section.id"
      :class="styles.navCategory"
    >
      <span :class="styles.anchorsHeading">{{ section.heading }}</span>

      <div :class="styles.navSection">
        <PageAnchorLinkNav
          :items="section.items"
          :active-nav-id="activeNavId"
          :route-prefix="routePrefix"
          :is-link-active="isLinkActive"
          :is-nav-label="isNavLabel"
          :anchor-nav-label="anchorNavLabel"
          :is-hidden-sidebar-body="isHiddenSidebarBody"
        />
      </div>
    </div>
  </aside>
</template>
