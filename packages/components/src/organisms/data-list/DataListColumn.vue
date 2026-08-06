<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { EgCheckbox } from '../../molecules/toggle';
import DataListActionCell from './DataListActionCell.vue';
import DataListCellOverflow from './DataListCellOverflow.vue';
import styles from './DataList.module.css';
import type {
  DataListColumnAlign,
  DataListItem,
  DataListPrimaryAction,
  DataListRowAction,
} from './types';

defineOptions({ name: 'EgDataListColumn' });

const props = withDefaults(
  defineProps<{
    data?: DataListItem;
    index?: number;
    columnHeight?: number;
    minTableWidth?: number;
    type?: 'default' | 'select';
    selected?: boolean;
    blank?: boolean;
    prop?: string;
    label?: string;
    width?: string;
    widthPercent?: number;
    minWidth?: string;
    align?: DataListColumnAlign;
    hidden?: boolean;
    sortable?: boolean;
    /** 列展示优先级，越小越靠左；默认按声明顺序。 */
    displayOrder?: number;
    /** 尾列参与多余空间均分（默认尾列仅保 min-width）。 */
    flexGrow?: boolean;
    /** 标记操作列（默认最后一列）。 */
    isAction?: boolean;
    primaryAction?: DataListPrimaryAction;
    moreActions?: DataListRowAction[];
    hideActions?: boolean;
    showOverflowTooltip?: boolean;
  }>(),
  {
    type: 'default',
    selected: false,
    blank: false,
    align: 'left',
    hidden: false,
    sortable: false,
    hideActions: false,
    showOverflowTooltip: true,
  },
);

const emit = defineEmits<{
  selectChange: [index: number | undefined];
  'primary-action': [];
  'more-action': [key: string];
}>();

const cellData = computed(() => Object.assign({}, props.data || {}));

const cellText = computed(() => {
  const key = props.prop || '';
  const value = props.data?.[key];
  if (value == null) return '';
  return String(value);
});

const contentStyle = computed(() => ({
  justifyContent:
    props.align === 'left' ? 'flex-start' : props.align === 'center' ? 'center' : 'flex-end',
}));

const slots = useSlots();

const useBuiltinActionCell = computed(
  () => Boolean(props.primaryAction) && !slots.default,
);

function onSelectClick() {
  emit('selectChange', props.index);
}
</script>

<template>
  <td :class="[styles.column, type === 'select' && styles.columnSelect]">
    <div v-if="blank" :class="styles.cellContent" />
    <template v-else>
      <div v-if="type === 'select'" :class="styles.cellSelect">
        <EgCheckbox :model-value="selected" @click.stop="onSelectClick" />
      </div>
      <div v-else-if="type === 'default'" :class="styles.cellContent" :style="contentStyle">
        <template v-if="!hideActions">
          <DataListActionCell
            v-if="useBuiltinActionCell"
            :primary-action="primaryAction"
            :more-actions="moreActions"
            @primary-click="emit('primary-action')"
            @more-click="(key) => emit('more-action', key)"
          />
          <slot v-else :data="cellData">
            <DataListCellOverflow
              v-if="showOverflowTooltip && cellText"
              :text="cellText"
            />
            <div v-else-if="cellText" :class="styles.cellText">{{ cellText }}</div>
          </slot>
        </template>
      </div>
    </template>
  </td>
</template>
