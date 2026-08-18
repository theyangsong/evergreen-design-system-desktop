export type ExtensionLayer =
  | 'variants'
  | 'props'
  | 'slots'
  | 'composition'
  | 'scenarios';

export type ComponentDocTier = 'atom' | 'molecule' | 'organism' | 'template' | 'scenes';

export const EXTENSION_LAYER_LABELS: Record<ExtensionLayer, string> = {
  variants: 'Variants',
  props: 'Props',
  slots: 'Slots',
  composition: 'Composition',
  scenarios: 'Scenarios',
};

/** 各层级组件文档「最低交付」扩展层（Variants → Props → Slots → Composition → Scenarios）。 */
export const EXTENSION_MINIMUM_LAYERS: Record<ComponentDocTier, ExtensionLayer[]> = {
  atom: ['props', 'slots'],
  molecule: ['variants', 'props', 'slots'],
  organism: ['variants', 'props', 'slots', 'composition'],
  template: ['variants', 'props', 'slots', 'composition'],
  scenes: ['variants', 'props', 'scenarios'],
};

export type ExtensionLayerStatus = {
  layer: ExtensionLayer;
  met: boolean;
  required: boolean;
};

export function buildExtensionLayerStatus(
  tier: ComponentDocTier,
  layers: Partial<Record<ExtensionLayer, boolean>>,
): ExtensionLayerStatus[] {
  const minimum = new Set(EXTENSION_MINIMUM_LAYERS[tier]);

  return (Object.keys(EXTENSION_LAYER_LABELS) as ExtensionLayer[]).map((layer) => ({
    layer,
    met: Boolean(layers[layer]),
    required: minimum.has(layer),
  }));
}
