<script setup lang="ts">
import { computed } from 'vue';
import styles from './Tag.module.css';

export type TagSize = 'lg' | 'md' | 'sm';
export type TagFamily = 'system' | 'status' | 'colorful' | 'custom';
export type TagSystemType =
  | 'subtle'
  | 'solid-brand'
  | 'solid-red'
  | 'gray'
  | 'stroke-subtle'
  | 'stroke-solid';
export type TagStatus = 'danger' | 'warning' | 'success' | 'ready' | 'invalid';
export type TagColorfulStyle =
  | 'apricot'
  | 'khaki'
  | 'grass'
  | 'sage'
  | 'cyan'
  | 'ice-blue'
  | 'periwinkle'
  | 'lilac'
  | 'orchid'
  | 'mallow'
  | 'rose'
  | 'coral'
  | 'mauve'
  | 'moss'
  | 'steel'
  | 'grape'
  | 'samewhite'
  | 'lime';

export type TagCustomStyle =
  | 'vermilion'
  | 'orange'
  | 'amber'
  | 'lime'
  | 'mint'
  | 'teal'
  | 'clear-sky'
  | 'cobalt'
  | 'aurora'
  | 'orchid'
  | 'rose'
  | 'peach'
  | 'aml-danger'
  | 'aml-suspicious'
  | 'aml-invalid';

const COLORFUL_STYLE_CLASS: Record<TagColorfulStyle, string> = {
  apricot: styles.colorfulApricot,
  khaki: styles.colorfulKhaki,
  grass: styles.colorfulGrass,
  sage: styles.colorfulSage,
  cyan: styles.colorfulCyan,
  'ice-blue': styles.colorfulIceBlue,
  periwinkle: styles.colorfulPeriwinkle,
  lilac: styles.colorfulLilac,
  orchid: styles.colorfulOrchid,
  mallow: styles.colorfulMallow,
  rose: styles.colorfulRose,
  coral: styles.colorfulCoral,
  mauve: styles.colorfulMauve,
  moss: styles.colorfulMoss,
  steel: styles.colorfulSteel,
  grape: styles.colorfulGrape,
  samewhite: styles.colorfulSamewhite,
  lime: styles.colorfulLime,
};

const CUSTOM_STYLE_CLASS: Record<TagCustomStyle, string> = {
  vermilion: styles.customVermilion,
  orange: styles.customOrange,
  amber: styles.customAmber,
  lime: styles.customLime,
  mint: styles.customMint,
  teal: styles.customTeal,
  'clear-sky': styles.customClearSky,
  cobalt: styles.customCobalt,
  aurora: styles.customAurora,
  orchid: styles.customOrchid,
  rose: styles.customRose,
  peach: styles.customPeach,
  'aml-danger': styles.customAmlDanger,
  'aml-suspicious': styles.customAmlSuspicious,
  'aml-invalid': styles.customAmlInvalid,
};

const props = withDefaults(
  defineProps<{
    size?: TagSize;
    family?: TagFamily;
    systemType?: TagSystemType;
    status?: TagStatus;
    colorfulStyle?: TagColorfulStyle;
    customStyle?: TagCustomStyle;
    /** 文本超出容器宽度时省略（需父级约束 max-width） */
    truncate?: boolean;
  }>(),
  {
    size: 'md',
    family: 'system',
    systemType: 'subtle',
    status: 'danger',
    colorfulStyle: 'apricot',
    customStyle: 'vermilion',
    truncate: false,
  },
);

const variantClass = computed((): string | string[] => {
  if (props.family === 'status') {
    switch (props.status) {
      case 'warning':
        return styles.statusWarning;
      case 'success':
        return styles.statusSuccess;
      case 'ready':
        return styles.statusReady;
      case 'invalid':
        return styles.statusInvalid;
      default:
        return styles.statusDanger;
    }
  }
  if (props.family === 'colorful') {
    return COLORFUL_STYLE_CLASS[props.colorfulStyle] ?? styles.colorfulApricot;
  }
  if (props.family === 'custom') {
    return [styles.custom, CUSTOM_STYLE_CLASS[props.customStyle] ?? styles.customVermilion];
  }
  switch (props.systemType) {
    case 'solid-brand':
      return styles.systemSolidBrand;
    case 'solid-red':
      return styles.systemSolidRed;
    case 'gray':
      return styles.systemGray;
    case 'stroke-subtle':
      return styles.systemStrokeSubtle;
    case 'stroke-solid':
      return styles.systemStrokeSolid;
    default:
      return styles.systemSubtle;
  }
});

const tagClasses = computed(() => {
  const variant = variantClass.value;
  return [
    'eds-tag',
    styles.root,
    styles[props.size],
    props.truncate && styles.truncate,
    ...(Array.isArray(variant) ? variant : [variant]),
  ];
});
</script>

<template>
  <span :class="tagClasses">
    <template v-if="family === 'custom'">
      <span :class="styles.customContent">
        <span v-if="size === 'sm' && truncate" :class="styles.smTextTruncate"><slot /></span>
        <span v-else-if="size === 'sm'" :class="styles.smText">
          <span :class="styles.smTextPaint" aria-hidden="true"><slot /></span>
          <span :class="styles.smTextSizer"><slot /></span>
        </span>
        <slot v-else />
      </span>
    </template>
    <template v-else>
      <span v-if="size === 'sm' && truncate" :class="styles.smTextTruncate"><slot /></span>
      <span v-else-if="size === 'sm'" :class="styles.smText">
        <span :class="styles.smTextPaint" aria-hidden="true"><slot /></span>
        <span :class="styles.smTextSizer"><slot /></span>
      </span>
      <slot v-else />
    </template>
  </span>
</template>
