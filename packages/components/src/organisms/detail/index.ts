export { default as EgDetail } from './Detail.vue';
export type {
  DetailItemData,
  DetailSectionData,
  DetailValueType,
  DetailValueSymbolKind,
} from './detailTypes';
export { createDefaultDetailSections } from './detailTypes';
export {
  DETAIL_APPLY_ITEM_FIGMA_NODE,
  createDetailApplyItemRow,
  detailApplyItemPresetIds,
  detailApplyItemPresets,
  detailApplyItemVariantIds,
  detailApplyItemVariants,
  getDetailApplyItemPreset,
  getDetailApplyItemVariant,
  isDetailApplyItemPresetDataSource,
  isDetailApplyItemVariantId,
  resolveDetailItemFromApplyPreset,
  type DetailApplyItemPresetId,
  type DetailApplyItemRowOverrides,
  type DetailApplyItemVariant,
  type DetailApplyItemVariantId,
} from './applyItemPresets';
