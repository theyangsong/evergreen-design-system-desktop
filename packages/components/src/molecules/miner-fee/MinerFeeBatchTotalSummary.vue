<script setup lang="ts">
import { useMinerFeeTranslate } from './minerFeeTranslate';
import styles from './MinerFeePopoverPanel.module.css';

defineProps<{
  totalDisplay: string;
  transactionCount: number;
}>();

const ui = useMinerFeeTranslate();
</script>

<template>
  <section :class="styles.minerFeeBatchTotal" data-miner-fee-batch-total>
    <p :class="styles.minerFeeBatchTotalTitle">
      {{ ui('Estimated total miner fee') }}
    </p>

    <div :class="styles.minerFeeBatchTotalValueRow">
      <span :class="styles.minerFeeBatchTotalAmount">
        {{ totalDisplay }}
      </span>

      <span :class="styles.minerFeeBatchTotalCountLine">
        <span :class="styles.minerFeeBatchTotalCountPrefix">
          {{ ui('Miner fee batch total suffix') }}
        </span>
        <span :class="styles.minerFeeBatchTotalCount">{{ transactionCount }}</span>
        <span :class="styles.minerFeeBatchTotalCountSuffix">
          {{ ui('Miner fee batch transaction suffix') }}
        </span>
      </span>
    </div>
  </section>
</template>
