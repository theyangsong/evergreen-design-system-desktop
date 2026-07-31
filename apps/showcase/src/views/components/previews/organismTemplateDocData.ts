import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';

export const ORGANISM_IMPORT = `import {
  EgNavBar,
  EgNavBarCorporation,
  EgNavBarModuleItem,
  EgNavBarBottomIcon,
  EgNavBarAvatar,
  EgModuleMenu,
  EgModuleMenuGroup,
  EgModuleMenuItem,
  EgModuleMenuSection,
  EgModuleMenuSectionTitle,
  EgToolBar,
  EgIconButtonPro,
  EgPaginer,
  EgPaginationItem,
  EgDataList,
  EgDataListColumn,
  EgReminder,
  EgBatchBar,
  EgBatchBarActionItem,
  EgContainer,
  EgLayout,
  EgPopup,
  EgSkid,
  EgIcon,
  EgComboActionPopupWindow,
} from '@eds/desktop-components';`;

export type OrganismPropRow = DocPropRow;

export const navBarFigmaNode = '2085:772';

const NAV_BAR_MODULE_COUNT_MAX = 20;
const NAV_BAR_APP_ENTRY_COUNT_MAX = 20;

const navBarModuleCountOptions = Array.from({ length: NAV_BAR_MODULE_COUNT_MAX }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

const navBarAppEntryCountOptions = Array.from({ length: NAV_BAR_APP_ENTRY_COUNT_MAX + 1 }, (_, index) => {
  const value = String(index);
  return { value, label: value };
});

function navBarModuleLabelDefaults(label = 'Label'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_MODULE_COUNT_MAX; index += 1) {
    entries[`moduleLabel${index}`] = label;
  }
  return entries;
}

function navBarModuleIconDefaults(icon = 'eds-add'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_MODULE_COUNT_MAX; index += 1) {
    entries[`moduleIcon${index}`] = icon;
    entries[`moduleFocusIcon${index}`] = icon;
  }
  return entries;
}

function navBarModuleReddotDefaults(show = false): Record<string, boolean> {
  const entries: Record<string, boolean> = {};
  for (let index = 1; index <= NAV_BAR_MODULE_COUNT_MAX; index += 1) {
    entries[`moduleReddot${index}`] = show;
  }
  return entries;
}

function navBarAppEntryLabelDefaults(label = 'Label'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_APP_ENTRY_COUNT_MAX; index += 1) {
    entries[`appEntryLabel${index}`] = label;
  }
  return entries;
}

function navBarAppEntryIconDefaults(icon = 'eds-add'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let index = 1; index <= NAV_BAR_APP_ENTRY_COUNT_MAX; index += 1) {
    entries[`appEntryIcon${index}`] = icon;
    entries[`appEntryFocusIcon${index}`] = icon;
  }
  return entries;
}

function navBarAppEntryReddotDefaults(show = false): Record<string, boolean> {
  const entries: Record<string, boolean> = {};
  for (let index = 1; index <= NAV_BAR_APP_ENTRY_COUNT_MAX; index += 1) {
    entries[`appEntryReddot${index}`] = show;
  }
  return entries;
}

export type NavBarScenario = 'nav-bar' | 'cregis';

export const navBarScenarioOptions = [
  { value: 'nav-bar', label: 'Nav Bar' },
  { value: 'cregis', label: 'Cregis' },
];

export const cregisNavBarPropRows: OrganismPropRow[] = [
  {
    name: 'moduleCount',
    type: 'number',
    defaultValue: '8',
    description: '声明式模块数量（与 moduleLabelN / moduleIconN / moduleFocusIconN 配套）。',
  },
  {
    name: 'moduleLabelN',
    type: 'string',
    defaultValue: '-',
    description: '第 N 个模块文案（N=1…20），如 moduleLabel1="Wallet"。',
  },
  {
    name: 'moduleIconN',
    type: 'string',
    defaultValue: '-',
    description: '第 N 个模块默认 icon name。',
  },
  {
    name: 'moduleFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: '第 N 个模块聚焦 icon name。',
  },
  {
    name: 'appEntryLabelN',
    type: 'string',
    defaultValue: '-',
    description: '应用入口文案（N=1…20）；有值时自动渲染 Module Divider 下入口项。',
  },
  {
    name: 'appEntryIconN',
    type: 'string',
    defaultValue: '-',
    description: '应用入口默认 icon name。',
  },
  {
    name: 'appEntryFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: '应用入口聚焦 icon name。',
  },
];

export const navBarCustomizeDefaults = {
  scenario: 'nav-bar' as NavBarScenario,
  showDivider: true,
  moduleCount: '4',
  appEntryCount: '1',
  ...navBarModuleLabelDefaults(),
  ...navBarModuleIconDefaults(),
  ...navBarModuleReddotDefaults(),
  ...navBarAppEntryLabelDefaults(),
  ...navBarAppEntryIconDefaults(),
  ...navBarAppEntryReddotDefaults(),
  corporationLabel: 'G',
  avatarInitials: 'N',
};

