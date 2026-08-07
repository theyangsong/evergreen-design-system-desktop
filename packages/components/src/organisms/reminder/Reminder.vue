<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgComboActionFlotation, EgComboActionPopupWindow } from '../../molecules/combo';
import chromeScrimStyles from '../../styles/popupChromeScrim.module.css';
import '../../styles/popupInnerBackdrop.css';
import styles from './Reminder.module.css';

export type ReminderType = 'info' | 'echo';

const props = withDefaults(
  defineProps<{
    type?: ReminderType;
    title?: string;
    secondaryText?: string;
    showSecondaryText?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    actionCount?: 1 | 2;
    showClear?: boolean;
    clearLabel?: string;
    toolbarTone?: 'brand' | 'decor';
  }>(),
  {
    type: 'info',
    title: 'Title',
    secondaryText: 'I am text',
    showSecondaryText: true,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    actionCount: 1,
    showClear: false,
    clearLabel: 'Clear',
    toolbarTone: 'decor',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  clear: [];
}>();

const SCROLL_EDGE_EPSILON = 2;

const scrollRef = ref<HTMLElement | null>(null);
const scrollOverflows = ref(false);
let scrollResizeObserver: ResizeObserver | undefined;

function updateScrollState() {
  const element = scrollRef.value;

  if (!element) {
    scrollOverflows.value = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
  scrollOverflows.value =
    canScroll && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;
}

function scheduleScrollStateUpdate() {
  void nextTick(updateScrollState);
}

function onScroll() {
  updateScrollState();
}

onMounted(() => {
  scheduleScrollStateUpdate();
  if (typeof ResizeObserver !== 'undefined' && scrollRef.value) {
    scrollResizeObserver = new ResizeObserver(scheduleScrollStateUpdate);
    scrollResizeObserver.observe(scrollRef.value);
  }
});

onBeforeUnmount(() => {
  scrollResizeObserver?.disconnect();
});

watch(
  () => [props.type, props.showSecondaryText, props.secondaryText, props.title],
  scheduleScrollStateUpdate,
);
</script>

<template>
  <div
    class="eds-reminder eds-popup-inner-backdrop"
    :class="[styles.root, type === 'echo' ? styles.echo : styles.info]"
    :data-reminder-type="type"
    role="dialog"
    aria-modal="true"
  >
    <template v-if="type === 'info'">
      <div :class="styles.infoBody">
        <div :class="[styles.symbol, 'eds-reminder-symbol']">
          <slot name="symbol">
            <EgIcon name="eds-warning-lonely" size="lg" />
          </slot>
        </div>

        <div :class="[styles.infoCopy, 'eds-reminder-info-copy']">
          <p :class="styles.infoTitle">{{ title }}</p>
          <p v-if="showSecondaryText" :class="styles.infoSecondary">
            {{ secondaryText }}
          </p>
        </div>

        <div :class="[styles.infoActions, 'eds-reminder-info-actions']">
          <slot name="actions">
            <EgComboActionPopupWindow
              :tone="toolbarTone"
              :count="actionCount"
              :confirm-label="confirmLabel"
              :cancel-label="cancelLabel"
              @confirm="emit('confirm')"
              @cancel="emit('cancel')"
            />
          </slot>
        </div>
      </div>
    </template>

    <template v-else>
      <div ref="scrollRef" :class="styles.echoScroll" @scroll="onScroll">
        <div :class="styles.echoContent">
          <div :class="styles.echoCopy">
            <p :class="styles.echoTitle">{{ title }}</p>
            <p v-if="showSecondaryText" :class="styles.echoSecondary">
              {{ secondaryText }}
            </p>
          </div>

          <div v-if="$slots.default" :class="styles.echoBody">
            <slot />
          </div>
        </div>

        <footer
          :class="[
            styles.echoToolbar,
            chromeScrimStyles.root,
            scrollOverflows && chromeScrimStyles.active,
          ]"
        >
          <div :class="chromeScrimStyles.content">
            <slot name="actions">
              <EgComboActionFlotation
                :tone="toolbarTone"
                :divider="scrollOverflows"
                :clear="showClear"
                :confirm-label="confirmLabel"
                :cancel-label="cancelLabel"
                @confirm="emit('confirm')"
                @cancel="emit('cancel')"
                @clear="emit('clear')"
              />
            </slot>
          </div>
        </footer>
      </div>
    </template>
  </div>
</template>
