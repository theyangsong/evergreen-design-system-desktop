export { default as EgPopup } from './Popup.vue';
export type { PopupUses, PopupAlertVerticalAlign } from './Popup.vue';
export type { ReminderType } from '../../organisms/reminder';
export type { VerifyType } from '../../organisms/verify';
export {
  REMINDER_PANEL_WIDTH_PX,
  resolveReminderPanelWidthPx,
} from '../../organisms/reminder';
export {
  VERIFY_PANEL_WIDTH_PX,
  VERIFY_PANEL_HEIGHT_PX,
  resolveVerifyPanelWidthPx,
  resolveVerifyPanelHeightPx,
} from '../../organisms/verify';
export {
  EgDetail as EgPopupDetail,
  EgDetail,
  type DetailItemData as PopupDetailItemData,
  type DetailSectionData as PopupDetailSectionData,
} from '../../organisms/detail';