export const navBarCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'scenario',
    label: '场景化',
    options: navBarScenarioOptions,
  },
  {
    kind: 'select',
    key: 'moduleCount',
    label: '模块数量',
    options: navBarModuleCountOptions,
    visibleWhen: (state) => state.scenario === 'nav-bar',
  },
  {
    kind: 'select',
    key: 'appEntryCount',
    label: '应用入口数量',
    options: navBarAppEntryCountOptions,
    visibleWhen: (state) => state.scenario === 'nav-bar',
  },
  {
    kind: 'text',
    key: 'corporationLabel',
    label: '企业标识 corporation',
    visibleWhen: (state) => state.scenario === 'nav-bar',
  },
  {
    kind: 'text',
    key: 'avatarInitials',
    label: '头像缩写 avatar',
    visibleWhen: (state) => state.scenario === 'nav-bar',
  },
  {
    kind: 'boolean',
    key: 'showDivider',
    label: '右侧分割线 divider',
    visibleWhen: (state) => state.scenario === 'nav-bar',
  },
];

export const navBarModuleLabelCustomizeControls: DocCustomizeControl[] = Array.from(
  { length: NAV_BAR_MODULE_COUNT_MAX },
  (_, index) => {
    const moduleIndex = index + 1;
    const visibleWhen = (state: Record<string, unknown>) => {
      const count = Number(state.moduleCount);
      return Number.isFinite(count) && count >= moduleIndex;
    };

    return [
      {
        kind: 'text' as const,
        key: `moduleLabel${moduleIndex}`,
        label: `顺序 ${moduleIndex}`,
        row: moduleIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `moduleIcon${moduleIndex}`,
        label: '默认 icon',
        placeholder: 'eds-add',
        row: moduleIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `moduleFocusIcon${moduleIndex}`,
        label: '聚焦 icon',
        placeholder: 'eds-add',
        row: moduleIndex,
        visibleWhen,
      },
      {
        kind: 'boolean' as const,
        key: `moduleReddot${moduleIndex}`,
        label: '红点 reddot',
        row: moduleIndex,
        visibleWhen,
      },
    ];
  },
).flat();

export const navBarAppEntryLabelCustomizeControls: DocCustomizeControl[] = Array.from(
  { length: NAV_BAR_APP_ENTRY_COUNT_MAX },
  (_, index) => {
    const entryIndex = index + 1;
    const visibleWhen = (state: Record<string, unknown>) => {
      const count = Number(state.appEntryCount);
      return Number.isFinite(count) && count >= entryIndex;
    };

    return [
      {
        kind: 'text' as const,
        key: `appEntryLabel${entryIndex}`,
        label: `应用入口 ${entryIndex}`,
        row: entryIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `appEntryIcon${entryIndex}`,
        label: '默认 icon',
        placeholder: 'eds-add',
        row: entryIndex,
        visibleWhen,
      },
      {
        kind: 'text' as const,
        key: `appEntryFocusIcon${entryIndex}`,
        label: '聚焦 icon',
        placeholder: 'eds-add',
        row: entryIndex,
        visibleWhen,
      },
      {
        kind: 'boolean' as const,
        key: `appEntryReddot${entryIndex}`,
        label: '红点 reddot',
        row: entryIndex,
        visibleWhen,
      },
    ];
  },
).flat();

export const navBarPropRows: OrganismPropRow[] = [
  { name: 'split', type: 'boolean', defaultValue: 'false', description: 'Corporation 与 Module 区之间 Page Divider。Figma Split。' },
  { name: 'showSystemButtons', type: 'boolean', defaultValue: 'true', description: '顶栏系统按钮（交通灯）。' },
  {
    name: 'showDivider',
    type: 'boolean',
    defaultValue: 'true',
    description: '导航右侧 Module Divider（vertical）；不占导航 74px 宽度，显示时总宽 = 导航 + 线宽。',
  },
  {
    name: 'moduleCount',
    type: 'number',
    defaultValue: '-',
    description: '声明式：模块数量；与 moduleLabelN / moduleIconN / moduleFocusIconN 配套。有 default slot 时忽略。',
  },
  {
    name: 'moduleLabelN / moduleIconN / moduleFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: '声明式：第 N 个模块（N=1…20）。',
  },
  {
    name: 'appEntryLabelN / appEntryIconN / appEntryFocusIconN',
    type: 'string',
    defaultValue: '-',
    description: '声明式：应用入口（N=1…20）；有 appEntryLabel 时自动插入 Navigator Divider。',
  },
  {
    name: 'corporationLabel',
    type: 'string',
    defaultValue: "'G'",
    description: '声明式且无 #corporation slot 时的企业标识文案。',
  },
  {
    name: 'avatarInitials',
    type: 'string',
    defaultValue: "'N'",
    description: '声明式且无 #avatar slot 时的头像缩写。',
  },
];

