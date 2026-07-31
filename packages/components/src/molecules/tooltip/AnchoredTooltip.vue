<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
} from 'vue';
import EgTooltip, { type TooltipPanelKind, type TooltipWidthMode } from './Tooltip.vue';
import styles from './AnchoredTooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * 相对触发器的对齐：
 * - top/bottom：start=左对齐，end=右对齐
 * - left/right：start=上对齐，end=下对齐
 */
export type TooltipAlign = 'start' | 'center' | 'end';

/** Opens on click (default) or hover. */
export type TooltipTrigger = 'click' | 'hover';

const props = withDefaults(
  defineProps<{
    placement?: TooltipPlacement;
    /** 交叉轴对齐；默认 start（左/上对齐）。 */
    align?: TooltipAlign;
    content?: string;
    disabled?: boolean;
    offset?: number;
    /**
     * 交叉轴额外位移（px）。
     * top/bottom：加到 left；left/right：加到 top。
     * 例：等宽触发器时 Menu 左右各扩 8，传 -8 并加宽 16。
     */
    crossAxisOffset?: number;
    openDelay?: number;
    closeDelay?: number;
    trigger?: TooltipTrigger;
    panelKind?: TooltipPanelKind;
    widthMode?: TooltipWidthMode;
    width?: number;
    maxWidth?: number;
    height?: number;
    maxHeight?: number;
    tokenScopeClass?: string;
    teleportTo?: string | HTMLElement;
    /**
     * false：#content 由调用方自带面板（如 EgFlotationMenu 内嵌 EgTooltip）。
     * true（默认）：在浮层内再包一层 EgTooltip。
     */
    wrapTooltip?: boolean;
  }>(),
  {
    placement: 'bottom',
    align: 'start',
    content: '',
    disabled: false,
    offset: 8,
    crossAxisOffset: 0,
    openDelay: 0,
    closeDelay: 0,
    trigger: 'click',
    panelKind: 'flotation',
    widthMode: 'adaptive',
    height: 380,
    tokenScopeClass: 'desktopTokens',
    teleportTo: 'body',
    wrapTooltip: true,
  },
);

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const floatingRef = ref<HTMLElement | null>(null);
const open = ref(false);
const positioned = ref(false);
const floatingStyle = ref<Record<string, string>>({});

const tooltipId = useId();
const describedById = computed(() => `eds-tooltip-${tooltipId}`);

let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let floatingResizeObserver: ResizeObserver | undefined;

function resolveTriggerMetricsEl(): HTMLElement | null {
  const root = triggerRef.value;
  if (!root) return null;
  const nested = root.querySelector(
    '.eds-flotation-trigger, .eds-button, button, [data-eds-trigger-metrics]',
  );
  return nested instanceof HTMLElement ? nested : root;
}

function clearTimers() {
  if (openTimer !== undefined) {
    clearTimeout(openTimer);
    openTimer = undefined;
  }
  if (closeTimer !== undefined) {
    clearTimeout(closeTimer);
    closeTimer = undefined;
  }
}

function openNow() {
  if (props.disabled) {
    return;
  }
  clearTimers();
  if (!open.value) {
    open.value = true;
    emit('open');
  }
}

function closeNow() {
  clearTimers();
  if (open.value) {
    open.value = false;
    positioned.value = false;
    emit('close');
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      (triggerRef.value?.contains(active) || active === triggerRef.value)
    ) {
      active.blur();
    } else if (triggerRef.value instanceof HTMLElement) {
      triggerRef.value.blur();
    }
  }
}

function toggleOpen() {
  if (open.value) {
    closeNow();
  } else {
    openNow();
  }
}

function scheduleOpen() {
  if (props.disabled || props.trigger === 'click') {
    return;
  }
  clearTimers();
  openTimer = setTimeout(() => {
    openNow();
  }, props.openDelay);
}

function scheduleClose() {
  if (props.trigger === 'click') {
    return;
  }
  clearTimers();
  closeTimer = setTimeout(() => {
    closeNow();
  }, props.closeDelay);
}

function onTriggerEnter() {
  scheduleOpen();
}

function onTriggerLeave() {
  scheduleClose();
}

function onFloatingEnter() {
  clearTimers();
}

function onFloatingLeave() {
  scheduleClose();
}

function onTriggerFocusIn() {
  if (props.trigger === 'click') {
    return;
  }
  scheduleOpen();
}

function onTriggerFocusOut(event: FocusEvent) {
  if (props.trigger === 'click') {
    return;
  }
  const next = event.relatedTarget as Node | null;
  if (next && floatingRef.value?.contains(next)) {
    return;
  }
  scheduleClose();
}

function onTriggerClick(event: MouseEvent) {
  if (props.trigger !== 'click') {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  toggleOpen();
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.trigger !== 'click') {
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleOpen();
  }
}

function onTriggerContextMenu(event: MouseEvent) {
  if (props.trigger !== 'click') {
    return;
  }
  event.preventDefault();
}

function onDocumentPointerDown(event: PointerEvent) {
  if (props.trigger !== 'click' || !open.value) {
    return;
  }
  const target = event.target as Node;
  if (triggerRef.value?.contains(target) || floatingRef.value?.contains(target)) {
    return;
  }
  closeNow();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    closeNow();
  }
}

