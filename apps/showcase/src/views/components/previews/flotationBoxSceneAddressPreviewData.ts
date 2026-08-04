import { parseSceneAddressSelectionMode, sceneAddressItemKey } from './flotationBoxSceneAddressCustomize';

export type SceneAddressFilterTab = {
  id: string;
  label: string;
  icon: string;
};

export type SceneAddressDropdownRow = {
  id: string;
  address: string;
  alias?: string;
  trailingLabel?: string;
  disabled?: boolean;
  focused?: boolean;
  checked?: boolean;
};

/** 顶部分段：地址簿 / 内部地址 / 最近交易 */
export const SCENE_ADDRESS_FILTER_TABS: SceneAddressFilterTab[] = [
  { id: 'address-book', label: '地址簿', icon: 'eds-address-books' },
  { id: 'internal', label: '内部地址', icon: 'eds-team' },
  { id: 'recent', label: '最近交易', icon: 'eds-clocks' },
];

/** 演示地址行（对齐 Figma 场景化-下拉地址）。 */
export const SCENE_ADDRESS_DROPDOWN_ROWS: SceneAddressDropdownRow[] = [
  {
    id: 'row-1',
    address: '0xc8c557506a5240dcec094e614c665ff9ca815b95',
    trailingLabel: '内部地址',
  },
  {
    id: 'row-2',
    address: '0xcd531ae9efcce479654c4926dec5f6209531ca7b',
  },
  {
    id: 'row-3',
    address: '0x3362c6a98211c167856bcadaff166c8d078fd76d',
    alias: 'Coinbase.',
  },
  {
    id: 'row-4',
    address: '0xa9d1e8f6900963c095ff6dd6538749d31c38e1fe01',
    alias: 'Mr. Wang',
    trailingLabel: '内部地址',
  },
  {
    id: 'row-5',
    address: '0x3362c6a98211c167856bcadaff166c8d078fd76d',
  },
  {
    id: 'row-6',
    address: '0xcd531ae9efcce479654c4926dec5f6209531ca7b',
  },
  {
    id: 'row-7',
    address: '0xc8c557506a5240dcec094e614c665ff9ca815b95',
  },
  {
    id: 'row-8',
    address: '0x3362c6a98211c167856bcadaff166c8d078fd76d',
  },
  {
    id: 'row-9',
    address: '0xcd531ae9efcce479654c4926dec5f6209531ca7b',
  },
];

export const flotationSceneAddressDropdownItemCount = SCENE_ADDRESS_DROPDOWN_ROWS.length;

export function getSceneAddressDropdownRows(
  count: number,
  state: Record<string, unknown>,
): SceneAddressDropdownRow[] {
  const safe = Math.min(20, Math.max(1, Math.floor(count)));
  const selectionMode = parseSceneAddressSelectionMode(state);
  const isMultiple = selectionMode === 'multiple';

  return Array.from({ length: safe }, (_, index) => {
    const n = index + 1;
    const demoRow = SCENE_ADDRESS_DROPDOWN_ROWS[index];
    const labelOverride = state[sceneAddressItemKey('Label', n)];
    const address =
      labelOverride != null && String(labelOverride).trim() !== ''
        ? String(labelOverride)
        : (demoRow?.address ?? `Label ${n}`);
    const aliasOverride = state[sceneAddressItemKey('Alias', n)];
    const alias =
      aliasOverride != null
        ? String(aliasOverride).trim() || undefined
        : demoRow?.alias;
    const isSelected = Boolean(state[sceneAddressItemKey('Checked', n)]);

    return {
      id: demoRow?.id ?? `row-${n}`,
      address,
      alias,
      trailingLabel: demoRow?.trailingLabel,
      disabled: Boolean(state[sceneAddressItemKey('Disabled', n)]),
      focused: isMultiple
        ? Boolean(state[sceneAddressItemKey('Focused', n)])
        : isSelected,
      checked: isMultiple ? isSelected : false,
    };
  });
}
