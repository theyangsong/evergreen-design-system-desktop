<script setup lang="ts">
import { computed } from 'vue';
import { EgIcon } from '../../atoms/icons';
import CryptoAddressSide from './CryptoAddressSide.vue';
import styles from './CryptoCombo.module.css';
import type { CryptoAddressSideTags } from './cryptoAddressTypes';

export type { CryptoAddressSideTags } from './cryptoAddressTypes';

const props = withDefaults(
  defineProps<{
    fromText?: string;
    fromAlias?: string;
    toText?: string;
    toAlias?: string;
    fromAddressCount?: number;
    toAddressCount?: number;
    fromAddresses?: string[];
    toAddresses?: string[];
    fromTags?: CryptoAddressSideTags;
    toTags?: CryptoAddressSideTags;
    fromTagsList?: CryptoAddressSideTags[];
    toTagsList?: CryptoAddressSideTags[];
    addressMode?: 'single' | 'double';
    showFrom?: boolean;
    showTo?: boolean;
    minWidth?: number;
    addressTooltipTrigger?: 'hover' | 'focus';
  }>(),
  {
    fromText: '0x55e8...d31c38',
    toText: '0x8de1...e1fe01',
    fromAddressCount: 1,
    toAddressCount: 1,
    addressMode: 'double',
    showFrom: true,
    showTo: true,
  },
);

const showFromSide = computed(() => props.showFrom !== false);
const showToSide = computed(
  () => props.addressMode === 'double' && props.showTo !== false,
);
const showArrow = computed(
  () => props.addressMode === 'double' && showFromSide.value && showToSide.value,
);
const resolvedSideMode = computed(() =>
  props.addressMode === 'double' && showFromSide.value && showToSide.value
    ? 'double'
    : 'single',
);
const useSingleLayout = computed(
  () => props.addressMode === 'single' || !showFromSide.value || !showToSide.value,
);
</script>

<template>
  <span :class="[styles.cryptoAddress, useSingleLayout && styles.cryptoAddressSingle]">
    <CryptoAddressSide
      v-if="showFromSide"
      :address="fromText"
      :alias="fromAlias"
      :address-count="fromAddressCount"
      :addresses="fromAddresses"
      :tags="fromTags"
      :address-tags="fromTagsList"
      :address-mode="resolvedSideMode"
      :min-width="minWidth"
      :tooltip-trigger="addressTooltipTrigger"
    />

    <span v-if="showArrow" :class="styles.cryptoAddressArrow">
      <EgIcon name="eds-arrow-right" fit />
    </span>

    <CryptoAddressSide
      v-if="showToSide"
      :address="toText"
      :alias="toAlias"
      :address-count="toAddressCount"
      :addresses="toAddresses"
      :tags="toTags"
      :address-tags="toTagsList"
      :address-mode="resolvedSideMode"
      :min-width="minWidth"
      :tooltip-trigger="addressTooltipTrigger"
    />
  </span>
</template>
