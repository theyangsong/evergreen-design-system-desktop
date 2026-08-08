<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EgAvatar } from '../../atoms/avatar';
import { EgCrypto } from '../../atoms/crypto';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../../molecules/icon-button';
import { EgLink } from '../../molecules/link';
import { EgTag, type TagSize, type TagStatus } from '../../molecules/tag';
import { EgButton, type ButtonTone } from '../../molecules/button';
import type { ComboActionPageTone } from '../../molecules/combo';
import comboActionStyles from '../../molecules/combo/ComboAction.module.css';
import { EgPaginationItem } from '../../molecules/pagination-item';
import { EgTabs } from '../../molecules/tab';
import { hasOpenClickAnchoredTooltip } from '../../molecules/tooltip/anchoredTooltipManager';
import cryptoComboStyles from '../../molecules/crypto-combo/CryptoCombo.module.css';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { formatGroupedNumber } from '../../utils/formatGroupedNumber';
import chromeScrimStyles from '../../styles/popupChromeScrim.module.css';
import '../../styles/motionPageTransition.module.css';
import '../../styles/popupInnerBackdrop.css';
import styles from './Detail.module.css';
import {
  createDefaultDetailSections,
  type DetailItemData,
  type DetailSectionData,
} from './detailTypes';

function itemShowsTitleIcon(item: DetailItemData): boolean {
  if (item.showTitleIcon === false) return false;
  return Boolean(item.titleIcon);
}

function itemShowsValueSymbol(item: DetailItemData): boolean {
  if (item.showValueSymbol) return true;
  return item.valueType === 'crypto' || item.valueType === 'user';
}

function itemShowsValueCrypto(item: DetailItemData): boolean {
  if (item.showValueSymbol) return item.valueSymbolKind === 'crypto';
  return item.valueType === 'crypto' && Boolean(item.valueIcon);
}

function itemValueCryptoName(item: DetailItemData): string | undefined {
  if (item.showValueSymbol && item.valueSymbolKind === 'crypto') {
    return item.valueSymbolCrypto;
  }
  return item.valueIcon;
}

function itemShowsValueAvatar(item: DetailItemData): boolean {
  if (item.showValueSymbol) return item.valueSymbolKind === 'avatar';
  return item.valueType === 'user';
}

function itemValueAvatarName(item: DetailItemData): string {
  if (item.showValueSymbol && item.valueSymbolKind === 'avatar') {
    return item.valueSymbolAvatarName ?? item.value;
  }
  return item.value;
}

function itemHasValueTrailingActions(item: DetailItemData): boolean {
  return Boolean(
    item.showValueLink
      || item.showValueCopy
      || item.showValueAddressBook
      || item.showValueAmlSearch
      || item.showValueBrowser,
  );
}

function itemCopyKey(sectionIndex: number, itemIndex: number, item: DetailItemData): string {
  return item.key ?? `${sectionIndex}-${itemIndex}`;
}

const copiedItemKey = ref<string | null>(null);
let copiedResetTimer: ReturnType<typeof setTimeout> | undefined;

async function onCopyItemValue(
  copyKey: string,
  value: string,
  event: MouseEvent,
) {
  event.stopPropagation();
  event.preventDefault();
  const copied = await copyToClipboard(value);
  if (!copied) return;

  copiedItemKey.value = copyKey;
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
  copiedResetTimer = setTimeout(() => {
    if (copiedItemKey.value === copyKey) copiedItemKey.value = null;
  }, 2000);
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    headline?: string;
    statusTag?: string;
    statusTagSize?: TagSize;
    statusTagStatus?: TagStatus;
    showEyebrow?: boolean;
    showStatusTag?: boolean;
    showTabs?: boolean;
    tabLabels?: string[];
    sections?: DetailSectionData[];
    showToolbar?: boolean;
    showToolbarNav?: boolean;
    toolbarCurrent?: string | number;
    toolbarTotal?: string | number;
    /** motion-page 切换 key；省略时用 toolbarCurrent（同序号换条目时需传唯一值）。 */
    toolbarPageKey?: string | number;
    toolbarPrevDisabled?: boolean;
    toolbarNextDisabled?: boolean;
    toolbarTone?: ComboActionPageTone;
    /** Cancel 按钮 tone；默认与 toolbarTone 一致。 */
    toolbarCancelTone?: ButtonTone;
    toolbarDirection?: 'left' | 'right';
    toolbarConfirmLabel?: string;
    toolbarCancelLabel?: string;
  }>(),
  {
    eyebrow: 'Title',
    headline: 'Headline',
    statusTag: 'Tag',
    statusTagSize: 'lg',
    statusTagStatus: 'danger',
    showEyebrow: true,
    showStatusTag: true,
    showTabs: false,
    tabLabels: () => ['Tab', 'Tab', 'Tab', 'Tab', 'Tab'],
    sections: () => createDefaultDetailSections(),
    showToolbar: true,
    showToolbarNav: true,
    toolbarCurrent: 12,
    toolbarTotal: 1000,
    toolbarPrevDisabled: false,
    toolbarNextDisabled: false,
    toolbarTone: 'decor',
    toolbarDirection: 'right',
    toolbarConfirmLabel: 'Confirm',
    toolbarCancelLabel: 'Cancel',
  },
);

