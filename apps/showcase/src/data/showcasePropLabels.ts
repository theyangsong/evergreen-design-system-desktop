/**
 * Showcase 变量取值标签（eds-project.mdc §4.2）：中文 + 空格 + API literal。
 */

export type PropLabelRow<K extends string = string> = {
  key: K;
  label: string;
};

export const showcaseSizeLabels = {
  lg: '大 Lg',
  md: '中 Md',
  sm: '小 Sm',
  xs: '特小 Xs',
} as const;

export const showcaseLinkSizeLabels = {
  lg: '大 Lg',
  md: '中 Md',
  sm: '小 Sm',
} as const;

export const showcaseInputSizeLabels = {
  lg: '大 Lg',
  md: '中 Md',
  sm: '小 Sm',
} as const;

export const showcaseVariantLabels = {
  solid: '实心 Solid',
  outline: '描边 Outline',
  text: '文字 Text',
} as const;

export const showcaseButtonToneLabels = {
  brand: '品牌 Brand',
  danger: '危险 Danger',
  decor: '装饰 Decor',
  subtle: '浅 subtle',
  sameWhite: '同白 sameWhite',
} as const;

export const showcaseLinkToneLabels = {
  brand: '品牌 Brand',
  theme: '主题 Theme',
} as const;

export const showcasePaginationToneLabels = {
  decor: '装饰 Decor',
  brand: '品牌 Brand',
} as const;

export const showcaseIconShapeLabels = {
  rectangular: '矩形 rectangular',
  square: '方形 square',
  round: '圆形 round',
} as const;

export const showcasePaginationKindLabels = {
  number: '数字 number',
  symbol: '符号 symbol',
  button: '按钮 button',
} as const;

export const showcaseInputTypeLabels = {
  standard: '标准 standard',
  amount: '金额 amount',
} as const;

export const showcaseWidthModeLabels = {
  fixed: '固定 fixed',
  full: '全宽 full',
} as const;

export const showcaseButtonCustomizeFieldLabels = {
  tone: '色调 tone',
  variant: '风格 variant',
  size: '尺寸 size',
  disabled: '禁用 disabled',
  loading: '加载 loading',
  label: '文案 label',
  showIcon: '图标 showIcon',
  shape: '形状 shape',
  badge: '角标 badge',
  showBadge: '角标 showBadge',
  showReddot: '红点 showReddot',
  href: '链接 href',
  kind: '类型 kind',
  divider: '分隔线 divider',
  confirmLabel: '确认文案 confirmLabel',
  cancelLabel: '取消文案 cancelLabel',
  count: '按钮数 count',
  clear: 'Clear clear',
  direction: '方向 direction',
} as const;

export const showcaseInputCustomizeFieldLabels = {
  type: '输入类型 type',
  size: '尺寸 size',
  widthMode: '宽度 widthMode',
  fixedWidth: '固定宽度 fixedWidth',
  placeholder: '占位 placeholder',
  disabled: '禁用 disabled',
  readonly: '只读 readonly',
  unit: '单位 unit',
  clearable: '可清空 clearable',
  showMax: 'Max showMax',
  maxLabel: 'Max 文案 maxLabel',
  label: '标题 label',
  feedback: '反馈 feedback',
} as const;

export const showcaseDisabledLabel = '禁用 disabled';
export const showcaseLoadingLabel = '加载 loading';

export function propLabelRows<K extends string>(
  keys: readonly K[],
  labels: Record<K, string>,
): PropLabelRow<K>[] {
  return keys.map((key) => ({ key, label: labels[key] }));
}

export const buttonSizeRows = propLabelRows(
  ['lg', 'md', 'sm', 'xs'] as const,
  showcaseSizeLabels,
);

export const buttonVariantRows = propLabelRows(
  ['solid', 'outline', 'text'] as const,
  showcaseVariantLabels,
);

export const buttonToneRows = propLabelRows(
  ['brand', 'danger', 'decor', 'subtle', 'sameWhite'] as const,
  showcaseButtonToneLabels,
);

export const iconShapeRows = propLabelRows(
  ['rectangular', 'square', 'round'] as const,
  showcaseIconShapeLabels,
);

export const linkToneRows = propLabelRows(['brand', 'theme'] as const, showcaseLinkToneLabels);

export const linkSizeRows = propLabelRows(['lg', 'md', 'sm'] as const, showcaseLinkSizeLabels);

export const paginationKindRows = propLabelRows(
  ['number', 'symbol', 'button'] as const,
  showcasePaginationKindLabels,
);

export const paginationToneRows = propLabelRows(
  ['decor', 'brand'] as const,
  showcasePaginationToneLabels,
);

export const inputSizeRows = propLabelRows(['sm', 'md', 'lg'] as const, showcaseInputSizeLabels);

export const inputTypeRows = propLabelRows(
  ['standard', 'amount'] as const,
  showcaseInputTypeLabels,
);

/** EgButton 默认 size=lg */
export const buttonHeroPreviewLabel = showcaseSizeLabels.lg;

/** EgInput 默认 size=md */
export const inputHeroPreviewLabel = showcaseInputSizeLabels.md;
