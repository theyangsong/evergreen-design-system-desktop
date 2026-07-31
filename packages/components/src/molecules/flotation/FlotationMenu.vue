<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import EgTooltip, {
  type TooltipHeightMode,
  type TooltipPanelKind,
  type TooltipWidthMode,
} from '../tooltip/Tooltip.vue';
import styles from './Flotation.module.css';

withDefaults(
  defineProps<{
    /** Figma Menu：浮层外壳由 EgTooltip 提供（flotation box）。 */
    panelKind?: TooltipPanelKind;
    widthMode?: TooltipWidthMode;
    width?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
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
    showDivider: true,
    showAdd: true,
    addLabel: 'Add',
  },
);

const emit = defineEmits<{
  add: [event: MouseEvent];
}>();
</script>

<template>
  <EgTooltip
    class="eds-flotation-menu"
    :panel-kind="panelKind"
    :width-mode="widthMode"
    :width="width"
    :height-mode="heightMode"
    :height="height"
    :max-height="maxHeight"
  >
    <div :class="styles.menuBody">
      <div :class="styles.menuList">
        <slot />
      </div>
      <div v-if="showDivider && showAdd" :class="styles.menuDivider">
        <EgDivider type="page" direction="horizontal" />
      </div>
      <button
        v-if="showAdd"
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
  </EgTooltip>
</template>