const emit = defineEmits<{
  close: [];
  toolbarPrev: [];
  toolbarNext: [];
  toolbarConfirm: [];
  toolbarCancel: [];
  itemValueLinkClick: [key: string];
}>();

function onItemValueLinkClick(
  item: DetailItemData,
  sectionIndex: number,
  itemIndex: number,
  event: MouseEvent,
) {
  event.stopPropagation();
  event.preventDefault();
  emit('itemValueLinkClick', item.key ?? `${sectionIndex}-${itemIndex}`);
}

const toolbarCounterCurrentText = computed(() =>
  formatGroupedNumber(props.toolbarCurrent),
);

const toolbarCounterTotalText = computed(() =>
  formatGroupedNumber(props.toolbarTotal),
);

const resolvedToolbarCancelTone = computed(
  (): ButtonTone => props.toolbarCancelTone ?? props.toolbarTone,
);

const rootRef = ref<HTMLElement | null>(null);

const contentNavDirection = ref<'prev' | 'next'>('next');
const toolbarNavFlash = ref<'prev' | 'next' | null>(null);
let toolbarNavFlashTimer: ReturnType<typeof setTimeout> | undefined;

const TOOLBAR_NAV_FLASH_MS = 300;

const resolvedToolbarPageKey = computed(() =>
  props.toolbarPageKey != null ? String(props.toolbarPageKey) : String(props.toolbarCurrent),
);

const contentPageStackDirection = computed((): 'forward' | 'backward' | 'none' => {
  if (!props.showToolbarNav) return 'none';
  return contentNavDirection.value === 'prev' ? 'backward' : 'forward';
});

function flashToolbarNav(direction: 'prev' | 'next') {
  toolbarNavFlash.value = direction;
  if (toolbarNavFlashTimer) clearTimeout(toolbarNavFlashTimer);
  toolbarNavFlashTimer = setTimeout(() => {
    toolbarNavFlash.value = null;
    toolbarNavFlashTimer = undefined;
  }, TOOLBAR_NAV_FLASH_MS);
}

function onToolbarPrev() {
  contentNavDirection.value = 'prev';
  flashToolbarNav('prev');
  emit('toolbarPrev');
}

function onToolbarNext() {
  contentNavDirection.value = 'next';
  flashToolbarNav('next');
  emit('toolbarNext');
}

function isEditableKeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

function isDetailInOpenPopup(): boolean {
  const root = rootRef.value;
  if (!root) return false;
  return Boolean(root.closest('.eds-popup'));
}

/** Detail 打开时：焦点在 Detail 内、body，或 Popup 外背景（如列表仍持有焦点）时接管方向键。 */
function shouldHandleDetailKeyboard(): boolean {
  const root = rootRef.value;
  if (!root) return false;

  const active = document.activeElement;
  if (active instanceof HTMLElement && isEditableKeyTarget(active)) {
    return false;
  }

  if (active instanceof HTMLElement && root.contains(active)) {
    return true;
  }

  if (active === document.body || active === null) {
    return true;
  }

  if (isDetailInOpenPopup() && active instanceof HTMLElement) {
    const popup = root.closest('.eds-popup');
    if (popup && !popup.contains(active)) {
      return true;
    }
  }

  return false;
}

const DETAIL_KEYBOARD_SCROLL_STEP_PX = 40;

function onWindowDetailKeydown(event: KeyboardEvent) {
  if (!shouldHandleDetailKeyboard()) return;

  if (event.key === 'Escape') {
    if (hasOpenClickAnchoredTooltip()) {
      return;
    }
    event.preventDefault();
    emit('close');
    return;
  }

  if (
    props.showToolbar
    && props.showToolbarNav
    && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
  ) {
    if (event.key === 'ArrowLeft' && !props.toolbarPrevDisabled) {
      event.preventDefault();
      onToolbarPrev();
      return;
    }

    if (event.key === 'ArrowRight' && !props.toolbarNextDisabled) {
      event.preventDefault();
      onToolbarNext();
    }
    return;
  }

  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const scroll = scrollRef.value;
    if (!scroll) return;

    const delta = event.key === 'ArrowUp' ? -DETAIL_KEYBOARD_SCROLL_STEP_PX : DETAIL_KEYBOARD_SCROLL_STEP_PX;
    scroll.scrollBy({ top: delta });
    event.preventDefault();
  }
}

