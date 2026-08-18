import type { CatalogChildNavRole } from './types';

export const CATALOG_NAV_ROLE_GROUP_LABELS: Record<
  Exclude<CatalogChildNavRole, 'standard'>,
  string
> = {
  variant: 'Variants',
  scenes: 'Scenes',
  combo: 'Combo',
};

export function resolveCatalogChildNavRole(
  navRole: CatalogChildNavRole | undefined,
): CatalogChildNavRole {
  return navRole ?? 'standard';
}
