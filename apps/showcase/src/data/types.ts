export type CatalogChildItem = {
  id: string;
  label: string;
  /** Standalone showcase route slug (defaults to `id`). */
  pageSlug?: string;
  /** When true, child has its own `/components/:pageSlug` route (not in-page hash). */
  standalonePage?: boolean;
};

export type CatalogItem = {
  name: string;
  slug: string;
  description: string;
  status?: 'implemented' | 'placeholder';
  children?: CatalogChildItem[];
};

export type CatalogSection = {
  title: string;
  items: CatalogItem[];
  groups?: Array<{ title: string; items: CatalogItem[] }>;
};

export type AnchorItem = {
  id: string;
  label: string;
  depth?: 1 | 2 | 3;
  parentSlug?: string;
  anchorId?: string;
  /** Route slug when child is a standalone component page. */
  pageSlug?: string;
  standalonePage?: boolean;
};

export type ScaleSemanticGroup = {
  title: string;
  match: (name: string) => boolean;
};