export const navBarSlotRows: OrganismPropRow[] = [
  { name: 'corporation', type: 'slot', defaultValue: '-', description: '企业 Logo 区；默认 EgNavBarCorporation。' },
  { name: 'default', type: 'slot', defaultValue: 'EgNavBarModuleItem[]', description: '模块导航项。' },
  {
    name: 'appEntries',
    type: 'slot',
    defaultValue: 'EgNavBarModuleItem[]',
    description: 'Module Divider 下方应用入口（Figma Split=Yes Module Combo 内 Divider 2085:804 之下）。',
  },
  { name: 'utilities', type: 'slot', defaultValue: 'EgNavBarBottomIcon[]', description: '底部圆形图标区（结构始终保留，默认可放 3 个 Bottom iCon）。' },
  { name: 'avatar', type: 'slot', defaultValue: 'EgNavBarAvatar', description: '用户头像。' },
];

export const navBarCorporationPropRows: OrganismPropRow[] = [
  { name: 'label', type: 'string', defaultValue: "'G'", description: '默认单字/Logo 文案。' },
];

export const navBarModuleItemPropRows: OrganismPropRow[] = [
  { name: 'label', type: 'string', defaultValue: "'Label'", description: 'Bar 文案 + aria-label。' },
  { name: 'active', type: 'boolean', defaultValue: 'false', description: '选中态文案 primary。' },
  { name: 'showReddot', type: 'boolean', defaultValue: 'false', description: '模块 icon 右上角红点。' },
];

export const navBarModuleItemSlotRows: OrganismPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: 'EgIcon', description: '默认 icon（如 eds-add）。' },
  {
    name: 'focusIcon',
    type: 'slot',
    defaultValue: '-',
    description:
      '聚焦 icon；模块处于聚焦态时替换 default 显示。模块区与应用入口共用一组聚焦，同一时刻仅一项；点空白不取消。',
  },
];

export const moduleMenuFigmaNode = '2090:4337';

export const MODULE_MENU_MAX_GROUPS = 10;

export const MODULE_MENU_MAX_ITEMS_PER_GROUP = 20;

export const MODULE_MENU_MAX_SUB_ITEMS = 20;

export const moduleMenuHasSubItemOptions = [
  { value: 'yes', label: '有' },
  { value: 'no', label: '无' },
];

