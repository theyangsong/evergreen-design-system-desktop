<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgCheckbox } from '../../molecules/toggle';
import { EgFlotation, EgFlotationMenu, EgFlotationMenuItem } from '../../molecules/flotation';
import DataListCellOverflow from './DataListCellOverflow.vue';
import styles from './DataList.module.css';
import type { DataListSelectAllMode, DataListSortOrder } from './types';

const props = withDefaults(
  defineProps<{
    height?: string | number;
    label?: string;
    type?: 'default' | 'select';
    align?: 'left' | 'center' | 'right';
    width?: string;
    widthPercent?: number;
    minWidth?: string;
    selectMode?: boolean;
    selectAllMode?: DataListSelectAllMode;
    bg?: string;
    sortable?: boolean;
    hasCustomHeader?: boolean;
  }>(),
  {
    type: 'default',
    align: 'left',
    selectMode: false,
    selectAllMode: 'none',
    sortable: false,
    hasCustomHeader: false,
  },
);

const emit = defineEmits<{
  'select-all-mode': [mode: DataListSelectAllMode];
  'sort-change': [order: Exclude<DataListSortOrder, ''>];
}>();

const sortOrder = ref<DataListSortOrder>('');

const cellStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));

const contentStyle = computed(() => ({
  justifyContent:
    props.align === 'left' ? 'flex-start' : props.align === 'center' ? 'center' : 'flex-end',
}));

const sortTriggerLabel = computed(() => {
  const header = props.label?.trim();
  return header ? `Sort ${header}` : 'Sort';
});

function onSelectAllClick() {
  emit('select-all-mode', props.selectAllMode);
}

function chooseSort(order: 'asc' | 'desc', close: () => void) {
  if (order !== sortOrder.value) {
    emit('sort-change', order);
  }
  sortOrder.value = order;
  close();
}

function resetSort() {
  sortOrder.value = '';
}

defineExpose({ resetSort });
</script>

<template>
  <th
    :class="[styles.headerCell, type === 'select' && styles.headerCellSelect]"
    :style="cellStyle"
  >
    <div v-if="type === 'select'" :class="styles.headerSelect">
      <EgCheckbox
        :model-value="selectAllMode === 'all'"
        :indeterminate="selectAllMode === 'some'"
        @click.stop="onSelectAllClick"
      />
    </div>
    <div v-else-if="type === 'default'" :class="styles.headerContent" :style="contentStyle">
      <div
        :class="[
          styles.headerTitleGroup,
          hasCustomHeader ? styles.headerTitleGroupSlot : undefined,
        ]"
      >
        <slot>
          <DataListCellOverflow
            v-if="label"
            :content-class="styles.headerText"
            context="header"
          >
            {{ label }}
          </DataListCellOverflow>
        </slot>
        <EgFlotation
          v-if="sortable"
          :class="styles.sortDropdown"
          placement="bottom"
          align="start"
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
              :class="[
                styles.sortTrigger,
                expanded && styles.sortTriggerFocus,
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
              :class="styles.sortMenu"
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
      </div>
    </div>
  </th>
</template>
