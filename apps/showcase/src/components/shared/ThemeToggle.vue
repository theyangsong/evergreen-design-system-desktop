<script setup lang="ts">
import { EgButton } from '@eds/website-components';
import { useShowcaseContentTheme } from '@/composables/useShowcaseContentTheme';

const { theme, toggleTheme } = useShowcaseContentTheme();
</script>

<template>
  <EgButton
    tone="sameWhite"
    variant="outline"
    size="sm"
    @click="toggleTheme"
  >
    {{ theme === 'light' ? 'Dark' : 'Light' }}
  </EgButton>
</template>
