<script setup lang="ts">
import { computed } from 'vue';
import styles from './Radio.module.css';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
  }>(),
  {
    modelValue: false,
    disabled: false,
    value: 'default',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const checked = computed(() => props.modelValue);

function select() {
  if (props.disabled) return;
  emit('update:modelValue', true);
}
</script>

<template>
  <button
    type="button"
    role="radio"
    :class="[
      'eds-radio',
      styles.root,
      !checked && styles.isUnchecked,
      checked && styles.filled,
      disabled && !checked && styles.uncheckedDisabled,
      disabled && checked && styles.filledDisabled,
    ]"
    :aria-checked="checked"
    :disabled="disabled"
    :name="name"
    @click="select"
  >
    <span v-if="!checked" :class="styles.hoverPreviewDot" aria-hidden="true" />
    <span v-if="checked" :class="styles.radioDot" aria-hidden="true" />
  </button>
</template>
