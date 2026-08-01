/** Figma CE - Data List 数据列表 · frame DataList (3128:4483) — 右侧 Page 区，不含 NavBar / Module Menu。 */

import { readIconButtonProSingleItem } from './buttonDocCustomize';

export const DATA_LIST_FIGMA_NODE = '3128:4483';

export const DATA_LIST_FIGMA_ROW_COUNT = 103;

export const DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS = ['20', '50', '100'] as const;

/** Figma Data Table-BG. 固定 32px，不作为 Showcase 定制项。 */
export const DATA_LIST_FIGMA_HEADER_HEIGHT = 32;

export const DATA_LIST_PAGE_HEIGHT_FIXED = 800;
export const DATA_LIST_PAGE_HEIGHT_MIN = 720;

export const DATA_LIST_FIGMA_TOOLBAR = {
  title: 'Item',
  showOperation: true,
  showSection: true,
  showDivider: true,
  showBack: false,
} as const;

export const DATA_LIST_FIGMA_PAGINER = {
  dataVolumeCount: '103',
  dataVolumeTotal: 'Total',
  dataVolumeResults: 'Results',
  showStatistics: false,
  statisticsCount: 2,
  statText: 'Item',
  statNumber: '0',
} as const;

export const DATA_LIST_FIGMA_COLUMNS = {
  combo: {
    label: 'Header',
    minWidth: '168px',
  },
  sortable: {
    label: 'Header',
    minWidth: '240px',
    align: 'center' as const,
  },
  plain: {
    label: 'Header',
    minWidth: '240px',
    align: 'center' as const,
  },
  actions: {
    label: 'Header',
    minWidth: '180px',
    align: 'right' as const,
  },
} as const;

/** Showcase Data List 预览固定四列（首 / 中 / 尾）。 */
export const DATA_LIST_PREVIEW_COLUMN_COUNT = 4;

export type DataListColumnAlign = 'left' | 'center' | 'right';

export type DataListColumnDataSource = 'placeholder' | 'currency';

export const DATA_LIST_PREVIEW_CRYPTO = 'eds-aave-aave';

export type DataListPreviewColumnSetting = {
  minWidth: string;
  align: DataListColumnAlign;
  sortable: boolean;
  dataSource: DataListColumnDataSource;
};

export function dataListColumnSettingLabel(index: number, total = DATA_LIST_PREVIEW_COLUMN_COUNT): string {
  if (index <= 1) return '首列';
  if (index >= total) return '尾列';
  return `第 ${index} 列`;
}

export function defaultDataListColumnAlign(
  index: number,
  total = DATA_LIST_PREVIEW_COLUMN_COUNT,
): DataListColumnAlign {
  if (index <= 1) return 'left';
  if (index >= total) return 'right';
  return 'center';
}

export function defaultDataListColumnMinWidth(index: number): string {
  const widths = [
    DATA_LIST_FIGMA_COLUMNS.combo.minWidth,
    DATA_LIST_FIGMA_COLUMNS.sortable.minWidth,
    DATA_LIST_FIGMA_COLUMNS.plain.minWidth,
    DATA_LIST_FIGMA_COLUMNS.actions.minWidth,
  ];
  return widths[index - 1] ?? '160px';
}

export function defaultDataListColumnDataSource(): DataListColumnDataSource {
  return 'placeholder';
}

export function dataListColumnSettingDefaults(): Record<string, string | boolean> {
  const entries: Record<string, string | boolean> = {
    columnSettingIndex: '1',
  };

  for (let index = 1; index <= DATA_LIST_PREVIEW_COLUMN_COUNT; index += 1) {
    entries[`columnMinWidth${index}`] = defaultDataListColumnMinWidth(index);
    entries[`columnAlign${index}`] = defaultDataListColumnAlign(index);
    entries[`columnDataSource${index}`] = defaultDataListColumnDataSource();
    entries[`columnSortable${index}`] = false;
  }

  return entries;
}

export function readDataListColumnSettings(
  state: Record<string, unknown>,
): DataListPreviewColumnSetting[] {
  return Array.from({ length: DATA_LIST_PREVIEW_COLUMN_COUNT }, (_, offset) => {
    const index = offset + 1;
    const minWidthRaw = String(state[`columnMinWidth${index}`] ?? defaultDataListColumnMinWidth(index)).trim();
    const alignRaw = String(
      state[`columnAlign${index}`] ?? defaultDataListColumnAlign(index),
    );
    const align: DataListColumnAlign =
      alignRaw === 'left' || alignRaw === 'right' ? alignRaw : 'center';
    const dataSourceRaw = String(
      state[`columnDataSource${index}`] ?? defaultDataListColumnDataSource(),
    );
    const dataSource: DataListColumnDataSource =
      dataSourceRaw === 'currency' ? 'currency' : 'placeholder';

    return {
      minWidth: minWidthRaw || defaultDataListColumnMinWidth(index),
      align,
      sortable: Boolean(state[`columnSortable${index}`]),
      dataSource,
    };
  });
}

function buildDataListColumnAttrs(setting: DataListPreviewColumnSetting): string {
  const attrs = [
    `min-width="${setting.minWidth}"`,
    setting.align !== 'left' ? `align="${setting.align}"` : null,
    setting.sortable ? 'sortable' : null,
  ]
    .filter(Boolean)
    .join(' ');
  return attrs ? ` ${attrs}` : '';
}

export function buildFigmaDataListRows(
  empty: boolean,
  rowCount: number = DATA_LIST_FIGMA_ROW_COUNT,
): Record<string, unknown>[] {
  if (empty) return [];
  const count = Math.max(0, rowCount);
  return Array.from({ length: count }, (_, index) => ({ id: index }));
}

