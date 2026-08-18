<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import styles from './Icon.module.css';
import { getProcessedIcon, type IconName } from './iconRegistry';
import type { IconFillTone } from './processSvg';

/** 与 --stroke-lg / 32 viewBox 一致：屏上 1.4px → user-space = 1.4 * 32 / displayPx */
const TOKEN_SCREEN_STROKE_PX = 1.4;
const VIEWBOX_SIZE = 32;
const ICON_PX = { sm: 16, md: 20, lg: 24 } as const;

function strokeUserForDisplayPx(px: number) {
  return (TOKEN_SCREEN_STROKE_PX * VIEWBOX_SIZE) / px;
}

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'sm' | 'md' | 'lg';
    /** Size to parent slot (e.g. EgIconButton); ignores fixed sm/md/lg box. */
    fit?: boolean;
    label?: string;
    /** 仅 token 单色填充图标；彩色 fixed 图标忽略此 prop。 */
    fillTone?: IconFillTone;
  }>(),
  {
    size: 'md',
    fit: false,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const strokeUser = ref(strokeUserForDisplayPx(ICON_PX[props.size]));

function syncStrokeUser() {
  const px = rootRef.value?.getBoundingClientRect().width ?? 0;
  if (px <= 0) return;
  strokeUser.value = strokeUserForDisplayPx(px);
}

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  syncStrokeUser();
  if (typeof ResizeObserver === 'undefined' || !rootRef.value) return;
  resizeObserver = new ResizeObserver(() => syncStrokeUser());
  resizeObserver.observe(rootRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

const processed = computed(() => getProcessedIcon(String(props.name)));

const kindClass = computed(() => {
  const icon = processed.value;
  if (!icon || icon.colorMode === 'fixed') return styles.fixedKind;
  const tone = props.fillTone ?? icon.fillTone;
  return [
    styles.tokenKind,
    tone === 'brand' ? styles.tokenFillBrand : styles.tokenFillPrimary,
  ];
});

const hostClass = computed(() => [
  styles.icon,
  props.fit ? styles.fill : styles[props.size],
  ...(Array.isArray(kindClass.value) ? kindClass.value : [kindClass.value]),
]);

const ariaLabel = computed(() => props.label || String(props.name));

const rootStyle = computed(() => ({
  '--eds-icon-stroke-user': String(strokeUser.value),
}));
</script>

<template>
  <span
    v-if="processed"
    ref="rootRef"
    :class="hostClass"
    :style="rootStyle"
    role="img"
    :data-icon="name"
    :aria-label="label ? ariaLabel : undefined"
    :aria-hidden="label ? undefined : true"
  >
    <span class="eds-icon" :class="styles.svgHost" v-html="processed.markup" />
  </span>
</template>
