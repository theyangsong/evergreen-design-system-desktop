<script setup lang="ts">
import { computed } from 'vue';
import styles from './Toggle.module.css';

export type SwitchSize = 'lg' | 'md' | 'sm';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    size?: SwitchSize;
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    size: 'md',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case 'lg':
      return styles.switchLg;
    case 'sm':
      return styles.switchSm;
    default:
      return styles.switchMd;
  }
});

function toggle() {
  if (props.disabled) return;
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :class="[
      'eds-switch',
      styles.switch,
      sizeClass,
      modelValue && styles.switchOn,
    ]"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span :class="styles.knob" aria-hidden="true" />
  </button>
</template>
