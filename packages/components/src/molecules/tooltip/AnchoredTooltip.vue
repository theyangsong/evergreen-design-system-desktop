<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
  useId,
  watch,
} from 'vue';
import EgTooltip, { type TooltipHeightMode, type TooltipWidthMode } from './Tooltip.vue';
import type { TooltipPanelKind, TooltipPanelRadiusToken } from './tooltipPanelRadius';
import {
  FALLBACK_EDGE_INSET_PX,
  FALLBACK_MAIN_AXIS_PX,
  readCssTokenLength,
  resolveCrossAxisOffsetFromAlign,
  SPACING_EDGE_INSET,
  SPACING_MAIN_AXIS,
} from '../../shared/cssSpacingTokens';
import styles from './AnchoredTooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * 相对触发器的对齐：
 * - top/bottom：start=左对齐，end=右对齐
 * - left/right：start=上对齐，end=下对齐
 */
export type TooltipAlign = 'start' | 'center' | 'end';

/** Opens on click (default), hover, or focus. */
export type TooltipTrigger = 'click' | 'hover' | 'focus';

const props = withDefaults(
  defineProps<{
    placement?: TooltipPlacement;
    /** 交叉轴对齐；默认 start（左/上对齐）。 */
    align?: TooltipAlign;
    content?: string;
    disabled?: boolean;
    /** 主轴间距（px）；未传时使用 --spacing-025。 */
    offset?: number;
    /**
     * 交叉轴额外位移（px）。
     * top/bottom：加到 left；left/right：加到 top。
     * 未传时按 align：start=-spacing-2，end=+spacing-2，center=0。
     */
    crossAxisOffset?: number;
    openDelay?: number;
    closeDelay?: number;
    trigger?: TooltipTrigger;
    panelKind?: TooltipPanelKind;
    /** 透传 EgTooltip；仅 Radius token（--radius-*）。 */
    panelRadius?: TooltipPanelRadiusToken;
    widthMode?: TooltipWidthMode;
    width?: number;
    maxWidth?: number;
    heightMode?: TooltipHeightMode;
    height?: number;
    maxHeight?: number;
    /** false：面板随内容增高，不滚动、不裁剪。 */
    scrollable?: boolean;
    tokenScopeClass?: string;
    teleportTo?: string | HTMLElement;
    /**
     * false：#content 由调用方自带面板（如 EgFlotationMenu 内嵌 EgTooltip）。
     * true（默认）：在浮层内再包一层 EgTooltip。
     */
    wrapTooltip?: boolean;
    /** 任意滚动容器滚动时关闭（如 DataList 行内 More）；默认仍随 scroll 重定位。 */
    closeOnScroll?: boolean;
    /** 主轴空间不足时翻转 placement（bottom↔top、left↔right）。 */
    flip?: boolean;
    /** 定位边界；触发器向上查找最近匹配元素（如 `.eds-data-list`）。未匹配时回退 viewport。 */
    boundarySelector?: string;
    /** 边界内边距（px）。 */
    boundaryMargin?: number;
  }>(),
  {
    placement: 'bottom',
    align: 'start',
    content: '',
    disabled: false,
    openDelay: 0,
    closeDelay: 0,
    trigger: 'click',
    panelKind: 'flotation',
    widthMode: 'adaptive',
    heightMode: 'fixed',
    height: 380,
    scrollable: true,
    tokenScopeClass: 'desktopTokens',
    teleportTo: 'body',
    wrapTooltip: true,
    closeOnScroll: false,
    flip: false,
    boundaryMargin: 8,
  },
);

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const floatingRef = ref<HTMLElement | null>(null);
const open = ref(false);
const resolvedPlacement = ref<TooltipPlacement>(props.placement);
const floatingStyle = ref<Record<string, string>>({});
const mainAxisGapPx = ref(FALLBACK_MAIN_AXIS_PX);
const edgeInsetPx = ref(FALLBACK_EDGE_INSET_PX);

const tooltipId = useId();
const describedById = computed(() => `eds-tooltip-${tooltipId}`);

/** 浮动层 enter/leave 仅 hover 触发；click / focus 瞬时切换（§ motion-interactive）。 */
const floatingMotionEnabled = computed(() => props.trigger === 'hover');

const floatingMotionEnterFromClass = computed(() => {
  switch (resolvedPlacement.value) {
    case 'top':
      return styles.floatingEnterFromTop;
    case 'left':
      return styles.floatingEnterFromLeft;
    case 'right':
      return styles.floatingEnterFromRight;
    default:
      return styles.floatingEnterFromBottom;
  }
});