export const moduleMenuItemCountOptions = Array.from({ length: MODULE_MENU_MAX_ITEMS_PER_GROUP }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

export const moduleMenuSubItemCountOptions = Array.from({ length: MODULE_MENU_MAX_SUB_ITEMS }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

export const moduleMenuTitlePresetOptions = [
  { value: 'Module', label: 'Module' },
  { value: 'Wallet', label: 'Wallet' },
  { value: 'Settings', label: 'Settings' },
  { value: 'Analytics', label: 'Analytics' },
];

export function moduleMenuGroupTitleKey(index: number): string {
  return `groupTitle_${index}`;
}

export function moduleMenuGroupSortKey(index: number): string {
  return `groupSort_${index}`;
}

export function moduleMenuGroupItemCountKey(index: number): string {
  return `groupItemCount_${index}`;
}

export function moduleMenuGroupItemHasSubKey(groupIndex: number, itemIndex: number): string {
  return `groupItemHasSub_${groupIndex}_${itemIndex}`;
}

/** @deprecated 使用 groupItemHasSub（yes → tier 2） */
export function moduleMenuGroupItemTierKey(groupIndex: number, itemIndex: number): string {
  return `groupItemTier_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemLabelKey(groupIndex: number, itemIndex: number): string {
  return `groupItemLabel_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemIconKey(groupIndex: number, itemIndex: number): string {
  return `groupItemIcon_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemAccessoryKey(groupIndex: number, itemIndex: number): string {
  return `groupItemAccessory_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemMessageTextKey(groupIndex: number, itemIndex: number): string {
  return `groupItemMessage_${groupIndex}_${itemIndex}`;
}

export const moduleMenuItemAccessoryOptions = [
  { value: 'none', label: '无' },
  { value: 'message', label: 'EgMessage' },
  { value: 'reddot', label: 'EgReddot' },
];

export function moduleMenuGroupItemSubCountKey(groupIndex: number, itemIndex: number): string {
  return `groupItemSubCount_${groupIndex}_${itemIndex}`;
}

export function moduleMenuGroupItemSubLabelKey(
  groupIndex: number,
  itemIndex: number,
  subIndex: number,
): string {
  return `groupItemSubLabel_${groupIndex}_${itemIndex}_${subIndex}`;
}

function defaultGroupTitle(index: number): string {
  if (index === 0) return '';
  if (index === 1) return 'Title';
  return `Title ${index}`;
}

function defaultGroupItemCount(index: number): string {
  return '2';
}

function defaultGroupItemHasSub(groupIndex: number, itemIndex: number): string {
  if (groupIndex === 1 && itemIndex === 1) return 'yes';
  return 'no';
}

export function buildModuleMenuCustomizeDefaults(): Record<string, unknown> {
  const defaults: Record<string, unknown> = {
    showEdgeDivider: true,
    groupCount: '2',
    moduleTitleKind: 'text',
    moduleTitleText: 'Module',
    moduleTitlePreset: 'Module',
  };

  for (let index = 0; index < MODULE_MENU_MAX_GROUPS; index += 1) {
    defaults[moduleMenuGroupTitleKey(index)] = defaultGroupTitle(index);
    defaults[moduleMenuGroupSortKey(index)] = String(index + 1);
    defaults[moduleMenuGroupItemCountKey(index)] = defaultGroupItemCount(index);

    for (let itemIndex = 1; itemIndex <= MODULE_MENU_MAX_ITEMS_PER_GROUP; itemIndex += 1) {
      defaults[moduleMenuGroupItemHasSubKey(index, itemIndex)] = defaultGroupItemHasSub(index, itemIndex);
      defaults[moduleMenuGroupItemLabelKey(index, itemIndex)] = 'Label';
      defaults[moduleMenuGroupItemIconKey(index, itemIndex)] = '';
      defaults[moduleMenuGroupItemAccessoryKey(index, itemIndex)] = 'none';
      defaults[moduleMenuGroupItemMessageTextKey(index, itemIndex)] = '0';
      defaults[moduleMenuGroupItemSubCountKey(index, itemIndex)] = '2';

      for (let subIndex = 1; subIndex <= MODULE_MENU_MAX_SUB_ITEMS; subIndex += 1) {
        defaults[moduleMenuGroupItemSubLabelKey(index, itemIndex, subIndex)] = 'Label';
      }
    }
  }

  return defaults;
}

export const moduleMenuCustomizeDefaults = buildModuleMenuCustomizeDefaults();

export const moduleMenuGroupCountOptions = Array.from({ length: MODULE_MENU_MAX_GROUPS }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

export const moduleMenuCustomizeControls: DocCustomizeControl[] = [
  { kind: 'select', key: 'groupCount', label: '组数量', options: moduleMenuGroupCountOptions },
  { kind: 'boolean', key: 'showEdgeDivider', label: '右侧 Module Divider' },
];

export const moduleMenuTitleCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'moduleTitleKind',
    label: '输入方式',
    options: [
      { value: 'text', label: '文本' },
      { value: 'preset', label: '下拉' },
    ],
    row: 0,
  },
  {
    kind: 'text',
    key: 'moduleTitleText',
    label: '标题文案',
    row: 0,
    visibleWhen: (state) => state.moduleTitleKind === 'text',
  },
  {
    kind: 'select',
    key: 'moduleTitlePreset',
    label: '标题选项',
    options: moduleMenuTitlePresetOptions,
    row: 0,
    visibleWhen: (state) => state.moduleTitleKind === 'preset',
  },
];

export function buildModuleMenuGroupCustomizeControls(groupIndex: number): DocCustomizeControl[] {
  const groupNumber = groupIndex + 1;

  const groupVisible = (state: Record<string, unknown>) => {
    const count = Number(state.groupCount);
    return Number.isFinite(count) && count >= groupNumber;
  };

  const itemVisible = (itemIndex: number) => (state: Record<string, unknown>) => {
    if (!groupVisible(state)) return false;
    const itemCount = Number(state[moduleMenuGroupItemCountKey(groupIndex)]);
    return Number.isFinite(itemCount) && itemCount >= itemIndex;
  };

  const itemHasSubIs = (itemIndex: number, hasSub: boolean) => (state: Record<string, unknown>) => {
    if (!itemVisible(itemIndex)(state)) return false;
    const value = String(state[moduleMenuGroupItemHasSubKey(groupIndex, itemIndex)] ?? 'no');
    return hasSub ? value === 'yes' : value === 'no';
  };

  const subItemVisible =
    (itemIndex: number, subIndex: number) => (state: Record<string, unknown>) => {
      if (!itemHasSubIs(itemIndex, true)(state)) return false;
      const subCount = Number(state[moduleMenuGroupItemSubCountKey(groupIndex, itemIndex)]);
      return Number.isFinite(subCount) && subCount >= subIndex;
    };

  const controls: DocCustomizeControl[] = [
    {
      kind: 'text',
      key: moduleMenuGroupTitleKey(groupIndex),
      label: '组标题',
      placeholder: '留空为无标题',
      row: 0,
      visibleWhen: groupVisible,
    },
    {
      kind: 'text',
      key: moduleMenuGroupSortKey(groupIndex),
      label: '组顺序',
      placeholder: '数值',
      row: 0,
      visibleWhen: groupVisible,
    },
    {
      kind: 'select',
      key: moduleMenuGroupItemCountKey(groupIndex),
      label: 'Item 数量',
      options: moduleMenuItemCountOptions,
      row: 0,
      visibleWhen: groupVisible,
    },
  ];

  for (let itemIndex = 1; itemIndex <= MODULE_MENU_MAX_ITEMS_PER_GROUP; itemIndex += 1) {
    const itemRow = itemIndex;

    controls.push(
      {
        kind: 'text',
        key: moduleMenuGroupItemLabelKey(groupIndex, itemIndex),
        label: `Item${itemIndex}`,
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemHasSubKey(groupIndex, itemIndex),
        label: '下属 Item',
        options: moduleMenuHasSubItemOptions,
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'text',
        key: moduleMenuGroupItemIconKey(groupIndex, itemIndex),
        label: 'Icon',
        placeholder: 'eds-add',
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemAccessoryKey(groupIndex, itemIndex),
        label: '右侧配件',
        options: moduleMenuItemAccessoryOptions,
        row: itemRow,
        visibleWhen: itemVisible(itemIndex),
      },
      {
        kind: 'text',
        key: moduleMenuGroupItemMessageTextKey(groupIndex, itemIndex),
        label: 'Message',
        row: itemRow,
        visibleWhen: (state) => {
          if (!itemVisible(itemIndex)(state)) return false;
          return (
            state[moduleMenuGroupItemAccessoryKey(groupIndex, itemIndex)] === 'message'
          );
        },
      },
      {
        kind: 'select',
        key: moduleMenuGroupItemSubCountKey(groupIndex, itemIndex),
        label: '二级 Item 数量',
        options: moduleMenuSubItemCountOptions,
        row: itemRow,
        visibleWhen: itemHasSubIs(itemIndex, true),
      },
    );

    for (let subIndex = 1; subIndex <= MODULE_MENU_MAX_SUB_ITEMS; subIndex += 1) {
      controls.push({
        kind: 'text',
        key: moduleMenuGroupItemSubLabelKey(groupIndex, itemIndex, subIndex),
        label: `二级 ${subIndex} Label`,
        row: itemRow * 100 + subIndex,
        visibleWhen: subItemVisible(itemIndex, subIndex),
      });
    }
  }

  return controls;
}

export const moduleMenuGroupCustomizeControlsList = Array.from(
  { length: MODULE_MENU_MAX_GROUPS },
  (_, groupIndex) => buildModuleMenuGroupCustomizeControls(groupIndex),
);

export const moduleMenuPropRows: OrganismPropRow[] = [
  {
    name: 'title',
    type: 'string',
    defaultValue: "'Module'",
    description:
      'Module Menu-Title 文案。内容溢出且向下滚动时，标题下自动显示 EgDivider type=module（不可 prop 定制，与 showEdgeDivider 无关）。',
  },
  { name: 'showEdgeDivider', type: 'boolean', defaultValue: 'true', description: '右侧竖向 EgDivider type=module。' },
];

export const moduleMenuGroupPropRows: OrganismPropRow[] = [
  {
    name: 'title',
    type: 'string',
    defaultValue: '-',
    description: '可选。有值为带标题组合；省略为不带标题组合。多组 EgModuleMenuGroup 在 default slot 中排列，组间距 spacing-3（12px）。',
  },
];

export const moduleMenuItemPropRows: OrganismPropRow[] = [
  { name: 'label', type: 'string', defaultValue: "'Label'", description: 'Body Medium 文案。' },
  {
    name: 'tier',
    type: '1 | 2',
    defaultValue: '1',
    description: '1 = 无二级 item；2 = 可包 default slot 放置二级 item。',
  },
  { name: 'subitem', type: 'boolean', defaultValue: 'false', description: '二级 item 行，左侧缩进 spacing-8。' },
  {
    name: 'focused',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'EgModuleMenu 内由点击切换聚焦（tier=2 且含二级 item 的父级仅展开/收起，不参与聚焦）；无菜单上下文时可受控。',
  },
  {
    name: 'message',
    type: 'string',
    defaultValue: '-',
    description: '右侧 EgMessage；与 showReddot 互斥。',
  },
  { name: 'messageType', type: 'MessageType', defaultValue: "'subtle'", description: 'EgMessage type。' },
  { name: 'showReddot', type: 'boolean', defaultValue: 'false', description: '右侧 EgReddot；与 message 互斥。' },
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'false',
    description: '已废弃：等价于 focused。',
  },
  {
    name: 'trailingIcon',
    type: 'string',
    defaultValue: '-',
    description: 'tier=2 且含二级 item 时覆盖默认折叠图标（arrow-up / arrow-right）。',
  },
  {
    name: 'expanded',
    type: 'boolean',
    defaultValue: 'false',
    description: 'tier=2 父级展开态（v-model:expanded）；默认 false 收起，点击整行切换。',
  },
  {
    name: 'level',
    type: '0 | 1',
    defaultValue: '-',
    description: '已废弃：1 等价于 subitem。',
  },
];

export const toolBarFigmaNode = '2087:3918';

export const toolBarCustomizeDefaults = {
  title: 'Title',
  showBack: false,
  showOperation: true,
  showDivider: false,
  showSection: false,
  functionalLabel: 'Label',
};

export const toolBarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'title', label: '标题 title' },
  { kind: 'boolean', key: 'showBack', label: '返回 back' },
  { kind: 'boolean', key: 'showOperation', label: '操作区 operation' },
  { kind: 'boolean', key: 'showDivider', label: '底部分割线 divider' },
  { kind: 'boolean', key: 'showSection', label: '功能分区 section' },
  { kind: 'text', key: 'functionalLabel', label: 'EgIconButtonPro 文案' },
];

