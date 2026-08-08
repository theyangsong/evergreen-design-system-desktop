<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgTooltip } from '../../molecules/tooltip';
import { resolveReminderPanelWidthPx } from '../../organisms/reminder/reminderPanelWidths';
import {
  resolveVerifyPanelHeightPx,
  resolveVerifyPanelWidthPx,
  type VerifyType,
} from '../../organisms/verify';
import type { ReminderType } from '../../organisms/reminder';
import '../../styles/overlayGlassMicroFloat.module.css';
import styles from './Popup.module.css';

export type PopupUses = 'detail' | 'reminder' | 'verify' | 'custom';

/** Alert 舞台垂直对齐：居中，或顶边距百分比占位（`--padding-top-md`）。 */
export type PopupAlertVerticalAlign = 'center' | 'padding-top-md';

/** Figma Popup Detail 面板固定尺寸 */
const DETAIL_PANEL_WIDTH = 880;
const DETAIL_PANEL_HEIGHT = 620;

/**
 * 层级：EgPopup → EgTooltip（effect-popup-box 容器）→ 默认插槽 → 内容（如 EgDetail）。
 * 边距由 Popup Box token 提供；内容 organism 不再模拟容器 padding。
 *
 * 挂载：须放在客户端 shell 全屏容器内（100%×100%），遮罩覆盖 NavBar + 侧栏 + 主内容；
 * 勿挂在列表页等业务 subtree 内——父容器多大，Popup 遮罩就多大。
 */

const props = withDefaults(
  defineProps<{
    uses?: PopupUses;
    /** Reminder 内容类型，决定 Popup Box 固定宽度（Info 280 / Echo 460）。 */
    reminderType?: ReminderType;
    /** Verify 场景类型，决定 Popup Box 固定宽高（见 VERIFY_TYPE_PRESETS）。 */
    verifyType?: VerifyType;
    /** uses=custom 时 Popup Box 宽度（px）。 */
    boxWidth?: number;
    /** uses=custom 时 Popup Box 高度（px）。 */
    boxHeight?: number;
    /** Alert 舞台垂直对齐（Detail 忽略）。center：几何居中；padding-top-md：顶边距 22%。 */
    alertVerticalAlign?: PopupAlertVerticalAlign;
    /** 面板进出场（`.motion-layout` + host active）。 */
    microFloat?: boolean;
  }>(),
  {
    uses: 'reminder',
    reminderType: 'info',
    verifyType: 'single-email',
    boxWidth: 328,
    boxHeight: 436,
    microFloat: true,
  },
);

const open = defineModel<boolean>('open', { default: true });

const emit = defineEmits<{
  close: [];
}>();

const rootRef = ref<HTMLElement | null>(null);
const shellKeepMounted = ref(open.value);
const shellMotionActive = ref(false);
let shellLeaveTimer: ReturnType<typeof setTimeout> | undefined;
let closing = false;

const isDetail = computed(() => props.uses === 'detail');

const showScrim = computed(() => open.value || shellKeepMounted.value);

const isVerify = computed(() => props.uses === 'verify');
const isCustom = computed(() => props.uses === 'custom');
const isReminder = computed(() => props.uses === 'reminder');

const resolvedAlertVerticalAlign = computed((): PopupAlertVerticalAlign => {
  if (props.alertVerticalAlign != null) {
    return props.alertVerticalAlign;
  }
  if (isReminder.value || isVerify.value) {
    return 'padding-top-md';
  }
  return 'center';
});

const usesAlertPaddingTop = computed(
  () => !isDetail.value && resolvedAlertVerticalAlign.value === 'padding-top-md',
);

const alertPanelWidthPx = computed(() => {
  if (isVerify.value) {
    return resolveVerifyPanelWidthPx(props.verifyType);
  }
  if (isCustom.value) {
    return props.boxWidth;
  }
  return resolveReminderPanelWidthPx(props.reminderType);
});

const alertHeightMode = computed((): 'fixed' | 'adaptive' => {
  if (isVerify.value || isCustom.value) {
    return 'fixed';
  }
  return 'adaptive';
});

const alertPanelHeightPx = computed(() => {
  if (isVerify.value) {
    return resolveVerifyPanelHeightPx(props.verifyType);
  }
  if (isCustom.value) {
    return props.boxHeight;
  }
  return undefined;
});

function readMotionLeaveMs(el: HTMLElement, motionClass: string): number {
  const probe = document.createElement('div');
  probe.className = motionClass;
  el.appendChild(probe);
  const seconds = Number.parseFloat(getComputedStyle(probe).transitionDuration);
  el.removeChild(probe);
  return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : 300;
}

function readShellLeaveMs(el: HTMLElement): number {
  return Math.max(
    readMotionLeaveMs(el, 'popupDetailPanelMotionProbe'),
    readMotionLeaveMs(el, 'popupDetailScrimMotionProbe'),
  );
}

