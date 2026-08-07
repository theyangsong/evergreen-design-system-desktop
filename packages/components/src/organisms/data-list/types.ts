export type DataListItem = Record<string, unknown>;

export type DataListColumnAlign = 'left' | 'center' | 'right';

export type DataListSelectAllMode = 'none' | 'all' | 'some';

export type DataListSortOrder = 'asc' | 'desc' | '';

export type DataListBatchAction = {
  key: string;
  label: string;
  danger?: boolean;
  /** true 时点击打开 Popover（EgAnchoredTooltip + EgPopover），确认后再触发 batch-action。 */
  popover?: boolean;
};

export type DataListRowAction = {
  key: string;
  label: string;
  danger?: boolean;
};

export type DataListPrimaryAction = {
  label: string;
};
