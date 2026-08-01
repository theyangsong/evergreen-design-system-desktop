export type ModuleMenuPresetItem = {
  label: string;
  icon: string;
};

export type ModuleMenuPresetGroup = {
  title?: string;
  items: ModuleMenuPresetItem[];
};

/** Cregis Module Menu — slot 组合占位结构。 */
export const cregisModuleMenuGroups: ModuleMenuPresetGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'eds-wallet' },
      { label: 'Analytics', icon: 'eds-bill' },
    ],
  },
  {
    title: 'Assets',
    items: [
      { label: 'Wallets', icon: 'eds-wallet' },
      { label: 'Transactions', icon: 'eds-circulation' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Approvals', icon: 'eds-database-safety' },
      { label: 'Reports', icon: 'eds-bill' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Team', icon: 'eds-categorization' },
      { label: 'Integrations', icon: 'eds-app-ecology' },
    ],
  },
];
