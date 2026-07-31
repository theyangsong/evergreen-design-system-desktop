import { inject, provide, ref, type InjectionKey, type Ref } from 'vue';

export type NavBarFocusGroup = 'module' | 'chrome';

export type NavBarModuleFocusContext = {
  focusedId: Readonly<Ref<string | null>>;
  register: (id: string, group?: NavBarFocusGroup) => void;
  unregister: (id: string) => void;
  select: (id: string, event?: MouseEvent) => void;
  isFocused: (id: string) => boolean;
};

export const NAV_BAR_MODULE_FOCUS_KEY: InjectionKey<NavBarModuleFocusContext> =
  Symbol('navBarModuleFocus');

type RegistryEntry = {
  order: number;
  group: NavBarFocusGroup;
};

function blurNavChromeExcept(current: EventTarget | null) {
  const nav = current instanceof HTMLElement ? current.closest('.eds-nav-bar') : null;
  if (!nav) return;

  for (const button of nav.querySelectorAll('button')) {
    if (button !== current) {
      button.blur();
    }
  }
}

export function provideNavBarModuleFocus(): NavBarModuleFocusContext {
  const focusedId = ref<string | null>(null);
  const registry = new Map<string, RegistryEntry>();
  let nextOrder = 0;
  let userHasSelectedFocus = false;

  function sortedEntries() {
    return [...registry.entries()]
      .map(([id, meta]) => ({ id, ...meta }))
      .sort((left, right) => left.order - right.order);
  }

  function pickDefaultFocus() {
    if (registry.size === 0) {
      focusedId.value = null;
      return;
    }

    const entries = sortedEntries();
    const firstModule = entries.find((entry) => entry.group === 'module');
    focusedId.value = firstModule?.id ?? entries[0]?.id ?? null;
  }

  function register(id: string, group: NavBarFocusGroup = 'module') {
    if (!registry.has(id)) {
      registry.set(id, { order: nextOrder++, group });
    }

    const entries = sortedEntries();
    const firstModule = entries.find((entry) => entry.group === 'module');
    const focusedEntry =
      focusedId.value !== null ? registry.get(focusedId.value) : undefined;

    // Corporation / utilities register before modules; default focus stays on first module.
    if (
      !userHasSelectedFocus &&
      firstModule &&
      (!focusedEntry || focusedEntry.group === 'chrome')
    ) {
      focusedId.value = firstModule.id;
      return;
    }

    if (focusedId.value === null || !registry.has(focusedId.value)) {
      pickDefaultFocus();
    }
  }

  function unregister(id: string) {
    registry.delete(id);

    if (focusedId.value === id) {
      pickDefaultFocus();
    }
  }

  function select(id: string, event?: MouseEvent) {
    if (!registry.has(id)) return;
    userHasSelectedFocus = true;
    focusedId.value = id;
    blurNavChromeExcept(event?.currentTarget ?? null);
  }

  function isFocused(id: string) {
    return focusedId.value === id;
  }

  const context: NavBarModuleFocusContext = {
    focusedId,
    register,
    unregister,
    select,
    isFocused,
  };

  provide(NAV_BAR_MODULE_FOCUS_KEY, context);
  return context;
}

export function useNavBarModuleFocus() {
  return inject(NAV_BAR_MODULE_FOCUS_KEY, null);
}
