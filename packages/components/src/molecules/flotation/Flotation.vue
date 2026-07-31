<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue';
import {
  EgAnchoredTooltip,
  type TooltipAlign,
  type TooltipHeightMode,
  type TooltipPlacement,
  type TooltipWidthMode,
} from '../tooltip';
import FlotationMenu from './FlotationMenu.vue';
import FlotationMenuItem from './FlotationMenuItem.vue';
import FlotationTrigger, {
  type FlotationTriggerSize,
  type FlotationTriggerStyle,
} from './FlotationTrigger.vue';
import type { TagStatus } from '../tag';
import type { MessageType } from '../feedback';
import {
  createDefaultFlotationPresetItems,
  type FlotationMenuItemPreset,
} from './flotationPresets';

export type { FlotationMenuItemPreset } from './flotationPresets';
export type { FlotationTriggerSize, FlotationTriggerStyle } from './FlotationTrigger.vue';
export type { FlotationBoxType } from './FlotationMenuItem.vue';

/** Menu 宽度：跟触发器 / 自定义 px / 随内容 */
export type FlotationWidthMode = 'trigger' | 'fixed' | 'adaptive';

type AnchoredApi = {
  close: () => void;
  getTriggerElement: () => HTMLElement | null;
  getTriggerWidth: () => number;
  getTriggerHeight: () => number;
  updatePosition: () => void;
};

/** 等于触发器宽度时，Menu 相对触发器左右（或上下）各扩 8px */
const TRIGGER_EDGE_INSET = 8;
/** 等于触发器：主轴间距 1；自定义/自适应宽度：主轴间距 8 */
const OFFSET_TRIGGER_WIDTH = 1;
const OFFSET_CUSTOM_WIDTH = 8;

const props = withDefaults(
  defineProps<{
    placement?: TooltipPlacement;
    /** 自定义/自适应宽度时的交叉轴对齐；等宽触发器时固定 start。 */
    align?: TooltipAlign;
    disabled?: boolean;
    /**
     * 与触发器主轴间距（px）。
     * 未传时：widthMode=trigger → 1；fixed/adaptive → 8。
     */
    offset?: number;
    widthMode?: FlotationWidthMode;
    width?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
    triggerLabel?: string;
    triggerStyle?: FlotationTriggerStyle;
    triggerSize?: FlotationTriggerSize;
    showSymbol?: boolean;
    symbolIcon?: string;
    showTag?: boolean;
    tagText?: string;
    tagStatus?: TagStatus;
    showMessage?: boolean;
    messageText?: string;
    messageType?: MessageType;
    showAdd?: boolean;
    addLabel?: string;
    showMenuDivider?: boolean;
    items?: FlotationMenuItemPreset[];
  }>(),
  {
    placement: 'bottom',
    align: 'start',
    disabled: false,
    widthMode: 'fixed',
    width: 280,
    heightMode: 'adaptive',
    height: 306,
    maxHeight: undefined,
    triggerLabel: 'Trigger',
    triggerStyle: 'subtle',
    triggerSize: 'lg',
    showSymbol: false,
    symbolIcon: 'eds-coin-btc',
    showTag: false,
    tagText: 'Tag',
    tagStatus: 'danger',
    showMessage: false,
    messageText: '0',
    messageType: 'brand',
    showAdd: true,
    addLabel: 'Add',
    showMenuDivider: true,
    items: () => createDefaultFlotationPresetItems(),
  },
);

const emit = defineEmits<{
  'item-click': [item: FlotationMenuItemPreset, index: number, event: MouseEvent];
  add: [event: MouseEvent];
  open: [];
  close: [];
  'update:selectedIndex': [index: number | null];
}>();

const slots = useSlots();
const menuOpen = ref(false);
const selectedIndex = ref<number | null>(null);
const anchoredRef = ref<AnchoredApi | null>(null);
const triggerMatchWidth = ref<number | undefined>(undefined);
let triggerResizeObserver: ResizeObserver | undefined;

const usePresetContent = computed((): boolean => !slots.content);

const resolvedItems = computed(() => props.items ?? createDefaultFlotationPresetItems());

