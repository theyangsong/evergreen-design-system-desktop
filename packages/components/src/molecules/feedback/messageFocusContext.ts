import { type ComputedRef, type InjectionKey } from 'vue';

/** Module Menu / Flotation Menu item 等行容器向 EgMessage 传递「行聚焦」态。 */
export const MESSAGE_PARENT_FOCUSED_KEY: InjectionKey<ComputedRef<boolean>> =
  Symbol('messageParentFocused');
