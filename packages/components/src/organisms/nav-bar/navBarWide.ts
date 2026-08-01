import { computed, type ComputedRef, inject, type InjectionKey } from 'vue';

export const NAV_BAR_WIDE_KEY: InjectionKey<ComputedRef<boolean>> = Symbol('navBarWide');

export function useNavBarWide(): ComputedRef<boolean> {
  const injected = inject(NAV_BAR_WIDE_KEY, undefined);
  return injected ?? computed(() => false);
}
