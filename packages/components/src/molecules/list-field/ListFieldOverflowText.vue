<script setup lang="ts">
import { computed } from 'vue';
import { EgTextOverflowTooltip } from '../tooltip';
import styles from './ListFieldOverflowText.module.css';

const props = withDefaults(
  defineProps<{
    text: string;
    variant?: 'primary' | 'secondary';
    size?: 'medium' | 'small';
    tooltipTrigger?: 'hover' | 'focus';
    tabular?: boolean;
    boundarySelector?: string;
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    tooltipTrigger: 'hover',
    tabular: false,
    boundarySelector: '.eds-data-list',
  },
);

const targetTone = computed(() =>
  props.variant === 'secondary' ? 'secondary' : 'primary',
);

const textTypographyClass = computed((): string[] => [
  props.size === 'small'
    ? styles.textSmall
    : props.variant === 'primary'
      ? styles.textPrimary
      : styles.textSecondary,
  ...(props.tabular ? [styles.textTabular] : []),
]);

const tooltipPanelClass = computed(() => {
  if (props.size === 'small') return styles.tooltipPanelSmall;
  if (props.variant === 'secondary') return styles.tooltipPanelSecondary;
  return styles.tooltipPanel;
});
</script>

<template>
  <EgTextOverflowTooltip
    :tooltip-text="text"
    :trigger="tooltipTrigger"
    :target-tone="targetTone"
    :panel-scope-class="tooltipPanelClass"
    :typography-class="textTypographyClass"
    :measure-class="styles.text"
    :boundary-selector="boundarySelector"
    host-flex
  >
    {{ text }}
  </EgTextOverflowTooltip>
</template>
