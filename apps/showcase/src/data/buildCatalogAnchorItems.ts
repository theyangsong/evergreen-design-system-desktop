import type { AnchorItem, CatalogChildItem, CatalogSection } from './types';
import { catalogSectionId } from './catalogSectionId';

export type CatalogChildPageSlugResolver = (child: CatalogChildItem) => string;

export function buildCatalogAnchorItems(
  catalog: CatalogSection[],
  resolveChildPageSlug?: CatalogChildPageSlugResolver,
): AnchorItem[] {
  const items: AnchorItem[] = [];

  for (const section of catalog) {
    items.push({
      id: catalogSectionId(section.title),
      label: section.title,
      depth: 1,
    });

    if (section.groups) {
      for (const group of section.groups) {
        for (const item of group.items) {
          items.push({
            id: item.slug,
            label: item.name,
            depth: 2,
          });
        }
      }
    } else {
      for (const item of section.items) {
        items.push({
          id: item.slug,
          label: item.name,
          depth: 2,
        });

        for (const child of item.children ?? []) {
          items.push({
            id: `${item.slug}:${child.id}`,
            label: child.label,
            depth: 3,
            parentSlug: item.slug,
            anchorId: child.id,
            pageSlug: resolveChildPageSlug?.(child) ?? child.pageSlug ?? child.id,
            standalonePage: child.standalonePage,
          });
        }
      }
    }
  }

  return items;
}
