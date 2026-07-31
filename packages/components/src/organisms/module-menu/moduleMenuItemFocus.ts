import { inject, provide, ref, type InjectionKey, type Ref } from 'vue';

export type ModuleMenuItemFocusContext = {
  focusedId: Readonly<Ref<string | null>>;
  register: (id: string) => void;
  unregister: (id: string) => void;
  select: (id: string, event?: MouseEvent) => void;
  isFocused: (id: string) => boolean;
};

export const MODULE_MENU_ITEM_FOCUS_KEY: InjectionKey<ModuleMenuItemFocusContext> =
  Symbol('moduleMenuItemFocus');

function blurMenuItemsExcept(current: EventTarget | null) {
  const menu = current instanceof HTMLElement ? current.closest('.eds-module-menu') : null;
  if (!menu) return;

  for (const button of menu.querySelectorAll('button.eds-module-menu-item')) {
    if (button !== current && button instanceof HTMLButtonElement) {
      button.blur();
    }
  }
}

export function provideModuleMenuItemFocus(): ModuleMenuItemFocusContext {
  const focusedId = ref<string | null>(null);
  const registry = new Map<string, number>();
  let nextOrder = 0;

  function sortedIds() {
    return [...registry.entries()]
      .sort((left, right) => left[1] - right[1])
      .map(([id]) => id);
  }

  function pickDefaultFocus() {
    const ids = sortedIds();
    focusedId.value = ids[0] ?? null;
  }

  function register(id: string) {
    if (!registry.has(id)) {
      registry.set(id, nextOrder++);
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
    focusedId.value = id;
    blurMenuItemsExcept(event?.currentTarget ?? null);
  }

  function isFocused(id: string) {
    return focusedId.value === id;
  }

  const context: ModuleMenuItemFocusContext = {
    focusedId,
    register,
    unregister,
    select,
    isFocused,
  };

  provide(MODULE_MENU_ITEM_FOCUS_KEY, context);
  return context;
}

export function useModuleMenuItemFocus() {
  return inject(MODULE_MENU_ITEM_FOCUS_KEY, null);
}
