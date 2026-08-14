<script setup lang="ts">
import { EgComboActionPopupWindow } from '../combo';
import { EgDivider } from '../../atoms/divider';
import { EgFormSubmission } from '../feedback';
import { EgIcon } from '../../atoms/icons';
import { EgTag } from '../tag';
import { computed } from 'vue';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import {
  buildTronMinerFeeDisplay,
  fillMinerFeeUiTemplate,
  resolveTronMinerFeeQuote,
  resolveTronResourcesIconName,
} from './minerFeeTronDisplay';
import styles from './MinerFeePopoverPanel.module.css';

const props = withDefaults(
  defineProps<{
    hideInlineConfirm?: boolean;
  }>(),
  {
    hideInlineConfirm: false,
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const ui = useMinerFeeTranslate();

const feeQuote = computed(() => resolveTronMinerFeeQuote());

const resourcesIconName = resolveTronResourcesIconName();

const resourcesLine = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron resources line'), {
    bandwidth: feeQuote.value.bandwidth,
    energy: feeQuote.value.energy,
  }),
);

const activationNote = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron activation note'), {
    trx: feeQuote.value.activationExtraTrx,
  }),
);

const estimatedCostPrimary = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron estimated cost primary'), {
    trx: feeQuote.value.estimatedTrx,
  }),
);

const estimatedCostUsd = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron estimated cost usd'), {
    usd: feeQuote.value.estimatedUsd,
  }),
);

function onConfirm() {
  emit('confirm', {
    displayValue: buildTronMinerFeeDisplay(feeQuote.value),
  });
}

defineExpose({
  attemptConfirm: onConfirm,
  confirmDisabled: computed(() => false),
});
</script>

<template>
  <div :class="styles.minerFeeListPage" data-miner-fee-tron>
    <div :class="styles.minerFeeRoot" data-miner-fee-screen="list">
      <section :class="styles.minerFeeTronBody">
        <div :class="styles.minerFeeTronSection">
          <p :class="styles.minerFeeTronSectionTitle">
            {{ ui('Miner fee tron resources title') }}
          </p>

          <div :class="styles.minerFeeTronResourcesRow">
            <EgIcon
              :class="styles.minerFeeTronResourcesIcon"
              :name="resourcesIconName"
              size="sm"
              fill-tone="primary"
            />
            <span :class="styles.minerFeeTronResourcesText">{{ resourcesLine }}</span>
          </div>

          <div :class="styles.minerFeeTronActivationFeedback">
            <EgFormSubmission
              type="notes"
              :text="activationNote"
              :show-link="false"
            />
          </div>
        </div>

        <EgDivider type="page" :class="styles.minerFeeTronInnerDivider" />

        <div :class="styles.minerFeeTronSection">
          <p :class="styles.minerFeeTronPaymentLabel">
            {{ ui('Miner fee tron payment mode') }}
          </p>

          <div :class="styles.minerFeeTronPaymentCard">
            <div :class="styles.minerFeeTronPaymentHeader">
              <span :class="styles.minerFeeTronPaymentModeName">
                {{ ui('Miner fee tron energy mode') }}
              </span>
              <span :class="styles.minerFeeTronPaymentTags">
                <EgTag size="sm" system-type="stroke-solid">
                  {{ ui('Miner fee tron recommended') }}
                </EgTag>
                <EgTag family="status" size="sm" status="ready">
                  {{ ui('Miner fee tron save percent') }}
                </EgTag>
              </span>
            </div>

            <p :class="styles.minerFeeTronProviderNote">
              {{ ui('Miner fee tron provider note') }}
            </p>

            <p :class="styles.minerFeeTronEstimatedCost">
              {{ estimatedCostPrimary }}
              <span :class="styles.minerFeeTronEstimatedCostUsd">{{ estimatedCostUsd }}</span>
            </p>
          </div>
        </div>
      </section>
    </div>

    <div
      v-if="!hideInlineConfirm"
      :class="[styles.minerFeeFooter, styles.minerFeeFooterTron]"
    >
      <EgComboActionPopupWindow
        tone="decor"
        :count="1"
        :confirm-label="ui('Confirm')"
        @confirm="onConfirm"
      />
    </div>
  </div>
</template>
