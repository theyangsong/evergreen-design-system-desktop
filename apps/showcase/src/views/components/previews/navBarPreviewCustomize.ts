import { showcaseDefaultIconName } from '@/views/shared/showcaseIcons';
import { navBarCustomizeDefaults } from './organismTemplateDocData';

const GENERIC_ICON_NAMES = new Set<string>([showcaseDefaultIconName, 'eds-add']);

/** Showcase 默认应用入口（icon 固定为 Figma 彩色应用标，不走 eds-add 占位）。 */
export const NAV_BAR_DEMO_APP_ENTRIES = [
  { label: 'UniChain', icon: 'eds-application-22' },
  { label: 'MetaMask', icon: 'eds-application-5' },
] as const;

function canonicalValue(key: string): unknown {
  return (navBarCustomizeDefaults as Record<string, unknown>)[key];
}

function canonicalString(key: string): string {
  const value = canonicalValue(key);
  return typeof value === 'string' ? value.trim() : '';
}

/** 补齐缺失项，并把仍停留在占位 icon（eds-add）的应用入口同步到当前 canonical defaults。 */
export function healNavBarCustomizeState(state: Record<string, unknown>) {
  const defaults = navBarCustomizeDefaults as Record<string, unknown>;

  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in state)) {
      state[key] = value;
    }
  }

  const appEntryCount = Number(state.appEntryCount);
  if (!Number.isFinite(appEntryCount) || appEntryCount <= 0) return;

  for (let index = 1; index <= appEntryCount; index += 1) {
    const demo = NAV_BAR_DEMO_APP_ENTRIES[index - 1];
    for (const prefix of ['appEntryIcon', 'appEntryFocusIcon'] as const) {
      const key = `${prefix}${index}`;
      const canonicalName = canonicalString(key) || demo?.icon || '';
      const stateName = String(state[key] ?? '').trim();
      if (!canonicalName) continue;
      if (!stateName || GENERIC_ICON_NAMES.has(stateName)) {
        state[key] = canonicalName;
      }
    }
    if (demo && (!String(state[`appEntryLabel${index}`] ?? '').trim() || state[`appEntryLabel${index}`] === 'Label')) {
      state[`appEntryLabel${index}`] = demo.label;
    }
  }
}

export function resolveNavBarPreviewIconName(
  customize: Record<string, unknown>,
  prefix: 'moduleIcon' | 'moduleFocusIcon' | 'appEntryIcon' | 'appEntryFocusIcon',
  order: number,
): string {
  const key = `${prefix}${order}`;
  const canonicalName = canonicalString(key);
  const stateName = String(customize[key] ?? '').trim();
  const demoIcon = NAV_BAR_DEMO_APP_ENTRIES[order - 1]?.icon;

  if (prefix.startsWith('appEntry')) {
    if (stateName && !GENERIC_ICON_NAMES.has(stateName)) return stateName;
    if (demoIcon) return demoIcon;
    if (canonicalName && !GENERIC_ICON_NAMES.has(canonicalName)) return canonicalName;
    return showcaseDefaultIconName;
  }

  const name = stateName || canonicalName;
  return name || showcaseDefaultIconName;
}