const activeTab = defineModel<number>('activeTab', { default: 0 });

const SCROLL_EDGE_EPSILON = 2;

const scrollRef = ref<HTMLElement | null>(null);
const scrollContentRef = ref<HTMLElement | null>(null);
const scrollFadeTop = ref(false);
const scrollOverflows = ref(false);
let scrollResizeObserver: ResizeObserver | undefined;

function updateScrollState() {
  const element = scrollRef.value;

  if (!element) {
    scrollFadeTop.value = false;
    scrollOverflows.value = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = element;
  const canScroll = scrollHeight - clientHeight > SCROLL_EDGE_EPSILON;
  const hasHiddenContentBelow =
    canScroll && scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_EPSILON;

  /* 底部仍有内容被裁切时显示工具栏分割线；滚到底、底部完全露出时不显示 */
  scrollOverflows.value = hasHiddenContentBelow;
  scrollFadeTop.value = canScroll && scrollTop > SCROLL_EDGE_EPSILON;
}

function scheduleScrollStateUpdate() {
  void nextTick(updateScrollState);
}

function onScroll() {
  updateScrollState();
}

function observeScrollTargets() {
  scrollResizeObserver?.disconnect();
  scrollResizeObserver = new ResizeObserver(() => {
    updateScrollState();
  });
  if (scrollRef.value) {
    scrollResizeObserver.observe(scrollRef.value);
  }
  if (scrollContentRef.value) {
    scrollResizeObserver.observe(scrollContentRef.value);
  }
  updateScrollState();
}

onMounted(() => {
  scheduleScrollStateUpdate();
  observeScrollTargets();
  window.addEventListener('keydown', onWindowDetailKeydown, { capture: true });
});

watch(scrollRef, () => {
  observeScrollTargets();
});

watch(scrollContentRef, () => {
  observeScrollTargets();
});

watch(
  () => [props.toolbarCurrent, resolvedToolbarPageKey.value] as const,
  ([nextCurrent, nextKey], [prevCurrent, prevKey]) => {
    if (!props.showToolbarNav || prevCurrent === undefined) return;

    const currentChanged = nextCurrent !== prevCurrent;
    const keyChanged = nextKey !== prevKey;
    if (!currentChanged && !keyChanged) return;

    if (currentChanged) {
      const nextNum = Number(nextCurrent);
      const prevNum = Number(prevCurrent);
      if (Number.isFinite(nextNum) && Number.isFinite(prevNum) && nextNum !== prevNum) {
        contentNavDirection.value = nextNum > prevNum ? 'next' : 'prev';
      }
    } else if (keyChanged) {
      contentNavDirection.value = 'next';
    }

    scrollRef.value?.scrollTo({ top: 0, behavior: 'instant' });
  },
);

watch(
  () => [
    props.sections,
    props.showEyebrow,
    props.showStatusTag,
    props.showTabs,
    props.headline,
    props.tabLabels,
  ],
  scheduleScrollStateUpdate,
  { deep: true },
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onWindowDetailKeydown, { capture: true });
  scrollResizeObserver?.disconnect();
  if (copiedResetTimer) clearTimeout(copiedResetTimer);
  if (toolbarNavFlashTimer) clearTimeout(toolbarNavFlashTimer);
});
</script>

