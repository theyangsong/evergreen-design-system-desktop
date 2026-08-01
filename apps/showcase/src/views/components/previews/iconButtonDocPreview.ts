import { showcaseDefaultIconName } from '@/views/shared/showcaseIcons';
import { iconButtonEventRows } from '@/data/showcasePropLabels';
import docStyles from './iconButtonDocPreview.module.css';

/** Figma iCons Container Simple — default symbol eds-add (node 173:203). */
export const iconButtonDocSymbolName = showcaseDefaultIconName;

export type IconButtonDocSize = 'lg' | 'md' | 'sm' | 'xs';

export type IconButtonDocEvent = 'full' | 'default' | 'hover' | 'active' | 'focus';

export { iconButtonEventRows };

/** 完整：单个组件，保留 hover / active / focus 真实交互。 */
export function isIconButtonInteractiveEvent(event: unknown): boolean {
  return String(event ?? 'full') === 'full';
}

export function iconButtonEventHostClass(event: unknown): string | undefined {
  switch (String(event)) {
    case 'hover':
      return docStyles.eventHover;
    case 'active':
      return docStyles.eventActive;
    case 'focus':
      return docStyles.eventFocus;
    default:
      return undefined;
  }
}
