import { COPIED_ICON_SVG, COPY_ICON_SVG } from './renderMarkdown';

export function useDocMarkdownCopy() {
  async function handleMarkdownBodyClick(event: MouseEvent) {
    const copyButton = (event.target as HTMLElement).closest('[data-code-copy]');
    if (!(copyButton instanceof HTMLButtonElement)) {
      return;
    }

    const code = copyButton.closest('.docs-code-block')?.querySelector('code');
    const text = code?.textContent;
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      copyButton.classList.add('docs-code-copy--copied');
      copyButton.innerHTML = COPIED_ICON_SVG;
      copyButton.setAttribute('aria-label', '已复制');
      window.setTimeout(() => {
        copyButton.classList.remove('docs-code-copy--copied');
        copyButton.innerHTML = COPY_ICON_SVG;
        copyButton.setAttribute('aria-label', '复制代码');
      }, 2000);
    } catch {
      copyButton.setAttribute('aria-label', '复制失败');
      window.setTimeout(() => {
        copyButton.setAttribute('aria-label', '复制代码');
      }, 2000);
    }
  }

  return { handleMarkdownBodyClick };
}
