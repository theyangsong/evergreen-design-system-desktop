<script setup lang="ts">
import { ref } from 'vue';
import { provideMinerFeeTranslate, type MinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import MinerFeeTronPanel from './MinerFeeTronPanel.vue';

const props = withDefaults(
  defineProps<{
    translate: MinerFeeTranslate;
    hideInlineConfirm?: boolean;
  }>(),
  {
    hideInlineConfirm: false,
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const panelRef = ref<InstanceType<typeof MinerFeeTronPanel> | null>(null);

provideMinerFeeTranslate(props.translate);

defineExpose({
  attemptConfirm: () => panelRef.value?.attemptConfirm(),
  confirmDisabled: panelRef.value?.confirmDisabled,
});
</script>

<template>
  <MinerFeeTronPanel
    ref="panelRef"
    :hide-inline-confirm="hideInlineConfirm"
    @confirm="emit('confirm', $event)"
  />
</template>
