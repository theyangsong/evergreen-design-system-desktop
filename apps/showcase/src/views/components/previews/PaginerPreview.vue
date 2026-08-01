<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { EgIcon, EgPaginer, EgPaginationItem } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import styles from './InputPreview.module.css';
import {
  ORGANISM_IMPORT,
  paginerCustomizeControls,
  paginerCustomizeDefaults,
  paginerEventRows,
  paginerPropRows,
  paginerPaginationCustomizeControls,
  paginerSettingsCustomizeControls,
  paginerSlotRows,
  paginerStatisticsCustomizeControls,
} from './organismTemplateDocData';
import {
  paginerPaginationNestedRowColumns,
  readPaginerPaginationItem,
  type PaginerPaginationSlotKey,
} from './buttonDocCustomize';
import {
  buildManyPageItems,
  computeManyNextKeepWindow,
  computeManyPageClickKeepWindow,
  computeManyPrevKeepWindow,
  defaultManyWindowStart,
  isManyPageItemSelected,
  PAGINER_SHOWCASE_MANY_LAST_PAGE,
  type PaginerManyPageItem,
} from './paginerManyPagination';

const customize = reactive({ ...paginerCustomizeDefaults });

const isManyDataVolume = computed(() => customize.dataVolume === 'many');

const MANY_FIRST_PAGE = 1;
const MANY_LAST_PAGE = PAGINER_SHOWCASE_MANY_LAST_PAGE;

type ManyPageItem = PaginerManyPageItem;

function parseCurrentPageNumber(): number {
  const page = Number.parseInt(String(customize.currentPage), 10);
  return Number.isFinite(page) ? page : MANY_FIRST_PAGE;
}

function setCurrentPage(page: number) {
  customize.currentPage = String(
    Math.min(MANY_LAST_PAGE, Math.max(MANY_FIRST_PAGE, page)),
  );
}

const manyWindowStart = ref(defaultManyWindowStart(parseCurrentPageNumber(), MANY_LAST_PAGE));
const previousManyPage = ref(parseCurrentPageNumber());
let navigatingManyPage = false;

function syncManyWindowStart(current: number, keepWindow: boolean) {
  if (keepWindow) return;
  manyWindowStart.value = defaultManyWindowStart(current, MANY_LAST_PAGE);
}

function navigateManyPage(page: number, keepWindow = false) {
  navigatingManyPage = true;
  setCurrentPage(page);
  syncManyWindowStart(parseCurrentPageNumber(), keepWindow);
  previousManyPage.value = parseCurrentPageNumber();
  navigatingManyPage = false;
}

watch(
  () => customize.currentPage,
  () => {
    if (navigatingManyPage) return;
    const next = parseCurrentPageNumber();
    if (next === previousManyPage.value) return;
    manyWindowStart.value = defaultManyWindowStart(next, MANY_LAST_PAGE);
    previousManyPage.value = next;
  },
);

watch(
  () => customize.dataVolume,
  () => {
    manyWindowStart.value = defaultManyWindowStart(parseCurrentPageNumber(), MANY_LAST_PAGE);
    previousManyPage.value = parseCurrentPageNumber();
  },
);

const isFirstPage = computed(() => parseCurrentPageNumber() <= MANY_FIRST_PAGE);
const isLastPage = computed(() => parseCurrentPageNumber() >= MANY_LAST_PAGE);

const prevNavDisabled = computed(() => !isManyDataVolume.value || isFirstPage.value);
const nextNavDisabled = computed(() => !isManyDataVolume.value || isLastPage.value);

const manyPageItems = computed(() =>
  buildManyPageItems(parseCurrentPageNumber(), manyWindowStart.value, MANY_LAST_PAGE),
);

