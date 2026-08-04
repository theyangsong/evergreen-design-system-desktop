<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
  EgIconButton,
} from '@eds/desktop-components';
import dataListStyles from '../../../../../../packages/components/src/organisms/data-list/DataList.module.css';

const props = withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
  }>(),
  {
    label: '',
    disabled: false,
  },
);

const sortOrder = ref<'asc' | 'desc' | ''>('');

const sortTriggerLabel = computed(() => {
  const header = props.label.trim();
  return header ? `Sort ${header}` : 'Sort';
});

function chooseSort(order: 'asc' | 'desc', close: () => void) {
  sortOrder.value = order;
  close();
}
</script>

<template>
  <EgFlotation
    :class="dataListStyles.sortDropdown"
    placement="bottom"
    align="start"
    :disabled="disabled"
    :show-add="false"
    :show-menu-divider="false"
    close-on-scroll
  >
    <template #trigger="{ expanded }">
      <EgIconButton
        shape="square"
        size="xs"
        :label="sortTriggerLabel"
        :aria-expanded="expanded"
        :disabled="disabled"
        :class="[
          dataListStyles.sortTrigger,
          expanded && dataListStyles.sortTriggerFocus,
          disabled && dataListStyles.sortTriggerDisabled,
        ]"
      >
        <EgIcon
          :name="expanded ? 'eds-arrow-up-mini-ios' : 'eds-arrow-down-mini-ios'"
          fit
        />
      </EgIconButton>
    </template>

    <template #content="{ close }">
      <EgFlotationMenu
        :class="dataListStyles.sortMenu"
        data-no-corner-smoothing
        panel-radius="radius-md"
        width-mode="adaptive"
        height-mode="adaptive"
        :scrollable="false"
        :show-add="false"
        :show-divider="false"
      >
        <EgFlotationMenuItem
          box-type="text"
          label="Ascending"
          :show-tag="false"
          :focused="sortOrder === 'asc'"
          @click="chooseSort('asc', close)"
        />
        <EgFlotationMenuItem
          box-type="text"
          label="Descending"
          :show-tag="false"
          :focused="sortOrder === 'desc'"
          @click="chooseSort('desc', close)"
        />
      </EgFlotationMenu>
    </template>
  </EgFlotation>
</template>
