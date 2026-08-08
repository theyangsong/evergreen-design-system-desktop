<script setup lang="ts">
import { EgTextarea } from '../textarea';
import fieldStyles from './ComboField.module.css';

const modelValue = defineModel<string>({ default: '' });

withDefaults(
  defineProps<{
    label?: string;
    feedback?: boolean;
    placeholder?: string;
  }>(),
  {
    label: 'Label',
    feedback: false,
    placeholder: '请输入',
  },
);
</script>

<template>
  <div :class="[fieldStyles.root, feedback && fieldStyles.rootWithFeedback]">
    <template v-if="feedback">
      <div :class="fieldStyles.body">
        <span :class="fieldStyles.label">{{ label }}</span>
        <div :class="fieldStyles.control">
          <slot>
            <EgTextarea v-model="modelValue" :placeholder="placeholder" width-mode="full" />
          </slot>
        </div>
      </div>
      <div :class="fieldStyles.feedback">
        <slot name="feedback">辅助说明文案。</slot>
      </div>
    </template>
    <template v-else>
      <span :class="fieldStyles.label">{{ label }}</span>
      <div :class="fieldStyles.control">
        <slot>
          <EgTextarea v-model="modelValue" :placeholder="placeholder" width-mode="full" />
        </slot>
      </div>
    </template>
  </div>
</template>
