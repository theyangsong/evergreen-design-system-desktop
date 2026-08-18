import type { AnchorItem } from './types';

export type CatalogNavSegment =
  | { type: 'item'; item: AnchorItem }
  | { type: 'sceneBranch'; items: AnchorItem[] };

function isSceneBranchLink(item: AnchorItem) {
  return Boolean(item.standalonePage && item.navParent);
}

export function buildCatalogNavSegments(items: AnchorItem[]): CatalogNavSegment[] {
  const segments: CatalogNavSegment[] = [];
  let sceneBranch: AnchorItem[] = [];

  const flushSceneBranch = () => {
    if (!sceneBranch.length) return;
    segments.push({ type: 'sceneBranch', items: sceneBranch });
    sceneBranch = [];
  };

  for (const item of items) {
    if (isSceneBranchLink(item)) {
      sceneBranch.push(item);
      continue;
    }

    flushSceneBranch();
    segments.push({ type: 'item', item });
  }

  flushSceneBranch();
  return segments;
}
