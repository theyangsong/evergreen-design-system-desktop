<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgButton, type ButtonSize } from '../button';
import { EgIconButton } from '../icon-button';
import styles from './Input.module.css';

export type InputType = 'standard' | 'amount';
export type InputSize = 'lg' | 'md' | 'sm';
export type InputWidthMode = 'fixed' | 'full';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    type?: InputType;
    size?: InputSize;
    widthMode?: InputWidthMode;
    placeholder?: string;
    amountPlaceholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    unit?: string;
    clearable?: boolean;
    secure?: boolean;
    showMax?: boolean;
    maxLabel?: string;
    inputmode?: 'text' | 'decimal' | 'numeric';
  }>(),
  {
    modelValue: '',
    type: 'standard',
    size: 'md',
    widthMode: 'fixed',
    placeholder: '请输入',
    amountPlaceholder: '0',
    disabled: false,
    readonly: false,
    clearable: true,
    secure: false,
    showMax: false,
    maxLabel: 'Max',
    inputmode: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  clear: [];
  max: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const slots = useSlots();
const inputRef = ref<HTMLInputElement | null>(null);
const fieldRef = ref<HTMLElement | null>(null);
const fieldFocused = ref(false);
const suppressBlur = ref(false);
const passwordVisible = ref(false);
const unitLeftPx = ref(0);
const valueWidthPx = ref(0);
const unitWidthPx = ref(0);

/** Inline — WebKit often omits stylesheet text-rendering on native inputs in Computed. */
const inputRenderStyle = {
  textRendering: 'geometricPrecision',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
} as const;

const isAmount = computed(() => props.type === 'amount');

/** Max suffix: Input Lg/Md/Sm → Button Md/Sm/Xs (Subtle solid). */
const maxButtonSize = computed<ButtonSize>(() => {
  switch (props.size) {
    case 'lg':
      return 'md';
    case 'md':
      return 'sm';
    default:
      return 'xs';
  }
});

/** Amount + unit: unit trails the typed value (follows caret), not right-aligned. */
const useGhostUnit = computed(() => isAmount.value && Boolean(props.unit));

const resolvedInputMode = computed(
  () => props.inputmode ?? (isAmount.value ? 'decimal' : 'text'),
);

const resolvedPlaceholder = computed(() => {
  if (useGhostUnit.value) {
    return `${props.amountPlaceholder} ${props.unit}`;
  }

  return isAmount.value ? props.amountPlaceholder : props.placeholder;
});

const resolvedInputType = computed(() => {
  if (!props.secure) {
    return 'text';
  }
  return passwordVisible.value ? 'text' : 'password';
});

const showSecureToggle = computed(() => props.secure && !slots.suffix);

const showClear = computed(
  () =>
    !props.secure &&
    props.clearable &&
    fieldFocused.value &&
    !props.disabled &&
    !props.readonly &&
    props.modelValue.length > 0,
);

const showInlineUnit = computed(
  () => Boolean(props.unit) && !useGhostUnit.value,
);

const showGhostUnit = computed(
  () => useGhostUnit.value && props.modelValue.length > 0,
);

/** Reserve clear width when suffix siblings (inline unit / Max / custom) may sit beside it. */
const reserveClearSpace = computed(
  () =>
    props.clearable &&
    (showInlineUnit.value || props.showMax || Boolean(slots.suffix)),
);

const showDefaultSuffix = computed(
  () =>
    showClear.value ||
    reserveClearSpace.value ||
    showInlineUnit.value ||
    showSecureToggle.value,
);

const showSuffix = computed(
  () => Boolean(slots.suffix) || showDefaultSuffix.value,
);

/** Max 预置：在 field 外单独挂载，不参与 field padding 计算 */
const showAttachedMax = computed(
  () => props.showMax && !slots.suffix,
);

const amountControlStyle = computed(() => {
  if (!useGhostUnit.value) {
    return undefined;
  }

  const gap = 4;

  if (props.modelValue.length > 0) {
    return {
      '--eds-input-unit-left': `${unitLeftPx.value}px`,
      width: `${valueWidthPx.value + gap + unitWidthPx.value}px`,
    };
  }

  if (props.widthMode === 'full') {
    return {
      '--eds-input-unit-left': '0px',
    };
  }

  if (valueWidthPx.value > 0) {
    return {
      '--eds-input-unit-left': '0px',
      width: `${valueWidthPx.value}px`,
    };
  }

  return undefined;
});

/** Ghost unit: size the native input to the typed value so the unit trails the caret. */
const shrinkInputStyle = computed(() => {
  if (!useGhostUnit.value) {
    return undefined;
  }

  if (props.modelValue.length > 0) {
    return { width: `${Math.max(valueWidthPx.value, 1)}px` };
  }

  if (props.widthMode === 'full') {
    return undefined;
  }

  if (valueWidthPx.value > 0) {
    return { width: `${valueWidthPx.value}px` };
  }

  return undefined;
});

const amountControlEmptyFull = computed(
  () =>
    useGhostUnit.value &&
    props.widthMode === 'full' &&
    props.modelValue.length === 0,
);

function measureTextWidth(text: string, source: HTMLElement) {
  const style = getComputedStyle(source);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return text.length * 8;
  }

  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return context.measureText(text).width;
}

