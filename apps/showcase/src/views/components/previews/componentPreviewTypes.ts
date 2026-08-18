import type { Component } from 'vue';

export type ComponentPreviewEntry = {
  slug: string;
  title: string;
  component: Component;
  /** Component doc layout: no molecule lead; hide doc h2 when it matches page title. */
  usesComponentDocHeader?: boolean;
};