function updatePosition() {
  const trigger = resolveTriggerMetricsEl() ?? triggerRef.value;
  const floating = floatingRef.value;
  if (!trigger || !floating) {
    return;
  }

  const triggerRect = trigger.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const gap = props.offset;
  const align = props.align;

  let top = 0;
  let left = 0;

  const alignCrossAxis = (
    triggerStart: number,
    triggerSize: number,
    floatingSize: number,
  ): number => {
    if (align === 'end') {
      return triggerStart + triggerSize - floatingSize;
    }
    if (align === 'center') {
      return triggerStart + (triggerSize - floatingSize) / 2;
    }
    return triggerStart;
  };

  const cross = props.crossAxisOffset ?? 0;

  switch (props.placement) {
    case 'top':
      top = triggerRect.top - floatingRect.height - gap;
      left =
        alignCrossAxis(triggerRect.left, triggerRect.width, floatingRect.width) + cross;
      break;
    case 'bottom':
      top = triggerRect.bottom + gap;
      left =
        alignCrossAxis(triggerRect.left, triggerRect.width, floatingRect.width) + cross;
      break;
    case 'left':
      left = triggerRect.left - floatingRect.width - gap;
      top =
        alignCrossAxis(triggerRect.top, triggerRect.height, floatingRect.height) + cross;
      break;
    case 'right':
      left = triggerRect.right + gap;
      top =
        alignCrossAxis(triggerRect.top, triggerRect.height, floatingRect.height) + cross;
      break;
    default:
      break;
  }

  const margin = 8;
  const maxLeft = window.innerWidth - floatingRect.width - margin;
  const maxTop = window.innerHeight - floatingRect.height - margin;
  left = Math.min(Math.max(margin, left), Math.max(margin, maxLeft));
  top = Math.min(Math.max(margin, top), Math.max(margin, maxTop));

  // 不 round：等宽+左右 inset 8 时 round 会导致左右不对称
  floatingStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  };
  positioned.value = true;
}

function bindFloatingResizeObserver() {
  unbindFloatingResizeObserver();
  const floating = floatingRef.value;
  if (!floating || typeof ResizeObserver === 'undefined') return;
  floatingResizeObserver = new ResizeObserver(() => {
    updatePosition();
  });
  floatingResizeObserver.observe(floating);
}

function unbindFloatingResizeObserver() {
  floatingResizeObserver?.disconnect();
  floatingResizeObserver = undefined;
}

function bindWindowListeners() {
  window.addEventListener('scroll', updatePosition, true);
  window.addEventListener('resize', updatePosition);
}

function unbindWindowListeners() {
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('resize', updatePosition);
}

watch(open, async (isOpen) => {
  if (isOpen) {
    positioned.value = false;
    await nextTick();
    updatePosition();
    bindFloatingResizeObserver();
    bindWindowListeners();
    // 内容宽高（如 Flotation trigger+16）常在首帧后才落地，再补两次定位
    requestAnimationFrame(() => {
      updatePosition();
      requestAnimationFrame(() => updatePosition());
    });
    if (props.trigger === 'click') {
      requestAnimationFrame(() => {
        document.addEventListener('pointerdown', onDocumentPointerDown, true);
      });
    }
    return;
  }
  unbindFloatingResizeObserver();
  unbindWindowListeners();
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  clearTimers();
  unbindFloatingResizeObserver();
  unbindWindowListeners();
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

defineExpose({
  open,
  close: closeNow,
  updatePosition,
  getTriggerElement: () => resolveTriggerMetricsEl() ?? triggerRef.value,
  getTriggerWidth: () => {
    const el = resolveTriggerMetricsEl() ?? triggerRef.value;
    if (!el) return 0;
    return el.getBoundingClientRect().width;
  },
  getTriggerHeight: () => {
    const el = resolveTriggerMetricsEl() ?? triggerRef.value;
    if (!el) return 0;
    return el.getBoundingClientRect().height;
  },
});
</script>

<template>
  <span
    :class="styles.root"
    @keydown="onKeydown"
  >
    <span
      ref="triggerRef"
      :class="[styles.trigger, trigger === 'click' && styles.triggerClick]"
      :aria-describedby="open ? describedById : undefined"
      :aria-expanded="trigger === 'click' ? open : undefined"
      :tabindex="trigger === 'click' ? 0 : undefined"
      @mouseenter="trigger === 'hover' ? onTriggerEnter() : undefined"
      @mouseleave="trigger === 'hover' ? onTriggerLeave() : undefined"
      @focusin="onTriggerFocusIn"
      @focusout="onTriggerFocusOut"
      @click="onTriggerClick"
      @contextmenu="onTriggerContextMenu"
      @keydown="onTriggerKeydown"
    >
      <slot />
    </span>

    <Teleport :to="teleportTo">
      <div
        v-if="open"
        ref="floatingRef"
        :id="describedById"
        :class="[
          styles.floating,
          tokenScopeClass,
          !positioned && styles.floatingHidden,
        ]"
        :style="floatingStyle"
        @mouseenter="trigger === 'hover' ? onFloatingEnter() : undefined"
        @mouseleave="trigger === 'hover' ? onFloatingLeave() : undefined"
        @contextmenu.prevent
      >
        <div :class="styles.floatingInner">
          <EgTooltip
            v-if="wrapTooltip"
            :panel-kind="panelKind"
            :width-mode="widthMode"
            :width="width"
            :max-width="maxWidth"
            :height="height"
            :max-height="maxHeight"
          >
            <slot name="content">
              {{ content }}
            </slot>
          </EgTooltip>
          <slot v-else name="content">
            {{ content }}
          </slot>
        </div>
      </div>
    </Teleport>
  </span>
</template>
