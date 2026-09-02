<script setup lang="ts">
import { computed } from 'vue';
import { EgFlotation } from '../../molecules/flotation';
import CryptoAddressTags from '../../molecules/crypto-combo/CryptoAddressTags.vue';
import CryptoAddressSideMenuPanel, {
  type CryptoAddressSideMenuRow,
} from '../../molecules/crypto-combo/CryptoAddressSideMenuPanel.vue';
import type { CryptoAddressSideTags } from '../../molecules/crypto-combo/cryptoAddressTypes';
import { hasAddressTags } from '../../molecules/crypto-combo/cryptoAddressTagUtils';
import {
  FLOTATION_OVERFLOW_CLOSE_DELAY,
  FLOTATION_OVERFLOW_OPEN_DELAY,
} from '../../molecules/tooltip/textOverflowTooltipConstants';
import styles from './Detail.module.css';

const props = withDefaults(
  defineProps<{
    address: string;
    alias?: string;
    tags?: CryptoAddressSideTags;
    tagsRevealAll?: boolean;
    copyKey: string;
    showCopy: boolean;
    copiedItemKey: string | null;
    boundarySelector?: string;
    /** false 时 Tag 由 Detail 主行下方渲染，触发器仅保留地址（与 trailing 同行）。 */
    embedTagsInTrigger?: boolean;
  }>(),
  {
    alias: undefined,
    tags: undefined,
    tagsRevealAll: false,
    boundarySelector: '.eds-popup',
    embedTagsInTrigger: true,
  },
);

const emit = defineEmits<{
  copy: [copyKey: string, address: string, event: MouseEvent];
}>();

const showExpandedTags = computed(
  () => Boolean(props.tags && hasAddressTags(props.tags.system, props.tags.custom)),
);

const showSideMenu = computed(() => {
  if (props.showCopy) return true;
  if (showExpandedTags.value) return true;
  return Boolean(props.alias?.trim());
});

const menuRows = computed((): CryptoAddressSideMenuRow[] => [
  {
    key: 'primary',
    address: props.address,
    alias: props.alias?.trim() || undefined,
    tags: props.tags,
    showExpandedTags: showExpandedTags.value,
  },
]);

const panelCopiedRowKey = computed(() =>
  props.copiedItemKey === props.copyKey ? 'primary' : null,
);

function onMenuCopy(_rowKey: string, address: string, event: MouseEvent) {
  emit('copy', props.copyKey, address, event);
}
</script>

<template>
  <EgFlotation
    v-if="showSideMenu"
    trigger="hover"
    placement="bottom"
    align="start"
    :open-delay="FLOTATION_OVERFLOW_OPEN_DELAY"
    :close-delay="FLOTATION_OVERFLOW_CLOSE_DELAY"
    :show-add="false"
    :show-menu-divider="false"
    close-on-scroll
    :boundary-selector="boundarySelector"
    :class="['eds-crypto-address-flotation', styles.addressSideFlotationHost]"
  >
    <template #trigger>
      <span
        :class="[
          styles.addressSideTrigger,
          !embedTagsInTrigger && styles.addressSideTriggerInline,
          'eds-hover-tooltip-trigger',
        ]"
      >
        <span
          :class="[
            styles.itemValueText,
            styles.itemValueTextNowrap,
            'eds-hover-tooltip-trigger__target',
            'eds-hover-tooltip-trigger__target--primary',
            'motion-ease',
            'is-hover',
          ]"
        >
          {{ address }}
        </span>
        <CryptoAddressTags
          v-if="embedTagsInTrigger && showExpandedTags && tags"
          :tags="tags"
          :reveal-all="tagsRevealAll === true"
          :class="[
            styles.itemValueAddressTags,
            styles.itemValueAddressTagsBelow,
          ]"
        />
      </span>
    </template>

    <template #content>
      <CryptoAddressSideMenuPanel
        :rows="menuRows"
        :copied-row-key="panelCopiedRowKey"
        :boundary-selector="boundarySelector"
        @copy="onMenuCopy"
      />
    </template>
  </EgFlotation>

  <span
    v-else
    :class="[styles.itemValueText, styles.itemValueTextNowrap]"
  >
    {{ address }}
  </span>
</template>
