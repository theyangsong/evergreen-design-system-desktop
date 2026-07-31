<script setup lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
  type ComponentPublicInstance,
  type VNode,
} from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgBatchBar } from '../batch-bar';
import DataListHeaderCell from './DataListHeaderCell.vue';
import DataListColumn from './DataListColumn.vue';
import styles from './DataList.module.css';
import type { DataListItem, DataListSelectAllMode } from './types';

const RenderVNodes = defineComponent({
  name: 'EgDataListRenderVNodes',
  props: {
    nodes: { type: null, required: false, default: null },
  },
  setup(props) {
    return () => props.nodes as VNode | VNode[] | null;
  },
});

defineOptions({ name: 'EgDataList' });

const props = withDefaults(
  defineProps<{
    maxHeight?: string;
    headerHeight?: number;
    headerBg?: string;
    columnHeight?: number;
    loading?: boolean;
    initing?: boolean;
    dataList?: DataListItem[];
  }>(),
  {
    headerHeight: 32,
    columnHeight: 66,
    loading: false,
    initing: false,
    dataList: () => [],
  },
);

const emit = defineEmits<{
  'row-click': [row: DataListItem];
  'update:selected-list': [rows: Array<DataListItem & { _index: number }>];
  'selected-change': [rows: Array<DataListItem & { _index: number }>];
}>();

const slots = useSlots() as {
  default?: () => VNode[];
  operation?: () => VNode[];
};
const tableWrapperRef = ref<HTMLElement | null>(null);
const tableContentRef = ref<HTMLElement | null>(null);
const headerCellRefs = ref<Array<{ resetSort?: () => void } | null>>([]);
const size = ref({ width: 0, height: 0 });
const tableKey = ref(0);
const selectMode = ref(false);
const selectedList = ref<Array<DataListItem & { _index: number }>>([]);

const headerHeightCss = computed(() => `${props.headerHeight}px`);

watch(
  () => props.dataList,
  () => {
    selectedList.value = [];
  },
  { immediate: true },
);

const showIniting = ref(false);
let initingTimer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => props.initing,
  (value) => {
    if (value) {
      initingTimer = window.setTimeout(() => {
        showIniting.value = true;
      }, 500);
    } else {
      if (initingTimer !== undefined) clearTimeout(initingTimer);
      showIniting.value = false;
    }
  },
  { immediate: true },
);

const showLoadingBar = ref(false);
const loadingDoneIcon = ref(false);
let loadingTimer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => props.loading,
  (value) => {
    if (value) {
      if (loadingTimer !== undefined) clearTimeout(loadingTimer);
      tableContentRef.value?.scrollTo({ top: 0, behavior: 'instant' });
      loadingDoneIcon.value = false;
      showLoadingBar.value = true;
    } else {
      tableContentRef.value?.scrollTo({ top: 0, behavior: 'instant' });
      loadingDoneIcon.value = true;
      loadingTimer = window.setTimeout(() => {
        showLoadingBar.value = false;
      }, 500);
    }
  },
  { immediate: true },
);

const blankRows = computed(() => {
  const available = size.value.height - props.headerHeight - 8;
  const fit = Math.floor(available / props.columnHeight);
  const extra = fit - props.dataList.length > 0 ? fit - props.dataList.length : 0;
  return Array.from({ length: extra }).fill({});
});

const loadingStyle = computed(() => ({
  width: `${size.value.width}px`,
  height: showLoadingBar.value ? '28px' : '0px',
  opacity: showLoadingBar.value ? 1 : 0,
}));

function readProp(propsBag: Record<string, unknown> | null | undefined, key: string, fallback?: unknown) {
  if (!propsBag) return fallback;
  if (Object.prototype.hasOwnProperty.call(propsBag, key)) return propsBag[key];
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  if (Object.prototype.hasOwnProperty.call(propsBag, kebab)) return propsBag[kebab];
  return fallback;
}

function isDataListColumnVNode(node: VNode): boolean {
  const type = node.type as { name?: string } | string;
  if (typeof type === 'string') return false;
  return type?.name === 'EgDataListColumn' || type?.name === 'TableListColumn';
}

