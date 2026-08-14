<script setup lang="ts">
import { ref } from 'vue';
import { provideMinerFeeTranslate, type MinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import MinerFeeTonLikePanel from './MinerFeeTonLikePanel.vue';

const props = withDefaults(
  defineProps<{
    translate: MinerFeeTranslate;
    hideInlineConfirm?: boolean;
    symbol?: string;
  }>(),
  {
    hideInlineConfirm: false,
    symbol: 'TON',
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const panelRef = ref<InstanceType<typeof MinerFeeTonLikePanel> | null>(null);

provideMinerFeeTranslate(props.translate);

defineExpose({
  attemptConfirm: () => panelRef.value?.attemptConfirm(),
  confirmDisabled: panelRef.value?.confirmDisabled,
});
</script>

<template>
  <MinerFeeTonLikePanel
    ref="panelRef"
    :symbol="symbol"
    :hide-inline-confirm="hideInlineConfirm"
    @confirm="emit('confirm', $event)"
  />
</template>
