<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import styles from './PageHeader.module.css';

defineProps<{
  title: string;
  lead?: string;
}>();

const headerRef = ref<HTMLElement | null>(null);
const isScrolled = ref(false);
let resizeObserver: ResizeObserver | null = null;

function updateScrolled() {
  isScrolled.value = window.scrollY > 4;
}

/** 供 compact 文档预览 sticky：页头真实高度 + 页头与内容间距。 */
function syncStickyHeaderHeight() {
  const header = headerRef.value;
  const page = header?.parentElement;
  if (!header || !page) return;
  page.style.setProperty('--showcase-sticky-header-height', `${header.offsetHeight}px`);
}

function clearStickyHeaderHeight() {
  headerRef.value?.parentElement?.style.removeProperty('--showcase-sticky-header-height');
}

onMounted(async () => {
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { passive: true });

  await nextTick();
  syncStickyHeaderHeight();
  if (headerRef.value) {
    resizeObserver = new ResizeObserver(() => syncStickyHeaderHeight());
    resizeObserver.observe(headerRef.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrolled);
  resizeObserver?.disconnect();
  clearStickyHeaderHeight();
});
</script>

<template>
  <header
    ref="headerRef"
    :class="[styles.header, isScrolled && styles.headerScrolled]"
  >
    <h1 :class="styles.title">{{ title }}</h1>
    <p v-if="lead" :class="styles.lead">{{ lead }}</p>
    <div v-if="$slots.afterLead" :class="styles.afterLead">
      <slot name="afterLead" />
    </div>
  </header>
</template>