function columnVNodes(): VNode[] {
  return (slots.default?.() || []).filter(
    (node) => isDataListColumnVNode(node) && node.props?.hidden !== true && node.props?.hidden !== '',
  );
}

function visibleColumnVNodes(): VNode[] {
  return columnVNodes().filter((node) => {
    const minTableWidth = readProp(node.props as Record<string, unknown>, 'minTableWidth');
    return !minTableWidth || size.value.width >= Number(minTableWidth);
  });
}

const headerColumns = computed(() =>
  visibleColumnVNodes().map((node) => {
    const p = (node.props || {}) as Record<string, unknown>;
    const children = node.children as
      | { header?: (payload?: Record<string, unknown>) => unknown }
      | null;
    return {
      label: (p.label as string) || '',
      align: (p.align as 'left' | 'center' | 'right') || 'left',
      sortable: Boolean(p.sortable),
      width: p.width as string | undefined,
      minTableWidth: readProp(p, 'minTableWidth') as number | undefined,
      headerSlot: children?.header,
      originalSortChangeHandler: p.onSortChange as ((order: string) => void) | undefined,
    };
  }),
);

const bodyColumns = computed(() =>
  visibleColumnVNodes().map((node) => {
    const p = (node.props || {}) as Record<string, unknown>;
    const children = node.children as
      | { default?: (payload: { data: DataListItem }) => unknown }
      | null;
    return {
      prop: (p.prop as string) || '',
      align: (p.align as 'left' | 'center' | 'right') || 'left',
      width: p.width as string | undefined,
      widthPercent: readProp(p, 'widthPercent') as number | undefined,
      minWidth: readProp(p, 'minWidth') as string | undefined,
      minTableWidth: readProp(p, 'minTableWidth') as number | undefined,
      slotDefault: children?.default,
    };
  }),
);

function onSortChange(columnIndex: number, order: 'asc' | 'desc') {
  headerCellRefs.value.forEach((cell, index) => {
    if (index !== columnIndex) cell?.resetSort?.();
  });
  const column = headerColumns.value[columnIndex];
  column?.originalSortChangeHandler?.(order);
}

function toggleRowSelect(index: number | undefined) {
  if (index === undefined) return;
  const existing = selectedList.value.find((row) => row._index === index);
  if (existing) {
    selectedList.value = selectedList.value.filter((row) => row._index !== index);
  } else {
    selectedList.value.push({ ...props.dataList[index], _index: index });
  }
  emit('update:selected-list', selectedList.value);
  emit('selected-change', selectedList.value);
}

function onSelectAllMode(mode: DataListSelectAllMode) {
  if (mode === 'all') {
    selectedList.value = [];
  } else {
    selectedList.value = props.dataList.map((row, index) => ({ ...row, _index: index }));
  }
  emit('update:selected-list', selectedList.value);
  emit('selected-change', selectedList.value);
}

function onRowClick(row: DataListItem, index: number) {
  if (selectMode.value) {
    toggleRowSelect(index);
    return;
  }
  emit('row-click', row);
}

function openSelect() {
  selectMode.value = true;
}

function closeSelect() {
  selectMode.value = false;
  selectedList.value = [];
  emit('update:selected-list', []);
  emit('selected-change', []);
}

defineExpose({ openSelect, closeSelect });

let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  if (!tableWrapperRef.value) return;
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    size.value = {
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    };
  });
  resizeObserver.observe(tableWrapperRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (initingTimer !== undefined) clearTimeout(initingTimer);
  if (loadingTimer !== undefined) clearTimeout(loadingTimer);
});

function setHeaderRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!el || !('resetSort' in (el as object))) {
    headerCellRefs.value[index] = null;
    return;
  }
  headerCellRefs.value[index] = el as { resetSort?: () => void };
}

function renderHeaderSlot(column: (typeof headerColumns.value)[number]) {
  const slot = column.headerSlot as ((payload?: Record<string, unknown>) => unknown) | undefined;
  return slot?.({}) ?? null;
}

function renderCellSlot(
  column: (typeof bodyColumns.value)[number],
  slotProps: { data: DataListItem },
) {
  return column.slotDefault?.(slotProps) ?? null;
}