export const toolBarPropRows: OrganismPropRow[] = [
  { name: 'title', type: 'string', defaultValue: "'Title'", description: 'ToolBar-Title Body Large Strong。' },
  { name: 'showBack', type: 'boolean', defaultValue: 'false', description: 'ToolBar-Title Back=Yes。' },
  { name: 'showOperation', type: 'boolean', defaultValue: 'true', description: 'Operation 开关：右侧操作 iCons。' },
  { name: 'showDivider', type: 'boolean', defaultValue: 'false', description: '滚动置顶时 Divider=Yes。' },
  { name: 'showSection', type: 'boolean', defaultValue: 'false', description: 'Functional 内 Section 分区。' },
];

export const toolBarSlotRows: OrganismPropRow[] = [
  { name: 'title', type: 'slot', defaultValue: '-', description: '标题区。' },
  { name: 'functional', type: 'slot', defaultValue: 'EgIconButtonPro', description: '右侧功能图标组。' },
  { name: 'section', type: 'slot', defaultValue: '-', description: 'Section=Yes 时分区内容。' },
  { name: 'operation', type: 'slot', defaultValue: '-', description: 'Operation 区额外操作。' },
];

export const paginerFigmaNode = '2092:8239';

export const paginerCustomizeDefaults = {
  showScrollbar: false,
  showStatistics: true,
  dataVolume: '1–20 / 100',
};

