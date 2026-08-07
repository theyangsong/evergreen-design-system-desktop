/** Showcase 与文档示例统一使用的 Desktop 图标 name（与 SVG 文件名一致）。 */

/** 组件默认占位符号 */
export const showcaseDefaultIconName = 'eds-add' as const;

export const showcaseResetPreviewIconName = 'eds-arrow-refresh' as const;

export const showcasePaginationSymbolIconName = 'eds-arrow-left-mini-ios' as const;

export const showcasePaginationButtonIconName = 'eds-arrow-right' as const;

export const showcasePaginationBorderArrowIconName = 'eds-arrow-left' as const;

export function showcaseEgIconSnippet(
  name: string,
  options?: { fit?: boolean; size?: 'sm' | 'md' | 'lg' },
): string {
  const attrs = [`name="${name}"`];
  if (options?.fit) attrs.push('fit');
  if (options?.size) attrs.push(`size="${options.size}"`);
  return `<EgIcon ${attrs.join(' ')} />`;
}

export const showcasePlusIconSnippet = showcaseEgIconSnippet(showcaseDefaultIconName, {
  fit: true,
});

export const showcaseChevronIconSnippet = showcaseEgIconSnippet(
  showcasePaginationSymbolIconName,
  { fit: true },
);

export const showcaseArrowIconSnippet = showcaseEgIconSnippet(
  showcasePaginationButtonIconName,
  { fit: true },
);

export const showcaseBorderArrowIconSnippet = showcaseEgIconSnippet(
  showcasePaginationBorderArrowIconName,
  { fit: true },
);
