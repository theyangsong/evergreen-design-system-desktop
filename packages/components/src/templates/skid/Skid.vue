<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import { EgComboActionSkid } from '../../molecules/combo';
import styles from './Skid.module.css';

withDefaults(
  defineProps<{
    title?: string;
    showButton?: boolean;
    split?: boolean;
    confirmLabel?: string;
  }>(),
  {
    title: 'Title',
    showButton: true,
    split: false,
    confirmLabel: 'Confirm',
  },
);

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <aside class="eds-skid" :class="styles.root" aria-label="Skid panel">
    <div :class="styles.title">
      <div :class="styles.titleRaw">
        <p :class="styles.titleText">
          <slot name="title">{{ title }}</slot>
        </p>
      </div>
      <EgDivider v-if="split" :class="styles.splitDivider" type="page" direction="horizontal" />
    </div>
    <div :class="styles.body">
      <slot />
    </div>
    <div v-if="showButton" :class="styles.actions">
      <slot name="actions">
        <EgComboActionSkid :confirm-label="confirmLabel" @confirm="emit('confirm')" />
      </slot>
    </div>
  </aside>
</template>
