<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from './Tooltip.module.css';
import panelStyles from './TooltipMenu.module.css';
import {
  resolveTooltipPanelRadius,
  tooltipPanelRadiusCssVar,
  type TooltipPanelKind,
  type TooltipPanelRadiusToken,
} from './tooltipPanelRadius';

export type TooltipWidthMode = 'fixed' | 'adaptive';
export type TooltipHeightMode = 'fixed' | 'adaptive';

const EFFECT_PANEL_CLASS: Record<TooltipPanelKind, string> = {
  container: 'effect-container-box',
  flotation: 'effect-flotation-box',
  popup: 'effect-popup-box',
  subtle: 'effect-subtle-card',
  molde: 'effect-molde-level',
};

type RootStyle = CSSProperties & Record<string, string | undefined>;

const props = withDefaults(
  defineProps<{
    /** effect semantic 类名见 EFFECT_PANEL_CLASS。 */
    panelKind?: TooltipPanelKind;
    /**
     * 面板圆角，仅允许 Radius token（--radius-0 / xs / sm / md / lg / full）。
     * 未传时使用 panelKind 在 effect semantic 中的默认圆角。
     */
    panelRadius?: TooltipPanelRadiusToken;
    widthMode?: TooltipWidthMode;
    width?: number;
    maxWidth?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
    /** false：面板随内容增高，不滚动、不裁剪。 */
    scrollable?: boolean;
  }>(),
  {
    panelKind: 'flotation',
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    scrollable: true,
  },
);

const effectPanelClass = computed(
  () => EFFECT_PANEL_CLASS[props.panelKind ?? 'flotation'],
);

const resolvedPanelRadius = computed(() =>
  resolveTooltipPanelRadius(props.panelKind ?? 'flotation', props.panelRadius),
);

const shellClass = computed(() => [
  'desktopTokens',
  effectPanelClass.value,
  styles.root,
  props.widthMode === 'fixed' ? styles.widthFixed : null,
  props.heightMode === 'fixed' ? styles.heightFixed : null,
]);

const shellStyle = computed((): CSSProperties => {
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

  const radiusToken = resolvedPanelRadius.value;
  if (radiusToken) {
    style.borderRadius = tooltipPanelRadiusCssVar(radiusToken);
  }

  return style;
});
</script>

<template>
  <div :class="shellClass" :style="shellStyle">
    <div :class="[panelStyles.panel, 'eds-tooltip-panel', !scrollable && panelStyles.panelStatic]">
      <slot />
    </div>
  </div>
</template>
