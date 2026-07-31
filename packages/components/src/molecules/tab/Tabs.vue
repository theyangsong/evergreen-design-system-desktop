<script setup lang="ts">
import { computed, toRef } from 'vue';
import EgTabItem from './TabItem.vue';
import styles from './Tab.module.css';
import { useSlidingThumb } from './useSlidingThumb';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    labels?: string[];
  }>(),
  {
    modelValue: 0,
    labels: () => ['Tab', 'Tab', 'Tab', 'Tab', 'Tab'],
  },
);

const emit = defineEmits<{
  'update:modelValue': [index: number];
}>();

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
    <div ref="trackRef" class="eds-tabs" :class="styles.tabs" role="tablist">
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
