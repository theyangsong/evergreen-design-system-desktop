<script setup lang="ts">
import { ref } from 'vue';
import { provideMinerFeeTranslate, type MinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import MinerFeeEvmPopoverPanel from './MinerFeeEvmPopoverPanel.vue';

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
  'miner-fee-screen-change': [screen: 'list' | 'custom'];
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const panelRef = ref<InstanceType<typeof MinerFeeEvmPopoverPanel> | null>(null);

provideMinerFeeTranslate(props.translate);

defineExpose({
  resetMinerFeeFlow: () => panelRef.value?.resetMinerFeeFlow(),
  attemptConfirm: () => panelRef.value?.attemptConfirm(),
  attemptCancelCustom: () => panelRef.value?.attemptCancelCustom(),
  attemptSaveCustom: () => panelRef.value?.attemptSaveCustom(),
  confirmDisabled: panelRef.value?.confirmDisabled,
  minerFeeScreen: panelRef.value?.minerFeeScreen,
});
</script>

<template>
  <MinerFeeEvmPopoverPanel
    ref="panelRef"
    symbol="BTC"
    :hide-inline-confirm="hideInlineConfirm"
    @miner-fee-screen-change="emit('miner-fee-screen-change', $event)"
    @confirm="emit('confirm', $event)"
  />
</template>
