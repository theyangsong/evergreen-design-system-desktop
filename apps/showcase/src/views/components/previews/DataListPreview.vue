<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import {
  EgCrypto,
  EgDivider,
  EgDataList,
  EgDataListColumn,
  EgIcon,
  EgIconButtonPro,
  EgPaginer,
  EgPaginationItem,
  EgLayout,
  EgSkid,
  EgToolBar,
  SKID_PUSH_TRANSITION_MS,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import shared from '@/views/shared/showcase.module.css';
import styles from './InputPreview.module.css';
import previewStyles from './DataListPreview.module.css';
import {
  buildDataListPageUsageSnippet,
  buildDataListStatisticsItems,
  buildFigmaDataListRows,
  DATA_LIST_FIGMA_COLUMNS,
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  DATA_LIST_FIGMA_PAGINER,
  DATA_LIST_FIGMA_TOOLBAR,
  DATA_LIST_PREVIEW_CRYPTO,
  parseDataListColumnHeight,
  parseDataListRowCount,
  readDataListColumnSettings,
  DATA_LIST_PREVIEW_COLUMN_COUNT,
} from './dataListPagePreviewData';
import {
  ORGANISM_IMPORT,
  dataListColumnPropRows,
  dataListColumnSettingControls,
  dataListCustomizeControls,
  dataListCustomizeDefaults,
  dataListPaginationCustomizeControls,
  dataListPropRows,
  dataListSlotRows,
  dataListToolbarCustomizeControls,
  paginerStatisticsCustomizeControls,
} from './organismTemplateDocData';
import {
  buildManyPageItems,
  computeManyNextKeepWindow,
  computeManyPageClickKeepWindow,
  computeManyPrevKeepWindow,
  defaultManyWindowStart,
  isManyPageItemSelected,
  type PaginerManyPageItem,
} from './paginerManyPagination';
import {
  readIconButtonProSingleItem,
  iconButtonProNestedRowColumns,
  paginerPaginationNestedRowColumns,
  readPaginerPaginationItem,
  type IconButtonProZoneKeyPrefix,
  type PaginerPaginationSlotKey,
} from './buttonDocCustomize';

const customize = reactive({ ...dataListCustomizeDefaults });

const allDataList = computed(() =>
  buildFigmaDataListRows(Boolean(customize.empty), parseDataListRowCount(customize)),
);

const columnHeight = computed(() => parseDataListColumnHeight(customize));

const showBatch = computed(() => Boolean(customize.showBatch));
const showExport = computed(() => Boolean(customize.showExport));
const showBack = computed(() => Boolean(customize.showBack));
const showStatistics = computed(() => Boolean(customize.showStatistics));
const showToolBarSection = computed(() => showBatch.value);
const skidOpen = computed(() => Boolean(customize.skidOpen));
const skidContentLocked = ref(Boolean(customize.skidOpen));
let skidContentReleaseTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => customize.skidOpen,
  (open) => {
    if (skidContentReleaseTimer !== undefined) {
      clearTimeout(skidContentReleaseTimer);
      skidContentReleaseTimer = undefined;
    }

    if (open) {
      skidContentLocked.value = true;
      return;
    }

    skidContentReleaseTimer = window.setTimeout(() => {
      if (!customize.skidOpen) {
        skidContentLocked.value = false;
      }
      skidContentReleaseTimer = undefined;
    }, SKID_PUSH_TRANSITION_MS);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (skidContentReleaseTimer !== undefined) clearTimeout(skidContentReleaseTimer);
});

const showToolBarOperation = computed(
  () => DATA_LIST_FIGMA_TOOLBAR.showOperation && !skidContentLocked.value,
);
const showPaginerStatistics = computed(() => showStatistics.value && !skidContentLocked.value);

function trackSingleIconButton(prefix: IconButtonProZoneKeyPrefix) {
  void customize[`${prefix}Label` as keyof typeof customize];
  void customize[`${prefix}Icon` as keyof typeof customize];
  void customize[`${prefix}ShowBadge` as keyof typeof customize];
  void customize[`${prefix}Badge` as keyof typeof customize];
  void customize[`${prefix}ShowReddot` as keyof typeof customize];
  void customize[`${prefix}Disabled` as keyof typeof customize];
}

const batchButton = computed(() => {
  trackSingleIconButton('batch');
  return readIconButtonProSingleItem(customize, 'batch');
});

const filterButton = computed(() => {
  trackSingleIconButton('filter');
  return readIconButtonProSingleItem(customize, 'filter');
});

