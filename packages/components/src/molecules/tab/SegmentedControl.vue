<script setup lang="ts">
import { computed, toRef } from 'vue';
import styles from './Tab.module.css';
import { useSlidingThumb } from './useSlidingThumb';

export type SegmentedControlSize = 'lg' | 'md' | 'sm';
export type SegmentedControlShape = 'circle' | 'square';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    size?: SegmentedControlSize;
    shape?: SegmentedControlShape;
    labels?: string[];
  }>(),
  {
    modelValue: 0,
    size: 'md',
    shape: 'circle',
    labels: () => ['Tab', 'Tab', 'Tab'],
  },
);

const emit = defineEmits<{
  'update:modelValue': [index: number];
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case 'lg':
      return styles.itemLg;
    case 'sm':
      return styles.itemSm;
    default:
      return styles.itemMd;
  }
});

const activeIndex = toRef(props, 'modelValue');
const itemCount = computed(() => props.labels.length);
const { trackRef, setItemRef, thumbStyle, ready } = useSlidingThumb(activeIndex, itemCount);

function select(index: number) {
  emit('update:modelValue', index);
}
</script>

<template>
  <div
    :class="[
      'eds-segmented-control',
      styles.segment,
      shape === 'square' && styles.segmentSquare,
      shape === 'square' && styles.square,
    ]"
    role="tablist"
  >
    <div ref="trackRef" :class="styles.track">
      <span
        :class="[styles.segmentThumb, ready && styles.segmentThumbReady]"
        :style="thumbStyle"
        aria-hidden="true"
      />
      <button
        v-for="(label, index) in labels"
        :key="index"
        :ref="setItemRef(index)"
        type="button"
        role="tab"
        :class="[
          styles.item,
          sizeClass,
          modelValue === index && styles.itemSelected,
        ]"
        :aria-selected="modelValue === index"
        @click="select(index)"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>
