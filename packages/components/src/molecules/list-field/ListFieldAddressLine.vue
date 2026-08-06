<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { EgTextOverflowTooltip } from '../tooltip';
import type { TooltipTrigger } from '../tooltip';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { truncateAddressMiddle } from '../crypto-combo/cryptoAddressUtils';
import cryptoComboStyles from '../crypto-combo/CryptoCombo.module.css';
import styles from './ListFieldAddressLine.module.css';

const props = withDefaults(
  defineProps<{
    text: string;
    copyOnRowHover?: boolean;
    tooltipTrigger?: TooltipTrigger;
  }>(),
  {
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
  },
);

const cellCopied = ref(false);
let cellCopiedResetTimer: ReturnType<typeof setTimeout> | undefined;

const displayText = computed(() => truncateAddressMiddle(props.text, 6, 6));
const copyLabel = computed(() => `复制地址 ${props.text}`);
const semanticallyTruncated = computed(() => displayText.value !== props.text);

onBeforeUnmount(() => {
  if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
});

async function onCopy(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyToClipboard(props.text);
  if (!copied) return;

  cellCopied.value = true;
  if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
  cellCopiedResetTimer = setTimeout(() => {
    cellCopied.value = false;
  }, 2000);
}
</script>

<template>
  <div :class="styles.cellLine">
    <EgTextOverflowTooltip
      :tooltip-text="text"
      :copy-value="text"
      :trigger="tooltipTrigger"
      :semantic-truncated="semanticallyTruncated"
      target-tone="primary"
      :typography-class="styles.addressLine"
      :menu-text-class="styles.menuText"
      :copy-label="copyLabel"
      show-tooltip-copy
      boundary-selector=".eds-data-list"
      host-flex
      :host-class="styles.addressHost"
    >
      {{ displayText }}
    </EgTextOverflowTooltip>

    <EgIconButton
      v-if="copyOnRowHover"
      shape="square"
      size="xs"
      :label="copyLabel"
      :class="cellCopied && cryptoComboStyles.menuCopyButtonCopied"
      @click.stop="onCopy($event)"
    >
      <EgIcon
        :name="cellCopied ? 'eds-enable-fill' : 'eds-copy'"
        fit
      />
    </EgIconButton>
  </div>
</template>
