<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { DocMetaField } from '@/config/navigation';
import DocMetaPanel from '@/components/DocMetaPanel/DocMetaPanel.vue';
import { getDocScrollContainer } from '@/utils/scrollToSection';
import styles from './DocPageCommon.module.css';

defineProps<{
  title: string;
  meta?: DocMetaField[];
}>();

const isScrolled = ref(false);
let scrollContainer: HTMLElement | null = null;

function updateScrolled() {
  isScrolled.value = (scrollContainer?.scrollTop ?? 0) > 4;
}

function bindScrollContainer() {
  scrollContainer?.removeEventListener('scroll', updateScrolled);
  scrollContainer = getDocScrollContainer();
  updateScrolled();
  scrollContainer?.addEventListener('scroll', updateScrolled, { passive: true });
}

onMounted(() => {
  bindScrollContainer();
});

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener('scroll', updateScrolled);
});
</script>

<template>
  <h1 :class="[styles.pageTitle, isScrolled && styles.pageTitleScrolled]">
    <span :class="styles.pageTitleLabel">EVERGREEN DESIGN SYSTEM</span>
    <span :class="styles.pageTitleText">{{ title }}</span>
  </h1>

  <div v-if="meta?.length" :class="styles.intro">
    <DocMetaPanel :fields="meta" />
  </div>
</template>