function clearShellLeaveTimer() {
  if (shellLeaveTimer !== undefined) {
    clearTimeout(shellLeaveTimer);
    shellLeaveTimer = undefined;
  }
}

function syncShellMotionEnter() {
  if (!props.microFloat || !shellKeepMounted.value) {
    shellMotionActive.value = false;
    return;
  }
  shellMotionActive.value = false;
  nextTick(() => {
    requestAnimationFrame(() => {
      if (props.microFloat && shellKeepMounted.value) {
        shellMotionActive.value = true;
      }
    });
  });
}

function runShellLeaveAnimation(): Promise<void> {
  return new Promise((resolve) => {
    if (!props.microFloat) {
      resolve();
      return;
    }
    clearShellLeaveTimer();
    shellMotionActive.value = false;
    const rootEl = rootRef.value ?? document.documentElement;
    const leaveMs = readShellLeaveMs(rootEl);
    shellLeaveTimer = setTimeout(() => {
      shellLeaveTimer = undefined;
      resolve();
    }, leaveMs);
  });
}

async function finishClose() {
  if (closing || !shellKeepMounted.value) {
    return;
  }
  closing = true;
  await runShellLeaveAnimation();
  shellKeepMounted.value = false;
  emit('close');
  closing = false;
}

function requestClose() {
  if (!open.value || closing) {
    return;
  }
  open.value = false;
}

function onStageSelfClick() {
  if (open.value) {
    requestClose();
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value || closing) {
    return;
  }
  event.preventDefault();
  requestClose();
}

watch(open, async (value, oldValue) => {
  if (value) {
    clearShellLeaveTimer();
    closing = false;
    shellKeepMounted.value = true;
    syncShellMotionEnter();
    return;
  }
  if (oldValue && shellKeepMounted.value) {
    await finishClose();
  }
});

watch(() => [props.uses, props.microFloat] as const, () => {
  if (open.value && shellKeepMounted.value) {
    syncShellMotionEnter();
  }
});

onMounted(() => {
  if (open.value) {
    shellKeepMounted.value = true;
    syncShellMotionEnter();
  }
  document.addEventListener('keydown', onKeydown, { capture: true });
});

onBeforeUnmount(() => {
  clearShellLeaveTimer();
  document.removeEventListener('keydown', onKeydown, { capture: true });
});
</script>

<template>
  <div
    v-if="shellKeepMounted"
    ref="rootRef"
    class="eds-popup desktopTokens"
    :class="styles.root"
    role="presentation"
  >
    <div
      :class="[
        styles.stage,
        isDetail ? styles.stageDetail : styles.stageAlert,
        !isDetail && usesAlertPaddingTop && styles.stageAlertPaddingTop,
        showScrim && styles.stageScrim,
        microFloat && showScrim && styles.stageScrimAnimated,
      ]"
      @click.self="onStageSelfClick"
    >
      <div
        v-if="microFloat && showScrim"
        :class="[
          styles.stageScrimOverlay,
          shellMotionActive && styles.stageScrimOverlayVisible,
        ]"
        aria-hidden="true"
        @click="onStageSelfClick"
      />

      <div
        v-if="usesAlertPaddingTop"
        :class="styles.stageAlertTopSpacer"
        aria-hidden="true"
      />

      <div :class="styles.stagePanel">
      <EgTooltip
        v-if="isDetail"
        :class="[
          styles.detailShell,
          microFloat && 'glassMicroFloatHost',
          microFloat && shellMotionActive && 'glassMicroFloatHostActive',
        ]"
        panel-kind="popup"
        panel-radius="radius-lg"
        :panel-layout-motion="microFloat"
        width-mode="fixed"
        :width="DETAIL_PANEL_WIDTH"
        height-mode="fixed"
        :height="DETAIL_PANEL_HEIGHT"
        :max-width="DETAIL_PANEL_WIDTH"
        :max-height="DETAIL_PANEL_HEIGHT"
        :scrollable="false"
      >
        <slot />
      </EgTooltip>

      <div
        v-else
        :class="[
          styles.alertShell,
          isCustom && styles.alertShellSlotCenter,
          microFloat && 'glassMicroFloatHost',
          microFloat && shellMotionActive && 'glassMicroFloatHostActive',
        ]"
      >
        <EgTooltip
          panel-kind="popup"
          panel-radius="radius-lg"
          :panel-layout-motion="microFloat"
          panel-flush
          width-mode="fixed"
          :width="alertPanelWidthPx"
          :height-mode="alertHeightMode"
          :height="alertPanelHeightPx"
          :scrollable="false"
        >
          <slot />
        </EgTooltip>
      </div>
      </div>
    </div>
  </div>
</template>
