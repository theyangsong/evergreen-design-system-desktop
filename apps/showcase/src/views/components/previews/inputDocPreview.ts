import {
  showcaseIconButtonEventLabels,
  tokenLabel,
} from '@/data/showcasePropLabels';
import docStyles from './inputDocPreview.module.css';

export const inputInteractionLabels = {
  ...showcaseIconButtonEventLabels,
  disabled: tokenLabel('禁用', 'disabled'),
  readonly: tokenLabel('只读', 'readonly'),
} as const;

export const INPUT_DOC_EVENTS = [
  'full',
  'default',
  'hover',
  'active',
  'focus',
  'disabled',
  'readonly',
] as const;

export type InputDocEvent = (typeof INPUT_DOC_EVENTS)[number];

/** 完整：单个组件，保留 hover / focus 等真实交互。 */
export function isInputInteractiveEvent(event: unknown): boolean {
  return readInputDocEvent(event) === 'full';
}

export function readInputDocEvent(value: unknown): InputDocEvent {
  const event = String(value ?? 'full');
  if ((INPUT_DOC_EVENTS as readonly string[]).includes(event)) {
    return event as InputDocEvent;
  }
  return 'full';
}

/** Showcase 强制态：完整 = 真实交互；其余 = 静态快照。 */
export function inputEventHostClass(event: unknown): string | undefined {
  switch (readInputDocEvent(event)) {
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

export function inputEventSnapshotHostClass(event: unknown): string | undefined {
  return isInputInteractiveEvent(event) ? undefined : docStyles.eventSnapshot;
}

export function inputSnapshotModelValue(
  event: InputDocEvent,
  placeholder: string,
): string {
  switch (event) {
    case 'focus':
    case 'active':
      return '123456';
    case 'disabled':
      return placeholder;
    case 'readonly':
      return '只读内容';
    default:
      return '';
  }
}

export function inputSnapshotDisabled(event: InputDocEvent): boolean {
  return event === 'disabled';
}

export function inputSnapshotReadonly(event: InputDocEvent): boolean {
  return event === 'readonly';
}
