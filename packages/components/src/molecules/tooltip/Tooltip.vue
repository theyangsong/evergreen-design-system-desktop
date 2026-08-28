<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from './Tooltip.module.css';
import panelStyles from './TooltipMenu.module.css';
import '../../styles/popupInnerBackdrop.css';
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
    /** true：内容贴边，去掉 effect-* 默认 spacing-1 内边距（Popup Detail 等）。 */
    panelFlush?: boolean;
    /** true：面板 glass 挂 semantic `.motion-flotation`（overlay micro-float；host 控 active）。 */
    panelMicroFloat?: boolean;
    /** true：面板挂 semantic `.motion-layout`（Popup Detail 等大位移；host 控 active）。 */
    panelLayoutMotion?: boolean;
  }>(),
  {
    panelKind: 'flotation',
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    scrollable: true,
    panelFlush: false,
    panelMicroFloat: false,
    panelLayoutMotion: false,
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
  props.panelLayoutMotion ? 'motion-layout' : null,
  props.panelMicroFloat ? 'motion-flotation' : null,
  props.widthMode === 'fixed' ? styles.widthFixed : null,
  props.heightMode === 'fixed' ? styles.heightFixed : null,
  props.panelFlush ? styles.panelFlush : null,
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
    const canGrow =
      props.maxWidth != null && props.maxWidth > props.width;

    if (canGrow) {
      style.minWidth = widthPx;
      style.width = 'max-content';
      style.maxWidth = `${props.maxWidth}px`;
    } else {
      style.width = widthPx;
      style.minWidth = widthPx;
      if (props.maxWidth == null) {
        style.maxWidth = widthPx;
      }
    }
  }

  if (props.maxWidth != null) {
    const widthGrows =
      props.widthMode === 'fixed' &&
      props.width != null &&
      props.maxWidth > props.width;

    if (!widthGrows) {
      style.maxWidth = `${props.maxWidth}px`;
    }
  }

  const radiusToken = resolvedPanelRadius.value;
  const radiusValue = radiusToken ? tooltipPanelRadiusCssVar(radiusToken) : '0px';
  if (radiusToken) {
    style.borderRadius = radiusValue;
  }
  /* 供内层贴角 chrome 读取：backdrop-filter 不受祖先圆角裁切，须自带同值圆角。 */
  style['--eds-surface-radius'] = radiusValue;

  if (props.panelFlush) {
    style.padding = '0';
    style.alignItems = 'stretch';
  }

  return style;
});
const panelContentClass = computed(() =>
  props.panelKind === 'popup' ? 'eds-popup-box-content' : null,
);
</script>

<template>
  <div :class="shellClass" :style="shellStyle" data-no-corner-smoothing>
    <div
      :class="[
        panelStyles.panel,
        'eds-tooltip-panel',
        panelContentClass,
        !scrollable && panelStyles.panelStatic,
        panelFlush && styles.panelFlushPanel,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
