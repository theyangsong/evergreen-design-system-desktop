import type { CatalogChildItem, CatalogItem, CatalogSection } from './types';

export type CatalogItemLocation = {
  section: CatalogSection;
  item: CatalogItem;
};

export type CatalogChildPageLocation = {
  parent: CatalogItemLocation;
  child: CatalogChildItem;
};

export function getCatalogChildPageSlug(child: CatalogChildItem): string {
  return child.pageSlug ?? child.id;
}

export function iterCatalogItems(catalog: CatalogSection[]): CatalogItemLocation[] {
  const entries: CatalogItemLocation[] = [];

  for (const section of catalog) {
    if (section.groups) {
      for (const group of section.groups) {
        for (const item of group.items) {
          entries.push({ section, item });
        }
      }
    }

    for (const item of section.items) {
      entries.push({ section, item });
    }
  }

  return entries;
}

export function findCatalogItem(
  catalog: CatalogSection[],
  slug: string,
): CatalogItemLocation | undefined {
  return iterCatalogItems(catalog).find((entry) => entry.item.slug === slug);
}

export function findCatalogChildPage(
  catalog: CatalogSection[],
  slug: string,
): CatalogChildPageLocation | undefined {
  for (const parent of iterCatalogItems(catalog)) {
    for (const child of parent.item.children ?? []) {
      if (getCatalogChildPageSlug(child) === slug) {
        return { parent, child };
      }
    }
  }
  return undefined;
}

export function isValidCatalogSlug(catalog: CatalogSection[], slug: string): boolean {
  if (findCatalogItem(catalog, slug)) return true;
  return findCatalogChildPage(catalog, slug) !== undefined;
}

export function getCatalogRouteSlug(path: string, routePrefix: string, paramSlug: unknown): string {
  if (typeof paramSlug === 'string' && paramSlug.length > 0) {
    return paramSlug;
  }
  const pattern = new RegExp(`^\\/${routePrefix}\\/([^/#?]+)`);
  const match = path.match(pattern);
  return match?.[1] ?? '';
}
