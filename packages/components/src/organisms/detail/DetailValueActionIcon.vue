<script setup lang="ts">
import CopyActionIconButton from '../../molecules/icon-button/CopyActionIconButton.vue';

withDefaults(
  defineProps<{
    label: string;
    icon: string;
    boundarySelector?: string;
    verifying?: boolean;
  }>(),
  {
    boundarySelector: '.eds-popup',
    verifying: false,
  },
);

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <CopyActionIconButton
    :label="label"
    :icon="icon"
    :boundary-selector="boundarySelector"
    :verifying="verifying"
    @click="$emit('click', $event)"
  />
</template>
