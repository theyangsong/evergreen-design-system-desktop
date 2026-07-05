export type PrimaryNavItem =
  | { type: 'link'; id: string; label: string; icon: string; to: string }
  | { type: 'divider'; id: string };

export type SectionNavGroup = {
  title?: string;
  items: Array<{ label: string; to: string }>;
};

export type SectionNavConfig = {
  title: string;
  groups: SectionNavGroup[];
};

export type DocMetaField = {
  label: string;
  value: string;
};

export type DocPageSection = { id: string; title: string };

export type DocPageConfig = {
  title: string;
  sectionId: string;
  description?: string;
  meta?: DocMetaField[];
  toc?: Array<{ id: string; label: string }>;
  designSections?: DocPageSection[];
  developSections?: DocPageSection[];
  /** @deprecated Use designSections */
  placeholderSections?: DocPageSection[];
  defaultContent?: string;
};

const PLACEHOLDER_SECTION_COUNT = 20;

function createPlaceholderSections(
  mode: 'design' | 'develop',
  count = PLACEHOLDER_SECTION_COUNT,
): DocPageSection[] {
  const idPrefix = mode === 'design' ? 'design-section' : 'develop-section';
  const titlePrefix = mode === 'design' ? '模块' : '开发模块';

  return Array.from({ length: count }, (_, index) => ({
    id: `${idPrefix}-${index + 1}`,
    title: `${titlePrefix}${index + 1}`,
  }));
}

const defaultDesignSections = createPlaceholderSections('design');
const defaultDevelopSections = createPlaceholderSections('develop');

export const primaryNav: PrimaryNavItem[] = [
  { type: 'link', id: 'explore', label: '探索', icon: 'book', to: '/explore' },
  { type: 'link', id: 'started', label: '开始', icon: 'tree', to: '/started' },
  { type: 'divider', id: 'divider-main' },
  { type: 'link', id: 'atoms', label: '原子', icon: 'atoms', to: '/atoms' },
  { type: 'link', id: 'molecules', label: '分子', icon: 'molecules', to: '/molecules' },
  { type: 'link', id: 'organisms', label: '模块', icon: 'organisms', to: '/organisms' },
  { type: 'link', id: 'templates', label: '结构', icon: 'templates', to: '/templates' },
  { type: 'link', id: 'scenes', label: '场景化', icon: 'scenes', to: '/scenes' },
];

export const sectionNavById: Record<string, SectionNavConfig> = {
  started: {
    title: '开始',
    groups: [
      {
        title: '系统简介',
        items: [
          { label: '概述', to: '/started/overview' },
          { label: '基本概念', to: '/started/basic-concepts' },
          { label: '平台能力', to: '/started/platform-capabilities' },
          { label: '组件类别', to: '/started/component-categories' },
          { label: '实践案例', to: '/started/case-studies' },
          { label: '生命周期图谱', to: '/started/lifecycle-map' },
        ],
      },
      {
        title: '用户体验',
        items: [
          { label: '设计价值观', to: '/started/design-values' },
          { label: '原则', to: '/started/principles' },
          { label: '样式指南', to: '/started/style-guide' },
          { label: '国际化', to: '/started/i18n' },
          { label: '文案规范', to: '/started/copywriting' },
          { label: '微动效', to: '/started/micro-motion' },
        ],
      },
      {
        title: '开发流程',
        items: [
          { label: '快速接入', to: '/started/quick-start' },
          { label: '运营与维护', to: '/started/operations' },
        ],
      },
    ],
  },
  atoms: {
    title: '原子',
    groups: [
      {
        title: '全局变量',
        items: [
          { label: '色彩系统', to: '/atoms/color-system' },
          { label: '尺度系统', to: '/atoms/scale-system' },
          { label: '排版系统', to: '/atoms/typography' },
          { label: '文本样式', to: '/atoms/text' },
          { label: '视觉效果', to: '/atoms/effect' },
        ],
      },
      {
        title: '构成元素',
        items: [
          { label: '图标', to: '/atoms/icons' },
          { label: '加密货币', to: '/atoms/crypto' },
          { label: '头像', to: '/atoms/avatar' },
          { label: '分割线', to: '/atoms/divider' },
        ],
      },
    ],
  },
  molecules: {
    title: '分子',
    groups: [
      {
        title: '简介',
        items: [{ label: '了解分子', to: '/molecules/overview' }],
      },
      {
        title: '组件',
        items: [
          { label: '输入框', to: '/molecules/input' },
          { label: '按钮', to: '/molecules/button' },
          { label: '菜单框', to: '/molecules/menu-box' },
          { label: '浮层', to: '/molecules/flotation' },
          { label: '标签', to: '/molecules/tag' },
          { label: '切换', to: '/molecules/toggle' },
          { label: '标签页', to: '/molecules/tab' },
          { label: '反馈', to: '/molecules/feedback' },
          { label: '弹出框', to: '/molecules/popovers' },
          { label: '倒计时', to: '/molecules/countdown' },
          { label: '进度条', to: '/molecules/progress' },
          { label: '加载中', to: '/molecules/loading' },
          { label: '上传', to: '/molecules/upload' },
        ],
      },
    ],
  },
  organisms: {
    title: '模块',
    groups: [
      {
        title: '简介',
        items: [{ label: '了解模块', to: '/organisms/overview' }],
      },
      {
        title: '组件',
        items: [
          { label: '导航栏', to: '/organisms/nav-bar' },
          { label: '模块菜单', to: '/organisms/module-menu' },
          { label: '工具栏', to: '/organisms/tool-bar' },
          { label: '分页器', to: '/organisms/paginer' },
          { label: '详情', to: '/organisms/detail' },
          { label: '数据表格视图', to: '/organisms/data-table-view' },
          { label: '数据表格编辑', to: '/organisms/data-table-edit' },
          { label: '数据列表', to: '/organisms/data-list' },
          { label: '提醒', to: '/organisms/reminder' },
          { label: '验证', to: '/organisms/verify' },
          { label: '过滤', to: '/organisms/filter' },
          { label: '批量条', to: '/organisms/batch-bar' },
        ],
      },
    ],
  },
  templates: {
    title: '结构',
    groups: [
      {
        title: '简介',
        items: [{ label: '了解结构', to: '/templates/overview' }],
      },
      {
        title: '构成',
        items: [
          { label: '容器', to: '/templates/container' },
          { label: '布局', to: '/templates/layout' },
          { label: '弹窗', to: '/templates/popup' },
          { label: '侧滑', to: '/templates/skid' },
        ],
      },
    ],
  },
  scenes: {
    title: '场景化',
    groups: [
      {
        title: '简介',
        items: [{ label: '了解场景化', to: '/scenes/overview' }],
      },
      {
        title: '场景化',
        items: [
          { label: '复合型数据提交引擎', to: '/scenes/composite-data-submit' },
          { label: '资产发送', to: '/scenes/asset-send' },
          { label: '资产接收', to: '/scenes/asset-receive' },
          { label: '审批流程', to: '/scenes/approval-flow' },
          { label: '签名流程', to: '/scenes/signature-flow' },
          { label: '安全验证系统', to: '/scenes/security-verification' },
        ],
      },
    ],
  },
};