export const paginerCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showScrollbar', label: '滚动条 scrollbar' },
  { kind: 'boolean', key: 'showStatistics', label: '统计 statistics' },
  { kind: 'text', key: 'dataVolume', label: '数据量文案' },
];

export const paginerPropRows: OrganismPropRow[] = [
  { name: 'showScrollbar', type: 'boolean', defaultValue: 'false', description: 'Paginer-Scrollbar。' },
  { name: 'showStatistics', type: 'boolean', defaultValue: 'true', description: 'Statistics=Yes。' },
  { name: 'dataVolume', type: 'string', defaultValue: "'1–20 / 100'", description: 'Paginer-Data Volume 文案。' },
  { name: 'scrollbarProgress', type: 'number', defaultValue: '0.35', description: '预览用滚动条比例 0–1。' },
];

export const reminderFigmaNode = '2769:8358';

export const reminderCustomizeDefaults = {
  type: 'info' as 'info' | 'echo',
  title: 'Title',
  secondaryText: 'I am text',
  showSecondaryText: true,
  confirmLabel: 'Confirm',
  actionCount: 1,
};

export const reminderCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '类型 type',
    options: [
      { value: 'info', label: 'Info' },
      { value: 'echo', label: 'Echo' },
    ],
  },
  { kind: 'text', key: 'title', label: '标题 title' },
  { kind: 'text', key: 'secondaryText', label: '副文案 secondary' },
  { kind: 'boolean', key: 'showSecondaryText', label: '显示副文案' },
  { kind: 'text', key: 'confirmLabel', label: '确认按钮 confirm' },
  {
    kind: 'select',
    key: 'actionCount',
    label: 'Combo Action 数量',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
    ],
  },
];

