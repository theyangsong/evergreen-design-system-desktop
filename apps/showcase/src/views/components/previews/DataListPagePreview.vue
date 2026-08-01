<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
  EgCrypto,
  EgDivider,
  EgDataList,
  EgDataListColumn,
  EgIcon,
  EgIconButtonPro,
  EgLayout,
  EgPaginer,
  EgPaginationItem,
  EgToolBar,
} from '@eds/desktop-components';
import {
  DATA_LIST_FIGMA_COLUMNS,
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  DATA_LIST_PREVIEW_CRYPTO,
} from './dataListPagePreviewData';
import previewStyles from './DataListPreview.module.css';
import { useDataListPagePreview } from './useDataListPagePreview';

const props = withDefaults(
  defineProps<{
    customize: Record<string, unknown>;
    nested?: boolean;
    /** 外层已提供 pageShell 时设为 false（如 Data List 文档页）。 */
    usePageShell?: boolean;
    pageHeightMode?: 'fixed' | 'adaptive';
    layoutSkidOpen?: boolean;
  }>(),
  {
    nested: false,
    usePageShell: true,
    pageHeightMode: 'fixed',
    layoutSkidOpen: false,
  },
);

const customizeRef = toRef(props, 'customize');
const layoutSkidOpenRef = toRef(props, 'layoutSkidOpen');

const {
  DATA_LIST_FIGMA_TOOLBAR,
  DATA_LIST_FIGMA_PAGINER,
  batchButton,
  columnHeight,
  currentPage,
  dataListBatchActions,
  dataListMoreActions,
  firstPagination,
  goFirstPage,
  goLastPage,
  goNextPage,
  goPrevPage,
  isManyPageSelected,
  isManyPagination,
  lastPagination,
  manyPageItems,
  nextNavDisabled,
  nextPagination,
  onBatchAction,
  onBatchClick,
  onManyPageItemClick,
  onSettingsJump,
  onToolbarActionClick,
  paginatedDataList,
  pagePagination,
  paginationLocked,
  prevNavDisabled,
  prevPagination,
  previewColumnSettings,
  settingsJumpValue,
  settingsLevelIndex,
  showBack,
  showBatch,
  showPaginerStatistics,
  showToolBarOperation,
  showToolBarSection,
  skidOpen,
  skidContentLocked,
  statisticsItems,
  toolbarActionButtons,
  totalRowCount,
} = useDataListPagePreview(customizeRef, layoutSkidOpenRef);

const shellClass = computed(() => {
  if (props.nested) {
    return [previewStyles.dataListNest];
  }

  if (!props.usePageShell) {
    return [previewStyles.pageShellFill];
  }

  return [
    previewStyles.pageShell,
    props.pageHeightMode === 'adaptive'
      ? previewStyles.pageShellAdaptive
      : previewStyles.pageShellFixed,
  ];
});
</script>

<template>
  <div :class="shellClass">
    <EgLayout type="empty" show-toolbar show-paginer>
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
          :skid-open="skidOpen"
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
    </EgLayout>
  </div>
</template>
