<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import { EgFlotationMenu, EgFlotationMenuItem } from '../flotation';
import { EgTag } from '../tag';
import CryptoAddressTags from './CryptoAddressTags.vue';
import styles from './CryptoCombo.module.css';
import type { CryptoAddressSideTags } from './cryptoAddressTypes';
import {
  COPYABLE_OVERFLOW_MENU_CLASS,
  COPYABLE_OVERFLOW_TOOLTIP_MAX_HEIGHT,
  COPYABLE_OVERFLOW_TOOLTIP_MAX_WIDTH,
} from '../tooltip/textOverflowTooltipConstants';

export type CryptoAddressSideMenuRow = {
  key: string;
  address: string;
  alias?: string;
  /** ListFieldAddress 等：meta 行副文本（Wallet Name 等）。 */
  secondaryText?: string;
  tags?: CryptoAddressSideTags;
  showExpandedTags?: boolean;
};

defineProps<{
  rows: CryptoAddressSideMenuRow[];
  copiedRowKey: string | null;
}>();

const emit = defineEmits<{
  copy: [key: string, address: string, event: MouseEvent];
}>();
</script>

<template>
  <EgFlotationMenu
    :class="COPYABLE_OVERFLOW_MENU_CLASS"
    height-mode="adaptive"
    :max-height="COPYABLE_OVERFLOW_TOOLTIP_MAX_HEIGHT"
    width-mode="adaptive"
    :max-width="COPYABLE_OVERFLOW_TOOLTIP_MAX_WIDTH"
    :show-add="false"
    list-scroll
  >
    <EgFlotationMenuItem
      v-for="row in rows"
      :key="row.key"
      box-type="text"
      label-wrap
      :show-tag="false"
      @click="emit('copy', row.key, row.address, $event)"
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
              @click.stop
            >
              <EgIconButton
                shape="square"
                size="xs"
                label="复制"
                @click="emit('copy', row.key, row.address, $event)"
              >
                <EgIcon
                  :name="copiedRowKey === row.key ? 'eds-enable-fill' : 'eds-copy'"
                  fit
                />
              </EgIconButton>
            </span>
          </span>
        </span>

        <span
          v-if="row.showExpandedTags && (row.secondaryText || row.tags)"
          :class="styles.menuRowTags"
        >
          <span
            v-if="row.secondaryText"
            :class="styles.menuRowSecondary"
          >
            {{ row.secondaryText }}
          </span>
          <CryptoAddressTags
            v-if="row.tags"
            :tags="row.tags"
            :default-show-more="false"
            tooltip-mode
          />
        </span>
      </span>
    </EgFlotationMenuItem>
  </EgFlotationMenu>
</template>
