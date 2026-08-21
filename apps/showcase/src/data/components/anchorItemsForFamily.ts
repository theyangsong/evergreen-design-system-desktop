import type { AnchorItem } from '../types';

export function isFamilyNavItem(item: AnchorItem): boolean {
  return (
    !item.kind &&
    !item.standalonePage &&
    (item.depth === 2 || item.depth === 3)
  );
}

/** 当前组件族在右侧锚点中展示的子项（Variants / Scenes / 子路由等）。 */
export function anchorItemsForFamily(
  familySlug: string,
  items: AnchorItem[],
): AnchorItem[] {
  if (!familySlug) return [];

  const familyIndex = items.findIndex(
    (item) => item.id === familySlug && isFamilyNavItem(item),
  );

  if (familyIndex < 0) {
    return items.filter(
      (item) =>
        !isFamilyNavItem(item)
        && item.depth !== 1
        && (item.parentSlug === familySlug || item.id.startsWith(`${familySlug}:`)),
    );
  }

  const familyIndices = items
    .map((item, index) => (isFamilyNavItem(item) ? index : -1))
    .filter((index) => index >= 0);
  const nextFamilyIndex = familyIndices.find((index) => index > familyIndex) ?? items.length;

  let start = familyIndex + 1;
  const previous = items[familyIndex - 1];
  if (previous?.kind === 'navGroup') {
    start = familyIndex - 1;
  }

  return items
    .slice(start, nextFamilyIndex)
    .filter((item) => !isFamilyNavItem(item) && item.depth !== 1);
}
