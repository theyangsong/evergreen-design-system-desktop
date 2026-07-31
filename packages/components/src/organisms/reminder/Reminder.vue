<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import { EgComboActionPopupWindow } from '../../molecules/combo';
import styles from './Reminder.module.css';

export type ReminderType = 'info' | 'echo';

withDefaults(
  defineProps<{
    type?: ReminderType;
    title?: string;
    secondaryText?: string;
    showSecondaryText?: boolean;
    confirmLabel?: string;
    actionCount?: 1 | 2;
  }>(),
  {
    type: 'info',
    title: 'Title',
    secondaryText: 'I am text',
    showSecondaryText: true,
    confirmLabel: 'Confirm',
    actionCount: 1,
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <div
    class="eds-reminder"
    :class="[styles.root, type === 'echo' && styles.echo]"
    role="dialog"
    aria-modal="true"
  >
    <div :class="styles.symbol">
      <slot name="symbol">
        <EgIcon name="eds-warning-lonely" size="md" />
      </slot>
    </div>
    <div :class="styles.copy">
      <p :class="styles.title">{{ title }}</p>
      <p v-if="showSecondaryText && type === 'info'" :class="styles.secondary">
        {{ secondaryText }}
      </p>
    </div>
    <div v-if="type === 'echo' && $slots.default" :class="styles.echoBody">
      <slot />
    </div>
    <div :class="styles.actions">
      <slot name="actions">
        <EgComboActionPopupWindow
          tone="decor"
          :count="actionCount"
          :confirm-label="confirmLabel"
          @confirm="emit('confirm')"
          @cancel="emit('cancel')"
        />
      </slot>
    </div>
  </div>
</template>
