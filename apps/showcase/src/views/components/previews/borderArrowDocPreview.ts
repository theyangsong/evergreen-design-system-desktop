import docStyles from './borderArrowDocPreview.module.css';

export type BorderArrowDocEvent = 'full' | 'default' | 'hover' | 'active' | 'focus';

export function isBorderArrowInteractiveEvent(event: unknown): boolean {
  return String(event ?? 'full') === 'full';
}

/** Showcase 强制态：完整 = 真实交互；其余 = 静态快照。 */
export function borderArrowEventHostClass(event: unknown): string | undefined {
  switch (String(event ?? 'full')) {
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

export function readBorderArrowDocEvent(value: unknown): BorderArrowDocEvent {
  const event = String(value ?? 'full');
  if (
    event === 'full' ||
    event === 'default' ||
    event === 'hover' ||
    event === 'active' ||
    event === 'focus'
  ) {
    return event;
  }
  return 'full';
}
