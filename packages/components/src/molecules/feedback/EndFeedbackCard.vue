<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import styles from './Feedback.module.css';

withDefaults(
  defineProps<{
    text?: string;
  }>(),
  {
    text: 'I am Text',
  },
);
</script>

<template>
  <div class="eds-end-feedback-card" :class="styles.endCard" role="status">
    <span :class="styles.stateIcon">
      <EgIcon name="eds-tick-strong-fill" size="sm" />
    </span>
    <span>{{ text }}</span>
  </div>
</template>
