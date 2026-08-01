<script setup lang="ts">
import styles from './IconButton.module.css';

/** Figma Type */
export type IconButtonShape = 'rectangular' | 'square' | 'round';
export type IconButtonSize = 'lg' | 'md' | 'sm' | 'xs';

const props = withDefaults(
  defineProps<{
    shape?: IconButtonShape;
    size?: IconButtonSize;
    label: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    /**
     * Use `span` when nested inside another control (e.g. EgIconButtonPro)
     * to avoid invalid button-in-button markup.
     */
    as?: 'button' | 'span';
  }>(),
  {
    shape: 'rectangular',
    size: 'lg',
    disabled: false,
    type: 'button',
    as: 'button',
  },
);
</script>

<template>
  <component
    :is="as === 'span' ? 'span' : 'button'"
    :class="[
      'eds-icon-button',
      styles.button,
      styles[props.shape],
      styles[props.size],
      as === 'span' && styles.decor,
      disabled && styles.isDisabled,
    ]"
    :disabled="as === 'button' ? disabled : undefined"
    :type="as === 'button' ? type : undefined"
    :aria-label="as === 'button' ? label : undefined"
    :aria-disabled="as === 'span' && disabled ? true : undefined"
    :aria-hidden="as === 'span' ? true : undefined"
  >
    <span :class="styles.symbol">
      <slot name="symbol">
        <slot />
      </slot>
    </span>
  </component>
</template>
