<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from './Tooltip.module.css';
import panelStyles from './TooltipMenu.module.css';

export type TooltipWidthMode = 'fixed' | 'adaptive';
export type TooltipHeightMode = 'fixed' | 'adaptive';

/** 覆层 Flotation / Popup 背景 token（其余视觉一致）。 */
export type TooltipPanelKind = 'flotation' | 'popup';

type RootStyle = CSSProperties & Record<string, string | undefined>;

const props = withDefaults(
  defineProps<{
    /** flotation：`--effect-flotation-box`；popup：`--effect-popup-box`。 */
    panelKind?: TooltipPanelKind;
    widthMode?: TooltipWidthMode;
    width?: number;
    maxWidth?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
  }>(),
  {
    panelKind: 'flotation',
    widthMode: 'adaptive',
    heightMode: 'fixed',
    height: 380,
  },
);

const panelClass = computed(() =>
  props.panelKind === 'popup' ? panelStyles.panelPopup : panelStyles.panelFlotation,
);

const rootClass = computed(() => [
  panelStyles.panelRoot,
  styles.root,
  props.widthMode === 'fixed' ? styles.widthFixed : styles.widthAdaptive,
  props.heightMode === 'fixed' ? styles.heightFixed : styles.heightAdaptive,
]);

const rootStyle = computed((): CSSProperties => {
  const style = {} as RootStyle;

  if (props.heightMode === 'fixed' && props.height != null) {
    const heightPx = `${props.height}px`;
    style.height = heightPx;
    style.minHeight = heightPx;
  }

  if (props.maxHeight != null) {
    style.maxHeight = `${props.maxHeight}px`;
  }

  if (props.widthMode === 'fixed' && props.width != null) {
    const widthPx = `${props.width}px`;
    style.width = widthPx;
    style.minWidth = widthPx;
    if (props.maxWidth == null) {
      style.maxWidth = widthPx;
    }
  }

  if (props.maxWidth != null) {
    style.maxWidth = `${props.maxWidth}px`;
  }

  return style;
});
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <div :class="[panelStyles.panel, panelClass]">
      <slot />
    </div>
  </div>
</template>
