import { catalogSectionId } from '@/data/catalogSectionId';
import { componentCatalog } from '@/data/components/catalog';
import {
  findCatalogChildPage,
  findCatalogItem,
  getMoleculeLandingPageSlug,
} from '@/data/components/navigation';
import type { CatalogItem, CatalogSection } from '@/data/types';

export type ComponentsSidebarFamily = {
  id: string;
  label: string;
  to: string;
};

export type ComponentsSidebarGroup = {
  id: string;
  label: string;
  families: ComponentsSidebarFamily[];
};

export type ComponentsSidebarSection = {
  id: string;
  label: string;
  families?: ComponentsSidebarFamily[];
  groups?: ComponentsSidebarGroup[];
};

/** Organisms · Data 组侧栏小标题（不含 DataGrid 族链接）。 */
const SIDEBAR_GROUP_LABELS: Partial<Record<string, string>> = {
  Data: 'DataGrid',
};

/** 侧栏不展示的组件族（保留右侧 Scenes 等子路由）。 */
const SIDEBAR_EXCLUDED_FAMILY_SLUGS = new Set(['data-grid']);

function mapFamily(item: CatalogItem): ComponentsSidebarFamily {
  return {
    id: item.slug,
    label: item.name,
    to: `/components/${getMoleculeLandingPageSlug(item)}`,
  };
}

function mapSectionFamilies(items: CatalogItem[]): ComponentsSidebarFamily[] {
  return items
    .filter((item) => !SIDEBAR_EXCLUDED_FAMILY_SLUGS.has(item.slug))
    .map(mapFamily);
}

function buildSectionGroups(section: CatalogSection): ComponentsSidebarGroup[] | undefined {
  if (!section.groups?.length) return undefined;

  const sectionId = catalogSectionId(section.title);
  return section.groups.map((group) => ({
    id: `${sectionId}:${catalogSectionId(group.title)}`,
    label: SIDEBAR_GROUP_LABELS[group.title] ?? group.title,
    families: mapSectionFamilies(group.items),
  }));
}

export function buildComponentsSidebarSections(): ComponentsSidebarSection[] {
  return componentCatalog.map((section) => {
    const id = catalogSectionId(section.title);
    const groups = buildSectionGroups(section);

    if (groups) {
      return {
        id,
        label: section.title,
        groups,
      };
    }

    return {
      id,
      label: section.title,
      families: mapSectionFamilies(section.items),
    };
  });
}

export function findComponentsSidebarSectionId(slug: string): string | undefined {
  if (!slug) return undefined;

  const childPage = findCatalogChildPage(slug);
  const familySlug = childPage?.parent.item.slug ?? findCatalogItem(slug)?.item.slug;
  if (!familySlug) return undefined;

  for (const section of componentCatalog) {
    if (section.items.some((item) => item.slug === familySlug)) {
      return catalogSectionId(section.title);
    }
    if (section.groups?.some((group) => group.items.some((item) => item.slug === familySlug))) {
      return catalogSectionId(section.title);
    }
  }

  return undefined;
}

export function findComponentsSidebarFamilyId(slug: string): string {
  if (!slug) return '';

  const childPage = findCatalogChildPage(slug);
  if (childPage) return childPage.parent.item.slug;

  const entry = findCatalogItem(slug);
  if (entry) return entry.item.slug;

  return '';
}
