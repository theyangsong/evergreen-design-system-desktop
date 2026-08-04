import {
  findCatalogChildPage,
  findCatalogItem,
  getCatalogRouteSlug,
  isValidCatalogSlug,
  iterCatalogItems,
  type CatalogItemLocation,
} from '../catalogNavigation';
import { scenesCatalog } from './catalog';

export type { CatalogItemLocation };

export const defaultSceneSlug = 'data-refresh';

export function getSceneRouteSlug(path: string, paramSlug: unknown): string {
  return getCatalogRouteSlug(path, 'scenes', paramSlug);
}

export function findSceneCatalogItem(slug: string): CatalogItemLocation | undefined {
  return findCatalogItem(scenesCatalog, slug);
}

export function findSceneCatalogChildPage(slug: string) {
  return findCatalogChildPage(scenesCatalog, slug);
}

export function isValidSceneSlug(slug: string): boolean {
  return isValidCatalogSlug(scenesCatalog, slug);
}

export function iterSceneCatalogItems() {
  return iterCatalogItems(scenesCatalog);
}
