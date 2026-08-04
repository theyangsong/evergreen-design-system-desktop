import ListFieldScenePreview from './ListFieldScenePreview.vue';
import { listFieldSceneSlugs } from '@/data/scenes';

export type ScenePreviewEntry = {
  slug: string;
  component: typeof ListFieldScenePreview;
};

export const scenePreviews: ScenePreviewEntry[] = listFieldSceneSlugs.map((slug) => ({
  slug,
  component: ListFieldScenePreview,
}));

export const scenePreviewBySlug = Object.fromEntries(
  scenePreviews.map((entry) => [entry.slug, entry]),
) as Record<string, ScenePreviewEntry>;

export function resolveScenePreview(slug: string) {
  return scenePreviewBySlug[slug];
}
