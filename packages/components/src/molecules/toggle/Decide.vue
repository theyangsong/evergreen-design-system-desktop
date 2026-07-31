<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import styles from './Decide.module.css';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const decided = computed(() => props.modelValue);

function toggle() {
  if (props.disabled) return;
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <button
    type="button"
    :class="[
      'eds-decide',
      styles.root,
      !decided && styles.isUndecided,
      decided && styles.filled,
      disabled && !decided && styles.uncheckedDisabled,
      disabled && decided && styles.filledDisabled,
    ]"
    :aria-pressed="decided"
    :disabled="disabled"
    @click="toggle"
  >
    <span v-if="!decided" :class="[styles.iconLayer, styles.hoverPreviewTick]" aria-hidden="true">
      <EgIcon name="oval-tick-mini" size="sm" fit />
    </span>
    <span v-if="decided" :class="styles.iconLayer" aria-hidden="true">
      <EgIcon name="oval-tick-mini" size="sm" fit />
    </span>
  </button>
</template>