<template>
  <div
    ref="rootRef"
    class="eds-detail eds-popup-inner-backdrop"
    :class="styles.root"
    data-no-corner-smoothing
  >
    <div :class="styles.systemBarClose">
      <EgIconButton
        shape="square"
        size="md"
        label="关闭"
        motion="asym"
        @click="emit('close')"
      >
        <EgIcon name="eds-close-circle-fill" fit />
      </EgIconButton>
    </div>

    <div
      ref="scrollRef"
      :class="[
        styles.scroll,
        scrollFadeTop && styles.scrollFadeTop,
      ]"
      @scroll="onScroll"
    >
      <div ref="scrollContentRef" :class="styles.scrollContent">
      <div
        :class="[styles.scrollTopEdge, scrollFadeTop && styles.scrollTopEdgeVisible]"
        aria-hidden="true"
      />

      <div
        class="motion-page-stack"
        :class="styles.scrollPageHost"
        :data-page-direction="contentPageStackDirection"
      >
        <Transition name="motion-page">
          <div :key="resolvedToolbarPageKey" :class="['motion-page', styles.scrollBody]">
      <slot name="body">
          <header :class="styles.headline">
            <span v-if="showEyebrow" :class="styles.eyebrow">{{ eyebrow }}</span>
            <div :class="styles.headlineRow">
              <h2 :class="styles.headlineText">{{ headline }}</h2>
              <EgTag
                v-if="showStatusTag && statusTag"
                family="status"
                :status="statusTagStatus"
                :size="statusTagSize"
              >
                {{ statusTag }}
              </EgTag>
            </div>

            <div v-if="showTabs" :class="styles.tabsWrap">
              <EgTabs
                v-model="activeTab"
                :class="styles.tabsHost"
                :labels="tabLabels"
              />
              <EgDivider
                :class="styles.headlineDivider"
                type="page"
                direction="horizontal"
              />
            </div>

            <EgDivider
              v-else
              :class="styles.headlineDivider"
              type="page"
              direction="horizontal"
            />
          </header>

          <div :class="styles.sections">
            <template
              v-for="(section, sectionIndex) in sections"
              :key="section.key ?? sectionIndex"
            >
              <div :class="styles.sectionContent">
                <div v-if="section.title" :class="styles.sectionTitleRow">
                  <span :class="styles.sectionTitle">{{ section.title }}</span>
                </div>

                <div :class="styles.itemList">
                  <div
                    v-for="(item, itemIndex) in section.items"
                    :key="item.key ?? itemIndex"
                    :class="styles.item"
                  >
                  <div :class="styles.itemRow">
                    <div :class="styles.itemTitle">
                      <EgIcon
                        v-if="itemShowsTitleIcon(item)"
                        :class="styles.itemTitleIcon"
                        :name="item.titleIcon!"
                        size="sm"
                        fit
                      />
                      <span :class="styles.itemTitleText">{{ item.title }}</span>
                    </div>
                    <div :class="styles.itemValue">
                      <EgTag
                        v-if="item.tag && item.tagBeforeValue"
                        :family="item.tagFamily ?? 'system'"
                        :status="item.tagStatus"
                        :system-type="item.tagSystemType ?? 'stroke-subtle'"
                        size="sm"
                      >
                        {{ item.tag }}
                      </EgTag>
                      <EgCrypto
                        v-if="itemShowsValueCrypto(item) && itemValueCryptoName(item)"
                        :class="styles.itemValueCrypto"
                        :name="itemValueCryptoName(item)!"
                        size="md"
                        fit
                      />
                      <EgAvatar
                        v-else-if="itemShowsValueAvatar(item)"
                        size="sm"
                        :name="itemValueAvatarName(item)"
                      />
                      <span
                        v-if="!item.valueTagOnly && item.value"
                        :class="[
                          styles.itemValueText,
                          !itemShowsValueAvatar(item) && styles.itemValueTextNowrap,
                        ]"
                      >
                        {{ item.value }}
                      </span>
                      <EgTag
                        v-if="item.tag && !item.tagBeforeValue"
                        :family="item.tagFamily ?? 'system'"
                        :status="item.tagStatus"
                        :system-type="item.tagSystemType ?? 'stroke-subtle'"
                        size="sm"
                      >
                        {{ item.tag }}
                      </EgTag>
                      <div
                        v-if="itemHasValueTrailingActions(item)"
                        :class="styles.itemValueTrailing"
                      >
                        <EgLink
                          v-if="item.showValueLink"
                          size="sm"
                          tone="brand"
                          @click="onItemValueLinkClick(item, sectionIndex, itemIndex, $event)"
                        >
                          {{ item.valueLinkLabel ?? 'Edit' }}
                        </EgLink>
                        <span
                          v-if="item.showValueCopy"
                          :class="[
                            cryptoComboStyles.menuCopyButton,
                            copiedItemKey === itemCopyKey(sectionIndex, itemIndex, item)
                              && cryptoComboStyles.menuCopyButtonCopied,
                          ]"
                          @click.stop
                        >
                          <EgIconButton
                            shape="square"
                            size="xs"
                            label="复制"
                            @click="onCopyItemValue(itemCopyKey(sectionIndex, itemIndex, item), item.value, $event)"
                          >
                            <EgIcon
                              :name="
                                copiedItemKey === itemCopyKey(sectionIndex, itemIndex, item)
                                  ? 'eds-enable-fill'
                                  : 'eds-copy'
                              "
                              fit
                            />
                          </EgIconButton>
                        </span>
                        <EgIconButton
                          v-if="item.showValueAddressBook"
                          shape="square"
                          size="xs"
                          label="添加到地址簿"
                        >
                          <EgIcon name="eds-associates" fit />
                        </EgIconButton>
                        <EgIconButton
                          v-if="item.showValueAmlSearch"
                          shape="square"
                          size="xs"
                          label="AML 查询"
                        >
                          <EgIcon name="eds-aml-search" fit />
                        </EgIconButton>
                        <EgIconButton
                          v-if="item.showValueBrowser"
                          shape="square"
                          size="xs"
                          label="区块浏览器"
                        >
                          <EgIcon name="eds-earth" fit />
                        </EgIconButton>
                      </div>
                    </div>
                  </div>
                  <EgDivider
                    v-if="item.dashed"
                    :class="styles.itemDashedDivider"
                    type="page"
                    direction="horizontal"
                  />
                  </div>
                </div>

                <div v-if="section.showCollapse" :class="styles.collapseRow">
                  <EgLink size="sm" tone="brand">
                    {{ section.collapseLabel ?? 'Connect to EDS' }}
                  </EgLink>
                </div>
              </div>

              <EgDivider
                v-if="section.showDivider && sectionIndex < sections.length - 1"
                :class="styles.sectionDivider"
                type="page"
                direction="horizontal"
              />
            </template>
          </div>
        </slot>

        <div v-if="$slots.append" :class="styles.append">
          <slot name="append" />
        </div>
          </div>
        </Transition>
      </div>
      </div>

      <footer
        v-if="showToolbar || $slots.toolbar"
        :class="[
          styles.toolbar,
          chromeScrimStyles.root,
          scrollOverflows && chromeScrimStyles.active,
        ]"
      >
        <div :class="chromeScrimStyles.content">
          <slot name="toolbar">
            <div
              v-if="showToolbar"
              :class="[
                styles.toolbarPage,
                !showToolbarNav && toolbarDirection === 'left' && styles.toolbarPageAlignStart,
                !showToolbarNav && toolbarDirection === 'right' && styles.toolbarPageAlignEnd,
              ]"
            >
              <EgDivider
                :class="[
                  comboActionStyles.divider,
                  comboActionStyles.dividerAnimated,
                  !scrollOverflows && comboActionStyles.dividerAnimatedHidden,
                ]"
                type="module"
                direction="horizontal"
                :hide="!scrollOverflows"
              />
              <div :class="styles.toolbarBar">
                <div v-if="showToolbarNav" :class="styles.toolbarStart">
                  <div :class="styles.toolbarNav">
                    <EgPaginationItem
                      kind="borderArrow"
                      label="上一项"
                      :disabled="toolbarPrevDisabled"
                      :visual-active="toolbarNavFlash === 'prev'"
                      @click="onToolbarPrev"
                    >
                      <EgIcon name="eds-arrow-left" fit />
                    </EgPaginationItem>
                    <EgPaginationItem
                      kind="borderArrow"
                      label="下一项"
                      :disabled="toolbarNextDisabled"
                      :visual-active="toolbarNavFlash === 'next'"
                      @click="onToolbarNext"
                    >
                      <EgIcon name="eds-arrow-right" fit />
                    </EgPaginationItem>
                  </div>
                </div>
                <span v-if="showToolbarNav" :class="styles.toolbarCounter">
                  <span :class="styles.toolbarCounterCurrent">{{ toolbarCounterCurrentText }}</span>
                  <span :class="styles.toolbarCounterRest">/ {{ toolbarCounterTotalText }}</span>
                </span>
                <div
                  :class="[
                    styles.toolbarActions,
                    !showToolbarNav && toolbarDirection === 'left' && styles.toolbarActionsLeft,
                    !showToolbarNav && toolbarDirection === 'right' && styles.toolbarActionsRight,
                    showToolbarNav && styles.toolbarActionsRight,
                  ]"
                >
                  <slot name="toolbar-actions">
                    <EgButton
                      :tone="resolvedToolbarCancelTone"
                      variant="text"
                      size="md"
                      @click="emit('toolbarCancel')"
                    >
                      {{ toolbarCancelLabel }}
                    </EgButton>
                    <EgButton
                      :tone="toolbarTone"
                      variant="solid"
                      size="md"
                      @click="emit('toolbarConfirm')"
                    >
                      {{ toolbarConfirmLabel }}
                    </EgButton>
                  </slot>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </footer>
    </div>
  </div>
</template>
