<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgLink } from '../link';
import styles from './Feedback.module.css';

export type FormSubmissionType = 'notes' | 'danger' | 'success';

const props = withDefaults(
  defineProps<{
    type?: FormSubmissionType;
    text?: string;
    linkLabel?: string;
    href?: string;
    showLink?: boolean;
  }>(),
  {
    type: 'notes',
    text: 'Connect to EDS',
    linkLabel: 'Button',
    href: '#',
    showLink: true,
  },
);

const iconName = computed(() => {
  if (props.type === 'danger') return 'eds-warning-fill';
  if (props.type === 'success') return 'eds-enable-fill';
  return 'eds-information-fill';
});

const iconClass = computed(() => {
  if (props.type === 'danger') return styles.formIconDanger;
  if (props.type === 'success') return styles.formIconSuccess;
  return undefined;
});

const textClass = computed(() => {
  if (props.type === 'danger') return styles.formTextDanger;
  if (props.type === 'success') return styles.formTextSuccess;
  return undefined;
});

/** Notes / Danger 可在文案右侧展示 EgLink；Success 无链接。 */
const linkVisible = computed(
  () => (props.type === 'notes' || props.type === 'danger') && props.showLink,
);
</script>

<template>
  <div class="eds-form-submission" :class="styles.formSubmission">
    <span :class="[styles.formIcon, iconClass]">
      <EgIcon :name="iconName" fit fill-tone="primary" />
    </span>
    <span :class="textClass">{{ text }}</span>
    <EgLink v-if="linkVisible" tone="brand" size="sm" :href="href">
      {{ linkLabel }}
    </EgLink>
  </div>
</template>
