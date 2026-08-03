<script setup lang="ts">
import { computed } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import EgTooltip, {
  type TooltipHeightMode,
  type TooltipWidthMode,
} from '../tooltip/Tooltip.vue';
import type { TooltipPanelKind, TooltipPanelRadiusToken } from '../tooltip/tooltipPanelRadius';
import styles from './Flotation.module.css';

const props = withDefaults(
  defineProps<{
    /** Figma Menu：浮层外壳由 EgTooltip 提供（flotation box）。 */
    panelKind?: TooltipPanelKind;
    /** 透传 EgTooltip；仅 Radius token（--radius-*）。 */
    panelRadius?: TooltipPanelRadiusToken;
    widthMode?: TooltipWidthMode;
    width?: number;
    maxWidth?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
    /** false：随内容增高，不滚动、不裁剪。 */
    scrollable?: boolean;
    showDivider?: boolean;
    showAdd?: boolean;
    addLabel?: string;
  }>(),
  {
    panelKind: 'flotation',
    widthMode: 'fixed',
    width: undefined,
    heightMode: 'adaptive',
    height: 306,
    maxHeight: undefined,
    scrollable: true,
    showDivider: true,
    showAdd: true,
    addLabel: 'Add',
  },
);

const emit = defineEmits<{
  add: [event: MouseEvent];
}>();

/** Add 行 + 分割线在底部固定；仅列表区滚动。 */
const useStickyFooter = computed(() => props.showAdd);
</script>

<template>
  <EgTooltip
    :class="['eds-flotation-menu', useStickyFooter && 'eds-flotation-menu--sticky-footer']"
    :panel-kind="panelKind"
    :panel-radius="panelRadius"
    :width-mode="widthMode"
    :width="width"
    :max-width="maxWidth"
    :height-mode="heightMode"
    :height="height"
    :max-height="maxHeight"
    :scrollable="!useStickyFooter && scrollable"
  >
    <div :class="[styles.menuBody, useStickyFooter && scrollable && styles.menuBodySticky]">
      <div :class="[styles.menuList, useStickyFooter && scrollable && styles.menuListScrollable]">
        <slot />
        <div
          v-if="useStickyFooter && scrollable"
          :class="styles.menuListScrollEnd"
          aria-hidden="true"
        />
      </div>
      <div v-if="showAdd" :class="styles.menuFooter">
        <div v-if="showDivider" :class="styles.menuDivider">
          <EgDivider type="page" direction="horizontal" />
        </div>
        <button
          type="button"
          class="eds-flotation-menu-add"
          :class="styles.addRow"
          @click="emit('add', $event)"
        >
          <span :class="styles.addIcon" aria-hidden="true">
            <EgIcon name="eds-add" size="sm" />
          </span>
          {{ addLabel }}
        </button>
      </div>
    </div>
  </EgTooltip>
</template>