export const reminderPropRows: OrganismPropRow[] = [
  { name: 'type', type: "'info' | 'echo'", defaultValue: "'info'", description: 'Info：标准提醒；Echo：扩展内容槽。' },
  { name: 'title', type: 'string', defaultValue: "'Title'", description: 'Body Large Strong 标题。' },
  { name: 'secondaryText', type: 'string', defaultValue: "'I am text'", description: 'Body Small secondary（Info）。' },
  { name: 'showSecondaryText', type: 'boolean', defaultValue: 'true', description: '是否展示副文案。' },
  { name: 'confirmLabel', type: 'string', defaultValue: "'Confirm'", description: 'EgComboActionPopupWindow 确认文案。' },
  { name: 'actionCount', type: '1 | 2', defaultValue: '1', description: '嵌套 Combo Action Popup Window 按钮数。' },
];

export const batchBarFigmaNode = '2840:4361';

export const batchBarCustomizeDefaults = {
  selectedCount: '0',
  countSuffix: 'Selectd',
  actionLabel: 'Label',
};

export const batchBarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'selectedCount', label: '选中数 count' },
  { kind: 'text', key: 'countSuffix', label: '统计后缀 suffix' },
  { kind: 'text', key: 'actionLabel', label: '操作文案 action' },
];

export const batchBarPropRows: OrganismPropRow[] = [
  { name: 'selectedCount', type: 'string | number', defaultValue: "'0'", description: 'Statistics 主数字。' },
  { name: 'countSuffix', type: 'string', defaultValue: "'Selectd'", description: 'Statistics 后缀文案。' },
  { name: 'actionLabel', type: 'string', defaultValue: "'Label'", description: 'Text 操作项。' },
];

export const batchBarActionPropRows: OrganismPropRow[] = [
  { name: 'type', type: "'text' | 'symbol' | 'statistics'", defaultValue: "'text'", description: 'BatchBar Action Item 类型。' },
  { name: 'label', type: 'string', defaultValue: "'Label'", description: 'Type=Text。' },
  { name: 'count', type: 'string | number', defaultValue: "'0'", description: 'Type=Statistics。' },
  { name: 'countSuffix', type: 'string', defaultValue: "'Selectd'", description: 'Type=Statistics 后缀。' },
];

export const containerFigmaNode = '2110:6736';

export const containerCustomizeDefaults = {
  pageBg: 'none' as 'none' | 'right' | 'center',
};

export const containerCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'pageBg',
    label: 'Page BG 位置',
    options: [
      { value: 'none', label: '无' },
      { value: 'right', label: 'Right' },
      { value: 'center', label: 'Center' },
    ],
  },
];

export const containerPropRows: OrganismPropRow[] = [
  { name: 'pageBg', type: "'none' | 'right' | 'center'", defaultValue: "'none'", description: 'Container-Page BG 装饰条位置。' },
];

export const layoutFigmaNode = '2091:6707';

export const layoutCustomizeDefaults = {
  type: 'navigation' as 'empty' | 'navigation' | 'module-menu',
  showToolbar: true,
  showPaginer: false,
  showSkid: false,
};

export const layoutCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: '类型 type',
    options: [
      { value: 'empty', label: 'Empty' },
      { value: 'navigation', label: 'Navigation' },
      { value: 'module-menu', label: 'Module Menu' },
    ],
  },
  { kind: 'boolean', key: 'showToolbar', label: 'Tool Bar' },
  { kind: 'boolean', key: 'showPaginer', label: 'Paginer' },
  { kind: 'boolean', key: 'showSkid', label: 'Skid' },
];

export const layoutPropRows: OrganismPropRow[] = [
  { name: 'type', type: "'empty' | 'navigation' | 'module-menu'", defaultValue: "'navigation'", description: 'Layout 骨架类型。' },
  { name: 'showToolbar', type: 'boolean', defaultValue: 'false', description: 'ToolBar=Yes。' },
  { name: 'showPaginer', type: 'boolean', defaultValue: 'false', description: 'Paginer=Yes。' },
  { name: 'showSkid', type: 'boolean', defaultValue: 'false', description: 'Skid=Yes。' },
];

export const layoutSlotRows: OrganismPropRow[] = [
  { name: 'nav', type: 'slot', defaultValue: 'EgNavBar', description: 'type≠empty 时左侧 Nav Bar。' },
  { name: 'moduleMenu', type: 'slot', defaultValue: 'EgModuleMenu', description: 'type=module-menu。' },
  { name: 'toolbar', type: 'slot', defaultValue: 'EgToolBar', description: 'showToolbar。' },
  { name: 'default', type: 'slot', defaultValue: '-', description: '主内容区。' },
  { name: 'paginer', type: 'slot', defaultValue: 'EgPaginer', description: 'showPaginer。' },
  { name: 'skid', type: 'slot', defaultValue: 'EgSkid', description: 'showSkid 右侧滑层。' },
];

export const popupFigmaNode = '2170:3023';

export const popupCustomizeDefaults = {
  uses: 'reminder' as 'detail' | 'reminder' | 'verify',
};

