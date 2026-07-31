<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import ToolBarTitle from './ToolBarTitle.vue';
import styles from './ToolBar.module.css';

withDefaults(
  defineProps<{
    title?: string;
    showBack?: boolean;
    showOperation?: boolean;
    showDivider?: boolean;
    showSection?: boolean;
  }>(),
  {
    title: 'Title',
    showBack: false,
    showOperation: true,
    showDivider: false,
    showSection: false,
  },
);
</script>

<template>
  <header class="eds-tool-bar" :class="styles.root">
    <div :class="styles.raw">
      <ToolBarTitle :title="title" :show-back="showBack">
        <slot name="title">{{ title }}</slot>
      </ToolBarTitle>
      <div :class="styles.functional">
        <div v-if="showSection" :class="styles.sectionRow">
          <slot name="section" />
        </div>
        <slot name="functional" />
        <div v-if="showOperation && $slots.operation" :class="styles.operation">
          <slot name="operation" />
        </div>
      </div>
    </div>
    <EgDivider v-if="showDivider" :class="styles.divider" type="page" direction="horizontal" />
  </header>
</template>
