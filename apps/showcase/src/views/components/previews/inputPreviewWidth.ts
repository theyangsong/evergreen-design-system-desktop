/** Showcase：width-mode=fixed 时由使用方指定根节点宽度（非 EgInput prop）。 */

const FIXED_WIDTH_UNIT_SUFFIX = /(px|%|rem|em|ch|vw|vh|vmin|vmax)$/i;

export function normalizeFixedWidth(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (FIXED_WIDTH_UNIT_SUFFIX.test(trimmed)) {
    return trimmed;
  }
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}px`;
  }
  return trimmed;
}

export function previewFixedWidthStyle(
  widthMode: unknown,
  fixedWidth: unknown,
): Record<string, string> | undefined {
  if (widthMode !== 'fixed') return undefined;
  const width = normalizeFixedWidth(String(fixedWidth ?? ''));
  if (!width) return undefined;
  return { width };
}

function indentSnippet(snippet: string, spaces = 2): string {
  const pad = ' '.repeat(spaces);
  return snippet
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n');
}

export function wrapUsageSnippetWithWidth(snippet: string, width: string): string {
  const safeWidth = width.replace(/"/g, '\\"');
  return `<div style="width: ${safeWidth}">\n${indentSnippet(snippet)}\n</div>`;
}

export function buildWidthModeUsageSnippet(
  tag: string,
  state: Record<string, unknown>,
  options: {
    defaults?: Record<string, unknown>;
    vModel?: string;
    omitKeys?: string[];
  },
  buildSnippet: (
    tag: string,
    props: Record<string, unknown>,
    opts?: { vModel?: string; defaults?: Record<string, unknown>; omitKeys?: string[] },
  ) => string,
): string {
  const omitKeys = options.omitKeys ?? ['fixedWidth'];
  const snippet = buildSnippet(tag, state, {
    vModel: options.vModel,
    defaults: options.defaults,
    omitKeys,
  });

  if (state.widthMode === 'fixed') {
    const width = normalizeFixedWidth(String(state.fixedWidth ?? ''));
    if (width) {
      return wrapUsageSnippetWithWidth(snippet, width);
    }
  }

  return snippet;
}
