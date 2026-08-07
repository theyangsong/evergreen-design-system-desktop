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
  typographySemantic: Record<string, string>,
  typographyBase: Record<string, string>,
): string {
  const match = value.match(/^var\(--([^)]+)\)$/);
  if (!match) return value;
  const tokenName = match[1];
  const resolved = typographySemantic[tokenName] ?? typographyBase[tokenName];
  if (!resolved) return value;
  return resolveTypographyToken(resolved, typographySemantic, typographyBase);
}

export function formatTextStyleMetrics(
  style: { 'font-size': string; 'line-height': string },
  typographySemantic: Record<string, string>,
  typographyBase: Record<string, string>,
): string {
  const size = resolveTypographyToken(style['font-size'], typographySemantic, typographyBase);
  const lineHeight = resolveTypographyToken(style['line-height'], typographySemantic, typographyBase);
  return `${size} / ${lineHeight}`;
}

export function formatEffectSemantic(value: Record<string, string>): string {
  return Object.entries(value)
    .map(([property, val]) => `${property}: ${val}`)
    .join('; ');
}
