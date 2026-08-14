<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  ref,
  watch,
} from 'vue';
import styles from './Layout.module.css';
import '../../styles/frostedPageChrome.css';
import {
  SKID_AFFECTING_MAIN_KEY,
  SKID_PUSH_TRANSITION_MS,
  SKID_REQUEST_CLOSE_KEY,
} from '../../shared/skidContext';

export type LayoutType = 'empty' | 'navigation' | 'module-menu' | 'free';

const props = withDefaults(
  defineProps<{
    type?: LayoutType;
    showToolbar?: boolean;
    showPaginer?: boolean;
  }>(),
  {
    type: 'navigation',
    showToolbar: false,
    showPaginer: false,
  },
);

const showSkid = defineModel<boolean>('showSkid', { default: false });

const skidAffectingMain = ref(Boolean(showSkid.value));
provide(SKID_AFFECTING_MAIN_KEY, skidAffectingMain);
provide(SKID_REQUEST_CLOSE_KEY, () => {
  showSkid.value = false;
});

let skidReleaseTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  showSkid,
  (open) => {
    if (skidReleaseTimer !== undefined) {
      clearTimeout(skidReleaseTimer);
      skidReleaseTimer = undefined;
    }

    if (open) {
      skidAffectingMain.value = true;
      return;
    }

    skidReleaseTimer = window.setTimeout(() => {
      if (!showSkid.value) {
        skidAffectingMain.value = false;
      }
      skidReleaseTimer = undefined;
    }, SKID_PUSH_TRANSITION_MS);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (skidReleaseTimer !== undefined) clearTimeout(skidReleaseTimer);
  chromeResizeObserver?.disconnect();
  chromeResizeObserver = undefined;
});

const bodyRef = ref<HTMLElement | null>(null);
const toolbarOverlayRef = ref<HTMLElement | null>(null);
const paginerOverlayRef = ref<HTMLElement | null>(null);

const hasChromeOverlay = computed(
  () => props.showToolbar || props.showPaginer,
);

let chromeResizeObserver: ResizeObserver | undefined;

function updateChromeInsets() {
  const body = bodyRef.value;
  if (!body) return;

  const top =
    props.showToolbar && toolbarOverlayRef.value
      ? toolbarOverlayRef.value.offsetHeight
      : 0;
  const bottom =
    props.showPaginer && paginerOverlayRef.value
      ? paginerOverlayRef.value.offsetHeight
      : 0;

  body.style.setProperty('--eds-layout-chrome-inset-top', `${top}px`);
  body.style.setProperty('--eds-layout-chrome-inset-bottom', `${bottom}px`);
}

function observeChromeOverlays() {
  if (!hasChromeOverlay.value) return;

  if (!chromeResizeObserver) {
    chromeResizeObserver = new ResizeObserver(() => {
      updateChromeInsets();
    });
  }

  chromeResizeObserver.disconnect();

  if (toolbarOverlayRef.value) {
    chromeResizeObserver.observe(toolbarOverlayRef.value);
  }
  if (paginerOverlayRef.value) {
    chromeResizeObserver.observe(paginerOverlayRef.value);
  }

  updateChromeInsets();
}

function scheduleChromeInsetUpdate() {
  nextTick(() => {
    requestAnimationFrame(observeChromeOverlays);
  });
}

watch(
  () => [props.showToolbar, props.showPaginer] as const,
  () => {
    scheduleChromeInsetUpdate();
  },
);

onMounted(() => {
  scheduleChromeInsetUpdate();
});

onUpdated(() => {
  scheduleChromeInsetUpdate();
});
</script>

<template>
  <div
    class="eds-layout"
    :class="[styles.root, hasChromeOverlay && 'eds-layout-chrome-overlay']"
  >
    <div v-if="type !== 'empty' && $slots.nav" :class="styles.nav">
      <slot name="nav" />
    </div>
    <div
      v-if="type !== 'empty' && $slots.moduleMenu && (type === 'module-menu' || type === 'free')"
      :class="styles.moduleMenu"
    >
      <slot name="moduleMenu" />
    </div>
    <div :class="[styles.main, showSkid && $slots.skid && styles.mainSkidOpen]">
      <div :class="styles.scrollPanel">
        <div
          ref="bodyRef"
          :class="[styles.body, hasChromeOverlay && styles.bodyChromeOverlay]"
        >
          <slot />
          <div
            v-if="showToolbar && $slots.toolbar"
            ref="toolbarOverlayRef"
            :class="styles.toolbarOverlay"
          >
            <slot name="toolbar" />
          </div>
          <div
            v-if="showPaginer && $slots.paginer"
            ref="paginerOverlayRef"
            :class="styles.paginerOverlay"
          >
            <slot name="paginer" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="$slots.skid"
      :class="[styles.skid, showSkid && styles.skidVisible]"
      :aria-hidden="showSkid ? undefined : true"
    >
      <div :class="styles.skidInner">
        <slot name="skid" />
      </div>
    </div>
  </div>
</template>
