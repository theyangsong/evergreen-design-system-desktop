<script setup lang="ts">
import { computed } from 'vue';
import { EgCheckbox } from '../../molecules/toggle';
import styles from './DataList.module.css';
import type { DataListColumnAlign, DataListItem } from './types';

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
    /** Used by EgDataList when collecting header config from column VNodes. */
    sortable?: boolean;
  }>(),
  {
    type: 'default',
    selected: false,
    blank: false,
    align: 'left',
    hidden: false,
    sortable: false,
  },
);

const emit = defineEmits<{
  selectChange: [index: number | undefined];
}>();

const cellData = computed(() => Object.assign({}, props.data || {}));

const tdStyle = computed(() => ({
  ...(props.widthPercent ? { width: `${props.widthPercent}%` } : {}),
  ...(props.minWidth ? { minWidth: props.minWidth } : {}),
  ...(props.width ? { width: '1%' } : {}),
  ...(props.type === 'select' ? { width: '1%' } : {}),
}));

const rowToneStyle = computed(() => ({
  backgroundColor: (props.index ?? 0) % 2 === 1 ? 'var(--material-card-shallow)' : '',
  height: `${props.columnHeight ?? 0}px`,
}));

const contentStyle = computed(() => ({
  ...rowToneStyle.value,
  justifyContent:
    props.align === 'left' ? 'flex-start' : props.align === 'center' ? 'center' : 'flex-end',
  ...(props.width ? { width: props.width } : {}),
}));

function onSelectClick() {
  emit('selectChange', props.index);
}
</script>

<template>
  <td :class="styles.column" :style="tdStyle">
    <div v-if="blank" :style="contentStyle" />
    <template v-else>
      <div v-if="type === 'select'" :class="styles.cellSelect" :style="rowToneStyle">
        <EgCheckbox :model-value="selected" @click.stop="onSelectClick" />
      </div>
      <div v-else-if="type === 'default'" :class="styles.cellContent" :style="contentStyle">
        <slot :data="cellData">
          <div :class="styles.cellText">{{ data?.[prop || ''] }}</div>
        </slot>
      </div>
    </template>
  </td>
</template>
