import type { AnchorItem, CatalogSection } from '../types';
import { buildCatalogAnchorItems } from '../buildCatalogAnchorItems';
import { componentCatalog } from './catalog';
import { getCatalogChildPageSlug } from './navigation';

export { catalogSectionId } from '../catalogSectionId';

export function buildComponentAnchorItems(catalog: CatalogSection[]): AnchorItem[] {
  return buildCatalogAnchorItems(catalog, getCatalogChildPageSlug);
}

export const componentAnchorItems = buildComponentAnchorItems(componentCatalog);
