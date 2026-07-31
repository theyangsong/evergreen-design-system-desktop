<script setup lang="ts">
import { computed } from 'vue';
import shared from '@/views/shared/showcase.module.css';
import styles from './ComponentDocLayout.module.css';
import {
  filterDocCustomizeControls,
  isControlVisible,
  type DocCustomizeControl,
} from './types';

const props = defineProps<{
  controls: DocCustomizeControl[];
  /** Section heading; default「定制」. Nested panels use component tag (e.g. EgFormSubmission). */
  title?: string;
  /** Nested component customize: smaller mono heading (two type steps below section title). */
  nested?: boolean;
  /** Single-column stack (e.g. Nav Bar module names top-to-bottom). */
  sequential?: boolean;
  /** Render inside a parent customize section (no outer section wrapper). */
  embedded?: boolean;
}>();

const state = defineModel<Record<string, unknown>>({ required: true });

const customizeControls = computed(() => filterDocCustomizeControls(props.controls));

const visibleControls = computed(() =>
  customizeControls.value.filter((control) => isControlVisible(control, state.value)),
);

const useSequentialRows = computed(
  () => props.sequential && customizeControls.value.some((control) => control.row != null),
);

const sequentialRowGroups = computed(() => {
  if (!useSequentialRows.value) return [];

  const groups: { row: number; controls: DocCustomizeControl[] }[] = [];

  for (const control of visibleControls.value) {
    const row = control.row ?? 0;
    const last = groups[groups.length - 1];

    if (last && last.row === row) {
      last.controls.push(control);
      continue;
    }

    groups.push({ row, controls: [control] });
  }

  return groups;
});

function patchKey(key: string, value: unknown) {
  const current = state.value;
  if (!current || typeof current !== 'object') return;
  current[key] = value;
}

function onSelect(key: string, event: Event) {
  const target = event.target as HTMLSelectElement;
  patchKey(key, target.value);
}

function onBoolean(key: string, event: Event) {
  const target = event.target as HTMLInputElement;
  patchKey(key, target.checked);
}

function onText(key: string, event: Event) {
  const target = event.target as HTMLInputElement;
  patchKey(key, target.value);
}
</script>

<template>
  <component
    :is="embedded ? 'div' : 'section'"
    :class="embedded ? styles.customizeEmbedded : [shared.section, styles.customizeSection]"
  >
    <h2
      :class="nested || embedded ? styles.customizeNestedTitle : shared.sectionTitle"
    >
      {{ title ?? '定制' }}
    </h2>
    <div
      v-if="useSequentialRows && visibleControls.length"
      :class="styles.customizeGridSequentialRows"
    >
      <div
        v-for="group in sequentialRowGroups"
        :key="group.controls.map((control) => control.key).join('-')"
        :class="styles.customizeRow"
      >
        <label
          v-for="control in group.controls"
          :key="control.key"
          :class="styles.customizeField"
        >
          <span :class="styles.customizeLabel">{{ control.label }}</span>
          <select
            v-if="control.kind === 'select'"
            :class="styles.customizeControl"
            :value="String(state[control.key] ?? '')"
            @change="onSelect(control.key, $event)"
          >
            <option v-for="opt in control.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <input
            v-else-if="control.kind === 'boolean'"
            type="checkbox"
            :class="styles.customizeCheckbox"
            :checked="Boolean(state[control.key])"
            @change="onBoolean(control.key, $event)"
          />
          <input
            v-else
            type="text"
            :class="styles.customizeControl"
            :placeholder="control.placeholder"
            :value="String(state[control.key] ?? '')"
            @input="onText(control.key, $event)"
          />
        </label>
      </div>
    </div>
    <div
      v-else-if="visibleControls.length"
      :class="sequential ? styles.customizeGridSequential : styles.customizeGrid"
    >
      <label
        v-for="control in visibleControls"
        :key="control.key"
        :class="styles.customizeField"
      >
        <span :class="styles.customizeLabel">{{ control.label }}</span>
        <select
          v-if="control.kind === 'select'"
          :class="styles.customizeControl"
          :value="String(state[control.key] ?? '')"
          @change="onSelect(control.key, $event)"
        >
          <option v-for="opt in control.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <input
          v-else-if="control.kind === 'boolean'"
          type="checkbox"
          :class="styles.customizeCheckbox"
          :checked="Boolean(state[control.key])"
          @change="onBoolean(control.key, $event)"
        />
        <input
          v-else
          type="text"
          :class="styles.customizeControl"
          :placeholder="control.placeholder"
          :value="String(state[control.key] ?? '')"
          @input="onText(control.key, $event)"
        />
      </label>
    </div>
    <slot name="extra" />
  </component>
</template>
