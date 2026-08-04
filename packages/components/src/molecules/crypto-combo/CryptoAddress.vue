<script setup lang="ts">
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
    minWidth?: number;
    addressTooltipTrigger?: 'hover' | 'focus';
  }>(),
  {
    fromText: '0x55e8...d31c38',
    toText: '0x8de1...e1fe01',
    fromAddressCount: 1,
    toAddressCount: 1,
    addressMode: 'double',
  },
);
</script>

<template>
  <span :class="[styles.cryptoAddress, addressMode === 'single' && styles.cryptoAddressSingle]">
    <CryptoAddressSide
      :address="fromText"
      :alias="fromAlias"
      :address-count="fromAddressCount"
      :addresses="fromAddresses"
      :tags="fromTags"
      :address-tags="fromTagsList"
      :address-mode="addressMode"
      :min-width="minWidth"
      :tooltip-trigger="addressTooltipTrigger"
    />

    <span v-if="addressMode === 'double'" :class="styles.cryptoAddressArrow">
      <EgIcon name="eds-arrow-right" fit />
    </span>

    <CryptoAddressSide
      v-if="addressMode === 'double'"
      :address="toText"
      :alias="toAlias"
      :address-count="toAddressCount"
      :addresses="toAddresses"
      :tags="toTags"
      :address-tags="toTagsList"
      :address-mode="addressMode"
      :min-width="minWidth"
      :tooltip-trigger="addressTooltipTrigger"
    />
  </span>
</template>
