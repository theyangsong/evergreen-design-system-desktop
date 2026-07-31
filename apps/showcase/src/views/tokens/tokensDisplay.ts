export type TokenRow = { name: string; value: string };

export type ThemeTokenRow = { name: string; light: string; dark: string };

export function entriesToRows(record: Record<string, string>): TokenRow[] {
  return Object.entries(record).map(([name, value]) => ({ name, value }));
}

export function formatStyleLabel(key: string): string {
  return key
    .replace(/^typography-/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveTypographyToken(
  value: string,
  typographyBase: Record<string, string>,
): string {
  const match = value.match(/^var\(--([^)]+)\)$/);
  if (!match) return value;
  const resolved = typographyBase[match[1]];
  if (!resolved) return value;
  return resolveTypographyToken(resolved, typographyBase);
}

export function formatTextStyleMetrics(
  key: string,
  typographySemantic: Record<string, string>,
  typographyBase: Record<string, string>,
): string {
  const sizeRaw = typographySemantic[`${key}-size`] ?? '';
  const lineHeightRaw = typographySemantic[`${key}-line-height`] ?? '';
  const size = sizeRaw ? resolveTypographyToken(sizeRaw, typographyBase) : '';
  const lineHeight = lineHeightRaw
    ? resolveTypographyToken(lineHeightRaw, typographyBase)
    : '';
  return `${size} / ${lineHeight}`;
}

export function formatEffectSemantic(value: Record<string, string>): string {
  return Object.entries(value)
    .map(([property, val]) => `${property}: ${val}`)
    .join('; ');
}