const floatingMotionLeaveToClass = computed(() => {
  switch (resolvedPlacement.value) {
    case 'top':
      return styles.floatingLeaveToTop;
    case 'left':
      return styles.floatingLeaveToLeft;
    case 'right':
      return styles.floatingLeaveToRight;
    default:
      return styles.floatingLeaveToBottom;
  }
});

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
  if (props.trigger !== 'focus') {
    return;
  }
  scheduleOpen();
}

function onTriggerFocusOut(event: FocusEvent) {
  if (props.trigger !== 'focus') {
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

const OPPOSITE_PLACEMENT: Record<TooltipPlacement, TooltipPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

type BoundaryRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

function resolveBoundary(trigger: HTMLElement): BoundaryRect {
  const margin = props.boundaryMargin ?? 8;

  if (props.boundarySelector) {
    const boundaryEl = trigger.closest(props.boundarySelector);
    if (boundaryEl instanceof HTMLElement) {
      const rect = boundaryEl.getBoundingClientRect();
      let insetTop = 0;

      if (boundaryEl.classList.contains('eds-data-list')) {
        const headerPx = Number.parseFloat(
          getComputedStyle(boundaryEl).getPropertyValue('--eds-data-list-header-height'),
        );
        const triggerInHeader = Boolean(trigger.closest('thead'));
        if (
          !triggerInHeader &&
          Number.isFinite(headerPx) &&
          headerPx > 0
        ) {
          insetTop = headerPx;
        }
      }

      return {
        top: rect.top + insetTop + margin,
        left: rect.left + margin,
        right: rect.right - margin,
        bottom: rect.bottom - margin,
      };
    }
  }

  return {
    top: margin,
    left: margin,
    right: window.innerWidth - margin,
    bottom: window.innerHeight - margin,
  };
}

function computeCoords(
  placement: TooltipPlacement,
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  align: TooltipAlign,
  gap: number,
  cross: number,
): { top: number; left: number } {
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

  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top - floatingRect.height - gap,
        left: alignCrossAxis(triggerRect.left, triggerRect.width, floatingRect.width) + cross,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + gap,
        left: alignCrossAxis(triggerRect.left, triggerRect.width, floatingRect.width) + cross,
      };
    case 'left':
      return {
        left: triggerRect.left - floatingRect.width - gap,
        top: alignCrossAxis(triggerRect.top, triggerRect.height, floatingRect.height) + cross,
      };
    case 'right':
      return {
        left: triggerRect.right + gap,
        top: alignCrossAxis(triggerRect.top, triggerRect.height, floatingRect.height) + cross,
      };
    default:
      return { top: 0, left: 0 };
  }
}

function mainAxisOverflow(
  placement: TooltipPlacement,
  top: number,
  left: number,
  floatingRect: DOMRect,
  boundary: BoundaryRect,
): number {
  switch (placement) {
    case 'bottom':
      return top + floatingRect.height - boundary.bottom;
    case 'top':
      return boundary.top - top;
    case 'left':
      return boundary.left - left;
    case 'right':
      return left + floatingRect.width - boundary.right;
    default:
      return 0;
  }
}

function clampToBoundary(
  top: number,
  left: number,
  floatingRect: DOMRect,
  boundary: BoundaryRect,
): { top: number; left: number } {
  const maxLeft = Math.max(boundary.left, boundary.right - floatingRect.width);
  const maxTop = Math.max(boundary.top, boundary.bottom - floatingRect.height);
  return {
    left: Math.min(Math.max(left, boundary.left), maxLeft),
    top: Math.min(Math.max(top, boundary.top), maxTop),
  };
}

function resolveSpacingTokens() {
  const trigger = resolveTriggerMetricsEl() ?? triggerRef.value;
  if (!trigger) return;
  mainAxisGapPx.value = readCssTokenLength(trigger, SPACING_MAIN_AXIS, FALLBACK_MAIN_AXIS_PX);
  edgeInsetPx.value = readCssTokenLength(trigger, SPACING_EDGE_INSET, FALLBACK_EDGE_INSET_PX);
}

function resolveMainAxisGap(): number {
  return props.offset ?? mainAxisGapPx.value;
}

