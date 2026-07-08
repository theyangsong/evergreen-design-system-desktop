import { marked, Renderer, type Tokens } from 'marked';

export type MarkdownSectionIds = Record<string, string>;

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

function plainHeadingText(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

function normalizeSectionTitle(text: string): string {
  return text.replace(/^\d+\.\s*/, '').trim();
}

function preprocessMarkdown(markdown: string): string {
  return markdown.replace(/^!(.+)$/gm, (_, filename: string) => {
    const trimmed = filename.trim();
    return `![${trimmed}](/docs/color-system/${trimmed})`;
  });
}

function resolveHeadingId(
  plain: string,
  sectionIdsByTitle: MarkdownSectionIds,
): string {
  const normalized = normalizeSectionTitle(plain);
  return (
    sectionIdsByTitle[normalized] ??
    sectionIdsByTitle[plain] ??
    slugifyHeading(normalized || plain)
  );
}

export function renderMarkdown(
  markdown: string,
  sectionIdsByTitle: MarkdownSectionIds = {},
): string {
  if (!markdown.trim()) {
    return '';
  }

  class DocRenderer extends Renderer {
    heading({ tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens);
      const plain = plainHeadingText(text);
      const id = resolveHeadingId(plain, sectionIdsByTitle);
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
  }

  return marked.parse(preprocessMarkdown(markdown), {
    async: false,
    gfm: true,
    breaks: false,
    renderer: new DocRenderer(),
  });
}
