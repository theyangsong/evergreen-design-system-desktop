<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgFlotation, EgFlotationMenu, EgFlotationMenuItem } from '../flotation';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import cryptoComboStyles from '../crypto-combo/CryptoCombo.module.css';
import styles from './ListFieldHashLike.module.css';

const HASH_LIKE_TOOLTIP_MAX_HEIGHT = 280;
const HASH_LIKE_TOOLTIP_MAX_WIDTH = 480;

const props = withDefaults(
  defineProps<{
    text: string;
    variant?: 'primary' | 'secondary';
    identifierMode?: boolean;
    copyOnRowHover?: boolean;
    showTooltipCopy?: boolean;
    tooltipTrigger?: 'hover' | 'focus';
    ellipsis?: boolean;
  }>(),
  {
    variant: 'primary',
    identifierMode: false,
    copyOnRowHover: false,
    showTooltipCopy: true,
    tooltipTrigger: 'hover',
    ellipsis: false,
  },
);

const lineRef = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const cellCopied = ref(false);
const tooltipCopied = ref(false);
let resizeObserver: ResizeObserver | undefined;
let cellCopiedResetTimer: ReturnType<typeof setTimeout> | undefined;
let tooltipCopiedResetTimer: ReturnType<typeof setTimeout> | undefined;

const tooltipTargetModifier = computed(() =>
  props.variant === 'primary' ? 'eds-hover-tooltip-trigger__target--primary' : undefined,
);

const hoverTriggerClass = computed(() =>
  props.tooltipTrigger === 'focus' ? 'eds-hover-tooltip-trigger--focus' : undefined,
);

const lineClasses = computed(() => [
  props.variant === 'primary' ? styles.primaryLine : styles.secondaryLine,
  props.ellipsis ? styles.lineEllipsis : styles.lineAdaptive,
]);

const menuTextClass = computed(() =>
  props.variant === 'primary' ? styles.menuPrimary : styles.menuSecondary,
);

const copyLabel = computed(() =>
  props.identifierMode ? `复制编号 ${props.text}` : `复制哈希 ${props.text}`,
);

function isOverflowing(el: HTMLElement | null): boolean {
  if (!el) return false;
  return el.scrollWidth > el.clientWidth + 1;
}

function measureOverflow() {
  overflowing.value = isOverflowing(lineRef.value);
}

function bindResizeObserver() {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  if (typeof ResizeObserver === 'undefined' || !lineRef.value) return;
  resizeObserver = new ResizeObserver(() => measureOverflow());
  resizeObserver.observe(lineRef.value);
}

function scheduleOverflowMeasure() {
  nextTick(() => {
    measureOverflow();
    bindResizeObserver();
  });
}

watch(
  () => [props.text, props.ellipsis] as const,
  () => {
    scheduleOverflowMeasure();
  },
);

onMounted(() => {
  scheduleOverflowMeasure();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
  if (tooltipCopiedResetTimer) clearTimeout(tooltipCopiedResetTimer);
});

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

async function onCopy(event: Event, target: 'cell' | 'tooltip') {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyText(props.text);
  if (!copied) return;

  if (target === 'cell') {
    cellCopied.value = true;
    if (cellCopiedResetTimer) clearTimeout(cellCopiedResetTimer);
    cellCopiedResetTimer = setTimeout(() => {
      cellCopied.value = false;
    }, 2000);
    return;
  }

  tooltipCopied.value = true;
  if (tooltipCopiedResetTimer) clearTimeout(tooltipCopiedResetTimer);
  tooltipCopiedResetTimer = setTimeout(() => {
    tooltipCopied.value = false;
  }, 2000);
}
</script>

<template>
  <div :class="[styles.cellLine, props.variant === 'secondary' && styles.cellLineSecondary]">
    <EgFlotation
      :trigger="tooltipTrigger"
      placement="bottom"
      align="start"
      :open-delay="120"
      :close-delay="80"
      :disabled="!overflowing"
      :show-add="false"
      :show-menu-divider="false"
    >
      <template #trigger>
        <span
          v-if="overflowing"
          :class="['eds-hover-tooltip-trigger', hoverTriggerClass, styles.tooltipTriggerWrap]"
        >
          <span
            ref="lineRef"
            :class="['eds-hover-tooltip-trigger__target', tooltipTargetModifier, lineClasses]"
            :tabindex="tooltipTrigger === 'focus' ? 0 : undefined"
          >
            {{ text }}
          </span>
        </span>
        <span
          v-else
          ref="lineRef"
          :class="lineClasses"
        >
          {{ text }}
        </span>
      </template>

      <template #content>
        <EgFlotationMenu
          class="eds-crypto-address-tooltip-menu eds-flotation-menu--box-doc"
          height-mode="adaptive"
          :max-height="HASH_LIKE_TOOLTIP_MAX_HEIGHT"
          width-mode="adaptive"
          :max-width="HASH_LIKE_TOOLTIP_MAX_WIDTH"
          :show-add="false"
          list-scroll
        >
          <EgFlotationMenuItem box-type="text" label-wrap :show-tag="false">
            <span :class="cryptoComboStyles.menuRowContent">
              <span :class="cryptoComboStyles.menuRowMain">
                <span :class="cryptoComboStyles.menuAddressLine">
                  <span :class="menuTextClass">{{ text }}</span>
                  <span
                    v-if="showTooltipCopy"
                    :class="[
                      cryptoComboStyles.menuCopyButton,
                      tooltipCopied && cryptoComboStyles.menuCopyButtonCopied,
                    ]"
                    role="button"
                    tabindex="0"
                    :aria-label="copyLabel"
                    @click.stop="onCopy($event, 'tooltip')"
                    @keydown.enter.prevent="onCopy($event, 'tooltip')"
                    @keydown.space.prevent="onCopy($event, 'tooltip')"
                  >
                    <EgIconButton as="span" shape="square" size="xs" :label="copyLabel">
                      <EgIcon
                        :name="tooltipCopied ? 'eds-enable-fill' : 'eds-copy'"
                        fit
                      />
                    </EgIconButton>
                  </span>
                </span>
              </span>
            </span>
          </EgFlotationMenuItem>
        </EgFlotationMenu>
      </template>
    </EgFlotation>

    <span
      v-if="copyOnRowHover"
      :class="[
        cryptoComboStyles.menuCopyButton,
        styles.cellCopyButton,
        cellCopied && cryptoComboStyles.menuCopyButtonCopied,
      ]"
      role="button"
      tabindex="0"
      :aria-label="copyLabel"
      @click.stop="onCopy($event, 'cell')"
      @keydown.enter.prevent="onCopy($event, 'cell')"
      @keydown.space.prevent="onCopy($event, 'cell')"
    >
      <EgIconButton as="span" shape="square" size="xs" :label="copyLabel">
        <EgIcon :name="cellCopied ? 'eds-enable-fill' : 'eds-copy'" fit />
      </EgIconButton>
    </span>
  </div>
</template>
