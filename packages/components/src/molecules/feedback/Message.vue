<script setup lang="ts">
import { computed } from 'vue';
import styles from './Feedback.module.css';

export type MessageType = 'subtle' | 'brand' | 'danger';

const props = withDefaults(
  defineProps<{
    type?: MessageType;
    text?: string;
  }>(),
  {
    type: 'subtle',
    text: '0',
  },
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
</script>

<template>
  <span class="eds-message" :class="[styles.message, typeClass]">
    <span :class="styles.messageText">{{ text }}</span>
  </span>
</template>
