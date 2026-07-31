import type { AnchorItem } from '../types';
import { scaleSemanticGroups, toAnchorId } from './scaleSemantic';

const scaleSemanticAnchorItems: AnchorItem[] = scaleSemanticGroups.map((group) => ({
  id: toAnchorId('scale-semantic', group.title),
  label: group.title,
  depth: 2,
}));

export const tokenAnchorItems: AnchorItem[] = [
  { id: 'color-base', label: 'Color Base' },
  { id: 'color-semantic', label: 'Color Semantic' },
  { id: 'scale-base', label: 'Scale Base' },
  { id: 'scale-semantic', label: 'Scale Semantic' },
  ...scaleSemanticAnchorItems,
  { id: 'typography-base', label: 'Typography Base' },
  { id: 'typography-semantic', label: 'Typography Semantic' },
  { id: 'text-style', label: 'Text Style' },
  { id: 'effect-base', label: 'Effect Base' },
  { id: 'effect-semantic', label: 'Effect Semantic' },
];
