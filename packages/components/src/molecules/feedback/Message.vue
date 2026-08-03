<script setup lang="ts">
import { computed, inject } from 'vue';
import { MESSAGE_PARENT_FOCUSED_KEY } from './messageFocusContext';
import styles from './Feedback.module.css';

export type MessageType = 'subtle' | 'brand' | 'danger';

export type MessageFocusBackground = 'inherit' | 'same-white';

const props = withDefaults(
  defineProps<{
    type?: MessageType;
    text?: string;
    /** 行聚焦（如 Module Menu item）；未传时读取父级 provide。 */
    focused?: boolean;
    /** 聚焦时背景：inherit 保持 type 原色；same-white 使用 --material-same-white-primary。 */
    focusBackground?: MessageFocusBackground;
  }>(),
  {
    type: 'subtle',
    text: '0',
    focused: undefined,
    focusBackground: 'inherit',
  },
);

const parentItemFocused = inject(MESSAGE_PARENT_FOCUSED_KEY, null);

const isFocused = computed(
  () => props.focused ?? parentItemFocused?.value ?? false,
);

const typeClass = computed(() => {
  switch (props.type) {
    case 'brand':
      return styles.messageBrand;
    case 'danger':
      return styles.messageDanger;
    default:
      return styles.messageSubtle;
  }
});

const rootClass = computed(() => [
  styles.message,
  typeClass.value,
  isFocused.value && styles.messageFocused,
  isFocused.value &&
    props.focusBackground === 'same-white' &&
    styles.messageFocusBgSameWhite,
]);
</script>

<template>
  <span class="eds-message" :class="rootClass">
    <span :class="styles.messageTextWrap">
      <span :class="styles.messageSizer" aria-hidden="true">{{ text }}</span>
      <span :class="styles.messagePaint">{{ text }}</span>
    </span>
  </span>
</template>
