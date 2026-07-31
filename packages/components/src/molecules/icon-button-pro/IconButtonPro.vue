<script setup lang="ts">
import { EgIconButton } from '../icon-button';
import styles from './IconButtonPro.module.css';

const props = withDefaults(
  defineProps<{
    label: string;
    badge?: string | number;
    showBadge?: boolean;
    showReddot?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    badge: 0,
    showBadge: false,
    showReddot: false,
    disabled: false,
    type: 'button',
  },
);
</script>

<template>
  <button
    :class="['eds-icon-button-pro', styles.root, disabled && styles.disabled]"
    :disabled="disabled"
    :type="type"
    :aria-label="label"
  >
    <span :class="styles.iconSlot">
      <!-- Nested Simple container; as=span avoids invalid button-in-button. -->
      <EgIconButton
        as="span"
        shape="rectangular"
        size="sm"
        :label="label"
        :disabled="disabled"
      >
        <slot />
      </EgIconButton>
      <span v-if="showBadge" :class="styles.badge" aria-hidden="true">
        <span :class="styles.badgeText">{{ badge }}</span>
      </span>
      <span v-if="showReddot" :class="styles.reddot" aria-hidden="true" />
    </span>
    <span :class="styles.label">{{ label }}</span>
  </button>
</template>
