<script setup lang="ts">
import { computed } from 'vue';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
import styles from './Paginer.module.css';

const props = withDefaults(
  defineProps<{
    text?: string;
    number?: string;
    /** 折叠浮层内：左 Label / 右 Value 单行。 */
    menuRow?: boolean;
  }>(),
  {
    text: 'Title',
    number: '0',
    menuRow: false,
  },
);

const formattedNumber = computed(() => formatGroupedNumber(props.number));
</script>

<template>
  <div
    class="eds-paginer-statistics"
    :class="menuRow ? styles.statisticsMenuRow : styles.statisticsItem"
  >
    <slot name="text">
      <span
        :class="[
          styles.statisticsText,
          menuRow && styles.statisticsTextMenuRow,
        ]"
      >
        {{ text }}
      </span>
    </slot>
    <slot name="number">
      <span
        :class="[
          styles.statisticsNumber,
          menuRow && styles.statisticsNumberMenuRow,
        ]"
      >
        {{ formattedNumber }}
      </span>
    </slot>
  </div>
</template>
