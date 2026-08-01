import type { ModuleMenuPresetGroup } from './cregisModuleMenuGroups';

/** UDun Module Menu — 与 Cregis 同结构占位，后续可独立维护。 */
export const udunModuleMenuGroups: ModuleMenuPresetGroup[] = [
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
