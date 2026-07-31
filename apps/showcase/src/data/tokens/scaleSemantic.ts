import type { ScaleSemanticGroup } from '../types';

export function toAnchorId(prefix: string, title: string) {
  return `${prefix}-${title.toLowerCase().replace(/\s+/g, '-')}`;
}

export const scaleSemanticGroups: ScaleSemanticGroup[] = [
  { title: 'Spacing', match: (name) => name.startsWith('spacing-') },
  { title: 'Radius', match: (name) => name.startsWith('radius-') },
  {
    title: 'Stroke',
    match: (name) =>
      ['stroke-xs', 'stroke-sm', 'stroke-md', 'stroke-lg', 'stroke-xl'].includes(name),
  },
  { title: 'Corner Smoothing', match: (name) => name === 'corner-smoothing' },
  { title: 'Blur', match: (name) => name.startsWith('blur-') },
  { title: 'Depth', match: (name) => name.startsWith('depth-') },
  {
    title: 'Icon',
    match: (name) => ['icon-sm', 'icon-md', 'icon-lg', 'icon-xl'].includes(name),
  },
  {
    title: 'Avatar',
    match: (name) => ['avatar-sm', 'avatar-md', 'avatar-lg', 'avatar-xl'].includes(name),
  },
  {
    title: 'Graphic',
    match: (name) => ['graphic-sm', 'graphic-md', 'graphic-lg', 'graphic-xl'].includes(name),
  },
];
