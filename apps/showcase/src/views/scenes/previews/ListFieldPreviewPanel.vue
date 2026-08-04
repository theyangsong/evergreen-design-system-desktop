<script setup lang="ts">
import { computed } from 'vue';
import '@/styles/desktop-components-scope.css';
import '@/styles/text-style-preview.css';
import {
  EgAnchoredTooltip,
  EgCryptoCombo,
  EgFormSubmission,
  EgListFieldHashLikeLine,
  EgTag,
  formatGroupedNumber,
  type CryptoComboEntryBadge,
  type TagStatus,
  type TagSystemType,
} from '@eds/desktop-components';
import type { ListFieldSceneSlug } from '@/data/scenes';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import hashLikeStyles from '../../../../../../packages/components/src/molecules/list-field/ListFieldHashLike.module.css';
import DataListActionCell from '../../../../../../packages/components/src/organisms/data-list/DataListActionCell.vue';
import { buildCurrencySideAddressData } from './listFieldCurrencyAddressCustomize';
import { resolveCryptoNameFromSymbol } from './listFieldCryptoResolve';
import { buildCurrencySideTagsList } from './listFieldCurrencyTagCustomize';
import {
  SAMPLE_ADDRESS,
  buildListFieldMoreActions,
  isListFieldHashLikeSlug,
  listFieldHashLikePrimarySample,
  listFieldHashLikeSecondarySample,
  truncateMiddle,
} from './listFieldsPreviewData';
import styles from './listFieldScene.module.css';
import { readHashLikeCopyOnRowHover } from './listFieldHashLikePreview';

const props = defineProps<{
  slug: ListFieldSceneSlug;
  customize: Record<string, unknown>;
}>();

function parsePreviewMinWidth(customize: Record<string, unknown>): number | undefined {
  const raw = String(customize.minWidth ?? '').trim();
  if (!raw) return undefined;
  const parsed = Number(raw);
  return parsed > 0 ? parsed : undefined;
}

const isHashLikeSlug = computed(() => isListFieldHashLikeSlug(props.slug));

const hashLikeValue = computed(() => {
  if (!isListFieldHashLikeSlug(props.slug)) return '';
  return String(props.customize.value ?? listFieldHashLikePrimarySample(props.slug));
});

const hashLikeSecondaryValue = computed(() => {
  if (!isListFieldHashLikeSlug(props.slug)) return '';
  return String(props.customize.secondaryValue ?? listFieldHashLikeSecondarySample(props.slug));
});

const hashLikeIsDoubleLine = computed(
  () => String(props.customize.lineLayout ?? 'single') === 'double',
);

const cellMinWidthStyle = computed(() => {
  const width = parsePreviewMinWidth(props.customize);
  return width ? { minWidth: `${width}px`, maxWidth: `${width}px` } : undefined;
});

const hashLikeMinWidth = computed(() => parsePreviewMinWidth(props.customize));

const hashLikeMinWidthStyle = cellMinWidthStyle;

const hashLikeTooltipTrigger = computed(
  () => String(props.customize.tooltipTrigger ?? 'hover') as 'hover' | 'focus',
);

const hashLikeCopyOnRowHover = computed(() => readHashLikeCopyOnRowHover(props.customize));

const hashLikeLineEllipsis = computed(() => Boolean(hashLikeMinWidth.value));

const currencyFromTagsList = computed(() => buildCurrencySideTagsList('from', props.customize));

const currencyToTagsList = computed(() => buildCurrencySideTagsList('to', props.customize));

const currencyMinWidth = computed(() => parsePreviewMinWidth(props.customize));

const resolvedCryptoName = computed(
  () => resolveCryptoNameFromSymbol(String(props.customize.symbol ?? 'ZEC')) ?? 'eds-zec-zcash',
);

function currencyComboMode() {
  return String(props.customize.comboMode ?? 'double-address');
}

const entryBadge = computed(
  () => String(props.customize.entryBadgeMode ?? 'none') as CryptoComboEntryBadge,
);

const addressTooltipTrigger = computed(
  () => String(props.customize.addressTooltipTrigger ?? 'hover') as 'hover' | 'focus',
);

const symbol = () => String(props.customize.symbol ?? 'ZEC');
const showNetwork = () => props.customize.showNetwork !== false;
const networkLabel = () => String(props.customize.networkLabel ?? 'Base');
const currencyFromAddress = computed(() => buildCurrencySideAddressData('from', props.customize));
const currencyToAddress = computed(() => buildCurrencySideAddressData('to', props.customize));

const addressFrom = () => truncateMiddle(String(props.customize.address ?? SAMPLE_ADDRESS), 6, 6);
const addressTo = () => truncateMiddle(String(props.customize.address ?? SAMPLE_ADDRESS), 5, 5);
const addressSingle = () => truncateMiddle(String(props.customize.address ?? SAMPLE_ADDRESS));
const fullAddress = () => String(props.customize.address ?? SAMPLE_ADDRESS);

