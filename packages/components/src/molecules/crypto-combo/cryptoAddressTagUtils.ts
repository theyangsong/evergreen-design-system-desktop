import type {
  CryptoAddressMoreTagConfig,
  CryptoAddressTagSlotConfig,
} from './cryptoAddressTypes';

export const CRYPTO_ADDRESS_INLINE_TAG_LIMIT = 1;

export function parseMoreTagHiddenCount(
  label: string | undefined,
  explicit?: number,
): number {
  if (explicit != null && Number.isFinite(explicit) && explicit > 0) {
    return Math.floor(explicit);
  }

  const match = String(label ?? '')
    .trim()
    .match(/^\+(\d+)$|^(\d+)\+$/);
  if (!match) return 0;
  return Math.floor(Number(match[1] ?? match[2]));
}

export function formatMoreTagLabel(hiddenCount: number): string {
  if (hiddenCount <= 0) return '+99';
  if (hiddenCount > 99) return '+99';
  return `+${hiddenCount}`;
}

export function normalizeTagList(
  tags?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
): CryptoAddressTagSlotConfig[] {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return list.filter((tag) => tag.show !== false);
}

/** 系统 Tag 优先，其后为自定义 Tag。 */
export function flattenAddressTags(
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
): CryptoAddressTagSlotConfig[] {
  return [...normalizeTagList(system), ...normalizeTagList(custom)];
}

export function splitTagsForDisplay(
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  inlineLimit = CRYPTO_ADDRESS_INLINE_TAG_LIMIT,
): {
  inline: CryptoAddressTagSlotConfig[];
  hidden: CryptoAddressTagSlotConfig[];
} {
  const all = flattenAddressTags(system, custom);
  return {
    inline: all.slice(0, inlineLimit),
    hidden: all.slice(inlineLimit),
  };
}

export function hasAddressTags(
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
): boolean {
  return flattenAddressTags(system, custom).length > 0;
}

/** @deprecated 保留供旧 API；新逻辑请用 splitTagsForDisplay。 */
export function buildRevealedHiddenTags(
  more?: CryptoAddressMoreTagConfig,
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
): CryptoAddressTagSlotConfig[] {
  if (more?.hidden?.length) {
    return more.hidden.filter((tag) => tag.show !== false);
  }

  const { hidden } = splitTagsForDisplay(system, custom);
  if (hidden.length) return hidden;

  const count = parseMoreTagHiddenCount(more?.label, more?.hiddenCount);
  if (count <= 0) return [];

  const systemTags = normalizeTagList(system);
  const customTags = normalizeTagList(custom);

  return Array.from({ length: count }, (_, index) => {
    const useCustom = index % 2 === 1;
    const template = useCustom
      ? (customTags[index % customTags.length] ?? customTags[0])
      : (systemTags[index % systemTags.length] ?? systemTags[0]);

    if (useCustom && template?.colorfulStyle) {
      return {
        show: true,
        size: template.size ?? more?.size ?? 'sm',
        label: template.label ?? `Tag ${index + 1}`,
        colorfulStyle: template.colorfulStyle,
      };
    }

    return {
      show: true,
      size: template?.size ?? more?.size ?? 'sm',
      label: template?.label ?? `Tag ${index + 1}`,
      systemType: template?.systemType ?? ('stroke-subtle' as const),
    };
  });
}
