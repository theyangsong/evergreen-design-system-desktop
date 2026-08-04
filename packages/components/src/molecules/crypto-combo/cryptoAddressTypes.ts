import type { TagColorfulStyle, TagCustomStyle, TagFamily, TagSize, TagSystemType } from '../tag/Tag.vue';

export type CryptoAddressTagSlotConfig = {
  show?: boolean;
  size?: TagSize;
  label?: string;
  family?: TagFamily;
  systemType?: TagSystemType;
  colorfulStyle?: TagColorfulStyle;
  customStyle?: TagCustomStyle;
};

/** 行内「更多」Tag：文案如 99+ 表示另有 hiddenCount 个 Tag 未展示 */
export type CryptoAddressMoreTagConfig = CryptoAddressTagSlotConfig & {
  hiddenCount?: number;
  /** Tooltip 内展开的隐藏 Tag；未传则按 hiddenCount 生成占位 */
  hidden?: CryptoAddressTagSlotConfig[];
};

export type CryptoAddressSideTags = {
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[];
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[];
  more?: CryptoAddressMoreTagConfig;
};