const selectedItem = computed(() => {
  if (selectedIndex.value === null) return null;
  return resolvedItems.value[selectedIndex.value] ?? null;
});

const displayLabel = computed(() => selectedItem.value?.label ?? props.triggerLabel);
const displayTagText = computed(() => selectedItem.value?.tag ?? props.tagText);
const displayTagStatus = computed(
  () => selectedItem.value?.tagStatus ?? props.tagStatus,
);
const displayShowTag = computed(() => {
  if (selectedItem.value) {
    return Boolean(selectedItem.value.showTag);
  }
  return props.showTag;
});

const menuWidthMode = computed((): TooltipWidthMode =>
  props.widthMode === 'adaptive' ? 'adaptive' : 'fixed',
);

/**
 * trigger：面板宽 = 触发器宽 + 左右各 8（精确值，不 round）。
 * fixed：自定义 px；adaptive：随内容。
 */
const menuWidth = computed(() => {
  if (props.widthMode === 'trigger') {
    if (triggerMatchWidth.value == null || triggerMatchWidth.value <= 0) {
      return undefined;
    }
    return triggerMatchWidth.value + TRIGGER_EDGE_INSET * 2;
  }
  if (props.widthMode === 'fixed') return props.width;
  return undefined;
});

/** 等宽触发器时 start + crossAxisOffset=-8；自定义宽度用 align。 */
const menuAlign = computed((): TooltipAlign =>
  props.widthMode === 'trigger' ? 'start' : props.align,
);

/** 主轴间距：等宽 1；自定义/自适应 8（可被 offset prop 覆盖）。 */
const menuOffset = computed(() => {
  if (props.offset != null) return props.offset;
  return props.widthMode === 'trigger' ? OFFSET_TRIGGER_WIDTH : OFFSET_CUSTOM_WIDTH;
});

/**
 * 等宽触发器：交叉轴 -8，使宽=触发器+16 的 Menu 左右各偏出 8。
 */
const menuCrossAxisOffset = computed(() =>
  props.widthMode === 'trigger' ? -TRIGGER_EDGE_INSET : 0,
);

function syncTriggerSize() {
  const width = anchoredRef.value?.getTriggerWidth();
  if (width != null && width > 0) {
    triggerMatchWidth.value = width;
  }
}

function bindTriggerResizeObserver() {
  unbindTriggerResizeObserver();
  if (props.widthMode !== 'trigger') return;
  const el = anchoredRef.value?.getTriggerElement();
  if (!el || typeof ResizeObserver === 'undefined') return;
  triggerResizeObserver = new ResizeObserver(() => {
    syncTriggerSize();
    if (menuOpen.value) {
      nextTick(() => anchoredRef.value?.updatePosition());
    }
  });
  triggerResizeObserver.observe(el);
}

function unbindTriggerResizeObserver() {
  triggerResizeObserver?.disconnect();
  triggerResizeObserver = undefined;
}

function scheduleMenuReposition() {
  nextTick(() => {
    anchoredRef.value?.updatePosition();
    requestAnimationFrame(() => {
      syncTriggerSize();
      anchoredRef.value?.updatePosition();
      requestAnimationFrame(() => anchoredRef.value?.updatePosition());
    });
  });
}

onMounted(() => {
  if (props.widthMode === 'trigger') {
    nextTick(() => {
      syncTriggerSize();
      bindTriggerResizeObserver();
    });
  }
});

watch(
  () => props.widthMode,
  async (mode) => {
    if (mode === 'trigger') {
      await nextTick();
      syncTriggerSize();
      bindTriggerResizeObserver();
      if (menuOpen.value) scheduleMenuReposition();
      return;
    }
    unbindTriggerResizeObserver();
    if (menuOpen.value) scheduleMenuReposition();
  },
);

watch(
  () => props.items,
  () => {
    if (
      selectedIndex.value !== null &&
      selectedIndex.value >= resolvedItems.value.length
    ) {
      selectedIndex.value = null;
      emit('update:selectedIndex', null);
    }
  },
);