export const popupCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'uses',
    label: '用途 uses',
    options: [
      { value: 'detail', label: 'Detail' },
      { value: 'reminder', label: 'Reminder' },
      { value: 'verify', label: 'Verify' },
    ],
  },
];

export const popupPropRows: OrganismPropRow[] = [
  { name: 'uses', type: "'detail' | 'reminder' | 'verify'", defaultValue: "'reminder'", description: 'Popup 用途（data-uses）。' },
];

export const skidFigmaNode = '2260:3604';

export const skidCustomizeDefaults = {
  title: 'Title',
  showButton: true,
  split: false,
  confirmLabel: 'Confirm',
};

export const skidCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'title', label: '标题 title' },
  { kind: 'boolean', key: 'showButton', label: '底部按钮 button' },
  { kind: 'boolean', key: 'split', label: '标题分割 split' },
  { kind: 'text', key: 'confirmLabel', label: '确认 confirm' },
];

export const skidPropRows: OrganismPropRow[] = [
  { name: 'title', type: 'string', defaultValue: "'Title'", description: 'Skid-Title 文案。' },
  { name: 'showButton', type: 'boolean', defaultValue: 'true', description: 'Button=Yes 时 EgComboActionSkid。' },
  { name: 'split', type: 'boolean', defaultValue: 'false', description: 'State=Scroll Split=Yes 标题下 Divider。' },
  { name: 'confirmLabel', type: 'string', defaultValue: "'Confirm'", description: 'EgComboActionSkid 文案。' },
];

export const skidSlotRows: OrganismPropRow[] = [
  { name: 'title', type: 'slot', defaultValue: '-', description: '标题槽。' },
  { name: 'default', type: 'slot', defaultValue: '-', description: 'Skid 主体内容。' },
  { name: 'actions', type: 'slot', defaultValue: 'EgComboActionSkid', description: '底部操作；默认 Combo Action Skid。' },
];

export const dataListCustomizeDefaults = {
  headerHeight: '32',
  columnHeight: '66',
  loading: false,
  initing: false,
  empty: false,
  selectMode: false,
};

export const dataListCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'headerHeight', label: '表头高 headerHeight' },
  { kind: 'text', key: 'columnHeight', label: '行高 columnHeight' },
  { kind: 'boolean', key: 'loading', label: '加载 loading' },
  { kind: 'boolean', key: 'initing', label: '初始化 initing' },
  { kind: 'boolean', key: 'empty', label: '空数据 empty' },
  { kind: 'boolean', key: 'selectMode', label: '多选 selectMode' },
];

export const dataListPropRows: OrganismPropRow[] = [
  { name: 'dataList', type: 'DataListItem[]', defaultValue: '[]', description: '行数据。' },
  { name: 'headerHeight', type: 'number', defaultValue: '32', description: '表头高度（px）。' },
  { name: 'columnHeight', type: 'number', defaultValue: '66', description: '行高（px）。' },
  { name: 'headerBg', type: 'string', defaultValue: '-', description: '表头背景；默认 --data-table-head。' },
  { name: 'maxHeight', type: 'string', defaultValue: '-', description: '最大高度（可选）。' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: '顶部加载条。' },
  { name: 'initing', type: 'boolean', defaultValue: 'false', description: '全表初始化遮罩（延迟出现）。' },
];

export const dataListColumnPropRows: OrganismPropRow[] = [
  { name: 'prop', type: 'string', defaultValue: '-', description: '字段名；默认槽未提供时取 data[prop]。' },
  { name: 'label', type: 'string', defaultValue: '-', description: '表头文案。' },
  { name: 'width', type: 'string', defaultValue: '-', description: '列宽（如 160px）。' },
  { name: 'widthPercent', type: 'number', defaultValue: '-', description: '列宽百分比。' },
  { name: 'minWidth', type: 'string', defaultValue: '-', description: '最小列宽。' },
  { name: 'minTableWidth', type: 'number', defaultValue: '-', description: '表格宽度不足时隐藏该列。' },
  { name: 'align', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: '对齐。' },
  { name: 'sortable', type: 'boolean', defaultValue: 'false', description: '表头排序菜单。' },
  { name: 'hidden', type: 'boolean', defaultValue: 'false', description: '隐藏列。' },
  { name: 'type', type: "'default' | 'select'", defaultValue: "'default'", description: 'default 数据列；select 由列表多选模式注入。' },
];

export const dataListSlotRows: OrganismPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: 'EgDataListColumn[]', description: '列定义（EgDataListColumn）。' },
  { name: 'operation', type: 'slot', defaultValue: '-', description: '多选时 Batch Bar 操作区。' },
  { name: 'header', type: 'slot', defaultValue: '-', description: '列级表头自定义（EgDataListColumn #header）。' },
];