function isRowSelected(index: number) {
  return selectedList.value.some((row) => row._index === index);
}
</script>

<template>
  <div ref="tableWrapperRef" class="eds-data-list" :class="styles.root">
    <div
      v-if="showIniting"
      :class="styles.initing"
      :style="{ top: headerHeightCss, height: `calc(100% - ${headerHeightCss})` }"
    >
      <div :class="styles.initingContent">
        <EgIcon :class="styles.initingIcon" name="eds-load" size="md" />
        <div :class="styles.initingText">Loading</div>
      </div>
    </div>

    <div v-if="selectMode" :class="styles.operationBar">
      <EgBatchBar
        :selected-count="selectedList.length"
        count-suffix="selected"
        @dismiss="closeSelect"
      >
        <template v-if="$slots.operation" #actions>
          <slot name="operation" />
        </template>
      </EgBatchBar>
    </div>

    <div ref="tableContentRef" :class="styles.tableContent">
      <table :key="tableKey" :class="styles.table">
        <thead :style="{ height: headerHeightCss }">
          <tr>
            <DataListHeaderCell
              v-if="selectMode"
              type="select"
              :height="headerHeightCss"
              :bg="headerBg"
              :select-mode="selectMode"
              :select-all-mode="
                selectedList.length === 0
                  ? 'none'
                  : selectedList.length === dataList.length
                    ? 'all'
                    : 'some'
              "
              @select-all-mode="onSelectAllMode"
            />
            <DataListHeaderCell
              v-for="(column, index) in headerColumns"
              :key="index"
              :ref="(el) => setHeaderRef(el, index)"
              :label="column.label"
              :align="column.align"
              :height="headerHeightCss"
              :width="column.width"
              :sortable="column.sortable"
              :select-mode="selectMode"
              :bg="headerBg"
              @sort-change="(order) => onSortChange(index, order)"
            >
              <template v-if="column.headerSlot">
                <RenderVNodes :nodes="renderHeaderSlot(column)" />
              </template>
            </DataListHeaderCell>
          </tr>
        </thead>

        <tbody v-if="dataList.length > 0">
          <tr :class="styles.loadingRow" :style="loadingStyle">
            <td :colspan="bodyColumns.length">
              <div :class="styles.loadingInner">
                <EgIcon
                  v-if="loadingDoneIcon"
                  name="eds-tick"
                  size="sm"
                />
                <EgIcon
                  v-else
                  :class="styles.loadingSpin"
                  name="eds-load"
                  size="sm"
                />
              </div>
            </td>
          </tr>

          <tr
            v-for="(row, rowIndex) in dataList"
            :key="rowIndex"
            @click="onRowClick(row, rowIndex)"
          >
            <DataListColumn
              v-if="selectMode"
              type="select"
              :index="rowIndex"
              :column-height="columnHeight"
              :data="row"
              :selected="isRowSelected(rowIndex)"
              @select-change="toggleRowSelect"
            />
            <DataListColumn
              v-for="(column, colIndex) in bodyColumns"
              :key="`${rowIndex}-${colIndex}`"
              :index="rowIndex"
              :column-height="columnHeight"
              :prop="column.prop"
              :align="column.align"
              :width="column.width"
              :width-percent="column.widthPercent"
              :min-width="column.minWidth"
              :data="row"
            >
              <template v-if="column.slotDefault" #default="slotProps">
                <RenderVNodes :nodes="renderCellSlot(column, slotProps)" />
              </template>
            </DataListColumn>
          </tr>

          <tr v-for="(_blank, blankIndex) in blankRows" :key="`blank-${blankIndex}`">
            <DataListColumn
              v-for="(_column, colIndex) in bodyColumns"
              :key="`blank-${blankIndex}-${colIndex}`"
              :index="blankIndex"
              :column-height="columnHeight"
              blank
            />
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && dataList.length === 0" :class="styles.empty">
        <div :class="styles.emptyInner">
          <EgIcon :class="styles.emptyIcon" name="eds-information-lonely" size="lg" />
          <div :class="styles.emptyText">no-data</div>
        </div>
      </div>
      <div v-else :class="styles.spacer" />
    </div>
  </div>
</template>
