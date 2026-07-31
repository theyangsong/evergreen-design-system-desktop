<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgIcon } from '../../atoms/icons';
import styles from './Search.module.css';

export type SearchWidthMode = 'fixed' | 'full';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    widthMode?: SearchWidthMode;
  }>(),
  {
    modelValue: '',
    placeholder: 'Search',
    disabled: false,
    readonly: false,
    widthMode: 'fixed',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const focused = ref(false);

const isEntering = computed(
  () => focused.value && props.modelValue.length > 0,
);

const showClear = computed(
  () => focused.value && !props.disabled && !props.readonly,
);

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function onFocus(event: FocusEvent) {
  focused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  focused.value = false;
  emit('blur', event);
}

function onFieldClick(event: MouseEvent) {
  if (props.disabled || props.readonly) {
    return;
  }

  const target = event.target as HTMLElement;
  if (target.closest('button')) {
    return;
  }

  inputRef.value?.focus();
}

function onClear() {
  emit('update:modelValue', '');
  emit('clear');
  inputRef.value?.focus();
}
</script>

<template>
  <div
    :class="[
      styles.root,
      widthMode === 'full' ? styles.widthFull : styles.widthFixed,
    ]"
  >
    <div
      :class="[
        styles.field,
        focused && styles.fieldFocused,
        isEntering && styles.fieldEntering,
        disabled && styles.fieldDisabled,
      ]"
      @click="onFieldClick"
    >
      <EgIcon :class="styles.icon" name="eds-search" size="sm" />

      <div :class="styles.inputWrap">
        <input
          ref="inputRef"
          :class="styles.input"
          type="search"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          spellcheck="false"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>

      <button
        v-if="showClear"
        type="button"
        :class="styles.clearButton"
        aria-label="Clear"
        @mousedown.prevent
        @click="onClear"
      >
        <EgIcon name="eds-close" size="sm" />
      </button>
    </div>
  </div>
</template>