const refreshButton = computed(() => {
  trackSingleIconButton('refresh');
  return readIconButtonProSingleItem(customize, 'refresh');
});

const exportButton = computed(() => {
  trackSingleIconButton('export');
  return readIconButtonProSingleItem(customize, 'export');
});

type ToolbarActionButton = {
  key: 'filter' | 'refresh' | 'export';
  item: ReturnType<typeof readIconButtonProSingleItem>;
};

const toolbarActionButtons = computed((): ToolbarActionButton[] => {
  trackSingleIconButton('filter');
  trackSingleIconButton('refresh');
  if (showExport.value) trackSingleIconButton('export');

  const buttons: ToolbarActionButton[] = [
    { key: 'filter', item: filterButton.value },
    { key: 'refresh', item: refreshButton.value },
  ];
  if (showExport.value) {
    buttons.push({ key: 'export', item: exportButton.value });
  }
  return buttons;
});

const statisticsItems = computed(() => buildDataListStatisticsItems(customize));

function trackColumnSettings() {
  void customize.columnSettingIndex;
  for (let index = 1; index <= DATA_LIST_PREVIEW_COLUMN_COUNT; index += 1) {
    void customize[`columnMinWidth${index}` as keyof typeof customize];
    void customize[`columnAlign${index}` as keyof typeof customize];
    void customize[`columnSortable${index}` as keyof typeof customize];
  }
}

const previewColumnSettings = computed(() => {
  trackColumnSettings();
  return readDataListColumnSettings(customize);
});

const settingsLevelIndex = ref(0);
const settingsJumpValue = ref('');
const currentPage = ref(1);

const pageSize = computed(() => {
  const label = DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS[settingsLevelIndex.value]
    ?? DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS[0];
  const parsed = Number.parseInt(label, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
});

const totalRowCount = computed(() => allDataList.value.length);

const totalPages = computed(() => {
  if (totalRowCount.value === 0) return 1;
  return Math.ceil(totalRowCount.value / pageSize.value);
});

const paginatedDataList = computed(() => {
  if (totalRowCount.value === 0) return [];
  const start = (currentPage.value - 1) * pageSize.value;
  return allDataList.value.slice(start, start + pageSize.value);
});

const isManyPagination = computed(() => totalPages.value > 1);

const manyWindowStart = ref(defaultManyWindowStart(currentPage.value, totalPages.value));
const previousManyPage = ref(currentPage.value);
let navigatingManyPage = false;

const manyPageItems = computed(() =>
  buildManyPageItems(currentPage.value, manyWindowStart.value, totalPages.value),
);

const isFirstPage = computed(() => currentPage.value <= 1);
const isLastPage = computed(() => currentPage.value >= totalPages.value);
const prevNavDisabled = computed(() => totalRowCount.value === 0 || isFirstPage.value);
const nextNavDisabled = computed(() => totalRowCount.value === 0 || isLastPage.value);
const paginationLocked = computed(() => Boolean(customize.selectMode));

const dataListBatchActions = [{ key: 'archive', label: 'Archive' }] as const;

const dataListMoreActions = [
  { key: 'copy', label: 'Copy' },
  { key: 'delete', label: 'Delete', danger: true },
] as const;

async function onBatchAction(_key: string, _rows: unknown) {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1200);
  });
}

function clampPage(page: number) {
  return Math.min(totalPages.value, Math.max(1, page));
}

function syncManyWindowStart(page: number, keepWindow: boolean) {
  if (keepWindow) return;
  manyWindowStart.value = defaultManyWindowStart(page, totalPages.value);
}

function navigateManyPage(page: number, keepWindow = false) {
  navigatingManyPage = true;
  currentPage.value = clampPage(page);
  syncManyWindowStart(currentPage.value, keepWindow);
  previousManyPage.value = currentPage.value;
  navigatingManyPage = false;
}

function goFirstPage() {
  if (prevNavDisabled.value) return;
  navigateManyPage(1);
}

function goPrevPage() {
  if (prevNavDisabled.value) return;
  const page = currentPage.value;
  if (page <= 3) {
    navigateManyPage(page - 1);
    return;
  }
  navigateManyPage(page - 1, computeManyPrevKeepWindow(page, manyWindowStart.value));
}

function goNextPage() {
  if (nextNavDisabled.value) return;
  const page = currentPage.value;
  if (page <= 3) {
    navigateManyPage(page + 1);
    return;
  }
  navigateManyPage(page + 1, computeManyNextKeepWindow(page, manyWindowStart.value));
}

function goLastPage() {
  if (nextNavDisabled.value) return;
  navigateManyPage(totalPages.value);
}