const defaultMeta: DocMetaField[] = [
  { label: '名称', value: '—' },
  { label: 'ID', value: '—' },
  { label: '类型', value: '—' },
  { label: '状态', value: 'Draft' },
  { label: '版本', value: '—' },
  { label: '维护', value: '—' },
  { label: '贡献', value: '—' },
  { label: '最后更新', value: '—' },
];

export const defaultDocContent = defaultDesignSections
  .map((section) => `<h2 id="${section.id}">${section.title}</h2>`)
  .join('');

function page(
  sectionId: string,
  title: string,
  overrides: Partial<DocPageConfig> = {},
): DocPageConfig {
  return {
    sectionId,
    title,
    description: `${title} 的设计与开发指南。`,
    meta: defaultMeta.map((field) =>
      field.label === '名称' ? { ...field, value: title } : field,
    ),
    designSections: defaultDesignSections,
    developSections: defaultDevelopSections,
    placeholderSections: defaultDesignSections,
    defaultContent: defaultDocContent,
    ...overrides,
  };
}

function buildDocPages(): Record<string, DocPageConfig> {
  const pages: Record<string, DocPageConfig> = {};

  for (const [sectionId, config] of Object.entries(sectionNavById)) {
    for (const group of config.groups) {
      for (const item of group.items) {
        pages[item.to] = page(sectionId, item.label);
      }
    }
  }

  return pages;
}

export const docPages: Record<string, DocPageConfig> = {
  ...buildDocPages(),
  '/atoms/color-system': page('atoms', 'Color System', {
    description:
      'Color System 是 EverGreen Design System 的基础视觉层，用于定义所有 UI 组件的颜色表达规则，并通过 Token 化方式确保跨设计与开发的一致性。',
    meta: [
      { label: '名称', value: 'Color System' },
      { label: 'ID', value: 'eds-vars-color-system' },
      { label: '类型', value: 'Variables' },
      { label: '状态', value: 'Enable' },
      { label: '版本', value: 'v1.1' },
      { label: '维护', value: 'EDS Yang' },
      { label: '贡献', value: 'EDS Yang、Dev.' },
      { label: '最后更新', value: '2026/6/1' },
    ],
  }),
};

export const sectionDefaultRoute: Record<string, string> = {
  started: '/started/overview',
  atoms: '/atoms/color-system',
  molecules: '/molecules/overview',
  organisms: '/organisms/overview',
  templates: '/templates/overview',
  scenes: '/scenes/overview',
};

export function getSectionTitle(sectionId: string): string | undefined {
  return sectionNavById[sectionId]?.title;
}

export function getDocPage(path: string): DocPageConfig | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return docPages[normalized.replace(/\/+$/, '') || '/'];
}

export function getSectionIdFromPath(path: string): string | undefined {
  const match = path.match(/^\/([^/]+)/);
  return match?.[1];
}