function resolveCrossAxisGap(): number {
  if (props.crossAxisOffset != null) {
    return props.crossAxisOffset;
  }
  return resolveCrossAxisOffsetFromAlign(props.align, edgeInsetPx.value);
}

function updatePosition() {
  const trigger = resolveTriggerMetricsEl() ?? triggerRef.value;
  const floating = floatingRef.value;
  if (!trigger || !floating) {
    return;
  }

  resolveSpacingTokens();

  const triggerRect = trigger.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const gap = resolveMainAxisGap();
  const align = props.align;
  const cross = resolveCrossAxisGap();
  const boundary = resolveBoundary(trigger);

  let placement = props.placement;
  let coords = computeCoords(placement, triggerRect, floatingRect, align, gap, cross);

  if (props.flip) {
    const overflow = mainAxisOverflow(
      placement,
      coords.top,
      coords.left,
      floatingRect,
      boundary,
    );
    if (overflow > 0) {
      placement = OPPOSITE_PLACEMENT[placement];
      coords = computeCoords(placement, triggerRect, floatingRect, align, gap, cross);
    }
  }

  coords = clampToBoundary(coords.top, coords.left, floatingRect, boundary);

  resolvedPlacement.value = placement;

  // 不 round：等宽+左右 inset 8 时 round 会导致左右不对称
  floatingStyle.value = {
    top: `${coords.top}px`,
    left: `${coords.left}px`,
  };
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

function isScrollInsideFloating(event: Event): boolean {
  const target = event.target;
  if (!(target instanceof Node)) {
    return false;
  }
  return floatingRef.value?.contains(target) ?? false;
}

function onScroll(event: Event) {
  if (!open.value) {
    return;
  }
  if (props.closeOnScroll) {
    // 浮层内列表自滚（如 CryptoAddress 地址 Menu）不应触发关闭。
    if (isScrollInsideFloating(event)) {
      return;
    }
    closeNow();
    return;
  }
  updatePosition();
}

function bindWindowListeners() {
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', updatePosition);
}

function unbindWindowListeners() {
  window.removeEventListener('scroll', onScroll, true);
  window.removeEventListener('resize', updatePosition);
}

function onFloatingBeforeEnter(el: Element) {
  floatingRef.value = el as HTMLElement;
  updatePosition();
}

function bindOpenSideEffects() {
  bindFloatingResizeObserver();
  bindWindowListeners();
  requestAnimationFrame(() => {
    updatePosition();
    requestAnimationFrame(() => updatePosition());
  });
  if (props.trigger === 'click') {
    requestAnimationFrame(() => {
      document.addEventListener('pointerdown', onDocumentPointerDown, true);
    });
  }
}

function unbindOpenSideEffects() {
  unbindFloatingResizeObserver();
  unbindWindowListeners();
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
}

watch(
  () => props.placement,
  (placement) => {
    resolvedPlacement.value = placement;
  },
);

onBeforeUnmount(() => {
  clearTimers();
  unbindOpenSideEffects();
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
      :data-eds-tooltip-open="
        open && (trigger === 'hover' || trigger === 'focus') ? '' : undefined
      "
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
      <Transition
        :css="floatingMotionEnabled"
        :enter-active-class="styles.floatingEnterActive"
        :leave-active-class="styles.floatingLeaveActive"
        :enter-from-class="floatingMotionEnterFromClass"
        :enter-to-class="styles.floatingEnterTo"
        :leave-from-class="styles.floatingLeaveFrom"
        :leave-to-class="floatingMotionLeaveToClass"
        @before-enter="onFloatingBeforeEnter"
        @after-enter="bindOpenSideEffects"
        @after-leave="unbindOpenSideEffects"
      >
        <div
          v-if="open"
          ref="floatingRef"
          :id="describedById"
          :class="[styles.floating, tokenScopeClass]"
          :style="floatingStyle"
          @mouseenter="trigger === 'hover' ? onFloatingEnter() : undefined"
          @mouseleave="trigger === 'hover' ? onFloatingLeave() : undefined"
          @contextmenu.prevent
        >
          <div :class="styles.floatingInner">
            <EgTooltip
              v-if="wrapTooltip"
              :panel-kind="panelKind"
              :panel-radius="panelRadius"
              :width-mode="widthMode"
              :width="width"
              :max-width="maxWidth"
              :height-mode="heightMode"
              :height="heightMode === 'fixed' ? height : undefined"
              :max-height="maxHeight"
              :scrollable="scrollable"
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
      </Transition>
    </Teleport>
  </span>
</template>
