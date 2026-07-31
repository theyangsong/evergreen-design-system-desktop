<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import styles from './PageHeader.module.css';

defineProps<{
  title: string;
  lead?: string;
}>();

const isScrolled = ref(false);

function updateScrolled() {
  isScrolled.value = window.scrollY > 4;
}

onMounted(() => {
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrolled);
});
</script>

<template>
  <header :class="[styles.header, isScrolled && styles.headerScrolled]">
    <h1 :class="styles.title">{{ title }}</h1>
    <p v-if="lead" :class="styles.lead">{{ lead }}</p>
  </header>
</template>
