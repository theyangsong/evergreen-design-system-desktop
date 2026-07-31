<script setup lang="ts">
import { EgIconButton } from '../../molecules/icon-button';
import { EgIcon } from '../../atoms/icons';
import styles from './ToolBar.module.css';

withDefaults(
  defineProps<{
    title?: string;
    showBack?: boolean;
    backLabel?: string;
  }>(),
  {
    title: 'Title',
    showBack: false,
    backLabel: 'Back',
  },
);

const emit = defineEmits<{
  back: [];
}>();
</script>

<template>
  <div class="eds-tool-bar-title" :class="styles.titleRow">
    <EgIconButton
      v-if="showBack"
      shape="square"
      size="sm"
      :label="backLabel"
      @click="emit('back')"
    >
      <EgIcon name="eds-arrow-left-mini-ios" size="sm" />
    </EgIconButton>
    <p :class="styles.titleText">
      <slot>{{ title }}</slot>
    </p>
  </div>
</template>