const displayMode = () => String(props.customize.displayMode ?? 'single');
const alias = () => String(props.customize.alias ?? 'Treasury');
const collectionCount = () => String(props.customize.collectionCount ?? '3');

const amountType = () => String(props.customize.amountType ?? 'conversion');
const fiatValue = () => String(props.customize.fiatValue ?? '$10');
const cryptoValue = () => String(props.customize.cryptoValue ?? '12,500.000001');

const datetime = () => String(props.customize.datetime ?? '2026-07-19 14:30:00');
const secondaryDatetime = () =>
  String(props.customize.secondaryDatetime ?? '2026-07-19 08:30:00');
const timeLineLayout = () => String(props.customize.lineLayout ?? 'single');
const timeIsDoubleLine = computed(() => timeLineLayout() === 'double');

const status = () => String(props.customize.status ?? 'success') as TagStatus;
const statusLabel = () => String(props.customize.label ?? 'Success');
const statusTagSize = () => String(props.customize.size ?? 'lg') as 'lg' | 'md' | 'sm';
const showFeedback = () => Boolean(props.customize.showFeedback);

const formSubmissionType = () =>
  String(props.customize.type ?? 'notes') as 'notes' | 'danger' | 'success';
const formSubmissionText = () => String(props.customize.text ?? 'Connect to EDS');
const formSubmissionLinkLabel = () => String(props.customize.linkLabel ?? 'Button');
const formSubmissionShowLink = () => props.customize.showLink !== false;

const showGeneralTag = () =>
  props.slug === 'list-field-general-structure' && Boolean(props.customize.showTag);
const tagSize = () => 'sm' as const;
const tagSystemType = () =>
  String(props.customize.systemType ?? 'stroke-subtle') as TagSystemType;
const tagLabel = () => String(props.customize.label ?? 'Tag');

const actionPrimary = computed(() => ({
  label: String(props.customize.primaryLabel ?? 'Action'),
}));

const actionMore = computed(() => buildListFieldMoreActions(props.customize));

const actionMinWidth = computed(() => parsePreviewMinWidth(props.customize));

const actionMinWidthStyle = computed(() => {
  const width = actionMinWidth.value;
  return width ? { minWidth: `${width}px`, width: `${width}px` } : undefined;
});
</script>

