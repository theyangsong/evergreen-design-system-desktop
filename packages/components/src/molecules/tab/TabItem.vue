<script setup lang="ts">
import styles from './Tab.module.css';

const props = withDefaults(
  defineProps<{
    selected?: boolean;
    label?: string;
  }>(),
  {
    selected: false,
    label: 'Tab',
  },
);

const emit = defineEmits<{
  select: [];
}>();
</script>

<template>
  <button
    type="button"
    role="tab"
    :class="[
      'eds-tab',
      styles.tabItem,
      selected && styles.tabItemSelected,
    ]"
    :aria-selected="selected"
    @click="emit('select')"
  >
    <span>{{ label }}</span>
  </button>
</template>