function updateGhostUnitMetrics() {
  const input = inputRef.value;
  if (!input || !useGhostUnit.value || !props.unit) {
    unitLeftPx.value = 0;
    valueWidthPx.value = 0;
    unitWidthPx.value = 0;
    return;
  }

  const gap = 4;
  const value = props.modelValue;
  unitWidthPx.value = measureTextWidth(props.unit, input);

  if (value.length > 0) {
    valueWidthPx.value = measureTextWidth(value, input);
    unitLeftPx.value = valueWidthPx.value + gap;
  } else {
    valueWidthPx.value = measureTextWidth(resolvedPlaceholder.value, input);
    unitLeftPx.value = 0;
  }
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function onFieldFocusIn() {
  fieldFocused.value = true;
}

function onFieldFocusOut(event: FocusEvent) {
  const field = event.currentTarget as HTMLElement;
  if (field.contains(event.relatedTarget as Node)) {
    return;
  }

  fieldFocused.value = false;
}

function onFocus(event: FocusEvent) {
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  if (suppressBlur.value) {
    return;
  }

  const field = fieldRef.value;
  if (field?.contains(event.relatedTarget as Node)) {
    return;
  }

  emit('blur', event);
}

function onClear() {
  suppressBlur.value = true;
  emit('update:modelValue', '');
  emit('clear');

  void nextTick(() => {
    inputRef.value?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      suppressBlur.value = false;
    });
  });
}

function onMax() {
  emit('max');
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value;
}

function focusInput() {
  inputRef.value?.focus();
}

defineExpose({
  focus: focusInput,
});

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

watch(
  () => [props.modelValue, props.unit, props.type, props.size] as const,
  async () => {
    await nextTick();
    updateGhostUnitMetrics();
  },
  { immediate: true },
);

onMounted(() => {
  updateGhostUnitMetrics();
});
</script>

<template>
  <div
    :class="[
      styles.root,
      widthMode === 'full' ? styles.widthFull : styles.widthFixed,
    ]"
  >
    <div
      ref="fieldRef"
      :class="[
        'eds-input-field',
        styles.field,
        styles[size],
        isAmount && styles.amount,
        showAttachedMax && styles.fieldWithMax,
        disabled && styles.fieldDisabled,
      ]"
      @click="onFieldClick"
      @focusin="onFieldFocusIn"
      @focusout="onFieldFocusOut"
    >
      <div
        :class="[showAttachedMax ? styles.fieldMain : styles.fieldBody]"
      >
        <!-- Left: input content. Default = native input -->
        <div :class="styles.prefix">
          <slot name="prefix">
            <div
              :class="[
                styles.valueGroup,
                useGhostUnit && styles.amountControl,
                amountControlEmptyFull && styles.amountControlEmptyFull,
              ]"
              :style="amountControlStyle"
            >
              <input
                ref="inputRef"
                :class="[
                  'eds-input-control',
                  styles.input,
                  useGhostUnit && styles.shrinkInput,
                  useGhostUnit && styles.amountInput,
                ]"
                :style="[inputRenderStyle, shrinkInputStyle]"
                :value="modelValue"
                :type="resolvedInputType"
                :inputmode="resolvedInputMode"
                :placeholder="resolvedPlaceholder"
                :disabled="disabled"
                :readonly="readonly"
                spellcheck="false"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
              />

              <!-- Amount unit: trails value / caret -->
              <span
                v-if="showGhostUnit"
                :class="['eds-input-unit', styles.ghostUnit]"
                aria-hidden="true"
              >
                {{ unit }}
              </span>
            </div>
          </slot>
        </div>

        <!-- Right: clear / inline unit（Max 在 field 内、不参与 padding 高度） -->
        <div v-if="showSuffix" :class="styles.suffix">
          <slot name="suffix">
            <button
              v-if="clearable && (showClear || reserveClearSpace)"
              type="button"
              :class="[styles.clearButton, !showClear && styles.clearButtonHidden]"
              aria-label="Clear"
              :aria-hidden="!showClear"
              tabindex="-1"
              @mousedown.prevent
              @pointerdown.prevent
              @click="onClear"
            >
              <svg
                :class="styles.clearIcon"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="7" fill="currentColor" />
                <path
                  d="M6 6l4 4m0-4-4 4"
                  stroke="var(--material-same-white-primary)"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <span
              v-if="showInlineUnit"
              :class="['eds-input-unit', styles.unit]"
            >
              {{ unit }}
            </span>

            <EgIconButton
              v-if="showSecureToggle"
              size="sm"
              shape="square"
              :label="passwordVisible ? '隐藏密码' : '显示密码'"
              :disabled="disabled || readonly"
              @mousedown.prevent
              @click.stop="togglePasswordVisible"
            >
              <EgIcon
                :name="passwordVisible ? 'eds-eye' : 'eds-uneye'"
                fit
                size="md"
              />
            </EgIconButton>
          </slot>
        </div>
      </div>

      <span v-if="showAttachedMax" :class="styles.maxAttach">
        <EgButton
          tone="subtle"
          variant="solid"
          :size="maxButtonSize"
          :disabled="disabled"
          type="button"
          @mousedown.prevent
          @click="onMax"
        >
          {{ maxLabel }}
        </EgButton>
      </span>
    </div>
  </div>
</template>
