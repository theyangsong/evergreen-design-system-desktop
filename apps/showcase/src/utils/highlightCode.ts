import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export type CodeLanguage = 'typescript' | 'javascript' | 'xml';

export function highlightCode(text: string, language: CodeLanguage = 'xml'): string {
  if (hljs.getLanguage(language)) {
    return hljs.highlight(text, { language }).value;
  }

  return hljs.highlightAuto(text).value;
}
