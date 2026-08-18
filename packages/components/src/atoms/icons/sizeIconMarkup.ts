/** Desktop icon 源稿 viewBox 边长（32×32 artboard）。 */
export const ICON_VIEWBOX_SIZE = 32;

/** 与 --stroke-lg 一致：屏上目标描边宽度（px）。 */
export const ICON_SCREEN_STROKE_PX = 1.4;

const STROKE_SHAPE = /<(path|line|circle|rect|polyline|polygon)\b([^>]*?)(\/?)>/gi;

/** 32 viewBox 缩到 displayPx 时，使屏上描边恒为 1.4px 的 user-space 宽度。 */
export function strokeWidthForDisplayPx(displayPx: number): number {
  return (ICON_SCREEN_STROKE_PX * ICON_VIEWBOX_SIZE) / displayPx;
}

/**
 * 对齐 eds-doc `renderIconHtml`：SVG 写显式 width/height，描边走 attribute（非 CSS / 非 vector-effect）。
 */
export function sizeIconMarkup(markup: string, displayPx: number, tokenStroke: boolean): string {
  if (displayPx <= 0) return markup;

  let svg = applySvgSize(markup, displayPx);

  if (!tokenStroke) return svg;

  const strokeUser = strokeWidthForDisplayPx(displayPx);
  const strokeWidthAttr = formatStrokeWidth(strokeUser);

  svg = svg.replace(STROKE_SHAPE, (match, tag: string, attrs: string, selfClose: string) => {
    if (!shapeHasStroke(tag, attrs)) return match;
    let next = attrs.replace(/\sstyle="[^"]*"/gi, '');
    next = next.replace(/\sstroke="[^"]*"/gi, '');
    next = next.replace(/\sstroke-width="[^"]*"/gi, '');
    next = `${next} stroke="currentColor" stroke-width="${strokeWidthAttr}"`;
    return `<${tag}${next}${selfClose}>`;
  });

  return svg;
}

function applySvgSize(svg: string, size: number): string {
  const openMatch = svg.match(/<svg\b[^>]*>/i);
  if (!openMatch) return svg;

  const openTag = openMatch[0];
  let attrs = openTag.slice(4, -1).trim(); // drop "<svg" and ">"
  attrs = attrs.replace(/\swidth="[^"]*"/gi, '');
  attrs = attrs.replace(/\sheight="[^"]*"/gi, '');
  const nextOpen = attrs ? `<svg ${attrs} width="${size}" height="${size}">` : `<svg width="${size}" height="${size}">`;

  return svg.replace(openTag, nextOpen);
}

function shapeHasStroke(tag: string, attrs: string): boolean {
  if (tag === 'line' || tag === 'polyline') return true;
  return /stroke-width=/i.test(attrs) || /\bclass="[^"]*eds-i-s/i.test(attrs);
}

function formatStrokeWidth(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