watch(
  () =>
    [
      props.widthMode,
      props.triggerLabel,
      props.triggerSize,
      props.showSymbol,
      props.showTag,
      props.showMessage,
      displayLabel.value,
      displayShowTag.value,
    ] as const,
  async () => {
    if (props.widthMode !== 'trigger') return;
    await nextTick();
    syncTriggerSize();
    if (menuOpen.value) {
      scheduleMenuReposition();
    }
  },
  { flush: 'post' },
);

watch(
  () =>
    [
      menuWidth.value,
      menuAlign.value,
      menuOffset.value,
      menuCrossAxisOffset.value,
      props.placement,
    ] as const,
  async () => {
    if (!menuOpen.value) return;
    scheduleMenuReposition();
  },
);

async function onOpen() {
  menuOpen.value = true;
  syncTriggerSize();
  bindTriggerResizeObserver();
  await nextTick();
  syncTriggerSize();
  scheduleMenuReposition();
  emit('open');
}

function onClose() {
  menuOpen.value = false;
  unbindTriggerResizeObserver();
  emit('close');
}

function onItemClick(item: FlotationMenuItemPreset, index: number, event: MouseEvent) {
  selectedIndex.value = index;
  emit('update:selectedIndex', index);
  emit('item-click', item, index, event);
  anchoredRef.value?.close();
}

onBeforeUnmount(() => {
  unbindTriggerResizeObserver();
});
</script>

<template>
  <!--
    EgFlotation
      └ EgAnchoredTooltip（定位）
           ├ #trigger → EgFlotationTrigger（预置；可插槽替换）
           └ #content → EgFlotationMenu → EgTooltip
                              └ EgFlotationMenuItem / Box（预置；可插槽替换）
  -->
  <EgAnchoredTooltip
    ref="anchoredRef"
    class="eds-flotation"
    trigger="click"
    :wrap-tooltip="false"
    :placement="placement"
    :align="menuAlign"
    :disabled="disabled"
    :offset="menuOffset"
    :cross-axis-offset="menuCrossAxisOffset"
    token-scope-class="desktopTokens"
    @open="onOpen"
    @close="onClose"
  >
    <slot
      name="trigger"
      :expanded="menuOpen"
      :selected-item="selectedItem"
      :selected-index="selectedIndex"
    >
      <FlotationTrigger
        :label="displayLabel"
        :trigger-style="triggerStyle"
        :size="triggerSize"
        :disabled="disabled"
        :show-symbol="showSymbol"
        :symbol-icon="symbolIcon"
        :show-tag="displayShowTag"
        :tag-text="displayTagText"
        :tag-status="displayTagStatus"
        :show-message="showMessage"
        :message-text="messageText"
        :message-type="messageType"
        :expanded="menuOpen"
      />
    </slot>

    <template #content>
      <slot
        name="content"
        :selected-index="selectedIndex"
        :close="() => anchoredRef?.close()"
      >
        <FlotationMenu
          v-if="usePresetContent"
          panel-kind="flotation"
          :width-mode="menuWidthMode"
          :width="menuWidth"
          :height-mode="heightMode"
          :height="height"
          :max-height="maxHeight"
          :show-divider="showMenuDivider"
          :show-add="showAdd"
          :add-label="addLabel"
          @add="emit('add', $event)"
        >
          <FlotationMenuItem
            v-for="(item, index) in resolvedItems"
            :key="`${item.label}-${index}`"
            :box-type="item.boxType ?? 'text'"
            :label="item.label"
            :disabled="item.disabled"
            :focused="item.focused || selectedIndex === index"
            :show-checkbox="item.showCheckbox"
            :checked="item.checked"
            :show-tag="Boolean(item.showTag)"
            :tag-text="item.tag ?? tagText"
            :tag-status="item.tagStatus ?? tagStatus"
            :show-reddot="item.showReddot"
            :show-cascader="item.showCascader"
            :show-message="item.showMessage"
            :message-text="item.messageText ?? '0'"
            :message-type="item.messageType ?? 'subtle'"
            :symbol-icon="item.symbolIcon ?? 'eds-add'"
            @click="onItemClick(item, index, $event)"
          />
        </FlotationMenu>
      </slot>
    </template>
  </EgAnchoredTooltip>
</template>
