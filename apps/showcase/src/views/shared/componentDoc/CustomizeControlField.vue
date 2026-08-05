<script setup lang="ts">
import { EgCheckbox, EgInput } from '@eds/website-components';
import styles from './ComponentDocLayout.module.css';
import type { DocCustomizeControl } from './types';

defineProps<{
  control: DocCustomizeControl;
  value: unknown;
}>();

const emit = defineEmits<{
  update: [value: unknown];
}>();
</script>

<template>
  <div :class="styles.customizeField">
    <span :class="styles.customizeLabel">{{ control.label }}</span>
    <div :class="styles.customizeControlSlot">
      <EgCheckbox
        v-if="control.kind === 'boolean'"
        :id="`customize-${control.key}`"
        size="sm"
        :class="styles.customizeWebsiteCheckbox"
        :model-value="Boolean(value)"
        @update:model-value="emit('update', $event)"
      />
      <select
        v-else-if="control.kind === 'select'"
        :class="styles.customizeControl"
        :value="String(value ?? '')"
        @change="emit('update', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in control.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <EgInput
        v-else-if="control.kind === 'text'"
        size="sm"
        width-mode="full"
        :clearable="false"
        :class="styles.customizeWebsiteInput"
        :model-value="String(value ?? '')"
        :placeholder="control.placeholder"
        @update:model-value="emit('update', $event)"
      />
    </div>
  </div>
</template>