function onManyPageItemClick(item: PaginerManyPageItem) {
  if (item.kind !== 'page') return;
  const page = currentPage.value;
  if (item.page === page) return;
  navigateManyPage(
    item.page,
    computeManyPageClickKeepWindow(page, item.page, manyWindowStart.value),
  );
}

function isManyPageSelected(item: PaginerManyPageItem, index: number): boolean {
  return isManyPageItemSelected(
    item,
    index,
    currentPage.value,
    totalPages.value,
    manyPageItems.value,
  );
}

function onSettingsJump(value: string) {
  const page = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(page)) return;
  navigateManyPage(page);
}

function trackDataListPagination(prefix: PaginerPaginationSlotKey) {
  void customize[`${prefix}Kind` as keyof typeof customize];
  void customize[`${prefix}Tone` as keyof typeof customize];
  void customize[`${prefix}Label` as keyof typeof customize];
  void customize[`${prefix}Disabled` as keyof typeof customize];
}

function dataListPagination(prefix: PaginerPaginationSlotKey) {
  trackDataListPagination(prefix);
  return readPaginerPaginationItem(customize, prefix);
}

const firstPagination = computed(() => dataListPagination('first'));
const prevPagination = computed(() => dataListPagination('prev'));
const pagePagination = computed(() => dataListPagination('page'));
const nextPagination = computed(() => dataListPagination('next'));
const lastPagination = computed(() => dataListPagination('last'));

watch(pageSize, () => {
  navigateManyPage(1);
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    navigateManyPage(Math.max(1, pages));
  } else {
    manyWindowStart.value = defaultManyWindowStart(currentPage.value, pages);
    previousManyPage.value = currentPage.value;
  }
});

watch(currentPage, (page) => {
  if (navigatingManyPage) return;
  if (page === previousManyPage.value) return;
  manyWindowStart.value = defaultManyWindowStart(page, totalPages.value);
  previousManyPage.value = page;
});

watch(
  () => customize.empty,
  (empty) => {
    if (empty) navigateManyPage(1);
  },
);

watch(
  () => customize.showBatch,
  (enabled) => {
    if (!enabled) customize.selectMode = false;
  },
);


const usageSnippet = computed(() => buildDataListPageUsageSnippet(customize));

