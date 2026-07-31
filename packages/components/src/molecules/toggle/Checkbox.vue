<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import styles from './Checkbox.module.css';

export type CheckboxState = 'unchecked' | 'checked' | 'indeterminate';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    indeterminate: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const state = computed<CheckboxState>(() => {
  if (props.indeterminate) return 'indeterminate';
  return props.modelValue ? 'checked' : 'unchecked';
});

const isFilled = computed(() => state.value === 'checked' || state.value === 'indeterminate');

function toggle() {
  if (props.disabled) return;
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :class="[
      'eds-checkbox',
      styles.root,
      state === 'unchecked' && styles.isUnchecked,
      isFilled && styles.filled,
      disabled && !isFilled && styles.uncheckedDisabled,
      disabled && isFilled && styles.filledDisabled,
    ]"
    :aria-checked="indeterminate ? 'mixed' : modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span v-if="state === 'unchecked'" :class="[styles.iconLayer, styles.hoverPreviewTick]" aria-hidden="true">
      <EgIcon name="oval-tick-mini" size="sm" fit />
    </span>
    <span v-if="state === 'checked'" :class="styles.iconLayer" aria-hidden="true">
      <EgIcon name="oval-tick-mini" size="sm" fit />
    </span>
    <span v-else-if="state === 'indeterminate'" :class="styles.iconLayer" aria-hidden="true">
      <EgIcon name="eds-reduction-mini" size="sm" fit />
    </span>
  </button>
</template>
