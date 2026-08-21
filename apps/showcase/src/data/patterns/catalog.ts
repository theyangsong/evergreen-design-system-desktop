import type { CatalogSection } from '../types';
import { scenesCatalog } from '../scenes/catalog';

/** EverGreen Patterns — 可复用页面 / 数据组合（含原 Scenes list-field 等）。 */
export const patternsCatalog: CatalogSection[] = [
  {
    title: 'Data',
    items: [
      ...(scenesCatalog.find((section) => section.title === 'List Fields')?.items ?? []),
    ],
  },
  {
    title: 'Forms',
    items: [
      {
        name: 'Forms',
        slug: 'forms',
        description: 'Reusable form layouts and field groups.',
        status: 'placeholder',
      },
    ],
  },
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Dashboard',
        slug: 'dashboard',
        description: 'Dashboard page composition patterns.',
        status: 'placeholder',
      },
    ],
  },
  {
    title: 'Search',
    items: [
      {
        name: 'Search',
        slug: 'search',
        description: 'Search results and filter page patterns.',
        status: 'placeholder',
      },
    ],
  },
  {
    title: 'Consistency',
    items: [
      ...(scenesCatalog.find((section) => section.title === 'Consistency')?.items ?? []),
    ],
  },
];

export const defaultPatternSlug = 'list-field-currency';

export function findPatternCatalogItem(slug: string) {
  for (const section of patternsCatalog) {
    const item = section.items.find((entry) => entry.slug === slug);
    if (item) {
      return { section, item };
    }
  }
  return undefined;
}

export function isValidPatternSlug(slug: string): boolean {
  return findPatternCatalogItem(slug) !== undefined;
}
