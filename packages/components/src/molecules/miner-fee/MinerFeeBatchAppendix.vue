<script setup lang="ts">
import { computed } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgFormSubmission } from '../feedback';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import MinerFeeBatchTotalSummary from './MinerFeeBatchTotalSummary.vue';
import {
  minerFeeBatchStubMessageKey,
  minerFeeBatchStubStreamerMessageKey,
  parseMinerFeeBatchStubBlocks,
  resolveMinerFeeBatchStubKind,
  type MinerFeeBatchProfileKind,
} from './minerFeeBatchStub';
import styles from './MinerFeePopoverPanel.module.css';

const props = defineProps<{
  symbol: string;
  profileKind: MinerFeeBatchProfileKind;
  transactionCount: number;
  batchTotalDisplay: string;
}>();

const ui = useMinerFeeTranslate();

const stubKind = computed(() =>
  resolveMinerFeeBatchStubKind(
    props.symbol,
    props.profileKind,
    props.transactionCount,
  ),
);

const showStub = computed(() => stubKind.value != null);

const stubMessage = computed(() => {
  const kind = stubKind.value;
  return kind ? ui(minerFeeBatchStubMessageKey(kind)) : '';
});

const stubBlocks = computed(() =>
  parseMinerFeeBatchStubBlocks(stubKind.value, stubMessage.value),
);

const showBatchTotal = computed(
  () =>
    props.transactionCount > 1
    && !showStub.value
    && props.batchTotalDisplay.length > 0,
);
</script>

<template>
  <div
    v-if="showStub || showBatchTotal"
    :class="styles.minerFeeBatchTotalAppendix"
  >
    <EgDivider type="page" :class="styles.minerFeePageInsetDivider" />
    <div
      v-if="showStub"
      :class="[
        stubKind === 'tron' && styles.minerFeeStubTronLayout,
        stubKind !== 'tron' && styles.minerFeeStubMessageStack,
      ]"
    >
      <div
        v-if="stubKind === 'tron'"
        :class="styles.minerFeeStubMessageStack"
      >
        <template
          v-for="(block, index) in stubBlocks"
          :key="index"
        >
          <p
            v-if="block.kind === 'lead' || block.kind === 'text'"
            :class="styles.minerFeeStubMessage"
          >
            {{ block.text }}
          </p>
          <div
            v-else
            :class="styles.minerFeeStubStepSection"
          >
            <p :class="styles.minerFeeStubStepTitle">
              {{ block.title }}
            </p>
            <p :class="styles.minerFeeStubStepBody">
              {{ block.body }}
            </p>
          </div>
        </template>
      </div>
      <EgDivider
        v-if="stubKind === 'tron'"
        type="page"
        :class="styles.minerFeeTronInnerDivider"
      />
      <div
        v-if="stubKind === 'tron'"
        :class="styles.minerFeeTronActivationFeedback"
      >
        <EgFormSubmission
          type="notes"
          :text="ui(minerFeeBatchStubStreamerMessageKey())"
          :show-link="false"
        />
      </div>
      <template v-else>
        <template
          v-for="(block, index) in stubBlocks"
          :key="index"
        >
          <p
            v-if="block.kind === 'lead' || block.kind === 'text'"
            :class="styles.minerFeeStubMessage"
          >
            {{ block.text }}
          </p>
          <div
            v-else
            :class="styles.minerFeeStubStepSection"
          >
            <p :class="styles.minerFeeStubStepTitle">
              {{ block.title }}
            </p>
            <p :class="styles.minerFeeStubStepBody">
              {{ block.body }}
            </p>
          </div>
        </template>
      </template>
    </div>
    <MinerFeeBatchTotalSummary
      v-else
      :total-display="batchTotalDisplay"
      :transaction-count="transactionCount"
    />
  </div>
</template>
