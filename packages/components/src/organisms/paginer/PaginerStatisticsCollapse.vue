<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgFlotation, EgFlotationMenu } from '../../molecules/flotation';
import type { TooltipAlign, TooltipPlacement } from '../../molecules/tooltip';
import PaginerStatistics from './PaginerStatistics.vue';
import styles from './Paginer.module.css';

export type PaginerStatisticsCollapseItem = {
  text: string;
  number: string;
};

withDefaults(
  defineProps<{
    collapseLabel?: string;
    items?: PaginerStatisticsCollapseItem[];
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    /** 浮层相对触发器交叉轴向右偏移（px），默认 spacing-2。 */
    crossAxisOffset?: number;
  }>(),
  {
    collapseLabel: 'Show statistics',
    items: () => [],
    placement: 'top',
    align: 'end',
    crossAxisOffset: 8,
  },
);
</script>

<template>
  <EgFlotation
    :class="styles.statisticsCollapse"
    :placement="placement"
    :align="align"
    :cross-axis-offset="crossAxisOffset"
    :show-add="false"
    :show-menu-divider="false"
  >
    <template #trigger="{ expanded }">
      <slot name="trigger" :expanded="expanded">
        <EgIconButton
          shape="square"
          size="md"
          :label="collapseLabel"
          :aria-expanded="expanded"
          :class="expanded && styles.statisticsCollapseTriggerExpanded"
        >
          <EgIcon name="eds-more-ios" fit />
        </EgIconButton>
      </slot>
    </template>

    <template #content>
      <slot name="content">
        <EgFlotationMenu
          :class="styles.statisticsCollapseMenu"
          data-no-corner-smoothing
          :show-add="false"
          :show-divider="false"
          width-mode="adaptive"
          height-mode="adaptive"
          :scrollable="false"
        >
          <div :class="styles.statisticsCollapsePanel">
            <PaginerStatistics
              v-for="(item, index) in items"
              :key="`${item.text}-${item.number}-${index}`"
              menu-row
              :text="item.text"
              :number="item.number"
            />
          </div>
        </EgFlotationMenu>
      </slot>
    </template>
  </EgFlotation>
</template>
