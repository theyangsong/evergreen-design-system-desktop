<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgCheckbox } from '../../molecules/toggle';
import styles from './DataList.module.css';
import type { DataListSelectAllMode, DataListSortOrder } from './types';

const props = withDefaults(
  defineProps<{
    height?: string | number;
    label?: string;
    type?: 'default' | 'select';
    align?: 'left' | 'center' | 'right';
    width?: string;
    selectMode?: boolean;
    selectAllMode?: DataListSelectAllMode;
    bg?: string;
    sortable?: boolean;
  }>(),
  {
    type: 'default',
    align: 'left',
    selectMode: false,
    selectAllMode: 'none',
    sortable: false,
  },
);

const emit = defineEmits<{
  'select-all-mode': [mode: DataListSelectAllMode];
  'sort-change': [order: Exclude<DataListSortOrder, ''>];
}>();

const sortOpen = ref(false);
const sortOrder = ref<DataListSortOrder>('');
const triggerRef = ref<HTMLElement | null>(null);
const popRef = ref<HTMLElement | null>(null);
const popStyle = ref<Record<string, string>>({});

const cellStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  backgroundColor: props.bg || 'var(--data-table-head)',
  backdropFilter: props.bg ? 'none' : 'saturate(120%) blur(var(--blur-shallow))',
  ...(props.width ? { width: '1%' } : {}),
}));

const contentStyle = computed(() => ({
  justifyContent:
    props.align === 'left' ? 'flex-start' : props.align === 'center' ? 'center' : 'flex-end',
  ...(props.width ? { width: props.width } : {}),
}));

const sortTriggerClass = computed(() => [
  styles.sortTrigger,
  props.selectMode && styles.sortTriggerDisabled,
  sortOpen.value && styles.sortTriggerFocus,
  sortOrder.value && styles.sortTriggerActive,
]);

function onSelectAllClick() {
  emit('select-all-mode', props.selectAllMode);
}

function positionPopover() {
  const el = triggerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  popStyle.value = {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${rect.left - 6}px`,
    zIndex: '1000',
    maxHeight: '180px',
  };
}

async function openSort() {
  if (props.selectMode || sortOpen.value) return;
  sortOpen.value = true;
  await Promise.resolve();
  positionPopover();
}

function chooseSort(order: 'asc' | 'desc') {
  if (order !== sortOrder.value) {
    emit('sort-change', order);
  }
  sortOrder.value = order;
  sortOpen.value = false;
}

function resetSort() {
  sortOrder.value = '';
}

function onDocPointerDown(event: PointerEvent) {
  if (!sortOpen.value) return;
  const target = event.target as Node | null;
  if (triggerRef.value?.contains(target) || popRef.value?.contains(target)) return;
  sortOpen.value = false;
}

watch(sortOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocPointerDown, true);
  } else {
    document.removeEventListener('pointerdown', onDocPointerDown, true);
  }
});

defineExpose({ resetSort });

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown, true);
});
</script>

<template>
  <th :class="styles.headerCell" :style="cellStyle">
    <div v-if="type === 'select'" :class="styles.headerSelect">
      <EgCheckbox
        :model-value="selectAllMode === 'all'"
        :indeterminate="selectAllMode === 'some'"
        @click.stop="onSelectAllClick"
      />
    </div>
    <div v-else-if="type === 'default'" :class="styles.headerContent" :style="contentStyle">
      <slot>
        <div>{{ label }}</div>
      </slot>
      <div
        v-if="sortable"
        ref="triggerRef"
        :class="sortTriggerClass"
        @click.stop="openSort"
      >
        <EgIcon name="eds-arrow-down-mini-ios" size="sm" fit />
      </div>
      <Teleport to="body">
        <div
          v-show="sortOpen"
          ref="popRef"
          class="desktopTokens effect-flotation-box"
          :class="styles.sortPopover"
          :style="popStyle"
        >
          <button
            type="button"
            :class="[styles.sortItem, sortOrder === 'asc' && styles.sortItemActive]"
            @click="chooseSort('asc')"
          >
            升序
          </button>
          <button
            type="button"
            :class="[styles.sortItem, sortOrder === 'desc' && styles.sortItemActive]"
            @click="chooseSort('desc')"
          >
            降序
          </button>
        </div>
      </Teleport>
    </div>
  </th>
</template>
