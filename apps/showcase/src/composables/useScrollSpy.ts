import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';

const DEFAULT_SCROLL_OFFSET = 80;

function getScrollTop(): number {
  return window.scrollY || document.documentElement.scrollTop;
}

function readScrollOffset(sectionIds: string[]): number {
  for (const id of sectionIds) {
    const element = document.getElementById(id);
    if (!element) {
      continue;
    }

    const marginTop = Number.parseFloat(getComputedStyle(element).scrollMarginTop);
    if (Number.isFinite(marginTop) && marginTop > 0) {
      return marginTop;
    }
  }

  return DEFAULT_SCROLL_OFFSET;
}

function isScrollAtBottom(): boolean {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;
  const maxScroll = scrollHeight - clientHeight;

  if (maxScroll <= 1) {
    return true;
  }

  return maxScroll - getScrollTop() <= Math.max(64, Math.round(maxScroll * 0.05));
}

function resolveTailActiveId(ids: string[], scrollOffset: number): string {
  for (let index = ids.length - 1; index >= 0; index -= 1) {
    const element = document.getElementById(ids[index]);
    if (!element) {
      continue;
    }

    const rect = element.getBoundingClientRect();
    if (rect.top <= scrollOffset + 1 || rect.top <= window.innerHeight) {
      return ids[index];
    }
  }

  return ids[ids.length - 1] ?? '';
}

export function useScrollSpy(sectionIds: Ref<string[]> | ComputedRef<string[]>) {
  const activeId = ref('');
  let observer: IntersectionObserver | null = null;
  let scrollOffset = DEFAULT_SCROLL_OFFSET;

  function computeActiveId(): string {
    const ids = sectionIds.value.filter(Boolean);
    if (!ids.length) {
      return '';
    }

    if (isScrollAtBottom()) {
      return resolveTailActiveId(ids, scrollOffset);
    }

    let current = ids[0];
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element && element.getBoundingClientRect().top <= scrollOffset + 1) {
        current = id;
      }
    }

    return current;
  }

  function applyActiveId() {
    const nextId = computeActiveId();
    if (activeId.value !== nextId) {
      activeId.value = nextId;
    }
  }

  function setupIntersectionObserver() {
    observer?.disconnect();
    observer = null;

    observer = new IntersectionObserver(
      () => {
        applyActiveId();
      },
      {
        root: null,
        rootMargin: `-${scrollOffset}px 0px -60% 0px`,
        threshold: [0, 0.01, 0.25, 0.5, 1],
      },
    );

    for (const id of sectionIds.value) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }
  }

  async function refresh() {
    await nextTick();
    requestAnimationFrame(() => {
      scrollOffset = readScrollOffset(sectionIds.value);
      setupIntersectionObserver();
      applyActiveId();
    });
  }

  let onResize: (() => void) | undefined;

  onMounted(() => {
    onResize = () => {
      scrollOffset = readScrollOffset(sectionIds.value);
      applyActiveId();
    };

    void refresh();
    window.addEventListener('scroll', applyActiveId, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
  });

  watch(sectionIds, () => {
    void refresh();
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    window.removeEventListener('scroll', applyActiveId);
    if (onResize) {
      window.removeEventListener('resize', onResize);
    }
  });

  function resetActive() {
    activeId.value = '';
  }

  return { activeId, resetActive, refresh };
}
