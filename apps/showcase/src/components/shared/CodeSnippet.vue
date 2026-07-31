<script setup lang="ts">
import { computed } from 'vue';
import { highlightCode, type CodeLanguage } from '@/utils/highlightCode';
import styles from './CodeSnippet.module.css';

const props = withDefaults(
  defineProps<{
    code: string;
    language?: CodeLanguage;
  }>(),
  {
    language: 'xml',
  },
);

const highlighted = computed(() => highlightCode(props.code, props.language));
</script>

<template>
  <pre :class="styles.hljsFence"><code class="hljs" v-html="highlighted" /></pre>
</template>
