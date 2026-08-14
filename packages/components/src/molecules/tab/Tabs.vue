<script setup lang="ts">
import { computed, toRef } from 'vue';
import EgTabItem from './TabItem.vue';
import styles from './Tab.module.css';
import { useSlidingThumb } from './useSlidingThumb';

export type TabsSpacingSize = 'xl' | 'md' | 'sm' | 'xs';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    labels?: string[];
    /** Tab 项水平间距（gap）。 */
    horizontalGap?: TabsSpacingSize;
    /** Tab 轨道与底部指示条之间的垂直间距（padding-bottom）。 */
    verticalGap?: TabsSpacingSize;
  }>(),
  {
    modelValue: 0,
    labels: () => ['Tab', 'Tab', 'Tab', 'Tab', 'Tab'],
    horizontalGap: 'xl',
    verticalGap: 'xl',
  },
);

const emit = defineEmits<{
  'update:modelValue': [index: number];
}>();

const horizontalGapClass = computed(() => {
  switch (props.horizontalGap) {
    case 'md':
      return styles.tabsHorizontalGapMd;
    case 'sm':
      return styles.tabsHorizontalGapSm;
    case 'xs':
      return styles.tabsHorizontalGapXs;
    default:
      return styles.tabsHorizontalGapXl;
  }
});

const verticalGapClass = computed(() => {
  switch (props.verticalGap) {
    case 'md':
      return styles.tabsVerticalGapMd;
    case 'sm':
      return styles.tabsVerticalGapSm;
    case 'xs':
      return styles.tabsVerticalGapXs;
    default:
      return styles.tabsVerticalGapXl;
  }
});

const items = computed(() => props.labels);
const activeIndex = toRef(props, 'modelValue');
const itemCount = computed(() => props.labels.length);
const { trackRef, setItemRef, thumbStyle, ready } = useSlidingThumb(activeIndex, itemCount);

function select(index: number) {
  emit('update:modelValue', index);
}
</script>

<template>
  <div :class="styles.tabsRoot">
    <div
      ref="trackRef"
      class="eds-tabs"
      :class="[styles.tabs, horizontalGapClass, verticalGapClass]"
      role="tablist"
    >
      <EgTabItem
        v-for="(label, index) in items"
        :key="index"
        :ref="setItemRef(index)"
        :label="label"
        :selected="modelValue === index"
        @select="select(index)"
      />
    </div>
    <span
      :class="[styles.tabsSlideIndicator, ready && styles.tabsSlideIndicatorReady]"
      :style="thumbStyle"
      aria-hidden="true"
    />
  </div>
</template>
