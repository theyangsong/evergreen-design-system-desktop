export { default as EgPopup } from './Popup.vue';
export type { PopupUses, PopupAlertVerticalAlign } from './Popup.vue';
export type { DialogType } from '../../organisms/dialog';
/** @deprecated Use DialogType */
export type { ReminderType } from '../../organisms/dialog';
export type { VerifyType } from '../../organisms/verify';
export {
  DIALOG_PANEL_WIDTH_PX,
  resolveDialogPanelWidthPx,
  REMINDER_PANEL_WIDTH_PX,
  resolveReminderPanelWidthPx,
} from '../../organisms/dialog';
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
