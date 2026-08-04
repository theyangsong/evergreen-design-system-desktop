<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgFlotation, EgFlotationMenu, EgFlotationMenuItem } from '../flotation';
import { EgIconButton } from '../icon-button';
import { EgTag } from '../tag';
import CryptoAddressTags from './CryptoAddressTags.vue';
import styles from './CryptoCombo.module.css';
import type { CryptoAddressSideTags } from './cryptoAddressTypes';
import { truncateAddressMiddle } from './cryptoAddressUtils';
import { hasAddressTags, splitTagsForDisplay } from './cryptoAddressTagUtils';

/** CryptoAddress 浮层：EgFlotation Combo（#trigger + #content Menu/Box）。 */
const CRYPTO_ADDRESS_TOOLTIP_MAX_HEIGHT = 280;
const CRYPTO_ADDRESS_TOOLTIP_MAX_WIDTH = 480;

export type CryptoAddressTooltipTrigger = 'hover' | 'focus';

const props = withDefaults(
  defineProps<{
    address: string;
    alias?: string;
    addressCount?: number;
    addresses?: string[];
    tags?: CryptoAddressSideTags;
    /** 按地址索引的 Tag 列表；首项用于行内展示 */
    addressTags?: CryptoAddressSideTags[];
    addressMode?: 'single' | 'double';
    minWidth?: number;
    defaultShowMore?: boolean;
    tooltipTrigger?: CryptoAddressTooltipTrigger;
  }>(),
  {
    addressCount: 1,
    addressMode: 'double',
    defaultShowMore: true,
    tooltipTrigger: 'hover',
  },
);

