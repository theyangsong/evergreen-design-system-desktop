<script setup lang="ts">
import { computed } from 'vue';
import { EgCheckbox, EgInput } from '@eds/website-components';
import styles from './ComponentDocLayout.module.css';
import type { DocCustomizeBooleanControl, DocCustomizeControl } from './types';

const props = defineProps<{
  control: DocCustomizeControl;
  value: unknown;
  inlineSelectValue?: unknown;
}>();

const emit = defineEmits<{
  update: [value: unknown];
  inlineSelectUpdate: [value: unknown];
}>();

const booleanControl = computed(() =>
  props.control.kind === 'boolean' ? (props.control as DocCustomizeBooleanControl) : null,
);

const inlineSelect = computed(() => booleanControl.value?.inlineSelect);

const showInlineSelect = computed(
  () => Boolean(props.value) && inlineSelect.value != null,
);

const inlineSelectModel = computed(
  () =>
    String(
      props.inlineSelectValue
        ?? inlineSelect.value?.options[0]?.value
        ?? '',
    ),
);
</script>

<template>
  <div :class="styles.customizeField">
    <span :class="styles.customizeLabel">{{ control.label }}</span>
    <div
      :class="[
        styles.customizeControlSlot,
        showInlineSelect && styles.customizeControlSlotWithInline,
      ]"
    >
      <template v-if="control.kind === 'boolean'">
        <EgCheckbox
          :id="`customize-${control.key}`"
          size="sm"
          :class="styles.customizeWebsiteCheckbox"
          :model-value="Boolean(value)"
          @update:model-value="emit('update', $event)"
        />
        <div v-if="showInlineSelect && inlineSelect" :class="styles.customizeInlineSelectGroup">
          <span :class="styles.customizeInlineSelectLabel">{{ inlineSelect.label }}</span>
          <select
            :key="inlineSelect.key"
            :class="[styles.customizeControl, styles.customizeInlineSelect]"
            :value="inlineSelectModel"
            @change="emit('inlineSelectUpdate', ($event.target as HTMLSelectElement).value)"
          >
            <option
              v-for="opt in inlineSelect.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </template>
      <select
        v-else-if="control.kind === 'select'"
        :key="control.key"
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
