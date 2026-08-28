import type { CatalogChildItem } from './types';

export function catalogBody(
  id: string,
  label: string,
  pageSlug?: string,
): CatalogChildItem {
  return { id, label, standalonePage: true, pageSlug };
}

export function catalogScenesSection(id: string): CatalogChildItem {
  return { id, label: 'Scenes', navSection: true };
}

export const catalogSceneExtendingLabel = '场景化拓展中...';

/** Placeholder scene child when a Scenes section has no real routes yet. */
export function catalogExtendingScene(scenesSectionId: string): CatalogChildItem {
  const id = `${scenesSectionId}-extending`;
  return {
    id,
    label: catalogSceneExtendingLabel,
    navParent: scenesSectionId,
    standalonePage: true,
    pageSlug: id,
    emptyScenesPlaceholder: true,
  };
}

export function catalogScene(
  id: string,
  label: string,
  scenesSectionId: string,
  pageSlug?: string,
): CatalogChildItem {
  return { id, label, navParent: scenesSectionId, standalonePage: true, pageSlug };
}

export function catalogSubgroup(id: string, label: string): CatalogChildItem {
  return { id, label, navSubgroup: true };
}

export function catalogFamilyBodyAndScenes(
  body: CatalogChildItem,
  scenesSectionId: string,
  scenes: Array<{ id: string; label: string; pageSlug?: string }>,
): CatalogChildItem[] {
  const sceneItems =
    scenes.length > 0
      ? scenes.map((scene) => catalogScene(scene.id, scene.label, scenesSectionId, scene.pageSlug))
      : [catalogExtendingScene(scenesSectionId)];

  return [body, catalogScenesSection(scenesSectionId), ...sceneItems];
}

export function catalogBodyOnly(id: string, label: string, pageSlug?: string): CatalogChildItem[] {
  return [catalogBody(id, label, pageSlug)];
}

/** Body + empty Scenes section (EverGreen `…` placeholder). */
export function catalogBodyWithScenesSection(
  bodyId: string,
  bodyLabel: string,
  scenesSectionId: string,
  pageSlug?: string,
): CatalogChildItem[] {
  return [
    catalogBody(bodyId, bodyLabel, pageSlug),
    catalogScenesSection(scenesSectionId),
    catalogExtendingScene(scenesSectionId),
  ];
}

export function catalogBusinessPresetScenes(
  scenesSectionId: string,
  slugPrefix: string,
  presets: readonly ('cregis' | 'udun')[] = ['cregis', 'udun'],
): CatalogChildItem[] {
  return presets.map((preset) =>
    catalogScene(
      `${slugPrefix}-scene-${preset}`,
      preset === 'cregis' ? 'Cregis' : 'UDun',
      scenesSectionId,
    ),
  );
}

/** Body + Scenes；仅注册已有实现的 Cregis / UDun 路由，无 preset 时走 `catalogExtendingScene`。 */
export function catalogFamilyBodyWithSelectiveBusinessPresets(
  bodyId: string,
  bodyLabel: string,
  familySlug: string,
  presets: readonly ('cregis' | 'udun')[],
  pageSlug?: string,
): CatalogChildItem[] {
  const sectionId = `${familySlug}-scenes`;
  const sceneItems =
    presets.length > 0
      ? catalogBusinessPresetScenes(sectionId, familySlug, presets)
      : [catalogExtendingScene(sectionId)];

  return [catalogBody(bodyId, bodyLabel, pageSlug), catalogScenesSection(sectionId), ...sceneItems];
}

export function catalogFamilyBodyWithBusinessPresets(
  bodyId: string,
  bodyLabel: string,
  familySlug: string,
  pageSlug?: string,
): CatalogChildItem[] {
  return catalogFamilyBodyWithSelectiveBusinessPresets(
    bodyId,
    bodyLabel,
    familySlug,
    ['cregis', 'udun'],
    pageSlug,
  );
}

/** Scene page nested under a `navSubgroup` row (e.g. Flotation Box → Slot). */
export function catalogSubgroupScene(
  id: string,
  label: string,
  subgroupId: string,
  pageSlug?: string,
): CatalogChildItem {
  return { id, label, navParent: subgroupId, standalonePage: true, pageSlug };
}
