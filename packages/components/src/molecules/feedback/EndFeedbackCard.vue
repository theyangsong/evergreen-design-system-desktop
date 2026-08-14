<script setup lang="ts">
import { EgDoneTick } from '../done-tick';
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
      <span :class="styles.stateIconTick">
        <EgDoneTick />
      </span>
    </span>
    <span>{{ text }}</span>
  </div>
</template>