function parseLevelLabels(raw: unknown): string[] {
  const parts = String(raw ?? '')
    .split(/[,，\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : ['20', '50', '100'];
}

const settingsLevelLabels = computed(() => parseLevelLabels(customize.settingsLevelLabels));

const settingsLevelIndex = ref(1);
const settingsJumpValue = ref('');

watch(settingsLevelLabels, (labels) => {
  if (settingsLevelIndex.value >= labels.length) {
    settingsLevelIndex.value = Math.max(0, labels.length - 1);
  }
});

function parseStatisticsCount(state: typeof customize): number {
  const count = Number.parseInt(String(state.statisticsCount ?? '2'), 10);
  return Number.isFinite(count) ? Math.min(5, Math.max(1, count)) : 2;
}

const statisticsItems = computed(() => {
  const count = parseStatisticsCount(customize);
  return Array.from({ length: count }, (_, index) => {
    const itemIndex = index + 1;
    const textKey = `stat${itemIndex}Text` as keyof typeof customize;
    const numberKey = `stat${itemIndex}Number` as keyof typeof customize;
    return {
      text: String(customize[textKey] ?? 'Title'),
      number: String(customize[numberKey] ?? '0'),
    };
  });
});

const scrollbarProgress = computed(() => {
  const value = Number.parseFloat(String(customize.scrollbarProgress));
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.35;
});

function isManyPageSelected(item: ManyPageItem, index: number): boolean {
  return isManyPageItemSelected(
    item,
    index,
    parseCurrentPageNumber(),
    MANY_LAST_PAGE,
    manyPageItems.value,
  );
}

function onManyPageItemClick(item: ManyPageItem) {
  if (!isManyDataVolume.value || item.kind !== 'page') return;
  const current = parseCurrentPageNumber();
  if (item.page === current) return;

  navigateManyPage(
    item.page,
    computeManyPageClickKeepWindow(current, item.page, manyWindowStart.value),
  );
}

function goFirstPage() {
  if (prevNavDisabled.value) return;
  navigateManyPage(MANY_FIRST_PAGE);
}

function goPrevPage() {
  if (prevNavDisabled.value) return;
  const current = parseCurrentPageNumber();
  if (current <= 3) {
    navigateManyPage(current - 1);
    return;
  }

  navigateManyPage(
    current - 1,
    computeManyPrevKeepWindow(current, manyWindowStart.value),
  );
}

function goNextPage() {
  if (nextNavDisabled.value) return;
  const current = parseCurrentPageNumber();
  if (current <= 3) {
    navigateManyPage(current + 1);
    return;
  }

  navigateManyPage(
    current + 1,
    computeManyNextKeepWindow(current, manyWindowStart.value),
  );
}

function goLastPage() {
  if (nextNavDisabled.value) return;
  navigateManyPage(MANY_LAST_PAGE);
}

function onSettingsJump(value: string) {
  const page = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(page)) return;
  const clamped = Math.min(MANY_LAST_PAGE, Math.max(MANY_FIRST_PAGE, page));
  navigateManyPage(clamped);
}

function trackPaginerPagination(prefix: PaginerPaginationSlotKey) {
  void customize[`${prefix}Kind` as keyof typeof customize];
  void customize[`${prefix}Tone` as keyof typeof customize];
  void customize[`${prefix}Label` as keyof typeof customize];
  void customize[`${prefix}Disabled` as keyof typeof customize];
}

function paginerPagination(prefix: PaginerPaginationSlotKey) {
  trackPaginerPagination(prefix);
  return readPaginerPaginationItem(customize, prefix);
}

const firstPagination = computed(() => paginerPagination('first'));
const prevPagination = computed(() => paginerPagination('prev'));
const pagePagination = computed(() => paginerPagination('page'));
const nextPagination = computed(() => paginerPagination('next'));
const lastPagination = computed(() => paginerPagination('last'));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Paginer"
      :show-doc-title="false"
      component-tag="EgPaginer"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="paginerCustomizeControls"
      :customize-defaults="paginerCustomizeDefaults"
      :prop-rows="paginerPropRows"
      :event-rows="paginerEventRows"
      :slot-rows="paginerSlotRows"
      props-section-id="paginer-props"
    >
      <template #preview>
        <EgPaginer
          class="desktopTokens"
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-scrollbar="Boolean(customize.showScrollbar)"
          :show-statistics="Boolean(customize.showStatistics)"
          :statistics-collapse="Boolean(customize.statisticsCollapse)"
          :scrollbar-progress="scrollbarProgress"
          :statistics-items="statisticsItems"
          :settings-level-label="String(customize.settingsLevelLabel)"
          :settings-jump-label="String(customize.settingsJumpLabel)"
          :settings-level-labels="settingsLevelLabels"
          @settings-jump="onSettingsJump"
        >
          <EgPaginationItem
            :kind="firstPagination.kind"
            :tone="firstPagination.tone"
            :disabled="prevNavDisabled || firstPagination.disabled"
            @click="goFirstPage"
          >
            <EgIcon name="eds-arrow-go-first" fit />
          </EgPaginationItem>
          <EgPaginationItem
            :kind="prevPagination.kind"
            :tone="prevPagination.tone"
            :disabled="prevNavDisabled || prevPagination.disabled"
            @click="goPrevPage"
          >
            <EgIcon name="eds-arrow-left-mini-ios" fit />
          </EgPaginationItem>

          <template v-if="!isManyDataVolume">
            <EgPaginationItem
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              selected
              :disabled="pagePagination.disabled"
              :label="String(customize.currentPage)"
            />
          </template>
          <template v-else>
            <EgPaginationItem
              v-for="(item, index) in manyPageItems"
              :key="`${item.kind}-${item.label}-${index}`"
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              :interactive="item.kind !== 'ellipsis'"
              :selected="isManyPageSelected(item, index)"
              :disabled="pagePagination.disabled"
              :label="item.label"
              @click="onManyPageItemClick(item)"
            />
          </template>

          <EgPaginationItem
            :kind="nextPagination.kind"
            :tone="nextPagination.tone"
            :disabled="nextNavDisabled || nextPagination.disabled"
            @click="goNextPage"
          >
            <EgIcon name="eds-arrow-right-mini-ios" fit />
          </EgPaginationItem>
          <EgPaginationItem
            :kind="lastPagination.kind"
            :tone="lastPagination.tone"
            :disabled="nextNavDisabled || lastPagination.disabled"
            @click="goLastPage"
          >
            <EgIcon name="eds-arrow-go-last" fit />
          </EgPaginationItem>
        </EgPaginer>
      </template>

      <template #customize-after>
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          :row-columns="paginerPaginationNestedRowColumns"
          title="分页 · EgPaginationItem"
          :controls="paginerPaginationCustomizeControls"
        />
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          title="下拉设置"
          :controls="paginerSettingsCustomizeControls"
        />
        <CustomizePanel
          v-if="customize.showStatistics"
          v-model="customize"
          nested
          sequential
          title="数据统计"
          :controls="paginerStatisticsCustomizeControls"
        />
      </template>
    </ComponentDocLayout>
  </div>
</template>
