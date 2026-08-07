<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgTooltip } from '../../molecules/tooltip';
import { resolveReminderPanelWidthPx } from '../../organisms/reminder/reminderPanelWidths';
import type { ReminderType } from '../../organisms/reminder';
import '../../styles/overlayGlassMicroFloat.module.css';
import styles from './Popup.module.css';

export type PopupUses = 'detail' | 'reminder' | 'verify';

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
    /** Reminder / Verify 内容类型，决定 Popup Box 固定宽度（Info 280 / Echo 460）。 */
    reminderType?: ReminderType;
    /** 面板进出场（`.motion-layout` + host active）。 */
    microFloat?: boolean;
  }>(),
  {
    uses: 'reminder',
    reminderType: 'info',
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
const isAlert = computed(() => !isDetail.value);

const showScrim = computed(() => {
  if (isDetail.value) {
    return open.value || shellKeepMounted.value;
  }
  return shellKeepMounted.value;
});

const alertPanelWidthPx = computed(() =>
  resolveReminderPanelWidthPx(props.reminderType),
);

function readMotionLeaveMs(el: HTMLElement, motionClass: string): number {
  const probe = document.createElement('div');
  probe.className = motionClass;
  el.appendChild(probe);
  const seconds = Number.parseFloat(getComputedStyle(probe).transitionDuration);
  el.removeChild(probe);
  return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : 300;
}

function readShellLeaveMs(el: HTMLElement): number {
  if (isDetail.value) {
    return Math.max(
      readMotionLeaveMs(el, 'popupDetailPanelMotionProbe'),
      readMotionLeaveMs(el, 'popupDetailScrimMotionProbe'),
    );
  }
  return readMotionLeaveMs(el, 'popupDetailPanelMotionProbe');
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

function onBackdropClick() {
  if (open.value) {
    requestClose();
  }
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
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  clearShellLeaveTimer();
  document.removeEventListener('keydown', onKeydown);
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
      v-if="isAlert && showScrim"
      :class="styles.backdrop"
      aria-hidden="true"
      @click="onBackdropClick"
    />

    <div
      :class="[
        styles.stage,
        isDetail ? styles.stageDetail : styles.stageAlert,
        isDetail && showScrim && styles.stageScrim,
        isDetail && microFloat && showScrim && styles.stageDetailAnimatedScrim,
        isDetail && microFloat && showScrim && shellMotionActive && styles.stageDetailScrimVisible,
      ]"
      @click.self="onStageSelfClick"
    >
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
          'desktopTokens',
          'effect-popup-box',
          styles.alertShell,
          microFloat && 'motion-layout',
          microFloat && shellMotionActive && 'is-active',
          microFloat && 'glassMicroFloatHost',
          microFloat && shellMotionActive && 'glassMicroFloatHostActive',
          uses === 'verify' && styles.verifyShell,
        ]"
        :style="{ width: `${alertPanelWidthPx}px` }"
      >
        <div :class="styles.alertShellInner">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
