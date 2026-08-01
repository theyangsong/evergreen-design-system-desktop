/** 业务场景 Module Menu 标题 — 与 Nav Bar 模块名一致。 */
export const moduleMenuBusinessTitles = [
  'Wallet',
  'Tasks',
  'WaaS',
  'Payment Engine',
  'Report',
  'Risk Control',
  'Manage',
  'Marketplace',
] as const;

export type ModuleMenuBusinessTitle = (typeof moduleMenuBusinessTitles)[number];