function normalizeCount(value?: number): number {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function buildAddressList(
  address: string,
  alias: string | undefined,
  count: number,
  provided?: string[],
): string[] {
  if (provided?.length) {
    return provided.slice(0, count);
  }
  const first = alias?.trim() || address;
  return Array.from({ length: count }, (_, index) =>
    index === 0 ? first : `${address} · ${index + 1}`,
  );
}

function resolveAddressTags(index: number): CryptoAddressSideTags | undefined {
  return props.addressTags?.[index] ?? (index === 0 ? props.tags : undefined);
}

const count = computed(() => normalizeCount(props.addressCount));

const primaryTags = computed(() => resolveAddressTags(0));

const showAddressCollection = computed(() => count.value > 2);

const hasOverflowTags = computed(() => {
  const tags = primaryTags.value;
  if (!tags) return false;
  return splitTagsForDisplay(tags.system, tags.custom).hidden.length > 0;
});

const addressList = computed(() =>
  buildAddressList(props.address, props.alias, count.value, props.addresses),
);

const primaryAlias = computed(() => props.alias?.trim() || undefined);

const displayAddress = computed(() => truncateAddressMiddle(props.address, 6, 6));

const isAddressDisplayTruncated = computed(
  () => !primaryAlias.value && displayAddress.value !== props.address,
);

const showSideTooltip = computed(
  () =>
    showAddressCollection.value ||
    hasOverflowTags.value ||
    isAddressDisplayTruncated.value ||
    Boolean(primaryAlias.value) ||
    props.tooltipTrigger === 'hover' ||
    props.tooltipTrigger === 'focus',
);

const hoverTriggerClass = computed(() =>
  props.tooltipTrigger === 'focus'
    ? 'eds-hover-tooltip-trigger--focus'
    : undefined,
);

type CryptoAddressTooltipMenuRow = {
  key: string;
  address: string;
  alias?: string;
  tags?: CryptoAddressSideTags;
  showExpandedTags?: boolean;
};

const tooltipMenuRows = computed((): CryptoAddressTooltipMenuRow[] => {
  const rows: CryptoAddressTooltipMenuRow[] = [];

  if (showSideTooltip.value) {
    rows.push({
      key: 'primary',
      address: props.address,
      alias: primaryAlias.value,
      tags: primaryTags.value,
      showExpandedTags: primaryTags.value
        ? hasAddressTags(primaryTags.value.system, primaryTags.value.custom)
        : false,
    });

    if (showAddressCollection.value) {
      const rest = props.addresses?.length
        ? props.addresses.slice(1, count.value)
        : addressList.value.slice(1);
      rest.forEach((address, index) => {
        const tags = resolveAddressTags(index + 1);
        rows.push({
          key: `rest-${index}`,
          address,
          tags,
          showExpandedTags: tags
            ? hasAddressTags(tags.system, tags.custom)
            : false,
        });
      });
    }

    return rows;
  }

  if (showAddressCollection.value) {
    const list = props.addresses?.length
      ? props.addresses.slice(0, count.value)
      : addressList.value;
    list.forEach((address, index) => {
      const tags = resolveAddressTags(index);
      rows.push({
        key: `addr-${index}`,
        address: index === 0 ? props.address : address,
        alias: index === 0 ? primaryAlias.value : undefined,
        tags,
        showExpandedTags: tags
          ? hasAddressTags(tags.system, tags.custom)
          : false,
      });
    });
  }

  return rows;
});

const copiedRowKey = ref<string | null>(null);
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined;

async function onCopyAddress(key: string, address: string, event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  try {
    await navigator.clipboard.writeText(address);
    copiedRowKey.value = key;
    if (copiedResetTimer) clearTimeout(copiedResetTimer);
    copiedResetTimer = setTimeout(() => {
      if (copiedRowKey.value === key) copiedRowKey.value = null;
    }, 2000);
  } catch {
    // 复制失败时保持默认图标
  }
}

onBeforeUnmount(() => {
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
});
</script>

<template>
  <EgFlotation
    v-if="showSideTooltip"
    :trigger="tooltipTrigger"
    placement="bottom"
    align="start"
    :open-delay="120"
    :close-delay="80"
    :show-add="false"
    :show-menu-divider="false"
    close-on-scroll
    boundary-selector=".eds-data-list"
  >
    <template #trigger>
      <span :class="[styles.cryptoAddressSide, 'eds-hover-tooltip-trigger', hoverTriggerClass]">
        <span
          :class="[
            styles.cryptoAddressLine,
            primaryAlias && styles.cryptoAddressLineAlias,
            'eds-hover-tooltip-trigger__target',
          ]"
          :tabindex="tooltipTrigger === 'focus' ? 0 : undefined"
        >
          <span
            v-if="primaryAlias"
            :class="[styles.cryptoAddressText, styles.cryptoAddressAlias]"
          >{{ primaryAlias }}</span>
          <span v-else :class="styles.cryptoAddressText">{{ displayAddress }}</span>
          <span v-if="showAddressCollection" :class="styles.cryptoAddressCount">
            (<span :class="styles.cryptoAddressCountValue">{{ count }}</span>)
          </span>
        </span>
        <span :class="styles.cryptoAddressTags">
          <CryptoAddressTags
            :tags="primaryTags"
            :default-show-more="defaultShowMore"
          />
        </span>
      </span>
    </template>

    <template #content>
      <EgFlotationMenu
        class="desktopTokens eds-crypto-address-tooltip-menu eds-flotation-menu--box-doc"
        height-mode="adaptive"
        :max-height="CRYPTO_ADDRESS_TOOLTIP_MAX_HEIGHT"
        width-mode="adaptive"
        :max-width="CRYPTO_ADDRESS_TOOLTIP_MAX_WIDTH"
        :show-add="false"
        list-scroll
      >
        <EgFlotationMenuItem
          v-for="row in tooltipMenuRows"
          :key="row.key"
          box-type="text"
          label-wrap
          :show-tag="false"
        >
          <span :class="styles.menuRowContent">
            <span :class="styles.menuRowMain">
              <EgTag
                v-if="row.alias"
                family="system"
                system-type="solid-brand"
                size="sm"
              >
                {{ row.alias }}
              </EgTag>
              <span :class="styles.menuAddressLine">
                <span :class="styles.menuAddress">{{ row.address }}</span>
                <span
                  :class="[
                    styles.menuCopyButton,
                    copiedRowKey === row.key && styles.menuCopyButtonCopied,
                  ]"
                >
                  <EgIconButton
                    shape="square"
                    size="xs"
                    :label="`复制地址 ${row.address}`"
                    @click="onCopyAddress(row.key, row.address, $event)"
                  >
                    <EgIcon
                      :name="copiedRowKey === row.key ? 'eds-enable-fill' : 'eds-copy'"
                      fit
                    />
                  </EgIconButton>
                </span>
              </span>
            </span>

            <span v-if="row.showExpandedTags && row.tags" :class="styles.menuRowTags">
              <CryptoAddressTags
                :tags="row.tags"
                :default-show-more="false"
                tooltip-mode
              />
            </span>
          </span>
        </EgFlotationMenuItem>
      </EgFlotationMenu>
    </template>
  </EgFlotation>

  <span v-else :class="styles.cryptoAddressSide">
    <span
      :class="[
        styles.cryptoAddressLine,
        primaryAlias && styles.cryptoAddressLineAlias,
      ]"
    >
      <span
        v-if="primaryAlias"
        :class="[styles.cryptoAddressText, styles.cryptoAddressAlias]"
      >{{ primaryAlias }}</span>
      <span v-else :class="styles.cryptoAddressText">{{ displayAddress }}</span>
    </span>
    <span :class="styles.cryptoAddressTags">
      <CryptoAddressTags
        :tags="primaryTags"
        :default-show-more="defaultShowMore"
      />
    </span>
  </span>
</template>