export function parseDataListColumnHeight(state: Record<string, unknown>): 66 | 48 {
  return String(state.columnHeight) === '48' ? 48 : 66;
}

export function parseDataListRowCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.dataVolume ?? DATA_LIST_FIGMA_ROW_COUNT), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return DATA_LIST_FIGMA_ROW_COUNT;
  return parsed;
}

function parseDataListStatisticsCount(state: Record<string, unknown>): number {
  const count = Number.parseInt(String(state.statisticsCount ?? '2'), 10);
  return Number.isFinite(count) ? Math.min(5, Math.max(1, count)) : 2;
}

export function buildDataListStatisticsItems(
  state: Record<string, unknown>,
): { text: string; number: string }[] {
  const count = parseDataListStatisticsCount(state);
  return Array.from({ length: count }, (_, index) => {
    const itemIndex = index + 1;
    return {
      text: String(state[`stat${itemIndex}Text`] ?? 'Item'),
      number: String(state[`stat${itemIndex}Number`] ?? '0'),
    };
  });
}

function buildDataListIconButtonSnippet(
  state: Record<string, unknown>,
  prefix: 'batch' | 'filter' | 'refresh' | 'export',
): string {
  const item = readIconButtonProSingleItem(state, prefix);
  const attrs = [
    `label="${item.label}"`,
    item.showBadge ? 'show-badge' : null,
    item.showBadge ? `badge="${item.badge}"` : null,
    item.showReddot ? 'show-reddot' : null,
    item.disabled ? 'disabled' : null,
  ]
    .filter(Boolean)
    .join(' ');
  return `<EgIconButtonPro ${attrs}><EgIcon name="${item.icon}" size="sm" /></EgIconButtonPro>`;
}

export function buildDataListPageUsageSnippet(state: Record<string, unknown>): string {
  const columnHeight = parseDataListColumnHeight(state);
  const rowCount = parseDataListRowCount(state);
  const loading = Boolean(state.loading);
  const initing = Boolean(state.initing);
  const showBatch = state.showBatch !== false;
  const showExport = state.showExport !== false;
  const showBack = Boolean(state.showBack);
  const showStatistics = Boolean(state.showStatistics);
  const columnSettings = readDataListColumnSettings(state);
  const [col1, col2, col3, col4] = columnSettings;

  const toolbarAttrs = [
    `title="${DATA_LIST_FIGMA_TOOLBAR.title}"`,
    'show-operation',
    showBack ? 'show-back' : null,
    showBatch ? 'show-section' : null,
    'show-divider',
  ]
    .filter(Boolean)
    .join(' ');

  const batchSnippet = buildDataListIconButtonSnippet(state, 'batch');

  const functionalSlot = showBatch
    ? `    <template #functional>
      ${batchSnippet}
    </template>`
    : '';

  const sectionButtonsBlock = [
    buildDataListIconButtonSnippet(state, 'filter'),
    buildDataListIconButtonSnippet(state, 'refresh'),
    showExport ? buildDataListIconButtonSnippet(state, 'export') : null,
  ]
    .filter(Boolean)
    .map((snippet) => `      ${snippet}`)
    .join('\n');

  const sectionSlot = showBatch
    ? `    <template #section>
${sectionButtonsBlock}
    </template>`
    : `    <template #functional>
${sectionButtonsBlock}
    </template>`;

  const paginerAttrs = [
    `data-volume-count="${rowCount}"`,
    `data-volume-total="${DATA_LIST_FIGMA_PAGINER.dataVolumeTotal}"`,
    `data-volume-results="${DATA_LIST_FIGMA_PAGINER.dataVolumeResults}"`,
    showStatistics ? 'show-statistics' : null,
    showStatistics && Boolean(state.statisticsCollapse) ? 'statistics-collapse' : null,
  ]
    .filter(Boolean)
    .join('\n    ');

  return `<div class="data-list-page">
  <EgToolBar ${toolbarAttrs}>
${functionalSlot}
${sectionSlot}
  </EgToolBar>

  <EgDataList
    :data-list="rows"
    :header-height="${DATA_LIST_FIGMA_HEADER_HEIGHT}"
    :column-height="${columnHeight}"
    :loading="${loading}"
    :initing="${initing}"
  >
    <EgDataListColumn prop="primary"${buildDataListColumnAttrs(col1)}>
      <template #header>Header | Header</template>
    </EgDataListColumn>
    <EgDataListColumn prop="meta" label="Header"${buildDataListColumnAttrs(col2)} />
    <EgDataListColumn prop="meta2" label="Header"${buildDataListColumnAttrs(col3)} />
    <EgDataListColumn prop="actions" label="Header"${buildDataListColumnAttrs(col4)}>
      <template #default>
        <EgButton variant="text" size="sm">More</EgButton>
        <EgButton tone="decor" size="sm">Action</EgButton>
      </template>
    </EgDataListColumn>
  </EgDataList>

  <EgPaginer
    ${paginerAttrs}
  >
    <EgPaginationItem kind="symbol" tone="decor"><EgIcon name="eds-arrow-go-first" fit /></EgPaginationItem>
    <EgPaginationItem kind="symbol" tone="decor"><EgIcon name="eds-arrow-left-mini-ios" fit /></EgPaginationItem>
    <EgPaginationItem kind="number" tone="decor" selected label="1" />
    <EgPaginationItem kind="symbol" tone="decor"><EgIcon name="eds-arrow-right-mini-ios" fit /></EgPaginationItem>
    <EgPaginationItem kind="symbol" tone="decor"><EgIcon name="eds-arrow-go-last" fit /></EgPaginationItem>
  </EgPaginer>
</div>`;
}
