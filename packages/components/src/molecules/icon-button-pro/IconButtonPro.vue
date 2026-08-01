<script setup lang="ts">
import { computed } from 'vue';
import { EgIconButton } from '../icon-button';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
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

const formattedBadge = computed(() => formatGroupedNumber(props.badge));

const showBadgeIndicator = computed(() => props.showBadge);
const showReddotIndicator = computed(() => props.showReddot && !props.showBadge);
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
      <span v-if="showBadgeIndicator" :class="styles.badge" aria-hidden="true">
        <span :class="styles.badgeText">{{ formattedBadge }}</span>
      </span>
      <span v-if="showReddotIndicator" :class="styles.reddot" aria-hidden="true" />
    </span>
    <span :class="styles.labelWrap">
      <span :class="styles.labelPaint" aria-hidden="true">{{ label }}</span>
      <span :class="styles.labelSizer">{{ label }}</span>
    </span>
  </button>
</template>
