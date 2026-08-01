import { computed, type ComputedRef } from 'vue';
import { resolveNavBarPreviewIconName } from './navBarPreviewCustomize';
import { navBarCustomizeDefaults } from './organismTemplateDocData';

export type NavBarPreviewNestItem = {
  order: number;
  label: string;
  icon: string;
  focusIcon: string;
  showReddot: boolean;
};

function labelAt(
  customize: Record<string, unknown>,
  prefix: 'moduleLabel' | 'appEntryLabel',
  order: number,
): string {
  const key = `${prefix}${order}`;
  const raw = customize[key];
  const fromState = raw != null ? String(raw).trim() : '';
  if (fromState) return fromState;
  const fromDefaults = (navBarCustomizeDefaults as Record<string, unknown>)[key];
  if (typeof fromDefaults === 'string' && fromDefaults.trim()) return fromDefaults.trim();
  return 'Label';
}

function iconAt(
  customize: Record<string, unknown>,
  prefix: 'moduleIcon' | 'moduleFocusIcon' | 'appEntryIcon' | 'appEntryFocusIcon',
  order: number,
): string {
  return resolveNavBarPreviewIconName(customize, prefix, order);
}

function reddotAt(
  customize: Record<string, unknown>,
  prefix: 'moduleReddot' | 'appEntryReddot',
  order: number,
): boolean {
  return Boolean(customize[`${prefix}${order}`]);
}

function trackModuleCustomize(customize: Record<string, unknown>, count: number) {
  for (let index = 1; index <= count; index += 1) {
    void customize[`moduleLabel${index}`];
    void customize[`moduleIcon${index}`];
    void customize[`moduleFocusIcon${index}`];
    void customize[`moduleReddot${index}`];
  }
}

function trackAppEntryCustomize(customize: Record<string, unknown>, count: number) {
  for (let index = 1; index <= count; index += 1) {
    void customize[`appEntryLabel${index}`];
    void customize[`appEntryIcon${index}`];
    void customize[`appEntryFocusIcon${index}`];
    void customize[`appEntryReddot${index}`];
  }
}

export function useNavBarPreviewNest(customize: ComputedRef<Record<string, unknown>>) {
  const moduleCount = computed(() => {
    const count = Number(customize.value.moduleCount);
    if (!Number.isFinite(count)) return 4;
    return Math.min(20, Math.max(1, Math.round(count)));
  });

  const appEntryCount = computed(() => {
    const count = Number(customize.value.appEntryCount);
    if (!Number.isFinite(count)) return 0;
    return Math.min(20, Math.max(0, Math.round(count)));
  });

  const moduleItems = computed((): NavBarPreviewNestItem[] => {
    trackModuleCustomize(customize.value, moduleCount.value);
    return Array.from({ length: moduleCount.value }, (_, index) => ({
      order: index + 1,
      label: labelAt(customize.value, 'moduleLabel', index + 1),
      icon: iconAt(customize.value, 'moduleIcon', index + 1),
      focusIcon: iconAt(customize.value, 'moduleFocusIcon', index + 1),
      showReddot: reddotAt(customize.value, 'moduleReddot', index + 1),
    }));
  });

  const appEntryItems = computed((): NavBarPreviewNestItem[] => {
    trackAppEntryCustomize(customize.value, appEntryCount.value);
    return Array.from({ length: appEntryCount.value }, (_, index) => ({
      order: index + 1,
      label: labelAt(customize.value, 'appEntryLabel', index + 1),
      icon: iconAt(customize.value, 'appEntryIcon', index + 1),
      focusIcon: iconAt(customize.value, 'appEntryFocusIcon', index + 1),
      showReddot: reddotAt(customize.value, 'appEntryReddot', index + 1),
    }));
  });

  const corporationLabel = computed(() => String(customize.value.corporationLabel ?? 'G'));
  const avatarInitials = computed(() => String(customize.value.avatarInitials ?? 'N'));
  const showDivider = computed(() => Boolean(customize.value.showDivider));

  return {
    moduleCount,
    appEntryCount,
    moduleItems,
    appEntryItems,
    corporationLabel,
    avatarInitials,
    showDivider,
  };
}
