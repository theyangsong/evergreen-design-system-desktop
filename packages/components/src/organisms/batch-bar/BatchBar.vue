<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import BatchBarActionItem from './BatchBarActionItem.vue';
import styles from './BatchBar.module.css';

withDefaults(
  defineProps<{
    selectedCount?: string | number;
    countSuffix?: string;
    actionLabel?: string;
  }>(),
  {
    selectedCount: '0',
    countSuffix: 'Selectd',
    actionLabel: 'Label',
  },
);

const emit = defineEmits<{
  dismiss: [];
  action: [];
}>();
</script>

<template>
  <div class="eds-batch-bar" :class="styles.root">
    <div :class="['effect-flotation-box', styles.glass]">
      <slot name="leading">
        <BatchBarActionItem type="symbol" @click="emit('dismiss')" />
      </slot>
      <EgDivider :class="styles.divider" type="module" direction="vertical" :hide="false" />
      <slot name="statistics">
        <BatchBarActionItem
          type="statistics"
          :count="selectedCount"
          :count-suffix="countSuffix"
        />
      </slot>
      <EgDivider :class="styles.divider" type="module" direction="vertical" :hide="false" />
      <slot name="actions">
        <BatchBarActionItem type="text" :label="actionLabel" @click="emit('action')" />
      </slot>
    </div>
  </div>
</template>
