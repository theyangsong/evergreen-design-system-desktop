<script setup lang="ts">
import fieldStyles from './ComboField.module.css';

withDefaults(
  defineProps<{
    label?: string;
    feedback?: boolean;
  }>(),
  {
    label: 'Label',
    feedback: false,
  },
);
</script>

<template>
  <div :class="[fieldStyles.root, feedback && fieldStyles.rootWithFeedback]">
    <template v-if="feedback">
      <div :class="fieldStyles.body">
        <span :class="fieldStyles.label">{{ label }}</span>
        <div :class="fieldStyles.control">
          <slot />
        </div>
      </div>
      <div :class="fieldStyles.feedback">
        <slot name="feedback">辅助说明文案。</slot>
      </div>
    </template>
    <template v-else>
      <span :class="fieldStyles.label">{{ label }}</span>
      <div :class="fieldStyles.control">
        <slot />
      </div>
    </template>
  </div>
</template>
