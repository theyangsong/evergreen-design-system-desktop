import type { InjectionKey, Ref } from 'vue';

/** AnchoredTooltip（wrap-tooltip=false）向 EgPopover 注入进出场 active。 */
export const POPOVER_MOTION_ACTIVE_KEY: InjectionKey<Ref<boolean>> = Symbol('edsPopoverMotionActive');