function onBatchClick() {
  customize.selectMode = !customize.selectMode;
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;

function onRefreshClick() {
  if (refreshTimer !== undefined) {
    clearTimeout(refreshTimer);
    refreshTimer = undefined;
  }
  customize.loading = true;
  refreshTimer = window.setTimeout(() => {
    customize.loading = false;
    refreshTimer = undefined;
  }, 2000);
}

function onExportClick() {
  customize.skidOpen = true;
}

function onSkidClose() {
  customize.skidOpen = false;
}

function onToolbarActionClick(key: ToolbarActionButton['key']) {
  if (key === 'refresh') {
    onRefreshClick();
    return;
  }
  if (key === 'export') {
    onExportClick();
  }
}

const eventRows = [
  {
    name: 'update:select-mode',
    type: '(enabled: boolean) => void',
    defaultValue: '-',
    description: '多选模式开关；Batch Bar 关闭时同步为 false。',
  },
  { name: 'row-click', type: '(row) => void', defaultValue: '-', description: '非多选时点击行。' },
  {
    name: 'update:selected-list',
    type: '(rows) => void',
    defaultValue: '-',
    description: '多选列表变更（含 _index）。',
  },
  {
    name: 'selected-change',
    type: '(rows) => void',
    defaultValue: '-',
    description: '同 update:selected-list。',
  },
];
</script>

<template>
  <div :class="[styles.previewPage, previewStyles.docPreviewHeight]">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Data List"
      :show-doc-title="false"
      component-tag="EgDataList"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="dataListCustomizeControls"
      :customize-defaults="dataListCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="dataListPropRows"
      :event-rows="eventRows"
      :slot-rows="dataListSlotRows"
      props-section-id="data-list-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            previewStyles.pageShell,
            customize.pageHeightMode === 'adaptive'
              ? previewStyles.pageShellAdaptive
              : previewStyles.pageShellFixed,
          ]"
        >
          <EgLayout type="empty" :show-skid="skidOpen" show-toolbar show-paginer>
            <template #toolbar>
              <EgToolBar
                :title="DATA_LIST_FIGMA_TOOLBAR.title"
                :show-back="showBack"
                :show-operation="showToolBarOperation"
                :show-divider="DATA_LIST_FIGMA_TOOLBAR.showDivider"
                :show-section="showToolBarSection"
              >
                <template v-if="showBatch" #functional>
                  <EgIconButtonPro
                    :label="batchButton.label"
                    :badge="batchButton.badge"
                    :show-badge="batchButton.showBadge"
                    :show-reddot="batchButton.showReddot"
                    :disabled="skidContentLocked || batchButton.disabled"
                    @click="onBatchClick"
                  >
                    <EgIcon :name="batchButton.icon" size="sm" />
                  </EgIconButtonPro>
                </template>
                <template v-if="showToolBarSection" #section>
                  <EgIconButtonPro
                    v-for="button in toolbarActionButtons"
                    :key="button.key"
                    :label="button.item.label"
                    :badge="button.item.badge"
                    :show-badge="button.item.showBadge"
                    :show-reddot="button.item.showReddot"
                    :disabled="skidContentLocked || button.item.disabled"
                    @click="onToolbarActionClick(button.key)"
                  >
                    <EgIcon :name="button.item.icon" size="sm" />
                  </EgIconButtonPro>
                </template>
                <template v-else #functional>
                  <EgIconButtonPro
                    v-for="button in toolbarActionButtons"
                    :key="`functional-${button.key}`"
                    :label="button.item.label"
                    :badge="button.item.badge"
                    :show-badge="button.item.showBadge"
                    :show-reddot="button.item.showReddot"
                    :disabled="skidContentLocked || button.item.disabled"
                    @click="onToolbarActionClick(button.key)"
                  >
                    <EgIcon :name="button.item.icon" size="sm" />
                  </EgIconButtonPro>
                </template>
              </EgToolBar>
            </template>

            <div :class="previewStyles.listRegion">
            <EgDataList
              v-model:select-mode="customize.selectMode"
              :data-list="paginatedDataList"
              :header-height="DATA_LIST_FIGMA_HEADER_HEIGHT"
              :column-height="columnHeight"
              :loading="Boolean(customize.loading)"
              :initing="Boolean(customize.initing)"
              :batch-actions="[...dataListBatchActions]"
              :on-batch-action="onBatchAction"
              :primary-action="{ label: 'Action' }"
              :more-actions="[...dataListMoreActions]"
            >
              <EgDataListColumn
                prop="primary"
                :label="DATA_LIST_FIGMA_COLUMNS.combo.label"
                :min-width="previewColumnSettings[0].minWidth"
                :align="previewColumnSettings[0].align"
                :sortable="previewColumnSettings[0].sortable"
              >
                <template #header>
                  <div :class="previewStyles.comboHeader">
                    <span>Header</span>
                    <EgDivider
                      type="page"
                      direction="vertical"
                      :class="previewStyles.comboHeaderDivider"
                    />
                    <span>Header</span>
                  </div>
                </template>
                <template #default>
                  <div
                    v-if="previewColumnSettings[0].dataSource === 'currency'"
                    :class="previewStyles.fieldItemCurrency"
                  >
                    <EgCrypto :name="DATA_LIST_PREVIEW_CRYPTO" size="sm" />
                    <span :class="previewStyles.fieldBarSecondary" aria-hidden="true" />
                  </div>
                  <div v-else :class="previewStyles.fieldItem">
                    <span :class="previewStyles.fieldBarPrimary" aria-hidden="true" />
                    <span :class="previewStyles.fieldBarSecondary" aria-hidden="true" />
                  </div>
                </template>
              </EgDataListColumn>

              <EgDataListColumn
                prop="meta"
                :label="DATA_LIST_FIGMA_COLUMNS.sortable.label"
                :min-width="previewColumnSettings[1].minWidth"
                :align="previewColumnSettings[1].align"
                :sortable="previewColumnSettings[1].sortable"
              >
                <template #default>
                  <EgCrypto
                    v-if="previewColumnSettings[1].dataSource === 'currency'"
                    :name="DATA_LIST_PREVIEW_CRYPTO"
                    size="sm"
                  />
                  <span v-else :class="previewStyles.cellBar" aria-hidden="true" />
                </template>
              </EgDataListColumn>

              <EgDataListColumn
                prop="meta2"
                :label="DATA_LIST_FIGMA_COLUMNS.plain.label"
                :min-width="previewColumnSettings[2].minWidth"
                :align="previewColumnSettings[2].align"
                :sortable="previewColumnSettings[2].sortable"
              >
                <template #default>
                  <EgCrypto
                    v-if="previewColumnSettings[2].dataSource === 'currency'"
                    :name="DATA_LIST_PREVIEW_CRYPTO"
                    size="sm"
                  />
                  <span v-else :class="previewStyles.cellBar" aria-hidden="true" />
                </template>
              </EgDataListColumn>

              <EgDataListColumn
                prop="actions"
                :label="DATA_LIST_FIGMA_COLUMNS.actions.label"
                :min-width="previewColumnSettings[3].minWidth"
                :align="previewColumnSettings[3].align"
                :sortable="previewColumnSettings[3].sortable"
                is-action
              />
            </EgDataList>
            </div>

            <template #paginer>
              <EgPaginer
            v-model:settings-level-index="settingsLevelIndex"
            v-model:settings-jump-value="settingsJumpValue"
            :show-statistics="showPaginerStatistics"
            :statistics-collapse="Boolean(customize.statisticsCollapse)"
            :statistics-items="statisticsItems"
            :data-volume-total="DATA_LIST_FIGMA_PAGINER.dataVolumeTotal"
            :data-volume-count="String(totalRowCount)"
            :data-volume-results="DATA_LIST_FIGMA_PAGINER.dataVolumeResults"
            :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
            @settings-jump="onSettingsJump"
          >
            <EgPaginationItem
              :kind="firstPagination.kind"
              :tone="firstPagination.tone"
              :disabled="paginationLocked || prevNavDisabled || firstPagination.disabled"
              @click="goFirstPage"
            >
              <EgIcon name="eds-arrow-go-first" fit />
            </EgPaginationItem>
            <EgPaginationItem
              :kind="prevPagination.kind"
              :tone="prevPagination.tone"
              :disabled="paginationLocked || prevNavDisabled || prevPagination.disabled"
              @click="goPrevPage"
            >
              <EgIcon name="eds-arrow-left-mini-ios" fit />
            </EgPaginationItem>
            <template v-if="!isManyPagination">
              <EgPaginationItem
                :kind="pagePagination.kind"
                :tone="pagePagination.tone"
                selected
                :disabled="paginationLocked || pagePagination.disabled"
                :label="String(currentPage)"
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
                :disabled="paginationLocked || pagePagination.disabled"
                :label="item.label"
                @click="onManyPageItemClick(item)"
              />
            </template>
            <EgPaginationItem
              :kind="nextPagination.kind"
              :tone="nextPagination.tone"
              :disabled="paginationLocked || nextNavDisabled || nextPagination.disabled"
              @click="goNextPage"
            >
              <EgIcon name="eds-arrow-right-mini-ios" fit />
            </EgPaginationItem>
            <EgPaginationItem
              :kind="lastPagination.kind"
              :tone="lastPagination.tone"
              :disabled="paginationLocked || nextNavDisabled || lastPagination.disabled"
              @click="goLastPage"
            >
              <EgIcon name="eds-arrow-go-last" fit />
            </EgPaginationItem>
            </EgPaginer>
            </template>

            <template #skid>
              <EgSkid
                title="Skid"
                confirm-label="Action"
                @close="onSkidClose"
              >
                <div :class="previewStyles.skidBody">
                  <div :class="previewStyles.skidBarGroup">
                    <span :class="previewStyles.fieldBarPrimary" aria-hidden="true" />
                    <span :class="previewStyles.fieldBarSecondary" aria-hidden="true" />
                  </div>
                  <div :class="previewStyles.skidBarGroup">
                    <span :class="previewStyles.fieldBarPrimary" aria-hidden="true" />
                    <span :class="previewStyles.fieldBarSecondary" aria-hidden="true" />
                  </div>
                  <div :class="previewStyles.skidBarGroup">
                    <span :class="previewStyles.fieldBarPrimary" aria-hidden="true" />
                    <span :class="previewStyles.fieldBarSecondary" aria-hidden="true" />
                  </div>
                </div>
              </EgSkid>
            </template>
          </EgLayout>
        </div>
      </template>

      <template #customize-after>
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          :row-columns="iconButtonProNestedRowColumns"
          title="工具栏 · EgIconButtonPro"
          :controls="dataListToolbarCustomizeControls"
        />
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          :row-columns="3"
          title="列设置"
          :controls="dataListColumnSettingControls"
        />
        <CustomizePanel
          v-model="customize"
          nested
          sequential
          :row-columns="paginerPaginationNestedRowColumns"
          title="分页 · EgPaginationItem"
          :controls="dataListPaginationCustomizeControls"
        />
        <CustomizePanel
          v-if="showStatistics"
          v-model="customize"
          nested
          sequential
          title="数据统计"
          :controls="paginerStatisticsCustomizeControls"
        />
      </template>

      <section :class="shared.section">
        <h2 :class="shared.sectionTitle">EgDataListColumn</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="dataListColumnPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
