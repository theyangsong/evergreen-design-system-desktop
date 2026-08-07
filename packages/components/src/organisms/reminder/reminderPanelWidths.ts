import type { ReminderType } from './Reminder.vue';

/** Figma Reminder 2769:8357 — Popup Box 固定宽度（高度随内容）。 */
export const REMINDER_PANEL_WIDTH_PX: Record<ReminderType, number> = {
  info: 280,
  echo: 460,
};

export function resolveReminderPanelWidthPx(type: ReminderType): number {
  return REMINDER_PANEL_WIDTH_PX[type];
}
