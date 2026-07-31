<script setup lang="ts">
import { computed } from 'vue';
import styles from './Tag.module.css';

export type TagSize = 'lg' | 'md' | 'sm';
export type TagFamily = 'system' | 'status' | 'colorful';
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

const props = withDefaults(
  defineProps<{
    size?: TagSize;
    family?: TagFamily;
    systemType?: TagSystemType;
    status?: TagStatus;
    colorfulStyle?: TagColorfulStyle;
  }>(),
  {
    size: 'md',
    family: 'system',
    systemType: 'subtle',
    status: 'danger',
    colorfulStyle: 'apricot',
  },
);

const variantClass = computed(() => {
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
</script>

<template>
  <span :class="['eds-tag', styles.root, styles[size], variantClass]">
    <span v-if="size === 'sm'" :class="styles.smText">
      <span :class="styles.smTextPaint" aria-hidden="true"><slot /></span>
      <span :class="styles.smTextSizer"><slot /></span>
    </span>
    <slot v-else />
  </span>
</template>
