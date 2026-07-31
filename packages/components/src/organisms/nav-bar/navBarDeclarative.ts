export const NAV_BAR_DECLARATIVE_MAX = 20;

export type NavBarDeclarativeItem = {
  label: string;
  icon: string;
  focusIcon: string;
};

export type NavBarDeclarativeProps = {
  moduleCount?: number;
  appEntryCount?: number;
  corporationLabel?: string;
  avatarInitials?: string;
  [key: string]: string | number | undefined;
};

export function readIndexedProp(
  props: NavBarDeclarativeProps,
  prefix: string,
  index: number,
): string | undefined {
  const value = props[`${prefix}${index}`];
  if (value == null) return undefined;
  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function clampCount(raw: number | undefined, max = NAV_BAR_DECLARATIVE_MAX): number {
  if (raw == null || !Number.isFinite(raw)) return 0;
  return Math.min(max, Math.max(0, Math.round(raw)));
}

export function inferAppEntryCount(props: NavBarDeclarativeProps): number {
  const explicit = clampCount(
    props.appEntryCount != null ? Number(props.appEntryCount) : undefined,
  );
  if (explicit > 0) return explicit;

  for (let index = NAV_BAR_DECLARATIVE_MAX; index >= 1; index -= 1) {
    if (readIndexedProp(props, 'appEntryLabel', index)) return index;
  }

  return 0;
}

export function resolveDeclarativeModules(props: NavBarDeclarativeProps): NavBarDeclarativeItem[] {
  const count = clampCount(props.moduleCount != null ? Number(props.moduleCount) : undefined);
  if (count <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const order = index + 1;
    const icon = readIndexedProp(props, 'moduleIcon', order) ?? 'eds-add';
    return {
      label: readIndexedProp(props, 'moduleLabel', order) ?? 'Label',
      icon,
      focusIcon: readIndexedProp(props, 'moduleFocusIcon', order) ?? icon,
    };
  });
}

export function resolveDeclarativeAppEntries(props: NavBarDeclarativeProps): NavBarDeclarativeItem[] {
  const count = inferAppEntryCount(props);
  if (count <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const order = index + 1;
    const icon = readIndexedProp(props, 'appEntryIcon', order) ?? 'eds-add';
    return {
      label: readIndexedProp(props, 'appEntryLabel', order) ?? 'Label',
      icon,
      focusIcon: readIndexedProp(props, 'appEntryFocusIcon', order) ?? icon,
    };
  });
}

export function usesDeclarativeModules(props: NavBarDeclarativeProps): boolean {
  return resolveDeclarativeModules(props).length > 0;
}