<template>
  <div class="desktopTokens" :class="docStyles.previewInputHost">
    <EgCryptoCombo
      v-if="slug === 'list-field-currency'"
      :crypto-name="resolvedCryptoName"
      :symbol="symbol()"
      :show-chain="showNetwork()"
      :chain-label="networkLabel()"
      network-style="tag"
      :entry-badge="entryBadge"
      :content-type="currencyComboMode() === 'currency-only' ? 'unaddress' : 'address'"
      :address-mode="currencyComboMode() === 'single-address' ? 'single' : 'double'"
      :from-address="currencyFromAddress.address"
      :from-alias="currencyFromAddress.alias"
      :to-address="currencyToAddress.address"
      :to-alias="currencyToAddress.alias"
      :from-address-count="currencyFromAddress.count"
      :to-address-count="currencyToAddress.count"
      :from-addresses="currencyFromAddress.addresses"
      :to-addresses="currencyToAddress.addresses"
      :min-width="currencyMinWidth"
      :from-tags-list="currencyFromTagsList"
      :to-tags-list="currencyToTagsList"
      :address-tooltip-trigger="addressTooltipTrigger"
    />

    <template v-else-if="slug === 'list-field-address'">
      <div v-if="displayMode() === 'single'" :class="styles.addressPreview" :style="cellMinWidthStyle">
        <EgAnchoredTooltip :content="fullAddress()" placement="top" align="start">
          <span :class="styles.addressText">{{ addressSingle() }}</span>
        </EgAnchoredTooltip>
      </div>

      <div v-else-if="displayMode() === 'alias'" :class="styles.addressPreview" :style="cellMinWidthStyle">
        <EgTag family="system" system-type="subtle" size="sm">{{ alias() }}</EgTag>
        <span :class="styles.addressText">{{ addressFrom() }}</span>
      </div>

      <div v-else-if="displayMode() === 'double'" :class="styles.addressPreview" :style="cellMinWidthStyle">
        <span :class="styles.addressText">{{ addressFrom() }}</span>
        <EgIcon name="eds-arrow-right" :class="styles.addressArrow" />
        <span :class="styles.addressText">{{ addressTo() }}</span>
      </div>

      <div v-else :class="styles.addressPreview" :style="cellMinWidthStyle">
        <EgAnchoredTooltip
          :content="`${collectionCount()} linked addresses`"
          placement="top"
        >
          <span :class="styles.addressText">({{ collectionCount() }})</span>
        </EgAnchoredTooltip>
      </div>
    </template>

    <template v-else-if="isHashLikeSlug">
      <div
        v-if="showGeneralTag()"
        :class="hashLikeIsDoubleLine ? styles.stackPreview : styles.generalStructureTitleRow"
        :style="hashLikeMinWidthStyle"
      >
        <template v-if="hashLikeIsDoubleLine">
          <div :class="styles.generalStructureTitleRow">
            <EgListFieldHashLikeLine
              :text="hashLikeValue"
              variant="primary"
              :identifier-mode="slug === 'list-field-identifier'"
              :copy-on-row-hover="hashLikeCopyOnRowHover"
              :tooltip-trigger="hashLikeTooltipTrigger"
              :ellipsis="hashLikeLineEllipsis"
            />
            <EgTag family="system" :system-type="tagSystemType()" :size="tagSize()">
              {{ tagLabel() }}
            </EgTag>
          </div>
          <EgListFieldHashLikeLine
            :text="hashLikeSecondaryValue"
            variant="secondary"
            :identifier-mode="slug === 'list-field-identifier'"
            :copy-on-row-hover="hashLikeCopyOnRowHover"
            :tooltip-trigger="hashLikeTooltipTrigger"
            :ellipsis="hashLikeLineEllipsis"
          />
        </template>
        <template v-else>
          <EgListFieldHashLikeLine
            :text="hashLikeValue"
            variant="primary"
            :identifier-mode="slug === 'list-field-identifier'"
            :copy-on-row-hover="hashLikeCopyOnRowHover"
            :tooltip-trigger="hashLikeTooltipTrigger"
            :ellipsis="hashLikeLineEllipsis"
          />
          <EgTag family="system" :system-type="tagSystemType()" :size="tagSize()">
            {{ tagLabel() }}
          </EgTag>
        </template>
      </div>

      <template v-else>
        <span
          v-if="hashLikeIsDoubleLine"
          :class="hashLikeStyles.combo"
          :style="hashLikeMinWidthStyle"
        >
          <EgListFieldHashLikeLine
            :text="hashLikeValue"
            variant="primary"
            :identifier-mode="slug === 'list-field-identifier'"
            :copy-on-row-hover="hashLikeCopyOnRowHover"
            :tooltip-trigger="hashLikeTooltipTrigger"
            :ellipsis="hashLikeLineEllipsis"
          />
          <EgListFieldHashLikeLine
            :text="hashLikeSecondaryValue"
            variant="secondary"
            :identifier-mode="slug === 'list-field-identifier'"
            :copy-on-row-hover="hashLikeCopyOnRowHover"
            :tooltip-trigger="hashLikeTooltipTrigger"
            :ellipsis="hashLikeLineEllipsis"
          />
        </span>
        <div v-else :style="hashLikeMinWidthStyle">
          <EgListFieldHashLikeLine
            :text="hashLikeValue"
            variant="primary"
            :identifier-mode="slug === 'list-field-identifier'"
            :copy-on-row-hover="hashLikeCopyOnRowHover"
            :tooltip-trigger="hashLikeTooltipTrigger"
            :ellipsis="hashLikeLineEllipsis"
          />
        </div>
      </template>
    </template>

    <template v-else-if="slug === 'list-field-amount'">
      <div v-if="amountType() === 'fiat'" :class="styles.amountPreview" :style="cellMinWidthStyle">
        <span :class="['typography-body-medium', styles.amountPrimary]">{{ fiatValue() }}</span>
      </div>
      <div v-else-if="amountType() === 'crypto'" :class="styles.amountPreview" :style="cellMinWidthStyle">
        <span :class="['typography-body-medium', styles.amountPrimary]">
          {{ formatGroupedNumber('66666.6666') }} BTC
        </span>
      </div>
      <div v-else :class="styles.amountPreview" :style="cellMinWidthStyle">
        <span :class="['typography-body-medium', styles.amountPrimary]">{{ cryptoValue() }} USDT</span>
        <span :class="['typography-footnote', styles.amountSecondary]">≈ {{ fiatValue() }}</span>
      </div>
    </template>

    <template v-else-if="slug === 'list-field-time'">
      <div :class="styles.timePreview" :style="cellMinWidthStyle">
        <span
          :class="[
            timeIsDoubleLine ? 'typography-body-small' : 'typography-body-medium',
            styles.timeCell,
          ]"
        >
          {{ datetime() }}
        </span>
        <span
          v-if="timeIsDoubleLine"
          :class="['typography-body-small', styles.timeSecondary]"
        >
          {{ secondaryDatetime() }}
        </span>
      </div>
    </template>

    <template v-else-if="slug === 'list-field-status'">
      <div :class="styles.statusPreview" :style="cellMinWidthStyle">
        <EgTag family="status" :status="status()" :size="statusTagSize()">
          {{ statusLabel() }}
        </EgTag>
        <EgFormSubmission
          v-if="showFeedback()"
          :type="formSubmissionType()"
          :text="formSubmissionText()"
          :link-label="formSubmissionLinkLabel()"
          :show-link="formSubmissionShowLink()"
        />
      </div>
    </template>

    <div
      v-else-if="slug === 'list-field-action'"
      :class="styles.actionPreview"
      :style="actionMinWidthStyle"
    >
      <DataListActionCell
        :primary-action="actionPrimary"
        :more-actions="actionMore"
      />
    </div>
  </div>
</template>
